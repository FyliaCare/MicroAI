import useSWR from 'swr'

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

// --- Fetcher with proper error handling ---
async function fetcher(url: string, token?: string): Promise<Comment[]> {
  console.log(`🔄 Fetching comments from: ${url}`, { hasToken: !!token })
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    headers,
    credentials: 'include',
    cache: 'no-store',
  })

  console.log(`📡 Response status: ${res.status}`)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    console.error('❌ Fetch error:', errorData)
    throw new Error(errorData.error || `Failed to fetch comments (${res.status})`)
  }

  const data = await res.json()
  const comments = data.comments || []
  console.log('✅ Comments fetched successfully:', comments.length, 'comments')
  return comments
}

// --- useComments Hook ---
export function useComments(projectId: string, token?: string, isAdmin: boolean = false) {
  const apiUrl = isAdmin
    ? `/api/admin/projects/${projectId}/comments`
    : `/api/client/projects/${projectId}/comments`

  // Only fetch if we have required data
  const shouldFetch = projectId && (isAdmin || token)

  console.log('🎯 useComments initialized:', { 
    projectId, 
    isAdmin, 
    hasToken: !!token, 
    shouldFetch,
    apiUrl 
  })

  const { data, error, isLoading, mutate } = useSWR<Comment[]>(
    shouldFetch ? [apiUrl, token] : null,
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 2000,
      dedupingInterval: 2000,
    }
  )

  // --- Add Comment ---
  async function addComment(content: string): Promise<void> {
    if (!content.trim()) {
      throw new Error('Comment content cannot be empty')
    }

    console.log('📝 Adding comment...')

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ content: content.trim() }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to add comment' }))
      console.error('❌ Add comment error:', errorData)
      throw new Error(errorData.error || 'Failed to add comment')
    }

    console.log('✅ Comment added successfully')
    
    // Refresh comments
    await mutate()
  }

  // --- Delete Comment ---
  async function deleteComment(commentId: string): Promise<void> {
    console.log('🗑️ Deleting comment:', commentId)

    const headers: HeadersInit = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${apiUrl}?commentId=${commentId}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to delete comment' }))
      console.error('❌ Delete comment error:', errorData)
      throw new Error(errorData.error || 'Failed to delete comment')
    }

    console.log('✅ Comment deleted successfully')
    
    // Refresh comments
    await mutate()
  }

  return {
    comments: data,
    isLoading,
    isError: !!error,
    error,
    addComment,
    deleteComment,
    mutate,
  }
}
