#

文章发表在[掘金](https://juejin.cn/post/7570904968678440987)

# 如何系统性地完成前端性能优化

## 开篇

性能优化，一个老生常谈却永不过时的话题。

无论是面试中的高频考点，还是实际项目中的技术攻坚，我们总能听到各种零散的优化技巧。然而，**当真正面对一个性能糟糕的项目时，我们却往往不知从何下手**——是先优化图片？还是先做代码分割？哪些优化手段 ROI 最高？如何衡量优化效果？

这篇文章将结合多年的实践经验，**系统性地梳理性能优化的方法论**，建立一套完整的性能优化思维框架，从"知道很多招式"到"能打一套组合拳"。

---

## 从哪些角度去做性能优化

既然提到优化，**一定是指标先行，数据驱动**。没有基线数据的优化都是耍流氓，没有度量标准的优化无法证明价值。

我们先看下 Google 提出的 [Web Vitals 核心指标](https://web.dev/articles/vitals?hl=zh-cn)，这是业界公认的用户体验度量标准：

![Web Vitals核心指标](/images/web-vitals-core-metrics.webp)

**通常我们说的"性能有问题"，本质上可以归纳为三大类型，分别对应 Core Web Vitals 的三个核心指标。理解这三个指标，就能精准定位问题根源：**

---

### 一、首屏渲染慢 - LCP/FCP 指标异常

**症状表现**：用户打开页面后长时间白屏或内容加载缓慢

**指标定义**：

- **LCP (Largest Contentful Paint)**：最大内容绘制时间，衡量主要内容何时加载完成
  - 优秀：< 2.5s
  - 需改进：2.5s - 4s
  - 差：> 4s

- **FCP (First Contentful Paint)**：首次内容绘制时间，衡量首个内容何时渲染
  - 优秀：< 1.8s
  - 需改进：1.8s - 3s
  - 差：> 3s

**诊断流程**：

首屏渲染慢时，LCP 指标通常不达标。我们需要**建立诊断决策树**，逐层排查：

#### 场景 1：FCP 达标但 LCP 未达标

这说明**首屏骨架渲染正常，但关键内容加载慢**，问题通常出在：

![FCP达标LCP未达标](/images/fcp-ok-lcp-fail.webp)

**核心问题点**：

- **关键资源加载慢**
  - 🔍 检查：LCP 元素（通常是头图、轮播图）的加载时间
  - ✅ 方案：
    - 图片压缩（使用 WebP/AVIF 格式，压缩率提升 30-50%）
    - 使用 `<img>` 的 `fetchpriority="high"` 提升加载优先级
    - 响应式图片（`srcset` + `sizes`）根据设备加载合适尺寸
    - CDN 加速，就近访问降低 TTFB

- **渲染阻塞资源过多**
  - 🔍 检查：Network 瀑布图中阻塞渲染的 CSS/JS
  - ✅ 方案：
    - 内联关键 CSS（Critical CSS）到 `<head>`
    - 非关键 CSS 使用 `media` 或 `preload` 异步加载
    - JavaScript 使用 `defer` 或 `async` 属性
    - 代码分割，首屏只加载必需代码

- **服务端响应慢**
  - 🔍 检查：TTFB (Time to First Byte) > 600ms
  - ✅ 方案：
    - SSR/SSG 预渲染，直出 HTML
    - 服务端缓存（Redis/CDN）
    - 数据库查询优化、索引优化
    - 升级服务器配置或使用边缘计算

- **客户端渲染耗时过长**
  - 🔍 检查：Performance 面板中 JS 执行时间过长
  - ✅ 方案：
    - React 使用 Suspense + lazy() 懒加载组件
    - 减少首屏组件复杂度
    - 优化 hydration 性能（使用 Partial Hydration）

#### 场景 2：FCP 和 LCP 均未达标

这说明**整个页面加载链路都存在问题**，需要全面优化：

![FCP和LCP均未达标](/images/fcp-lcp-both-fail.webp)

**核心问题点**：

- **网络层面**
  - 🔍 检查：Network 瀑布图，关注 DNS 查询、TCP 连接、SSL 握手时间
  - ✅ 方案：
    - 使用 `dns-prefetch` 和 `preconnect` 预建连接
    - 开启 HTTP/2 或 HTTP/3，支持多路复用
    - 启用 Gzip/Brotli 压缩（文本资源压缩率 70-80%）
    - 配置强缓存和协商缓存策略

- **资源体积过大**
  - 🔍 检查：首屏加载资源总大小 > 1MB (gzipped)
  - ✅ 方案：
    - JavaScript Bundle 分析（webpack-bundle-analyzer）
    - Tree Shaking 去除无用代码
    - 第三方库按需引入（如 lodash-es、antd 的 babel-plugin-import）
    - 移除重复依赖（使用 pnpm 或配置 Webpack alias）

- **资源加载时序混乱**
  - 🔍 检查：关键资源未优先加载
  - ✅ 方案：
    - 使用 `<link rel="preload">` 预加载关键资源
    - 调整资源加载顺序（CSS 在前，JS 在后）
    - 使用 Resource Hints（prefetch/prerender）

- **渲染阻塞严重**
  - 🔍 检查：白屏时间过长
  - ✅ 方案：
    - 骨架屏（Skeleton Screen）提升感知性能
    - 内联关键路径 CSS
    - 延迟非关键脚本执行

**通过建立这套系统化的诊断流程**，我们可以精准定位首屏性能的卡点，避免盲目优化。重要的是**先测量、再优化、后验证**，每一步都有数据支撑。

---

### 二、交互存在卡顿 - INP 指标异常

**症状表现**：点击按钮无响应、滚动卡顿、输入延迟、动画掉帧

**指标定义**：

- **INP (Interaction to Next Paint)**：交互到下次绘制的时间，取页面所有交互的 P98 值
  - 优秀：< 200ms
  - 需改进：200ms - 500ms
  - 差：> 500ms

**核心理解**：
INP 不同于已废弃的 FID（只关注首次交互），它**评估整个页面生命周期内的所有交互响应性**，更能反映真实的用户体验。

INP 包含三个阶段：

1.  **Input Delay（输入延迟）**：从用户操作到事件处理开始的时间
2.  **Processing Time（处理时间）**：事件处理函数的执行时间
3.  **Presentation Delay（呈现延迟）**：从处理完成到屏幕更新的时间

**诊断方法**：

使用 Chrome DevTools Performance 面板录制交互过程，查看：

- **Long Tasks**（长任务）：执行时间 > 50ms 的任务会阻塞主线程
- **Event Timing**：具体事件的各阶段耗时
- **Frame Timing**：帧率是否低于 60 FPS

**根因分析与解决方案**：

#### 问题 1：主线程被长任务阻塞

**现象**：Input Delay > 100ms，点击后明显延迟才开始处理

**根因**：主线程执行耗时任务，无法及时响应用户输入

**解决方案**：

```javascript
// ❌ 错误：同步执行大量计算，阻塞主线程
function handleClick() {
  const result = complexCalculation(largeData); // 阻塞 500ms
  updateUI(result);
}

// ✅ 方案 1：任务分片使用scheduler
async function handleClick() {
  const result = await optimalScheduling(largeData);
  updateUI(result);
}

async function optimalScheduling(data) {
  const startTime = performance.now();

  for (let i = 0; i < data.length; i += 100) {
    // 使用 postTask 添加任务调度
    await scheduler.postTask(
      () => {
        processChunk(data.slice(i, i + 100));
      },
      { priority: "background" },
    );

    // 使用 isInputPending 判断是否需要让出主线程
    if (
      navigator.scheduling.isInputPending() ||
      performance.now() - startTime > 50
    ) {
      // 使用 yield 让出主线程
      await scheduler.yield();
      startTime = performance.now();
    }
  }
}

// ✅ 方案 2：Web Worker（适合 CPU 密集型任务）
const worker = new Worker("calculator.worker.js");

function handleClick() {
  worker.postMessage({ type: "CALCULATE", data: largeData });

  worker.onmessage = (e) => {
    updateUI(e.data.result);
  };
}

// ✅ 方案 3：requestIdleCallback（适合非紧急任务）
function handleClick() {
  // 紧急任务立即执行
  showLoadingState();

  // 非紧急任务在浏览器空闲时执行
  requestIdleCallback((deadline) => {
    while (deadline.timeRemaining() > 0 && hasMoreWork()) {
      doWork();
    }
  });
}
```

#### 问题 2：事件处理函数逻辑过于复杂

**现象**：Processing Time > 100ms，事件处理耗时过长

**根因**：单个事件处理函数中包含复杂的业务逻辑、大量 DOM 操作

**解决方案**：

```javascript
// ❌ 错误：在事件处理中做大量 DOM 操作
function handleScroll() {
  const items = document.querySelectorAll(".item");
  items.forEach((item) => {
    const rect = item.getBoundingClientRect(); // 强制同步布局
    if (rect.top < window.innerHeight) {
      item.classList.add("visible"); // 触发重排
    }
  });
}

// ✅ 方案 1：防抖/节流
const handleScroll = throttle(() => {
  updateVisibleItems();
}, 16); // 约 60fps

// ✅ 方案 2：使用 Intersection Observer（更高效）
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // 观察一次即可
      }
    });
  },
  { rootMargin: "50px" },
);

document.querySelectorAll(".item").forEach((item) => observer.observe(item));

// ✅ 方案 3：批量 DOM 操作
function updateMultipleElements(updates) {
  // 使用 DocumentFragment 减少重排次数
  const fragment = document.createDocumentFragment();

  updates.forEach((update) => {
    const element = document.createElement("div");
    element.textContent = update.text;
    fragment.appendChild(element);
  });

  container.appendChild(fragment); // 只触发一次重排
}
```

#### 问题 3：DOM 规模过大或渲染流水线复杂

**现象**：Presentation Delay > 100ms，视觉更新延迟明显

**根因**：

- DOM 节点数量过多（> 1500 个）
- 复杂的 CSS 选择器
- 强制同步布局（Layout Thrashing）
- 大量重排重绘

**解决方案**：

```javascript
// ✅ 方案 1：虚拟滚动（Virtual Scroll）
// 只渲染可视区域内的 DOM 节点
function VirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);

  const visibleItems = items.slice(visibleStart, visibleEnd + 1);
  const offsetY = visibleStart * itemHeight;

  return (
    <div style={{ height: containerHeight, overflow: 'auto' }} onScroll={e => setScrollTop(e.target.scrollTop)}>
      <div style={{ height: items.length * itemHeight }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} style={{ height: itemHeight }}>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ✅ 方案 2：简化 DOM 结构
// 减少嵌套层级，避免过度包装
// ❌ 7 层嵌套
<div><div><div><div><div><div><span>Text</span></div></div></div></div></div></div>

// ✅ 2 层嵌套
<div><span>Text</span></div>

// ✅ 方案 3：避免强制同步布局
// ❌ 错误：读写交替导致 Layout Thrashing
elements.forEach(el => {
  const height = el.offsetHeight; // 读取布局
  el.style.height = height * 2 + 'px'; // 修改样式
  // 浏览器被迫立即重新计算布局
});

// ✅ 正确：读写分离
const heights = elements.map(el => el.offsetHeight); // 批量读取
elements.forEach((el, i) => {
  el.style.height = heights[i] * 2 + 'px'; // 批量写入
});

// ✅ 方案 4：使用 CSS containment 优化渲染范围
.item {
  contain: layout style paint;
  /* 告诉浏览器：这个元素的变化不会影响外部 */
}

// ✅ 方案 5：使用 transform/opacity 做动画（触发合成层）
// ❌ 错误：触发重排
.box {
  transition: top 0.3s;
}
.box:hover {
  top: 10px;
}

// ✅ 正确：只触发合成
.box {
  transition: transform 0.3s;
}
.box:hover {
  transform: translateY(10px);
}
```

**高级技巧**：

```javascript
// 使用 scheduler（React 18+ 的并发特性）
import { startTransition } from "react";

function handleInput(value) {
  // 紧急更新：立即响应用户输入
  setInputValue(value);

  // 非紧急更新：可以延迟执行
  startTransition(() => {
    setSearchResults(filterResults(value));
  });
}
```

**通过系统化地排查和优化这三个阶段**，可以显著提升页面的交互响应性，让用户感受到"丝滑"的操作体验。

---

### 三、页面布局不稳定 - CLS 指标异常

**症状表现**：页面内容突然偏移、点击按钮时按钮位置发生变化、广告加载导致内容跳动

**指标定义**：

- **CLS (Cumulative Layout Shift)**：累积布局偏移分数，衡量视觉稳定性
  - 优秀：< 0.1
  - 需改进：0.1 - 0.25
  - 差：> 0.25

**CLS 计算公式**：

    CLS = 影响分数 × 距离分数

- **影响分数**：元素在两帧之间移动的可见区域占比
- **距离分数**：元素移动的最大距离占视口的百分比

**常见原因**：

1.  **图片/视频未设置尺寸**
2.  **动态注入内容（广告、横幅）**
3.  **Web 字体加载导致文本闪烁（FOIT/FOUT）**
4.  **等待 API 响应后才确定内容高度**

**解决方案**：

```html
<!-- ❌ 错误：未指定图片尺寸 -->
<img src="hero.jpg" alt="Hero Image" />
<!-- 图片加载完成后撑开容器，导致下方内容下移 -->

<!-- ✅ 正确：指定宽高比 -->
<img src="hero.jpg" alt="Hero Image" width="800" height="600" />
<!-- 或使用 aspect-ratio -->
<img src="hero.jpg" alt="Hero Image" style="aspect-ratio: 16/9; width: 100%;" />

<!-- ✅ 正确：使用占位符 -->
<div class="image-placeholder" style="aspect-ratio: 16/9; background: #f0f0f0;">
  <img
    src="hero.jpg"
    alt="Hero Image"
    onload="this.parentElement.classList.add('loaded')"
  />
</div>
```

```css
/* ✅ 字体加载优化 */
@font-face {
  font-family: "CustomFont";
  src: url("font.woff2") format("woff2");
  font-display: optional; /* 或 swap，避免布局偏移 */
}

/* ✅ 为动态内容预留空间 */
.ad-container {
  min-height: 250px; /* 预留广告位高度 */
  background: #f5f5f5;
}

/* ✅ 使用骨架屏 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}
```

```javascript
// ✅ 使用 ResizeObserver 监控布局变化
const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    console.log("Element resized:", entry.target, entry.contentRect);
    // 可以在这里记录意外的布局变化
  });
});

observer.observe(document.querySelector(".dynamic-content"));
```

**产品设计层面的建议**：

这个问题很大程度上取决于**产品和 UI 设计的交互形式**。作为前端工程师，我们需要：

1.  **在需求评审阶段就提出 CLS 风险**
    - 动态广告位、推荐位的设计方案
    - 图片/视频未加载完成时的占位策略
    - 骨架屏的设计规范

2.  **与设计师协作优化体验**
    - 固定高度的容器设计
    - 加载动画的时机和样式
    - 避免"先加载内容再加载头部导航"的反模式

3.  **建立 CLS 监控和告警机制**
    - 每次发版前检查 CLS 指标
    - 对 CLS > 0.1 的页面进行专项优化
    - 在性能监控平台设置阈值告警

**记住**：CLS 优化不仅是技术问题，更是产品体验问题，需要**跨职能协作**才能从根本上解决。

---

## 解决性能问题的思维模型

我发现，性能优化的思路其实和工作、生活中处理问题的方法论是相通的。我将其总结为 **"提问法"**，每个问题对应一类优化策略：

### 1. 可不可以不做？（削减）

**核心思想**：最快的请求是不发送请求，最小的资源是不加载资源

**适用场景**：

- ✅ **外部依赖 CDN 化**

  ```javascript
  // webpack.config.js
  module.exports = {
    externals: {
      react: "React",
      "react-dom": "ReactDOM",
      lodash: "_",
    },
  };
  ```

  ```html
  <!-- index.html -->
  <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
  ```

  **收益**：主包体积减少，利用浏览器缓存

- ✅ **Tree Shaking 去除死代码**

  ```javascript
  // ❌ 错误：导入整个库
  import _ from "lodash";
  _.debounce(fn, 300);

  // ✅ 正确：只导入需要的函数
  import debounce from "lodash-es/debounce";
  debounce(fn, 300);
  ```

  **收益**：减少无用代码

- ✅ **移除未使用的依赖**

  ```bash
  # 使用 depcheck 检测未使用的依赖
  npx depcheck

  # 分析重复依赖
  npm ls <package-name>
  ```

### 2. 可不可以少做？（减量）

**核心思想**：减少资源体积，减少计算量，减少渲染次数

**适用场景**：

- ✅ **替换为体积更小的 npm 包**

      moment.js (68KB) → dayjs (2KB)     节省 97%
      lodash (71KB) → lodash-es (24KB)    节省 66%
      axios (13KB) → ky (9KB)             节省 31%

- ✅ **图片优化**

  ```bash
  # 使用 imagemin 压缩
  npx imagemin input/*.jpg --out-dir=output --plugin=mozjpeg

  # 转换为 WebP（压缩率提升 30-50%）
  npx imagemin input/*.jpg --out-dir=output --plugin=webp
  ```

  ```html
  <!-- 使用 picture 标签提供多种格式 -->
  <picture>
    <source srcset="image.avif" type="image/avif" />
    <source srcset="image.webp" type="image/webp" />
    <img src="image.jpg" alt="Fallback" />
  </picture>
  ```

- ✅ **代码压缩（Minify）**

  ```javascript
  // webpack.config.js
  const TerserPlugin = require("terser-webpack-plugin");

  module.exports = {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // 移除 console
              drop_debugger: true, // 移除 debugger
              pure_funcs: ["console.log"], // 移除指定函数
            },
          },
        }),
      ],
    },
  };
  ```

  **收益**：JavaScript 减少 20-30%，CSS 减少 15-25%

- ✅ **HTTP 缓存策略**

  ```nginx
  # 静态资源强缓存 1 年
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # HTML 不缓存
  location ~* \.html$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }
  ```

- ✅ **减少重排重绘**

  ```javascript
  // 使用 class 代替逐个修改样式
  element.classList.add("active");

  // 使用 transform 代替 top/left
  element.style.transform = "translateX(100px)";
  ```

- ✅ **防抖节流**

  ```javascript
  // 搜索输入防抖（减少 API 调用）
  const search = debounce((query) => {
    fetchResults(query);
  }, 300);

  // 滚动事件节流（减少处理次数）
  const handleScroll = throttle(() => {
    updatePosition();
  }, 16); // 约 60fps
  ```

### 3. 可不可以让别人做？（转移）

**核心思想**：将计算密集型任务转移到其他线程或服务端

**适用场景**：

- ✅ **Web Worker 处理 CPU 密集任务**

  ```javascript
  // main.js
  const worker = new Worker("heavy-compute.worker.js");
  worker.postMessage({ data: largeDataset });
  worker.onmessage = (e) => {
    updateUI(e.data.result);
  };

  // heavy-compute.worker.js
  self.onmessage = (e) => {
    const result = complexCalculation(e.data);
    self.postMessage({ result });
  };
  ```

  **适用于**：图像处理、加解密、数据分析、复杂计算

- ✅ **服务端处理复杂数据逻辑**

  ```javascript
  // ❌ 前端处理：传输大量数据 + 客户端计算
  const allData = await fetch("/api/data/all"); // 10MB
  const filtered = allData.filter(/* 复杂条件 */);
  const sorted = filtered.sort(/* 复杂排序 */);
  const grouped = groupBy(sorted, "category");

  // ✅ 后端处理：直接返回结果
  const result = await fetch("/api/data/processed?filters=..."); // 100KB
  ```

  **收益**：减少数据传输量，减少客户端计算时间

- ✅ **SSR/SSG 服务端渲染**
  ```javascript
  // Next.js SSG 示例
  export async function getStaticProps() {
    const data = await fetchData();
    return {
      props: { data },
      revalidate: 3600, // ISR：每小时重新生成
    };
  }
  ```
  **收益**：首屏渲染时间减少

### 4. 可不可以提前做？（预处理）

**核心思想**：在用户需要之前提前准备好资源

**适用场景**：

- ✅ **DNS 预解析**

  ```html
  <link rel="dns-prefetch" href="//cdn.example.com" />
  <link rel="dns-prefetch" href="//api.example.com" />
  ```

  **收益**：减少 DNS 查询时间

- ✅ **预连接（Preconnect）**

  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
  ```

  **收益**：提前完成 DNS + TCP + TLS

- ✅ **预加载关键资源（Preload）**

  ```html
  <!-- 预加载关键 CSS -->
  <link rel="preload" href="/critical.css" as="style" />

  <!-- 预加载关键字体 -->
  <link
    rel="preload"
    href="/font.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <!-- 预加载关键 JavaScript -->
  <link rel="preload" href="/app.js" as="script" />
  ```

- ✅ **预获取下一页资源（Prefetch）**

  ```html
  <!-- 用户可能访问的下一个页面 -->
  <link rel="prefetch" href="/next-page.html" />
  <link rel="prefetch" href="/dashboard.js" />
  ```

- ✅ **React 路由预加载**

  ```javascript
  import { Link } from "react-router-dom";

  // 鼠标悬停时预加载
  <Link
    to="/dashboard"
    onMouseEnter={() => {
      import("./Dashboard"); // 预加载组件
    }}
  >
    Dashboard
  </Link>;
  ```

### 5. 可不可以晚点做？（延迟）

**核心思想**：非关键资源延迟加载，优先保证首屏体验

**适用场景**：

- ✅ **路由懒加载**

  ```javascript
  // React
  const Dashboard = lazy(() => import("./Dashboard"));
  const Settings = lazy(() => import("./Settings"));

  // Vue
  const Dashboard = () => import("./Dashboard.vue");
  ```

- ✅ **组件懒加载**

  ```javascript
  // 懒加载重型组件
  const HeavyChart = lazy(() => import("./HeavyChart"));

  <Suspense fallback={<Loading />}>
    <HeavyChart data={data} />
  </Suspense>;
  ```

- ✅ **图片懒加载**

  ```html
  <!-- 原生懒加载 -->
  <img src="image.jpg" loading="lazy" alt="Lazy loaded" />

  <!-- 使用 Intersection Observer -->
  <img data-src="image.jpg" class="lazy" alt="Lazy loaded" />
  ```

- ✅ **数据分页/无限滚动**

  ```javascript
  // 初始只加载第一页数据
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery(["items", page], () =>
    fetchItems({ page, limit: 20 }),
  );

  // 滚动到底部加载下一页
  const handleScroll = () => {
    if (isBottom) setPage((p) => p + 1);
  };
  ```

- ✅ **非关键 JavaScript 延迟执行**

  ```html
  <!-- 分析脚本延迟加载 -->
  <script defer src="analytics.js"></script>

  <!-- 页面加载完成后再执行 -->
  <script>
    window.addEventListener("load", () => {
      import("./non-critical.js");
    });
  </script>
  ```

### 6. 可不可以高效做？（加速）

**核心思想**：提升执行效率，减少等待时间

**适用场景**：

- ✅ **CDN 加速**

  ```javascript
  // 静态资源部署到 CDN
  module.exports = {
    output: {
      publicPath: "https://cdn.example.com/assets/",
    },
  };
  ```

  **收益**：访问速度提升

- ✅ **HTTP/2 多路复用**

  ```nginx
  server {
    listen 443 ssl http2;
    # 开启 HTTP/2
  }
  ```

  **收益**：并行加载多个资源，消除队头阻塞

- ✅ **开启 Gzip/Brotli 压缩**

  ```nginx
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
  gzip_min_length 1024;

  brotli on;
  brotli_types text/plain text/css application/json application/javascript;
  ```

  **收益**：文本资源体积减少

- ✅ **使用更快的算法**

  ```javascript
  // ❌ 慢：O(n²) 冒泡排序
  function bubbleSort(arr) {
    /* ... */
  }

  // ✅ 快：O(n log n) 快速排序
  arr.sort((a, b) => a - b);

  // ✅ 更快：使用 Map 代替数组查找
  // ❌ O(n) 查找
  const found = array.find((item) => item.id === targetId);

  // ✅ O(1) 查找
  const map = new Map(array.map((item) => [item.id, item]));
  const found = map.get(targetId);
  ```

### 7. 可不可以分阶段做？（分片）

**核心思想**：将大任务拆解为小任务，避免长时间阻塞主线程

**适用场景**：

- ✅ **时间切片（Time Slicing）**

  ```javascript
  async function optimalScheduling(data) {
    const startTime = performance.now();

    for (let i = 0; i < data.length; i += 100) {
      // 使用 postTask 调度添加任务调度
      await scheduler.postTask(
        () => {
          processChunk(data.slice(i, i + 100));
        },
        { priority: "background" },
      );

      // 使用 isInputPending 判断是否让出主线程
      if (
        navigator.scheduling.isInputPending() ||
        performance.now() - startTime > 50
      ) {
        // 使用 yield 让出主线程
        await scheduler.yield();
        startTime = performance.now();
      }
    }
  }
  ```

  **特点**：
  - 可自己控制时间切片
  - 使用 isInputPending 优化让出时机
  - 多优先级队列管理任务
  - 可中断 可恢复的工作循环

- ✅ **虚拟滚动（只渲染可见部分）**

  ```javascript
  // 数据量：10,000 条
  // DOM 节点：只渲染 20 个可见节点 + 5 个缓冲节点
  function VirtualList({ items, itemHeight = 50 }) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerHeight = 600;

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
    const visibleItems = items.slice(startIndex, endIndex);

    return (
      <div
        style={{ height: containerHeight, overflow: "auto" }}
        onScroll={(e) => setScrollTop(e.target.scrollTop)}
      >
        <div style={{ height: items.length * itemHeight }}>
          <div
            style={{ transform: `translateY(${startIndex * itemHeight}px)` }}
          >
            {visibleItems.map((item, i) => (
              <div key={startIndex + i} style={{ height: itemHeight }}>
                {item.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  ```

- ✅ **requestAnimationFrame 分帧渲染**

  ```javascript
  function renderLargeList(items) {
    const ITEMS_PER_FRAME = 50;
    let currentIndex = 0;

    function renderBatch() {
      const batch = items.slice(currentIndex, currentIndex + ITEMS_PER_FRAME);
      batch.forEach((item) => renderItem(item));

      currentIndex += ITEMS_PER_FRAME;

      if (currentIndex < items.length) {
        requestAnimationFrame(renderBatch);
      }
    }

    requestAnimationFrame(renderBatch);
  }
  ```

- ✅ **React Concurrent 模式**

  ```javascript
  import { startTransition } from "react";

  function SearchBox() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleChange = (e) => {
      // 高优先级：立即更新输入框
      setQuery(e.target.value);

      // 低优先级：可被打断的搜索
      startTransition(() => {
        setResults(search(e.target.value));
      });
    };

    return (
      <>
        <input value={query} onChange={handleChange} />
        <Results data={results} />
      </>
    );
  }
  ```

- ✅ **渲染与交互分离**

  ```javascript
  // 先渲染关键内容，交互能力稍后注入
  function App() {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      // 页面渲染后再附加事件监听
      requestIdleCallback(() => {
        attachEventListeners();
        setIsHydrated(true);
      });
    }, []);

    return <Content interactive={isHydrated} />;
  }
  ```

---

## 性能劣化的防御机制

**很多时候我们做不到极致的性能，但在产品性能稳定的情况下，更重要的是防止性能劣化！**

这是一个经常被忽视但极其关键的问题。性能不是优化一次就能一劳永逸的，随着功能迭代、人员变动、第三方库升级，性能很容易悄悄地劣化。

### 建立性能守卫机制

#### 1. 实时监控告警

**生产环境持续监控，配置告警策略**

根据当前项目状态进行告警策略配置

#### 2. 代码审查规范

**在 Code Review 时关注性能**：

```markdown
## Checklist

- [ ] 新增的第三方库是否必要？体积多大？
- [ ] 是否使用了按需引入？
- [ ] 图片是否压缩？是否使用 WebP？
- [ ] 是否会导致大量 DOM 操作？
- [ ] 列表数据量大时是否使用虚拟滚动？
- [ ] 是否添加了防抖/节流？
- [ ] 是否会阻塞首屏渲染？
```

---

## 性能监控系统的选型与实施

如果项目尚未接入性能监控系统，**这应该是性能优化的第一步**。没有数据支撑的优化都是盲人摸象。

从**成本、功能、实施难度**三个维度考虑，方案分为三种：

### 方案对比

| 维度                       | 自建系统                               | 使用第三方 SaaS 平台             | 私有化部署开源系统                     |
| -------------------------- | -------------------------------------- | -------------------------------- | -------------------------------------- |
| **接入成本（初始投入）**   | 🔴 高<br>需自主研发，周期不固定        | 🟢 低<br>即插即用，1-2 天部署    | 🟡 中<br>需部署配置，1-2 周            |
| **使用成本（持续费用）**   | 🟢 低<br>服务器 + 人力                 | 🔴 高<br>订阅费用随用量增长<br>  | 🟢 低<br>服务器 + 运维人力             |
| **维护成本（运维复杂度）** | 🔴 高<br>全链路自主负责                | 🟢 低<br>由服务商负责            | 🟡 中<br>需自主维护实例                |
| **数据隐私与安全**         | 🟢 最高<br>数据完全内部流转            | 🔴 相对较低<br>数据在第三方平台  | 🟢 高<br>数据存储在自有环境            |
| **定制化灵活性**           | 🟢 极高<br>可按需任意定制              | 🔴 有限<br>受平台功能限制        | 🟡 高<br>可修改代码，但受开源项目制约  |
| **技术支持**               | 🔴 无<br>完全靠自己                    | 🟢 好<br>有专业技术团队          | 🟡 一般<br>依赖社区                    |
| **数据分析能力**           | 🟡 中<br>取决于自研能力                | 🟢 强<br>成熟的分析工具          | 🟢 强<br>开源项目通常功能完善          |
| **适用场景**               | 大厂、有专业团队<br>对数据安全要求极高 | 中小公司、快速起步<br>业务增长期 | 中型公司、有一定技术能力<br>对成本敏感 |

### 方案 1：自建性能监控系统

**适合**：大厂、有专业前端基建团队、对数据安全要求极高

**技术栈**：

- **采集端**：自研 SDK
- **上报链路**：Nginx → Kafka → Flink
- **存储**：ClickHouse（时序数据）+ Redis（实时数据）
- **展示**：Grafana + 自研看板
- **告警**：Prometheus AlertManager

**优势**：

- ✅ 完全定制化，可扩展性强
- ✅ 数据完全掌控，可做深度分析
- ✅ 无第三方依赖，无隐私泄露风险

**挑战**：

- ❌ 研发周期长
- ❌ 需要专职团队维护
- ❌ 需要解决高并发、海量数据存储等问题

### 方案 2：使用第三方 SaaS 平台

**推荐平台**：

- **[Sentry](https://sentry.io/welcome/)** - 老牌监控，功能完善
- **[火山引擎 APM](https://www.volcengine.com/product/apmplus)** - 字节跳动出品，国内访问快
- **[DataDog RUM](https://www.datadoghq.com/)** - 全链路监控，价格较高
- **[New Relic](https://newrelic.com/)** - 功能强大，但价格昂贵
- **[阿里云 ARMS](https://www.aliyun.com/product/arms)** - 国内服务，性价比高

**适合**：

- 中小型公司，希望快速起步
- 团队技术力量有限
- 业务快速增长期，时间成本高于资金成本

**集成示例**：

```javascript
// Sentry 集成
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@xxx.ingest.sentry.io/xxx",
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**优势**：

- ✅ 开箱即用，快速接入
- ✅ 功能成熟，文档完善
- ✅ 无需运维，稳定性高
- ✅ 有专业技术支持

**挑战**：

- ❌ 长期成本高
- ❌ 数据在第三方，有安全顾虑
- ❌ 定制化能力受限

### 方案 3：私有化部署开源系统

**推荐开源项目**：

- **[Sentry 开源版](https://github.com/getsentry/sentry)** - 功能最完善
- **[Elastic APM](https://www.elastic.co/apm)** - ELK 生态

**适合**：

- 中型公司，有一定技术能力
- 对数据安全有要求
- 对成本敏感

**优势**：

- ✅ 功能完善
- ✅ 数据完全自主掌控
- ✅ 长期成本低
- ✅ 社区支持，持续更新

**挑战**：

- ❌ 需要有运维能力
- ❌ 升级维护需要人力
- ❌ 高并发场景需要自己优化

---

## 总结

性能优化不是一次性工作，而是一个**系统工程**，需要：

1.  **建立度量体系**：用 Core Web Vitals 作为指标
2.  **建立诊断流程**：从指标异常反推问题根源
3.  **建立优化思维**：用"提问法"系统性思考优化方向
4.  **建立防御机制**：代码审查规范 + 实时监控
5.  **建立监控体系**：选择合适的监控方案，持续跟踪

**记住这三个关键原则**：

- 📊 **指标驱动** - 没有数据的优化都是空谈
- 🎯 **场景化优化** - 不同场景优先级不同，抓主要矛盾
- 🛡️ **防止劣化** - 性能不是优化一次就完事，要建立长效机制

性能优化的本质，是在**用户体验、开发效率、成本投入**之间找到最佳平衡点。不要为了优化而优化，要始终以**提升用户体验**为最终目标。

---

## 参考

- [Web Vitals 官方文档](https://web.dev/vitals/)
- [Chrome DevTools Performance 指南](https://developer.chrome.com/docs/devtools/performance/)
- [前端工程体验优化实战](https://juejin.cn/book/7306163555449962533/section)
- [High Performance Browser Networking](https://hpbn.co/)
- [React 性能优化指南](https://react.dev/learn/render-and-commit)
