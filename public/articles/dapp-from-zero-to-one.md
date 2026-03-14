# 从 0 到 1 搭建一个 DApp：技术选型、踩坑与实战

**直接上干货，后面墨迹内容可忽略。**

## 推荐技术选型（完整一套）

| 类别           | 选型                                                                                                                     | 说明                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| **前端脚手架** | `npm create vite@latest my-dapp -- --template react-ts` 或 `npx create-next-app@latest my-dapp --ts --eslint --tailwind` | 二选一：Vite 轻量 SPA，Next 要 SEO/接口             |
| **合约脚手架** | `npx hardhat init`（在项目根或单独 repo）                                                                                | 生成合约目录、脚本、测试、配置                      |
| **链上交互**   | viem + wagmi                                                                                                             | 类型好、Hooks 全，与 RainbowKit 配套                |
| **钱包连接**   | RainbowKit                                                                                                               | 装在前端项目里的依赖，提供连接按钮 + 链切换 + Modal |
| **合约开发**   | Hardhat                                                                                                                  | 编译、测试、部署、插件（ethers、verify）            |
| **合约库**     | OpenZeppelin Contracts                                                                                                   | ERC-20/721/1155、AccessControl 等                   |
| **测试网**     | Sepolia                                                                                                                  | 领水方便，生态支持好                                |
| **RPC**        | Alchemy / Infura 免费档（带 apikey）                                                                                     | 避免公共节点限流                                    |
| **托管**       | Vercel（Next）或 Vercel/Netlify（Vite）                                                                                  | 免费档即可上线                                      |

---

**以下为展开说明，可忽略。**

DApp 典型架构：前端（React/Next/Vue 等）→ 钱包（MetaMask 等 Provider）→ RPC 节点 → 智能合约。前端不握私钥，只发起连接/发交易/读合约，由用户钱包确认并签名。

![DApp 典型架构：浏览器前端 → 钱包 Provider → RPC → 链上合约](/images/dapp-architecture.png)

---

## 一、技术选型

### 1. 前端框架

- **React / Next.js**：生态里 DApp 模板、组件库（RainbowKit、ConnectKit 等）大多以 React 为主，Next.js 做 SEO、接口层和部署都很顺手，**首选**。
- **Vue / Nuxt**：也可以用，但现成的「钱包连接 + 链切换」组件相对少，需要自己用 ethers/viem 封装或选 Vue 生态的库（如 web3-vue、Moralis Vue 等）。
- **Vite + React**：轻量、构建快，适合纯前端、对 SEO 要求不高的 DApp。

**建议**：若团队以 React 为主或希望快速接上现成组件库，选 **Next.js（App Router）或 Vite + React**；若已有 Vue 技术栈，可以继续用 Vue，链上交互层用 ethers 或 viem 统一封装。

### 2. 链上交互库

- **ethers.js（v6）**：使用最广，文档多、示例多，`Provider` / `Signer` / `Contract` 抽象清晰，适合从 0 开始学。
- **viem**：类型友好、Tree-shake 好、API 偏组合式，和 **wagmi**（React Hooks）搭配很常见，新项目可以考虑 **viem + wagmi**。
- **web3.js**：老牌库，现在新项目更多选 ethers 或 viem。

**建议**：新手或需要大量抄现有教程时用 **ethers**；追求类型和 Hooks 体验、愿意看 viem/wagmi 文档时用 **viem + wagmi**。

### 3. 钱包连接与链切换

- **RainbowKit**：基于 wagmi，内置多钱包列表、链切换、连接按钮和 Modal，样式可定制，**上手快、推荐**。
- **ConnectKit**：同样基于 wagmi，UI 风格不同，功能类似（连接、链、网络切换）。
- **Web3Modal（WalletConnect 官方）**：支持注入钱包 + WalletConnect 扫码，适合「桌面 + 移动端」都要覆盖的场景。
- **自己用 ethers/viem + window.ethereum**：不引入上述组件库时，自己调 `eth_requestAccounts`、`wallet_switchEthereumChain`、`wallet_addEthereumChain`，灵活但要自己处理连接状态、链不一致、重连等。

**建议**：想少写样板代码、尽快出「连接钱包 + 换链」的界面，用 **RainbowKit 或 ConnectKit**；需要 WalletConnect 扫码或深度定制再选 Web3Modal 或自研。

### 4. 合约开发与部署

- **Hardhat**：插件多、文档全、社区示例多，**主流选择**；内置网络、编译、测试、部署脚本。
- **Foundry**：用 Rust 写测试、执行快，适合对性能与测试体验有要求的团队；部署和脚本也可用 Forge。
- **Remix**：浏览器里写合约、部署、调试，适合快速验证或学习，生产项目一般还是用 Hardhat/Foundry 做工程化。

