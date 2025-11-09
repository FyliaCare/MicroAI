'use client'

import { useState, useEffect } from 'react'

interface FileData {
  id: string
  filename: string
  fileUrl: string
  fileSize: number
  fileType: string | null
  description: string | null
  uploadedAt: string
  source: 'admin' | 'client'
  uploadedBy?: string
}

interface Props {
  projectId: string
}

export default function NewFileUploadSection({ projectId }: Props) {
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch files on mount and whenever projectId changes
  useEffect(() => {
    loadFiles()
  }, [projectId])

  const loadFiles = async () => {
    try {
      console.log('🔄 Loading files for project:', projectId)
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/projects/${projectId}/uploads`)
      
      if (!response.ok) {
        throw new Error(`Failed to load files: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Files loaded:', data.files?.length || 0)
      
      setFiles(data.files || [])
    } catch (err) {
      console.error('❌ Error loading files:', err)
      setError(err instanceof Error ? err.message : 'Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(selectedFiles)) {
        console.log('📤 Uploading file:', file.name)
        
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`/api/admin/projects/${projectId}/uploads`, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        console.log('✅ File uploaded:', file.name)
      }

      // Reload all files after successful upload
      await loadFiles()
      
      // Reset file input
      e.target.value = ''
    } catch (err) {
      console.error('❌ Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileId: string, filename: string) => {
    if (!confirm(`Delete ${filename}?`)) return

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/uploads?fileId=${fileId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      console.log('✅ File deleted:', filename)
      
      // Reload files
      await loadFiles()
    } catch (err) {
      console.error('❌ Delete error:', err)
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-dashed border-blue-300">
        <label className="block cursor-pointer">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-700">
              {uploading ? 'Uploading...' : 'Click to upload files'}
            </p>
            <p className="mt-1 text-xs text-gray-500">Up to 50MB per file</p>
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
            accept="*/*"
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Files List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">{files.length} file(s)</p>
          
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{file.filename}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      file.source === 'admin' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {file.source === 'admin' ? 'Admin' : 'Client'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    {file.uploadedBy && (
                      <span>by {file.uploadedBy}</span>
                    )}
                  </div>
                  
                  {file.description && (
                    <p className="mt-2 text-sm text-gray-600">{file.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                  
                  {file.source === 'admin' && (
                    <button
                      onClick={() => handleDelete(file.id, file.filename)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={loadFiles}
        disabled={loading}
        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
      >
        {loading ? 'Refreshing...' : '🔄 Refresh Files'}
      </button>
    </div>
  )
}
