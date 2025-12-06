'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, User as UserIcon, Home, Menu, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface GlobalNavProps {
  transparent?: boolean
}

export default function GlobalNav({ transparent = false }: GlobalNavProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('获取用户信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  const navClasses = transparent
    ? 'bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50'
    : 'bg-gray-900/80 backdrop-blur-xl border-b border-gray-700'

  return (
    <nav className={`sticky top-0 z-50 ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / 网站名 */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">W3</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Web3 DApp
            </span>
          </Link>

          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-8 bg-gray-700 animate-pulse rounded"></div>
            ) : user ? (
              <>
                {/* 用户信息 */}
                <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || '用户'}
                    </span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>
                </div>

                {/* 快捷链接 */}
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                >
                  控制台
                </Link>

                <Link
                  href="/posts"
                  className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                >
                  文章
                </Link>

                {/* 退出登录按钮 */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50 hover:scale-105 transform"
                >
                  <LogOut className="w-4 h-4" />
                  退出
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                >
                  <Home className="w-4 h-4" />
                  首页
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105 transform"
                >
                  注册
                </Link>
              </>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            {loading ? (
              <div className="px-4 py-2">
                <div className="w-full h-8 bg-gray-700 animate-pulse rounded"></div>
              </div>
            ) : user ? (
              <div className="space-y-2">
                {/* 用户信息 */}
                <div className="px-4 py-3 bg-gray-800/50 rounded-lg mx-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || '用户'}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg mx-2 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  控制台
                </Link>
                <Link
                  href="/posts"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg mx-2 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  文章管理
                </Link>
                <Link
                  href="/todos"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg mx-2 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  待办事项
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg mx-2 mt-3 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg mx-2 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  首页
                </Link>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg mx-2 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg mx-2 text-center transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

