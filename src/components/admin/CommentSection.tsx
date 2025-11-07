'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface Comment {
  id: string
  content: string
  authorName: string
  authorRole: 'ADMIN' | 'CLIENT'
  createdAt: Date
  replies?: Comment[]
}

interface CommentSectionProps {
  projectId: string
  comments: Comment[]
  onCommentAdded: () => void
}

export default function CommentSection({ projectId, comments, onCommentAdded }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to post comment')
      }

      setNewComment('')
      onCommentAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: replyContent,
          parentId 
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to post reply')
      }

      setReplyContent('')
      setReplyingTo(null)
      onCommentAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply')
    } finally {
      setSubmitting(false)
    }
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 30) return `${diffDays}d ago`
    return new Date(date).toLocaleDateString()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={isReply ? 'ml-12' : ''}>
      <div className="bg-white rounded-xl shadow p-4 border border-slate-200">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white ${
            comment.authorRole === 'ADMIN' 
              ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
              : 'bg-gradient-to-br from-blue-500 to-cyan-600'
          }`}>
            {getInitials(comment.authorName)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Author & Role */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{comment.authorName}</span>
              {comment.authorRole === 'ADMIN' && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                  Admin
                </span>
              )}
              <span className="text-xs text-gray-500">{getRelativeTime(comment.createdAt)}</span>
            </div>

            {/* Content */}
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>

            {/* Reply Button */}
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="ml-12 mt-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Write your reply..."
          />
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => handleSubmitReply(comment.id)}
              disabled={submitting || !replyContent.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
            >
              {submitting ? 'Posting...' : 'Post Reply'}
            </Button>
            <Button
              onClick={() => {
                setReplyingTo(null)
                setReplyContent('')
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Add Comment</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Share updates, ask questions, or provide feedback..."
        />
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSubmitComment}
            disabled={submitting || !newComment.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Comments ({comments.length})</h3>
        {comments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-200">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500">No comments yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => renderComment(comment))}
          </div>
        )}
      </div>
    </div>
  )
}
