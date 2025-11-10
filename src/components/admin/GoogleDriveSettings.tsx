'use client'

import { useState, useEffect } from 'react'

interface GoogleDriveSettingsProps {
  projectId: string
}

export default function GoogleDriveSettings({ projectId }: GoogleDriveSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [driveLink, setDriveLink] = useState('')
  const [instructions, setInstructions] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [projectId])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/projects/${projectId}`)
      if (res.ok) {
        const data = await res.json()
        const project = data.project || data
        setDriveLink(project.googleDriveLink || '')
        setInstructions(project.googleDriveInstructions || `📁 How to Upload Files (Easy Steps):

1. Click the "Open Google Drive Folder" button below
2. You'll be taken to a secure Google Drive folder for your project
3. Click the "New" button or drag files directly into the folder
4. Wait for files to finish uploading (you'll see a checkmark)
5. Your project team will be notified automatically!

💡 Tips:
• Use clear file names (e.g., "Logo_Final_v2.png")
• Organize files in folders if you have many items
• You can upload multiple files at once
• All common file types are supported (images, documents, videos, etc.)

Need help? Contact your project manager anytime!`)
      }
    } catch (error) {
      console.error('Failed to fetch Google Drive settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)

      const res = await fetch(`/api/admin/projects/${projectId}/google-drive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleDriveLink: driveLink,
          googleDriveInstructions: instructions,
        }),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      setMessage({ type: 'success', text: 'Google Drive settings saved successfully!' })
      setIsEditing(false)
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.01 2.011a3.2 3.2 0 0 1 3.2 3.2v3.197h3.197a3.2 3.2 0 0 1 3.2 3.199v3.2a3.2 3.2 0 0 1-3.2 3.2h-3.197v3.196a3.2 3.2 0 0 1-3.2 3.2h-3.2a3.2 3.2 0 0 1-3.2-3.2v-3.197H2.414a3.2 3.2 0 0 1-3.2-3.199v-3.2a3.2 3.2 0 0 1 3.2-3.2h3.196V5.21a3.2 3.2 0 0 1 3.2-3.2h3.2zM5.61 10.607H2.414a1.2 1.2 0 0 0-1.2 1.199v3.2a1.2 1.2 0 0 0 1.2 1.2h3.196v-5.599zm4.4 0H8.81v5.599h1.2a1.2 1.2 0 0 0 1.2-1.2v-3.2a1.2 1.2 0 0 0-1.2-1.199zm8.397 0h-3.197v5.599h3.197a1.2 1.2 0 0 0 1.2-1.2v-3.2a1.2 1.2 0 0 0-1.2-1.199zm-6.397-6.397H8.81v3.197h3.2V5.21a1.2 1.2 0 0 0-1.2-1.2zm4.4 0h-3.2v3.197h3.2V5.21a1.2 1.2 0 0 0-1.2-1.2z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Google Drive File Uploads</h2>
            <p className="text-sm text-gray-600">Configure Google Drive folder for client uploads</p>
          </div>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Content */}
      {isEditing ? (
        <div className="space-y-4">
          {/* Google Drive Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Google Drive Folder Link
            </label>
            <input
              type="url"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500">
              Create a Google Drive folder and paste the shareable link here
            </p>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instructions for Client
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter instructions for the client on how to upload files..."
            />
            <p className="mt-2 text-sm text-gray-500">
              These instructions will be shown to the client alongside the upload button
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !driveLink}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Settings
                </>
              )}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                fetchSettings() // Reset to original values
              }}
              disabled={saving}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {driveLink ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Google Drive Folder
                </label>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.01 2.011a3.2 3.2 0 0 1 3.2 3.2v3.197h3.197a3.2 3.2 0 0 1 3.2 3.199v3.2a3.2 3.2 0 0 1-3.2 3.2h-3.197v3.196a3.2 3.2 0 0 1-3.2 3.2h-3.2a3.2 3.2 0 0 1-3.2-3.2v-3.197H2.414a3.2 3.2 0 0 1-3.2-3.199v-3.2a3.2 3.2 0 0 1 3.2-3.2h3.196V5.21a3.2 3.2 0 0 1 3.2-3.2h3.2z"/>
                  </svg>
                  <a
                    href={driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium truncate flex-1"
                  >
                    {driveLink}
                  </a>
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Client Instructions
                </label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{instructions}</p>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900">Active</p>
                    <p className="text-sm text-green-700">Clients will see a "Upload to Google Drive" button in their portal</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <svg className="w-12 h-12 text-yellow-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="font-bold text-gray-900 mb-2">No Google Drive Link Set</h3>
              <p className="text-gray-600 mb-4">Click "Edit" to configure Google Drive file uploads for this project</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
