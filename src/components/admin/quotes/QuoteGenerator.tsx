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
import TemplateModal from './components/TemplateModal'

// Templates
import {
  pricingTemplates,
  milestoneTemplates,
  paymentTermTemplates,
  PricingTemplate,
  MilestoneTemplate,
  PaymentTermTemplate,
} from './templates'

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
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  // Template modals
  const [showPricingTemplates, setShowPricingTemplates] = useState(false)
  const [showMilestoneTemplates, setShowMilestoneTemplates] = useState(false)
  const [showPaymentTemplates, setShowPaymentTemplates] = useState(false)

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

  // Template Handlers
  const applyPricingTemplate = (template: PricingTemplate) => {
    const templateItems: QuoteItem[] = template.items.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      category: item.category,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount || 0,
      taxable: true,
    }))
    
    setQuoteData((prev) => ({
      ...prev,
      items: [...prev.items, ...templateItems],
      estimatedDuration: template.estimatedDuration || prev.estimatedDuration,
    }))
    
    setShowPricingTemplates(false)
    setSuccess(`Applied "${template.name}" template with ${template.items.length} items`)
    setTimeout(() => setSuccess(''), 3000)
  }

  const applyMilestoneTemplate = (template: MilestoneTemplate) => {
    const templateMilestones: Milestone[] = template.milestones.map((ms, index) => ({
      id: `milestone-${Date.now()}-${index}`,
      title: ms.title,
      description: ms.description,
      deliverables: ms.deliverables,
      duration: ms.duration,
      percentage: ms.percentage,
      dependencies: ms.dependencies || [],
    }))
    
    setQuoteData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, ...templateMilestones],
    }))
    
    setShowMilestoneTemplates(false)
    setSuccess(`Applied "${template.name}" template with ${template.milestones.length} milestones`)
    setTimeout(() => setSuccess(''), 3000)
  }

  const applyPaymentTemplate = (template: PaymentTermTemplate) => {
    const templateTerms: PaymentTerm[] = template.terms.map((term, index) => ({
      id: `payment-${Date.now()}-${index}`,
      title: term.title,
      percentage: term.percentage,
      dueDate: term.dueDate,
      milestoneId: term.milestoneId,
      description: term.description,
    }))
    
    setQuoteData((prev) => ({
      ...prev,
      paymentTerms: [...prev.paymentTerms, ...templateTerms],
    }))
    
    setShowPaymentTemplates(false)
    setSuccess(`Applied "${template.name}" template with ${template.terms.length} payment terms`)
    setTimeout(() => setSuccess(''), 3000)
  }

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('quote_draft', JSON.stringify(quoteData))
      setLastSaved(new Date())
    }, 3000) // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(saveTimer)
  }, [quoteData])

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('quote_draft')
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        setQuoteData(parsedDraft)
      } catch (err) {
        console.error('Failed to load draft:', err)
      }
    }
  }, [])

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
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {lastSaved && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Draft auto-saved at {lastSaved.toLocaleTimeString()}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">{/* Main Content */}
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
                    onUseTemplate={() => setShowPricingTemplates(true)}
                  />
                )}
                {currentStep === 4 && (
                  <Step4Timeline
                    quoteData={quoteData}
                    setQuoteData={setQuoteData}
                    addMilestone={addMilestone}
                    updateMilestone={updateMilestone}
                    removeMilestone={removeMilestone}
                    onUseTemplate={() => setShowMilestoneTemplates(true)}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Terms
                    quoteData={quoteData}
                    setQuoteData={setQuoteData}
                    addPaymentTerm={addPaymentTerm}
                    updatePaymentTerm={updatePaymentTerm}
                    removePaymentTerm={removePaymentTerm}
                    onUseTemplate={() => setShowPaymentTemplates(true)}
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

        {/* Template Modals */}
        {showPricingTemplates && (
          <TemplateModal
            type="pricing"
            onClose={() => setShowPricingTemplates(false)}
            onApply={applyPricingTemplate}
          />
        )}
        {showMilestoneTemplates && (
          <TemplateModal
            type="milestone"
            onClose={() => setShowMilestoneTemplates(false)}
            onApply={applyMilestoneTemplate}
          />
        )}
        {showPaymentTemplates && (
          <TemplateModal
            type="payment"
            onClose={() => setShowPaymentTemplates(false)}
            onApply={applyPaymentTemplate}
          />
        )}
      </div>
    </div>
  )
}
