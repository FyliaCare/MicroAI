'use client'

import AdvancedComments from '@/components/shared/AdvancedComments'

interface Props {
  projectId: string
}

export default function ClientCommentSection({ projectId }: Props) {
  return <AdvancedComments projectId={projectId} isAdmin={false} />
}
