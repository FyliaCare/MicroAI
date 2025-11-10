'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import NewFileUploadSection from '@/components/admin/NewFileUploadSection'
import AdminCommentSection from '@/components/admin/AdminCommentSection'
import GoogleDriveSettings from '@/components/admin/GoogleDriveSettings'

interface ProjectFile {
  id: string
  filename: string
  fileUrl: string
  fileSize: number
  fileType: string
  description?: string
  uploadedAt: Date
  uploadedBy: string
}

interface Comment {
  id: string
  content: string
  authorName: string
  authorRole: 'ADMIN' | 'CLIENT'
  createdAt: Date
  replies?: Comment[]
}

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
  techStack: string[]
  tags: string
  client: {
    id: string
    name: string
    email: string
    phone: string | null
    company: string | null
    userId: string | null
  }
  createdAt: string
  updatedAt: string
}

type TabType = 'overview' | 'files' | 'comments'

export default function AdminProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [refreshKey, setRefreshKey] = useState(0)
  const [debugMode, setDebugMode] = useState(true) // Debug mode to see what's happening

  useEffect(() => {
    if (params.id) {
      console.log('🚀 Page mounted, fetching data for project:', params.id)
      fetchProject()
      fetchFiles()
      fetchComments()
    }
  }, [params.id, refreshKey])

  useEffect(() => {
    console.log('📋 Files state updated:', files.length, 'files')
    if (files.length > 0) {
      console.log('📄 First file:', files[0])
    }
  }, [files])

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

  const fetchFiles = async () => {
    try {
      console.log('🔍 Fetching files for project:', params.id)
      const response = await fetch(`/api/admin/projects/${params.id}/uploads`)
      console.log('📡 Files fetch response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Files data received:', data)
        console.log('📊 Number of files:', data.files?.length || 0)
        setFiles(data.files || [])
      } else {
        console.error('❌ Failed to fetch files, status:', response.status)
      }
    } catch (err) {
      console.error('❌ Failed to fetch files:', err)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${params.id}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Debug Panel - Remove this after testing */}
        {debugMode && (
          <div className="mb-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-yellow-900">🔍 DEBUG MODE</h3>
              <button 
                onClick={() => setDebugMode(false)}
                className="text-yellow-900 hover:text-yellow-700"
              >
                ✕ Close
              </button>
            </div>
            <div className="text-sm space-y-1 text-yellow-900">
              <p><strong>Project ID:</strong> {params.id}</p>
              <p><strong>Active Tab:</strong> {activeTab}</p>
              <p><strong>Files Count:</strong> {files.length}</p>
              <p><strong>Comments Count:</strong> {comments.length}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {error || 'None'}</p>
              <div className="mt-2 pt-2 border-t border-yellow-300">
                <p className="font-semibold mb-1">Quick Actions:</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { fetchFiles(); fetchComments(); }}
                    className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs"
                  >
                    🔄 Refresh Data
                  </button>
                  <button 
                    onClick={() => setActiveTab('files')}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  >
                    📁 Go to Files
                  </button>
                  <button 
                    onClick={() => setActiveTab('comments')}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs"
                  >
                    💬 Go to Comments
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => router.push('/admin/projects')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Projects</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex items-start gap-4 flex-1">
              {/* Project Icon */}
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              
              {/* Project Info */}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(project.priority)}`}>
                    {project.priority} Priority
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                    {project.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Project
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Project Progress</span>
              <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 animate-pulse"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex mb-6 border border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 md:px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 md:px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'files'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>Files</span>
            {files.length > 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {files.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 md:px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'comments'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comments</span>
            {comments.length > 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {comments.length}
              </span>
            )}
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 min-h-0">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Project Description */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Description</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </div>

                {/* Requirements */}
                {project.requirements && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Requirements</h2>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{project.requirements}</p>
                  </div>
                )}

                {/* Tech Stack */}
                {project.techStack && Array.isArray(project.techStack) && project.techStack.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Technology Stack</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 rounded-lg text-sm font-semibold border border-purple-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Timeline</h2>
                  </div>
                  <div className="space-y-4">
                    {/* Started */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Project Started</h3>
                        <p className="text-gray-600">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}
                        </p>
                      </div>
                    </div>

                    {/* In Progress */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Current Progress</h3>
                        <p className="text-gray-600">{project.progress}% Complete</p>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Target Deadline</h3>
                        <p className="text-gray-600">
                          {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">File Upload Management</h2>
                </div>
                <GoogleDriveSettings projectId={project.id} />
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Project Discussion</h2>
                </div>
                <AdminCommentSection projectId={project.id} />
              </div>
            )}
          </div>

          {/* Sidebar - Sticky with independent scroll */}
          <div className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto custom-scrollbar space-y-6">
            {/* Project Details */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Budget</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.budget ? `$${project.budget.toLocaleString()}` : 'Not set'}
                  </p>
                </div>
                <div className="border-t border-blue-200 pt-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Start Date</p>
                  <p className="text-gray-900 font-semibold">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div className="border-t border-blue-200 pt-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Deadline</p>
                  <p className="text-gray-900 font-semibold">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Client</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Name</p>
                  <p className="text-gray-900 font-semibold">{project.client.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                  <p className="text-gray-900">{project.client.email}</p>
                </div>
                {project.client.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Phone</p>
                    <p className="text-gray-900">{project.client.phone}</p>
                  </div>
                )}
                {project.client.company && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Company</p>
                    <p className="text-gray-900">{project.client.company}</p>
                  </div>
                )}
                <Button
                  onClick={() => {
                    if (project.client.userId) {
                      router.push(`/admin/clients/${project.client.userId}/profile`)
                    }
                  }}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                >
                  View Client Profile
                </Button>
              </div>
            </div>

            {/* Project Activity */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700">Comments</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">{comments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
