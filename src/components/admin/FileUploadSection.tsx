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
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [pushingToGithub, setPushingToGithub] = useState<string | null>(null)
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
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB')
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB')
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

  const handleDownloadToSystem = async (file: ProjectFile) => {
    setDownloadingId(file.id)
    try {
      // Create a link and trigger download
      const response = await fetch(file.fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download file')
    } finally {
      setDownloadingId(null)
    }
  }

  const handlePushToGitHub = async (file: ProjectFile) => {
    setPushingToGithub(file.id)
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/github/push-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: file.id,
          filename: file.filename,
          fileUrl: file.fileUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to push to GitHub')
      }

      alert(`Successfully pushed ${file.filename} to GitHub!`)
    } catch (err) {
      console.error('GitHub push failed:', err)
      alert(err instanceof Error ? err.message : 'Failed to push file to GitHub')
    } finally {
      setPushingToGithub(null)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/uploads/${fileId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      onUploadComplete()
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Failed to delete file')
    }
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
              accept="*/*"
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all">
                Browse Files
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2">All file types accepted • Max file size: 50MB</p>
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
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
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
                        <span className={`px-2 py-0.5 rounded-full ${
                          file.uploadedBy === 'ADMIN' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {file.uploadedBy}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    {/* View Button */}
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex items-center gap-1"
                      title="View file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>

                    {/* Download to System Button */}
                    <button
                      onClick={() => handleDownloadToSystem(file)}
                      disabled={downloadingId === file.id}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download to your computer"
                    >
                      {downloadingId === file.id ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </>
                      )}
                    </button>

                    {/* Push to GitHub Button */}
                    <button
                      onClick={() => handlePushToGitHub(file)}
                      disabled={pushingToGithub === file.id}
                      className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Push to GitHub repository"
                    >
                      {pushingToGithub === file.id ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </>
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors flex items-center gap-1"
                      title="Delete file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
