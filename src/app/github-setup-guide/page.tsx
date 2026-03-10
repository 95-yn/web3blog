export default function GithubSetupGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-6">GitHub OAuth 配置指南</h1>
          
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-6">
            <p className="text-blue-400 m-0">
              完整配置需要约 5-10 分钟。请按照以下步骤操作。
            </p>
          </div>

          {/* 步骤 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">步骤 1: 创建 GitHub OAuth App</h2>
            
            <ol className="space-y-4 text-gray-300">
              <li>
                <strong className="text-white">访问 GitHub 开发者设置</strong>
                <div className="mt-2 p-3 bg-gray-900 rounded-lg">
                  <a 
                    href="https://github.com/settings/developers" 
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 break-all"
                  >
                    https://github.com/settings/developers
                  </a>
                </div>
              </li>

              <li>
                <strong className="text-white">点击 "OAuth Apps" 标签</strong>
              </li>

              <li>
                <strong className="text-white">点击 "New OAuth App" 按钮</strong>
              </li>

              <li>
                <strong className="text-white">填写应用信息：</strong>
                <div className="mt-2 space-y-2">
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Application name:</p>
                    <code className="text-green-400">一一的个人小站</code>
                    <p className="text-xs text-gray-500 mt-1">（或任何您喜欢的名称）</p>
                  </div>

                  <div className="p-3 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Homepage URL:</p>
                    <code className="text-green-400">http://localhost:3000</code>
                    <p className="text-xs text-gray-500 mt-1">（开发环境）</p>
                  </div>

                  <div className="p-3 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Application description:</p>
                    <code className="text-green-400">一一的个人小站（Supabase 登录）</code>
                    <p className="text-xs text-gray-500 mt-1">（可选）</p>
                  </div>

                  <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <p className="text-sm text-red-400 mb-1 font-semibold">⚠️ Authorization callback URL:</p>
                    <code className="text-yellow-400">https://kbgqsyjcqlszgzoftitx.supabase.co/auth/v1/callback</code>
                    <div className="mt-2 text-xs text-gray-300">
                      <p className="font-semibold text-white mb-1">重要说明：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>这个 URL <strong>必须使用您的 Supabase 项目 URL</strong></li>
                        <li><strong>不是</strong> localhost:3000</li>
                        <li>格式：<code className="text-yellow-400">https://[项目ID].supabase.co/auth/v1/callback</code></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <strong className="text-white">点击 "Register application"</strong>
              </li>

              <li>
                <strong className="text-white">保存凭证：</strong>
                <div className="mt-2 space-y-2">
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Client ID:</p>
                    <code className="text-green-400">复制并保存（自动显示）</code>
                  </div>
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Client Secret:</p>
                    <code className="text-green-400">点击 "Generate a new client secret" 然后复制</code>
                    <p className="text-xs text-red-400 mt-1">⚠️ Secret 只显示一次，请立即保存！</p>
                  </div>
                </div>
              </li>
            </ol>
          </section>

          {/* 步骤 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">步骤 2: 在 Supabase 配置 GitHub Provider</h2>
            
            <ol className="space-y-4 text-gray-300">
              <li>
                <strong className="text-white">访问 Supabase Dashboard</strong>
                <div className="mt-2 p-3 bg-gray-900 rounded-lg">
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    https://supabase.com/dashboard
                  </a>
                </div>
              </li>

              <li>
                <strong className="text-white">选择您的项目</strong>
                <p className="text-sm text-gray-400 mt-1">项目 ID: kbgqsyjcqlszgzoftitx</p>
              </li>

              <li>
                <strong className="text-white">进入 Authentication → Providers</strong>
              </li>

              <li>
                <strong className="text-white">找到并展开 "GitHub" provider</strong>
              </li>

              <li>
                <strong className="text-white">配置 GitHub Provider：</strong>
                <div className="mt-2 space-y-2">
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" disabled checked />
                      <span className="text-green-400">Enable GitHub provider</span>
                    </label>
                    <p className="text-xs text-gray-400 mt-1">勾选启用</p>
                  </div>

                  <div className="p-3 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Client ID (from GitHub):</p>
                    <input 
                      type="text" 
                      placeholder="粘贴从 GitHub 复制的 Client ID"
                      className="w-full bg-gray-950 border border-gray-600 rounded px-3 py-2 text-white"
                      disabled
                    />
                  </div>

                  <div className="p-3 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Client Secret (from GitHub):</p>
                    <input 
                      type="password" 
                      placeholder="粘贴从 GitHub 复制的 Client Secret"
                      className="w-full bg-gray-950 border border-gray-600 rounded px-3 py-2 text-white"
                      disabled
                    />
                  </div>
                </div>
              </li>

              <li>
                <strong className="text-white">点击 "Save"</strong>
                <p className="text-sm text-green-400 mt-1">✅ 配置保存后会立即生效</p>
              </li>
            </ol>
          </section>

          {/* 步骤 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">步骤 3: 验证配置</h2>
            
            <ol className="space-y-4 text-gray-300">
              <li>
                <strong className="text-white">确认环境变量</strong>
                <div className="mt-2 p-3 bg-gray-900 rounded-lg">
                  <code className="text-green-400 block">cat .env.local</code>
                  <p className="text-xs text-gray-400 mt-2">应该包含：</p>
                  <pre className="text-xs text-gray-300 mt-1 overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://kbgqsyjcqlszgzoftitx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`}
                  </pre>
                </div>
              </li>

              <li>
                <strong className="text-white">重启开发服务器</strong>
                <div className="mt-2 p-3 bg-gray-900 rounded-lg">
                  <code className="text-green-400 block">npm run dev</code>
                </div>
              </li>

              <li>
                <strong className="text-white">访问测试页面</strong>
                <div className="mt-2 p-3 bg-gray-900 rounded-lg">
                  <a href="/test-github" className="text-blue-400 hover:text-blue-300">
                    http://localhost:3000/test-github
                  </a>
                </div>
              </li>

              <li>
                <strong className="text-white">点击 "测试 GitHub 登录"</strong>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-green-400">✅ 成功：会跳转到 GitHub 授权页面</p>
                  <p className="text-red-400">❌ 失败：检查错误信息</p>
                </div>
              </li>
            </ol>
          </section>

          {/* 常见问题 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">常见问题</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <h3 className="text-red-400 font-semibold mb-2">
                  ❌ Error: Provider not enabled
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>原因：</strong>GitHub Provider 未在 Supabase 启用
                </p>
                <p className="text-sm text-gray-300">
                  <strong>解决：</strong>在 Supabase Dashboard → Authentication → Providers 中启用 GitHub
                </p>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <h3 className="text-red-400 font-semibold mb-2">
                  ❌ Error: redirect_uri_mismatch
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>原因：</strong>Callback URL 配置不正确
                </p>
                <p className="text-sm text-gray-300">
                  <strong>解决：</strong>确保 GitHub OAuth App 的 Callback URL 是：
                  <code className="block mt-1 text-yellow-400">
                    https://kbgqsyjcqlszgzoftitx.supabase.co/auth/v1/callback
                  </code>
                </p>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <h3 className="text-red-400 font-semibold mb-2">
                  ❌ Error: Invalid client credentials
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>原因：</strong>Client ID 或 Client Secret 错误
                </p>
                <p className="text-sm text-gray-300">
                  <strong>解决：</strong>重新检查并复制 GitHub OAuth App 的凭证
                </p>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                <h3 className="text-yellow-400 font-semibold mb-2">
                  ⚠️ 授权后没有跳转
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>原因：</strong>回调路由未正确处理
                </p>
                <p className="text-sm text-gray-300">
                  <strong>解决：</strong>检查 <code>src/app/auth/callback/route.ts</code> 文件是否存在
                </p>
              </div>
            </div>
          </section>

          {/* 快速检查清单 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">快速检查清单</h2>
            
            <div className="p-4 bg-gray-900 rounded-lg">
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>GitHub OAuth App 已创建</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>Callback URL 使用 Supabase URL（不是 localhost）</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>已复制 Client ID 和 Client Secret</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>在 Supabase 启用了 GitHub Provider</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>在 Supabase 填入了正确的 Client ID 和 Secret</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>.env.local 包含正确的 Supabase URL 和 Key</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>已重启开发服务器</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 底部按钮 */}
          <div className="flex gap-4 mt-8">
            <a
              href="/test-github"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
            >
              测试 GitHub 登录
            </a>
            <a
              href="/login"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
            >
              返回登录页面
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

