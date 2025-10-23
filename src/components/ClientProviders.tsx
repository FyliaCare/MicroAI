'use client'

import { BannerProvider } from '@/contexts/BannerContext'
import { ReactNode } from 'react'

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <BannerProvider>
      {children}
    </BannerProvider>
  )
}
