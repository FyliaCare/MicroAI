'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function ClientLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    // Check for success messages from verification
    const verified = searchParams.get('verified')
    const passwordChanged = searchParams.get('passwordChanged')
    
    if (verified === 'true') {
      setSuccessMessage('✅ Email verified successfully! You can now log in.')
    } else if (passwordChanged === 'true') {
      setSuccessMessage('✅ Password changed successfully! Please log in with your new password.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/client/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      if (data.success) {
        // Store session
        localStorage.setItem('clientSession', JSON.stringify({
          token: data.session.token,
          expiresAt: data.session.expiresAt,
          user: data.user,
        }))

        // Redirect based on mustChangePassword
        if (data.user.mustChangePassword) {
          router.push('/client/change-password')
        } else {
          router.push('/client/dashboard')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MicroAI Systems</h1>
          <p className="text-gray-600 mt-2">Client Portal</p>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>

          {/* Help Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              First time logging in?{' '}
              <span className="text-blue-600 font-medium">Check your email for credentials</span>
            </p>
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a href="mailto:support@microai.systems" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </Card>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">📧 New Account?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check your email for login credentials</li>
            <li>• Verify your email using the link provided</li>
            <li>• You'll be asked to change your password on first login</li>
            <li>• Accounts expire in 30 days if not verified</li>
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
