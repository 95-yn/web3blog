import { createClient } from '@/lib/supabase/client'

export interface Article {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image: string | null
  status: 'draft' | 'published' | 'archived'
  view_count: number
  like_count: number
  author_id: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  color: string
  created_at: string
}

/**
 * 获取文章列表
 */
export async function getArticles(params?: {
  status?: 'draft' | 'published' | 'archived'
  authorId?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (params?.status) {
    query = query.eq('status', params.status)
  }

  if (params?.authorId) {
    query = query.eq('author_id', params.authorId)
  }

  if (params?.limit) {
    query = query.limit(params.limit)
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Article[]
}

/**
 * 根据 ID 获取文章
 */
export async function getArticleById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Article
}

/**
 * 根据 Slug 获取文章
 */
export async function getArticleBySlug(slug: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as Article
}

/**
 * 创建文章
 */
export async function createArticle(article: {
  title: string
  slug: string
  content?: string
  excerpt?: string
  cover_image?: string
  status?: 'draft' | 'published' | 'archived'
  author_id: string
}) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('articles')
    .insert([{
      ...article,
      published_at: article.status === 'published' ? new Date().toISOString() : null
    }])
    .select()
    .single()

  if (error) throw error
  return data as Article
}

/**
 * 更新文章
 */
export async function updateArticle(id: string, updates: {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  cover_image?: string
  status?: 'draft' | 'published' | 'archived'
}) {
  const supabase = createClient()
  
  const updateData: any = { ...updates }
  
  // 如果状态改为已发布且之前没有发布时间，设置发布时间
  if (updates.status === 'published') {
    const { data: current } = await supabase
      .from('articles')
      .select('published_at')
      .eq('id', id)
      .single()
    
    if (current && !current.published_at) {
      updateData.published_at = new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Article
}

/**
 * 删除文章
 */
export async function deleteArticle(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * 增加浏览量
 */
export async function incrementViews(id: string) {
  const supabase = createClient()
  
  const { data: article } = await supabase
    .from('articles')
    .select('view_count')
    .eq('id', id)
    .single()

  if (article) {
    await supabase
      .from('articles')
      .update({ view_count: article.view_count + 1 })
      .eq('id', id)
  }
}

/**
 * 增加点赞数
 */
export async function incrementLikes(id: string) {
  const supabase = createClient()
  
  const { data: article } = await supabase
    .from('articles')
    .select('like_count')
    .eq('id', id)
    .single()

  if (article) {
    const { data, error } = await supabase
      .from('articles')
      .update({ like_count: article.like_count + 1 })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Article
  }
}

/**
 * 生成唯一的 slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Date.now().toString(36)
}

