'use client'

import { useState, useRef } from 'react'
import Button from '@/components/ui/Button'

interface ProjectFile {
  id: string
  filename: string
  fileUrl: string
  fileSize: number
  fileType: string
  description?: string
  uploadedAt: Date
  uploadedBy: string
}

interface FileUploadSectionProps {
  projectId: string
  files: ProjectFile[]
  onUploadComplete: () => void
}

export default function FileUploadSection({ projectId, files, onUploadComplete }: FileUploadSectionProps) {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      if (description) {
        formData.append('description', description)
      }

      const response = await fetch(`/api/admin/projects/${projectId}/uploads`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload file')
      }

      setSelectedFile(null)
      setDescription('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onUploadComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Upload New File</h3>
        
        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-700 font-medium mb-2">
              {selectedFile ? selectedFile.name : 'Drag & drop your file here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all">
                Browse Files
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2">Max file size: 10MB</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {selectedFile && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a description for this file..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </Button>
              <Button
                onClick={() => {
                  setSelectedFile(null)
                  setDescription('')
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Files List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900">Uploaded Files ({files.length})</h3>
        {files.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-200">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-xl shadow p-4 border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.filename}</p>
                      {file.description && (
                        <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{formatFileSize(file.fileSize)}</span>
                        <span>•</span>
                        <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>By {file.uploadedBy}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
