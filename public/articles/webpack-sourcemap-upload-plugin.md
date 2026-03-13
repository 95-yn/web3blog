# 编写 Webpack 插件，在构建后自动上传 Source Map

<!-- meta: id=5; date=2019-01-22; tags=前端,Webpack,SourceMap -->

在上一篇里聊了怎么在内网部署 Source Map 调试线上问题，这篇记录一下「怎么用一个简单的 Webpack 插件，在构建完成后自动上传 Sourcemap」，避免每次手动拷贝 / 上传。

目标很简单：

- 构建完成后自动遍历输出目录里的 `.map` 文件
- 把这些文件上传到内网的 Source Map 服务
- 上传成功后，可以选择在本地构建产物里删除这些 `.map`，避免误发到公网

---

## 一、Webpack 插件的大致结构

Webpack 插件本质上就是一个带 `apply(compiler)` 方法的对象：

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("MyPlugin", (stats) => {
      // 构建完成后要做的事情
    });
  }
}

module.exports = MyPlugin;
```

我们要做的事就是在合适的钩子上，拿到输出目录和产物列表，然后对 `.map` 文件做后续处理。

---

## 二、选择合适的钩子

和 Sourcemap 上传关系最紧的几个时机：

- `emit` / `afterEmit`：资源已经写入到内存结构中（有时还没真正落盘）
- `done`：整个构建流程结束，产物已经在输出目录里了

这类「落盘后处理文件」的需求，用 `done` 会比较直观：

```js
compiler.hooks.done.tapPromise("SourceMapUploadPlugin", async (stats) => {
  // stats 存的是本次构建的信息
});
```

用 `tapPromise` 可以让我们在插件里写 async/await，逻辑更清晰一些。

---

## 三、一个简化版的上传插件示例

下面是一个简化版实现，只展示核心思路：

```js
// SourceMapUploadPlugin.js
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

class SourceMapUploadPlugin {
  constructor(options) {
    this.options = options || {};
    this.endpoint = this.options.endpoint; // 内网上传接口地址
    this.appName = this.options.appName; // 应用名
    this.version = this.options.version; // 版本号
  }

  apply(compiler) {
    compiler.hooks.done.tapPromise("SourceMapUploadPlugin", async (stats) => {
      const outputPath = compiler.options.output.path;

      if (!this.endpoint) {
        console.warn("[SourceMapUploadPlugin] endpoint 未配置，跳过上传");
        return;
      }

      // 遍历输出目录，找出所有 .map 文件
      const files = fs.readdirSync(outputPath);
      const mapFiles = files.filter((f) => f.endsWith(".map"));

      if (mapFiles.length === 0) {
        console.log("[SourceMapUploadPlugin] 未找到 .map 文件，跳过上传");
        return;
      }

      console.log(
        `[SourceMapUploadPlugin] 准备上传 ${mapFiles.length} 个 sourcemap 文件…`,
      );

      for (const file of mapFiles) {
        const filePath = path.join(outputPath, file);
        const content = fs.readFileSync(filePath, "utf-8");

        try {
          const res = await fetch(this.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              app: this.appName,
              version: this.version,
              filename: file,
              sourcemap: content,
            }),
          });

          if (!res.ok) {
            console.error(
              `[SourceMapUploadPlugin] 上传失败: ${file}, status=${res.status}`,
            );
          } else {
            console.log(`[SourceMapUploadPlugin] 上传成功: ${file}`);

            if (this.options.removeLocal !== false) {
              fs.unlinkSync(filePath);
              console.log(`[SourceMapUploadPlugin] 本地已删除: ${file}`);
            }
          }
        } catch (err) {
          console.error(`[SourceMapUploadPlugin] 上传异常: ${file}`, err);
        }
      }
    });
  }
}

module.exports = SourceMapUploadPlugin;
```

几个关键点：

- 插件通过构造函数接收：
  - `endpoint`: 内网上传接口
  - `appName` / `version`: 方便后续按应用和版本区分
  - `removeLocal`: 是否在上传成功后删除本地 `.map`
- 在 `done` 钩子里：
  - 遍历输出目录，找出所有 `.map`
  - 逐个上传
  - 按需删除本地 `.map`

---

## 四、在 Webpack 配置中使用插件

在生产环境配置中引入这个插件，例如：

```js
// webpack.prod.js
const SourceMapUploadPlugin = require("./build/SourceMapUploadPlugin");
const pkg = require("./package.json");

module.exports = {
  mode: "production",
  devtool: "hidden-source-map",
  // ...
  plugins: [
    new SourceMapUploadPlugin({
      endpoint: "https://intranet.example.com/sourcemap/upload",
      appName: "my-web-app",
      version: pkg.version,
      removeLocal: true,
    }),
  ],
};
```

注意几点：

- `devtool` 推荐用 `hidden-source-map`，这样不会在 bundle 末尾自动暴露 `sourceMappingURL`。
- `version` 可以直接用 `package.json` 里的版本号，也可以用流水线构建号。
- `removeLocal: true` 可以减少“误发 `.map` 到生产服务器”的风险。

---

## 五、内网服务端大致需要做什么

上传的另一端是你的内网 Source Map 服务，它需要做的事情通常包括：

1. 校验权限（比如鉴权 token、IP 白名单等）
2. 把 Sourcemap 存到合适的位置（按 `app/version/filename` 组织）
3. 提供一个“还原堆栈”的接口或页面，供排查问题时使用

一个非常粗略的 Node.js 伪代码结构可能是：

```js
// 伪代码，只展示结构
app.post("/sourcemap/upload", async (req, res) => {
  const { app, version, filename, sourcemap } = req.body;
  // TODO: 校验权限
  const dir = path.join("/data/sourcemaps", app, version);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), sourcemap);
  res.json({ ok: true });
});
```

---

## 六、小结

- Webpack 插件的核心就是在 `apply` 里挂钩子，这里选用 `done`，在构建结束后处理 Sourcemap。
- 插件内部主要做三件事：
  1. 遍历输出目录中的 `.map` 文件；
  2. 调用内网接口上传 Sourcemap；
  3. 按需删除本地 `.map`，避免泄漏到公网。
- 配合前一篇「在内网部署 Source Map 调试线上问题」，可以形成一条完整链路：
  - 构建 → 插件自动上传 Sourcemap → 内网服务存储 → 排查线上问题时按版本还原堆栈。
