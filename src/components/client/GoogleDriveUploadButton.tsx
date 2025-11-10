'use client'

import { useState, useEffect } from 'react'

interface GoogleDriveUploadButtonProps {
  projectId: string
}

export default function GoogleDriveUploadButton({ projectId }: GoogleDriveUploadButtonProps) {
  const [loading, setLoading] = useState(true)
  const [driveLink, setDriveLink] = useState<string | null>(null)
  const [instructions, setInstructions] = useState<string>('')
  const [notifying, setNotifying] = useState(false)
  const [notificationSent, setNotificationSent] = useState(false)

  useEffect(() => {
    fetchGoogleDriveSettings()
  }, [projectId])

  const fetchGoogleDriveSettings = async () => {
    try {
      setLoading(true)
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.token

      if (!token) return

      const res = await fetch(`/api/client/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        const project = data.project || data
        setDriveLink(project.googleDriveLink || null)
        setInstructions(project.googleDriveInstructions || `📁 How to Upload Files (Easy Steps):

1. Click the "Open Google Drive Folder" button below
2. You'll be taken to a secure Google Drive folder for your project
3. Click the "New" button or drag files directly into the folder
4. Wait for files to finish uploading (you'll see a checkmark)
5. Click the "Notify Admin" button below to let us know files are ready!

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

  const handleNotifyAdmin = async () => {
    try {
      setNotifying(true)
      const session = JSON.parse(localStorage.getItem('clientSession') || '{}')
      const token = session.token

      if (!token) return

      const res = await fetch(`/api/client/projects/${projectId}/notify-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setNotificationSent(true)
        setTimeout(() => setNotificationSent(false), 5000) // Reset after 5 seconds
      }
    } catch (error) {
      console.error('Failed to notify admin:', error)
    } finally {
      setNotifying(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-20 bg-gray-200 rounded-xl"></div>
      </div>
    )
  }

  if (!driveLink) {
    return (
      <div className="text-center py-12 px-6 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl border-2 border-dashed border-gray-300">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-900 mb-2">File Upload Not Yet Configured</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Your project manager will set up a Google Drive folder for file uploads soon. You'll be notified when it's ready.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Instructions</h3>
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">
              {instructions}
            </p>
          </div>
        </div>
      </div>

      {/* Google Drive Button Card */}
      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-center">
          {/* Google Drive Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-green-400 to-blue-500 mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.01 2.011a3.2 3.2 0 0 1 3.2 3.2v3.197h3.197a3.2 3.2 0 0 1 3.2 3.199v3.2a3.2 3.2 0 0 1-3.2 3.2h-3.197v3.196a3.2 3.2 0 0 1-3.2 3.2h-3.2a3.2 3.2 0 0 1-3.2-3.2v-3.197H2.414a3.2 3.2 0 0 1-3.2-3.199v-3.2a3.2 3.2 0 0 1 3.2-3.2h3.196V5.21a3.2 3.2 0 0 1 3.2-3.2h3.2zM5.61 10.607H2.414a1.2 1.2 0 0 0-1.2 1.199v3.2a1.2 1.2 0 0 0 1.2 1.2h3.196v-5.599zm4.4 0H8.81v5.599h1.2a1.2 1.2 0 0 0 1.2-1.2v-3.2a1.2 1.2 0 0 0-1.2-1.199zm8.397 0h-3.197v5.599h3.197a1.2 1.2 0 0 0 1.2-1.2v-3.2a1.2 1.2 0 0 0-1.2-1.199zm-6.397-6.397H8.81v3.197h3.2V5.21a1.2 1.2 0 0 0-1.2-1.2zm4.4 0h-3.2v3.197h3.2V5.21a1.2 1.2 0 0 0-1.2-1.2z"/>
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">Upload Your Files</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Click the button below to open your project's Google Drive folder and upload your files.
          </p>

          {/* Upload Button */}
          <a
            href={driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.01 2.011a3.2 3.2 0 0 1 3.2 3.2v3.197h3.197a3.2 3.2 0 0 1 3.2 3.199v3.2a3.2 3.2 0 0 1-3.2 3.2h-3.197v3.196a3.2 3.2 0 0 1-3.2 3.2h-3.2a3.2 3.2 0 0 1-3.2-3.2v-3.197H2.414a3.2 3.2 0 0 1-3.2-3.199v-3.2a3.2 3.2 0 0 1 3.2-3.2h3.196V5.21a3.2 3.2 0 0 1 3.2-3.2h3.2z"/>
            </svg>
            Open Google Drive Folder
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Notify Admin Button */}
          <button
            onClick={handleNotifyAdmin}
            disabled={notifying || notificationSent}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base shadow-md transition-all ${
              notificationSent
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-default'
                : notifying
                ? 'bg-gray-400 text-white cursor-wait'
                : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-gray-400 transform hover:scale-[1.02]'
            }`}
          >
            {notifying ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sending Notification...
              </>
            ) : notificationSent ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Admin Notified Successfully!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notify Project Team
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 mt-4">
            After uploading your files, click the "Notify Project Team" button above.
          </p>
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-2">Tips for Uploading</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Use descriptive file names (e.g., "Logo_Final_v2.png")</li>
              <li>Organize files into folders if needed</li>
              <li>Compress large files before uploading</li>
              <li>Contact your project manager if you need help</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