**建议**：第一版或团队更熟悉 JS/TS 用 **Hardhat**；重视测试速度和命令行体验可上 **Foundry**，或 Hardhat + Foundry 测试混用。

### 5. 链与测试网

- **主网**：以太坊主网（chainId 1）Gas 贵，适合正式上线；其他 EVM 链（Polygon、Arbitrum、Base、BSC 等）Gas 低、确认快，按业务选。
- **测试网**：Sepolia、Goerli（逐步废弃）、Base Sepolia、Arbitrum Sepolia 等，领水用对应水龙头，部署和联调阶段用测试网可省成本。

**建议**：开发与联调用 **测试网**；上线前在目标主网再跑一遍流程并做一次小金额真实交易验证。

---

## 二、常用技术栈组合

下面几套是实际项目里常见的组合，可按团队情况选一套为主再微调。

| 场景            | 前端         | 链上/钱包连接             | 合约开发 | 说明                 |
| --------------- | ------------ | ------------------------- | -------- | -------------------- |
| 快速出 Demo     | Vite + React | RainbowKit + wagmi + viem | Hardhat  | 文档多、组件现成     |
| 要 SEO、要接口  | Next.js      | RainbowKit + wagmi + viem | Hardhat  | 兼顾 SSR/API 与 DApp |
| 最小依赖        | 任意         | ethers + window.ethereum  | Hardhat  | 自己封装连接与链切换 |
| 类型 + 测试体验 | React/Next   | wagmi + viem              | Foundry  | 类型好、测试快       |

### 脚手架与初始化

搭建项目时通常会用到**前端脚手架**和**合约脚手架**（或一体化 DApp 模板），选对能少配很多环境。注意：**Vite / Next 是脚手架**（用来创建项目），**RainbowKit 是钱包连接库**（创建完项目后 `pnpm add @rainbow-me/rainbowkit` 装进去），两者不是二选一。

**前端脚手架（任选其一）**

| 脚手架               | 命令示例                                                      | 说明                                                                   |
| -------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Create Next App**  | `npx create-next-app@latest my-dapp --ts --eslint --tailwind` | Next.js 官方，支持 App Router、TS、Tailwind，适合要 SEO 或 API 的 DApp |
| **Vite**             | `npm create vite@latest my-dapp -- --template react-ts`       | 官方 Vite + React + TS，轻量、构建快，适合纯前端 DApp                  |
| **Create React App** | `npx create-react-app my-dapp --template typescript`          | 经典 CRA，体积偏大、脚本多，新项目更推荐 Vite 或 Next                  |

**合约脚手架**

| 脚手架      | 命令示例           | 说明                                                                |
| ----------- | ------------------ | ------------------------------------------------------------------- |
| **Hardhat** | `npx hardhat init` | 生成 `contracts/`、`scripts/`、`test/`、`hardhat.config.ts`，最常用 |
| **Foundry** | `forge init`       | 生成 `src/`、`test/`、`script/`，Rust 测试，无 Node 依赖            |

**一体化 DApp 脚手架（前端 + 钱包 + 合约 一锅端）**

| 脚手架/模板                    | 说明                                                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **create-wagmi**（wevm）       | `npm create wagmi@latest`，基于 Vite + React + wagmi + viem，内置连接、链、基础配置，**无合约**，要自己加 Hardhat 或单独起合约项目 |
| **Scaffold-ETH 2**（EthWorks） | 前端（React + ethers）+ 合约（Hardhat）+ 部署脚本在一个仓库，跑 `yarn install && yarn chain` 起本地链，适合学习或快速全栈原型      |
| **Next.js + wagmi 模板**       | 官方或社区模板，如 `create-next-app` 时选 with-wagmi 或手动接 wagmi，合约仍单独 Hardhat                                            |
| **thirdweb**                   | `npx thirdweb create`，可选 React + 合约，带 Dashboard 和 SDK，偏「平台化」开发                                                    |

**本文实际推荐用的**：前端用 **Create Next App** 或 **Vite (react-ts)** 起手，合约用 **`npx hardhat init`** 在当前项目里建 `contracts/`，或单独一个仓库；若想「一条命令跑起前端+链+合约」，可用 **Scaffold-ETH 2** 或 **create-wagmi + 同仓 Hardhat**。完整选型表已挪到文首。

