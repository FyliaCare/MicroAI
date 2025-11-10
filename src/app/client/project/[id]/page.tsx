'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ClientCommentSection from '@/components/client/ClientCommentSection'
import GoogleDriveUploadButton from '@/components/client/GoogleDriveUploadButton'

interface Project {
  id: string
  name: string
  description: string
  type: string
  status: string
  priority: string
  progress: number
  budget: number
  startDate: string
  deadline: string
  requirements?: string
  techStack: string[]
  tags?: string
  notes?: string
  githubRepo?: string
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
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProject()
      fetchUploads()
      fetchComments()
    }
  }, [params.id, refreshKey])

  useEffect(() => {
    console.log('📋 Client uploads state updated:', uploads.length, 'uploads')
    if (uploads.length > 0) {
      console.log('📄 First upload:', uploads[0])
    }
  }, [uploads])

  const fetchProject = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.token

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
      const token = session.token

      if (!token) return

      console.log('🔍 Client fetching uploads for project:', params.id)

      const res = await fetch(`/api/client/projects/${params.id}/uploads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('📡 Client uploads fetch response status:', res.status)

      if (res.ok) {
        const data = await res.json()
        console.log('📦 Client uploads data received:', data)
        console.log('📊 Number of uploads:', data.uploads?.length || 0)
        setUploads(data.uploads || [])
      } else {
        console.error('❌ Failed to fetch client uploads, status:', res.status)
      }
    } catch (err) {
      console.error('❌ Failed to fetch uploads:', err)
    }
  }

  const fetchComments = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.token

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '🔴'
      case 'high':
        return '🟠'
      case 'medium':
        return '🔵'
      case 'low':
        return '⚪'
      default:
        return '⚪'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper to normalize tech stack (handle both string and array)
  const getTechStackArray = (techStack: any): string[] => {
    if (!techStack) return []
    if (Array.isArray(techStack)) return techStack.filter(t => t && t.trim())
    if (typeof techStack === 'string') return techStack.split(',').map(t => t.trim()).filter(t => t)
    return []
  }

  // Helper to format status safely
  const formatStatus = (status: string | null | undefined): string => {
    if (!status) return 'Unknown'
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/client/dashboard')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          
          {/* Project Header Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {currentProject.name ? currentProject.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{currentProject.name}</h1>
                    <p className="text-sm text-slate-600 mt-1">{currentProject.type}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(currentProject.status)}`}>
                    {formatStatus(currentProject.status)}
                  </span>
                  {currentProject.priority && (
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getPriorityColor(currentProject.priority)}`}>
                      {getPriorityIcon(currentProject.priority)} {currentProject.priority.charAt(0).toUpperCase() + currentProject.priority.slice(1)} Priority
                    </span>
                  )}
                  <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                    {currentProject.progress}% Complete
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href = 'mailto:sales@microaisystems.com'}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                <span className="text-sm font-bold text-blue-600">{currentProject.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${currentProject.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'files'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Files
                {uploads.length > 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                    {uploads.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'comments'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments
                {comments.length > 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                    {comments.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 min-h-0">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Project Description */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Project Description</h2>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed">
                      {currentProject.description || 'No description available.'}
                    </p>
                  </div>
                </div>

                {/* Project Requirements */}
                {currentProject.requirements && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">Project Requirements</h2>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {currentProject.requirements}
                      </p>
                    </div>
                  </div>
                )}

                {/* Technology Stack */}
                {currentProject.techStack && getTechStackArray(currentProject.techStack).length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">Technology Stack</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getTechStackArray(currentProject.techStack).map((tech, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-800 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Tags */}
                {currentProject.tags && currentProject.tags.trim() && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">Project Tags</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 text-pink-800 rounded-lg text-sm font-medium"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Notes/Updates from Admin */}
                {currentProject.notes && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">Updates & Notes</h2>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {currentProject.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* GitHub Repository */}
                {currentProject.githubRepo && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">Source Code</h2>
                    </div>
                    <a
                      href={currentProject.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 rounded-xl border border-gray-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">View Repository</p>
                          <p className="text-sm text-slate-600 truncate max-w-xs">{currentProject.githubRepo}</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Project Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Project Timeline</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">Project Started</p>
                        <p className="text-sm text-slate-600">{formatDate(currentProject.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-4 p-4 rounded-xl border ${
                      currentProject.progress >= 100
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                    }`}>
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        currentProject.progress >= 100
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}>
                        {currentProject.progress >= 100 ? '✓' : currentProject.progress + '%'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">
                          {currentProject.progress >= 100 ? 'Project Completed' : 'In Progress'}
                        </p>
                        <p className="text-sm text-slate-600">
                          {currentProject.progress >= 100 ? 'All tasks finished!' : `${100 - currentProject.progress}% remaining`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">Target Deadline</p>
                        <p className="text-sm text-slate-600">{formatDate(currentProject.deadline)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Project Files & Assets</h2>
                </div>
                <GoogleDriveUploadButton projectId={params.id as string} />
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Discussion & Comments</h2>
                </div>
                <ClientCommentSection projectId={params.id as string} />
              </div>
            )}
          </div>

          {/* Sidebar - Sticky with independent scroll */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto custom-scrollbar">
            {/* Project Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Project Details
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Budget</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${currentProject.budget?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Start Date</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatDate(currentProject.startDate)}
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Deadline</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatDate(currentProject.deadline)}
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Progress</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {currentProject.progress}%
                  </p>
                  <div className="mt-2 w-full bg-white rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${currentProject.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Need Help?
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Questions about your project? Our team is here to help!
              </p>
              <button
                onClick={() => window.location.href = 'mailto:sales@microaisystems.com'}
                className="w-full px-4 py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </button>
            </div>

            {/* Project Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Project Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Files</p>
                      <p className="text-xs text-slate-600">Uploaded assets</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{uploads.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Comments</p>
                      <p className="text-xs text-slate-600">Team discussion</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-pink-600">{comments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
