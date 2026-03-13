# 前端脚手架开发的一次实践记录

<!-- meta: id=7; date=2019-05-10; tags=前端,脚手架,CLI -->

前段时间在项目里频繁创建相似的前端工程，每次都是「复制老项目 → 删掉一堆东西 → 再改一堆配置」，效率很低，也容易漏掉配置。这篇简单记录一下当时做前端脚手架的一些思路和实现方式。

---

## 一、为什么要做脚手架？

当时的典型痛点：

- 新建项目步骤多：创建目录、初始化 `package.json`、配置打包工具、接入 eslint / prettier / husky 等等。
- 不同人新建项目的方式不统一：文件结构、脚本命令、Lint 规则都略有差异，久而久之维护成本很高。
- 有一些公司内部约定：比如统一接入监控、埋点、请求封装，每次人为 copy 容易漏。

脚手架的目标其实就两条：

1. 一条命令把**项目骨架**拉下来；
2. 带上一些**统一约定**（目录结构、代码规范、常用脚本）。

---

## 二、整体设计思路

没有搞太复杂，大致是下面这几个模块：

1. 一个命令行入口：比如 `my-fe-cli init`。
2. 若干个模板工程：`react-spa`、`react-admin`、`vite-basic` 等。
3. 一些交互问答：选择模板、填写项目名、选择要不要带 eslint/prettier/husky 等。
4. 把模板拷贝或下载到目标目录，然后做一些「定制化替换」。

对应到技术选型，大致是：

- Node.js 做 CLI
- `commander` 管命令解析
- `inquirer` 做交互问答
- `degit` 或直接 `git clone` / `download-git-repo` 拉取模板

---

## 三、命令行入口：init 命令

先用 `commander` 搭一个最简单的骨架：

```js
#!/usr/bin/env node

const { Command } = require("commander");
const pkg = require("../package.json");

const program = new Command();

program
  .name("my-fe-cli")
  .version(pkg.version)
  .description("My frontend scaffold CLI");

program
  .command("init")
  .argument("[project-name]", "project name", "my-app")
  .description("初始化一个前端项目")
  .action(async (projectName) => {
    const { runInit } = require("../lib/init");
    await runInit(projectName);
  });

program.parse(process.argv);
```

`init` 命令只做拆分，把真正的逻辑交给 `runInit`。

---

## 四、交互问答：选择模板和功能

在 `lib/init.js` 里，用 `inquirer` 做交互：

```js
const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");

async function runInit(projectName) {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "选择一个模板：",
      choices: [
        { name: "React SPA（Vite）", value: "react-spa-vite" },
        { name: "React Admin（基于 AntD）", value: "react-admin" },
      ],
    },
    {
      type: "confirm",
      name: "useEslint",
      message: "是否启用 ESLint？",
      default: true,
    },
    {
      type: "confirm",
      name: "usePrettier",
      message: "是否启用 Prettier？",
      default: true,
    },
  ]);

  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir)) {
    console.log(`目标目录 ${projectName} 已存在，请更换项目名或手动清理目录。`);
    process.exit(1);
  }

  await createProject(targetDir, answers);
}

module.exports = { runInit };
```

交互的结果会传给 `createProject`，用于后续选择模板和按需调整配置。

---

## 五、模板管理与项目生成

模板这块当时没有做成在线列表，而是先简单按「本地模板 + Git 仓库」两层处理：

1. **本地模板**：脚手架项目里有一个 `templates/` 目录，长这样：

   ```bash
   templates/
     react-spa-vite/
       package.json
       src/
       ...
     react-admin/
       package.json
       src/
       ...
   ```

2. **远程模板**（可选）：支持配置 Git 仓库地址，按需从远程拉取一些大模板。

生成项目的核心步骤：

```js
async function createProject(targetDir, options) {
  const { template, useEslint, usePrettier } = options;

  // 1. 复制模板
  const templateDir = path.resolve(__dirname, "../templates", template);
  await fs.copy(templateDir, targetDir);

  // 2. 替换 package.json 里的 name
  const pkgPath = path.join(targetDir, "package.json");
  const pkg = await fs.readJson(pkgPath);
  pkg.name = path.basename(targetDir);

  // 按开关注入依赖示意
  if (!useEslint) {
    delete pkg.devDependencies.eslint;
    delete pkg.scripts.lint;
  }

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  // 3. 打印下一步指引
  console.log();
  console.log(`cd ${path.basename(targetDir)}`);
  console.log("pnpm install");
  console.log("pnpm dev");
}
```

一开始没有做太多复杂逻辑，能稳定把模板项目「抄一份 + 改名 + 可运行」就足够用了。

---

## 六、一些实践中的小经验

1. **尽量少做「魔法」**  
   脚手架可以帮忙做重复工作，但不要把生成出来的项目搞得过于黑盒。生成后的项目结构和配置，最好一眼能看懂。

2. **模板里先把细节打磨好**  
   把 CI、Lint、提交规范之类的东西先在模板里打磨稳定，再推广到脚手架。否则脚手架每次更新模板，很容易给别人引入新坑。

3. **版本号和变更记录要写清楚**  
   脚手架本身也要发版本，给使用方一个简单的 CHANGELOG，说明每个版本做了什么变更，避免「升级脚手架之后项目就跑不动」的尴尬。

4. **不要一上来就追求“大而全”**  
   一开始先解决 60% 最常见的场景（比如 React SPA），等这条链路跑顺了，再慢慢往外扩。前期做太大，脚手架自己也会很难维护。

---

## 七、小结

这次做前端脚手架，更多是从「自己每天在干的重复事」里挖掘出来的需求：

- 新项目创建流程统一了；
- 常用工具（Lint、格式化、脚本）默认就位；
- 项目结构更一致，后续维护和迁移都轻松很多。

脚手架本身不算复杂，但只要真的落到日常工作里，每次新开一个项目、几行命令就能跑起来，那种“少踩一点老坑”的感觉还是挺明显的。
