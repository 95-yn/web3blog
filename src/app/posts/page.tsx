'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GlobalNav from '@/components/layout/GlobalNav'
import { BookOpen, Plus, Edit, Trash2, Eye, Heart, Lock } from 'lucide-react'
import type { Article } from '@/lib/database/articles'
import { web3Toast } from '@/lib/toast'
import { isAdmin } from '@/lib/auth/permissions'

export default function PostsPage() {
  const [user, setUser] = useState<any>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    loadArticles()
    checkAdminStatus()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
    }
  }

  async function checkAdminStatus() {
    const adminStatus = await isAdmin()
    setIsUserAdmin(adminStatus)
  }

  async function loadArticles() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('加载文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteArticle(id: string) {
    // 使用 Web3 风格的确认对话框
    const confirmed = await web3Toast.confirm(
      '确定要删除这篇文章吗？',
      '删除后将无法恢复，请谨慎操作'
    )
    
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error

      // 刷新列表
      web3Toast.success('文章已删除', '操作成功完成')
      loadArticles()
    } catch (error) {
      console.error('删除失败:', error)
      web3Toast.error('删除失败', '请稍后重试')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* 全局导航栏 */}
      <GlobalNav />

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">
              文章管理
              {!isUserAdmin && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  （只读模式）
                </span>
              )}
            </h1>
          </div>
          {isUserAdmin ? (
            <Link
              href="/posts/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105 transform"
            >
              <Plus className="w-4 h-4" />
              新建文章
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg cursor-not-allowed" title="仅管理员可创建文章">
              <Lock className="w-4 h-4" />
              新建文章
            </div>
          )}
        </div>
        <div className="mb-6">
          <p className="text-gray-400">
            共 <span className="text-white font-semibold">{articles.length}</span> 篇文章
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              还没有文章
            </h3>
            <p className="text-gray-400 mb-6">
              开始创建您的第一篇文章吧！
            </p>
            <Link
              href="/posts/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              新建文章
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden group hover:border-blue-500/50 transition-all flex flex-col"
              >
                {/* 封面图 - 调整为更小的比例 */}
                <div className="h-40 bg-gray-900 overflow-hidden relative">
                  {article.cover_image ? (
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-gray-900">
                      <BookOpen className="w-12 h-12 text-blue-400/50 mb-2" />
                      <span className="text-xs text-gray-500">暂无封面</span>
                    </div>
                  )}
                  {/* 状态标签移到封面上 */}
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full backdrop-blur-md ${
                      article.status === 'published'
                        ? 'bg-green-500/80 text-white'
                        : article.status === 'draft'
                        ? 'bg-yellow-500/80 text-white'
                        : 'bg-gray-500/80 text-white'
                    }`}
                  >
                    {article.status === 'published'
                      ? '已发布'
                      : article.status === 'draft'
                      ? '草稿'
                      : '已归档'}
                  </span>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  {/* 标题 - 固定2行高度 */}
                  <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 h-12 group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* 摘要 - 固定2行高度，无论有没有内容 */}
                  <div className="h-10 mb-3">
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {article.excerpt || '暂无描述'}
                    </p>
                  </div>

                  {/* 统计信息 */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.view_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {article.like_count}
                    </span>
                    <span className="flex items-center gap-1 ml-auto text-xs text-gray-600">
                      {new Date(article.created_at).toLocaleDateString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="pt-3 border-t border-gray-700 flex items-center gap-2 mt-auto">
                    {isUserAdmin ? (
                      <>
                        <Link
                          href={`/posts/${article.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          编辑
                        </Link>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                          title="删除文章"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <Link
                        href={`/articles/${article.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        查看
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
