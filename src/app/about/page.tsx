"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import BlurText from "@/components/reactbits/BlurText";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import ShinyText from "@/components/reactbits/ShinyText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import LogoLoop from "@/components/reactbits/LogoLoop";
import type { LogoItem } from "@/components/reactbits/LogoLoop";

export default function AboutPage() {
  const { language, theme, mounted } = useLanguage();
  const isDark = mounted ? theme === "dark" : true;
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const handleLogoEnter = useCallback((e: React.MouseEvent, name: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ text: name, x: rect.left + rect.width / 2, y: rect.top });
  }, []);

  const handleLogoLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const t = {
    zh: {
      title: "个人介绍",
      name: "一一",
      role: "全栈开发者",
      intro: "一个喜欢折腾的人。",
      contact: "联系方式",
      phone: "电话",
      wechat: "微信",
      email: "邮箱",
      hobbies: "爱好",
      skills: "技术栈",
    },
    en: {
      title: "About",
      name: "Yiyi",
      role: "Full-stack Developer",
      intro: "A person who loves tinkering.",
      contact: "Contact",
      phone: "Phone",
      wechat: "WeChat",
      email: "Email",
      hobbies: "Hobbies",
      skills: "Tech Stack",
    },
  }[language];

  const bg = isDark ? "bg-[#000000]" : "bg-[#f8f8f8]";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-600";

  const techLogos: LogoItem[] = [
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      alt: "React",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
      alt: "Vue",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      alt: "Next.js",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      alt: "TypeScript",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      alt: "Node.js",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      alt: "Tailwind CSS",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
      alt: "Python",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
      alt: "Docker",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
      alt: "Git",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
      alt: "Java",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/solidity/solidity-plain.svg",
      alt: "Solidity",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      alt: "PostgreSQL",
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
      alt: "Redis",
    },
  ];

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-6`}>
      <div className="max-w-4xl mx-auto">
        <BlurText
          text={t.title}
          className={`text-3xl font-bold mb-8 ${textMain}`}
          delay={100}
          animateBy="letters"
          direction="top"
          stepDuration={0.3}
        />

        <AnimatedContent distance={25} duration={0.5} delay={0.1}>
          <SpotlightCard
            className={`p-6 rounded-xl border ${isDark ? "bg-gradient-to-br from-gray-900/80 to-black/60 border-cyan-500/20 hover:border-cyan-500/40" : "bg-white border-gray-200 hover:border-blue-300"} backdrop-blur-sm mb-6 transition-all duration-300`}
            spotlightColor={
              isDark ? "rgba(0, 212, 255, 0.1)" : "rgba(59, 130, 246, 0.06)"
            }
          >
            <div className="flex items-center gap-6 mb-6">
              <div
                className={`relative w-24 h-24 rounded-full overflow-hidden ${isDark ? "ring-2 ring-cyan-500/30 ring-offset-2 ring-offset-black" : "ring-2 ring-blue-500/20 ring-offset-2 ring-offset-[#f8f8f8]"}`}
              >
                <img
                  src="/brand/logo.png"
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${textMain}`}>{t.name}</h2>
                <ShinyText
                  text={t.role}
                  className="text-base"
                  color={isDark ? "#9ca3af" : "#6b7280"}
                  shineColor={isDark ? "#22d3ee" : "#3b82f6"}
                  speed={3}
                />
              </div>
            </div>

            <p className={`leading-relaxed ${textSub} mb-5`}>{t.intro}</p>

            <div>
              <h4 className={`text-sm font-medium ${textMain} mb-3`}>
                {t.skills}
              </h4>
              <LogoLoop
                logos={techLogos}
                speed={40}
                logoHeight={28}
                gap={40}
                pauseOnHover
                scaleOnHover
                fadeOut
                fadeOutColor={isDark ? "#000000" : "#ffffff"}
                renderItem={(item) => {
                  const img = item as { src: string; alt?: string };
                  const name = img.alt || "";
                  return (
                    <span
                      onMouseEnter={(e) => handleLogoEnter(e, name)}
                      onMouseLeave={handleLogoLeave}
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <img
                        src={img.src}
                        alt={name}
                        draggable={false}
                        style={{
                          height: "var(--logoloop-logoHeight)",
                          width: "auto",
                        }}
                      />
                    </span>
                  );
                }}
              />
            </div>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent distance={25} duration={0.5} delay={0.15}>
          <SpotlightCard
            className={`p-6 rounded-xl border ${isDark ? "bg-gradient-to-br from-gray-900/80 to-black/60 border-cyan-500/20 hover:border-cyan-500/40" : "bg-white border-gray-200 hover:border-blue-300"} backdrop-blur-sm mb-6 transition-all duration-300`}
            spotlightColor={
              isDark ? "rgba(0, 212, 255, 0.1)" : "rgba(59, 130, 246, 0.06)"
            }
          >
            <h3 className={`text-lg font-medium ${textMain} mb-4`}>
              {t.contact}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Phone */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? "bg-cyan-500/5" : "bg-blue-500/5"}`}
              >
                <div
                  className={`p-2 rounded-lg ${isDark ? "bg-cyan-500/10" : "bg-blue-500/10"}`}
                >
                  <svg
                    className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-500"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className={`text-xs ${textSub}`}>{t.phone}</p>
                  <p className={`text-sm ${textMain}`}>19186879540</p>
                </div>
              </div>

              {/* WeChat */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? "bg-green-500/5" : "bg-green-500/5"}`}
              >
                <div className="p-2 rounded-lg bg-green-500/10">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className={`text-xs ${textSub}`}>{t.wechat}</p>
                  <p className={`text-sm ${textMain}`}>19186879540</p>
                </div>
              </div>

              {/* Email */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? "bg-cyan-500/5" : "bg-blue-500/5"}`}
              >
                <div
                  className={`p-2 rounded-lg ${isDark ? "bg-cyan-500/10" : "bg-blue-500/10"}`}
                >
                  <svg
                    className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-blue-500"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className={`text-xs ${textSub}`}>{t.email}</p>
                  <p className={`text-sm ${textMain}`}>95.yyyyn@gmail.com</p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </AnimatedContent>

        <AnimatedContent distance={25} duration={0.5} delay={0.2}>
          <SpotlightCard
            className={`p-6 rounded-xl border ${isDark ? "bg-gradient-to-br from-gray-900/80 to-black/60 border-cyan-500/20 hover:border-cyan-500/40" : "bg-white border-gray-200 hover:border-blue-300"} backdrop-blur-sm transition-all duration-300`}
            spotlightColor={
              isDark ? "rgba(0, 212, 255, 0.1)" : "rgba(59, 130, 246, 0.06)"
            }
          >
            <h3 className={`text-lg font-medium ${textMain} mb-3`}>
              {t.hobbies}
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/photos"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${isDark ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/10" : "bg-blue-500/10 border border-blue-500/30 text-blue-600 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10"}`}
              >
                <span className="text-base">🚗</span>
                <span>
                  {language === "zh"
                    ? "自驾游 - 33省/200+城市"
                    : "Road Trip - 33 provinces"}
                </span>
                <span className="opacity-70">📸</span>
              </Link>

              <span
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm ${isDark ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300" : "bg-blue-500/10 border border-blue-500/30 text-blue-600"}`}
              >
                <span className="text-base">🎮</span>
                <span>
                  {language === "zh"
                    ? "打游戏 - 王者荣耀/金铲铲/炉石/LOL"
                    : "Gaming - Honor of Kings/Spill/Stove/LOL"}
                </span>
              </span>
            </div>
          </SpotlightCard>
        </AnimatedContent>
      </div>

      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <div
            className="px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap"
            style={{
              background: isDark ? "rgba(0,0,0,0.9)" : "rgba(15,23,42,0.9)",
              color: "#fff",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              letterSpacing: "0.02em",
            }}
          >
            {tooltip.text}
          </div>
          <div
            style={{
              width: 0,
              height: 0,
              margin: "0 auto",
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: isDark
                ? "5px solid rgba(0,0,0,0.9)"
                : "5px solid rgba(15,23,42,0.9)",
            }}
          />
        </div>
      )}
    </main>
  );
}
