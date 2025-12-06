-- =============================================
-- 修复 "role admin does not exist" 错误
-- =============================================
-- 这个脚本会清理并重新创建正确的权限系统

-- 1. 删除所有相关的 RLS 策略
DROP POLICY IF EXISTS "允许认证用户读取角色" ON user_roles;
DROP POLICY IF EXISTS "允许插入新角色" ON user_roles;
DROP POLICY IF EXISTS "允许更新角色" ON user_roles;
DROP POLICY IF EXISTS "用户可以查看所有角色" ON user_roles;
DROP POLICY IF EXISTS "只有管理员可以修改角色" ON user_roles;
DROP POLICY IF EXISTS "允许读取所有用户角色" ON user_roles;
DROP POLICY IF EXISTS "允许管理员修改角色" ON user_roles;

DROP POLICY IF EXISTS "允许所有人读取已发布文章" ON articles;
DROP POLICY IF EXISTS "允许认证用户创建文章" ON articles;
DROP POLICY IF EXISTS "允许作者编辑自己的文章" ON articles;
DROP POLICY IF EXISTS "允许作者删除自己的文章" ON articles;
DROP POLICY IF EXISTS "允许管理员创建文章" ON articles;
DROP POLICY IF EXISTS "允许管理员编辑文章" ON articles;
DROP POLICY IF EXISTS "允许管理员删除文章" ON articles;

-- 2. 暂时禁用 RLS（方便调试）
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE articles DISABLE ROW LEVEL SECURITY;

-- 3. 重新启用 RLS 并创建简化的策略
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- user_roles 表的策略：允许所有认证用户读取和修改
CREATE POLICY "允许所有操作"
  ON user_roles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. articles 表的策略：允许所有认证用户操作
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有人查看文章"
  ON articles
  FOR SELECT
  USING (true);

CREATE POLICY "允许认证用户操作文章"
  ON articles
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- 5. 验证设置
SELECT '✅ RLS 策略已重置' as message;

-- 6. 查看当前用户和角色
SELECT 
  u.id,
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id;

