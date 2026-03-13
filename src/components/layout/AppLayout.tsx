"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import ScrollManager from "@/components/ScrollManager";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <LanguageProvider>
      <PublicHeader />
      <ScrollManager />
      <div>{children}</div>
      <Footer />
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        className="web3-toast"
      />
    </LanguageProvider>
  );
}
