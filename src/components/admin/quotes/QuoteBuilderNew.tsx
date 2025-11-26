'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, 
  Download, 
  Send, 
  FileText, 
  Plus, 
  Trash2, 
  Copy, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Printer
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import BasicInfoTab from './BasicInfoTab'
import ScopeTab from './ScopeTab'
import PricingTab from './PricingTab'
import TimelineTab from './TimelineTab'
import PaymentTab from './PaymentTab'
import TermsTab from './TermsTab'
import PreviewTab from './PreviewTab'

// Types
interface LineItem {
  id: string
  name: string
  description: string
  category: 'development' | 'design' | 'infrastructure' | 'maintenance' | 'consulting' | 'hosting' | 'custom'
  quantity: number
  unitPrice: number
  discount: number
  taxable: boolean
  order: number
}

interface Milestone {
  id: string
  title: string
  description: string
  deliverables: string[]
  duration: number
  percentage: number
  dependencies: string[]
  startDate?: string
  endDate?: string
}

interface PaymentSchedule {
  id: string
  title: string
  percentage: number
  amount: number
  dueDate: 'onSigning' | 'milestone' | 'net15' | 'net30' | 'net60' | 'custom'
  milestoneId?: string
  customDate?: string
  description?: string
}

interface QuoteFormData {
  // Basic Info
  quoteNumber: string
  title: string
  clientId: string
  clientName: string
  clientEmail: string
  clientCompany?: string
  clientPhone?: string
  clientAddress?: string
  
  // Project Details
  projectType: string
  industry: string
  description: string
  executiveSummary: string
  objectives: string[]
  
  // Scope
  scopeItems: string[]
  exclusions: string[]
  assumptions: string[]
  deliverables: string[]
  
  // Pricing
  lineItems: LineItem[]
  currency: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  taxRate: number
  subtotal: number
  discount: number
  tax: number
  total: number
  
  // Timeline
  startDate: string
  estimatedDuration: number
  milestones: Milestone[]
  
  // Payment
  paymentSchedule: PaymentSchedule[]
  depositRequired: boolean
  depositPercentage: number
  acceptedPaymentMethods: string[]
  
  // Terms
  termsAndConditions: string
  validUntil: string
  warranties: string
  supportTerms: string
  revisionPolicy: string
  cancellationPolicy: string
  
  // Branding
  brandColor: string
  includeLogo: boolean
  includePortfolio: boolean
  customMessage: string
  footerText: string
  
  // Metadata
  status: 'draft' | 'pending' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  version: number
  lastSavedAt?: string
  createdAt: string
  updatedAt: string
}

interface QuoteBuilderProps {
  quoteId?: string
  editMode?: boolean
  onSave?: (quote: QuoteFormData) => void
  onCancel?: () => void
}

