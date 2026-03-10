'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, Heart } from "lucide-react";
import type { Article } from "@/lib/database/articles";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    setArticles(data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono">LOADING...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-cyan-400">数字空间</Link>
          <nav className="flex gap-8">
            <Link href="/articles" className="text-white font-medium">文章</Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">关于</Link>
          </nav>
        </div>
      </header>

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black mb-8 text-white">全部文章</h1>

          {articles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">暂无文章</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`} className="group block bg-[#1a1a1a] hover:bg-[#222] transition-all relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-purple-500"></div>
                  <div className="p-5 pl-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{article.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{article.excerpt || '暂无描述'}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.view_count}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{article.like_count}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
