# 如何从 0 到 1 搭建前端性能监控 SDK

> **提示** 新指标 INP（Interaction to Next Paint）于 2024 年 3 月取代 FID，成为 Core Web Vitals 的一部分。

入职新公司三个月，我负责的是客户端性能监控平台的前端开发。Web 端用户平台的第一版完成基础功能搭建后，发现公司在前端监控体系上还不完善——缺少统一的采集与上报能力，难以支撑后续的指标分析与告警。与 LD、产品以及项目负责人沟通后，我们决定自建一套前端性能监控 SDK，由我牵头完成第一次开发与落地。本文是这次从 0 到 1 搭建过程的梳理与总结。

前端性能问题只有在「可观测」之后才能被持续优化；同样，**运行时异常**若没有统一采集与上报，线上报错只能靠用户反馈或偶发复现，难以按页面、版本聚合与告警。若没有统一的采集与上报，LCP、FCP、接口耗时等指标也只能靠人工在本地复现。因此很多团队会选择自建一套**前端监控 SDK**，同时覆盖**性能指标**与**异常监控**：在页面内轻量采集关键指标与错误信息，再上报到自有或第三方平台做聚合与告警。本文从 0 到 1 梳理 SDK 的目标、数据来源（性能 + 异常）、整体设计以及实现步骤，便于按需落地或裁剪。

---

## 一、先定「监控什么」

**性能指标**

- **Web Vitals**：FCP（首次内容绘制）、LCP（最大内容绘制）、FID（首次输入延迟，衡量交互响应速度）、CLS（布局偏移），必要时加上 TTFB（首字节时间）。
- **自定义指标**：首屏可交互时间、关键接口耗时、SPA 路由切换耗时等，可按业务在 SDK 里扩展采集逻辑。

**异常监控**

- **JS 运行时错误**：`window.onerror` 捕获的未处理异常、`unhandledrejection` 捕获的 Promise 未处理拒绝，附带 message、stack、filename、lineno 等，便于还原堆栈（若后端支持 Source Map 可解析出源码位置）。
- **资源加载错误**：脚本、样式、图片等加载失败，可通过 `window.addEventListener('error', ...)` 且 `event.target !== window` 区分于运行时错误。
- **框架级错误**：Vue 的 `errorHandler`、React 的 Error Boundary 等，可在业务侧统一调用 SDK 的 `captureException(error)` 上报。

**公共字段**

- **环境信息**：页面 URL、设备/UA、采样率等，用于上报时的筛选与降噪。性能与异常上报都可带上这些字段。

指标与异常不必一次全做，可先做 LCP/FCP/TTFB + 运行时错误，再逐步加 FID、CLS、资源错误和框架级上报。

---

## 二、数据从哪来

**性能数据**

- **Performance API**
  - `performance.getEntriesByType('navigation')` 可拿到 TTFB、DOMContentLoaded、Load 等导航时序。
  - `performance.getEntriesByType('resource')` 可拿到静态资源的加载耗时。
- **PerformanceObserver**（推荐）
  - 通过 `PerformanceObserver` 订阅 `paint`（FCP）、`largest-contentful-paint`（LCP）、`first-input`（FID）、`layout-shift`（CLS），在回调里取最新条目并上报，避免轮询。
- **自定义打点**
  - 使用 `performance.mark()` 与 `performance.measure()` 对首屏、关键接口、路由切换等做打点，再在 SDK 里统一读取并上报。

**异常数据**

- **window.onerror**：捕获全局未处理异常，回调参数为 `(message, source, lineno, colno, error)`，其中 `error?.stack` 为堆栈字符串，上报时一并带上。
- **window.onunhandledrejection** 或 **addEventListener('unhandledrejection')**：捕获未 catch 的 Promise rejection，`event.reason` 可能是 Error 或任意值，需序列化后上报（注意循环引用）。
- **资源错误**：`addEventListener('error', fn, true)` 在捕获阶段监听，若 `event.target` 为 `script`/`link`/`img` 等，则为资源加载失败，可上报 `event.target.src` 或 `href`、页面 URL 等。
- **业务主动上报**：对外暴露 `captureException(error)` 或 `reportError(error)`，供 Vue/React 等框架的错误钩子或 try/catch 中调用，便于统一走同一套上报与去重逻辑。

---

## 三、SDK 要解决的事

1. **初始化**：传入上报地址（性能与异常可同域或分流）、appId、采样率、开关（是否采集 LCP/FCP、是否开启异常监控等），避免硬编码。
2. **采集**：
   - **性能**：在合适的生命周期注册 PerformanceObserver、读取 Navigation/Resource 条目，封装成统一的数据结构（指标名、值、时间戳、页面信息等）。
   - **异常**：注册 `onerror`、`unhandledrejection`、资源 error 监听，以及对外提供 `captureException`；将 message、stack、类型（runtime / resource / promise）等标准化后入队。
3. **上报**：先写入内存队列，再按条数或时间间隔批量上报；使用 `sendBeacon` 或 `fetch`，必要时做重试与丢弃策略，避免阻塞页面。异常可单独队列、单独端点，或与性能共队列但打上 type 区分。
4. **与业务解耦**：通过配置或插件决定「采什么、何时发」，SDK 只负责采集与传输，不写死业务逻辑。