export default function QuoteBuilderNew({ quoteId, editMode = false, onSave, onCancel }: QuoteBuilderProps) {
  // State
  const [formData, setFormData] = useState<QuoteFormData>({
    quoteNumber: generateQuoteNumber(),
    title: '',
    clientId: '',
    clientName: '',
    clientEmail: '',
    projectType: 'web-application',
    industry: 'technology',
    description: '',
    executiveSummary: '',
    objectives: [],
    scopeItems: [],
    exclusions: [],
    assumptions: [],
    deliverables: [],
    lineItems: [],
    currency: 'USD',
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 0,
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    startDate: '',
    estimatedDuration: 0,
    milestones: [],
    paymentSchedule: [],
    depositRequired: false,
    depositPercentage: 0,
    acceptedPaymentMethods: ['bank-transfer', 'credit-card', 'paypal'],
    termsAndConditions: getDefaultTerms(),
    validUntil: getDefaultValidUntil(),
    warranties: '',
    supportTerms: '',
    revisionPolicy: '',
    cancellationPolicy: '',
    brandColor: '#6366f1',
    includeLogo: true,
    includePortfolio: false,
    customMessage: '',
    footerText: '',
    status: 'draft',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const [currentTab, setCurrentTab] = useState<'basic' | 'scope' | 'pricing' | 'timeline' | 'payment' | 'terms' | 'preview'>('basic')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  const autoSaveTimeout = useRef<NodeJS.Timeout>()
  const hasUnsavedChanges = useRef(false)

  // Load data on mount
  useEffect(() => {
    loadClients()
    loadTemplates()
    if (editMode && quoteId) {
      loadQuoteData(quoteId)
    } else {
      // Try to restore draft from localStorage
      restoreDraft()
    }
  }, [editMode, quoteId])

  // Auto-save mechanism
  useEffect(() => {
    if (hasUnsavedChanges.current) {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current)
      }
      
      setAutoSaveStatus('unsaved')
      
      autoSaveTimeout.current = setTimeout(() => {
        saveDraft()
      }, 3000) // Auto-save after 3 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current)
      }
    }
  }, [formData])

  // Functions
  function generateQuoteNumber(): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `QT-${year}${month}-${random}`
  }

  function getDefaultValidUntil(): string {
    const date = new Date()
    date.setDate(date.getDate() + 30) // 30 days from now
    return date.toISOString().split('T')[0]
  }

  function getDefaultTerms(): string {
    return `1. Payment Terms: Payment is due according to the schedule outlined in this quote.
2. Scope Changes: Any changes to the scope of work may affect pricing and timeline.
3. Client Responsibilities: Client agrees to provide necessary materials and feedback in a timely manner.
4. Confidentiality: Both parties agree to keep confidential information private.
5. Intellectual Property: Upon full payment, all intellectual property rights transfer to the client.
6. Warranty: We guarantee our work for 30 days after project completion.
7. Termination: Either party may terminate with 14 days written notice.
8. Governing Law: This agreement is governed by the laws of Ghana.`
  }

  const loadClients = async () => {
    try {
      const res = await fetch('/api/admin/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error('Failed to load clients:', error)
    }
  }

  const loadTemplates = async () => {
    try {
      const res = await fetch('/api/admin/quote-templates')
      if (res.ok) {
        const data = await res.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const loadQuoteData = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/quotes/${id}`)
      if (res.ok) {
        const data = await res.json()
        const quote = data.quote
        
        // Map database fields to form data
        setFormData({
          ...formData,
          quoteNumber: quote.quoteNumber,
          title: quote.title,
          clientId: quote.clientId,
          clientName: quote.clientName || '',
          clientEmail: quote.clientEmail || '',
          clientCompany: quote.clientCompany,
          clientPhone: quote.clientPhone,
          clientAddress: quote.clientAddress,
          projectType: quote.projectType || 'web-application',
          industry: quote.industry || 'technology',
          description: quote.description || '',
          executiveSummary: quote.executiveSummary || '',
          objectives: tryParseJSON(quote.objectives, []),
          scopeItems: tryParseJSON(quote.scopeOfWork, []),
          exclusions: tryParseJSON(quote.exclusions, []),
          assumptions: tryParseJSON(quote.assumptions, []),
          deliverables: tryParseJSON(quote.deliverables, []),
          lineItems: tryParseJSON(quote.items, []),
          currency: quote.currency || 'USD',
          discountType: quote.discountType || 'percentage',
          discountValue: quote.discount || 0,
          taxRate: quote.taxRate || 0,
          subtotal: quote.subtotal || 0,
          discount: quote.discount || 0,
          tax: quote.tax || 0,
          total: quote.total || 0,
          startDate: quote.startDate || '',
          estimatedDuration: quote.estimatedDuration || 0,
          milestones: tryParseJSON(quote.milestones, []),
          paymentSchedule: tryParseJSON(quote.paymentTerms, []),
          depositRequired: quote.depositPercent > 0,
          depositPercentage: quote.depositPercent || 0,
          acceptedPaymentMethods: tryParseJSON(quote.acceptedPaymentMethods, ['bank-transfer']),
          termsAndConditions: quote.terms || getDefaultTerms(),
          validUntil: quote.validUntil || getDefaultValidUntil(),
          warranties: quote.warranties || '',
          supportTerms: quote.supportTerms || '',
          revisionPolicy: quote.revisionsPolicy || '',
          cancellationPolicy: quote.cancellationPolicy || '',
          brandColor: quote.brandColor || '#6366f1',
          includeLogo: quote.includeCompanyLogo !== false,
          includePortfolio: quote.includePortfolio || false,
          customMessage: quote.customCoverMessage || '',
          footerText: quote.footerText || '',
          status: quote.status || 'draft',
          version: quote.version || 1,
          lastSavedAt: quote.updatedAt,
          createdAt: quote.createdAt,
          updatedAt: quote.updatedAt,
        })
      }
    } catch (error) {
      console.error('Failed to load quote:', error)
    } finally {
      setLoading(false)
    }
  }

  const tryParseJSON = (str: string | null, defaultValue: any = []) => {
    if (!str) return defaultValue
    try {
      return JSON.parse(str)
    } catch {
      return defaultValue
    }
  }

  const restoreDraft = () => {
    try {
      const saved = localStorage.getItem('quote_draft')
      if (saved) {
        const draft = JSON.parse(saved)
        setFormData(draft)
        setAutoSaveStatus('saved')
        setLastSaved(new Date(draft.updatedAt))
      }
    } catch (error) {
      console.error('Failed to restore draft:', error)
    }
  }

  const saveDraft = async () => {
    try {
      setAutoSaveStatus('saving')
      
      // Save to localStorage immediately
      const draft = {
        ...formData,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem('quote_draft', JSON.stringify(draft))
      
      setAutoSaveStatus('saved')
      setLastSaved(new Date())
      hasUnsavedChanges.current = false
    } catch (error) {
      console.error('Failed to save draft:', error)
      setAutoSaveStatus('unsaved')
    }
  }

  const handleSave = async (status: 'draft' | 'sent' = 'draft') => {
    try {
      setSaving(true)
      setErrors({})

      // Validate
      const validationErrors = validateQuote()
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        alert('Please fix validation errors:\n' + Object.values(validationErrors).join('\n'))
        return
      }

      // Recalculate totals
      const calculatedData = calculateTotals(formData)

      const payload = {
        ...calculatedData,
        status,
      }

      const url = editMode && quoteId 
        ? `/api/admin/quotes/${quoteId}`
        : '/api/admin/quotes'
      
      const method = editMode && quoteId ? 'PUT' : 'POST'

      // Show saving feedback
      const savingToast = document.createElement('div')
      savingToast.id = 'saving-toast'
      savingToast.style.cssText = 'position:fixed;top:20px;right:20px;background:#4F46E5;color:white;padding:16px 24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;font-family:system-ui,-apple-system,sans-serif;font-size:14px;'
      savingToast.textContent = status === 'draft' ? '💾 Saving draft...' : '📤 Saving and sending...'
      document.body.appendChild(savingToast)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        const savedQuoteId = data.quote.id
        localStorage.removeItem('quote_draft')
        hasUnsavedChanges.current = false
        
        // If sending to client, trigger email notification
        if (status === 'sent' && savedQuoteId) {
          try {
            await fetch(`/api/admin/quotes/${savedQuoteId}/send`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            })
            savingToast.style.background = '#10B981'
            savingToast.textContent = '✅ Quote sent to client!'
          } catch (emailError) {
            console.error('Failed to send email:', emailError)
            savingToast.style.background = '#F59E0B'
            savingToast.textContent = '⚠️ Quote saved but email failed'
          }
        } else {
          savingToast.style.background = '#10B981'
          savingToast.textContent = status === 'draft' ? '✅ Draft saved!' : '✅ Quote saved!'
        }

        // Remove toast and redirect after delay
        setTimeout(() => {
          if (savingToast.parentNode) savingToast.remove()
          if (onSave) {
            onSave(data.quote)
          } else {
            // Always redirect to dashboard after save
            window.location.href = '/admin/quotes'
          }
        }, 1500)
      } else {
        const error = await res.json()
        savingToast.style.background = '#EF4444'
        savingToast.textContent = '❌ Save failed'
        setTimeout(() => savingToast.remove(), 3000)
        setErrors({ general: error.error || 'Failed to save quote' })
      }
    } catch (error) {
      console.error('Failed to save quote:', error)
      setErrors({ general: 'An error occurred while saving' })
      const toast = document.getElementById('saving-toast')
      if (toast) {
        toast.style.background = '#EF4444'
        toast.textContent = '❌ Error occurred'
        setTimeout(() => toast.remove(), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  const validateQuote = (): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!formData.title) errors.title = 'Title is required'
    if (!formData.clientId && !formData.clientEmail) errors.client = 'Client is required'
    if (formData.lineItems.length === 0) errors.lineItems = 'At least one line item is required'
    if (!formData.validUntil) errors.validUntil = 'Valid until date is required'

    return errors
  }

  const calculateTotals = (data: QuoteFormData): QuoteFormData => {
    // Calculate subtotal
    const subtotal = data.lineItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100)
      return sum + itemTotal
    }, 0)

    // Calculate discount
    const discount = data.discountType === 'percentage'
      ? subtotal * (data.discountValue / 100)
      : data.discountValue

    // Calculate tax
    const taxableAmount = subtotal - discount
    const tax = taxableAmount * (data.taxRate / 100)

    // Calculate total
    const total = taxableAmount + tax

    // Update payment schedule amounts
    const updatedPaymentSchedule = data.paymentSchedule.map(term => ({
      ...term,
      amount: total * (term.percentage / 100)
    }))

    return {
      ...data,
      subtotal,
      discount,
      tax,
      total,
      paymentSchedule: updatedPaymentSchedule,
    }
  }

  const handleGeneratePDF = async () => {
    if (!quoteId) {
      alert('Quote ID is missing. Please save the quote first.')
      return
    }
    
    try {
      setLoading(true)
      console.log('📄 Downloading PDF for quote:', quoteId)
      
      // Show loading feedback
      const loadingToast = document.createElement('div')
      loadingToast.id = 'pdf-loading-toast'
      loadingToast.style.cssText = 'position:fixed;top:20px;right:20px;background:#4F46E5;color:white;padding:16px 24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;font-family:system-ui,-apple-system,sans-serif;font-size:14px;'
      loadingToast.textContent = '⏳ Generating PDF...'
      document.body.appendChild(loadingToast)
      
      // Use simple GET request to download PDF
      const response = await fetch(`/api/admin/quotes/${quoteId}/pdf`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('PDF generation failed:', errorData)
        throw new Error(errorData.error || 'Failed to generate PDF')
      }
      
      // Verify we got a PDF
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/pdf')) {
        console.error('Invalid content type:', contentType)
        throw new Error('Server did not return a PDF file')
      }
      
      // Get the blob
      const blob = await response.blob()
      
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty')
      }
      
      console.log('✅ PDF generated successfully, size:', blob.size, 'bytes')
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `quote-${formData.quoteNumber || quoteId}.pdf`
      
      // Trigger download
      document.body.appendChild(a)
      a.click()
      
      // Update toast to success
      loadingToast.style.background = '#10B981'
      loadingToast.textContent = '✅ PDF downloaded successfully!'
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        if (loadingToast.parentNode) {
          loadingToast.remove()
        }
      }, 2000)
      
      console.log('📥 PDF downloaded successfully')
    } catch (error) {
      console.error('Failed to download PDF:', error)
      
      // Remove loading toast if it exists
      const loadingToast = document.getElementById('pdf-loading-toast')
      if (loadingToast) loadingToast.remove()
      
      // Show error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to download PDF: ${errorMessage}\n\nPlease check:\n• Your internet connection\n• Quote has required data (client name, items)\n• Try refreshing the page`)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    if (!quoteId) {
      alert('Quote ID is missing. Please save the quote first.')
      return
    }
    
    // Show loading feedback
    const loadingToast = document.createElement('div')
    loadingToast.id = 'print-loading-toast'
    loadingToast.style.cssText = 'position:fixed;top:20px;right:20px;background:#4F46E5;color:white;padding:16px 24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;font-family:system-ui,-apple-system,sans-serif;font-size:14px;'
    loadingToast.textContent = '🖨️ Preparing to print...'
    document.body.appendChild(loadingToast)
    
    // Delay to ensure user sees the toast, then trigger print
    setTimeout(() => {
      window.print()
      
      // Update toast to success
      loadingToast.style.background = '#10B981'
      loadingToast.textContent = '✅ Print dialog opened!'
      
      // Remove toast after a short delay
      setTimeout(() => {
        if (loadingToast.parentNode) {
          loadingToast.remove()
        }
      }, 2000)
    }, 300)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    hasUnsavedChanges.current = true
  }

  // Line item functions
  const addLineItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      name: '',
      description: '',
      category: 'custom',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxable: true,
      order: formData.lineItems.length,
    }
    updateFormData('lineItems', [...formData.lineItems, newItem])
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const updated = formData.lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
    updateFormData('lineItems', updated)
  }

  const removeLineItem = (id: string) => {
    updateFormData('lineItems', formData.lineItems.filter(item => item.id !== id))
  }

  const duplicateLineItem = (id: string) => {
    const item = formData.lineItems.find(i => i.id === id)
    if (item) {
      const duplicate = {
        ...item,
        id: `item-${Date.now()}`,
        name: `${item.name} (Copy)`,
      }
      updateFormData('lineItems', [...formData.lineItems, duplicate])
    }
  }

  // Milestone functions
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
    updateFormData('milestones', [...formData.milestones, newMilestone])
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    const updated = formData.milestones.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    )
    updateFormData('milestones', updated)
  }

  const removeMilestone = (id: string) => {
    updateFormData('milestones', formData.milestones.filter(m => m.id !== id))
  }

  // Payment schedule functions
  const addPaymentTerm = () => {
    const newTerm: PaymentSchedule = {
      id: `payment-${Date.now()}`,
      title: '',
      percentage: 0,
      amount: 0,
      dueDate: 'net30',
    }
    updateFormData('paymentSchedule', [...formData.paymentSchedule, newTerm])
  }

  const updatePaymentTerm = (id: string, field: keyof PaymentSchedule, value: any) => {
    const updated = formData.paymentSchedule.map(term =>
      term.id === id ? { ...term, [field]: value } : term
    )
    updateFormData('paymentSchedule', updated)
  }

  const removePaymentTerm = (id: string) => {
    updateFormData('paymentSchedule', formData.paymentSchedule.filter(t => t.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Title */}
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => onCancel ? onCancel() : window.history.back()}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {editMode ? 'Edit Quote' : 'Create Quote'}
                </h1>
                <p className="text-sm text-gray-500">{formData.quoteNumber}</p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              {/* Auto-save status */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {autoSaveStatus === 'saving' && (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && lastSaved && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Saved {formatTimeSince(lastSaved)}</span>
                  </>
                )}
                {autoSaveStatus === 'unsaved' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Unsaved changes</span>
                  </>
                )}
              </div>

              <Button
                variant="secondary"
                onClick={() => setShowPDFPreview(true)}
                disabled={!quoteId}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </Button>

              <Button
                variant="secondary"
                onClick={handlePrint}
                disabled={!quoteId || saving}
                className="flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </Button>

              <Button
                variant="secondary"
                onClick={handleGeneratePDF}
                disabled={!quoteId || saving}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </Button>

              <Button
                variant="secondary"
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </Button>

              <Button
                onClick={() => handleSave('sent')}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Save & Send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${currentTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="flex items-center space-x-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )

  function renderTabContent() {
    switch (currentTab) {
      case 'basic':
        return <BasicInfoTab formData={formData} updateFormData={updateFormData} />
      case 'scope':
        return <ScopeTab formData={formData} updateFormData={updateFormData} />
      case 'pricing':
        return <PricingTab formData={formData} updateFormData={updateFormData} />
      case 'timeline':
        return <TimelineTab formData={formData} updateFormData={updateFormData} />
      case 'payment':
        return <PaymentTab formData={formData} updateFormData={updateFormData} />
      case 'terms':
        return <TermsTab formData={formData} updateFormData={updateFormData} />
      case 'preview':
        return <PreviewTab formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }
}

// Helper function
function formatTimeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// Tab configuration
const tabs = [
  { id: 'basic', label: 'Basic Info', icon: <FileText className="w-4 h-4" /> },
  { id: 'scope', label: 'Scope', icon: <FileText className="w-4 h-4" /> },
  { id: 'pricing', label: 'Pricing', icon: <FileText className="w-4 h-4" /> },
  { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
  { id: 'payment', label: 'Payment', icon: <FileText className="w-4 h-4" /> },
  { id: 'terms', label: 'Terms', icon: <FileText className="w-4 h-4" /> },
  { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> },
]
