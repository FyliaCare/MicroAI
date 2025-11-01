'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)
  const [result, setResult] = useState<{ success: boolean, message: string } | null>(null)

  useEffect(() => {
    if (token && !result) {
      handleUnsubscribe()
    }
  }, [token])

  const handleUnsubscribe = async () => {
    if (!token) {
      setResult({ 
        success: false, 
        message: 'Invalid unsubscribe link. Please use the link from your email.' 
      })
      return
    }

    setIsUnsubscribing(true)

    try {
      const response = await fetch(`/api/newsletter/unsubscribe?token=${token}`, {
        method: 'POST'
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, message: data.error || 'Failed to unsubscribe' })
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'Network error. Please try again later.' 
      })
    } finally {
      setIsUnsubscribing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
      <AdvancedNavbar />
      
      <div className="max-w-2xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 md:p-12 text-center">
          {isUnsubscribing ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Processing Your Request...
              </h1>
              <p className="text-gray-400">
                Please wait while we unsubscribe you from our newsletter.
              </p>
            </>
          ) : result ? (
            <>
              {result.success ? (
                <>
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    Successfully Unsubscribed
                  </h1>
                  <p className="text-gray-300 mb-8">
                    {result.message}
                  </p>
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
                    <p className="text-gray-300 mb-4">
                      We're sorry to see you go! If you change your mind, you can resubscribe anytime from our website.
                    </p>
                    <p className="text-sm text-gray-400">
                      It may take up to 48 hours to fully process your unsubscribe request.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Link
                      href="/"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Return to Homepage
                    </Link>
                    <div className="text-sm text-gray-500">
                      or{' '}
                      <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">
                        contact us
                      </Link>
                      {' '}if you have any questions
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    Unable to Unsubscribe
                  </h1>
                  <p className="text-gray-300 mb-8">
                    {result.message}
                  </p>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
                    <p className="text-gray-300 mb-4">
                      If you continue to have issues, please contact us directly:
                    </p>
                    <a 
                      href="mailto:sales@microaisystems.com" 
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      sales@microaisystems.com
                    </a>
                  </div>
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Return to Homepage
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Missing Unsubscribe Token
              </h1>
              <p className="text-gray-300 mb-8">
                Please use the unsubscribe link from your newsletter email.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all"
              >
                Return to Homepage
              </Link>
            </>
          )}

          {/* Additional Help */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Why did you receive this email?
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              You received our newsletter because you subscribed through our website, 
              provided your email during a service inquiry, or signed up at an event.
            </p>
            <p className="text-sm text-gray-400">
              We respect your privacy and will never share your information with third parties. 
              Read our{' '}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                Privacy Policy
              </Link>
              {' '}for more information.
            </p>
          </div>
        </div>
      </div>

      <Footer hideNewsletter />
    </main>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}
