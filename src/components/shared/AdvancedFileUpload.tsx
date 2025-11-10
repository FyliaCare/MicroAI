'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { 
  Upload, X, FileIcon, Image as ImageIcon, FileText, Film, Music, 
  File, Check, AlertCircle, Loader2, Download, Trash2, Eye, RefreshCw 
} from 'lucide-react'

interface UploadedFile {
  id: string
  filename: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploaderName: string
  uploaderRole?: string
  uploadedAt: string
  description?: string | null
}

interface AdvancedFileUploadProps {
  projectId: string
  isAdmin: boolean
  onUploadComplete?: () => void
}

export default function AdvancedFileUpload({ projectId, isAdmin, onUploadComplete }: AdvancedFileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch files on mount
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true)
      const endpoint = isAdmin 
        ? `/api/admin/projects/${projectId}/uploads`
        : `/api/client/projects/${projectId}/uploads`
      
      console.log('🔍 [AdvancedFileUpload] Fetching files:', { projectId, isAdmin, endpoint })
      
      const headers: HeadersInit = {}
      if (!isAdmin) {
        const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
        headers['Authorization'] = `Bearer ${session.token}`
      }

      const res = await fetch(endpoint, { 
        headers,
        credentials: 'include',
        cache: 'no-store' // Prevent caching issues with auth
      })

      console.log('📡 [AdvancedFileUpload] Response status:', res.status)

      if (res.ok) {
        const data = await res.json()
        console.log('📦 [AdvancedFileUpload] Full API response:', data)
        console.log('📊 [AdvancedFileUpload] data.files:', data.files)
        console.log('📊 [AdvancedFileUpload] data.uploads:', data.uploads)
        
        const filesArray = data.files || data.uploads || []
        console.log('✅ [AdvancedFileUpload] Setting files array:', filesArray)
        console.log('📈 [AdvancedFileUpload] Files count:', filesArray.length)
        
        setFiles(filesArray)
      } else {
        console.error('❌ [AdvancedFileUpload] Failed to fetch files, status:', res.status)
      }
    } catch (err) {
      console.error('❌ [AdvancedFileUpload] Failed to fetch files:', err)
    } finally {
      setLoading(false)
    }
  }, [projectId, isAdmin])

  // Fetch files on mount
  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // Debug: Track files state changes
  useEffect(() => {
    console.log('🔄 [AdvancedFileUpload] Files state updated:', {
      count: files.length,
      files: files,
      isAdmin,
      projectId
    })
  }, [files, isAdmin, projectId])

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    setSelectedFiles(prev => [...prev, ...droppedFiles])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Upload files
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    setError(null)
    const endpoint = isAdmin 
      ? `/api/admin/projects/${projectId}/uploads`
      : `/api/client/projects/${projectId}/uploads`

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const formData = new FormData()
        formData.append('file', file)

        const headers: HeadersInit = {}
        if (!isAdmin) {
          const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
          headers['Authorization'] = `Bearer ${session.token}`
        }

        // Simulate progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
        
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: Math.min((prev[file.name] || 0) + 10, 90)
          }))
        }, 200)

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: formData,
          credentials: 'include',
          cache: 'no-store'
        })

        clearInterval(progressInterval)
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Upload failed')
        }

        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Success - refresh files
      setSelectedFiles([])
      setUploadProgress({})
      await fetchFiles()
      onUploadComplete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // Delete file
  const deleteFile = async (fileId: string) => {
    if (!confirm('Delete this file? This action cannot be undone.')) return

    try {
      const endpoint = isAdmin 
        ? `/api/admin/projects/${projectId}/uploads?fileId=${fileId}`
        : `/api/client/projects/${projectId}/uploads?fileId=${fileId}`

      const headers: HeadersInit = {}
      if (!isAdmin) {
        const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
        headers['Authorization'] = `Bearer ${session.token}`
      }

      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers,
        credentials: 'include',
        cache: 'no-store'
      })

      if (!res.ok) throw new Error('Delete failed')

      await fetchFiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  // Download file
  const downloadFile = async (file: UploadedFile) => {
    try {
      console.log('📥 Downloading file:', file.filename)
      
      // Fetch the file from Cloudinary
      const response = await fetch(file.fileUrl)
      if (!response.ok) throw new Error('Download failed')
      
      // Get the blob
      const blob = await response.blob()
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob)
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = file.filename
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
      
      console.log('✅ Download completed')
    } catch (err) {
      console.error('❌ Download failed:', err)
      setError('Failed to download file')
    }
  }

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />
    if (fileType.startsWith('video/')) return <Film className="w-5 h-5" />
    if (fileType.startsWith('audio/')) return <Music className="w-5 h-5" />
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 bg-white'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        
        <div className="p-8 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            dragActive ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {dragActive ? 'Drop files here' : 'Upload Files'}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop or click to browse
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select Files
          </button>
          
          <p className="text-xs text-gray-500 mt-3">
            Supports: Images, Videos, Documents, Audio (Max 50MB)
          </p>
        </div>
      </div>

      {/* Selected Files Queue */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">
              Ready to Upload ({selectedFiles.length})
            </h4>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FileIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                  
                  {uploadProgress[file.name] !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {!uploading && (
                  <button
                    onClick={() => removeSelectedFile(index)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                
                {uploadProgress[file.name] === 100 && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="mt-4 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Upload Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-5 h-5 text-red-600" />
          </button>
        </div>
      )}

      {/* Files List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">
            Project Files ({files.length})
          </h4>
          <button
            onClick={fetchFiles}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No files yet</p>
            <p className="text-sm text-gray-500 mt-1">Upload files to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    file.uploaderRole === 'ADMIN' || file.uploaderRole === 'Admin' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {getFileIcon(file.fileType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate" title={file.filename}>
                      {file.filename}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {file.uploaderName} • {formatFileSize(file.fileSize)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => downloadFile(file)}
                    className="flex-1 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  
                  {file.fileType.startsWith('image/') && (
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="px-3 py-2 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg text-sm font-medium text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewFile && previewFile.fileType.startsWith('image/') && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewFile.fileUrl}
              alt={previewFile.filename}
              className="max-w-full max-h-[90vh] rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}
