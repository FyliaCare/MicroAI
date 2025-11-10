'use client'

import { useState, useCallback, useEffect } from 'react'
import { 
  MessageSquare, Send, Reply, Trash2, Edit2, Check, X, 
  Loader2, RefreshCw, AlertCircle, User 
} from 'lucide-react'

interface Comment {
  id: string
  content: string
  authorName: string
  authorRole: string
  createdAt: string
  updatedAt: string
  parentId?: string | null
  replies?: Comment[]
}

interface AdvancedCommentsProps {
  projectId: string
  isAdmin: boolean
}

export default function AdvancedComments({ projectId, isAdmin }: AdvancedCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      const endpoint = isAdmin
        ? `/api/admin/projects/${projectId}/comments`
        : `/api/client/projects/${projectId}/comments`

      const headers: HeadersInit = {}
      if (!isAdmin) {
        const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
        headers['Authorization'] = `Bearer ${session.token}`
      }

      const res = await fetch(endpoint, {
        headers,
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        // Organize comments into threads
        const organized = organizeComments(data.comments || [])
        setComments(organized)
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    } finally {
      setLoading(false)
    }
  }, [projectId, isAdmin])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Organize comments into parent-child structure
  const organizeComments = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>()
    const rootComments: Comment[] = []

    // First pass: create map
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: organize hierarchy
    flatComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!
      if (comment.parentId && commentMap.has(comment.parentId)) {
        const parent = commentMap.get(comment.parentId)!
        if (!parent.replies) parent.replies = []
        parent.replies.push(commentWithReplies)
      } else {
        rootComments.push(commentWithReplies)
      }
    })

    // Sort by date (newest first)
    rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    rootComments.forEach(comment => {
      if (comment.replies) {
        comment.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }
    })

    return rootComments
  }

  // Submit new comment
  const submitComment = async () => {
    if (!newComment.trim()) return

    try {
      setSubmitting(true)
      setError(null)
      const endpoint = isAdmin
        ? `/api/admin/projects/${projectId}/comments`
        : `/api/client/projects/${projectId}/comments`

      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (!isAdmin) {
        const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
        headers['Authorization'] = `Bearer ${session.token}`
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: newComment }),
        credentials: 'include'
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to post comment')
      }

      setNewComment('')
      await fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  // Submit reply
  const submitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    try {
      setSubmitting(true)
      setError(null)
      const endpoint = isAdmin
        ? `/api/admin/projects/${projectId}/comments`
        : `/api/client/projects/${projectId}/comments`

      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (!isAdmin) {
        const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
        headers['Authorization'] = `Bearer ${session.token}`
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          content: replyContent,
          parentId 
        }),
        credentials: 'include'
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to post reply')
      }

      setReplyContent('')
      setReplyingTo(null)
      await fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post reply')
    } finally {
      setSubmitting(false)
    }
  }

  // Update comment
  const updateComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      setSubmitting(true)
      setError(null)
      const endpoint = isAdmin
        ? `/api/admin/projects/${projectId}/comments`
        : `/api/client/projects/${projectId}/comments`

      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (!isAdmin) {
        const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
        headers['Authorization'] = `Bearer ${session.token}`
      }

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ 
          commentId,
          content: editContent 
        }),
        credentials: 'include'
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update comment')
      }

      setEditingId(null)
      setEditContent('')
      await fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete comment
  const deleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment? This action cannot be undone.')) return

    try {
      const endpoint = isAdmin
        ? `/api/admin/projects/${projectId}/comments?commentId=${commentId}`
        : `/api/client/projects/${projectId}/comments?commentId=${commentId}`

      const headers: HeadersInit = {}
      if (!isAdmin) {
        const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
        headers['Authorization'] = `Bearer ${session.token}`
      }

      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Failed to delete comment')

      await fetchComments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
    }
  }

  // Render single comment
  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const isEditing = editingId === comment.id
    const isReplying = replyingTo === comment.id
    const isOwnComment = isAdmin 
      ? comment.authorRole === 'ADMIN' || comment.authorRole === 'Admin'
      : comment.authorRole === 'CLIENT' || comment.authorRole === 'Client'

    return (
      <div key={comment.id} className={`${isReply ? 'ml-12' : ''}`}>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
                comment.authorRole === 'ADMIN' || comment.authorRole === 'Admin'
                  ? 'bg-blue-600'
                  : 'bg-purple-600'
              }`}>
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{comment.authorName}</p>
                <p className="text-xs text-gray-600">
                  {new Date(comment.createdAt).toLocaleString()}
                  {comment.createdAt !== comment.updatedAt && ' (edited)'}
                </p>
              </div>
            </div>

            {/* Actions */}
            {isOwnComment && !isEditing && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingId(comment.id)
                    setEditContent(comment.content)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={submitting}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateComment(comment.id)}
                  disabled={submitting || !editContent.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null)
                    setEditContent('')
                  }}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
              
              {/* Reply Button */}
              {!isReply && (
                <button
                  onClick={() => {
                    setReplyingTo(comment.id)
                    setReplyContent('')
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
              )}
            </>
          )}
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="ml-12 mt-3 bg-gray-50 rounded-xl border border-gray-200 p-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={submitting}
            />
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => submitReply(comment.id)}
                disabled={submitting || !replyContent.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Reply
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null)
                  setReplyContent('')
                }}
                disabled={submitting}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Add Comment
        </h4>
        
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          disabled={submitting}
        />
        
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            {newComment.length}/2000 characters
          </p>
          <button
            onClick={submitComment}
            disabled={submitting || !newComment.trim()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Post Comment
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-5 h-5 text-red-600" />
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">
            Discussion ({comments.length})
          </h4>
          <button
            onClick={fetchComments}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No comments yet</p>
            <p className="text-sm text-gray-500 mt-1">Start the conversation</p>
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
