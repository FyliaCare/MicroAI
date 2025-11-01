'use client'

import { useBanner } from '@/contexts/BannerContext'

export default function DevBanner() {
  const { isBannerVisible, setIsBannerVisible } = useBanner()

  if (!isBannerVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white py-3 px-4 shadow-lg animate-fadeIn">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full animate-pulse">
            <span className="text-2xl">🚧</span>
          </div>
          <div className="flex-1">
            <p className="text-sm sm:text-base font-semibold leading-tight">
              <span className="inline-block mr-2">⚠️</span>
              <span className="font-bold">Website Under Development</span>
              <span className="hidden sm:inline"> — </span>
              <span className="block sm:inline text-xs sm:text-sm font-normal mt-1 sm:mt-0">
                Contact forms and project request features are currently being configured. Please check back soon or email us directly at{' '}
                <a href="mailto:sales@microaisystems.com" className="underline font-semibold hover:text-yellow-200">
                  sales@microaisystems.com
                </a>
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsBannerVisible(false)}
          className="shrink-0 text-white hover:text-yellow-200 transition-colors p-2 hover:bg-white/10 rounded-lg min-w-[44px] min-h-[44px] touch-manipulation"
          aria-label="Close banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
