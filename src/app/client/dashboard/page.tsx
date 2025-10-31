'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import NewProjectRequestModal from '@/components/client/NewProjectRequestModal'

interface Project {
  id: string
  name: string
  description: string | null
  type: string
  status: string
  priority: string
  progress: number
  startDate: string | null
  deadline: string | null
  techStack: string[]
  unreadUpdates: number
  totalUploads: number
  codeAccessStatus: string
  recentUpdates: Array<{
    id: string
    title: string
    type: string
    createdAt: string
    isRead: boolean
  }>
}

interface Stats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalUnreadUpdates: number
  totalUploads: number
}

interface Activity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  icon: string
  color: string
}

export default function ClientDashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [clientInfo, setClientInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [session, setSession] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      // Get session from localStorage
      const sessionStr = localStorage.getItem('clientSession')
      if (!sessionStr) {
        router.push('/client/login')
        return
      }

      const sessionData = JSON.parse(sessionStr)
      setSession(sessionData)

      // Check if must change password
      if (sessionData.user.mustChangePassword) {
        router.push('/client/change-password')
        return
      }

      // Fetch projects
      const response = await fetch('/api/client/projects', {
        headers: {
          'Authorization': `Bearer ${sessionData.token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('clientSession')
          router.push('/client/login')
          return
        }
        setError(data.error || 'Failed to load dashboard')
        setIsLoading(false)
        return
      }

      if (data.success) {
        setProjects(data.projects)
        setStats(data.stats)
        setClientInfo(data.client)
      }

      setIsLoading(false)
    } catch (err) {
      console.error('Dashboard error:', err)
      setError('Failed to load dashboard')
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('clientSession')
    router.push('/client/login')
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      review: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      'on-hold': 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    }
    return colors[priority] || 'text-gray-600'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Generate mock activities
  useEffect(() => {
    if (projects.length > 0) {
      const activities: Activity[] = []
      projects.forEach(project => {
        project.recentUpdates?.forEach(update => {
          activities.push({
            id: update.id,
            type: update.type,
            title: update.title,
            description: `Update on ${project.name}`,
            timestamp: update.createdAt,
            icon: update.type === 'milestone' ? '🎯' : update.type === 'document' ? '📄' : '💬',
            color: update.type === 'milestone' ? 'blue' : update.type === 'document' ? 'purple' : 'green'
          })
        })
      })
      setRecentActivities(activities.slice(0, 5))
    }
  }, [projects])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your workspace...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your dashboard</p>
        </div>
      </div>
    )
  }

  const filteredProjects = filterStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status === filterStatus)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Advanced Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    {clientInfo?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Client Portal
                    </h1>
                    {clientInfo && (
                      <p className="text-gray-600 text-sm">
                        Welcome back, <span className="font-medium text-gray-900">{clientInfo.name}</span>
                        {clientInfo.company && <span className="text-gray-400"> • {clientInfo.company}</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {stats && stats.totalUnreadUpdates > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {stats.totalUnreadUpdates}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <h3 className="font-semibold">Notifications</h3>
                      <p className="text-sm text-blue-100">{stats?.totalUnreadUpdates || 0} unread</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {recentActivities.length > 0 ? (
                        recentActivities.map((activity) => (
                          <div key={activity.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{activity.icon}</span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(activity.timestamp)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <p className="text-sm">No new notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quick Actions Dropdown */}
              <Button onClick={() => router.push('/client/change-password')} variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Security
              </Button>
              
              <Button onClick={handleLogout} variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm animate-shake">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Advanced Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {/* Total Projects */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="p-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-medium mb-1">Total Projects</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>
                <div className="text-xs text-gray-500 mt-2">All time</div>
              </div>
            </div>

            {/* Active Projects */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="p-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-medium mb-1">Active</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{stats.activeProjects}</div>
                <div className="text-xs text-gray-500 mt-2">In progress</div>
              </div>
            </div>

            {/* Completed */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="p-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-medium mb-1">Completed</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.completedProjects}</div>
                <div className="text-xs text-gray-500 mt-2">Delivered</div>
              </div>
            </div>

            {/* New Updates */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="p-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  {stats.totalUnreadUpdates > 0 && (
                    <span className="h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                      {stats.totalUnreadUpdates}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 font-medium mb-1">New Updates</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats.totalUnreadUpdates}</div>
                <div className="text-xs text-gray-500 mt-2">Unread</div>
              </div>
            </div>

            {/* Documents */}
            <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="p-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-medium mb-1">Documents</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.totalUploads}</div>
                <div className="text-xs text-gray-500 mt-2">Files</div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Section with Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Your Projects
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} 
                {filterStatus !== 'all' && ` in ${filterStatus} status`}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-700 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Grid View"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="List View"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="p-16 text-center bg-white/50 backdrop-blur">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {projects.length === 0 ? 'No Projects Yet' : 'No Projects Found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {projects.length === 0 
                    ? 'Your projects will appear here once they are created'
                    : `No projects with "${filterStatus}" status`
                  }
                </p>
                {filterStatus !== 'all' && (
                  <Button onClick={() => setFilterStatus('all')} variant="outline" size="sm">
                    Show All Projects
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  {/* Gradient Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                            {project.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {project.name}
                            </h3>
                            <p className="text-xs text-gray-500">{project.type}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs font-bold ${getPriorityColor(project.priority)}`}>
                          {project.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}

                    {/* Progress Bar - Enhanced */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-700 font-medium">Progress</span>
                        <span className="font-bold text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                          style={{ width: `${project.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline - Enhanced */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500">Start</div>
                          <div className="font-medium text-gray-900">{formatDate(project.startDate)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500">Deadline</div>
                          <div className="font-medium text-gray-900">{formatDate(project.deadline)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Tech Stack - Enhanced */}
                    {project.techStack.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 font-medium mb-2">Technologies</div>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.slice(0, 5).map((tech, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 text-xs rounded-full font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 5 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                              +{project.techStack.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Stats - Enhanced */}
                    <div className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded-xl mb-4">
                      {project.unreadUpdates > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                            {project.unreadUpdates}
                          </div>
                          <span className="text-xs text-gray-600">Update{project.unreadUpdates > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-purple-500 text-white flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-600">{project.totalUploads} File{project.totalUploads !== 1 ? 's' : ''}</span>
                      </div>
                      {project.codeAccessStatus === 'approved' && (
                        <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-green-700 font-semibold">Code Access</span>
                        </div>
                      )}
                    </div>

                    {/* Actions - Enhanced */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <Button
                        onClick={() => {
                          console.log('Navigating to project:', project.id)
                          router.push(`/client/project/${project.id}`)
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                        size="sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Timeline */}
        {recentActivities.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {recentActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
                    index !== recentActivities.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br from-${activity.color}-500 to-${activity.color}-600 flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(activity.timestamp)}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions & Help Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Quick Actions</h3>
              </div>
              <p className="text-blue-100 mb-6 text-sm">
                Manage your account and explore our services
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur text-left"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <div>
                    <div className="font-semibold">New Project Request</div>
                    <div className="text-xs text-blue-100">Submit a new project</div>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/client/requests')}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur text-left"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="font-semibold">My Requests</div>
                    <div className="text-xs text-blue-100">View & track submissions</div>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/client/change-password')}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur text-left"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="font-semibold">Change Password</div>
                    <div className="text-xs text-blue-100">Update your security</div>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur text-left"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <div>
                    <div className="font-semibold">Visit Main Website</div>
                    <div className="text-xs text-blue-100">Explore our services</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Support Card - Redesigned Compact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900">Need Help?</h3>
                  <p className="text-xs text-gray-500">We're here to assist</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Questions about your projects or need technical assistance?
              </p>
              
              <div className="space-y-2">
                <Button
                  onClick={() => window.location.href = 'mailto:sales@microaisystems.com'}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs py-2"
                  size="sm"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </Button>
                
                <div className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-xs text-gray-700 font-medium truncate">+233 244 486 837</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-semibold">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Project Request Modal */}
      <NewProjectRequestModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSuccess={() => {
          loadDashboard()
        }}
      />
    </div>
  )
}
