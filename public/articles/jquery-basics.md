# jQuery 基本用法入门

<!-- meta: id=2; date=2018-09-19; tags=jQuery,基础 -->

最近在使用jQuery，通过几个常见的业务场景，分享下jQuery常用的API

---

## 1. 引入与入口函数

### 1.1 引入 jQuery

实际项目中最常见的方式，就是在页面底部通过 CDN 引入一个稳定版本的 jQuery：

```html
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script>
  // 页面 DOM 结构准备好之后再执行
  $(function () {
    console.log("jQuery 已就绪");
  });
</script>
```

这里的 `$(function () { ... })` 是一个经典写法，等价于：

```js
document.addEventListener("DOMContentLoaded", function () {
  // ...
});
```

### 1.2 `$()` 的核心思想

`$()` 做了两件事：

- 根据选择器找到一批 DOM 节点
- 把它们“打包”成一个 jQuery 对象，挂上一堆链式 API

```js
// 原生写法：操作标题
var title = document.getElementById("title");
title.innerText = "Hello";
title.style.color = "red";

// jQuery 写法：一行链式调用
$("#title").text("Hello").css("color", "red");
```

---

## 2. 常用选择器：像写 CSS 一样查 DOM

在写静态页面的时候，我们已经熟悉了 CSS 选择器；在 jQuery 里，几乎可以完全照搬：

```js
// 按 id
$("#title");

// 按类名
$(".item");

// 按标签
$("p");

// 层级关系
$("#list li.active"); // list 下当前高亮的项

// 按属性
$('input[type="text"]');
$('.btn[data-role="primary"]');
```

配合一些“过滤方法”，可以快速精确定位到想要的节点：

```js
// 拿到第一个 / 最后一个
$("#list li").first();
$("#list li").last();

// 按下标取元素（从 0 开始）
$("#list li").eq(2); // 第 3 个 li

// 过滤 / 排除某个类
$("#list li").filter(".active");
$("#list li").not(".disabled");
```

---

## 3. DOM 操作：改内容、调样式、增删节点

### 3.1 改内容、改属性

```js
// 文本 / HTML 内容
$("#title").text("新的标题");
$("#intro").html("<strong>加粗的一段介绍</strong>");

// 表单的值
$("#username").val("yiyi");
const name = $("#username").val();

// 读 / 写属性
$("#link").attr("href", "https://example.com");
$("#avatar").attr({
  src: "/images/avatar.png",
  alt: "用户头像",
});

// 删除属性
$("#link").removeAttr("target");
```

### 3.2 样式与类名

```js
// 设置行内样式
$("#box").css("background", "#000");
$("#box").css({
  color: "#fff",
  "font-size": "14px",
});

// 用 class 做状态切换（推荐）
$("#box").addClass("active");
$("#box").removeClass("active");
$("#box").toggleClass("active");

if ($("#box").hasClass("active")) {
  console.log("当前是激活状态");
}
```

### 3.3 插入与删除节点

```js
// 在列表末尾追加一项
$("#todo-list").append("<li>新任务</li>");

// 在最前面插入一项
$("#todo-list").prepend("<li>置顶任务</li>");

// 在某个元素前后插入同级节点
$('<p class="tip">提示信息</p>').insertAfter("#form");
$('<p class="error">错误信息</p>').insertBefore("#form");

// 删除整个节点
$("#ad-banner").remove();

// 只清空内容，不删外层容器
$("#content").empty();
```

---

## 4. 事件：从“一个个绑”到“委托”

### 4.1 基本事件绑定

```js
// 点击按钮
$("#save-btn").click(function () {
  alert("保存成功");
});

// 通用写法：.on(事件名, 回调)
$("#username").on("focus", function () {
  $(this).addClass("focus");
});

$("#username").on("blur", function () {
  $(this).removeClass("focus");
});
```

阻止默认行为、拿事件对象也很简单：

```js
$("#login-form").on("submit", function (e) {
  e.preventDefault();
  // 做前端校验 / 发送 Ajax
});
```

### 4.2 事件委托：列表型页面的必备

在实际业务里，很多列表项是“后续通过 Ajax 渲染出来的”。  
对每个新 li 都重新绑定一次事件，会非常麻烦，也浪费性能。

用“事件委托”的方式，只在父元素上绑一次即可：

```js
// 给 ul 绑定，把事件委托给内部的 li
$("#todo-list").on("click", "li", function () {
  // this 指向被点击的 li
  $(this).toggleClass("done");
});
```

无论是初始渲染出来的 li，还是后面通过 `append` 新增的 li，这个事件都会生效。

---

## 5. 常见动效：显示、隐藏、淡入淡出

### 5.1 显示 / 隐藏

```js
// 直接显示 / 隐藏
$("#dialog").show();
$("#dialog").hide();

// 渐隐 / 渐显
$("#dialog").fadeIn(200);
$("#dialog").fadeOut(200);
$("#dialog").fadeToggle(200);

// 向下展开 / 向上收起
$("#panel").slideDown(200);
$("#panel").slideUp(200);
$("#panel").slideToggle(200);
```

### 5.2 自定义动画

```js
$("#box").animate(
  {
    left: "200px",
    opacity: 0.5,
  },
  400,
  function () {
    console.log("动画结束");
  },
);
```

---

## 6. Ajax：把页面从“刷新”变成“局部更新”

### 6.1 `$.get` / `$.post`

```js
// GET 请求加载用户信息
$.get("/api/user", { id: 1 }, function (res) {
  $("#nickname").text(res.nickname);
});

// POST 请求提交表单
$.post("/api/login", $("#login-form").serialize(), function (res) {
  if (res.success) {
    location.href = "/dashboard";
  } else {
    alert(res.message || "登录失败");
  }
});
```

### 6.2 更灵活的 `$.ajax`

```js
$.ajax({
  url: "/api/user",
  type: "GET",
  data: { id: 1 },
  dataType: "json",
  timeout: 8000,
  success: function (res) {
    $("#nickname").text(res.nickname);
  },
  error: function (xhr, status) {
    console.error("请求失败：", status);
  },
});
```

---

## 7. jQuery 自带的一些小工具

除了 DOM / 事件 / Ajax，jQuery 还顺手封装了一些实用方法，偶尔非常好用。

```js
// 遍历数组
$.each(["a", "b", "c"], function (index, value) {
  console.log(index, value);
});

// 遍历对象
$.each({ name: "yiyi", age: 18 }, function (key, value) {
  console.log(key, value);
});

// 简单的类型判断
$.isArray([]);
$.isFunction(function () {});

// 合并配置
var defaults = { color: "black", size: "m" };
var custom = { size: "l" };
var options = $.extend({}, defaults, custom);
// => { color: 'black', size: 'l' }
```

---

## 8. 小结：什么时候还值得用 jQuery？

即便今天已经有了 React / Vue / Angular 等前端框架，jQuery 依然在这些场景里表现很合适：

- 需要维护的老项目，改造成本高，又不值得整体重写
- 只是一两个传统表单页面，加一点交互和校验
- 后台系统里，用少量脚本增强现有模板引擎输出的 HTML

我最近再看这本书：  
**《锋利的 jQuery》**
