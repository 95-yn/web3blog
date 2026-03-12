'use client'

import { LanguageProvider } from '@/context/LanguageContext'
import PublicHeader from '@/components/layout/PublicHeader'
import { Toaster } from 'sonner'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <PublicHeader />
      <div className="pt-16">
        {children}
      </div>
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        className="web3-toast"
      />
    </LanguageProvider>
  )
}
