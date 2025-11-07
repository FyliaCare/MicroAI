import { Suspense } from 'react'
import AdvancedProjectsManager from '@/components/admin/ProjectsManager'

export default function ProjectsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
        <AdvancedProjectsManager />
      </Suspense>
    </div>
  )
}
