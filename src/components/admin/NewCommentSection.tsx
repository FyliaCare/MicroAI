'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: string
  content: string
  createdAt: string
  authorName: string
  authorRole: 'ADMIN' | 'CLIENT'
  parentId?: string | null
  replies?: Comment[]
}

interface Props {
  projectId: string
}

export default function NewCommentSection({ projectId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')

  // Load comments on mount
  useEffect(() => {
    loadComments()
  }, [projectId])

  const loadComments = async () => {
    try {
      console.log('🔄 Loading comments for project:', projectId)
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/projects/${projectId}/comments`)
      
      if (!response.ok) {
        throw new Error(`Failed to load comments: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Comments loaded:', data.comments?.length || 0)
      
      setComments(data.comments || [])
    } catch (err) {
      console.error('❌ Error loading comments:', err)
      setError(err instanceof Error ? err.message : 'Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      console.log('📤 Posting comment...')
      
      const response = await fetch(`/api/admin/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        throw new Error('Failed to post comment')
      }

      console.log('✅ Comment posted')
      
      // Clear input and reload comments
      setNewComment('')
      await loadComments()
    } catch (err) {
      console.error('❌ Post error:', err)
      setError(err instanceof Error ? err.message : 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/comments?commentId=${commentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      console.log('✅ Comment deleted')
      
      // Reload comments
      await loadComments()
    } catch (err) {
      console.error('❌ Delete error:', err)
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add a comment
        </label>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={submitting}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No comments yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700">{comments.length} comment(s)</p>
          
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-white border rounded-xl p-5 ${
                comment.authorRole === 'ADMIN' ? 'border-blue-200 bg-blue-50/30' : 'border-purple-200 bg-purple-50/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    comment.authorRole === 'ADMIN' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{comment.authorName}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        comment.authorRole === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {comment.authorRole === 'ADMIN' ? 'Admin' : 'Client'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {comment.authorRole === 'ADMIN' && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={loadComments}
        disabled={loading}
        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
      >
        {loading ? 'Refreshing...' : '🔄 Refresh Comments'}
      </button>
    </div>
  )
}
