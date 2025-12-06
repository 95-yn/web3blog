'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Github, Mail, Lock, Loader2 } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // GitHub 登录
  const handleGithubLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 邮箱密码登录
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      setMessage(null)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setMessage('登录成功！正在跳转...')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || '登录失败，请检查您的邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">欢迎回来</h1>
        <p className="text-gray-400">登录您的账户以继续</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* 成功提示 */}
      {message && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
          <p className="text-green-400 text-sm">{message}</p>
        </div>
      )}

      {/* 邮箱密码登录表单 */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            邮箱地址
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            密码
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 登录按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50 hover:scale-105 transform"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            '登录'
          )}
        </button>
      </form>

      {/* 分隔线 */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-800 text-gray-400">或</span>
        </div>
      </div>

      {/* GitHub 登录按钮 */}
      <button
        onClick={handleGithubLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3.5 px-4 rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-gray-700/50 hover:scale-105 transform"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Github className="w-5 h-5" />
            使用 GitHub 登录
          </>
        )}
      </button>

      {/* 底部提示 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400 mb-4">
          还没有账户？{' '}
          <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            立即注册
          </a>
        </p>
        <p className="text-xs text-gray-500">
          登录即表示您同意我们的{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">
            服务条款
          </a>{' '}
          和{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">
            隐私政策
          </a>
        </p>
      </div>
    </div>
  )
}
