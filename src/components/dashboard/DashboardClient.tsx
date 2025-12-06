'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import GlobalNav from '@/components/layout/GlobalNav'
import { User as UserIcon, Mail, Calendar } from 'lucide-react'

interface DashboardClientProps {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // 获取用户元数据
  const userMetadata = user.user_metadata
  const avatarUrl = userMetadata?.avatar_url
  const fullName = userMetadata?.full_name || userMetadata?.name
  const userName = userMetadata?.user_name || userMetadata?.preferred_username

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* 全局导航栏 */}
      <GlobalNav />

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
          我的仪表板
        </h1>
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">个人信息</h2>
          
          <div className="flex items-start gap-6">
            {/* 头像 */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="用户头像"
                className="w-24 h-24 rounded-full border-4 border-gray-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
                <UserIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* 用户信息 */}
            <div className="flex-1 space-y-4">
              {fullName && (
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">姓名</p>
                    <p className="text-white font-medium">{fullName}</p>
                  </div>
                </div>
              )}

              {userName && (
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">用户名</p>
                    <p className="text-white font-medium">@{userName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">邮箱</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">注册时间</p>
                  <p className="text-white font-medium">
                    {new Date(user.created_at).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 认证提供商信息 */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">认证信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">认证方式</p>
                <p className="text-white font-medium capitalize">
                  {user.app_metadata.provider || 'email'}
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">用户 ID</p>
                <p className="text-white font-mono text-sm truncate">
                  {user.id}
                </p>
              </div>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">快速访问</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/"
                className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 hover:from-blue-800/40 hover:to-blue-700/40 rounded-lg p-4 transition-all duration-200 border border-blue-700/50 hover:border-blue-600 group hover:scale-105 transform"
              >
                <h4 className="text-white font-medium group-hover:text-blue-300 transition-colors flex items-center gap-2">
                  🏠 返回首页
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  查看最新文章和动态
                </p>
              </Link>
              <Link
                href="/posts/new"
                className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 hover:from-purple-800/40 hover:to-purple-700/40 rounded-lg p-4 transition-all duration-200 border border-purple-700/50 hover:border-purple-600 group hover:scale-105 transform"
              >
                <h4 className="text-white font-medium group-hover:text-purple-300 transition-colors flex items-center gap-2">
                  ✍️ 写文章
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  创作新的文章内容
                </p>
              </Link>
              <Link
                href="/posts"
                className="bg-gradient-to-br from-pink-900/30 to-pink-800/30 hover:from-pink-800/40 hover:to-pink-700/40 rounded-lg p-4 transition-all duration-200 border border-pink-700/50 hover:border-pink-600 group hover:scale-105 transform"
              >
                <h4 className="text-white font-medium group-hover:text-pink-300 transition-colors flex items-center gap-2">
                  📖 文章管理
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  管理您的所有文章
                </p>
              </Link>
              <Link
                href="/todos"
                className="bg-gradient-to-br from-green-900/30 to-green-800/30 hover:from-green-800/40 hover:to-green-700/40 rounded-lg p-4 transition-all duration-200 border border-green-700/50 hover:border-green-600 group hover:scale-105 transform"
              >
                <h4 className="text-white font-medium group-hover:text-green-300 transition-colors flex items-center gap-2">
                  📝 待办事项
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  管理任务和待办事项
                </p>
              </Link>
            </div>
          </div>

          {/* 调试信息（可选，生产环境删除） */}
          <details className="mt-8 pt-8 border-t border-gray-700">
            <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
              查看完整用户数据（开发模式）
            </summary>
            <pre className="mt-4 p-4 bg-gray-900 rounded-lg overflow-auto text-xs text-gray-300">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      </main>
    </div>
  )
}

