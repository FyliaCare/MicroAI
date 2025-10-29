'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import QuoteGenerator from '@/components/admin/quotes/QuoteGenerator'

export default function EditQuotePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const quoteId = params.id as string

  useEffect(() => {
    // Verify quote exists and load it
    const loadQuote = async () => {
      try {
        const res = await fetch(`/api/admin/quotes/${quoteId}`)
        if (!res.ok) {
          setError('Quote not found')
          setTimeout(() => router.push('/admin/quotes'), 2000)
        }
      } catch (err) {
        setError('Failed to load quote')
        setTimeout(() => router.push('/admin/quotes'), 2000)
      } finally {
        setLoading(false)
      }
    }

    if (quoteId) {
      loadQuote()
    }
  }, [quoteId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading quote...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{error}</h2>
          <p className="text-slate-600">Redirecting to quotes list...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <QuoteGenerator editMode quoteId={quoteId} />
    </div>
  )
}
