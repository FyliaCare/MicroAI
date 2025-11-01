'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'

interface NavLink {
  href: string
  label: string
  description?: string
}

const navLinks: NavLink[] = [
  { href: '/services', label: 'Services', description: 'What we build' },
  { href: '/about', label: 'About', description: 'Our story' },
  { href: '/portfolio', label: 'Portfolio', description: 'Live projects' },
  { href: '/contact', label: 'Contact', description: 'Get in touch' },
]

const mobileNavLinks: NavLink[] = [
  { href: '/', label: 'Home', description: 'Back to homepage' },
  ...navLinks,
]

export default function AdvancedNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect for enhanced navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Navigation Bar */}
      <nav 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/95 backdrop-blur-xl border-b border-gray-700/50 shadow-lg shadow-blue-500/5' 
            : 'bg-black/80 backdrop-blur-lg border-b border-gray-800'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <Logo linkTo="/" />
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive(link.href)
                    ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                )}
              </Link>
            ))}
            
            {/* Client Portal Link */}
            <Link
              href="/client/login"
              className="ml-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-all duration-200"
            >
              Client Portal
            </Link>
            
            {/* CTA Button */}
            <button
              onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                setTimeout(() => {
                  const chatButton = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement
                  if (chatButton) chatButton.click()
                }, 500)
              }}
              className="ml-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Start Project
            </button>
          </div>

          {/* Mobile/Tablet Navigation - Hamburger Menu */}
          <button
            className="lg:hidden relative w-10 h-10 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Animated Hamburger Icon */}
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </div>
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile/Tablet Menu Overlay - Outside nav for proper z-index */}
    <div
      className={`lg:hidden fixed top-[52px] left-0 right-0 bottom-0 z-50 bg-black/95 backdrop-blur-xl transition-all duration-300 ${
        mobileMenuOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}
    >
        <div className="h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {mobileNavLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-6 py-4 rounded-xl transition-all duration-200 transform ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/50 text-white scale-[1.02]'
                      : 'bg-gray-900/50 border border-gray-800 text-gray-300 hover:bg-gray-800/70 hover:border-gray-700 hover:text-white active:scale-95'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{link.label}</div>
                      {link.description && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {link.description}
                        </div>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        isActive(link.href) ? 'text-blue-400' : 'text-gray-500'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 pt-8 border-t border-gray-800 space-y-3">
              <Link
                href="/client/login"
                className="block w-full px-6 py-4 bg-gray-900 border border-gray-700 text-white text-center text-lg font-semibold rounded-xl hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 active:scale-95"
              >
                🔐 Client Portal
              </Link>
              
              <button
                onClick={() => {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                  setTimeout(() => {
                    const chatButton = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement
                    if (chatButton) chatButton.click()
                  }, 500)
                }}
                className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 active:scale-95"
              >
                🚀 Start Your Project
              </button>
              <p className="text-center text-gray-400 text-sm mt-4">
                Get 10x faster development
              </p>
            </div>

            {/* Mobile Footer Info */}
            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-400 text-sm mb-2">Need immediate help?</p>
              <a
                href="mailto:microailabs@outlook.com"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
              >
                microailabs@outlook.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
