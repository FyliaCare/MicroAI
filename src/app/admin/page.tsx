'use client'

import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/admin/Dashboard'
import ProjectsManager from '@/components/admin/ProjectsManager'
import ClientsManager from '@/components/admin/ClientsManager'
import ServicesManager from '@/components/admin/ServicesManager'
import Analytics from '@/components/admin/Analytics'
import SettingsManager from '@/components/admin/SettingsManager'
import TeamManager from '@/components/admin/TeamManager'
import TimeTracker from '@/components/admin/TimeTracker'
import TaskManager from '@/components/admin/TaskManager'
import DocumentManager from '@/components/admin/DocumentManager'
import CommunicationsLog from '@/components/admin/CommunicationsLog'
import ExpenseTracker from '@/components/admin/ExpenseTracker'

export default function AdminDashboard() {
  const router = useRouter()
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
                            <p className="text-sm mt-1">You&apos;re all caught up!</p>
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
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                    activeTab === 'overview' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { 
                    router.push('/admin/quotes')
                    setSidebarOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 text-gray-600 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Quotes
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('clients'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                    activeTab === 'clients' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Clients
                </button>
              </li>
              <li>
                <Link
                  href="/admin/quotes"
                  className="w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 text-gray-600 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Quotes
                </Link>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('services'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                    activeTab === 'services' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Services
                </button>
              </li>
              
              {/* Advanced Features Divider */}
              <li className="pt-4">
                <div className="px-4 pb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Advanced</p>
                </div>
              </li>

              <li>
                <button
                  onClick={() => { setActiveTab('team'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                    activeTab === 'team' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('time'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                    activeTab === 'time' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('tasks'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                    activeTab === 'tasks' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Tasks
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('documents'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                    activeTab === 'documents' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Documents
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('communications'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                    activeTab === 'communications' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Communications
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('expenses'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                    activeTab === 'expenses' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Expenses
                </button>
              </li>

              {/* Bottom Section */}
              <li className="pt-4">
                <div className="border-t pt-4">
                  <button
                    onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                      activeTab === 'analytics' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </button>
                </div>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation flex items-center gap-2 ${
                    activeTab === 'settings' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:w-auto">
          {activeTab === 'overview' && <Dashboard />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'clients' && <ClientsManager />}
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'team' && <TeamManager />}
          {activeTab === 'time' && <TimeTracker />}
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'documents' && <DocumentManager />}
          {activeTab === 'communications' && <CommunicationsLog />}
          {activeTab === 'expenses' && <ExpenseTracker />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'settings' && <SettingsManager />}
        </main>
      </div>
    </div>
  )
}