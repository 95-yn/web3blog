'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function TestAuthPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const addResult = (name: string, status: 'success' | 'error', message: string, details?: any) => {
    setResults(prev => [...prev, { name, status, message, details }])
  }

  const runTests = async () => {
    setResults([])
    setTesting(true)
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    try {
      // 测试 1: Supabase 客户端初始化
      addResult('Supabase 客户端', 'success', '客户端初始化成功', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
      })

      // 测试 2: 获取 Session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        addResult('获取 Session', 'error', sessionError.message)
      } else {
        addResult('获取 Session', 'success', '成功', {
          hasSession: !!sessionData.session,
          user: sessionData.session?.user?.email
        })
      }

      // 测试 3: 测试注册
      const testEmail = `test_${Date.now()}@example.com`
      const testPassword = 'test123456'

      addResult('测试注册', 'success', `准备注册: ${testEmail}`)

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      })

      if (signUpError) {
        addResult('注册测试', 'error', signUpError.message, signUpError)
      } else {
        addResult('注册测试', 'success', '注册成功！', {
          userId: signUpData.user?.id,
          email: signUpData.user?.email,
          hasSession: !!signUpData.session
        })

        // 测试 4: 检查用户是否在数据库
        if (signUpData.user) {
          const { data: userData, error: userError } = await supabase.auth.getUser()
          
          if (userError) {
            addResult('获取用户信息', 'error', userError.message)
          } else {
            addResult('获取用户信息', 'success', '用户已创建', userData.user)
          }
        }

        // 测试 5: 尝试登出再登录
        await supabase.auth.signOut()
        addResult('登出', 'success', '登出成功')

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        })

        if (signInError) {
          addResult('登录测试', 'error', signInError.message, signInError)
        } else {
          addResult('登录测试', 'success', '登录成功！', {
            hasSession: !!signInData.session,
            email: signInData.user?.email
          })
        }
      }

    } catch (error: any) {
      addResult('测试异常', 'error', error.message, error)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-6">认证功能测试</h1>
          
          <button
            onClick={runTests}
            disabled={testing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
          >
            {testing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                测试中...
              </>
            ) : (
              '开始测试'
            )}
          </button>

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
                    {result.status === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{result.name}</h3>
                      <p className={`text-sm mt-1 ${
                        result.status === 'success' ? 'text-green-400' : 'text-red-400'
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

          {/* 说明 */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <h3 className="text-blue-400 font-medium mb-2">测试说明</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 此测试会自动注册一个测试账户</li>
              <li>• 测试登录功能</li>
              <li>• 验证 Supabase 连接是否正常</li>
              <li>• 查看详细的错误信息</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/register"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ← 返回注册页面
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

