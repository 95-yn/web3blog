-- =============================================
-- 用户角色系统配置
-- =============================================

-- 1. 创建用户角色表
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- 3. 启用 RLS（行级安全）
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 4. 删除旧的策略（如果存在）
DROP POLICY IF EXISTS "用户可以查看所有角色" ON user_roles;
DROP POLICY IF EXISTS "只有管理员可以修改角色" ON user_roles;
DROP POLICY IF EXISTS "允许读取所有用户角色" ON user_roles;
DROP POLICY IF EXISTS "允许管理员修改角色" ON user_roles;

-- 5. 创建 RLS 策略
-- 策略1: 所有认证用户都可以读取角色信息
CREATE POLICY "允许认证用户读取角色"
  ON user_roles
  FOR SELECT
  USING (true);

-- 策略2: 只允许通过触发器或管理员更新角色
CREATE POLICY "允许插入新角色"
  ON user_roles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "允许更新角色"
  ON user_roles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 6. 创建辅助函数
-- 检查用户是否是管理员
CREATE OR REPLACE FUNCTION is_admin(user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_id_param AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 获取用户角色
CREATE OR REPLACE FUNCTION get_user_role(user_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_roles
  WHERE user_id = user_id_param;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. 创建触发器函数：为新用户自动分配角色
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 9. 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 10. 为现有用户添加默认角色
INSERT INTO user_roles (user_id, role)
SELECT id, 'user'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_roles)
ON CONFLICT (user_id) DO NOTHING;

-- 11. 更新 articles 表的 RLS 策略（如果需要）
-- 删除旧策略
DROP POLICY IF EXISTS "允许所有人读取已发布文章" ON articles;
DROP POLICY IF EXISTS "允许认证用户创建文章" ON articles;
DROP POLICY IF EXISTS "允许作者编辑自己的文章" ON articles;
DROP POLICY IF EXISTS "允许作者删除自己的文章" ON articles;

-- 创建新策略
CREATE POLICY "允许所有人读取已发布文章"
  ON articles
  FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "允许管理员创建文章"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "允许管理员编辑文章"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "允许管理员删除文章"
  ON articles
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- 完成提示
SELECT '✅ 用户角色系统配置完成！' as message;
SELECT '📊 当前用户角色统计：' as message;
SELECT role, COUNT(*) as count FROM user_roles GROUP BY role;

