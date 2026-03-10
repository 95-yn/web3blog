'use client'

import Link from "next/link";
import ThreeScene from "@/components/home/ThreeScene";

export default function Home() {
  return (
    <main className="h-screen bg-[#000000] text-white overflow-hidden relative">
      {/* Three.js 3D Background */}
      <ThreeScene />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">一一的空间</Link>
          <Link href="/articles" className="text-gray-400 hover:text-cyan-400 transition-colors">文章</Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center space-y-8 px-8 animate-fade-in">
          {/* Avatar */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-spin-slow"></div>
            <div className="absolute inset-1 rounded-full overflow-hidden bg-black">
              <img
                src="/brand/logo.png"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name & Intro */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">欢迎来到一一的空间</h1>
            <p className="text-gray-400 text-base mb-4">记录学习与思考</p>
            
            {/* 个人介绍 */}
            <div className="max-w-lg mx-auto text-gray-400 text-sm leading-relaxed bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/10">
              <p className="mb-3">你好！我是专注于前端开发的技术爱好者。</p>
              <p className="mb-3">热爱 Web3、React、Next.js 等前沿技术，喜欢探索创新的前端交互体验。</p>
              <p>在这里分享学习笔记、技术思考和项目经验，期待与志同道合的朋友交流学习。</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-6 justify-center pt-4">
            <Link href="/articles" className="px-8 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 hover:text-cyan-300 transition-all">
              文章
            </Link>
            <Link href="/posts" className="px-8 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-400 hover:text-blue-300 transition-all">
              动态
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
      `}</style>
    </main>
  );
}
