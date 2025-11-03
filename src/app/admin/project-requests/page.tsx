'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface ProjectRequest {
  id: string
  requestNumber: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  clientCompany: string | null
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
  reviewedBy: string | null
  reviewedAt: string | null
  reviewNotes: string | null
  rejectionReason: string | null
  createdAt: string
}

export default function ProjectRequestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [approveNotes, setApproveNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [rejectNotes, setRejectNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchRequests()
    }
  }, [status, router])

  const fetchRequests = async () => {
    try {
      console.log('Fetching project requests...')
      const response = await fetch('/api/admin/project-requests')
      const data = await response.json()
      
      console.log('API Response:', data)
      console.log('Requests count:', data.requests?.length)
      
      if (data.success) {
        setRequests(data.requests || [])
        console.log('Set requests:', data.requests)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to load project requests')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedRequest) return
    
    setProcessing(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/project-requests/${selectedRequest.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: approveNotes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setShowApproveModal(false)
        setApproveNotes('')
        setSelectedRequest(null)
        fetchRequests()
        alert(`✅ Project approved! Welcome email sent to ${selectedRequest.clientEmail}`)
      } else {
        setError(data.error || 'Failed to approve request')
      }
    } catch (err) {
      setError('Failed to approve request')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason) {
      setError('Please provide a rejection reason')
      return
    }
    
    setProcessing(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/project-requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: rejectReason,
          notes: rejectNotes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setShowRejectModal(false)
        setRejectReason('')
        setRejectNotes('')
        setSelectedRequest(null)
        fetchRequests()
        alert(`Project request declined. Notification sent to ${selectedRequest.clientEmail}`)
      } else {
        setError(data.error || 'Failed to reject request')
      }
    } catch (err) {
      setError('Failed to reject request')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const filteredRequests = requests.filter(req => 
    filterStatus === 'all' || req.status === filterStatus
  )

  const pendingCount = requests.filter(r => r.status === 'pending').length
  const approvedCount = requests.filter(r => r.status === 'approved').length
  const rejectedCount = requests.filter(r => r.status === 'rejected').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Requests</h1>
          <p className="text-gray-600 mt-1">Review and approve client project submissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-5 md:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-yellow-700 font-medium">Pending Review</p>
              <p className="text-2xl md:text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
              <p className="text-xs text-yellow-600 mt-1">Awaiting action</p>
            </div>
            <div className="bg-yellow-500 bg-opacity-20 p-3 md:p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl md:text-3xl">⏳</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 md:p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-green-700 font-medium">Approved</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">{approvedCount}</p>
              <p className="text-xs text-green-600 mt-1">Successfully processed</p>
            </div>
            <div className="bg-green-500 bg-opacity-20 p-3 md:p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl md:text-3xl">✅</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 md:p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-red-700 font-medium">Rejected</p>
              <p className="text-2xl md:text-3xl font-bold text-red-600 mt-2">{rejectedCount}</p>
              <p className="text-xs text-red-600 mt-1">Not suitable</p>
            </div>
            <div className="bg-red-500 bg-opacity-20 p-3 md:p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl md:text-3xl">❌</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 md:p-6 bg-gradient-to-br from-blue-50 to-purple-100 border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-blue-700 font-medium">Total Requests</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-2">{requests.length}</p>
              <p className="text-xs text-blue-600 mt-1">All submissions</p>
            </div>
            <div className="bg-blue-500 bg-opacity-20 p-3 md:p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl md:text-3xl">📋</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 md:p-5 shadow-lg">
        <div className="flex flex-wrap gap-3 md:gap-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
              filterStatus === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>📊</span>
              <span>All ({requests.length})</span>
            </span>
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
              filterStatus === 'pending'
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>⏳</span>
              <span>Pending ({pendingCount})</span>
            </span>
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
              filterStatus === 'approved'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>✅</span>
              <span>Approved ({approvedCount})</span>
            </span>
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
              filterStatus === 'rejected'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>❌</span>
              <span>Rejected ({rejectedCount})</span>
            </span>
          </button>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4 md:space-y-6">
        {filteredRequests.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">No {filterStatus !== 'all' && filterStatus} requests found.</p>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="p-5 md:p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-transparent hover:border-l-blue-500 bg-gradient-to-br from-white to-gray-50">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1 w-full">
                  {/* Header Row */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 break-words">{request.projectName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColor(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getPriorityColor(request.priority)}`}>
                      {request.priority.toUpperCase()}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">#{request.requestNumber}</span>
                  </div>

                  {/* Client Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium min-w-[60px]">👤 Client:</span>
                      <div className="flex-1">
                        <span className="font-semibold">{request.clientName}</span>
                        {request.clientCompany && (
                          <span className="text-gray-500 block md:inline"> ({request.clientCompany})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium min-w-[70px]">📧 Contact:</span>
                      <div className="flex-1 break-all">
                        <span>{request.clientEmail}</span>
                        {request.clientPhone && <span className="text-gray-500"> • {request.clientPhone}</span>}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium min-w-[60px]">📋 Type:</span>
                      <span className="font-medium bg-blue-50 px-2 py-1 rounded text-blue-700">{request.projectType}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium min-w-[80px]">📅 Submitted:</span>
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">{request.description}</p>
                  </div>

                  {/* Additional Details */}
                  {(request.budget || request.deadline) && (
                    <div className="flex flex-wrap gap-4 md:gap-6 text-sm mb-4">
                      {request.budget && (
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                          <span className="text-gray-600 font-medium">💰 Budget:</span>
                          <span className="font-bold text-green-600">
                            ${request.budget.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {request.deadline && (
                        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                          <span className="text-gray-600 font-medium">⏰ Deadline:</span>
                          <span className="font-semibold text-yellow-700">{new Date(request.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {request.status === 'rejected' && request.rejectionReason && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 rounded-r-lg mt-4 shadow-sm">
                      <p className="text-sm font-bold text-red-800 flex items-center gap-2">
                        <span>❌</span>
                        <span>Rejection Reason:</span>
                      </p>
                      <p className="text-sm text-red-700 mt-2 leading-relaxed">{request.rejectionReason}</p>
                    </div>
                  )}

                  {/* Review Notes */}
                  {request.reviewNotes && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded-r-lg mt-4 shadow-sm">
                      <p className="text-sm font-bold text-blue-800 flex items-center gap-2">
                        <span>📝</span>
                        <span>Admin Notes:</span>
                      </p>
                      <p className="text-sm text-blue-700 mt-2 leading-relaxed">{request.reviewNotes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto">
                    <Button
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowApproveModal(true)
                      }}
                      className="flex-1 lg:flex-none bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>✅</span>
                        <span>Approve</span>
                      </span>
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowRejectModal(true)
                      }}
                      variant="outline"
                      className="flex-1 lg:flex-none border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>❌</span>
                        <span>Decline</span>
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-green-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
              <h2 className="text-2xl md:text-3xl font-bold relative z-10 flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <span>Approve Project Request</span>
              </h2>
              <p className="text-green-100 text-sm mt-2 relative z-10">Activate client portal access</p>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-5 rounded-xl mb-6 shadow-sm">
                <p className="text-sm font-bold text-green-800 flex items-center gap-2 mb-3">
                  <span>🎯</span>
                  <span>What happens next:</span>
                </p>
                <ul className="text-sm text-green-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>Client account will be created with portal access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>Project will be set up in the system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>Welcome email with login credentials will be sent to: <strong className="bg-white px-2 py-0.5 rounded">{selectedRequest.clientEmail}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>Client will have 30 days to verify their account</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    📋 PROJECT
                  </label>
                  <p className="font-bold text-gray-900">{selectedRequest.projectName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    👤 CLIENT
                  </label>
                  <p className="font-bold text-gray-900">{selectedRequest.clientName}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex text-sm font-bold text-gray-700 mb-3 items-center gap-2">
                  <span>📝</span>
                  <span>Admin Notes (Optional)</span>
                </label>
                <textarea
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none"
                />
              </div>

              {error && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 p-4 rounded-xl mb-4 shadow-sm animate-fade-in">
                  <p className="text-red-800 font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>✅</span>
                      <span>Approve & Send Welcome Email</span>
                    </span>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowApproveModal(false)
                    setApproveNotes('')
                    setError('')
                  }}
                  variant="outline"
                  disabled={processing}
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-red-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
              <h2 className="text-2xl md:text-3xl font-bold relative z-10 flex items-center gap-3">
                <span className="text-3xl">❌</span>
                <span>Decline Project Request</span>
              </h2>
              <p className="text-red-100 text-sm mt-2 relative z-10">Send polite rejection with reason</p>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-5 rounded-xl mb-6 shadow-sm">
                <p className="text-sm text-red-700 flex items-start gap-2">
                  <span className="mt-0.5">📧</span>
                  <span>
                    A polite rejection email will be sent to <strong className="bg-white px-2 py-0.5 rounded">{selectedRequest.clientEmail}</strong> with the reason you provide.
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <label className="flex text-sm font-bold text-gray-700 mb-3 items-center gap-2">
                  <span>💬</span>
                  <span>Rejection Reason * (will be sent to client)</span>
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 mb-4 font-medium"
                  required
                >
                  <option value="">Select a reason...</option>
                  <option value="The project scope is outside our current service offerings.">🚫 Outside our service offerings</option>
                  <option value="We are currently at full capacity and cannot take on new projects at this time.">📊 At full capacity</option>
                  <option value="The project timeline doesn't align with our current availability.">⏰ Timeline doesn't align</option>
                  <option value="The budget range is not sufficient for the project requirements.">💰 Budget constraints</option>
                  <option value="We don't have expertise in the specific technology or industry required.">🔧 Lack of expertise in required area</option>
                  <option value="The project requirements need more clarification before we can proceed.">❓ Requirements need clarification</option>
                </select>

                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Or enter a custom reason..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 resize-none"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="flex text-sm font-bold text-gray-700 mb-3 items-center gap-2">
                  <span>📝</span>
                  <span>Internal Notes (Optional - not sent to client)</span>
                </label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Add internal notes about this rejection..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 resize-none bg-gray-50"
                />
              </div>

              {error && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 p-4 rounded-xl mb-4 shadow-sm animate-fade-in">
                  <p className="text-red-800 font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleReject}
                  disabled={processing || !rejectReason}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>📧</span>
                      <span>Send Rejection Email</span>
                    </span>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectReason('')
                    setRejectNotes('')
                    setError('')
                  }}
                  variant="outline"
                  disabled={processing}
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
