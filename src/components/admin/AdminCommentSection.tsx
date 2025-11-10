'use client'

import AdvancedComments from '@/components/shared/AdvancedComments'

interface Props {
  projectId: string
}

export default function AdminCommentSection({ projectId }: Props) {
  return <AdvancedComments projectId={projectId} isAdmin={true} />
}
