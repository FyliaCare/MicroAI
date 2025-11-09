'use client'

import { useState, useEffect } from 'react'
import { useComments, Comment } from '@/hooks/useCommentsNew'
import { Send, Trash2, RefreshCw, Loader2 } from 'lucide-react'

interface Props {
  projectId: string
}

export default function ClientCommentSection({ projectId }: Props) {
  const [token, setToken] = useState<string | null>(null)
  const [tokenLoaded, setTokenLoaded] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('clientToken')
    console.log('🔑 Client token loaded:', !!storedToken)
    setToken(storedToken)
    setTokenLoaded(true)
  }, [])

  const {
    comments,
    isLoading,
    isError,
    error,
    addComment,
    deleteComment,
    mutate,
  } = useComments(projectId, token || undefined, false) // isAdmin = false

  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    setLocalError(null)
    
    try {
      await addComment(newComment)
      setNewComment('')
      console.log('✅ Comment posted successfully')
    } catch (err) {
      console.error('❌ Error posting comment:', err)
      setLocalError(err instanceof Error ? err.message : 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return
    
    setLocalError(null)
    
    try {
      await deleteComment(commentId)
      console.log('✅ Comment deleted successfully')
    } catch (err) {
      console.error('❌ Error deleting comment:', err)
      setLocalError(err instanceof Error ? err.message : 'Failed to delete comment')
    }
  }

  const renderComment = (comment: Comment) => (
    <div
      key={comment.id}
      className={`bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow ${
        comment.authorRole === 'ADMIN' 
          ? 'border-blue-200 bg-blue-50/30' 
          : 'border-purple-200 bg-purple-50/30'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
              comment.authorRole === 'ADMIN'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-purple-500 to-purple-600'
            }`}
          >
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{comment.authorName}</h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  comment.authorRole === 'ADMIN'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {comment.authorRole === 'ADMIN' ? 'Admin' : 'You'}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {comment.authorRole === 'CLIENT' && (
          <button
            onClick={() => handleDelete(comment.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
    </div>
  )

  if (!tokenLoaded) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <p className="text-red-600">Authentication token not found. Please log in again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
        <button
          onClick={() => mutate()}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          title="Refresh Comments"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add a comment
        </label>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          disabled={submitting}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Post Comment
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Messages */}
      {(localError || (isError && error)) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">
            {localError || error?.message || 'An error occurred'}
          </p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading comments...</p>
        </div>
      ) : !comments || comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No comments yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700">{comments.length} comment(s)</p>
          {comments.map(renderComment)}
        </div>
      )}
    </div>
  )
}
