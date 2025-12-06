'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Todo } from '@/types/database'
import { Plus, Trash2, Check, X, Loader2 } from 'lucide-react'
import { web3Toast } from '@/lib/toast'

interface TodoListProps {
  userId: string
}

export default function TodoList({ userId }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [newTodoDescription, setNewTodoDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  // 加载待办事项
  useEffect(() => {
    loadTodos()
  }, [])

  // 实时订阅数据变化
  useEffect(() => {
    const channel = supabase
      .channel('todos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${userId}`
        },
        () => {
          loadTodos()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  async function loadTodos() {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (err: any) {
      console.error('加载失败:', err)
      setError(err.message || '加载待办事项失败')
    } finally {
      setLoading(false)
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    
    if (!newTodoTitle.trim()) return

    try {
      setSubmitting(true)
      setError(null)

      const { error } = await supabase
        .from('todos')
        .insert({
          title: newTodoTitle,
          description: newTodoDescription || null,
          user_id: userId
        })

      if (error) throw error

      setNewTodoTitle('')
      setNewTodoDescription('')
      await loadTodos()
    } catch (err: any) {
      console.error('添加失败:', err)
      setError(err.message || '添加待办事项失败')
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleComplete(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ 
          is_complete: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      await loadTodos()
    } catch (err: any) {
      console.error('更新失败:', err)
      setError(err.message || '更新待办事项失败')
    }
  }

  async function deleteTodo(id: string) {
    // 使用 Web3 风格的确认对话框
    const confirmed = await web3Toast.confirm(
      '确定要删除这个待办事项吗？',
      '删除后将无法恢复'
    )
    
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadTodos()
      web3Toast.success('待办事项已删除')
    } catch (err: any) {
      console.error('删除失败:', err)
      setError(err.message || '删除待办事项失败')
      web3Toast.error('删除失败', err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* 添加新待办事项 */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">添加新任务</h2>
        <form onSubmit={addTodo} className="space-y-4">
          <div>
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="任务标题..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={submitting}
            />
          </div>
          <div>
            <textarea
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="任务描述（可选）..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !newTodoTitle.trim()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                添加任务
              </>
            )}
          </button>
        </form>
      </div>

      {/* 待办事项列表 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          任务列表 ({todos.length})
        </h2>

        {todos.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <p className="text-gray-400">还没有任务，添加一个吧！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-gray-800 rounded-xl p-6 border transition-all ${
                  todo.is_complete
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* 完成按钮 */}
                  <button
                    onClick={() => toggleComplete(todo.id, todo.is_complete)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      todo.is_complete
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-600 hover:border-green-500'
                    }`}
                  >
                    {todo.is_complete && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>

                  {/* 内容 */}
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-medium ${
                        todo.is_complete
                          ? 'text-gray-400 line-through'
                          : 'text-white'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-gray-400 mt-1 text-sm">
                        {todo.description}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      创建于 {new Date(todo.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 统计 */}
      {todos.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{todos.length}</p>
              <p className="text-gray-400 text-sm">总任务</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {todos.filter((t) => t.is_complete).length}
              </p>
              <p className="text-gray-400 text-sm">已完成</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">
                {todos.filter((t) => !t.is_complete).length}
              </p>
              <p className="text-gray-400 text-sm">待完成</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

