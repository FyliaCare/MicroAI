'use client'

import { useState, useEffect } from 'react'
import { useProjectFiles, ProjectFile } from '@/hooks/useProjectFiles'
import { FileIcon, Download, Trash2, Loader2, RefreshCw, UploadCloud } from 'lucide-react'

interface Props {
  projectId: string
}

export default function NewClientFileUploadSection({ projectId }: Props) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('clientToken')
    setToken(storedToken)
  }, [])

  const {
    files,
    isLoading,
    isError,
    uploading,
    uploadFile,
    deleteFile,
    mutate,
  } = useProjectFiles(projectId, token || undefined, false) // isAdmin = false

  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const file = selectedFiles[0]
    setError(null)

    try {
      await uploadFile(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'File upload failed.')
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return
    setError(null)
    try {
      await deleteFile(fileId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file.')
    }
  }
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files)
    }
  }

  const renderFileCard = (file: ProjectFile) => (
    <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 overflow-hidden">
        <FileIcon className={`h-8 w-8 flex-shrink-0 ${file.uploaderRole === 'ADMIN' ? 'text-blue-500' : 'text-purple-500'}`} />
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-gray-800 truncate" title={file.filename}>
            {file.filename}
          </p>
          <p className="text-xs text-gray-500">
            Uploaded by {file.uploaderName} on {new Date(file.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href={file.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title="Download File"
        >
          <Download className="h-4 w-4" />
        </a>
        {file.uploaderRole === 'CLIENT' && (
          <button
            onClick={() => handleDelete(file.id)}
            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
            title="Delete File"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )

  if (!token) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <p className="text-red-600">Authentication token not found. Please log in again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        {/* File Upload Area */}
        <div
            className={`relative border-2 border-dashed rounded-xl transition-colors ${
            dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
            type="file"
            id="client-file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => handleFileChange(e.target.files)}
            disabled={uploading}
            />
            <label htmlFor="client-file-upload" className="flex flex-col items-center justify-center text-center p-8 cursor-pointer">
            <UploadCloud className={`h-12 w-12 ${dragActive ? 'text-purple-600' : 'text-gray-400'}`} />
            <p className="mt-4 font-semibold text-gray-700">
                {dragActive ? 'Drop to upload' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500">Share files with the admin</p>
            </label>
            {uploading && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-xl">
                <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                <p className="mt-3 text-sm font-medium text-gray-700">Uploading...</p>
            </div>
            )}
        </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <p><strong className="font-bold">Error: </strong>{error}</p>
        </div>
      )}

      {/* Files List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Project Files</h3>
          <button
            onClick={() => mutate()}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh Files"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-600">Loading files...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">Failed to load project files.</p>
          </div>
        ) : !files || files.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No files have been shared for this project yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map(renderFileCard)}
          </div>
        )}
      </div>
    </div>
  )
}
