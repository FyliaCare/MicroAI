'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Upload {
  id: string
  name: string
  description: string | null
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  category: string
  version: number
  isApproved: boolean
  approvedBy: string | null
  approvedAt: string | null
  colorPalette: any
  createdAt: string
}

interface DocumentUploadsProps {
  projectId: string
  sessionToken: string
  onUploadComplete?: () => void
}

export default function DocumentUploads({ projectId, sessionToken, onUploadComplete }: DocumentUploadsProps) {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  
  // Upload form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadName, setUploadName] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadCategory, setUploadCategory] = useState('document')
  const [colorPalette, setColorPalette] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const categories = [
    { value: 'logo', label: '🎨 Logo', description: 'Company or project logo' },
    { value: 'brand-colors', label: '🎨 Brand Colors', description: 'Color palette or brand guidelines' },
    { value: 'flyer', label: '📄 Flyer', description: 'Marketing materials or flyers' },
    { value: 'image', label: '🖼️ Image', description: 'Photos, mockups, or design assets' },
    { value: 'document', label: '📎 Document', description: 'PDFs, Word docs, spreadsheets' },
  ]

  // Load uploads
  const loadUploads = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/client/uploads?projectId=${projectId}`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load uploads')
        setIsLoading(false)
        return
      }

      if (data.success) {
        setUploads(data.uploads)
        setStats(data.stats)
      }

      setIsLoading(false)
    } catch (err) {
      console.error('Load uploads error:', err)
      setError('Failed to load uploads')
      setIsLoading(false)
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit')
      return
    }

    setSelectedFile(file)
    if (!uploadName) {
      setUploadName(file.name.split('.')[0])
    }
  }

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !uploadName) {
      setError('Please select a file and provide a name')
      return
    }

    setIsUploading(true)
    setError('')
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('projectId', projectId)
      formData.append('name', uploadName)
      formData.append('category', uploadCategory)
      if (uploadDescription) formData.append('description', uploadDescription)
      if (colorPalette && uploadCategory === 'brand-colors') {
        formData.append('colorPalette', colorPalette)
      }

      const response = await fetch('/api/client/uploads', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionToken}` },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Upload failed')
        setIsUploading(false)
        return
      }

      if (data.success) {
        // Reset form
        setSelectedFile(null)
        setUploadName('')
        setUploadDescription('')
        setUploadCategory('document')
        setColorPalette('')
        setShowUploadModal(false)
        
        // Reload uploads
        await loadUploads()
        
        if (onUploadComplete) onUploadComplete()
      }

      setIsUploading(false)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Upload failed')
      setIsUploading(false)
    }
  }

  // Handle delete
  const handleDelete = async (uploadId: string) => {
    if (!confirm('Are you sure you want to delete this upload?')) return

    try {
      const response = await fetch(`/api/client/uploads?id=${uploadId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      })

      const data = await response.json()

      if (data.success) {
        await loadUploads()
      } else {
        setError(data.error || 'Failed to delete')
      }
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete')
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      logo: '🎨',
      'brand-colors': '🎨',
      flyer: '📄',
      image: '🖼️',
      document: '📎',
    }
    return icons[category] || '📎'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Documents & Assets</h3>
          <p className="text-sm text-gray-600">Upload logos, images, and supporting documents</p>
        </div>
        <Button onClick={() => { loadUploads(); setShowUploadModal(true) }}>
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Files</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Uploads List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
        </div>
      ) : uploads.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-2">No documents uploaded yet</p>
          <p className="text-sm text-gray-500">Click "Upload Document" to get started</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploads.map((upload) => (
            <Card key={upload.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(upload.category)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{upload.name}</h4>
                    <p className="text-xs text-gray-500">{upload.category}</p>
                  </div>
                </div>
                {upload.isApproved ? (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">✓ Approved</span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                )}
              </div>

              {upload.description && (
                <p className="text-sm text-gray-600 mb-3">{upload.description}</p>
              )}

              <div className="text-xs text-gray-500 mb-3">
                <div>{upload.fileName}</div>
                <div>{formatFileSize(upload.fileSize)}</div>
                <div>{new Date(upload.createdAt).toLocaleDateString()}</div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(upload.fileUrl, '_blank')}
                >
                  View
                </Button>
                {!upload.isApproved && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(upload.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
      >
        <div className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setUploadCategory(cat.value)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    uploadCategory === cat.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{cat.label}</div>
                  <div className="text-xs text-gray-500">{cat.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* File Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
            <input
              type="file"
              onChange={handleFileSelect}
              className="w-full text-sm"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
            {selectedFile && (
              <p className="text-xs text-gray-500 mt-1">
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
            <Input
              value={uploadName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadName(e.target.value)}
              placeholder="e.g., Company Logo"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <Textarea
              value={uploadDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUploadDescription(e.target.value)}
              placeholder="Add any notes or context..."
              rows={3}
            />
          </div>

          {/* Color Palette (for brand-colors category) */}
          {uploadCategory === 'brand-colors' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color Palette (Optional)
              </label>
              <Input
                value={colorPalette}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorPalette(e.target.value)}
                placeholder='e.g., {"primary":"#3B82F6","secondary":"#10B981"}'
              />
              <p className="text-xs text-gray-500 mt-1">JSON format with color codes</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !uploadName || isUploading}
              className="flex-1"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button
              onClick={() => setShowUploadModal(false)}
              variant="outline"
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
