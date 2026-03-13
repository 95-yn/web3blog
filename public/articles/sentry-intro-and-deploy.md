# Sentry 接入方式与部署踩坑记录

前段时间解决了线上代码无法调试的问题，最近开始了解 Sentry。这篇不打算做“官方文档翻译”，主要记录三件事：

- Sentry 大概能解决什么问题
- 前端接入的大致方式
- SaaS 版和自建（Self-hosted）在部署上的一些实际坑

---

## 一、Sentry 大概是干嘛的？

一句话：**把错误集中到一个地方，按项目 / 版本聚合起来，附带堆栈、用户环境、Tag 等信息，方便排查。**

常见用途：

- 前端 JS 报错收集（React / Vue / 原生）
- 接口异常的聚合和告警
- 后端异常收集（Node / Python / Java 等）
- 版本发布前后对比错误量，验证是否“修干净了”

和自己写一个 `window.onerror + 上报接口` 相比，Sentry 多做了几件事：

- 自动聚合同类型错误，避免“同一个错误刷屏”
- 自动带上浏览器、系统、URL、用户信息、版本号等上下文
- 支持 Release / 环境区分，比如 `production` / `staging`
- 有现成的搜索、过滤、看堆栈、回溯面板，不用自己造后台

---

## 二、前端接入 Sentry 的基本流程

下面以前端项目为例，大致的接入步骤是这样：

### 2.1 创建项目与 DSN

在 Sentry 后台：

1. 创建一个新项目（例如：Platform 选 “React” 或 “Browser JS”）
2. 拿到这个项目对应的 DSN（一个 URL，用来标识项目和上报地址）

这个 DSN 后面会写在代码里或环境变量里。

### 2.2 在代码里初始化 Sentry

以 React 为例（示意代码）：

```ts
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1, // 按需采样
  environment: process.env.NODE_ENV,
  release: `my-app@${process.env.APP_VERSION}`,
});
```

注意几个点：

- `dsn` 不要写死在代码里，走环境变量更安全。
- `environment` 用来区分 `production` / `staging` / `dev`。
- `release` 建议和构建版本号保持一致，方便按版本过滤错误。

### 2.3 手动上报一些关键点

自动报错之外，有些业务错误或埋点可以手动上报：

```ts
// 主动记录一个错误
Sentry.captureException(error);

// 记录一条信息
Sentry.captureMessage("checkout_failed", {
  level: "warning",
});
```

还可以在初始化或登录后设置用户信息，方便错误页面里看到“是谁遇到的问题”：

```ts
Sentry.setUser({
  id: user.id,
  email: user.email,
});
```

---

## 三、Source Map 与 Sentry 的配合

如果项目已经有 Source Map（前面几篇文章里讲过），和 Sentry 配合可以把线上压缩堆栈还原成源码堆栈。

常见做法：

1. 在构建阶段生成 Sourcemap（`hidden-source-map`）
2. 使用 Sentry 提供的 CLI 上传 Sourcemap：

```bash
sentry-cli releases new my-app@1.0.0
sentry-cli releases files my-app@1.0.0 upload-sourcemaps ./dist --url-prefix "~/static/js"
sentry-cli releases finalize my-app@1.0.0
```

3. 在 `Sentry.init` 里把 `release` 配成同一个版本号 `my-app@1.0.0`

这样 Sentry 就能用上传的 Sourcemap 把线上错误还原成源码行号，而不用自己在内网再查一遍。

如果公司对源码比较敏感，可以考虑：

- 只给 Sentry 上传 `nosources` 版本的 Map（不包含源码内容，只保留映射）
- 或者只在内外网都在公司控制下的 Self-host 版本里用完整 Sourcemap

---

## 四、SaaS 版 vs 自建（Self-hosted）

Sentry 有官方托管的 SaaS，也提供开源版本，可以自己部署。

### 4.1 SaaS 版（官方托管）

优点：

- 开箱即用，官方文档和 SDK 都围绕它写的
- 不用自己管存储、队列、升级
- 功能更新快

缺点：

- 数据在第三方，有团队会担心隐私 / 合规问题
- 收费模式一般按事件量 / 项目数来算，量大时费用不低

适合：

- 小团队 / 初期阶段，先跑通一套监控，把问题看清楚再说

### 4.2 自建 Sentry（Self-hosted）

官方提供了 Docker Compose 的一键部署脚本，大致会拉起：

- Sentry Web / Worker / Cron
- Postgres / Redis / Kafka / ClickHouse 等服务

优点：

- 数据自己掌控，按公司要求可以在内网、专线环境里跑
- 长期来看，事件量很大的情况下，成本可控

缺点（也是踩坑点）：

- 部署结构相对复杂，至少要有人看得懂 Docker / Compose / 基础网络
- 日志、存储空间、消息队列（Kafka）爆掉时，排查起来比 SaaS 麻烦

实际踩过的几个点：

1. **数据保留期限**：根据业务和合规要求，给事件数据设置合理的过期时间，既避免无限增长占满存储，也保证排查问题时有足够的历史数据可查。
2. **采样配置**：上报量较大时，一定要配置合适的采样率（如 `tracesSampleRate` / `sampleRate`），在“覆盖关键问题”与“控制数据量 / 成本”之间做平衡。

> 💡 **提示**：遇到不清楚的配置或告警问题时，及时和负责人（LD）以及运维同学沟通，一起排查会更高效也更安全。

---

## 五、接入时可以先做的几件“小事”

简单列几个「先做一定不亏」的点：

1. **统一 Release 号**  
   前端、后端、CI 流水线用同一套版本号命名规则，Sentry 里按 Release 过滤时一目了然。

2. **拉齐环境变量**
   - `SENTRY_DSN`
   - `SENTRY_ENVIRONMENT`
   - `SENTRY_RELEASE`  
     不要在代码里到处散落。

3. **接入前先想好告警策略**  
   不是所有错误都要打断大家的休息时间，可以先分几类：
   - 影响下单 / 支付的关键错误 → 高优先级告警
   - 某些第三方脚本报错 → 可以先静音或降级处理

4. **明确数据留存策略**  
   对于 SaaS 版，注意免费 / 低配方案的历史数据保留时间；  
   对于自建版，注意磁盘、数据库容量，以及旧事件的清理策略。

---

## 六、小结

- Sentry 的核心价值，就是把分散在各处的错误集中起来，带上上下文信息，让排查问题不再「看运气」。
- 前端接入的基本步骤：拿 DSN → 初始化 SDK → 按环境和版本区分 → （可选）配合 Sourcemap。
- SaaS 版适合先跑通一套完整链路；自建版则更适合有一定规模、对数据合规要求比较高的团队。

选型层面不要纠结太久，**先把监控和错误聚合接起来，比纠结哪个方案更重要**。等有了真实数据，再慢慢打磨告警策略、部署架构和成本优化。
