-- =============================================
-- 设置管理员账户
-- =============================================
-- 使用方法：
-- 1. 在 Supabase Dashboard 中打开 SQL Editor
-- 2. 将下面的 'YOUR_EMAIL@example.com' 替换为要设置为管理员的邮箱
-- 3. 运行此脚本

-- 方法1: 通过邮箱设置管理员
UPDATE user_roles
SET role = 'admin', updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com'
);

-- 如果该用户还没有角色记录，则插入一条
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL@example.com'
  AND id NOT IN (SELECT user_id FROM user_roles)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = NOW();

-- 验证设置
SELECT 
  u.id,
  u.email,
  ur.role,
  ur.created_at,
  ur.updated_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'YOUR_EMAIL@example.com';

