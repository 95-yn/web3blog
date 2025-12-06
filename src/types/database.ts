// 数据库表类型定义

export interface Todo {
  id: string
  user_id: string
  title: string
  description?: string
  is_complete: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

// 插入类型（部分字段可选，因为有默认值）
export type TodoInsert = Pick<Todo, 'title' | 'user_id'> & {
  description?: string
  is_complete?: boolean
}

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>

