'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FileUploadSection from '@/components/client/FileUploadSection'
import CommentSection from '@/components/client/CommentSection'

interface Project {
  id: string
  name: string
  description: string
  type: string
  status: string
  progress: number
  budget: number
  startDate: string
  deadline: string
  techStack: string[]
  client: {
    name: string
    email: string
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [uploads, setUploads] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'comments'>('overview')

  useEffect(() => {
    if (params.id) {
      fetchProject()
      fetchUploads()
      fetchComments()
    }
  }, [params.id])

  const fetchProject = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.sessionToken

      if (!token) {
        router.push('/client/login')
        return
      }

      const res = await fetch(`/api/client/projects/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (res.status === 401) {
        router.push('/client/login')
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

  const fetchUploads = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.sessionToken

      if (!token) return

      const res = await fetch(`/api/client/projects/${params.id}/uploads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setUploads(data.uploads || [])
      }
    } catch (err) {
      console.error('Failed to fetch uploads:', err)
    }
  }

  const fetchComments = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.sessionToken

      if (!token) return

      const res = await fetch(`/api/client/projects/${params.id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    }
  }

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      case 'on-hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The project you are looking for does not exist.'}
          </p>
          <Button onClick={() => router.push('/client/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  // Type assertion: project is guaranteed to be non-null here
  const currentProject = project!

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/client/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{currentProject.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(currentProject.status)}`}>
              {currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1).replace('-', ' ')}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">{currentProject.type}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'files'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Files {uploads.length > 0 && `(${uploads.length})`}
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'comments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Comments {comments.length > 0 && `(${comments.length})`}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Project Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {currentProject.description || 'No description available.'}
                  </p>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Progress</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion</span>
                      <span className="font-semibold text-gray-900">{currentProject.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${currentProject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>

                {currentProject.techStack && currentProject.techStack.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Project Files</h2>
                <FileUploadSection
                  projectId={params.id as string}
                  uploads={uploads}
                  onUploadSuccess={() => {
                    fetchUploads()
                  }}
                />
              </Card>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Project Comments</h2>
                <CommentSection
                  projectId={params.id as string}
                  comments={comments}
                  onCommentSuccess={() => {
                    fetchComments()
                  }}
                />
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Project Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Budget</p>
                  <p className="font-semibold text-gray-900">
                    ${currentProject.budget?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(currentProject.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Deadline</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(currentProject.deadline)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-800 mb-4">
                Questions about this project?
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = 'mailto:sales@microaisystems.com'}
                className="w-full"
              >
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
