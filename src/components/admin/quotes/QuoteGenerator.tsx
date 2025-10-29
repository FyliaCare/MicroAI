'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// Types
import { QuoteData, QuoteItem, Milestone, PaymentTerm, Client } from './types'

// Utils
import {
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  generateQuoteNumber,
  getDefaultValidUntil,
} from './utils'

// Components
import ProgressTracker from './components/ProgressTracker'
import QuoteSummary from './components/QuoteSummary'

// Steps
import Step1BasicInfo from './steps/Step1BasicInfo'
import Step2Scope from './steps/Step2Scope'
import Step3Pricing from './steps/Step3Pricing'
import Step4Timeline from './steps/Step4Timeline'
import Step5Terms from './steps/Step5Terms'
import Step6Review from './steps/Step6Review'

export default function QuoteGenerator() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6

  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [quoteData, setQuoteData] = useState<QuoteData>({
    title: '',
    quoteNumber: generateQuoteNumber(),
    clientId: '',
    projectType: '',
    industry: '',
    validUntil: getDefaultValidUntil(30),
    internalNotes: '',
    executiveSummary: '',
    objectives: [],
    scope: [],
    outOfScope: [],
    assumptions: [],
    constraints: [],
    items: [],
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 0,
    currency: 'USD',
    startDate: '',
    estimatedDuration: 0,
    milestones: [],
    criticalPath: [],
    paymentTerms: [],
    lateFeePercentage: 0,
    earlyPaymentDiscount: 0,
    acceptedPaymentMethods: [],
    termsAndConditions: '',
    warranties: '',
    supportTerms: '',
    brandColor: '#667eea',
    includeCompanyLogo: true,
    includePortfolio: false,
    includeTestimonials: false,
    customCoverMessage: '',
    footerText: '',
  })

  // Load clients
  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients || [])
      }
    } catch (err) {
      console.error('Failed to load clients:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculations
  const subtotal = calculateSubtotal(quoteData.items)
  const discount = calculateDiscount(
    subtotal,
    quoteData.discountType,
    quoteData.discountValue
  )
  const tax = calculateTax(subtotal, discount, quoteData.taxRate)
  const total = calculateTotal(subtotal, discount, tax)

  // Item Management
  const addItem = () => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}`,
      category: 'custom',
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxable: true,
    }
    setQuoteData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setQuoteData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  const removeItem = (id: string) => {
    setQuoteData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  // Milestone Management
  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      description: '',
      deliverables: [],
      duration: 0,
      percentage: 0,
      dependencies: [],
    }
    setQuoteData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone],
    }))
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    setQuoteData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone
      ),
    }))
  }

  const removeMilestone = (id: string) => {
    setQuoteData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((milestone) => milestone.id !== id),
    }))
  }

  // Payment Term Management
  const addPaymentTerm = () => {
    const newTerm: PaymentTerm = {
      id: `payment-${Date.now()}`,
      title: '',
      percentage: 0,
      dueDate: 'net30',
    }
    setQuoteData((prev) => ({
      ...prev,
      paymentTerms: [...prev.paymentTerms, newTerm],
    }))
  }

  const updatePaymentTerm = (id: string, field: keyof PaymentTerm, value: any) => {
    setQuoteData((prev) => ({
      ...prev,
      paymentTerms: prev.paymentTerms.map((term) =>
        term.id === id ? { ...term, [field]: value } : term
      ),
    }))
  }

  const removePaymentTerm = (id: string) => {
    setQuoteData((prev) => ({
      ...prev,
      paymentTerms: prev.paymentTerms.filter((term) => term.id !== id),
    }))
  }

  // Form Submission
  const handleSubmit = async () => {
    try {
      setSaving(true)
      setError('')

      const payload = {
        ...quoteData,
        subtotal,
        discount,
        tax,
        total,
        status: 'draft',
      }

      const res = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create quote')
      }

      const data = await res.json()
      setSuccess('Quote created successfully!')
      localStorage.removeItem('quote_draft')

      setTimeout(() => {
        window.location.href = '/admin/quotes'
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to create quote')
    } finally {
      setSaving(false)
    }
  }

  // Wizard Navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Create Professional Quote
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Build comprehensive quotes with our advanced wizard
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <Card className="mb-8 p-6">
          <ProgressTracker
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepClick={goToStep}
          />
        </Card>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <Step1BasicInfo
                    quoteData={quoteData}
                    setQuoteData={setQuoteData}
                    clients={clients}
                  />
                )}
                {currentStep === 2 && (
                  <Step2Scope quoteData={quoteData} setQuoteData={setQuoteData} />
                )}
                {currentStep === 3 && (
                  <Step3Pricing
                    quoteData={quoteData}
                    setQuoteData={setQuoteData}
                    addItem={addItem}
                    updateItem={updateItem}
                    removeItem={removeItem}
                    subtotal={subtotal}
                  />
                )}
                {currentStep === 4 && (
                  <Step4Timeline
                    quoteData={quoteData}
                    setQuoteData={setQuoteData}
                    addMilestone={addMilestone}
                    updateMilestone={updateMilestone}
                    removeMilestone={removeMilestone}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Terms
                    quoteData={quoteData}
                    setQuoteData={setQuoteData}
                    addPaymentTerm={addPaymentTerm}
                    updatePaymentTerm={updatePaymentTerm}
                    removePaymentTerm={removePaymentTerm}
                  />
                )}
                {currentStep === 6 && (
                  <Step6Review
                    quoteData={quoteData}
                    subtotal={subtotal}
                    discount={discount}
                    tax={tax}
                    total={total}
                    clients={clients}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6"
              >
                ← Previous
              </Button>
              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="px-8">
                  Next →
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {saving ? 'Creating...' : '✨ Create Quote'}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <QuoteSummary
              quoteData={quoteData}
              subtotal={subtotal}
              discount={discount}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
