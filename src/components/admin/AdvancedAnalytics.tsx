'use client'

import { useEffect, useState } from 'react'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    revenueGrowth: number
    totalProjects: number
    projectsGrowth: number
    activeClients: number
    clientsGrowth: number
    avgProjectValue: number
    projectValueGrowth: number
  }
  revenue: {
    monthly: Array<{ month: string; revenue: number; profit: number }>
    byCategory: Array<{ category: string; amount: number; percentage: number }>
    byClient: Array<{ client: string; amount: number; projects: number }>
  }
  projects: {
    byStatus: Array<{ status: string; count: number; percentage: number }>
    byType: Array<{ type: string; count: number; revenue: number }>
    completion: {
      onTime: number
      delayed: number
      total: number
    }
  }
  clients: {
    byStatus: Array<{ status: string; count: number }>
    topClients: Array<{ name: string; projects: number; revenue: number }>
    retention: {
      rate: number
      newClients: number
      returningClients: number
    }
  }
  financial: {
    totalBudget: number
    totalActualCost: number
    totalRevenue: number
    profitMargin: number
    invoices: {
      paid: number
      pending: number
      overdue: number
    }
  }
}

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.analytics)
      } else {
        setError('Failed to load analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-500',
      'in-progress': 'bg-blue-500',
      planning: 'bg-purple-500',
      review: 'bg-yellow-500',
      'on-hold': 'bg-orange-500',
      cancelled: 'bg-red-500',
    }
    return colors[status] || 'bg-gray-500'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Analytics</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics & Insights
          </h1>
          <p className="text-gray-600 mt-1">Business intelligence and performance metrics</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: '1y', label: '1 Year' },
            { value: 'all', label: 'All Time' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium opacity-90">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(analytics.overview.totalRevenue)}</p>
            </div>
            <svg className="w-12 h-12 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className={`flex items-center text-sm ${analytics.overview.revenueGrowth >= 0 ? 'text-green-100' : 'text-red-200'}`}>
            <svg className={`w-4 h-4 mr-1 ${analytics.overview.revenueGrowth >= 0 ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {formatPercent(analytics.overview.revenueGrowth)} from last period
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium opacity-90">Total Projects</p>
              <p className="text-3xl font-bold mt-1">{analytics.overview.totalProjects}</p>
            </div>
            <svg className="w-12 h-12 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className={`flex items-center text-sm ${analytics.overview.projectsGrowth >= 0 ? 'text-blue-100' : 'text-red-200'}`}>
            <svg className={`w-4 h-4 mr-1 ${analytics.overview.projectsGrowth >= 0 ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {formatPercent(analytics.overview.projectsGrowth)} from last period
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium opacity-90">Active Clients</p>
              <p className="text-3xl font-bold mt-1">{analytics.overview.activeClients}</p>
            </div>
            <svg className="w-12 h-12 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className={`flex items-center text-sm ${analytics.overview.clientsGrowth >= 0 ? 'text-purple-100' : 'text-red-200'}`}>
            <svg className={`w-4 h-4 mr-1 ${analytics.overview.clientsGrowth >= 0 ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {formatPercent(analytics.overview.clientsGrowth)} from last period
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium opacity-90">Avg Project Value</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(analytics.overview.avgProjectValue)}</p>
            </div>
            <svg className="w-12 h-12 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className={`flex items-center text-sm ${analytics.overview.projectValueGrowth >= 0 ? 'text-orange-100' : 'text-red-200'}`}>
            <svg className={`w-4 h-4 mr-1 ${analytics.overview.projectValueGrowth >= 0 ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {formatPercent(analytics.overview.projectValueGrowth)} from last period
          </div>
        </div>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue Trend</h3>
          <div className="space-y-4">
            {analytics.revenue.monthly.slice(-6).map((month, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{month.month}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(month.revenue)}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      Profit: {formatCurrency(month.profit)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min((month.revenue / Math.max(...analytics.revenue.monthly.map(m => m.revenue))) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Category</h3>
          <div className="space-y-4">
            {analytics.revenue.byCategory.map((category, index) => {
              const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-green-500 to-emerald-600', 'from-orange-500 to-red-600', 'from-pink-500 to-rose-600']
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(category.amount)}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${colors[index % colors.length]} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Projects Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Project Status</h3>
          <div className="space-y-3">
            {analytics.projects.byStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status)} mr-2`}></div>
                  <span className="text-sm text-gray-700 capitalize">{status.status.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-gray-900 mr-2">{status.count}</span>
                  <span className="text-xs text-gray-500">{status.percentage.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Completion Rate */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Completion Rate</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - analytics.projects.completion.onTime / analytics.projects.completion.total)}`}
                  className="text-green-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {((analytics.projects.completion.onTime / analytics.projects.completion.total) * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">On Time</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">{analytics.projects.completion.onTime}</p>
              <p className="text-xs text-gray-600">On Time</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-orange-600">{analytics.projects.completion.delayed}</p>
              <p className="text-xs text-gray-600">Delayed</p>
            </div>
          </div>
        </div>

        {/* Top Project Types */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Project Types</h3>
          <div className="space-y-4">
            {analytics.projects.byType.slice(0, 5).map((type, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">{type.type.replace('-', ' ')}</span>
                  <span className="text-sm font-bold text-gray-900">{type.count}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Revenue: {formatCurrency(type.revenue)}</span>
                  <span>Avg: {formatCurrency(type.revenue / type.count)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ 
                      width: `${(type.count / Math.max(...analytics.projects.byType.map(t => t.count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client & Financial Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Clients by Revenue</h3>
          <div className="space-y-4">
            {analytics.clients.topClients.slice(0, 5).map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.projects} project{client.projects !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(client.revenue)}</p>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Overview</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Total Budget</span>
                <span className="text-xl font-bold text-blue-600">{formatCurrency(analytics.financial.totalBudget)}</span>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Actual Costs</span>
                <span className="text-xl font-bold text-orange-600">{formatCurrency(analytics.financial.totalActualCost)}</span>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(analytics.financial.totalRevenue)}</span>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profit Margin</span>
                <span className="text-xl font-bold text-purple-600">{analytics.financial.profitMargin.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${Math.min(analytics.financial.profitMargin, 100)}%` }}
                />
              </div>
            </div>

            {/* Invoice Status */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Invoice Status</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center bg-green-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.financial.invoices.paid)}</p>
                  <p className="text-xs text-gray-600 mt-1">Paid</p>
                </div>
                <div className="text-center bg-yellow-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(analytics.financial.invoices.pending)}</p>
                  <p className="text-xs text-gray-600 mt-1">Pending</p>
                </div>
                <div className="text-center bg-red-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(analytics.financial.invoices.overdue)}</p>
                  <p className="text-xs text-gray-600 mt-1">Overdue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Retention */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Client Retention & Growth</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-4xl font-bold mb-2">{analytics.clients.retention.rate.toFixed(1)}%</p>
            <p className="text-sm opacity-90">Retention Rate</p>
          </div>
          
          <div className="text-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <p className="text-4xl font-bold mb-2">{analytics.clients.retention.newClients}</p>
            <p className="text-sm opacity-90">New Clients</p>
          </div>
          
          <div className="text-center bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-4xl font-bold mb-2">{analytics.clients.retention.returningClients}</p>
            <p className="text-sm opacity-90">Returning Clients</p>
          </div>
        </div>
      </div>
    </div>
  )
}
