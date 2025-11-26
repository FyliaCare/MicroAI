'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AIQuoteCreatorProps {
  onClose?: () => void
}

export default function AIQuoteCreator({ onClose }: AIQuoteCreatorProps) {
  const router = useRouter()
  const [readmeContent, setReadmeContent] = useState('')
  const [clientInfo, setClientInfo] = useState({
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    clientPhone: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)

  const handleReadmeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    setReadmeContent(content)
    setCharCount(content.length)
  }

  const handleGenerate = async () => {
    if (!readmeContent.trim()) {
      setError('Please paste README content to analyze')
      return
    }

    if (!clientInfo.clientName || !clientInfo.clientEmail) {
      setError('Please provide client name and email')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/admin/quotes/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          readmeContent,
          clientInfo,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate quote')
      }

      const data = await response.json()

      if (data.success && data.quote) {
        // Store the generated quote in sessionStorage for the quote builder
        sessionStorage.setItem('aiGeneratedQuote', JSON.stringify(data.quote))
        
        // Navigate to quote builder with the generated data
        router.push('/admin/quotes/new?aiGenerated=true')
      } else {
        throw new Error('Invalid response from AI generator')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate quote. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const sampleReadme = `# E-Commerce Platform

A modern e-commerce platform for online retail businesses.

## Features

- User authentication and profiles
- Product catalog with search and filters
- Shopping cart and checkout
- Payment processing (Stripe integration)
- Order management system
- Admin dashboard with analytics
- Email notifications
- Responsive design

## Tech Stack

- Next.js 14
- PostgreSQL
- Stripe API
- Tailwind CSS
`

  const handleLoadSample = () => {
    setReadmeContent(sampleReadme)
    setCharCount(sampleReadme.length)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">🤖 AI Quote Generator</h2>
              <p className="text-indigo-100">
                Paste any project README or description - our AI will analyze it and create a comprehensive quote
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:text-indigo-200 transition-colors text-2xl"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - README Input */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Project README or Description
                  </label>
                  <button
                    onClick={handleLoadSample}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Load Sample
                  </button>
                </div>
                <textarea
                  value={readmeContent}
                  onChange={handleReadmeChange}
                  placeholder="Paste your project README, documentation, or description here... 

The AI will analyze:
• Project type and complexity
• Features and requirements
• Technical stack
• Scope of work
• Timeline estimates
• Intelligent pricing breakdown

No character limit - paste as much detail as you have!"
                  className="w-full h-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
                />
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>✨ Unlimited text - the more detail, the better the quote!</span>
                  <span className="font-semibold">{charCount.toLocaleString()} characters</span>
                </div>
              </div>

              {/* AI Capabilities */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3">🧠 AI Analysis Capabilities</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Project type detection</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Feature extraction</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Complexity analysis</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Timeline estimation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Intelligent pricing</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Milestone generation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Scope of work</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Payment schedule</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Client Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Client Information
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={clientInfo.clientName}
                      onChange={(e) => setClientInfo({ ...clientInfo, clientName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Client Email *
                    </label>
                    <input
                      type="email"
                      value={clientInfo.clientEmail}
                      onChange={(e) => setClientInfo({ ...clientInfo, clientEmail: e.target.value })}
                      placeholder="john@company.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={clientInfo.clientCompany}
                      onChange={(e) => setClientInfo({ ...clientInfo, clientCompany: e.target.value })}
                      placeholder="Acme Corporation"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={clientInfo.clientPhone}
                      onChange={(e) => setClientInfo({ ...clientInfo, clientPhone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Industry Standard Pricing Info */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3">💰 Intelligent Pricing</h3>
                <p className="text-xs text-gray-700 mb-3">
                  Our AI uses industry-standard rates and proven allocation percentages:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Rate:</span>
                    <span className="font-semibold text-gray-900">$85/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planning & Design:</span>
                    <span className="font-semibold text-indigo-600">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Development:</span>
                    <span className="font-semibold text-indigo-600">50%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Testing & QA:</span>
                    <span className="font-semibold text-indigo-600">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deployment:</span>
                    <span className="font-semibold text-indigo-600">15%</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-700">Payment Schedule:</span>
                    <span className="text-green-600">30-25-25-20%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Industry-standard milestone-based payments
                  </p>
                </div>
              </div>

              {/* Editability Note */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">✏️</span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Fully Editable</h4>
                    <p className="text-xs text-gray-700">
                      After generation, you can edit every field - adjust pricing, modify scope, 
                      change timelines, or tweak any detail before sending to the client.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {isGenerating && (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing project and generating quote...
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            {onClose && (
              <button
                onClick={onClose}
                disabled={isGenerating}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !readmeContent.trim() || !clientInfo.clientName || !clientInfo.clientEmail}
              className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : '✨ Generate Quote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
