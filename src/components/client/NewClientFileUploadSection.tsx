'use client'

import AdvancedFileUpload from '@/components/shared/AdvancedFileUpload'

interface Props {
  projectId: string
}

export default function NewClientFileUploadSection({ projectId }: Props) {
  return <AdvancedFileUpload projectId={projectId} isAdmin={false} />
}
