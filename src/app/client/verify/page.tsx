'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    setToken(tokenParam)

    if (tokenParam) {
      verifyEmail(tokenParam)
    } else {
      setStatus('error')
      setMessage('No verification token provided. Please check your email link.')
    }
  }, [searchParams])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/client/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setMessage(data.error || 'Verification failed. Please try again.')
        return
      }

      if (data.success) {
        setStatus('success')
        setMessage(data.message || 'Email verified successfully!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/client/login?verified=true')
        }, 3000)
      }
    } catch (err) {
      console.error('Verification error:', err)
      setStatus('error')
      setMessage('An error occurred during verification. Please try again.')
    }
  }

  const handleRetry = () => {
    if (token) {
      setStatus('loading')
      setMessage('')
      verifyEmail(token)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MicroAI Systems</h1>
          <p className="text-gray-600 mt-2">Email Verification</p>
        </div>

        <Card className="p-8">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying your email...</h2>
              <p className="text-gray-600">Please wait while we verify your account.</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="inline-block mb-4">
                <div className="rounded-full bg-green-100 p-4">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm mb-2">
                  <strong>✅ Your account is now active!</strong>
                </p>
                <p className="text-green-700 text-sm">
                  Redirecting you to login in 3 seconds...
                </p>
              </div>

              <Button
                onClick={() => router.push('/client/login?verified=true')}
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              <div className="inline-block mb-4">
                <div className="rounded-full bg-red-100 p-4">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-900 font-semibold mb-2">Common issues:</p>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>• Link expired (valid for 72 hours)</li>
                  <li>• Email already verified</li>
                  <li>• Invalid or corrupted link</li>
                  <li>• Account no longer exists</li>
                </ul>
              </div>

              <div className="space-y-3">
                {token && (
                  <Button
                    onClick={handleRetry}
                    className="w-full"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                )}
                
                <Button
                  onClick={() => router.push('/contact')}
                  className="w-full"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-800 mb-2">
            If you're having trouble verifying your email:
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check if the link in your email is complete</li>
            <li>• Make sure you're using the latest verification email</li>
            <li>• Try copying the entire link and pasting it in your browser</li>
            <li>• Contact us at <a href="mailto:support@microai.systems" className="underline">support@microai.systems</a></li>
          </ul>
        </div>

        {/* Back to Main Site */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  )
}
