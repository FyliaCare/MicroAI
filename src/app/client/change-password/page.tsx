'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    // Get session from localStorage
    const sessionStr = localStorage.getItem('clientSession')
    if (!sessionStr) {
      router.push('/client/login')
      return
    }

    try {
      const session = JSON.parse(sessionStr)
      setUserId(session.user.id)
      setUserName(session.user.name)
      setIsFirstLogin(session.user.mustChangePassword)
    } catch (err) {
      console.error('Session error:', err)
      router.push('/client/login')
    }
  }, [router])

  // Real-time password strength validation
  useEffect(() => {
    setPasswordStrength({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    })
  }, [newPassword])

  const isPasswordValid = Object.values(passwordStrength).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userId) {
      setError('Session expired. Please log in again.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (!isPasswordValid) {
      setError('Please meet all password requirements')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/client/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to change password')
        setIsLoading(false)
        return
      }

      if (data.success) {
        // Clear session and redirect to login
        localStorage.removeItem('clientSession')
        router.push('/client/login?passwordChanged=true')
      }
    } catch (err) {
      console.error('Password change error:', err)
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const getStrengthColor = (met: boolean) => {
    return met ? 'text-green-600' : 'text-gray-400'
  }

  const getStrengthIcon = (met: boolean) => {
    return met ? '✓' : '○'
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
            {userName && (
              <p className="text-gray-600 mt-1">Welcome, {userName}!</p>
            )}
          </div>

          {/* First Login Warning */}
          {isFirstLogin && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-900 font-semibold mb-1">🔒 Security Required</p>
              <p className="text-yellow-800 text-sm">
                For your security, you must change your password before accessing your account.
              </p>
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
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is the password from your welcome email
                </p>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <ul className="space-y-1 text-sm">
                    <li className={getStrengthColor(passwordStrength.length)}>
                      {getStrengthIcon(passwordStrength.length)} At least 8 characters
                    </li>
                    <li className={getStrengthColor(passwordStrength.uppercase)}>
                      {getStrengthIcon(passwordStrength.uppercase)} One uppercase letter (A-Z)
                    </li>
                    <li className={getStrengthColor(passwordStrength.lowercase)}>
                      {getStrengthIcon(passwordStrength.lowercase)} One lowercase letter (a-z)
                    </li>
                    <li className={getStrengthColor(passwordStrength.number)}>
                      {getStrengthIcon(passwordStrength.number)} One number (0-9)
                    </li>
                    <li className={getStrengthColor(passwordStrength.special)}>
                      {getStrengthIcon(passwordStrength.special)} One special character (!@#$%...)
                    </li>
                  </ul>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !isPasswordValid}
              >
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a href="mailto:support@microai.systems" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </Card>

        {/* Security Tips */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Password Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use a unique password for this account</li>
            <li>• Avoid common words or personal information</li>
            <li>• Consider using a password manager</li>
            <li>• Never share your password with anyone</li>
          </ul>
        </div>

        {/* Logout Option */}
        {!isFirstLogin && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                localStorage.removeItem('clientSession')
                router.push('/client/login')
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Cancel and Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
