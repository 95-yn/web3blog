# 在内网部署 Source Map 调试线上问题

最近在排查前端线上问题的时候，最大的痛点就是「看不懂打包后的报错堆栈」。这一类问题基本都要借助 Source Map 才能舒服地解决。这里简单记录一下：

- Source Map 有哪些常见类型
- 怎么在 **不暴露源码** 的前提下，在内网部署 Source Map 来调试线上问题

---

## 一、Source Map 是什么？

打包 / 压缩之后的代码通常有几个特点：

- 变量名被混淆
- 多个文件被合成到一个 bundle 里
- 行号、列号都和源码完全对不上

Source Map 的作用可以简单理解成：

> 把压缩后的代码行列号，映射回构建前的源码位置。

有了它，我们可以：

- 在浏览器 DevTools 里直接看到源码文件、原始行号

---

## 二、常见的 Source Map 类型

### 2.1 外链 Source Map（最常见）

构建产物类似这样：

```js
// bundle.js
// ...
//# sourceMappingURL=bundle.js.map
```

目录里会多一个 `bundle.js.map` 文件。

- **优点**：浏览器和工具都支持得很好。
- **缺点**：如果直接把 `.map` 也部署到公网，就相当于半公开源码。

### 2.2 内联 Source Map（inline）

Source Map 以 data URL 的形式内嵌在 bundle 里：

```js
//# sourceMappingURL=data:application/json;base64,xxxx...
```

- **优点**：单文件携带，适合本地开发调试。
- **缺点**：体积膨胀严重，不适合线上。

### 2.3 hidden / nosources 等变体

构建工具里常见的关键配置：

- `hidden-source-map`：
  - 仍然生成 `.map` 文件，但不会在 bundle 末尾加 `//# sourceMappingURL=...`
  - 浏览器不会自动加载，但错误收集平台可以离线使用。
- `nosources-source-map`：
  - 映射信息里不包含源码内容（只保留映射关系）
  - 用来配合错误还原，但无法在浏览器里直接查看源码。

- **开发环境**：用带源码的 Source Map，方便调试。
- **生产环境**：用 `hidden-source-map` 或类似配置，只给内部工具用，不直接暴露在公网。

---

## 三、为什么要“内网部署” Source Map？

线上问题排查通常有两个矛盾：

1. 想看源码堆栈：要有 Source Map 才能还原。
2. 又不想把源码暴露在公网：`.map` 直接挂在 CDN 上风险很大。

比较折中的方案就是：

- 线上只部署压缩后的 JS，不公开 Source Map
- Source Map 部署在内网服务，只对内部工程师开放
- 错误信息里只带「压缩后的堆栈 + 版本号」，回到内网再做还原

---

## 四、现有执行流程

### 4.1 构建时生成 Source Map，但不公开

以 webpack 为例：

```js
// webpack.prod.js
module.exports = {
  mode: "production",
  devtool: "hidden-source-map", // 生产环境推荐
  // ...
};
```

构建输出：

- `dist/app.[hash].js`
- `dist/app.[hash].js.map`

**线上部署策略：**

- 只把 `app.[hash].js` 部署到 CDN / 生产服务器
- `.map` 文件上传到 **内网的 Source Map 服务**

---

## 五、Source Map 安全性上的几点建议

为了既能调试，又不裸奔：

- 不要直接在生产环境的 JS 里留 `//# sourceMappingURL=...` 指向公网 `.map`
- 不要把 `.map` 一股脑部署到 CDN，对外可直接访问
- 为 Source Map 内网服务加上登录 / 权限控制
- 开发 / 测试环境可以开放 Map，正式生产环境尽量用 hidden / 内网存储

---

## 六、小结

- Source Map 的核心价值：让压缩后的堆栈重新“说人话”。

- 现有流程：
  1. 构建时生成 .map，上传到内网的 Source Map 服务器，并从对外发布的构建产物中移除这些 .map 文件；
  2. 需要排查线上问题时，再从内网下载对应的 Source Map，用于本地或内网工具中还原堆栈。
