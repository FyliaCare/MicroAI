'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Receipt {
  receiptNumber: string
  quoteId: string
  clientName: string
  projectName: string
  amountPaid: number
  paymentMethod: string
  paymentDate: string
  transactionId: string
  notes: string
}

function NewReceiptContent() {
  const searchParams = useSearchParams()
  const quoteId = searchParams.get('quoteId')
  
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState<any>(null)
  const [companyProfile, setCompanyProfile] = useState({
    name: 'MicroAI',
    email: 'contact@microai.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    website: 'https://microai.com',
    logo: ''
  })

  const [receiptData, setReceiptData] = useState({
    receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
    paymentMethod: 'Bank Transfer',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    notes: 'Thank you for your payment!'
  })

  useEffect(() => {
    loadCompanyProfile()
    if (quoteId) {
      fetchQuote(quoteId)
    }
  }, [quoteId])

  const loadCompanyProfile = () => {
    try {
      const savedProfile = localStorage.getItem('companyProfile')
      if (savedProfile) {
        setCompanyProfile(JSON.parse(savedProfile))
      }
    } catch (err) {
      console.error('Error loading company profile:', err)
    }
  }

  const fetchQuote = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/quotes/${id}`)
      const data = await response.json()
      if (data.success) {
        setQuote(data.quote)
      }
    } catch (error) {
      console.error('Error fetching quote:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSaveReceipt = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...receiptData,
          quoteId,
          clientId: quote?.clientId,
          projectName: quote?.projectName,
          amountPaid: quote?.totalAmount
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Receipt saved successfully!')
        window.location.href = '/admin/receipts'
      } else {
        alert('Failed to save receipt')
      }
    } catch (error) {
      console.error('Error saving receipt:', error)
      alert('Failed to save receipt')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="p-8 text-center">
              <p className="text-gray-600">Quote not found</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with Actions */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generate Receipt</h1>
            <p className="text-gray-600 mt-1">For Quote #{quote.quoteNumber}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => window.history.back()} className="bg-gray-600 hover:bg-gray-700">
              ← Back
            </Button>
            <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-700">
              🖨️ Print/PDF
            </Button>
            <Button onClick={handleSaveReceipt} disabled={loading}>
              💾 Save Receipt
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: Receipt Details Form */}
          <div className="print:hidden">
            <Card>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Receipt Details</h2>
                
                <Input
                  label="Receipt Number"
                  value={receiptData.receiptNumber}
                  onChange={(e) => setReceiptData({ ...receiptData, receiptNumber: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={receiptData.paymentMethod}
                    onChange={(e) => setReceiptData({ ...receiptData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Bank Transfer</option>
                    <option>Credit Card</option>
                    <option>PayPal</option>
                    <option>Check</option>
                    <option>Cash</option>
                    <option>Crypto</option>
                  </select>
                </div>

                <Input
                  label="Payment Date"
                  type="date"
                  value={receiptData.paymentDate}
                  onChange={(e) => setReceiptData({ ...receiptData, paymentDate: e.target.value })}
                />

                <Input
                  label="Transaction ID"
                  value={receiptData.transactionId}
                  onChange={(e) => setReceiptData({ ...receiptData, transactionId: e.target.value })}
                  placeholder="TXN123456789"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={receiptData.notes}
                    onChange={(e) => setReceiptData({ ...receiptData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Receipt Preview */}
          <div className="col-span-2">
            <Card>
              <div className="p-8 bg-white">
                {/* Receipt Header */}
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                  {companyProfile.logo && (
                    <img 
                      src={companyProfile.logo} 
                      alt={companyProfile.name}
                      className="h-20 w-auto mx-auto mb-4"
                    />
                  )}
                  <h1 className="text-4xl font-bold text-blue-600 mb-2">{companyProfile.name}</h1>
                  <p className="text-sm text-gray-600">{companyProfile.address}</p>
                  <p className="text-sm text-gray-600">{companyProfile.email} | {companyProfile.phone}</p>
                </div>

                {/* Receipt Title */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">PAYMENT RECEIPT</h2>
                  <p className="text-lg text-gray-600">Receipt #{receiptData.receiptNumber}</p>
                </div>

                {/* Receipt Info */}
                <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Receipt Date:</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(receiptData.paymentDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method:</p>
                    <p className="font-semibold text-gray-900">{receiptData.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Quote Reference:</p>
                    <p className="font-semibold text-gray-900">{quote.quoteNumber}</p>
                  </div>
                  {receiptData.transactionId && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Transaction ID:</p>
                      <p className="font-semibold text-gray-900">{receiptData.transactionId}</p>
                    </div>
                  )}
                </div>

                {/* Client Info */}
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">Received From:</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">{quote.client?.name}</p>
                    {quote.client?.company && (
                      <p className="text-gray-600">{quote.client.company}</p>
                    )}
                    <p className="text-gray-600">{quote.client?.email}</p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">Payment Details:</h3>
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">Description</th>
                        <th className="text-right p-3 text-sm font-semibold text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-3 text-gray-900">{quote.projectName}</td>
                        <td className="p-3 text-right font-semibold text-gray-900">
                          ${(quote.totalAmount || 0).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-green-50">
                      <tr>
                        <td className="p-3 text-right font-bold text-lg text-gray-900">Total Amount Paid:</td>
                        <td className="p-3 text-right font-bold text-2xl text-green-700">
                          ${(quote.totalAmount || 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Notes */}
                {receiptData.notes && (
                  <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <p className="text-sm text-gray-700">{receiptData.notes}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center text-sm text-gray-600">
                  <p className="font-semibold mb-2">Thank you for your business!</p>
                  <p>This is an official receipt for payment received. Please keep for your records.</p>
                  <p className="mt-2">For questions, contact us at {companyProfile.email}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function NewReceiptPage() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center h-96'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div></div>}>
      <NewReceiptContent />
    </Suspense>
  )
}
