'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'

interface ProjectRequest {
  id: string
  requestNumber: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientCompany?: string
  projectName: string
  projectType: string
  description: string
  industry?: string
  budget?: number
  budgetRange?: string
  timeline?: string
  priority: string
  status: string
  requirements: any
  features: string[]
  techPreferences: string[]
  chatTranscript?: string
  source: string
  createdAt: string
  reviewedAt?: string
  reviewNotes?: string
  rejectionReason?: string
}

export default function ProjectRequestsManager() {
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [approveNotes, setApproveNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [rejectNotes, setRejectNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [statusFilter])

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/project-request?status=${statusFilter}`)
      const data = await res.json()
      if (data.success) {
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedRequest) return

    setProcessing(true)
    try {
      const res = await fetch(`/api/admin/project-requests/${selectedRequest.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'admin-id', // TODO: Get from session
          adminName: 'Admin', // TODO: Get from session
          notes: approveNotes,
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert(`✅ Project approved! Client account created and welcome email sent.`)
        setShowApproveModal(false)
        setShowDetailsModal(false)
        setApproveNotes('')
        fetchRequests()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Failed to approve request')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    setProcessing(true)
    try {
      const res = await fetch(`/api/admin/project-requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'admin-id', // TODO: Get from session
          adminName: 'Admin', // TODO: Get from session
          reason: rejectReason,
          notes: rejectNotes,
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert('❌ Request rejected and client has been notified')
        setShowRejectModal(false)
        setShowDetailsModal(false)
        setRejectReason('')
        setRejectNotes('')
        fetchRequests()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to reject request')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'converted':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'normal':
        return 'text-blue-600'
      case 'low':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Project Requests
        </h1>
        <p className="text-gray-600 mt-1">Review and approve client project submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-yellow-600">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-green-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Found</h3>
          <p className="text-gray-600">
            {statusFilter === 'all'
              ? 'No project requests have been submitted yet'
              : `No ${statusFilter} requests`}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{request.projectName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className={`text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                      {request.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {request.requestNumber} • {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-semibold text-gray-900">{request.clientName}</p>
                  {request.clientCompany && <p className="text-sm text-gray-600">{request.clientCompany}</p>}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-gray-900">{request.clientEmail}</p>
                  {request.clientPhone && <p className="text-sm text-gray-600">{request.clientPhone}</p>}
                </div>
              </div>

              {/* Project Details */}
              <div className="mb-4">
                <p className="text-gray-700 line-clamp-2">{request.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600">Type</p>
                  <p className="font-semibold text-sm">{request.projectType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Budget</p>
                  <p className="font-semibold text-sm">{request.budgetRange || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Timeline</p>
                  <p className="font-semibold text-sm">{request.timeline || 'Flexible'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Source</p>
                  <p className="font-semibold text-sm">{request.source}</p>
                </div>
              </div>

              {/* Tags */}
              {request.features && request.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Requested Features</p>
                  <div className="flex flex-wrap gap-2">
                    {request.features.slice(0, 5).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {request.features.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{request.features.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setSelectedRequest(request)
                    setShowDetailsModal(true)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  📋 View Details
                </Button>
                {request.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowApproveModal(true)
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      ✅ Approve
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowRejectModal(true)
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      ❌ Reject
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Project Request Details"
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Request Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Request Number</p>
                  <p className="font-semibold">{selectedRequest.requestNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="font-semibold">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Client Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div><strong>Name:</strong> {selectedRequest.clientName}</div>
                <div><strong>Email:</strong> {selectedRequest.clientEmail}</div>
                {selectedRequest.clientPhone && <div><strong>Phone:</strong> {selectedRequest.clientPhone}</div>}
                {selectedRequest.clientCompany && <div><strong>Company:</strong> {selectedRequest.clientCompany}</div>}
                {selectedRequest.industry && <div><strong>Industry:</strong> {selectedRequest.industry}</div>}
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Project Details</h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-sm text-gray-600">Project Name:</strong>
                  <p className="text-lg font-semibold">{selectedRequest.projectName}</p>
                </div>
                <div>
                  <strong className="text-sm text-gray-600">Description:</strong>
                  <p className="mt-1">{selectedRequest.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-sm text-gray-600">Type:</strong>
                    <p>{selectedRequest.projectType}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-gray-600">Priority:</strong>
                    <p className={getPriorityColor(selectedRequest.priority)}>{selectedRequest.priority}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {selectedRequest.requirements && Object.keys(selectedRequest.requirements).length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(selectedRequest.requirements, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Chat Transcript */}
            {selectedRequest.chatTranscript && (
              <div>
                <h3 className="font-semibold text-lg mb-3">AI Conversation</h3>
                <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{selectedRequest.chatTranscript}</pre>
                </div>
              </div>
            )}

            {/* Review Notes (if rejected/approved) */}
            {selectedRequest.reviewNotes && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-semibold mb-2">Review Notes</h3>
                <p>{selectedRequest.reviewNotes}</p>
              </div>
            )}

            {selectedRequest.rejectionReason && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <h3 className="font-semibold mb-2">Rejection Reason</h3>
                <p>{selectedRequest.rejectionReason}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => !processing && setShowApproveModal(false)}
        title="Approve Project Request"
      >
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <h3 className="font-semibold mb-2">⚠️ This will:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Create a new User account for the client</li>
              <li>Create a new Client record</li>
              <li>Create a new Project</li>
              <li>Send welcome email with login credentials</li>
              <li>Set 30-day account verification deadline</li>
            </ul>
          </div>

          <Textarea
            label="Admin Notes (Optional)"
            value={approveNotes}
            onChange={(e) => setApproveNotes(e.target.value)}
            rows={4}
            placeholder="Internal notes about this approval..."
          />

          <div className="flex gap-3">
            <Button
              onClick={handleApprove}
              disabled={processing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {processing ? 'Processing...' : '✅ Approve & Create Account'}
            </Button>
            <Button
              onClick={() => setShowApproveModal(false)}
              disabled={processing}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => !processing && setShowRejectModal(false)}
        title="Reject Project Request"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm">
              <strong>⚠️ Important:</strong> The client will be notified via email with the rejection reason you provide below.
            </p>
          </div>

          <Textarea
            label="Rejection Reason (Required) *"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            placeholder="Explain why this request is being rejected (this will be sent to the client)..."
            required
          />

          <Textarea
            label="Internal Notes (Optional)"
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            rows={3}
            placeholder="Private notes (not sent to client)..."
          />

          <div className="flex gap-3">
            <Button
              onClick={handleReject}
              disabled={processing || !rejectReason.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {processing ? 'Processing...' : '❌ Reject Request'}
            </Button>
            <Button
              onClick={() => setShowRejectModal(false)}
              disabled={processing}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