**例子**：若你要做一个「NFT 展示 + 铸造」的小站，选「快速出 Demo」这一行即可：`npm create vite@latest nft-mint -- --template react-ts` 起前端，`npx hardhat init` 在项目里建 `contracts/`，RainbowKit + wagmi 负责连接和换链，合约写一份 ERC-721 部署到 Sepolia，前端用 wagmi 的 `useContractRead` / `useContractWrite` 调 `mint`，就能跑通完整流程。

---

## 三、实际搭建流程（从 0 到 1）

整体流程可以概括为下面五步，按顺序做下来就能从零搭出一个可用的 DApp。

![从 0 到 1 搭建 DApp 的五个步骤](/images/dapp-build-flow.png)

### 步骤 1：初始化项目

- **前端**：用上文的脚手架之一创建项目，例如
  - Next：`npx create-next-app@latest my-dapp --ts --eslint --tailwind`
  - Vite：`npm create vite@latest my-dapp -- --template react-ts`  
    然后安装链上与钱包相关依赖，例如：`pnpm add viem wagmi @tanstack/react-query @rainbow-me/rainbowkit`（若用 RainbowKit + wagmi）。
- **合约**：在项目根目录执行 `npx hardhat init`，生成 `contracts/`、`scripts/`、`test/` 和 `hardhat.config.ts`；若要单独仓库，可另建一个目录再 `npx hardhat init`。
- 配置 **TypeScript**、**ESLint**、环境变量（如 `NEXT_PUBLIC_CHAIN_ID`、`NEXT_PUBLIC_RPC_URL`），避免把 RPC URL、合约地址写死在代码里。

### 步骤 2：合约开发与部署

- 在项目里建 `contracts/`（或单独一个合约仓库），用 Hardhat/Foundry 写合约、写测试、本地或测试网部署。
- 部署后拿到**合约地址**和 **ABI**，前端通过 ABI + 地址创建合约实例并调用。ABI 可复制到前端仓库或通过构建脚本生成 JSON 供前端引用。
- 若有多链，每个链部署一次并记下对应合约地址，前端按 chainId 选地址。

### 步骤 3：前端对接钱包与合约

- **连接钱包**：用 RainbowKit/ConnectKit 的 `<ConnectButton />` 或自己调 `window.ethereum.request({ method: 'eth_requestAccounts' })`，拿到 `accounts[0]` 作为当前账户。
- **链一致**：在发交易或读合约前，先判断当前链是否为目标链（如 `chainId === 1`），若不是则 `wallet_switchEthereumChain` 或 `wallet_addEthereumChain`，再继续操作。
- **读合约**：用 `provider.getBalance`、`contract.balanceOf()` 等**只读调用**，不需要用户签名，直接 `contract.read.xxx()` 或 `contract.xxx()` 即可。
- **写合约**：用 `contract.write.xxx()` 或 `contract.xxx()` 并传 `signer`，会弹出钱包确认，返回 tx hash；再轮询或监听交易回执，根据 `status === 1` 判断成功。

**例子**：用户点击「铸造」时，先检查 `chainId === 11155111`（Sepolia）；若不是，先 `wallet_switchEthereumChain({ chainId: '0xaa36a7' })` 再调 `mint()`。读「当前已铸造数量」用 `contract.totalSupply()`，无需弹窗；调 `contract.mint()` 才会唤起钱包并扣 Gas。

### 步骤 4：环境变量与多链配置

- 将链 ID、RPC URL、合约地址、区块浏览器等放在环境变量或配置文件里，按环境（dev/test/mainnet）切换。
- 多链时用「chainId → 合约地址 / RPC」的映射，避免硬编码。

### 步骤 5：上线前检查

- 在目标链（测试网或主网）完整走一遍：连接钱包 → 换链 → 读数据 → 发一笔真实交易 → 查区块浏览器确认。
- 检查敏感信息：私钥、助记词绝不能进前端代码或仓库；RPC URL 若带 key，注意不要提交到公开仓库或暴露在客户端可抓包的地方（必要时用自建网关或服务端代理）。

---

## 四、踩坑与注意点

### 钱包与连接

- **连接时机**：页面加载时 `window.ethereum` 可能还未注入（扩展未就绪），需要监听 `eip6963:announceProvider` 或延迟一下再 `request({ method: 'eth_requestAccounts' })`，否则可能报错「Provider 不存在」。
- **多钱包并存**：用 EIP-6963 可发现多个 Provider，让用户选；若只认 `window.ethereum`，要说明「请确保已安装并启用某钱包」。
- **链不一致**：用户连的是主网，你 DApp 只部署在测试网时，读到的可能是错链上的合约或报错。发交易前务必检查 `chainId`，不对就引导切换或提示。

