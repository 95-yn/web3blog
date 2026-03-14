# 用 Puppeteer + Node 做证书截图服务

考试证书一般长这样：**一张固定背景图 + 在指定位置渲染姓名、成绩、日期等信息**。前端用 HTML/CSS 很容易实现「背景图 + 定位」的排版，但若直接在前端渲染，用户设备各异（字体缺失、缩放、分辨率、浏览器差异等）可能导致**文字位置错乱**，影响证书观感和打印效果。因此业务上往往需要的是**一张图片**——用于下载、打印、存档或推送，由服务端统一渲染以保证版式一致。这时就需要在服务端把「证书页」渲染成图，Puppeteer + Node 正好可以做成一套**异步截图服务**：证书页按背景图 + 定位正常渲染，服务只负责打开页面、等渲染完成、截图并返回图片。

本文记录一种实现思路：**Node 常驻进程 + Puppeteer 异步截图**，证书渲染时直接产出图片。

---

## 一、场景与需求

- **证书形态**：背景图（底图）+ 在固定坐标/区域里写姓名、分数、日期等。
- **技术实现**：证书用 HTML 页面描述（背景图 + 绝对定位或 flex 布局），便于改版和复用。
- **最终产出**：需要的是**图片**（如 PNG/JPEG），不是 HTML 页面——用于下载、打印、存证、消息推送等。
- **服务形态**：提供一个 HTTP 接口或内部调用，传入证书数据（姓名、成绩等），返回一张渲染好的证书图片。

因此需要：**在 Node 里用 Puppeteer 打开证书页，等 DOM 和图片都渲染完，再截图并返回 Buffer/Stream**。

---

## 二、整体架构

- **Node 服务**：常驻进程，提供截图 API（例如 `POST /cert/screenshot`，body 里是证书数据）。
- **证书模板**：一个或多个 HTML 页面（或服务端根据模板 + 数据生成 HTML），页面内是「背景图 + 定位好的占位元素」。
- **Puppeteer**：启动浏览器（可 headless），打开证书页，等待网络空闲或关键节点出现后执行 `page.screenshot()`，得到图片 Buffer。
- **返回**：把 Buffer 写进响应流，或先存成文件再返回 URL，按你们现有存储方案来。

这样「渲染证书」就变成：**调一次截图接口 → 拿到图片**，前端或其它服务直接渲染/展示这张图即可。

---

## 三、证书页（背景图 + 定位）

证书页就是一个普通 HTML 页，用 CSS 把背景图铺满，文字放在固定位置。示例结构：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      .cert {
        width: 800px;
        height: 600px;
        background: url("/path/to/cert-bg.png") no-repeat center/100% 100%;
        position: relative;
      }
      .name {
        position: absolute;
        left: 200px;
        top: 240px;
        font-size: 24px;
      }
      .score {
        position: absolute;
        right: 180px;
        top: 240px;
        font-size: 24px;
      }
      .date {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
      }
    </style>
  </head>
  <body>
    <div class="cert">
      <span class="name" id="name"></span>
      <span class="score" id="score"></span>
      <span class="date" id="date"></span>
    </div>
  </body>
</html>
```

- 数据注入方式可以是：
  - 服务端根据模板 + 数据拼出完整 HTML，再让 Puppeteer 打开 `data:` URL 或临时 HTML 文件；或
  - 证书页是固定 URL，通过 query 或 postData 把数据传进去，页面内 JS 取参数并填到 `#name`、`#score`、`#date` 等。

只要最终在浏览器里是「背景图 + 定位渲染」即可，Puppeteer 只关心「打开 → 等稳 → 截图」。

---

## 四、Node + Puppeteer 截图核心流程

1. **启动浏览器**：建议只起一个 `browser` 实例复用，避免每次请求都 launch 一次。
2. **新开页面**：每次截图用 `browser.newPage()`，用完 `page.close()`。
3. **打开证书页**：`page.goto(url)` 或 `page.setContent(html)`，url 可以是内网证书模板地址，html 可以是上面拼好的完整 HTML。
4. **等待渲染完成**：
   - 背景图、字体等若都是静态资源，可用 `page.goto(url, { waitUntil: 'networkidle0' })` 或 `networkidle2`；
   - 若有动态填写的 DOM，可在证书页里在数据填完后打一个标记（如 `document.body.dataset.ready = '1'`），然后 `page.waitForSelector('[data-ready="1"]', { timeout: 5000 })`，再截图。
5. **截图**：`const buf = await page.screenshot({ type: 'png', fullPage: false })`，如需只截证书区域可用 `clip` 或固定 viewport。
6. **返回图片**：把 `buf` 写入 HTTP 响应，或上传到 OSS 后返回 URL。

示例（Express 风格，仅表达流程）：

```js
const puppeteer = require("puppeteer");

let browser;
async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
  return browser;
}

async function captureCert(data) {
  const b = await getBrowser();
  const page = await b.newPage();
  try {
    await page.setViewport({ width: 800, height: 600 });
    // 假设证书模板地址带 query，或你改成 setContent(html)
    await page.goto(
      `http://localhost:3000/cert-template?name=${encodeURIComponent(data.name)}&score=${data.score}&date=${data.date}`,
      {
        waitUntil: "networkidle0",
      },
    );
    await page.waitForSelector("[data-cert-ready]", { timeout: 5000 });
    const buf = await page.screenshot({ type: "png" });
    return buf;
  } finally {
    await page.close();
  }
}

// POST /cert/screenshot -> 返回 PNG 图片
app.post("/cert/screenshot", async (req, res) => {
  try {
    const buf = await captureCert(req.body);
    res.set("Content-Type", "image/png");
    res.send(buf);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

证书页在数据填完后执行 `document.body.setAttribute('data-cert-ready', '1')`，方便上面 `waitForSelector` 收口。

---

## 五、异步与并发注意点

- **单实例单 browser**：多请求并发时共用同一个 browser，多个 `newPage()` 并行没问题，但要控制「同时打开的 page 数量」，避免内存爆掉。
- **超时**：`goto`、`waitForSelector`、`screenshot` 都建议带 `timeout`，失败时 `page.close()` 并返回 5xx 或 4xx。
- **失败回收**：某个请求超时或异常时，确保 `page.close()` 被调用（如上面的 `try/finally`），否则容易泄漏。

这样就是一个「异步截图服务」：多个证书请求排队或有限并发，最终都得到一张图。

---

## 六、小结

- 证书用 **背景图 + 定位** 在 HTML 里渲染，便于维护和改版。
- **Node + Puppeteer** 常驻进程，提供截图 API；每次请求新开 page，打开证书页，等渲染完成后截图，返回图片。
- 渲染证书时**直接使用这张图片**（下载、打印、推送、列表展示均可），无需再在前端拼 HTML。
