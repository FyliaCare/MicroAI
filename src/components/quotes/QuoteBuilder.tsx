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
  X,
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
    // Validate current step before proceeding
    const errors = validateStep(currentStep, formData)
    if (errors.length > 0) {
      alert(`Please fix the following errors:\n\n${errors.join('\n')}`)
      return
    }
    
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

  // Validation function
  const validateStep = (step: number, data: QuoteFormData): string[] => {
    const errors: string[] = []

    switch (step) {
      case 1: // Basic Info
        if (!data.title?.trim()) errors.push('• Quote title is required')
        if (!data.category) errors.push('• Category is required')
        break

      case 2: // Client
        if (!data.clientName?.trim()) errors.push('• Client name is required')
        if (!data.clientEmail?.trim()) errors.push('• Client email is required')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) {
          errors.push('• Valid client email is required')
        }
        break

      case 3: // Scope
        if (!data.scopeSummary?.trim()) errors.push('• Scope summary is required')
        if (data.deliverables.length === 0) errors.push('• At least one deliverable is required')
        break

      case 4: // Pricing
        if (data.items.length === 0) errors.push('• At least one line item is required')
        else {
          const invalidItems = data.items.filter(item => !item.description?.trim() || (item.unitPrice || 0) <= 0)
          if (invalidItems.length > 0) {
            errors.push('• All line items must have a description and unit price greater than 0')
          }
        }
        break

      case 5: // Milestones
        if (data.milestones.length > 0) {
          const invalidMilestones = data.milestones.filter(m => !m.name?.trim() || m.amount <= 0)
          if (invalidMilestones.length > 0) {
            errors.push('• All milestones must have a name and amount greater than 0')
          }
        }
        if (!data.paymentTerms) errors.push('• Payment terms are required')
        break

      case 6: // Terms
        // Optional validation - could add warnings if certain terms are missing
        break

      case 7: // Branding
        if (!data.brandColor) errors.push('• Brand color is required')
        if (!data.templateStyle) errors.push('• Template style is required')
        break

      case 8: // Review
        // Final validation before submission
        break
    }

    return errors
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

