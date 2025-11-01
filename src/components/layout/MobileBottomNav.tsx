'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Briefcase, Phone, User, Menu } from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
  activePattern: RegExp
}

const navItems: NavItem[] = [
  {
    href: '/',
    icon: <Home className="w-6 h-6" />,
    label: 'Home',
    activePattern: /^\/$/,
  },
  {
    href: '/services',
    icon: <Briefcase className="w-6 h-6" />,
    label: 'Services',
    activePattern: /^\/services/,
  },
  {
    href: '/portfolio',
    icon: <Menu className="w-6 h-6" />,
    label: 'Portfolio',
    activePattern: /^\/portfolio/,
  },
  {
    href: '/about',
    icon: <User className="w-6 h-6" />,
    label: 'About',
    activePattern: /^\/about/,
  },
  {
    href: '/contact',
    icon: <Phone className="w-6 h-6" />,
    label: 'Contact',
    activePattern: /^\/contact/,
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const isActive = (pattern: RegExp) => pattern.test(pathname || '')
  
  // Hide bottom nav on admin, client, and auth pages - MUST be after all hooks
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/client') || pathname?.startsWith('/auth')) {
    return null
  }

  // Add haptic-like feedback simulation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    // Simulate haptic feedback with a quick scale animation
    const target = e.currentTarget as HTMLElement
    target.style.transform = 'scale(0.95)'
    setTimeout(() => {
      target.style.transform = 'scale(1)'
    }, 100)
  }

  return (
    <>
      {/* Bottom Navigation - Only visible on mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-gray-800 pb-safe">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.activePattern)
            return (
              <Link
                key={item.href}
                href={item.href}
                onTouchStart={handleTouchStart}
                className={`
                  relative flex flex-col items-center justify-center
                  min-w-[64px] py-2 px-3 rounded-xl
                  transition-all duration-300 ease-out
                  active:scale-95 touch-manipulation
                  ${active 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                  }
                `}
              >
                {/* Active indicator blob */}
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-xl animate-pulse" />
                )}
                
                {/* Icon with active glow */}
                <div className={`
                  relative z-10 transition-all duration-300
                  ${active ? 'scale-110' : 'scale-100'}
                `}>
                  <div className={`
                    ${active ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : ''}
                  `}>
                    {item.icon}
                  </div>
                </div>
                
                {/* Label */}
                <span className={`
                  relative z-10 text-xs font-medium mt-1 transition-all duration-300
                  ${active ? 'font-semibold' : ''}
                `}>
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>
        
        {/* iOS-style home indicator */}
        <div className="flex justify-center pb-1.5">
          <div className="w-32 h-1 bg-gray-700 rounded-full" />
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="lg:hidden h-20" />
    </>
  )
}
