'use client'

import useSWR, { mutate as globalMutate } from 'swr'
import { useState } from 'react'

// Define the structure of a project file
export interface ProjectFile {
  id: string
  filename: string
  fileUrl: string
  fileType: string
  uploaderRole: 'ADMIN' | 'CLIENT'
  uploaderName: string
  createdAt: string
}

// Define the structure of the API response for files
interface FilesApiResponse {
  files: ProjectFile[]
}

// Reusable fetcher function
const fetcher = async (url: string, token?: string) => {
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    headers,
    credentials: 'include', // Include cookies for session-based auth (admin)
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    const error = new Error(errorBody.message || 'An error occurred while fetching the data.')
    throw error
  }

  return res.json()
}

export const useProjectFiles = (projectId: string, token?: string, isAdmin: boolean = false) => {
  const apiUrl = isAdmin
    ? `/api/admin/projects/${projectId}/files`
    : `/api/client/projects/${projectId}/files`

  const { data, error, isLoading } = useSWR<FilesApiResponse>(
    projectId && (isAdmin || token) ? [apiUrl, token] : null,
    ([url, token]) => fetcher(url, token as string | undefined)
  )

  const [uploading, setUploading] = useState(false)

  // Function to upload a file
  const uploadFile = async (file: File) => {
    if (!projectId || (!isAdmin && !token)) {
      throw new Error('Project ID or authentication token is missing.')
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        throw new Error(errorBody.message || 'Failed to upload file.')
      }

      const newFile = await res.json()

      // Revalidate the data to show the new file
      globalMutate([apiUrl, token])

      return newFile.file as ProjectFile
    } catch (e) {
      console.error('Upload error:', e)
      throw e
    } finally {
      setUploading(false)
    }
  }

  // Function to delete a file
  const deleteFile = async (fileId: string) => {
    if (!projectId || (!isAdmin && !token)) {
      throw new Error('Project ID or authentication token is missing.')
    }

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Optimistic UI update: remove the file from the list immediately
    globalMutate(
      [apiUrl, token],
      (currentData: FilesApiResponse | undefined) => {
        if (!currentData) return undefined
        return {
          ...currentData,
          files: currentData.files.filter((file) => file.id !== fileId),
        }
      },
      false // Do not revalidate immediately
    )

    try {
      const res = await fetch(`${apiUrl}?fileId=${fileId}`, {
        method: 'DELETE',
        headers,
      })

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        // Revert optimistic update on failure
        globalMutate([apiUrl, token])
        throw new Error(errorBody.message || 'Failed to delete file.')
      }
    } catch (e) {
      console.error('Delete error:', e)
      // Revert optimistic update on failure
      globalMutate([apiUrl, token])
      throw e
    }
  }

  return {
    files: data?.files,
    isLoading,
    isError: error,
    uploading,
    uploadFile,
    deleteFile,
    mutate: () => globalMutate([apiUrl, token]),
  }
}
