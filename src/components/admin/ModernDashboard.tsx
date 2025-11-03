'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardData {
  overview: {
    projects: { total: number; active: number; completed: number; completionRate: number }
    clients: { total: number; active: number }
    quotes: { total: number; pending: number; accepted: number }
    tasks: { total: number; completed: number; completionRate: number }
  }
  financial: {
    totalBudget: number
    totalCost: number
    totalRevenue: number
    totalProfit: number
  }
  recent: {
    projects: any[]
    clients: any[]
    activity: any[]
  }
  charts: {
    projectsByStatus: any[]
    projectsByType: any[]
  }
}

export default function ModernDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setData(result.dashboard)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Quick Action Buttons - ShareIt Style
  const openTasks = data?.overview.tasks ? (data.overview.tasks.total - data.overview.tasks.completed) : 0
  
  const quickActions = [
    { icon: '💼', label: 'Projects', href: '/admin/projects', color: 'from-blue-500 to-blue-600', count: data?.overview.projects.active },
    { icon: '👥', label: 'Clients', href: '/admin/clients', color: 'from-green-500 to-green-600', count: data?.overview.clients.active },
    { icon: '💰', label: 'Quotes', href: '/admin/quotes', color: 'from-purple-500 to-purple-600', count: data?.overview.quotes.pending },
    { icon: '✓', label: 'Tasks', href: '/admin/tasks', color: 'from-pink-500 to-pink-600', count: openTasks },
    { icon: '🌍', label: 'Visitors', href: '/admin/visitors', color: 'from-indigo-500 to-indigo-600' },
    { icon: '📊', label: 'Analytics', href: '/admin/analytics', color: 'from-cyan-500 to-cyan-600' },
  ]

  // Stat Cards - Compact Design
  const stats = [
    { label: 'Total Projects', value: data?.overview.projects.total || 0, icon: '📁', change: `${data?.overview.projects.completionRate || 0}%`, color: 'blue' },
    { label: 'Active Clients', value: data?.overview.clients.active || 0, icon: '👤', change: `${data?.overview.clients.total || 0} total`, color: 'green' },
    { label: 'Pending Quotes', value: data?.overview.quotes.pending || 0, icon: '📝', change: `${data?.overview.quotes.accepted || 0} accepted`, color: 'orange' },
    { label: 'Open Tasks', value: (data?.overview.tasks.total || 0) - (data?.overview.tasks.completed || 0), icon: '✓', change: `${data?.overview.tasks.completionRate || 0}%`, color: 'red' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Header - Clean & Simple */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Welcome back! Here's what's happening</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>

        {/* Quick Actions - ShareIt Style Circular Buttons */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-4 px-1">Quick Actions</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                href={action.href}
                className="flex flex-col items-center group"
              >
                <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${action.color} shadow-lg flex items-center justify-center text-3xl transform transition-all duration-300 group-hover:scale-110 group-active:scale-95`}>
                  {action.icon}
                  {action.count && action.count > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {action.count > 99 ? '99+' : action.count}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-700 mt-2 text-center">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Overview - Compact Cards */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-4 px-1">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed - Clean List */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
            <Link href="/admin/activity" className="text-sm text-blue-600 font-medium hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recent?.activity && data.recent.activity.length > 0 ? (
              data.recent.activity.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    activity.type === 'project' ? 'bg-blue-100' :
                    activity.type === 'client' ? 'bg-green-100' :
                    activity.type === 'quote' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'project' ? '📁' :
                     activity.type === 'client' ? '👤' :
                     activity.type === 'quote' ? '💰' : '📝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <span className="text-4xl mb-2 block">📭</span>
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Create */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-2">🚀 Quick Create</h3>
            <p className="text-sm text-blue-100 mb-4">Start a new project or quote</p>
            <div className="flex gap-2">
              <Link href="/admin/projects/new" className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2 px-3 text-sm font-medium text-center hover:bg-white/30 transition-colors">
                New Project
              </Link>
              <Link href="/admin/quotes/new" className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2 px-3 text-sm font-medium text-center hover:bg-white/30 transition-colors">
                New Quote
              </Link>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-2">📈 Performance</h3>
            <p className="text-sm text-purple-100 mb-4">
              {data?.overview.projects.completed || 0} projects completed this month
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${Math.min(100, (data?.overview.projects.completed || 0) * 10)}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold">{Math.min(100, (data?.overview.projects.completed || 0) * 10)}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
