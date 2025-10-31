'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface ProjectRequest {
  id: string
  requestNumber: string
  projectName: string
  projectType: string
  description: string
  requirements: string
  features: string | null
  techPreferences: string | null
  budget: number | null
  budgetRange: string | null
  deadline: string | null
  priority: string
  status: string
  rejectionReason: string | null
  reviewNotes: string | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
}

export default function ClientRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    projectName: '',
    projectType: '',
    description: '',
    requirements: '',
    features: '',
    techPreferences: '',
    budget: '',
    budgetRange: '',
    deadline: '',
    priority: 'normal',
  })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.token

      if (!token) {
        router.push('/client/login')
        return
      }

      const response = await fetch('/api/client/project-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        router.push('/client/login')
        return
      }

      const data = await response.json()

      if (data.success) {
        setRequests(data.requests || [])
      } else {
        setError(data.error || 'Failed to load requests')
      }
    } catch (err) {
      setError('Failed to load project requests')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (request: ProjectRequest) => {
    setSelectedRequest(request)
    setEditFormData({
      projectName: request.projectName,
      projectType: request.projectType,
      description: request.description,
      requirements: request.requirements,
      features: request.features || '',
      techPreferences: request.techPreferences || '',
      budget: request.budget?.toString() || '',
      budgetRange: request.budgetRange || '',
      deadline: request.deadline || '',
      priority: request.priority,
    })
    setShowEditModal(true)
  }

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return

    setUpdating(true)
    setError('')

    try {
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.token

      const response = await fetch(`/api/client/project-requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      })

      const data = await response.json()

      if (data.success) {
        setShowEditModal(false)
        setSelectedRequest(null)
        fetchRequests()
        alert('✅ Request updated successfully!')
      } else {
        setError(data.error || 'Failed to update request')
      }
    } catch (err) {
      setError('Failed to update request')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'approved': return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'normal': return 'text-blue-600'
      case 'low': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const filteredRequests = requests.filter(req => 
    filterStatus === 'all' || req.status === filterStatus
  )

  const pendingCount = requests.filter(r => r.status === 'pending').length
  const approvedCount = requests.filter(r => r.status === 'approved').length
  const rejectedCount = requests.filter(r => r.status === 'rejected').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/client/dashboard')}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Project Requests
                </h1>
                <p className="text-sm text-gray-600">Track and manage your project submissions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{requests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{approvedCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Declined</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{rejectedCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <span className="text-2xl">❌</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({requests.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Declined ({rejectedCount})
            </button>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Requests Found</h3>
              <p className="text-gray-600 mb-6">
                {requests.length === 0 
                  ? "You haven't submitted any project requests yet."
                  : `No ${filterStatus} requests found.`
                }
              </p>
              {filterStatus !== 'all' && (
                <Button onClick={() => setFilterStatus('all')} variant="outline">
                  Show All Requests
                </Button>
              )}
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{request.projectName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                      <span className={`text-sm font-semibold ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>

                    {/* Request Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">Request #:</span>
                        <span className="ml-2 font-semibold">{request.requestNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-medium">{request.projectType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Submitted:</span>
                        <span className="ml-2">{formatDate(request.createdAt)}</span>
                      </div>
                      {request.budget && (
                        <div>
                          <span className="text-gray-600">Budget:</span>
                          <span className="ml-2 font-semibold text-green-600">
                            ${request.budget.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-gray-700">{request.description}</p>
                    </div>

                    {/* Approved Message */}
                    {request.status === 'approved' && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r mb-4">
                        <div className="flex items-start gap-2">
                          <span className="text-green-600 text-lg">🎉</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-green-800">Request Approved!</p>
                            <p className="text-sm text-green-700 mt-1">
                              Your project has been approved and created. Check your email for login credentials to access your project dashboard.
                            </p>
                            {request.reviewNotes && (
                              <p className="text-sm text-green-600 mt-2 italic">Note: {request.reviewNotes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rejected Message */}
                    {request.status === 'rejected' && request.rejectionReason && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r mb-4">
                        <div className="flex items-start gap-2">
                          <span className="text-red-600 text-lg">ℹ️</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800">Request Declined</p>
                            <p className="text-sm text-red-700 mt-1">{request.rejectionReason}</p>
                            <p className="text-sm text-red-600 mt-2">
                              You can edit and resubmit this request with the necessary changes.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pending Message */}
                    {request.status === 'pending' && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r mb-4">
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-600 text-lg">⏳</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-yellow-800">Under Review</p>
                            <p className="text-sm text-yellow-700 mt-1">
                              Your request is being reviewed by our team. We'll notify you once a decision is made.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    {request.status === 'pending' && (
                      <Button
                        onClick={() => handleEditClick(request)}
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        ✏️ Edit
                      </Button>
                    )}
                    {request.status === 'rejected' && (
                      <Button
                        onClick={() => handleEditClick(request)}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        📝 Resubmit
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedRequest.status === 'rejected' ? 'Resubmit Request' : 'Edit Request'}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setError('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={editFormData.projectName}
                    onChange={(e) => setEditFormData({ ...editFormData, projectName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                  <select
                    value={editFormData.projectType}
                    onChange={(e) => setEditFormData({ ...editFormData, projectType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Website">Website</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Web Application">Web Application</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="AI/ML Solution">AI/ML Solution</option>
                    <option value="Custom Software">Custom Software</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements *</label>
                  <textarea
                    value={editFormData.requirements}
                    onChange={(e) => setEditFormData({ ...editFormData, requirements: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="number"
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                    placeholder="Enter amount in USD"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mt-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleUpdateRequest}
                  disabled={updating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {updating ? 'Updating...' : selectedRequest.status === 'rejected' ? 'Resubmit Request' : 'Update Request'}
                </Button>
                <Button
                  onClick={() => {
                    setShowEditModal(false)
                    setError('')
                  }}
                  variant="outline"
                  disabled={updating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
