'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Projects', href: '/admin/projects', icon: '🚀' },
  { name: 'Clients', href: '/admin/clients', icon: '👥' },
  { name: 'Quotes', href: '/admin/quotes', icon: '📄' },
  { name: 'Receipts', href: '/admin/receipts', icon: '🧾' },
  { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white"
      >
        {collapsed ? '☰' : '✕'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            {!collapsed ? (
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MicroAI Admin
                </h2>
                <p className="text-sm text-gray-400 mt-1">Dashboard</p>
              </div>
            ) : (
              <div className="text-center text-2xl">🎯</div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                title={collapsed ? item.name : ''}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            {!collapsed ? (
              <div className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                >
                  <span>🌐</span>
                  <span className="text-sm">View Site</span>
                </Link>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                >
                  <span>🚪</span>
                  <span className="text-sm">Logout</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2 text-center">
                <Link
                  href="/"
                  className="block px-2 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                  title="View Site"
                >
                  🌐
                </Link>
                <Link
                  href="/admin/login"
                  className="block px-2 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                  title="Logout"
                >
                  🚪
                </Link>
              </div>
            )}

            {/* Collapse Toggle (Desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center w-full mt-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
            >
              <span>{collapsed ? '→' : '←'}</span>
              {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  )
}
