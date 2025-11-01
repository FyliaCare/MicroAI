'use client'

import { useEffect, useState } from 'react'

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

export default function AdvancedDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Empty useEffect to maintain hook count consistency
  useEffect(() => {
    // Mobile detection removed to prevent hydration issues
    // Use CSS media queries instead: hidden md:block / block md:hidden
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setData(result.dashboard)
        setError(null)
      } else {
        setError(result.error || 'Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">No dashboard data available</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'from-blue-500 to-blue-600',
      'in-progress': 'from-yellow-500 to-orange-500',
      completed: 'from-green-500 to-emerald-600',
      'on-hold': 'from-gray-500 to-gray-600',
      pending: 'from-purple-500 to-purple-600',
    }
    return colors[status.toLowerCase()] || 'from-gray-500 to-gray-600'
  }

  const profitMargin = data.financial.totalRevenue > 0
    ? ((data.financial.totalProfit / data.financial.totalRevenue) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time business insights and performance metrics</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          {['Today', 'Week', 'Month', 'Year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period.toLowerCase())}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedPeriod === period.toLowerCase()
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
              <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-1">${data.financial.totalRevenue.toLocaleString()}</h3>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-blue-100">+12.5% from last month</span>
            </div>
          </div>
        </div>

        {/* Active Projects Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm font-medium">Active Projects</p>
              <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-1">{data.overview.projects.active}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-100">{data.overview.projects.total} total projects</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {data.overview.projects.completionRate}% complete
              </span>
            </div>
          </div>
        </div>

        {/* Total Clients Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm font-medium">Total Clients</p>
              <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-1">{data.overview.clients.total}</h3>
            <div className="flex items-center text-sm">
              <span className="text-green-100">{data.overview.clients.active} active clients</span>
            </div>
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100 text-sm font-medium">Profit Margin</p>
              <svg className="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-1">{profitMargin}%</h3>
            <div className="flex items-center text-sm">
              <span className="text-orange-100">${data.financial.totalProfit.toLocaleString()} profit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Project Status</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {data.charts.projectsByStatus.map((item, index) => {
              const total = data.charts.projectsByStatus.reduce((sum, i) => sum + i.count, 0)
              const percentage = total > 0 ? ((item.count / total) * 100).toFixed(0) : '0'
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusColor(item.status)} mr-2`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">{item.count}</span>
                      <span className="text-xs text-gray-500 w-12 text-right">{percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getStatusColor(item.status)} transition-all duration-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Project Types Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Project Types</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Details</button>
          </div>
          
          <div className="space-y-4">
            {data.charts.projectsByType.map((item, index) => {
              const total = data.charts.projectsByType.reduce((sum, i) => sum + i.count, 0)
              const percentage = total > 0 ? ((item.count / total) * 100).toFixed(0) : '0'
              const colors = [
                'from-blue-500 to-blue-600',
                'from-purple-500 to-purple-600',
                'from-pink-500 to-pink-600',
                'from-green-500 to-green-600',
                'from-yellow-500 to-yellow-600',
              ]
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[index % colors.length]} mr-2`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">{item.count}</span>
                      <span className="text-xs text-gray-500 w-12 text-right">{percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Financial Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-600 mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">${data.financial.totalBudget.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Allocated funds</p>
          </div>
          
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="text-sm text-gray-600 mb-1">Total Costs</p>
            <p className="text-2xl font-bold text-gray-900">${data.financial.totalCost.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Expenses incurred</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${data.financial.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Income generated</p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-sm text-gray-600 mb-1">Net Profit</p>
            <p className="text-2xl font-bold text-gray-900">${data.financial.totalProfit.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{profitMargin}% margin</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {data.recent.projects.slice(0, 5).map((project: any) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{project.name}</p>
                  <p className="text-xs text-gray-500">{project.client?.name || 'No client'}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Clients</h3>
          <div className="space-y-3">
            {data.recent.clients.slice(0, 5).map((client: any) => (
              <div key={client.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                  <p className="text-xs text-gray-500">{client.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {data.recent.activity.slice(0, 5).map((activity: any, index: number) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Tasks Overview</h3>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-600">Completion Rate:</span>
              <span className="font-bold text-green-600 ml-2">{data.overview.tasks.completionRate}%</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{data.overview.tasks.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total Tasks</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{data.overview.tasks.completed}</p>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600">{data.overview.tasks.total - data.overview.tasks.completed}</p>
            <p className="text-sm text-gray-600 mt-1">Pending</p>
          </div>
        </div>
      </div>

      {/* Quotes Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Total Quotes</h4>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{data.overview.quotes.total}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Pending Quotes</h4>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{data.overview.quotes.pending}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Accepted Quotes</h4>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold">{data.overview.quotes.accepted}</p>
        </div>
      </div>
    </div>
  )
}
