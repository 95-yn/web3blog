import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AnimatedBackground from "@/components/home/AnimatedBackground";
import FloatingShapes from "@/components/home/FloatingShapes";
import GlobalNav from "@/components/layout/GlobalNav";
import { Eye, Heart, Calendar } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 获取已发布的文章（最新6篇）
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 3D 动画背景 */}
      <AnimatedBackground />
      <FloatingShapes />

      {/* 全局导航栏 */}
      <GlobalNav transparent />

      {/* 内容区域 */}
      <div className="relative z-10 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="inline-block animate-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                最新文章
              </span>
            </h2>
            {user && (
              <p className="text-gray-400">
                欢迎回来，<span className="text-blue-400">{user.email}</span>
              </p>
            )}
          </div>

          {/* 文章卡片网格 */}
          {!articles || articles.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                还没有文章
              </h3>
              <p className="text-gray-400 mb-6">
                {user ? "开始创作您的第一篇文章吧！" : "登录后即可创作文章"}
              </p>
              {user ? (
                <Link
                  href="/posts/new"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  创建文章
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  立即登录
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 transform-gpu"
                >
                  {/* 封面图 */}
                  {article.cover_image && (
                    <div className="aspect-video bg-gray-900 overflow-hidden">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* 内容 */}
                  <div className="p-6">
                    {/* 标题 */}
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>

                    {/* 摘要 */}
                    {article.excerpt && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}

                    {/* 元信息 */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-700/50">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.view_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {article.like_count}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(
                          article.published_at || article.created_at
                        ).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 查看更多 */}
          {articles && articles.length >= 6 && (
            <div className="text-center mt-12">
              <Link
                href="/posts"
                className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                查看所有文章 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
