# iOS 证书类型简单入门

最近在接触 iOS 打包构建，顺手整理一下几种证书的区别和常见使用场景。

---

## 1. 开发证书（iOS Development）

- **用途**：在真机上调试和开发。
- **特点**：
  - 只能安装在添加过设备 UDID 的 iPhone / iPad 上。
  - 通过 Xcode 运行 App 到手机上时用到的就是它。
- **谁在用**：
  - 日常写代码、接真机调试的开发同学。

一般流程：在开发者账号里创建开发证书 + 开发描述文件（Provisioning Profile），如果用 Xcode 自动管理签名，勾上 “Automatically manage signing” 通常就能搞定。

---

## 2. 发布证书（iOS Distribution）

发布证书主要对应两个场景：**App Store 发布** 和 **企业内部分发**。

### 2.1 App Store 发行（Apple Distribution / App Store）

- **用途**：把 App 提交到 App Store。
- **特点**：
  - Archive + Upload 到 App Store Connect 时用到。
  - 用户从 App Store 下载到手机上的 App，就是用这类证书签名。
- **谁在用**：
  - 负责打正式包、提审的同学，有时是 CI。

### 2.2 企业内部分发（Enterprise，仅企业账号）

- **用途**：公司内部分发 App，不通过 App Store。
- **特点**：
  - 安装时会提示 “未受信任的企业级开发者”，需要在系统里手动信任。
  - 适合内部工具、测试版本在公司范围内分发。
- **注意**：
  - 苹果现在对企业证书监管比较严格，如果被判定为对外分发，企业证书可能被封。

---

## 3. 描述文件（Provisioning Profile）

证书只是“谁”的身份，**真正决定“哪个 App、能装到哪些设备、以什么形式安装”的，是描述文件**。

可以简单理解为：

> 证书 + App ID（Bundle ID）+ 设备列表 / 分发方式 = 描述文件

常见类型：

- **iOS App Development**：开发用，绑定开发证书，包含设备 UDID 列表。
- **App Store**：绑定发布证书，用于 App Store 正式发布 / TestFlight。
- **Ad Hoc**：灰度分发，不走商店，安装到指定 UDID 的设备。
- **In-House（Enterprise）**：企业内部分发使用。

签名出错时，通常是这三样没对齐：

1. 证书对应的 Team / 类型不对；
2. 描述文件里的 App ID 和工程的 Bundle ID 不一致；
3. 设备 UDID 不在 Development / Ad Hoc 描述文件里。

---

## 4. 推送证书（APNs）

Push 通知涉及到苹果推送服务（APNs）的证书或密钥。

### 4.1 老方式：APNs Development / Production 证书

- 为每个 App 单独生成开发 / 生产推送证书（两个 .cer / .p12）。
- 在服务端配置时，需要分别导入对应环境的证书。

### 4.2 推荐方式：APNs Auth Key（p8）

- 一个 p8 key 可以同时给多个 App 用。
- 配置简单，只用在服务端保存：
  - Team ID
  - Key ID
  - Bundle ID
  - p8 文件内容

推送证书本身不会影响 App 是否能安装，但配置错了，Push 就会发不出去。

---

## 5. 常见组合场景

可以按“我要做什么”来选证书和描述文件组合：

### 5.1 真机调试

- 证书：iOS Development
- 描述文件：iOS App Development
- 设备：已添加 UDID 的开发机

### 5.2 TestFlight / App Store 正式发布

- 证书：iOS Distribution（Apple Distribution）
- 描述文件：App Store

### 5.3 内部灰度（不走商店）

- 证书：iOS Distribution
- 描述文件：Ad Hoc
- 设备：需要预先收集测试机的 UDID

### 5.4 企业内网 App（Enterprise 账号）

- 证书：In-House / Enterprise Distribution
- 描述文件：In-House

---

## 6. 推荐方案

- 企业内部测试：优先使用企业证书做内部分发，方便快速迭代和验证。
- 面向正式用户：使用公司发行证书，将应用通过 App Store 上架发布。
