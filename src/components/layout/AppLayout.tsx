"use client";

import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import ScrollManager from "@/components/ScrollManager";
import PageTransition from "@/components/layout/PageTransition";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function ThemeTransition({ children }: { children: React.ReactNode }) {
  const { theme } = useLanguage();
  const prevTheme = useRef(theme);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (prevTheme.current !== theme) {
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 400);
      prevTheme.current = theme;
      return () => clearTimeout(timer);
    }
  }, [theme]);

  return (
    <div className={`${transitioning ? 'theme-transition' : ''}`}>
      {children}
    </div>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeTransition>
      <PublicHeader />
      <ScrollManager />
      <div className="noise-overlay" />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        className="web3-toast"
      />
    </ThemeTransition>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <InnerLayout>{children}</InnerLayout>
    </LanguageProvider>
  );
}
