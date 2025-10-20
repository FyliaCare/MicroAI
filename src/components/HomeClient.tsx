'use client'

import { useState, lazy, Suspense } from 'react'
import Link from 'next/link'

const AIProjectModal = lazy(() => import('./AIProjectModal'))

export default function HomeClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {isModalOpen && (
        <Suspense fallback={<div />}>
          <AIProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
      
      <main className="min-h-screen bg-black text-white overflow-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg border-b border-gray-800 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  MicroAI
                </h1>
              </div>
              <div className="hidden md:flex space-x-8 items-center">
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
                <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">Portfolio</Link>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
                <Link href="/admin" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all">
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Content will be passed as children */}
        <div className="home-content">
          {/* This will be filled by the parent component */}
        </div>
      </main>
    </>
  )
}

export function StartProjectButton({ className }: { className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {isModalOpen && (
        <Suspense fallback={<div />}>
          <AIProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        <span className="inline-flex items-center">
          Start Your Project
          <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </button>
    </>
  )
}
