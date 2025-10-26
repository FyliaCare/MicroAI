'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Quote {
  id: string
  quoteNumber: string
  title: string
  description?: string
  subtotal: number
  tax: number
  discount: number
  total: number
  status: string
  validUntil?: string
  client?: {
    id: string
    name: string
    email: string
  }
  project?: {
    id: string
    name: string
  }
  items: string
  createdAt: string
}

interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export default function QuotesManager() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    tax: '0',
    discount: '0',
    validUntil: '',
    notes: '',
    terms: 'Payment due within 30 days of acceptance.',
  })

  useEffect(() => {
    fetchQuotes()
    fetchClients()
  }, [])

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/admin/quotes')
      const data = await response.json()
      if (data.success) {
        setQuotes(data.quotes)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      const data = await response.json()
      if (data.success) {
        setClients(data.clients)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = parseFloat(formData.tax) || 0
    const discount = parseFloat(formData.discount) || 0
    return subtotal + tax - discount
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...lineItems]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity
      const rate = field === 'rate' ? Number(value) : newItems[index].rate
      newItems[index].amount = quantity * rate
    }
    
    setLineItems(newItems)
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }])
  }

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const subtotal = calculateSubtotal()
    const total = calculateTotal()

    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: lineItems,
          subtotal,
          total,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        setShowModal(false)
        resetForm()
        fetchQuotes()
      } else {
        alert(data.error || 'Failed to create quote')
      }
    } catch (error) {
      console.error('Error creating quote:', error)
      alert('Failed to create quote')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      clientId: '',
      tax: '0',
      discount: '0',
      validUntil: '',
      notes: '',
      terms: 'Payment due within 30 days of acceptance.',
    })
    setLineItems([{ description: '', quantity: 1, rate: 0, amount: 0 }])
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-orange-100 text-orange-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
            <p className="text-gray-600 mt-1">{quotes.length} total quotes</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
          >
            + Create Quote
          </Button>
        </div>
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        {quotes.map((quote) => {
          const items = JSON.parse(quote.items) as LineItem[]
          
          return (
            <div key={quote.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{quote.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <span className="font-medium">{quote.quoteNumber}</span>
                    </div>
                    
                    {quote.client && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{quote.client.name}</span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {quote.description && (
                    <p className="text-sm text-gray-700 mt-2">{quote.description}</p>
                  )}
                  
                  {/* Items Preview */}
                  <div className="mt-3 space-y-1">
                    {items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-600">
                        • {item.description} - ${item.amount.toLocaleString()}
                      </div>
                    ))}
                    {items.length > 2 && (
                      <div className="text-sm text-gray-500">+ {items.length - 2} more items</div>
                    )}
                  </div>
                </div>

                <div className="lg:text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ${quote.total.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Subtotal: ${quote.subtotal.toLocaleString()}
                  </div>
                  {quote.tax > 0 && (
                    <div className="text-sm text-gray-600">Tax: ${quote.tax.toLocaleString()}</div>
                  )}
                  {quote.discount > 0 && (
                    <div className="text-sm text-green-600">Discount: -${quote.discount.toLocaleString()}</div>
                  )}
                  {quote.validUntil && (
                    <div className="text-xs text-gray-500 mt-2">
                      Valid until: {new Date(quote.validUntil).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {quotes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No quotes found</p>
          <Button onClick={() => setShowModal(true)}>Create Your First Quote</Button>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          resetForm()
        }}
        title="Create New Quote"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Quote Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company && `(${client.company})`}
                </option>
              ))}
            </select>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Line Items
              </label>
              <button
                type="button"
                onClick={addLineItem}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      required
                    />
                  </div>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="1"
                    required
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateLineItem(index, 'rate', e.target.value)}
                    placeholder="Rate"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    min="0"
                    step="0.01"
                    required
                  />
                  <div className="w-24 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
                    ${item.amount.toFixed(2)}
                  </div>
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-2 bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Tax ($)"
                  type="number"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                  step="0.01"
                  min="0"
                />
                <Input
                  label="Discount ($)"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Input
            label="Valid Until"
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
          />

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
          />

          <Textarea
            label="Terms & Conditions"
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            rows={3}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Quote
            </Button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