---

## 四、从 0 到 1 的步骤

<table style="border-collapse: collapse; width: 100%;">
<thead>
<tr>
<th style="border: 1px solid #ccc; padding: 10px 14px; text-align: left; min-width: 5em; ">步骤</th>
<th style="border: 1px solid #ccc; padding: 10px 14px; text-align: left;">内容</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ccc; padding: 10px 14px; vertical-align: top;"><strong>1</strong></td>
<td style="border: 1px solid #ccc; padding: 10px 14px;">新建 SDK 仓库（如 <code>@your-org/perf-sdk</code>），使用 TypeScript + 打包（Rollup/tsup），输出 umd + esm，便于各项目通过 npm 或 script 引入。</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 10px 14px; vertical-align: top;"><strong>2</strong></td>
<td style="border: 1px solid #ccc; padding: 10px 14px;"><strong>采集层</strong>：性能侧封装 PerformanceObserver（LCP/FCP/FID/CLS）及 navigation/resource 读取；异常侧注册 onerror、unhandledrejection、资源 error 监听，并暴露 <code>captureException</code>。统一成「类型 + 指标名/错误信息 + 时间戳 + 页面信息」等字段。</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 10px 14px; vertical-align: top;"><strong>3</strong></td>
<td style="border: 1px solid #ccc; padding: 10px 14px;"><strong>队列与上报</strong>：内存队列 + 定时或条数触发 flush；上报函数内优先使用 <code>navigator.sendBeacon</code>，不支持时用 <code>fetch</code>，并做好重试与丢弃策略（如最多重试 3 次，失败则丢弃本批）。</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 10px 14px; vertical-align: top;"><strong>4</strong></td>
<td style="border: 1px solid #ccc; padding: 10px 14px;"><strong>初始化</strong>：<code>init({ reportUrl, appId, sampleRate, metrics: { lcp: true, fcp: true, ... }, enableError: true })</code>；在 <code>document.readyState</code> 合适阶段注册 observer 与错误监听，在页面卸载时做最后一次上报（如 <code>visibilitychange</code> 或 <code>beforeunload</code> 时 flush）。</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 10px 14px; vertical-align: top;"><strong>5</strong></td>
<td style="border: 1px solid #ccc; padding: 10px 14px;"><strong>采样与过滤</strong>：根据 <code>sampleRate</code> 决定是否上报；可过滤本地或无效 URL，减少脏数据。</td>
</tr>
<tr>
<td style="border: 1px solid #ccc; padding: 10px 14px; vertical-align: top;"><strong>6</strong></td>
<td style="border: 1px solid #ccc; padding: 10px 14px;"><strong>测试</strong>：在本地页面接入 SDK，用 Chrome DevTools Performance 与 Web Vitals 插件对照，确认上报的 LCP、FCP 等数值合理；再压测上报量与失败重试是否符合预期。</td>
</tr>
</tbody>
</table>

---

## 五、核心代码示例（思路）

**性能采集**

```js
// 1. 采集 LCP
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const last = entries[entries.length - 1];
  report({
    type: "perf",
    name: "lcp",
    value: last.startTime,
    url: location.href,
  });
});
observer.observe({ type: "largest-contentful-paint", buffered: true });
```

**异常采集**

```js
// 2. 运行时错误与未处理 Promise
window.onerror = (message, source, lineno, colno, error) => {
  report({
    type: "error",
    kind: "runtime",
    message,
    stack: error?.stack,
    source,
    lineno,
    colno,
    url: location.href,
  });
};
window.addEventListener("unhandledrejection", (e) => {
  report({
    type: "error",
    kind: "promise",
    reason: String(e.reason),
    stack: e.reason?.stack,
    url: location.href,
  });
});
// 对外供 Vue/React 等调用
export function captureException(error) {
  report({
    type: "error",
    kind: "custom",
    message: error?.message,
    stack: error?.stack,
    url: location.href,
  });
}
```

**上报队列与 flush**

```js
const queue = [];
function report(payload) {
  if (payload.type === "perf" && Math.random() > sampleRate) return;
  queue.push({ ...payload, ts: Date.now() });
  if (queue.length >= 10) flush();
}
function flush() {
  if (queue.length === 0) return;
  const body = JSON.stringify(queue.splice(0, 10));
  navigator.sendBeacon(reportUrl, body);
}
```

---

## 六、小结

- 先明确**监控范围**：性能（Web Vitals + 可选自定义）+ 异常（运行时错误、Promise rejection、资源错误、业务主动上报），再确定**数据来源**（Performance API、PerformanceObserver、onerror、unhandledrejection、资源 error、captureException）。
- SDK 负责**采集标准化、队列、批量上报**，通过 init 配置与业务解耦；上报优先 `sendBeacon`，并做好采样（性能）与失败丢弃；异常可与性能共队列打 type 区分，或单独端点。
- 从 0 到 1 可按：**建库 → 采集层（性能 + 异常）→ 上报层 → init 与生命周期 → 采样/过滤 → 测试** 的顺序迭代，先跑通 LCP/FCP/TTFB + 运行时错误，再逐步扩展 FID/CLS、资源错误与框架级上报。
