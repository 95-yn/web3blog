"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function PublicHeader() {
  const pathname = usePathname();
  const { language, theme, mounted, toggleLanguage, toggleTheme } =
    useLanguage();
  const isDark = mounted ? theme === "dark" : true;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const navBg = isDark ? "bg-black/80" : "bg-white/80";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const hoverColor = isDark ? "hover:text-cyan-400" : "hover:text-blue-600";
  const borderColor = isDark ? "border-cyan-500/20" : "border-gray-200";
  const btnBg = isDark
    ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
    : "bg-blue-100 text-blue-600 hover:bg-blue-200";
  const menuBg = isDark ? "bg-black/90" : "bg-white/90";

  const activeColor = isDark ? "text-cyan-400" : "text-blue-600";
  const activeBorder = isDark ? "border-cyan-400" : "border-blue-600";

  const navLinks = [
    { href: "/articles", zh: "文章", en: "Articles" },
    { href: "/tools", zh: "小工具", en: "Tools" },
    { href: "/about", zh: "个人介绍", en: "About" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 ${navBg} backdrop-blur-md border-b ${borderColor} px-4 md:px-6`}
    >
      <div className="h-16 max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`flex items-center gap-2 md:gap-3 ${hoverColor} transition-colors focus:outline-none`}
        >
          <img
            src="/brand/logo.png"
            alt="Logo"
            className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 shadow-sm"
          />
          <span className={`text-lg md:text-xl font-bold ${textColor}`}>
            {language === "zh" ? "一一的空间" : "Yiyi's Space"}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm py-1 transition-colors focus:outline-none ${
                isActive(link.href)
                  ? `${activeColor} font-medium`
                  : `${textColor} ${hoverColor}`
              }`}
            >
              {language === "zh" ? link.zh : link.en}
              {isActive(link.href) && (
                <span className={`absolute -bottom-[1px] left-0 right-0 h-[2px] ${isDark ? 'bg-cyan-400' : 'bg-blue-600'} rounded-full`} />
              )}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className={`px-2 md:px-3 py-1 rounded ${btnBg} transition-colors text-xs md:text-sm focus:outline-none`}
            >
              {language === "zh" ? "EN" : "中"}
            </button>
            <button
              onClick={toggleTheme}
              className={`px-2 md:px-3 py-1 rounded ${btnBg} transition-colors text-xs md:text-sm focus:outline-none`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 ${textColor} focus:outline-none`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${menuBg} border-t ${borderColor}`}>
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 focus:outline-none ${
                  isActive(link.href)
                    ? `${activeColor} font-medium border-l-2 ${activeBorder} pl-3`
                    : `${textColor} ${hoverColor} pl-3`
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "zh" ? link.zh : link.en}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                onClick={toggleLanguage}
                className={`flex-1 py-2 rounded ${btnBg} transition-colors text-sm focus:outline-none`}
              >
                {language === "zh" ? "EN" : "中"}
              </button>
              <button
                onClick={toggleTheme}
                className={`flex-1 py-2 rounded ${btnBg} transition-colors text-sm focus:outline-none`}
              >
                {isDark ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
