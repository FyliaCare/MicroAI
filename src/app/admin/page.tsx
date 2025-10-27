'use client'

import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import AdvancedDashboard from '@/components/admin/AdvancedDashboard'
import AdvancedProjectsManager from '@/components/admin/AdvancedProjectsManager'
import AdvancedClientsManager from '@/components/admin/AdvancedClientsManager'
import AdvancedQuotesManager from '@/components/admin/AdvancedQuotesManager'
import AdvancedServicesManager from '@/components/admin/AdvancedServicesManager'
import AdvancedAnalytics from '@/components/admin/AdvancedAnalytics'
import AdvancedSettingsManager from '@/components/admin/AdvancedSettingsManager'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications')
      const data = await response.json()
      if (data.success) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })
      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      })
      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Fetch notifications on mount and every 30 seconds
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 min-w-[44px] min-h-[44px] touch-manipulation"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900">MicroAI</Link>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="text-sm sm:text-lg text-gray-600 hidden sm:inline">Management Dashboard</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {session?.user?.name && (
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {session.user.name}
                </span>
              )}
              
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 min-w-[44px] min-h-[44px]"
                  aria-label="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-40 max-h-[500px] overflow-hidden flex flex-col">
                      {/* Header */}
                      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="font-medium">No notifications</p>
                            <p className="text-sm mt-1">You're all caught up!</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                                !notif.isRead ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => {
                                if (!notif.isRead) markAsRead(notif.id)
                                if (notif.link) {
                                  setShowNotifications(false)
                                  // Handle navigation if needed
                                }
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                  !notif.isRead ? 'bg-blue-500' : 'bg-gray-300'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-gray-900">
                                    {notif.title}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    {new Date(notif.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button className="text-gray-600 hover:text-gray-900 hidden sm:block">Settings</button>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 text-sm sm:text-base min-h-[44px] touch-manipulation"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <nav className={`
          fixed lg:static
          inset-y-0 left-0
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out
          w-64 bg-white shadow-sm
          z-30 lg:z-0
          overflow-y-auto
        `}>
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'overview' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'projects' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('clients'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'clients' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Clients
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('quotes'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'quotes' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Quotes
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('services'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'services' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'analytics' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'settings' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:w-auto">
          {activeTab === 'overview' && <AdvancedDashboard />}
          {activeTab === 'projects' && <AdvancedProjectsManager />}
          {activeTab === 'clients' && <AdvancedClientsManager />}
          {activeTab === 'quotes' && <AdvancedQuotesManager />}
          {activeTab === 'services' && <AdvancedServicesManager />}
          {activeTab === 'analytics' && <AdvancedAnalytics />}
          {activeTab === 'settings' && <AdvancedSettingsManager />}
        </main>
      </div>
    </div>
  )
}