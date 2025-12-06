'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Github, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function TestGithubAuthPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const supabase = createClient()

  const addResult = (name: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    setResults(prev => [...prev, { name, status, message, details }])
  }

  const testGithubConfig = async () => {
    setResults([])
    setTesting(true)

    try {
      // 测试 1: 检查环境变量
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        addResult('环境变量', 'error', '缺少必要的环境变量')
      } else {
        addResult('环境变量', 'success', '环境变量配置正确', {
          url: supabaseUrl,
          keyLength: supabaseKey.length
        })
      }

      // 测试 2: 检查 Supabase 连接
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        addResult('Supabase 连接', 'error', sessionError.message)
      } else {
        addResult('Supabase 连接', 'success', 'Supabase 连接正常')
      }

      // 测试 3: 获取可用的 OAuth Providers
      addResult('OAuth Providers', 'warning', '正在检查可用的登录方式...', {
        info: '如果 GitHub 未配置，signInWithOAuth 调用将会失败'
      })

      // 测试 4: 尝试初始化 GitHub OAuth（不会实际跳转）
      addResult('GitHub OAuth 配置', 'warning', '点击下方按钮测试 GitHub 登录', {
        note: '如果配置正确，会跳转到 GitHub 授权页面'
      })

    } catch (error: any) {
      addResult('测试异常', 'error', error.message, error)
    } finally {
      setTesting(false)
    }
  }

  const testGithubLogin = async () => {
    try {
      addResult('GitHub 登录', 'warning', '正在跳转到 GitHub...')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        addResult('GitHub 登录', 'error', error.message, {
          code: error.status,
          details: error
        })
      } else {
        addResult('GitHub 登录', 'success', '正在跳转...', data)
      }
    } catch (error: any) {
      addResult('GitHub 登录', 'error', error.message, error)
    }
  }

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Github className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">GitHub 登录测试</h1>
          </div>
          
          {/* 测试按钮 */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={testGithubConfig}
              disabled={testing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  检查中...
                </>
              ) : (
                '检查配置'
              )}
            </button>

            <button
              onClick={testGithubLogin}
              className="flex-1 bg-gray-900 hover:bg-gray-950 text-white font-medium py-3 px-4 rounded-lg transition-colors border border-gray-600 flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              测试 GitHub 登录
            </button>
          </div>

          {/* 测试结果 */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">测试结果</h2>
              
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    {getIcon(result.status)}
                    
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{result.name}</h3>
                      <p className={`text-sm mt-1 ${
                        result.status === 'success' ? 'text-green-400' :
                        result.status === 'error' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {result.message}
                      </p>
                      
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                            查看详情
                          </summary>
                          <pre className="mt-2 p-3 bg-gray-950 rounded text-xs text-gray-300 overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 配置说明 */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <h3 className="text-blue-400 font-medium mb-3">GitHub OAuth 配置要求</h3>
            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
              <li>在 GitHub 创建 OAuth App</li>
              <li>获取 Client ID 和 Client Secret</li>
              <li>在 Supabase Dashboard 启用 GitHub Provider</li>
              <li>配置正确的 Callback URL</li>
            </ol>
            <a
              href="/github-setup-guide"
              className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm"
            >
              查看详细配置指南 →
            </a>
          </div>

          {/* 常见错误 */}
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <h3 className="text-red-400 font-medium mb-3">常见错误</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>❌ <strong>Provider not enabled</strong>: GitHub Provider 未在 Supabase 启用</li>
              <li>❌ <strong>Invalid credentials</strong>: Client ID/Secret 配置错误</li>
              <li>❌ <strong>Redirect URI mismatch</strong>: Callback URL 配置不匹配</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ← 返回登录页面
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

