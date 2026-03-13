"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface BackLinkProps {
  href: string;
  text?: string;
}

export default function BackLink({ href, text }: BackLinkProps) {
  const { language, theme, mounted } = useLanguage();
  const isDark = mounted ? theme === "dark" : true;

  const defaultText = {
    zh: "返回工具列表",
    en: "Back to Tools",
  }[language];

  const textSub = isDark ? "text-gray-400" : "text-gray-600";
  const hoverColor = isDark ? "hover:text-cyan-400" : "hover:text-blue-600";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 mb-2 text-sm ${textSub} ${hoverColor}`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {text || defaultText}
    </Link>
  );
}
