'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import GlobalNav from '@/components/layout/GlobalNav'
import TiptapEditor from '@/components/editor/TiptapEditor'
import { Save, Eye, ArrowLeft, Trash2, Lock } from 'lucide-react'
import type { Article } from '@/lib/database/articles'
import Link from 'next/link'
import { web3Toast } from '@/lib/toast'
import { isAdmin } from '@/lib/auth/permissions'

export default function EditPostPage() {
  const params = useParams()
  const articleId = params.id as string
  
  const [user, setUser] = useState<any>(null)
  const [article, setArticle] = useState<Article | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadArticle()
    }
  }, [user, articleId])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    setUser(user)
    
    // 检查是否是管理员
    const adminStatus = await isAdmin()
    setIsUserAdmin(adminStatus)
    
    if (!adminStatus) {
      web3Toast.error('无权限', '只有管理员可以编辑文章')
      router.push('/posts')
    }
  }

  async function loadArticle() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single()

      if (error) throw error

      if (data.author_id !== user.id) {
        web3Toast.error('您没有权限编辑这篇文章')
        router.push('/posts')
        return
      }

      setArticle(data)
      setTitle(data.title)
      setContent(data.content || '')
      setExcerpt(data.excerpt || '')
      setCoverImage(data.cover_image || '')
      setStatus(data.status)
    } catch (error) {
      console.error('加载文章失败:', error)
      web3Toast.error('加载文章失败')
      router.push('/posts')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(publishNow: boolean = false) {
    if (!title.trim()) {
      web3Toast.warning('请输入文章标题')
      return
    }

    setSaving(true)

    try {
      const articleStatus = publishNow ? 'published' : status
      const updateData: any = {
        title: title.trim(),
        content,
        excerpt: excerpt.trim() || null,
        cover_image: coverImage.trim() || null,
        status: articleStatus,
      }

      // 如果是首次发布，设置发布时间
      if (publishNow && !article?.published_at) {
        updateData.published_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', articleId)

      if (error) throw error

      web3Toast.success(publishNow ? '文章已发布！' : '文章已保存')
      router.push('/posts')
    } catch (error: any) {
      console.error('保存失败:', error)
      web3Toast.error('保存失败', error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    // 使用 Web3 风格的确认对话框
    const confirmed = await web3Toast.confirm(
      '确定要删除这篇文章吗？',
      '此操作不可恢复，请谨慎操作'
    )
    
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)

      if (error) throw error

      web3Toast.success('文章已删除', '即将返回文章列表')
      router.push('/posts')
    } catch (error: any) {
      console.error('删除失败:', error)
      web3Toast.error('删除失败', error.message)
    }
  }

  if (loading || !user || !article) {
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
      
      {/* 编辑工具栏 */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/posts"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              返回列表
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="archived">已归档</option>
              </select>

              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? '保存中...' : '保存'}
              </button>

              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                {saving ? '发布中...' : '发布'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主编辑区 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 标题 */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入文章标题..."
              className="w-full text-4xl font-bold bg-transparent text-white placeholder-gray-600 focus:outline-none"
            />
          </div>

          {/* 封面图 */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              封面图片链接（可选）
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {coverImage && (
              <div className="mt-3 aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={coverImage}
                  alt="封面预览"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Invalid+Image'
                  }}
                />
              </div>
            )}
          </div>

          {/* 摘要 */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              文章摘要（可选）
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="简短描述文章内容..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* 富文本编辑器 */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              文章内容
            </label>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="开始写作..."
            />
          </div>
        </div>

        {/* 文章信息 */}
        <div className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">创建时间：</span>
              <span className="text-white">
                {new Date(article.created_at).toLocaleString('zh-CN')}
              </span>
            </div>
            <div>
              <span className="text-gray-400">更新时间：</span>
              <span className="text-white">
                {new Date(article.updated_at).toLocaleString('zh-CN')}
              </span>
            </div>
            <div>
              <span className="text-gray-400">浏览量：</span>
              <span className="text-white">{article.view_count}</span>
            </div>
            <div>
              <span className="text-gray-400">点赞数：</span>
              <span className="text-white">{article.like_count}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

