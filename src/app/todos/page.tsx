import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TodoList from '@/components/todos/TodoList'
import GlobalNav from '@/components/layout/GlobalNav'

export default async function TodosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* 全局导航栏 */}
      <GlobalNav />

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">我的待办事项</h1>
        <TodoList userId={user.id} />
      </main>
    </div>
  )
}

