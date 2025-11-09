'use client'

import { useState, useRef } from 'react'

interface FileUploadSectionProps {
  projectId: string
  uploads: Array<{
    id: string
    fileName: string
    filePath: string
    fileSize: number
    fileType: string
    description: string | null
    createdAt: string
  }>
  onUploadSuccess: () => void
}

export default function FileUploadSection({
  projectId,
  uploads,
  onUploadSuccess,
}: FileUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [description, setDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setError('')

    try {
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.token

      if (!token) {
        throw new Error('No session token found')
      }

      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size exceeds 50MB limit')
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('description', description)

      const response = await fetch(`/api/client/projects/${projectId}/uploads`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload file')
      }

      // Success
      setDescription('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onUploadSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept="*/*"
        />

        <div className="text-center">
          <svg
            className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-4 text-sm text-gray-600">
            Drag and drop a file here, or{' '}
            <label htmlFor="file-upload" className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
              browse
            </label>
          </p>
          <p className="mt-1 text-xs text-gray-500">All file types accepted • Maximum file size: 50MB</p>
        </div>

        {/* Description Input */}
        <div className="mt-6">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="File description (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isUploading}
          />
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm font-medium text-gray-700">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Uploaded Files ({uploads.length})</h4>
          <div className="space-y-2">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{upload.fileName}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{formatFileSize(upload.fileSize)}</span>
                      <span>•</span>
                      <span>{new Date(upload.createdAt).toLocaleDateString()}</span>
                    </div>
                    {upload.description && (
                      <p className="text-sm text-gray-600 mt-1">{upload.description}</p>
                    )}
                  </div>
                </div>
                <a
                  href={upload.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
