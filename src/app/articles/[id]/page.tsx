"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Heart, Calendar, Edit, Home } from "lucide-react";
import type { Article } from "@/lib/database/articles";
import { web3Toast } from "@/lib/toast";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import "highlight.js/styles/github-dark.css";

// 注册语言
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("php", php);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);

export default function ArticlePreviewPage() {
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentReady, setContentReady] = useState(false);
  const [renderHtml, setRenderHtml] = useState<string>("");

  // Callback ref：当 DOM 元素准备好时触发
  const handleContentRef = (element: HTMLDivElement | null) => {
    contentRef.current = element;
    if (element && article && !contentReady) {
      console.log("✅ [代码高亮] 内容容器已挂载到 DOM");
      setContentReady(true);
    }
  };

  async function loadArticle() {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error) throw error;

      setArticle(data);

      // 增加浏览量
      await supabase
        .from("articles")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", articleId);
    } catch (error) {
      console.error("加载文章失败:", error);
      web3Toast.error("加载文章失败");
    } finally {
      setLoading(false);
    }
  }

  async function checkUser() {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }

  useEffect(() => {
    loadArticle();
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  // 将 Markdown 渲染成 HTML（同时兼容旧文章存的 HTML）
  useEffect(() => {
    if (!article) return;

    const raw = (article.content || "").trim();
    const looksLikeHtml = raw.startsWith("<") && /<\/?[a-z][\s\S]*>/i.test(raw);

    if (looksLikeHtml) {
      setRenderHtml(article.content || "<p>暂无内容</p>");
      return;
    }

    // marked + DOMPurify：把 Markdown 转成可安全插入的 HTML
    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    const html = marked.parse(raw || "暂无内容") as string;
    setRenderHtml(DOMPurify.sanitize(html));
  }, [article]);

  // 应用代码高亮 - 使用可靠的异步检测机制
  useEffect(() => {
    // 添加更详细的调试信息
    console.log("🔍 [代码高亮] useEffect 触发", {
      hasArticle: !!article,
      hasContentRef: !!contentRef.current,
      contentReady,
      articleId: article?.id,
    });

    if (!article) {
      console.log("⚠️ [代码高亮] 等待文章加载...");
      return;
    }

    // 等待 contentReady 标志，确保 DOM 已经渲染
    if (!contentReady || !contentRef.current) {
      console.log("⚠️ [代码高亮] 等待容器渲染...", {
        contentReady,
        hasRef: !!contentRef.current,
      });
      return;
    }

    console.log("🎨 [代码高亮] 开始处理...");

    // 应用高亮的函数
    const applyHighlight = () => {
      if (!contentRef.current) {
        console.warn("⚠️ [代码高亮] contentRef 不可用");
        return false;
      }

      const codeBlocks = contentRef.current.querySelectorAll("pre code");
      console.log(`📊 [代码高亮] 找到 ${codeBlocks.length} 个代码块`);

      if (codeBlocks.length === 0) {
        console.log("ℹ️ [代码高亮] 没有代码块需要高亮");
        return false;
      }

      let highlightedCount = 0;

      codeBlocks.forEach((block, index) => {
        try {
          const element = block as HTMLElement;

          // 检查是否已经高亮过（避免重复高亮）
          if (
            element.classList.contains("hljs") &&
            element.dataset.highlighted === "yes"
          ) {
            console.log(`⏭️  代码块 ${index + 1} 已高亮，跳过`);
            highlightedCount++;
            return;
          }

          // 移除旧的高亮类
          element.className = element.className
            .split(" ")
            .filter((cls) => !cls.startsWith("hljs"))
            .join(" ");

          // 应用高亮
          hljs.highlightElement(element);

          // 标记已高亮
          element.dataset.highlighted = "yes";

          highlightedCount++;
          console.log(`✅ 代码块 ${index + 1} 高亮成功`);
        } catch (error) {
          console.error(`❌ 代码块 ${index + 1} 高亮失败:`, error);
        }
      });

      if (highlightedCount > 0) {
        console.log(
          `🎉 成功高亮 ${highlightedCount}/${codeBlocks.length} 个代码块`
        );
        return true;
      }

      return false;
    };

    let cancelled = false;
    let pollInterval: NodeJS.Timeout | null = null;
    let observer: MutationObserver | null = null;

    // 使用 requestAnimationFrame 确保在浏览器渲染后执行
    const scheduleHighlight = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 双重 RAF 确保 DOM 完全渲染
          if (cancelled) return;

          const success = applyHighlight();

          if (!success) {
            console.log("🔄 [代码高亮] 首次尝试未成功，启用轮询和监听机制...");

            let attemptCount = 0;
            const maxAttempts = 10;

            // 轮询机制
            pollInterval = setInterval(() => {
              if (cancelled) {
                if (pollInterval) clearInterval(pollInterval);
                return;
              }

              attemptCount++;
              console.log(
                `🔄 [代码高亮] 重试 ${attemptCount}/${maxAttempts}...`
              );

              const retrySuccess = applyHighlight();

              if (retrySuccess || attemptCount >= maxAttempts) {
                if (pollInterval) clearInterval(pollInterval);
                if (observer) observer.disconnect();

                if (!retrySuccess && attemptCount >= maxAttempts) {
                  console.warn("⚠️ [代码高亮] 达到最大重试次数");
                }
              }
            }, 150);

            // MutationObserver 监听 DOM 变化
            if (contentRef.current) {
              observer = new MutationObserver(() => {
                if (cancelled) {
                  if (observer) observer.disconnect();
                  return;
                }

                console.log("👀 [代码高亮] 检测到 DOM 变化");
                const mutationSuccess = applyHighlight();

                if (mutationSuccess) {
                  if (observer) observer.disconnect();
                  if (pollInterval) clearInterval(pollInterval);
                }
              });

              observer.observe(contentRef.current, {
                childList: true,
                subtree: true,
              });
            }
          }
        });
      });
    };

    scheduleHighlight();

    // 清理函数
    return () => {
      cancelled = true;
      if (pollInterval) clearInterval(pollInterval);
      if (observer) observer.disconnect();
    };
  }, [article, contentReady]); // 依赖 article 和 contentReady

  async function handleLike() {
    if (!article) return;
    if (liked) return;

    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("articles")
        .update({ like_count: article.like_count + 1 })
        .eq("id", articleId)
        .select()
        .single();

      if (error) throw error;

      setArticle(data);
      setLiked(true);
    } catch (error) {
      console.error("点赞失败:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const isAuthor = user && user.id === article.author_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* 顶部导航 */}
      <nav className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              返回首页
            </Link>

            <div className="flex items-center gap-4">
              {isAuthor && (
                <Link
                  href={`/posts/${article.id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  编辑
                </Link>
              )}
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Home className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 文章内容 */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 封面图 */}
        {article.cover_image && (
          <div className="aspect-video mb-8 rounded-2xl overflow-hidden">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {article.title}
        </h1>

        {/* 元信息 */}
        <div className="flex items-center gap-6 text-gray-400 text-sm mb-8 pb-8 border-b border-gray-700/50">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(
              article.published_at || article.created_at
            ).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {article.view_count} 阅读
          </span>
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-2 transition-colors ${
              liked ? "text-pink-500" : "hover:text-pink-400"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            {article.like_count}
          </button>
        </div>

        {/* 摘要 */}
        {article.excerpt && (
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
            <p className="text-gray-300 italic">{article.excerpt}</p>
          </div>
        )}

        {/* 文章内容 */}
        <div
          ref={handleContentRef}
          className="prose prose-invert prose-lg max-w-none article-content"
          dangerouslySetInnerHTML={{ __html: renderHtml }}
        />

        {/* 底部操作 */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回文章列表
            </Link>

            {isAuthor && (
              <Link
                href={`/posts/${article.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                编辑文章
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
