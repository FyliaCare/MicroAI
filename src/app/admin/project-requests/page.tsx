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
      const response = await fetch('/api/admin/project-requests')
      const data = await response.json()
      
      if (data.success) {
        setRequests(data.requests)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to load project requests')
      console.error(err)
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
          adminId: session?.user?.id,
          adminName: session?.user?.name,
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
          adminId: session?.user?.id,
          adminName: session?.user?.name,
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{rejectedCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{requests.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
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
            Rejected ({rejectedCount})
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
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No {filterStatus !== 'all' && filterStatus} requests found.</p>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header Row */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{request.projectName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                      {request.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">#{request.requestNumber}</span>
                  </div>

                  {/* Client Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Client:</span>
                      <span className="font-semibold ml-2">{request.clientName}</span>
                      {request.clientCompany && (
                        <span className="text-gray-500"> ({request.clientCompany})</span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-600">Contact:</span>
                      <span className="ml-2">{request.clientEmail}</span>
                      {request.clientPhone && <span className="text-gray-500"> • {request.clientPhone}</span>}
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium">{request.projectType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <span className="ml-2">{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-700">{request.description}</p>
                  </div>

                  {/* Additional Details */}
                  {(request.budget || request.deadline) && (
                    <div className="flex gap-6 text-sm mb-4">
                      {request.budget && (
                        <div>
                          <span className="text-gray-600">Budget:</span>
                          <span className="ml-2 font-semibold text-green-600">
                            ${request.budget.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {request.deadline && (
                        <div>
                          <span className="text-gray-600">Deadline:</span>
                          <span className="ml-2">{new Date(request.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {request.status === 'rejected' && request.rejectionReason && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r mt-4">
                      <p className="text-sm font-semibold text-red-800">Rejection Reason:</p>
                      <p className="text-sm text-red-700 mt-1">{request.rejectionReason}</p>
                    </div>
                  )}

                  {/* Review Notes */}
                  {request.reviewNotes && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r mt-4">
                      <p className="text-sm font-semibold text-blue-800">Admin Notes:</p>
                      <p className="text-sm text-blue-700 mt-1">{request.reviewNotes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowApproveModal(true)
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      ✅ Approve
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowRejectModal(true)
                      }}
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                    >
                      ❌ Decline
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Approve Project Request
              </h2>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r mb-6">
                <p className="text-sm font-semibold text-green-800">What happens next:</p>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>✅ Client account will be created with portal access</li>
                  <li>✅ Project will be set up in the system</li>
                  <li>✅ Welcome email with login credentials will be sent to: <strong>{selectedRequest.clientEmail}</strong></li>
                  <li>✅ Client will have 30 days to verify their account</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project: <strong>{selectedRequest.projectName}</strong>
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client: <strong>{selectedRequest.clientName}</strong>
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {processing ? 'Processing...' : '✅ Approve & Send Welcome Email'}
                </Button>
                <Button
                  onClick={() => {
                    setShowApproveModal(false)
                    setApproveNotes('')
                    setError('')
                  }}
                  variant="outline"
                  disabled={processing}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Decline Project Request
              </h2>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-6">
                <p className="text-sm text-red-700">
                  A polite rejection email will be sent to <strong>{selectedRequest.clientEmail}</strong> with the reason you provide.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason * (will be sent to client)
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                  required
                >
                  <option value="">Select a reason...</option>
                  <option value="The project scope is outside our current service offerings.">Outside our service offerings</option>
                  <option value="We are currently at full capacity and cannot take on new projects at this time.">At full capacity</option>
                  <option value="The project timeline doesn't align with our current availability.">Timeline doesn't align</option>
                  <option value="The budget range is not sufficient for the project requirements.">Budget constraints</option>
                  <option value="We don't have expertise in the specific technology or industry required.">Lack of expertise in required area</option>
                  <option value="The project requirements need more clarification before we can proceed.">Requirements need clarification</option>
                </select>

                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Or enter a custom reason..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internal Notes (Optional - not sent to client)
                </label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Add internal notes about this rejection..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleReject}
                  disabled={processing || !rejectReason}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {processing ? 'Processing...' : 'Send Rejection Email'}
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
