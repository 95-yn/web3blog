'use client'

import { LanguageProvider } from '@/context/LanguageContext'
import PublicHeader from '@/components/layout/PublicHeader'
import { Toaster } from 'sonner'
import { usePathname } from 'next/navigation'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <LanguageProvider>
      {!isHome && <PublicHeader />}
      <div className={isHome ? '' : 'pt-16'}>
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
