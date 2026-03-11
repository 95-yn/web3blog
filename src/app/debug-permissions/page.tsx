"use client";

import { useEffect, useState } from "react";
import { getUserRole, isAdmin } from "@/lib/auth/permissions";
import GlobalNav from "@/components/layout/GlobalNav";
import {
  Shield,
  User,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface DebugInfo {
  user: any;
  role: string;
  isAdmin: boolean;
  userRoleRecord: any;
  tableExists: boolean;
  error: string | null;
}

export default function DebugPermissionsPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    diagnose();
  }, []);

  async function diagnose() {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient();
    const info: DebugInfo = {
      user: null,
      role: "user",
      isAdmin: false,
      userRoleRecord: null,
      tableExists: false,
      error: null,
    };

    try {
      // 1. 检查用户认证
      console.log("🔍 开始诊断权限系统...");
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        info.error = `认证错误: ${authError.message}`;
        setDebugInfo(info);
        setLoading(false);
        return;
      }

      info.user = user
        ? {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
          }
        : null;

      if (!user) {
        info.error = "未登录";
        setDebugInfo(info);
        setLoading(false);
        return;
      }

      // 2. 检查 user_roles 表是否存在
      console.log("📊 检查 user_roles 表...");
      const { data: tableCheck, error: tableError } = await supabase
        .from("user_roles")
        .select("role")
        .limit(1);

      if (tableError) {
        if (tableError.code === "42P01") {
          info.error = "user_roles 表不存在，请运行 setup-user-roles.sql";
          info.tableExists = false;
        } else {
          info.error = `表查询错误: ${tableError.message}`;
        }
      } else {
        info.tableExists = true;
      }

      // 3. 查询用户角色记录
      console.log("📊 查询用户角色记录...");
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (roleError) {
        if (roleError.code === "PGRST116") {
          info.error = "用户角色记录不存在，请在数据库中添加";
        } else {
          console.error("角色查询错误:", roleError);
        }
      } else {
        info.userRoleRecord = roleData;
      }

      // 4. 通过函数获取角色
      console.log("🔐 通过 getUserRole 获取角色...");
      info.role = await getUserRole();

      // 5. 检查是否是管理员
      console.log("🔐 通过 isAdmin 检查管理员权限...");
      info.isAdmin = await isAdmin();

      setDebugInfo(info);
    } catch (error: any) {
      console.error("诊断过程出错:", error);
      info.error = `诊断异常: ${error.message}`;
      setDebugInfo(info);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">诊断中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <GlobalNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">权限系统诊断</h1>
          </div>
          <p className="text-gray-400">检查用户角色和权限配置</p>
        </div>

        {debugInfo?.error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-semibold mb-1">错误</h3>
              <p className="text-red-300">{debugInfo.error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* 用户信息 */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">用户信息</h2>
            </div>
            {debugInfo?.user ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">已登录</span>
                </div>
                <div className="pl-6 space-y-1 text-gray-300">
                  <p>
                    <span className="text-gray-500">ID:</span>{" "}
                    {debugInfo.user.id}
                  </p>
                  <p>
                    <span className="text-gray-500">邮箱:</span>{" "}
                    {debugInfo.user.email}
                  </p>
                  <p>
                    <span className="text-gray-500">创建时间:</span>{" "}
                    {new Date(debugInfo.user.created_at).toLocaleString(
                      "zh-CN"
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-gray-400">未登录</span>
              </div>
            )}
          </div>

          {/* 数据库表检查 */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">数据库检查</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {debugInfo?.tableExists ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-400">user_roles 表存在</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-400">user_roles 表不存在</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 角色记录 */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">角色记录</h2>
            </div>
            {debugInfo?.userRoleRecord ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">找到角色记录</span>
                </div>
                <div className="pl-6 space-y-1 text-gray-300">
                  <p>
                    <span className="text-gray-500">角色:</span>{" "}
                    <span
                      className={
                        debugInfo.userRoleRecord.role === "admin"
                          ? "text-yellow-400 font-semibold"
                          : "text-blue-400"
                      }
                    >
                      {debugInfo.userRoleRecord.role}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">创建时间:</span>{" "}
                    {new Date(
                      debugInfo.userRoleRecord.created_at
                    ).toLocaleString("zh-CN")}
                  </p>
                  <p>
                    <span className="text-gray-500">更新时间:</span>{" "}
                    {new Date(
                      debugInfo.userRoleRecord.updated_at
                    ).toLocaleString("zh-CN")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-gray-400">未找到角色记录</span>
              </div>
            )}
          </div>

          {/* 权限检查结果 */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-white">权限检查结果</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">当前角色</span>
                <span
                  className={`font-semibold ${
                    debugInfo?.role === "admin"
                      ? "text-yellow-400"
                      : "text-blue-400"
                  }`}
                >
                  {debugInfo?.role}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400">管理员权限</span>
                {debugInfo?.isAdmin ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-400 font-semibold">是</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-400 font-semibold">否</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 解决方案 */}
          {debugInfo?.error && (
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                💡 解决方案
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                {!debugInfo.tableExists && (
                  <div>
                    <p className="font-semibold text-blue-400 mb-2">
                      1. 创建 user_roles 表
                    </p>
                    <p className="text-gray-400 mb-2">
                      在 Supabase Dashboard 的 SQL Editor 中运行{" "}
                      <code className="px-2 py-1 bg-gray-800 rounded">
                        setup-user-roles.sql
                      </code>
                    </p>
                  </div>
                )}
                {!debugInfo.userRoleRecord && debugInfo.tableExists && (
                  <div>
                    <p className="font-semibold text-blue-400 mb-2">
                      2. 设置管理员账户
                    </p>
                    <p className="text-gray-400 mb-2">
                      编辑{" "}
                      <code className="px-2 py-1 bg-gray-800 rounded">
                        set-admin.sql
                      </code>{" "}
                      并在 Supabase 中运行
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-blue-400 mb-2">
                    3. 刷新页面
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    重新诊断
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