### 交易与 Gas

- **Gas 估算**：`estimateGas` 可能失败（合约 revert、状态不符合），要用 try/catch，失败时给用户明确提示或改用静态 Gas 上限。
- **用户拒绝**：用户在钱包里点「拒绝」时，`request` 会 reject，不要当成系统错误，应提示「已取消」。
- **长时间 pending**：Gas 设太低可能导致交易长时间不进块，需要提示用户加速或取消（部分钱包支持）。

### 错误与安全

- **合约 revert 信息**：部分节点会在回执里返回 revert reason，前端可解析后展示「余额不足」「未授权」等，而不是笼统的「交易失败」。
- **签名陷阱**：`personal_sign`、`eth_signTypedData_v4` 只应签明确可读的结构化数据（如 EIP-712），不要让用户签任意 hex，避免被钓鱼授权。
- **私钥与环境**：私钥、助记词仅用于部署脚本或本地测试，且不要提交到 Git；生产环境用环境变量或密钥管理服务，前端永远不接触私钥。

### RPC 与限流

- 公共 RPC 有频率限制，请求多了会 429 或封 IP；可申请 **Infura、Alchemy、QuickNode** 等带 key 的 RPC，或自建节点，并在前端配置主/备 RPC，失败时切换。

**例子**：前端每 5 秒轮询一次余额和 totalSupply，公共 Sepolia RPC 可能几十次请求后就限流；换成 Alchemy 的免费 key（同一 URL 加 `?apikey=xxx`），一般能撑到日请求量上万再考虑升级。

---

## 五、成本

### 链上成本

- **Gas**：每笔写操作（转账、调用合约写方法）都要付 Gas；主网贵，L2 和侧链便宜。测试网用免费水龙头即可。
- **合约部署**：一次性成本，合约越大、构造函数越重，部署越贵；可先在测试网测够再主网部署。

### 基础设施成本

- **RPC**：免费公共节点有上限；Infura/Alchemy 等免费档够小项目用，量大需付费或自建节点。
- **前端托管**：Vercel、Netlify、Cloudflare Pages 免费档可支撑小型 DApp；若需自有域名、更高可用性，再考虑付费或自建。
- **域名**：普通域名即可，无特殊要求。
- **监控与分析**：可选 Sentry、Analytics 等，按用量计费；自建则主要是服务器与人力成本。

整体上，**开发和测试阶段以测试网 + 免费 RPC + 免费托管**即可；**主网上线后**成本主要在 Gas 和可选的专业 RPC/监控上。

**例子**：一个小型 NFT 铸造站，合约部署在 Polygon 上可能一次 0.5～2 USD；前端放 Vercel 免费档、RPC 用 Alchemy 免费档，月成本接近 0；若同样的合约部署在以太坊主网，仅部署就可能几十到上百 USD，每笔 mint 的 Gas 也明显更贵。

---

## 六、性能优化

### 合约与链上

- **读多写少**：能只读的不发交易；批量读用 multicall（一次 RPC 多合约多方法）减少请求次数。
- **事件与索引**：前端监听合约事件比轮询更省 RPC；索引参数（indexed）便于按主题过滤。
- **分页与懒加载**：列表类数据（如 NFT、历史记录）按页或按块范围拉取，避免一次请求过多。

### 前端

- **缓存**：链上数据变化不频繁的（如余额、总量）可短时缓存（几秒到几十秒），减少重复 `balanceOf`、`totalSupply` 等调用。
- **按需加载**：钱包连接、大图表等用动态 import 或懒加载，降低首屏体积。
- **RPC 选择**：同一地域的 RPC 延迟更低；有条件的可对多个 RPC 做简单测速或故障转移，提升可用性与响应速度。

**例子**：首页要展示「当前连接地址的 ETH 余额 + 某 ERC-20 余额 + NFT 数量」，若分别发 3 次 RPC，首屏会慢；用 viem 的 `multicall` 或 ethers 的 `Contract.getFunction().staticCall` 批量读，一次请求返回多个结果，首屏明显更快。

---

## 七、稳定性

- **错误边界**：React 用 Error Boundary 包住钱包与链上数据区域，避免一个组件报错整页白屏。
- **重试与降级**：RPC 请求失败时重试 1～2 次或切换备用 RPC；部分读失败时可用占位或上次成功数据降级展示。
- **连接状态**：钱包断开、锁屏、换账户时，Provider 可能变化，需要监听 `accountsChanged`、`chainChanged`、`disconnect`，及时更新 UI 与合约实例。
- **合约层**：若有暂停、升级机制，前端要能识别合约 revert 或事件，提示「合约维护中」等，而不是笼统报错。

