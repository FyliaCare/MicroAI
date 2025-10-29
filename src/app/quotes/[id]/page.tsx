'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SignatureModal from '@/components/quotes/SignatureModal'

interface Quote {
  id: string
  quoteNumber: string
  title: string
  description?: string
  status: string
  total: number
  currency: string
  validUntil: string
  createdAt: string
  issuedAt?: string
  
  // Company info
  companyName?: string
  companyEmail?: string
  companyPhone?: string
  companyAddress?: string
  companyWebsite?: string
  companyLogo?: string
  
  // Client info
  clientName?: string
  clientCompany?: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  
  // Project details
  projectType?: string
  
  // Scope
  scopeOfWork?: string
  exclusions?: string
  
  // Pricing
  pricingItems?: string
  subtotal?: number
  tax?: number
  discount?: number
  
  // Timeline
  timeline?: string
  estimatedHours?: number
  milestones?: string
  
  // Terms
  paymentTerms?: string
  assumptions?: string
  clientObligations?: string
  terms?: string
  
  // Signatures
  clientSignature?: string
  clientSignedAt?: string
  clientSignedBy?: string
}

export default function PublicQuotePage() {
  const params = useParams()
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [signatureModalOpen, setSignatureModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'accept' | 'reject'>('accept')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchQuote()
  }, [params.id])

  const fetchQuote = async () => {
    try {
      const res = await fetch(`/api/quotes/${params.id}`)
      const data = await res.json()
      
      if (data.success) {
        setQuote(data.quote)
        // Mark as viewed if not already
        if (data.quote.status === 'sent') {
          await fetch(`/api/quotes/${params.id}/view`, { method: 'POST' })
        }
      } else {
        setError(data.error || 'Quote not found')
      }
    } catch (err) {
      setError('Failed to load quote')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = () => {
    setActionType('accept')
    setSignatureModalOpen(true)
  }

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this quote?')) return
    
    setProcessing(true)
    try {
      const res = await fetch(`/api/quotes/${params.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      })

      const data = await res.json()
      if (data.success) {
        alert('Quote rejected. Thank you for your response.')
        fetchQuote()
      } else {
        alert(data.error || 'Failed to reject quote')
      }
    } catch (err) {
      alert('Failed to reject quote')
    } finally {
      setProcessing(false)
    }
  }

  const handleSignatureSubmit = async (signature: string, signerName: string) => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/quotes/${params.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accept',
          signature,
          signerName,
        }),
      })

      const data = await res.json()
      if (data.success) {
        alert('Quote accepted! Thank you for your business.')
        setSignatureModalOpen(false)
        fetchQuote()
      } else {
        alert(data.error || 'Failed to accept quote')
      }
    } catch (err) {
      alert('Failed to accept quote')
    } finally {
      setProcessing(false)
    }
  }

  const downloadPDF = async () => {
    try {
      const res = await fetch(`/api/quotes/${params.id}/pdf`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quote-${quote?.quoteNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert('Failed to download PDF')
    }
  }

  const parseJSON = (str?: string) => {
    if (!str) return []
    try {
      return JSON.parse(str)
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading quote...</p>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Quote Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error || 'The quote you are looking for does not exist or has been removed.'}
          </p>
          <Button onClick={() => router.push('/')} variant="primary">
            Go to Homepage
          </Button>
        </Card>
      </div>
    )
  }

  const scopeItems = parseJSON(quote.scopeOfWork)
  const exclusionItems = parseJSON(quote.exclusions)
  const pricingItems = parseJSON(quote.pricingItems)
  const milestones = parseJSON(quote.milestones)
  const isExpired = new Date(quote.validUntil) < new Date()
  const canRespond = ['sent', 'viewed'].includes(quote.status) && !isExpired

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {quote.companyLogo && (
            <img
              src={quote.companyLogo}
              alt={quote.companyName || 'Company'}
              className="h-16 mx-auto mb-4"
            />
          )}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {quote.companyName || 'Quote'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Quote #{quote.quoteNumber}
          </p>
        </div>

        {/* Status Banner */}
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Status: {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Valid until: {new Date(quote.validUntil).toLocaleDateString()}
                {isExpired && (
                  <span className="text-red-600 ml-2 font-semibold">(Expired)</span>
                )}
              </p>
            </div>
            <Button onClick={downloadPDF} variant="outline">
              📥 Download PDF
            </Button>
          </div>
        </Card>

        {/* Quote Details */}
        <Card className="mb-6 p-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {quote.title}
          </h2>
          {quote.description && (
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {quote.description}
            </p>
          )}
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">From:</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {quote.companyName}<br />
                {quote.companyEmail}<br />
                {quote.companyPhone}<br />
                {quote.companyAddress}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">To:</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {quote.clientName}<br />
                {quote.clientCompany && <>{quote.clientCompany}<br /></>}
                {quote.clientEmail}<br />
                {quote.clientPhone}
              </p>
            </div>
          </div>
        </Card>

        {/* Scope of Work */}
        {scopeItems.length > 0 && (
          <Card className="mb-6 p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Scope of Work
            </h3>
            <ul className="space-y-2">
              {scopeItems.map((item: any, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {typeof item === 'string' ? item : item.title || item.name}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Pricing */}
        <Card className="mb-6 p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Investment
          </h3>
          
          {pricingItems.length > 0 && (
            <div className="mb-4">
              {pricingItems.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300">
                    {item.category || item.description}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {quote.currency} {item.amount?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="border-t-2 border-slate-300 dark:border-slate-600 pt-4 mt-4">
            {quote.subtotal && (
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                <span className="text-slate-900 dark:text-white">
                  {quote.currency} {quote.subtotal.toLocaleString()}
                </span>
              </div>
            )}
            {quote.discount && quote.discount > 0 && (
              <div className="flex justify-between py-1 text-green-600">
                <span>Discount:</span>
                <span>-{quote.currency} {quote.discount.toLocaleString()}</span>
              </div>
            )}
            {quote.tax && quote.tax > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Tax:</span>
                <span className="text-slate-900 dark:text-white">
                  {quote.currency} {quote.tax.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t border-slate-200 dark:border-slate-700 mt-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">
                {quote.currency} {quote.total.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Milestones */}
        {milestones.length > 0 && (
          <Card className="mb-6 p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Project Timeline
            </h3>
            <div className="space-y-3">
              {milestones.map((milestone: any, idx: number) => (
                <div key={idx} className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {milestone.title || milestone.name}
                  </h4>
                  {milestone.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {milestone.description}
                    </p>
                  )}
                  {milestone.duration && (
                    <p className="text-sm text-slate-500 mt-1">
                      Duration: {milestone.duration} days
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Terms & Conditions */}
        {quote.terms && (
          <Card className="mb-6 p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Terms & Conditions
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {quote.terms}
            </div>
          </Card>
        )}

        {/* Signature Section */}
        {quote.clientSignature ? (
          <Card className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-4">
              <div className="text-green-500 text-3xl">✓</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">
                  Quote Accepted
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                  Signed by {quote.clientSignedBy} on{' '}
                  {new Date(quote.clientSignedAt!).toLocaleString()}
                </p>
                <div className="bg-white dark:bg-slate-800 p-3 rounded border border-green-200 dark:border-green-700">
                  <img
                    src={quote.clientSignature}
                    alt="Signature"
                    className="max-h-20"
                  />
                </div>
              </div>
            </div>
          </Card>
        ) : canRespond ? (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Your Response
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please review the quote and let us know your decision.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleAccept}
                variant="primary"
                className="flex-1"
                disabled={processing}
              >
                ✓ Accept Quote
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                disabled={processing}
              >
                ✗ Reject Quote
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-center text-slate-600 dark:text-slate-400">
              {isExpired
                ? 'This quote has expired. Please contact us for a new quote.'
                : 'This quote has already been responded to.'}
            </p>
          </Card>
        )}
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
        onSubmit={handleSignatureSubmit}
        disabled={processing}
      />
    </div>
  )
}
