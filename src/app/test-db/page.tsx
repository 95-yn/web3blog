import { createClient } from '@/lib/supabase/server'
import { Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default async function TestDBPage() {
  const supabase = await createClient()
  
  const tests = []

  // 测试 1: 数据库连接
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('count')
      .limit(1)

    if (error) throw error
    
    tests.push({
      name: '数据库连接',
      status: 'success' as const,
      message: '连接成功',
      details: '可以访问 todos 表'
    })
  } catch (error: any) {
    tests.push({
      name: '数据库连接',
      status: 'error' as const,
      message: '连接失败',
      details: error.message
    })
  }

  // 测试 2: 用户认证
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    
    if (user) {
      tests.push({
        name: '用户认证',
        status: 'success' as const,
        message: '已登录',
        details: `用户 ID: ${user.id}`
      })
    } else {
      tests.push({
        name: '用户认证',
        status: 'warning' as const,
        message: '未登录',
        details: '请先登录以测试完整功能'
      })
    }
  } catch (error: any) {
    tests.push({
      name: '用户认证',
      status: 'error' as const,
      message: '认证失败',
      details: error.message
    })
  }

  // 测试 3: 环境变量
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (hasUrl && hasKey) {
    tests.push({
      name: '环境变量',
      status: 'success' as const,
      message: '配置正确',
      details: 'SUPABASE_URL 和 ANON_KEY 已配置'
    })
  } else {
    tests.push({
      name: '环境变量',
      status: 'error' as const,
      message: '配置缺失',
      details: `缺少: ${!hasUrl ? 'SUPABASE_URL ' : ''}${!hasKey ? 'ANON_KEY' : ''}`
    })
  }

  const allPassed = tests.every(t => t.status === 'success' || t.status === 'warning')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">数据库连接测试</h1>
            </div>
            <a
              href="/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
            >
              返回
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 总体状态 */}
          <div className={`rounded-xl p-6 border ${
            allPassed
              ? 'bg-green-500/10 border-green-500/50'
              : 'bg-red-500/10 border-red-500/50'
          }`}>
            <div className="flex items-center gap-3">
              {allPassed ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-green-500">
                      测试通过
                    </h2>
                    <p className="text-green-400/80">数据库配置正常</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-red-500">
                      测试失败
                    </h2>
                    <p className="text-red-400/80">请检查配置</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 测试结果列表 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">测试结果</h3>
            
            {tests.map((test, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-start gap-4">
                  {test.status === 'success' && (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  )}
                  {test.status === 'error' && (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                  {test.status === 'warning' && (
                    <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  )}
                  
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{test.name}</h4>
                    <p className={`text-sm mt-1 ${
                      test.status === 'success'
                        ? 'text-green-400'
                        : test.status === 'error'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    }`}>
                      {test.message}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {test.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 配置指南 */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              配置指南
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>1. 确保在 <code className="bg-gray-900 px-2 py-1 rounded">.env.local</code> 中配置了正确的环境变量</p>
              <p>2. 在 Supabase Dashboard 中创建 <code className="bg-gray-900 px-2 py-1 rounded">todos</code> 表</p>
              <p>3. 配置行级安全策略 (RLS)</p>
              <p>4. 登录账户以测试完整功能</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                详细配置步骤请查看{' '}
                <code className="bg-gray-900 px-2 py-1 rounded text-blue-400">
                  DATABASE_SETUP.md
                </code>
              </p>
            </div>
          </div>

          {/* 创建表的 SQL */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              创建 todos 表的 SQL
            </h3>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs text-gray-300">
{`CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全策略
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 用户只能看到自己的待办事项
CREATE POLICY "Users can view own todos"
ON todos FOR SELECT
USING (auth.uid() = user_id);

-- 用户只能插入自己的待办事项
CREATE POLICY "Users can insert own todos"
ON todos FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的待办事项
CREATE POLICY "Users can update own todos"
ON todos FOR UPDATE
USING (auth.uid() = user_id);

-- 用户只能删除自己的待办事项
CREATE POLICY "Users can delete own todos"
ON todos FOR DELETE
USING (auth.uid() = user_id);`}
            </pre>
            <p className="text-gray-400 text-sm mt-4">
              在 Supabase Dashboard 的 SQL Editor 中执行此 SQL
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

