'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

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

export default function ClientDashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [clientInfo, setClientInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [session, setSession] = useState<any>(null)

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
              {clientInfo && (
                <p className="text-gray-600 text-sm mt-1">
                  Welcome back, {clientInfo.name}
                  {clientInfo.company && ` • ${clientInfo.company}`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => router.push('/client/change-password')} variant="outline">
                Change Password
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-sm text-gray-600 mb-1">Total Projects</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.activeProjects}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-gray-600 mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-600">{stats.completedProjects}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-gray-600 mb-1">New Updates</div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalUnreadUpdates}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-gray-600 mb-1">Documents</div>
              <div className="text-3xl font-bold text-purple-600">{stats.totalUploads}</div>
            </Card>
          </div>
        )}

        {/* Projects List */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Projects</h2>
          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 mb-4">No projects yet</p>
              <p className="text-sm text-gray-500">
                Your projects will appear here once they're created
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.type}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority} priority
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  )}

                  {/* Timeline */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Start:</span>
                      <span className="ml-2 text-gray-900">{formatDate(project.startDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <span className="ml-2 text-gray-900">{formatDate(project.deadline)}</span>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  {project.techStack.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.slice(0, 4).map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{project.techStack.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    {project.unreadUpdates > 0 && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <span className="font-medium">{project.unreadUpdates}</span>
                        <span>new update{project.unreadUpdates > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-gray-600">
                      <span className="font-medium">{project.totalUploads}</span>
                      <span>document{project.totalUploads !== 1 ? 's' : ''}</span>
                    </div>
                    {project.codeAccessStatus === 'approved' && (
                      <span className="text-green-600 text-xs font-medium">✓ Code Access</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() => router.push(`/client/project/${project.id}`)}
                      className="flex-1"
                      size="sm"
                    >
                      View Details
                    </Button>
                    {project.codeAccessStatus === 'not-requested' && (
                      <Button
                        onClick={() => router.push(`/client/project/${project.id}#code-access`)}
                        variant="outline"
                        size="sm"
                      >
                        Request Code
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-800 mb-4">
            If you have any questions about your projects or need assistance:
          </p>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" onClick={() => window.location.href = 'mailto:support@microai.systems'}>
              Contact Support
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/')}>
              Visit Main Site
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