// Step 2: Client Information Component
function Step2Client({ formData, updateFormData, clients }: any) {
  const [useExistingClient, setUseExistingClient] = useState(!!formData.clientId)

  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c: any) => c.id === clientId)
    if (client) {
      updateFormData('clientId', client.id)
      updateFormData('clientName', client.name)
      updateFormData('clientEmail', client.email)
      updateFormData('clientCompany', client.company || '')
      updateFormData('clientPhone', client.phone || '')
      updateFormData('clientAddress', client.address || '')
      updateFormData('contactPerson', client.contactPerson || '')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Client Information</h2>
        <p className="text-slate-600 mt-2">Select an existing client or add a new one</p>
      </div>

      {/* Client Selection Toggle */}
      <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
        <button
          onClick={() => {
            setUseExistingClient(true)
            if (clients.length > 0) {
              handleClientSelect(clients[0].id)
            }
          }}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            useExistingClient
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <User className="w-5 h-5 inline-block mr-2" />
          Existing Client
        </button>
        <button
          onClick={() => {
            setUseExistingClient(false)
            updateFormData('clientId', '')
          }}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            !useExistingClient
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-5 h-5 inline-block mr-2" />
          New Client
        </button>
      </div>

      {/* Existing Client Selection */}
      {useExistingClient && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Client *
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => handleClientSelect(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Choose a client...</option>
            {clients.map((client: any) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.company ? `(${client.company})` : ''} - {client.email}
              </option>
            ))}
          </select>
          {clients.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              No clients found. Switch to &quot;New Client&quot; to add one.
            </p>
          )}
        </div>
      )}

      {/* New Client Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Client Name *
          </label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => updateFormData('clientName', e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
            disabled={useExistingClient && !!formData.clientId}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.clientEmail}
            onChange={(e) => updateFormData('clientEmail', e.target.value)}
            placeholder="john@example.com"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
            disabled={useExistingClient && !!formData.clientId}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.clientPhone}
            onChange={(e) => updateFormData('clientPhone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={useExistingClient && !!formData.clientId}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={formData.clientCompany}
            onChange={(e) => updateFormData('clientCompany', e.target.value)}
            placeholder="Acme Corp"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={useExistingClient && !!formData.clientId}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Contact Person
          </label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => updateFormData('contactPerson', e.target.value)}
            placeholder="Jane Smith (Project Manager)"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={useExistingClient && !!formData.clientId}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Address
          </label>
          <textarea
            value={formData.clientAddress}
            onChange={(e) => updateFormData('clientAddress', e.target.value)}
            placeholder="123 Main St, Suite 100, New York, NY 10001"
            rows={2}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={useExistingClient && !!formData.clientId}
          />
        </div>
      </div>
    </div>
  )
}

// Step 3: Scope & Timeline Component
function Step3Scope({ formData, updateFormData }: any) {
  const addItem = (field: string, defaultValue: string = '') => {
    const currentArray = formData[field] || []
    updateFormData(field, [...currentArray, defaultValue])
  }

  const removeItem = (field: string, index: number) => {
    const currentArray = formData[field] || []
    updateFormData(field, currentArray.filter((_: any, i: number) => i !== index))
  }

  const updateItem = (field: string, index: number, value: string) => {
    const currentArray = formData[field] || []
    const newArray = [...currentArray]
    newArray[index] = value
    updateFormData(field, newArray)
  }

  const addTechStack = (tech: string) => {
    if (tech && !formData.techStack.includes(tech)) {
      updateFormData('techStack', [...formData.techStack, tech])
    }
  }

  const removeTechStack = (tech: string) => {
    updateFormData('techStack', formData.techStack.filter((t: string) => t !== tech))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Scope & Timeline</h2>
        <p className="text-slate-600 mt-2">Define the project scope, deliverables, and timeline</p>
      </div>

      {/* Scope Summary */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Scope Summary *
        </label>
        <textarea
          value={formData.scopeSummary}
          onChange={(e) => updateFormData('scopeSummary', e.target.value)}
          placeholder="Provide a high-level overview of the project scope..."
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      {/* Objectives */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Project Objectives
        </label>
        <div className="space-y-2">
          {formData.objectives.map((obj: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={obj}
                onChange={(e) => updateItem('objectives', index, e.target.value)}
                placeholder="e.g., Increase online sales by 40%"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => removeItem('objectives', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem('objectives')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Objective
          </button>
        </div>
      </div>

      {/* Deliverables */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Deliverables
        </label>
        <div className="space-y-2">
          {formData.deliverables.map((del: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={del}
                onChange={(e) => updateItem('deliverables', index, e.target.value)}
                placeholder="e.g., Responsive website with 10 pages"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => removeItem('deliverables', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem('deliverables')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Deliverable
          </button>
        </div>
      </div>

      {/* Exclusions */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Exclusions (Out of Scope)
        </label>
        <div className="space-y-2">
          {formData.exclusions.map((exc: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={exc}
                onChange={(e) => updateItem('exclusions', index, e.target.value)}
                placeholder="e.g., Third-party API integrations"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => removeItem('exclusions', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem('exclusions')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Exclusion
          </button>
        </div>
      </div>

      {/* Assumptions */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Assumptions
        </label>
        <div className="space-y-2">
          {formData.assumptions.map((assumption: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={assumption}
                onChange={(e) => updateItem('assumptions', index, e.target.value)}
                placeholder="e.g., Client provides all content and images"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => removeItem('assumptions', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem('assumptions')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Assumption
          </button>
        </div>
      </div>

      {/* Timeline & Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estimated Hours
          </label>
          <input
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => updateFormData('estimatedHours', parseFloat(e.target.value) || 0)}
            placeholder="120"
            min="0"
            step="0.5"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Timeline
          </label>
          <input
            type="text"
            value={formData.timeline}
            onChange={(e) => updateFormData('timeline', e.target.value)}
            placeholder="e.g., 6-8 weeks"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Technology Stack
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.techStack.map((tech: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
            >
              {tech}
              <button
                onClick={() => removeTechStack(tech)}
                className="hover:bg-indigo-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            id="tech-input"
            placeholder="e.g., React, Node.js, PostgreSQL"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const input = e.currentTarget
                addTechStack(input.value.trim())
                input.value = ''
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById('tech-input') as HTMLInputElement
              if (input) {
                addTechStack(input.value.trim())
                input.value = ''
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

// Step 4: Pricing & Line Items Component
function Step4Pricing({ formData, updateFormData }: any) {
  const addLineItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      category: 'development' as const,
      quantity: 1,
      unitPrice: 0,
      total: 0,
      taxable: true,
    }
    updateFormData('items', [...formData.items, newItem])
  }

  const removeLineItem = (index: number) => {
    updateFormData('items', formData.items.filter((_: any, i: number) => i !== index))
  }

  const updateLineItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Auto-calculate total
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    }
    
    updateFormData('items', newItems)
  }

  const subtotal = formData.items.reduce((sum: number, item: any) => sum + item.total, 0)
  const discountAmount = formData.discountType === 'percentage' 
    ? (subtotal * formData.discount) / 100
    : formData.discount
  const afterDiscount = subtotal - discountAmount
  const tax = (afterDiscount * formData.taxRate) / 100
  const total = afterDiscount + tax

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Pricing & Line Items</h2>
        <p className="text-slate-600 mt-2">Add line items and configure pricing details</p>
      </div>

      {/* Line Items Table */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Line Items
        </label>
        <div className="border border-slate-300 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase w-24">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase w-32">Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase w-32">Total</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {formData.items.map((item: any, index: number) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                        placeholder="e.g., Frontend Development"
                        className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                        className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900">
                        ${item.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeLineItem(index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button
          onClick={addLineItem}
          className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Line Item
        </button>
      </div>

      {/* Additional Costs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Setup Fee
          </label>
          <input
            type="number"
            value={formData.setupFee}
            onChange={(e) => updateFormData('setupFee', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Development Cost
          </label>
          <input
            type="number"
            value={formData.developmentCost}
            onChange={(e) => updateFormData('developmentCost', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Design Cost
          </label>
          <input
            type="number"
            value={formData.designCost}
            onChange={(e) => updateFormData('designCost', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Monthly Hosting
          </label>
          <input
            type="number"
            value={formData.monthlyHosting}
            onChange={(e) => updateFormData('monthlyHosting', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Monthly Maintenance
          </label>
          <input
            type="number"
            value={formData.monthlyMaintenance}
            onChange={(e) => updateFormData('monthlyMaintenance', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tax & Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => updateFormData('currency', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={formData.taxRate}
            onChange={(e) => updateFormData('taxRate', parseFloat(e.target.value) || 0)}
            placeholder="0"
            min="0"
            max="100"
            step="0.1"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Discount Type
          </label>
          <select
            value={formData.discountType}
            onChange={(e) => updateFormData('discountType', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="fixed">Fixed Amount</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Discount {formData.discountType === 'percentage' ? '(%)' : '($)'}
          </label>
          <input
            type="number"
            value={formData.discount}
            onChange={(e) => updateFormData('discount', parseFloat(e.target.value) || 0)}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pricing Summary</h3>
        <div className="space-y-2">
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
          <div className="pt-2 border-t border-slate-300">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-slate-900">Total:</span>
              <span className="text-lg font-bold text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 5: Milestones & Payment Component
function Step5Milestones({ formData, updateFormData }: any) {
  const addMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      dueDate: '',
      description: '',
    }
    updateFormData('milestones', [...formData.milestones, newMilestone])
  }

  const removeMilestone = (index: number) => {
    updateFormData('milestones', formData.milestones.filter((_: any, i: number) => i !== index))
  }

  const updateMilestone = (index: number, field: string, value: any) => {
    const newMilestones = [...formData.milestones]
    newMilestones[index] = { ...newMilestones[index], [field]: value }
    updateFormData('milestones', newMilestones)
  }

  const togglePaymentMethod = (method: string) => {
    const current = formData.acceptedPaymentMethods || []
    if (current.includes(method)) {
      updateFormData('acceptedPaymentMethods', current.filter((m: string) => m !== method))
    } else {
      updateFormData('acceptedPaymentMethods', [...current, method])
    }
  }

  const totalMilestones = formData.milestones.reduce((sum: number, m: any) => sum + m.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Milestones & Payment</h2>
        <p className="text-slate-600 mt-2">Define payment milestones and terms</p>
      </div>

      {/* Deposit Percentage */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Deposit Percentage: {formData.depositPercent}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={formData.depositPercent}
          onChange={(e) => updateFormData('depositPercent', parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Payment Terms
          </label>
          <select
            value={formData.paymentTerms}
            onChange={(e) => updateFormData('paymentTerms', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Due on Receipt">Due on Receipt</option>
            <option value="Net 15">Net 15</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 45">Net 45</option>
            <option value="Net 60">Net 60</option>
            <option value="Net 90">Net 90</option>
          </select>
        </div>
      </div>

      {/* Accepted Payment Methods */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Accepted Payment Methods
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Bank Transfer', 'Credit Card', 'PayPal', 'Wire Transfer', 'Check', 'Cryptocurrency'].map((method) => (
            <label
              key={method}
              className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={(formData.acceptedPaymentMethods || []).includes(method)}
                onChange={() => togglePaymentMethod(method)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Payment Milestones
        </label>
        <div className="space-y-4">
          {formData.milestones.map((milestone: any, index: number) => (
            <div key={milestone.id} className="border border-slate-300 rounded-lg p-4 bg-slate-50">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-900">Milestone {index + 1}</h4>
                <button
                  onClick={() => removeMilestone(index)}
                  className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Milestone Name
                  </label>
                  <input
                    type="text"
                    value={milestone.name}
                    onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                    placeholder="e.g., Project Kickoff, Design Approval"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={milestone.amount}
                    onChange={(e) => updateMilestone(index, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={milestone.dueDate}
                    onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                    placeholder="What needs to be completed for this milestone..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={addMilestone}
          className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>

      {/* Milestone Summary */}
      {formData.milestones.length > 0 && (
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <h4 className="text-sm font-semibold text-indigo-900 mb-2">Payment Schedule Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-indigo-700">Total Milestones:</span>
              <span className="font-medium text-indigo-900">${totalMilestones.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-700">Milestone Count:</span>
              <span className="font-medium text-indigo-900">{formData.milestones.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Step 6: Terms & Conditions Component
function Step6Terms({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Terms & Conditions</h2>
        <p className="text-slate-600 mt-2">Define legal terms, warranties, and policies</p>
      </div>

      {/* Warranty Terms */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Warranty Terms
        </label>
        <textarea
          value={formData.warrantyTerms}
          onChange={(e) => updateFormData('warrantyTerms', e.target.value)}
          placeholder="Describe warranty coverage, duration, and what is/isn't covered..."
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Support Terms */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Support Terms
        </label>
        <textarea
          value={formData.supportTerms}
          onChange={(e) => updateFormData('supportTerms', e.target.value)}
          placeholder="Describe support coverage, response times, and available channels..."
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        
        <div className="mt-3">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Free Support Period (Months)
          </label>
          <input
            type="number"
            value={formData.freeSupportMonths}
            onChange={(e) => updateFormData('freeSupportMonths', parseInt(e.target.value) || 0)}
            placeholder="3"
            min="0"
            max="24"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Revision Policy */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Revision Policy
        </label>
        <textarea
          value={formData.revisionPolicy}
          onChange={(e) => updateFormData('revisionPolicy', e.target.value)}
          placeholder="Explain how revisions are handled, what constitutes a revision, etc..."
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Included Revisions
            </label>
            <input
              type="number"
              value={formData.includedRevisions}
              onChange={(e) => updateFormData('includedRevisions', parseInt(e.target.value) || 0)}
              placeholder="2"
              min="0"
              max="10"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional Revision Cost ($)
            </label>
            <input
              type="number"
              value={formData.revisionCost}
              onChange={(e) => updateFormData('revisionCost', parseFloat(e.target.value) || 0)}
              placeholder="500"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Cancellation Policy
        </label>
        <textarea
          value={formData.cancellationPolicy}
          onChange={(e) => updateFormData('cancellationPolicy', e.target.value)}
          placeholder="Describe cancellation terms, notice period, refund policy..."
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Intellectual Property Rights */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Intellectual Property Rights
        </label>
        <textarea
          value={formData.ipRights}
          onChange={(e) => updateFormData('ipRights', e.target.value)}
          placeholder="Clarify ownership of code, designs, and other deliverables..."
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Confidentiality Clause */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Confidentiality & NDA
        </label>
        <textarea
          value={formData.confidentialityClause}
          onChange={(e) => updateFormData('confidentialityClause', e.target.value)}
          placeholder="Describe confidentiality obligations and data protection measures..."
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Legal Notice</h4>
            <p className="text-sm text-blue-700">
              These terms will be included in the final quote PDF. Consider having them reviewed by legal counsel 
              to ensure they adequately protect your business interests.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 7: Branding & Customization Component
function Step7Branding({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Branding & Customization</h2>
        <p className="text-slate-600 mt-2">Customize the look and feel of your quote</p>
      </div>

      {/* Template Style */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Template Style
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'modern', label: 'Modern', description: 'Clean and contemporary design' },
            { value: 'classic', label: 'Classic', description: 'Traditional and professional' },
            { value: 'minimal', label: 'Minimal', description: 'Simple and elegant' },
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => updateFormData('templateStyle', style.value)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.templateStyle === style.value
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="font-semibold text-slate-900 mb-1">{style.label}</div>
              <div className="text-sm text-slate-600">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Brand Color */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Brand Color
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="color"
            value={formData.brandColor}
            onChange={(e) => updateFormData('brandColor', e.target.value)}
            className="h-12 w-20 rounded-lg cursor-pointer border border-slate-300"
          />
          <input
            type="text"
            value={formData.brandColor}
            onChange={(e) => updateFormData('brandColor', e.target.value)}
            placeholder="#4F46E5"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>
        <p className="mt-2 text-sm text-slate-500">
          This color will be used for headers, accents, and branding elements in the quote PDF.
        </p>
      </div>

      {/* Logo & Portfolio Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.includeLogo}
              onChange={(e) => updateFormData('includeLogo', e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <div>
              <div className="font-medium text-slate-900">Include Company Logo</div>
              <div className="text-sm text-slate-600">Display your logo on the quote</div>
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.includePortfolio}
              onChange={(e) => updateFormData('includePortfolio', e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <div>
              <div className="font-medium text-slate-900">Include Portfolio</div>
              <div className="text-sm text-slate-600">Show portfolio items in quote</div>
            </div>
          </label>
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Custom Message
        </label>
        <textarea
          value={formData.customMessage}
          onChange={(e) => updateFormData('customMessage', e.target.value)}
          placeholder="Add a personalized message to your client (e.g., 'Thank you for considering our services...')"
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Footer Text */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Footer Text
        </label>
        <input
          type="text"
          value={formData.footerText}
          onChange={(e) => updateFormData('footerText', e.target.value)}
          placeholder="e.g., Thank you for your business | www.yourcompany.com"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="mt-2 text-sm text-slate-500">
          This text will appear at the bottom of every page in the quote PDF.
        </p>
      </div>

      {/* Preview */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-slate-900 mb-4">Preview</h4>
        <div 
          className="h-40 rounded-lg border-2 flex items-center justify-center"
          style={{ 
            borderColor: formData.brandColor,
            backgroundColor: `${formData.brandColor}10`
          }}
        >
          <div className="text-center">
            <div 
              className="text-2xl font-bold mb-2"
              style={{ color: formData.brandColor }}
            >
              Quote Preview
            </div>
            <div className="text-sm text-slate-600">
              {formData.templateStyle.charAt(0).toUpperCase() + formData.templateStyle.slice(1)} Style
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 8: Review & Send Component
function Step8Review({ formData }: any) {
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum: number, item: any) => sum + item.total, 0)
    const discountAmount = formData.discountType === 'percentage' 
      ? (subtotal * formData.discount) / 100
      : formData.discount
    const afterDiscount = subtotal - discountAmount
    const tax = (afterDiscount * formData.taxRate) / 100
    const total = afterDiscount + tax
    return { subtotal, tax, total, discountAmount }
  }

  const { subtotal, tax, total, discountAmount } = calculateTotals()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Review & Send</h2>
        <p className="text-slate-600 mt-2">Review all details before creating the quote</p>
      </div>

      {/* Quote Overview */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">{formData.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-slate-600">Client</div>
            <div className="font-semibold text-slate-900">{formData.clientName || 'Not specified'}</div>
            <div className="text-sm text-slate-600">{formData.clientEmail}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Timeline</div>
            <div className="font-semibold text-slate-900">{formData.timeline || 'Not specified'}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Total Amount</div>
            <div className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Section Summaries */}
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="border border-slate-200 rounded-lg p-5 bg-white">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Basic Information
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-600">Category:</span>
              <span className="ml-2 font-medium">{formData.category}</span>
            </div>
            <div>
              <span className="text-slate-600">Industry:</span>
              <span className="ml-2 font-medium">{formData.industry || 'N/A'}</span>
            </div>
          </div>
          {formData.description && (
            <p className="mt-3 text-sm text-slate-700">{formData.description}</p>
          )}
        </div>

        {/* Scope */}
        <div className="border border-slate-200 rounded-lg p-5 bg-white">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
            <ListCheck className="w-5 h-5 text-indigo-600" />
            Scope & Timeline
          </h4>
          <div className="space-y-2 text-sm">
            {formData.deliverables.length > 0 && (
              <div>
                <span className="font-medium text-slate-700">Deliverables:</span>
                <span className="ml-2 text-slate-600">{formData.deliverables.length} items</span>
              </div>
            )}
            {formData.objectives.length > 0 && (
              <div>
                <span className="font-medium text-slate-700">Objectives:</span>
                <span className="ml-2 text-slate-600">{formData.objectives.length} items</span>
              </div>
            )}
            {formData.estimatedHours > 0 && (
              <div>
                <span className="font-medium text-slate-700">Estimated Hours:</span>
                <span className="ml-2 text-slate-600">{formData.estimatedHours} hours</span>
              </div>
            )}
            {formData.techStack.length > 0 && (
              <div>
                <span className="font-medium text-slate-700">Tech Stack:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.techStack.map((tech: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="border border-slate-200 rounded-lg p-5 bg-white">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            Pricing Breakdown
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Line Items ({formData.items.length}):</span>
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
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-900">Total:</span>
              <span className="text-xl font-bold text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Milestones */}
        {formData.milestones.length > 0 && (
          <div className="border border-slate-200 rounded-lg p-5 bg-white">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Payment Milestones
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-slate-600">Number of Milestones:</span>
                <span className="ml-2 font-medium">{formData.milestones.length}</span>
              </div>
              <div>
                <span className="text-slate-600">Deposit:</span>
                <span className="ml-2 font-medium">{formData.depositPercent}%</span>
              </div>
              <div>
                <span className="text-slate-600">Payment Terms:</span>
                <span className="ml-2 font-medium">{formData.paymentTerms}</span>
              </div>
            </div>
          </div>
        )}

        {/* Terms */}
        <div className="border border-slate-200 rounded-lg p-5 bg-white">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            Terms & Conditions
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-600">Free Support:</span>
              <span className="ml-2 font-medium">{formData.freeSupportMonths} months</span>
            </div>
            <div>
              <span className="text-slate-600">Included Revisions:</span>
              <span className="ml-2 font-medium">{formData.includedRevisions}</span>
            </div>
            {formData.warrantyTerms && (
              <div className="col-span-2">
                <span className="text-slate-600">✓ Warranty terms specified</span>
              </div>
            )}
            {formData.ipRights && (
              <div className="col-span-2">
                <span className="text-slate-600">✓ IP rights specified</span>
              </div>
            )}
          </div>
        </div>

        {/* Branding */}
        <div className="border border-slate-200 rounded-lg p-5 bg-white">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
            <Palette className="w-5 h-5 text-indigo-600" />
            Branding & Customization
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-slate-600">Template Style:</span>
              <span className="font-medium capitalize">{formData.templateStyle}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-600">Brand Color:</span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-slate-300"
                  style={{ backgroundColor: formData.brandColor }}
                />
                <span className="font-mono text-xs">{formData.brandColor}</span>
              </div>
            </div>
            <div className="flex gap-4">
              {formData.includeLogo && <span className="text-slate-600">✓ Logo included</span>}
              {formData.includePortfolio && <span className="text-slate-600">✓ Portfolio included</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Final Settings */}
      <div className="border border-slate-200 rounded-lg p-5 bg-white">
        <h4 className="font-semibold text-slate-900 mb-4">Final Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quote Valid For (Days)
            </label>
            <input
              type="number"
              value={formData.validityDays}
              readOnly
              min="1"
              max="365"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <input
              type="text"
              value={formData.status}
              readOnly
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 capitalize"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Internal Notes (Not visible to client)
            </label>
            <textarea
              value={formData.internalNotes}
              readOnly
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-1">Ready to Create</h4>
            <p className="text-sm text-green-700">
              Your quote is complete! Click &quot;Create Quote&quot; below to save and generate the PDF.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
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
