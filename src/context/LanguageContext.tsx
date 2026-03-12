"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "zh" | "en";
type Theme = "dark" | "light";

interface LanguageContextType {
  language: Language;
  theme: Theme;
  mounted: boolean;
  toggleLanguage: () => void;
  toggleTheme: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// 默认值 - 服务端和客户端初始状态保持一致
const DEFAULT_LANGUAGE: Language = "zh";
const DEFAULT_THEME: Theme = "dark";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    return (localStorage.getItem("language") as Language) || DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    return (localStorage.getItem("theme") as Theme) || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 初始状态使用固定默认值，避免 hydration mismatch
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 只有在客户端挂载后才从 localStorage 读取实际值
    setLanguage(getInitialLanguage());
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "zh" ? "en" : "zh";
    setLanguage(newLang);
    try {
      localStorage.setItem("language", newLang);
    } catch {
      // 忽略 localStorage 错误
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      // 忽略 localStorage 错误
    }
  };

  return (
    <LanguageContext.Provider
      value={{ language, theme, mounted, toggleLanguage, toggleTheme }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

export const translations = {
  zh: {
    title: "一一的空间",
    welcome: "欢迎来到一一的空间",
    subtitle: "记录学习与思考的足迹",
    intro:
      "全栈开发者，热衷于探索新技术。熟悉 React、Vue、Node、Web3 等技术，专注前端工程化与性能优化，对 AI Agent 开发保持持续学习与实践。",
    articles: "技术文章",
    personal: "生活随笔",
  },
  en: {
    title: "Yiyi's Space",
    welcome: "Welcome to Yiyi's Space",
    subtitle: "Notes on Learning and Thinking",
    intro:
      "Full‑stack developer passionate about exploring new technologies. Experienced with React, Vue, Node, and Web3, focused on frontend engineering and performance optimization, and continuously learning AI Agent development.",
    articles: "Tech Articles",
    personal: "Personal Life",
  },
};
