// ============================================================================
// QUOTE BUILDER - Advanced Multi-Step Wizard
// Professional quote creation with live preview
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import type { Quote, QuoteFormData, QuoteLineItem, QuoteMilestone } from '@/types/quote'
import QuotePDFPreview from '@/components/quotes/QuotePDFPreview'
import {
  FileText,
  User,
  ListCheck,
  DollarSign,
  Calendar,
  FileCheck,
  Palette,
  Send,
  Save,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Eye,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// ============================================================================
// STEP DEFINITIONS
// ============================================================================

const STEPS = [
  { id: 1, name: 'Basic Info', icon: FileText, description: 'Project details' },
  { id: 2, name: 'Client', icon: User, description: 'Client information' },
  { id: 3, name: 'Scope', icon: ListCheck, description: 'Project scope & timeline' },
  { id: 4, name: 'Pricing', icon: DollarSign, description: 'Line items & costs' },
  { id: 5, name: 'Milestones', icon: Calendar, description: 'Payment schedule' },
  { id: 6, name: 'Terms', icon: FileCheck, description: 'Terms & conditions' },
  { id: 7, name: 'Branding', icon: Palette, description: 'Customization' },
  { id: 8, name: 'Review', icon: Eye, description: 'Review & send' },
]

// ============================================================================
// DEFAULT FORM DATA
// ============================================================================

const getInitialFormData = (): QuoteFormData => ({
  // Step 1
  title: '',
  description: '',
  category: 'web-dev',
  projectType: 'Full Stack Web Application',
  industry: '',
  
  // Step 2
  clientId: '',
  clientName: '',
  clientEmail: '',
  clientCompany: '',
  clientPhone: '',
  clientAddress: '',
  contactPerson: '',
  
  // Step 3
  scopeSummary: '',
  objectives: [],
  deliverables: [],
  exclusions: [],
  assumptions: [],
  estimatedHours: 0,
  timeline: '8-12 weeks',
  techStack: [],
  
  // Step 4
  items: [],
  currency: 'USD',
  taxRate: 0,
  discountType: 'fixed',
  discount: 0,
  setupFee: 0,
  developmentCost: 0,
  designCost: 0,
  monthlyHosting: 0,
  monthlyMaintenance: 0,
  
  // Step 5
  milestones: [],
  depositPercent: 30,
  paymentTerms: 'Net 30',
  acceptedPaymentMethods: ['Bank Transfer', 'Credit Card'],
  
  // Step 6
  warrantyTerms: '90 days from delivery',
  supportTerms: 'Email support for 3 months',
  revisionPolicy: '2 rounds of revisions included',
  cancellationPolicy: 'Cancel anytime with 14 days notice',
  ipRights: 'Client owns all IP upon full payment',
  confidentialityClause: 'All project details remain confidential',
  freeSupportMonths: 3,
  includedRevisions: 2,
  revisionCost: 500,
  
  // Step 7
  brandColor: '#4F46E5',
  customMessage: '',
  footerText: '',
  includeLogo: true,
  includePortfolio: false,
  templateStyle: 'modern',
  
  // Step 8
  validityDays: 30,
  notes: '',
  internalNotes: '',
  status: 'draft',
})

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function QuoteBuilder({ quoteId }: { quoteId?: string }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<QuoteFormData>(getInitialFormData())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [clients, setClients] = useState<any[]>([])

  // Load existing quote if editing
  useEffect(() => {
    if (quoteId) {
      loadQuote(quoteId)
    }
    loadClients()
  }, [quoteId])

  const loadQuote = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/quotes/${id}`)
      const data = await res.json()
      if (data.success && data.quote) {
        // Map quote data to form data
        setFormData(mapQuoteToForm(data.quote))
      }
    } catch (error) {
      console.error('Error loading quote:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadClients = async () => {
    try {
      const res = await fetch('/api/admin/clients')
      const data = await res.json()
      if (data.success) {
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error('Error loading clients:', error)
    }
  }

  const mapQuoteToForm = (quote: any): QuoteFormData => {
    // Parse JSON fields
    const parseJSON = (str: string | null) => {
      if (!str) return []
      try {
        return JSON.parse(str)
      } catch {
        return []
      }
    }

    const items = parseJSON(quote.items)
    const milestones = parseJSON(quote.milestones)
    const scope = parseJSON(quote.scopeOfWork) || {}
    const techStack = parseJSON(quote.techStack)

    return {
      title: quote.title || '',
      description: quote.description || '',
      category: quote.category || 'web-dev',
      projectType: quote.projectType || '',
      industry: quote.industry || '',
      
      clientId: quote.clientId || '',
      clientName: quote.clientName || '',
      clientEmail: quote.clientEmail || '',
      clientCompany: quote.clientCompany || '',
      clientPhone: quote.clientPhone || '',
      clientAddress: quote.clientAddress || '',
      contactPerson: quote.contactPerson || '',
      
      scopeSummary: scope.summary || '',
      objectives: scope.objectives || [],
      deliverables: scope.deliverables || [],
      exclusions: scope.exclusions || [],
      assumptions: scope.assumptions || [],
      estimatedHours: quote.estimatedHours || 0,
      timeline: quote.timeline || '',
      techStack,
      
      items,
      currency: quote.currency || 'USD',
      taxRate: quote.taxRate || 0,
      discountType: quote.discountType || 'fixed',
      discount: quote.discount || 0,
      setupFee: quote.setupFee || 0,
      developmentCost: quote.developmentCost || 0,
      designCost: quote.designCost || 0,
      monthlyHosting: quote.monthlyHosting || 0,
      monthlyMaintenance: quote.monthlyMaintenance || 0,
      
      milestones,
      depositPercent: quote.depositPercent || 30,
      paymentTerms: quote.paymentTerms || 'Net 30',
      acceptedPaymentMethods: ['Bank Transfer', 'Credit Card'],
      
      warrantyTerms: quote.warrantyTerms || '',
      supportTerms: quote.supportTerms || '',
      revisionPolicy: quote.revisionsPolicy || '',
      cancellationPolicy: quote.cancellationPolicy || '',
      ipRights: quote.ipRights || '',
      confidentialityClause: quote.confidentialityClause || '',
      freeSupportMonths: quote.freeSupportMonths || 3,
      includedRevisions: quote.includedRevisions || 2,
      revisionCost: quote.revisionCost || 500,
      
      brandColor: quote.brandColor || '#4F46E5',
      customMessage: quote.customMessage || '',
      footerText: quote.footerText || '',
      includeLogo: true,
      includePortfolio: false,
      templateStyle: quote.templateStyle || 'modern',
      
      validityDays: quote.validityDays || 30,
      notes: quote.notes || '',
      internalNotes: quote.internalNotes || '',
      status: quote.status || 'draft',
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
    const discountAmount = formData.discountType === 'percentage' 
      ? (subtotal * formData.discount) / 100
      : formData.discount
    const afterDiscount = subtotal - discountAmount
    const tax = (afterDiscount * formData.taxRate) / 100
    const total = afterDiscount + tax

    return { subtotal, tax, total, discountAmount }
  }

  const convertFormToQuote = (): any => {
    const { subtotal, tax, total } = calculateTotals()
    
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + formData.validityDays)

    return {
      quoteNumber: quoteId ? undefined : `QT-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      projectType: formData.projectType,
      industry: formData.industry,
      
      clientId: formData.clientId || null,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientCompany: formData.clientCompany,
      clientPhone: formData.clientPhone,
      clientAddress: formData.clientAddress,
      contactPerson: formData.contactPerson,
      
      scopeOfWork: JSON.stringify({
        summary: formData.scopeSummary,
        objectives: formData.objectives,
        deliverables: formData.deliverables,
        exclusions: formData.exclusions,
        assumptions: formData.assumptions,
      }),
      estimatedHours: formData.estimatedHours,
      timeline: formData.timeline,
      techStack: JSON.stringify(formData.techStack),
      
      items: JSON.stringify(formData.items),
      currency: formData.currency,
      subtotal,
      taxRate: formData.taxRate,
      tax,
      discountType: formData.discountType,
      discount: formData.discount,
      total,
      
      setupFee: formData.setupFee,
      developmentCost: formData.developmentCost,
      designCost: formData.designCost,
      monthlyHosting: formData.monthlyHosting,
      monthlyMaintenance: formData.monthlyMaintenance,
      
      milestones: JSON.stringify(formData.milestones),
      depositPercent: formData.depositPercent,
      paymentTerms: formData.paymentTerms,
      
      terms: JSON.stringify({
        payment: formData.paymentTerms,
        warranty: formData.warrantyTerms,
        support: formData.supportTerms,
        revisions: formData.revisionPolicy,
        cancellation: formData.cancellationPolicy,
        intellectualProperty: formData.ipRights,
        confidentiality: formData.confidentialityClause,
      }),
      
      warrantyTerms: formData.warrantyTerms,
      freeSupportMonths: formData.freeSupportMonths,
      includedRevisions: formData.includedRevisions,
      revisionCost: formData.revisionCost,
      revisionsPolicy: formData.revisionPolicy,
      ipRights: formData.ipRights,
      confidentialityClause: formData.confidentialityClause,
      
      brandColor: formData.brandColor,
      customMessage: formData.customMessage,
      footerText: formData.footerText,
      templateStyle: formData.templateStyle,
      
      validityDays: formData.validityDays,
      validUntil,
      notes: formData.notes,
      internalNotes: formData.internalNotes,
      status: formData.status,
    }
  }

  const handleSave = async (asDraft = true) => {
    setSaving(true)
    try {
      const quoteData = convertFormToQuote()
      quoteData.status = asDraft ? 'draft' : 'sent'

      const url = quoteId ? `/api/admin/quotes/${quoteId}` : '/api/admin/quotes'
      const method = quoteId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
      })

      const data = await res.json()

      if (data.success) {
        alert(`Quote ${asDraft ? 'saved' : 'created and sent'} successfully!`)
        router.push('/admin/quotes')
      } else {
        alert(`Error: ${data.error || 'Failed to save quote'}`)
      }
    } catch (error) {
      console.error('Error saving quote:', error)
      alert('Failed to save quote')
    } finally {
      setSaving(false)
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-lg">Loading quote...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {quoteId ? 'Edit Quote' : 'Create New Quote'}
          </h1>
          <p className="mt-2 text-slate-600">
            Follow the steps below to create a professional quote
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const Icon = step.icon

              return (
                <div key={step.id} className="flex-1 relative">
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`w-full flex flex-col items-center gap-2 transition-all ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-sm font-medium ${
                          isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-slate-400'
                        }`}
                      >
                        {step.name}
                      </p>
                      <p className="text-xs text-slate-500 hidden sm:block">{step.description}</p>
                    </div>
                  </button>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`absolute top-6 left-1/2 w-full h-0.5 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-slate-200'
                      }`}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {/* Step Content Goes Here - Import individual step components */}
              <StepContent
                step={currentStep}
                formData={formData}
                updateFormData={updateFormData}
                clients={clients}
              />

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>

                  {currentStep < STEPS.length ? (
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSave(false)}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {saving ? 'Creating...' : 'Create Quote'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quote Summary</h3>
                
                <QuoteSummaryCard formData={formData} calculateTotals={calculateTotals} />

                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Hide' : 'Show'} PDF Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full PDF Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Quote Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                {/* Preview component will go here */}
                <p className="text-slate-600">PDF Preview will render here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// STEP CONTENT ROUTER
// ============================================================================

function StepContent({
  step,
  formData,
  updateFormData,
  clients,
}: {
  step: number
  formData: QuoteFormData
  updateFormData: (field: string, value: any) => void
  clients: any[]
}) {
  // Each step will be a separate component for better organization
  // For now, showing placeholders
  
  switch (step) {
    case 1:
      return <Step1BasicInfo formData={formData} updateFormData={updateFormData} />
    case 2:
      return <Step2Client formData={formData} updateFormData={updateFormData} clients={clients} />
    case 3:
      return <Step3Scope formData={formData} updateFormData={updateFormData} />
    case 4:
      return <Step4Pricing formData={formData} updateFormData={updateFormData} />
    case 5:
      return <Step5Milestones formData={formData} updateFormData={updateFormData} />
    case 6:
      return <Step6Terms formData={formData} updateFormData={updateFormData} />
    case 7:
      return <Step7Branding formData={formData} updateFormData={updateFormData} />
    case 8:
      return <Step8Review formData={formData} />
    default:
      return null
  }
}

// ============================================================================
// INDIVIDUAL STEP COMPONENTS (Placeholders - will create full versions)
// ============================================================================

function Step1BasicInfo({
  formData,
  updateFormData,
}: {
  formData: QuoteFormData
  updateFormData: (field: string, value: any) => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
      <p className="text-slate-600">Start by providing the basic details of your quote</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Quote Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="e.g., E-Commerce Website Development"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Brief overview of the project..."
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => updateFormData('category', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="web-dev">Web Development</option>
            <option value="mobile-app">Mobile App</option>
            <option value="saas">SaaS Platform</option>
            <option value="consulting">Consulting</option>
            <option value="design">Design</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Industry
          </label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => updateFormData('industry', e.target.value)}
            placeholder="e.g., E-Commerce, Healthcare"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}

// Placeholder components for other steps
function Step2Client({ formData, updateFormData, clients }: any) {
  return <div className="p-4">Step 2: Client Selection - Component to be implemented</div>
}

function Step3Scope({ formData, updateFormData }: any) {
  return <div className="p-4">Step 3: Scope & Timeline - Component to be implemented</div>
}

function Step4Pricing({ formData, updateFormData }: any) {
  return <div className="p-4">Step 4: Pricing & Line Items - Component to be implemented</div>
}

function Step5Milestones({ formData, updateFormData }: any) {
  return <div className="p-4">Step 5: Milestones & Payment - Component to be implemented</div>
}

function Step6Terms({ formData, updateFormData }: any) {
  return <div className="p-4">Step 6: Terms & Conditions - Component to be implemented</div>
}

function Step7Branding({ formData, updateFormData }: any) {
  return <div className="p-4">Step 7: Branding & Customization - Component to be implemented</div>
}

function Step8Review({ formData }: any) {
  return <div className="p-4">Step 8: Review & Send - Component to be implemented</div>
}

// ============================================================================
// QUOTE SUMMARY CARD
// ============================================================================

function QuoteSummaryCard({
  formData,
  calculateTotals,
}: {
  formData: QuoteFormData
  calculateTotals: () => { subtotal: number; tax: number; total: number; discountAmount: number }
}) {
  const { subtotal, tax, total, discountAmount } = calculateTotals()

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">Items:</span>
        <span className="font-medium">{formData.items.length}</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">Subtotal:</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Discount:</span>
          <span className="font-medium text-green-600">-${discountAmount.toFixed(2)}</span>
        </div>
      )}

      {tax > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Tax ({formData.taxRate}%):</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
      )}

      <div className="pt-3 border-t border-slate-200">
        <div className="flex justify-between">
          <span className="text-lg font-semibold text-slate-900">Total:</span>
          <span className="text-lg font-bold text-indigo-600">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
