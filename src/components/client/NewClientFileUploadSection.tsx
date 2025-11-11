'use client'

import GoogleDriveUploadButton from '@/components/client/GoogleDriveUploadButton'

interface Props {
  projectId: string
}

export default function NewClientFileUploadSection({ projectId }: Props) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Upload Files</h3>
      <GoogleDriveUploadButton projectId={projectId} isAdmin={false} />
    </div>
  )
}
