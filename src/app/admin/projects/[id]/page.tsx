'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Project {
  id: string
  name: string
  description: string
  type: string
  status: string
  priority: string
  progress: number
  budget: number
  startDate: string | null
  deadline: string | null
  requirements: string
  techStack: string
  tags: string
  client: {
    id: string
    name: string
    email: string
    phone: string | null
    company: string | null
  }
  createdAt: string
  updatedAt: string
}

export default function AdminProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${params.id}`)
      
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      
      if (!res.ok) {
        throw new Error('Failed to fetch project')
      }

      const data = await res.json()
      setProject(data.project || data)
    } catch (err) {
      setError('Failed to load project details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'on-hold': 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/admin/projects')}>
            Back to Projects
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/projects')}
            className="text-gray-600 hover:text-gray-900 mb-2 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Edit Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Project Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="mt-1 text-gray-900 font-medium">{project.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Progress</label>
                <div className="mt-1">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Budget</label>
                <p className="mt-1 text-gray-900 font-medium">${project.budget.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="mt-1 text-gray-900">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Deadline</label>
                <p className="mt-1 text-gray-900">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="mt-1 text-gray-900">{new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* Requirements */}
          {project.requirements && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{project.requirements}</p>
              </div>
            </Card>
          )}

          {/* Tech Stack */}
          {project.techStack && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Technology Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.split(',').map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Tags */}
          {project.tags && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.split(',').map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Client Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-gray-900 font-medium">{project.client.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-gray-900">{project.client.email}</p>
              </div>
              {project.client.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-gray-900">{project.client.phone}</p>
                </div>
              )}
              {project.client.company && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="mt-1 text-gray-900">{project.client.company}</p>
                </div>
              )}
              <Button
                onClick={() => router.push(`/admin/clients/${project.client.id}`)}
                className="w-full mt-4 bg-gray-600 hover:bg-gray-700"
              >
                View Client Profile
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button
                onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Edit Project
              </Button>
              <Button
                onClick={() => router.push(`/admin/projects/${project.id}/files`)}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Manage Files
              </Button>
              <Button
                onClick={() => router.push(`/admin/projects/${project.id}/milestones`)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                View Milestones
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