**例子**：用户切到其他标签页再回来，MetaMask 可能已锁屏，此时 `eth_requestAccounts` 会 reject；前端应捕获后提示「请解锁钱包」而不是「连接失败」。同理，用户点了「拒绝」签名，应展示「已取消」而不是红色报错。

---

## 八、开发与学习成本

### 需要补的概念

- **链与钱包**：账户、地址、私钥与签名、Gas、chainId、RPC。
- **合约基础**：Solidity 基本语法、只读 vs 写交易、事件、ABI；若只做前端，至少要知道「读用 call、写用 sendTransaction」。
- **前端**：Provider、Signer、Contract 实例、请求账户、换链、监听事件；ethers 或 viem 的文档过一遍即可上手。

### 学习路径建议

1. 先在一个测试网（如 Sepolia）上部署一份简单合约（如 ERC-20 或一个简单计数器），用 Remix 或 Hardhat 部署并调用。
2. 再用 React 写一个最小页面：连接钱包、读余额、发一笔转账或调一次合约写方法，熟悉「连接 → 读 → 写」的完整链路。
3. 在此基础上加链切换、多合约、事件监听；最后再考虑性能、稳定性与组件库选型。

有前端经验的话，**1～2 周**能完成「从零到可用的 DApp 雏形」；要写得稳、体验好，再根据项目迭代。

**例子**：第一周可以这样排：Day 1～2 用 Remix 或 Hardhat 在 Sepolia 部署一个简单 ERC-20 或计数器合约并手动调用；Day 3～4 用 Vite + React + ethers 写「连接钱包 + 显示余额 + 发一笔 transfer」；Day 5～7 加上 RainbowKit、换链、读合约状态和调写方法，并跑通「连接 → 换链 → 读 → 写」全流程。

---

## 九、Web3 常用组件库与工具

### 钱包连接与链

- **RainbowKit**：React 组件，连接按钮 + 链切换 + Modal，基于 wagmi，样式可配。
- **ConnectKit**：类似 RainbowKit，不同 UI 风格。
- **Web3Modal**：WalletConnect 官方，支持注入钱包 + 扫码，多链。
- **wagmi**：React Hooks（useAccount、useBalance、useContractRead、useContractWrite、useSwitchChain 等），和 viem 搭配使用。
- **viem**：轻量、类型好的链上库，含 chains、client、contract 等，可替代 ethers 做读写与类型推导。

### 合约与链上

- **ethers**：Provider/Signer/Contract，文档与示例最多。
- **OpenZeppelin Contracts**：ERC-20、ERC-721、ERC-1155、AccessControl、Pausable 等标准实现，合约开发常用。
- **OpenZeppelin Defender**：合约自动化、升级与监控（可选，有成本）。

### 全栈/低代码

- **thirdweb**：提供合约 SDK、React 组件、部署与托管，适合快速搭 DApp 或原型。
- **Moralis**：API 与 SDK（余额、NFT、价格等），偏后端与数据聚合，可按需选用。

### 开发与部署

- **Hardhat**：编译、测试、部署、插件（如 ethers、verify）。
- **Foundry**：Forge 测试、Cast 调用、Anvil 本地链。
- **Remix**：浏览器 IDE，适合学习与快速验证。

### 基础设施与调试

- **Infura / Alchemy / QuickNode**：RPC 与 API，带 key 的免费档可开发测试。
- **Etherscan / Blockscout**：区块浏览器，查交易、合约、验证源码。
- **Tenderly**：交易模拟与调试（可选）。

实际选型时不必全上：**前端用 RainbowKit + wagmi + viem，合约用 Hardhat + OpenZeppelin**，就能覆盖大部分 DApp 从 0 到 1 的需求；再按需要加 Web3Modal（扫码）、thirdweb（快速原型）或 Moralis（链上数据 API）即可。

---

## 十、小结

从 0 到 1 搭 DApp 时，先把**技术栈定下来**（前端框架 + 链上库 + 钱包连接方式 + 合约工具链），再按「初始化项目 → 合约开发与部署 → 前端对接钱包与合约 → 环境与多链 → 上线前检查」走一遍。过程中注意**钱包注入时机、链一致、Gas 与用户拒绝、私钥安全、RPC 限流**等坑；在**成本、性能、稳定性**上做适度取舍（测试网 + 缓存 + 错误边界 + 多 RPC）。学习和选型阶段可多用现成组件库（RainbowKit、wagmi、OpenZeppelin），减少重复造轮子，把精力放在业务逻辑与用户体验上。
