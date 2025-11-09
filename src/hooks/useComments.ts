import useSWR, { SWRConfiguration, KeyedMutator } from 'swr'

// --- Generic Fetcher ---
// This function will be used by SWR to fetch data.
// It handles authentication via Bearer token.
export const fetcher = async (url: string, token?: string) => {
  console.log(`🔄 Fetching comments from: ${url}`, { hasToken: !!token })
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    headers,
    credentials: 'include', // Include cookies for session-based auth (admin)
  })

  console.log(`📡 Response status: ${res.status}`)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
    console.error('❌ Fetch error:', errorData)
    const error = new Error(errorData.error || 'An error occurred while fetching the data.')
    throw error
  }

  const data = await res.json()
  console.log('✅ Comments fetched successfully:', data.comments?.length || 0)
  return data.comments || []
}


// --- Comment Type ---
export interface Comment {
  id: string
  content: string
  createdAt: string
  authorName: string
  authorRole: 'ADMIN' | 'CLIENT'
  parentId?: string | null
  replies?: Comment[]
}


// --- useComments Hook ---
interface UseCommentsResponse {
  comments?: Comment[]
  isLoading: boolean
  isError: boolean
  error: any
  mutate: KeyedMutator<Comment[]>
  addComment: (content: string) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
}

/**
 * A custom hook to manage project comments using SWR.
 * @param projectId - The ID of the project.
 * @param token - The authentication token (required for client-side).
 * @param isAdmin - Flag to determine which API endpoint to use.
 * @param options - SWR configuration options.
 */
export function useComments(
  projectId: string,
  token?: string,
  isAdmin: boolean = false,
  options?: SWRConfiguration
): UseCommentsResponse {
  const apiUrl = isAdmin
    ? `/api/admin/projects/${projectId}/comments`
    : `/api/client/projects/${projectId}/comments`

  // For client-side, don't fetch until we have a token
  // For admin-side, fetch as long as we have a projectId
  const shouldFetch = projectId && (isAdmin || token)

  console.log('🎯 useComments hook initialized:', { 
    projectId, 
    isAdmin, 
    hasToken: !!token, 
    shouldFetch,
    apiUrl 
  })

  const { data, error, isLoading, mutate } = useSWR<Comment[]>(
    shouldFetch ? [apiUrl, token] : null,
    ([url, token]) => fetcher(url, token as string | undefined),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 2000,
      dedupingInterval: 2000,
      ...options,
    }
  )

  // --- Add Comment ---
  const addComment = async (content: string) => {
    if (!projectId || !content.trim()) return

    try {
      // Optimistic UI: Update local data immediately
      mutate(
        (currentData = []) => [
          {
            id: 'temp-id-' + Date.now(),
            content,
            createdAt: new Date().toISOString(),
            authorName: 'You',
            authorRole: isAdmin ? 'ADMIN' : 'CLIENT',
          },
          ...currentData,
        ],
        false // Do not revalidate yet
      )

      // Send request to the server
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) {
        throw new Error('Failed to post comment')
      }

      // Trigger revalidation to get the latest data from server
      mutate()
    } catch (err) {
      console.error('Error adding comment:', err)
      // Revert optimistic update on error
      mutate() 
      throw err
    }
  }

  // --- Delete Comment ---
  const deleteComment = async (commentId: string) => {
    if (!projectId) return

    try {
      // Optimistic UI: Remove comment from local data
      mutate(
        (currentData = []) => currentData.filter((c) => c.id !== commentId),
        false
      )

      // Send request to the server
      const res = await fetch(`${apiUrl}?commentId=${commentId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (!res.ok) {
        throw new Error('Failed to delete comment')
      }

      // Trigger revalidation
      mutate()
    } catch (err) {
      console.error('Error deleting comment:', err)
      // Revert optimistic update on error
      mutate()
      throw err
    }
  }

  return {
    comments: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
    addComment,
    deleteComment,
  }
}
