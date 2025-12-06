/**
 * 权限管理工具
 * 用于检查用户角色和权限
 */

import { createClient } from "@/lib/supabase/client";

export type UserRole = "admin" | "user";

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

/**
 * 获取当前用户的角色
 */
export async function getUserRole(): Promise<UserRole> {
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("🔍 [getUserRole] 检查用户认证:", {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      authError,
    });

    if (!user) {
      console.log("⚠️ [getUserRole] 未登录用户，返回默认角色: user");
      return "user";
    }

    console.log("📊 [getUserRole] 查询用户角色表...");
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    console.log("📊 [getUserRole] 查询结果:", {
      data,
      error,
      errorCode: error?.code,
      errorMessage: error?.message,
    });

    if (error) {
      if (error.code === "PGRST116") {
        console.log("⚠️ [getUserRole] 用户角色记录不存在，返回默认角色: user");
      } else {
        console.error("❌ [getUserRole] 查询角色失败:", error);
      }
      return "user";
    }

    if (!data) {
      console.log("⚠️ [getUserRole] 没有角色数据，返回默认角色: user");
      return "user";
    }

    console.log("✅ [getUserRole] 成功获取角色:", data.role);
    return data.role as UserRole;
  } catch (error) {
    console.error("❌ [getUserRole] 异常:", error);
    return "user";
  }
}

/**
 * 检查当前用户是否是管理员
 */
export async function isAdmin(): Promise<boolean> {
  console.log("🔐 [isAdmin] 开始检查管理员权限...");
  const role = await getUserRole();
  const result = role === "admin";
  console.log("🔐 [isAdmin] 检查结果:", { role, isAdmin: result });
  return result;
}

/**
 * 检查指定用户是否是管理员
 */
export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.role === "admin";
  } catch (error) {
    console.error("检查用户角色失败:", error);
    return false;
  }
}

/**
 * 获取所有用户及其角色
 * 仅管理员可用
 */
export async function getAllUsersWithRoles() {
  const supabase = createClient();

  try {
    // 先检查当前用户是否是管理员
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      throw new Error("无权限访问");
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("获取用户列表失败:", error);
    return [];
  }
}

/**
 * 设置用户角色
 * 仅管理员可用
 */
export async function setUserRole(
  userId: string,
  role: UserRole
): Promise<boolean> {
  const supabase = createClient();

  try {
    // 先检查当前用户是否是管理员
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      throw new Error("无权限执行此操作");
    }

    const { error } = await supabase.from("user_roles").upsert({
      user_id: userId,
      role: role,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("设置用户角色失败:", error);
    return false;
  }
}

/**
 * 检查当前用户是否有编辑权限
 */
export async function canEdit(): Promise<boolean> {
  return await isAdmin();
}

/**
 * 检查当前用户是否有删除权限
 */
export async function canDelete(): Promise<boolean> {
  return await isAdmin();
}

/**
 * 检查当前用户是否有创建权限
 */
export async function canCreate(): Promise<boolean> {
  return await isAdmin();
}
