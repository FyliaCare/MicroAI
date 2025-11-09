'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'

interface Comment {
  id: string
  content: string
  authorName: string
  authorRole: 'CLIENT' | 'ADMIN'
  createdAt: string
  updatedAt?: string
  replies: Array<{
    id: string
    content: string
    authorName: string
    authorRole: 'CLIENT' | 'ADMIN'
    createdAt: string
  }>
}

interface CommentSectionProps {
  projectId: string
  comments: Comment[]
  onCommentSuccess: () => void
}

export default function CommentSection({
  projectId,
  comments,
  onCommentSuccess,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.token

      if (!token) {
        throw new Error('No session token found')
      }

      const response = await fetch(`/api/client/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
          parentId: null,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to post comment')
      }

      // Success
      setNewComment('')
      onCommentSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.token

      if (!token) {
        throw new Error('No session token found')
      }

      const response = await fetch(`/api/client/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: replyText,
          parentId: parentId,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to post reply')
      }

      // Success
      setReplyText('')
      setReplyTo(null)
      onCommentSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to post reply')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a Comment
          </label>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your feedback, questions, or suggestions..."
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-900">Comments ({comments.length})</h4>
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-5 space-y-4">
              {/* Main Comment */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    comment.authorRole === 'ADMIN'
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                  }`}>
                    {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {comment.authorName}
                    </span>
                    {comment.authorRole === 'ADMIN' && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                        Admin
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  
                  {/* Reply Button */}
                  <button
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reply
                  </button>
                </div>
              </div>

              {/* Reply Form */}
              {replyTo === comment.id && (
                <div className="ml-14 space-y-3">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    rows={3}
                    disabled={isSubmitting}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={isSubmitting || !replyText.trim()}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {isSubmitting ? 'Replying...' : 'Reply'}
                    </Button>
                    <Button
                      onClick={() => {
                        setReplyTo(null)
                        setReplyText('')
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-14 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                          reply.authorRole === 'ADMIN'
                            ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                            : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        }`}>
                          {reply.authorName ? reply.authorName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            {reply.authorName}
                          </span>
                          {reply.authorRole === 'ADMIN' && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                              Admin
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}
