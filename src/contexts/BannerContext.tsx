'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface BannerContextType {
  isBannerVisible: boolean
  setIsBannerVisible: (visible: boolean) => void
  bannerHeight: number
}

const BannerContext = createContext<BannerContextType | undefined>(undefined)

export function BannerProvider({ children }: { children: ReactNode }) {
  const [isBannerVisible, setIsBannerVisible] = useState(true)
  const [bannerHeight, setBannerHeight] = useState(52)

  // Update banner height based on screen size
  useEffect(() => {
    const updateHeight = () => {
      setBannerHeight(window.innerWidth >= 640 ? 56 : 52)
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <BannerContext.Provider value={{ isBannerVisible, setIsBannerVisible, bannerHeight }}>
      {children}
    </BannerContext.Provider>
  )
}

export function useBanner() {
  const context = useContext(BannerContext)
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider')
  }
  return context
}
