'use client'

import { useState, lazy, Suspense } from 'react'

const AIProjectModal = lazy(() => import('./AIProjectModal'))

interface CTAButtonProps {
  className?: string
  children: React.ReactNode
}

export default function CTAButton({ className, children }: CTAButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {isModalOpen && (
        <Suspense fallback={null}>
          <AIProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
      <button onClick={() => setIsModalOpen(true)} className={className}>
        {children}
      </button>
    </>
  )
}
