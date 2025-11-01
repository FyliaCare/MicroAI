'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings,
  Users,
  BarChart3
} from 'lucide-react'

interface AdminNavItem {
  href: string
  icon: React.ReactNode
  label: string
  activePattern: RegExp
}

const adminNavItems: AdminNavItem[] = [
  {
    href: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'Dashboard',
    activePattern: /^\/admin\/?$/,
  },
  {
    href: '/admin/quotes',
    icon: <FileText className="w-5 h-5" />,
    label: 'Quotes',
    activePattern: /^\/admin\/quotes/,
  },
  {
    href: '/admin/chat',
    icon: <MessageSquare className="w-5 h-5" />,
    label: 'Chat',
    activePattern: /^\/admin\/chat/,
  },
  {
    href: '/admin/visitor-analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    label: 'Analytics',
    activePattern: /^\/admin\/visitor-analytics/,
  },
  {
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
    label: 'Settings',
    activePattern: /^\/admin\/settings/,
  },
]

export default function AdminMobileBottomNav() {
  const pathname = usePathname()

  // Only show on admin pages
  if (!pathname?.startsWith('/admin')) {
    return null
  }

  const isActive = (pattern: RegExp) => pattern.test(pathname || '')

  return (
    <>
      {/* Bottom Navigation - Only visible on mobile/tablet */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/98 backdrop-blur-xl border-t border-gray-800 pb-safe shadow-2xl">
        <div className="flex items-center justify-around px-1 py-2">
          {adminNavItems.map((item) => {
            const active = isActive(item.activePattern)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex flex-col items-center justify-center
                  min-w-[60px] py-2 px-2 rounded-xl
                  transition-all duration-300 ease-out
                  active:scale-90 touch-manipulation
                  ${active 
                    ? 'text-blue-400' 
                    : 'text-gray-400 hover:text-gray-200'
                  }
                `}
              >
                {/* Active indicator background */}
                {active && (
                  <div className="absolute inset-0 bg-blue-600/20 rounded-xl animate-pulse" />
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
                  relative z-10 text-[10px] font-medium mt-1 transition-all duration-300
                  ${active ? 'font-bold' : ''}
                `}>
                  {item.label}
                </span>

                {/* Active indicator line */}
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
        
        {/* iOS-style home indicator */}
        <div className="flex justify-center pb-1">
          <div className="w-32 h-1 bg-gray-700 rounded-full" />
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="md:hidden h-20" />
    </>
  )
}
