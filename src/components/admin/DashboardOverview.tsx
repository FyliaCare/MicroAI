'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardStats {
  overview: {
    projects: {
      total: number
      active: number
      completed: number
      completionRate: number
    }
    clients: {
      total: number
      active: number
    }
    quotes: {
      total: number
      pending: number
      accepted: number
    }
    tasks: {
      total: number
      completed: number
      completionRate: number
    }
  }
  financial: {
    totalBudget: number
    totalCost: number
    totalRevenue: number
    totalProfit: number
  }
  charts: {
    projectsByStatus: Array<{ status: string; count: number }>
    projectsByType: Array<{ type: string; count: number }>
  }
  recent: {
    projects: any[]
    clients: any[]
    activity: any[]
  }
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      if (data.success) {
        setStats(data.dashboard)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      review: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      'on-hold': 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to your MicroAI management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Projects */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Projects</h3>
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.overview.projects.total}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.overview.projects.active} active</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-600">{stats.overview.projects.completed} completed</span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${stats.overview.projects.completionRate}%` }}
            />
          </div>
        </div>

        {/* Clients */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Clients</h3>
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.overview.clients.total}</p>
          <p className="mt-2 text-sm text-gray-600">
            <span className="text-green-600 font-medium">{stats.overview.clients.active}</span> active clients
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.financial.totalRevenue)}</p>
          <p className="mt-2 text-sm text-gray-600">
            Profit: <span className="text-green-600 font-medium">{formatCurrency(stats.financial.totalProfit)}</span>
          </p>
        </div>

        {/* Quotes */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Quotes</h3>
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.overview.quotes.total}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-yellow-600 font-medium">{stats.overview.quotes.pending} pending</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-green-600 font-medium">{stats.overview.quotes.accepted} accepted</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Projects by Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Status</h3>
          <div className="space-y-3">
            {stats.charts.projectsByStatus.map((item) => (
              <div key={item.status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{item.status.replace('-', ' ')}</span>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${(item.count / stats.overview.projects.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects by Type */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Type</h3>
          <div className="space-y-3">
            {stats.charts.projectsByType.map((item) => (
              <div key={item.type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{item.type.replace('-', ' ')}</span>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${(item.count / stats.overview.projects.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <Link href="/admin/projects" className="text-sm text-blue-600 hover:text-blue-700">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recent.projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.client?.name || 'No client assigned'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recent.activity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
