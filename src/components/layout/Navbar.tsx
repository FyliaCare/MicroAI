// components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              MicroAI
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="#services" className="text-gray-600 hover:text-gray-900 transition-colors">
              Services
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="#portfolio" className="text-gray-600 hover:text-gray-900 transition-colors">
              Portfolio
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
            <Link 
              href="/admin" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="#services" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                Services
              </Link>
              <Link href="#about" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="#portfolio" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                Portfolio
              </Link>
              <Link href="#contact" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
                Contact
              </Link>
              <Link href="/admin" className="block px-3 py-2 text-blue-600 hover:text-blue-900">
                Admin Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
