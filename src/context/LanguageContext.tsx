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
  toggleLanguage: () => void;
  toggleTheme: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedLang) setLanguage(savedLang);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "zh" ? "en" : "zh";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <LanguageContext.Provider
      value={{ language, theme, toggleLanguage, toggleTheme }}
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
