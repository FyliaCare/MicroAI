'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'

interface QuoteTemplate {
  id: string
  name: string
  category: string
  description: string
  setupFee: number
  developmentCost: number
  designCost: number
  monthlyHosting: number
  monthlyMaintenance: number
  estimatedHours: number
  timeline: string
  techStack: string
  features: string
  deliverables: string
  hostingBreakdown: string
  milestones: string
  actualCosts: string
  profitMargin: number
}

interface Client {
  id: string
  name: string
  email: string
  company?: string
}

interface AdvancedQuoteGeneratorProps {
  onQuoteCreated?: (quote: any) => void
  clientId?: string
  projectId?: string
}

export default function AdvancedQuoteGenerator({
  onQuoteCreated,
  clientId: initialClientId,
  projectId: initialProjectId,
}: AdvancedQuoteGeneratorProps) {
  const [templates, setTemplates] = useState<QuoteTemplate[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [collapsedPhases, setCollapsedPhases] = useState<Set<number>>(new Set())
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdQuote, setCreatedQuote] = useState<any>(null)
  
  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState({
    name: 'MicroAI',
    email: 'contact@microai.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    website: 'https://microai.com',
    description: 'Professional Web Development Services',
    logo: ''
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: initialClientId || '',
    projectId: initialProjectId || '',
    projectType: '',
    estimatedHours: '',
    timeline: '',
    techStack: [] as string[],
    setupFee: '',
    developmentCost: '',
    designCost: '',
    monthlyHosting: '',
    monthlyMaintenance: '',
    hostingBreakdown: {} as Record<string, any>,
    deliverables: [] as string[],
    features: [] as string[],
    milestones: [] as any[],
    developmentPhases: [
      {
        title: 'Discovery & Planning',
        description: 'Initial consultation to understand your business goals, target audience, and project requirements. We\'ll create a detailed project roadmap and technical specifications document.',
        tasks: [
          'Requirements gathering and analysis',
          'Competitive research and market analysis',
          'Information architecture development',
          'Project timeline and milestone planning',
          'Technology stack finalization'
        ],
        color: 'blue'
      },
      {
        title: 'Design & Prototyping',
        description: 'Creation of wireframes, mockups, and interactive prototypes. Design system development including color schemes, typography, and UI components aligned with your brand identity.',
        tasks: [
          'Wireframe creation for all key pages',
          'High-fidelity mockup design',
          'Interactive prototype development',
          'Responsive design for mobile/tablet/desktop',
          'Design review and client approval'
        ],
        color: 'green'
      },
      {
        title: 'Development & Implementation',
        description: 'Full-stack development using modern technologies. Building responsive front-end interfaces, robust back-end systems, database architecture, and API integrations.',
        tasks: [
          'Front-end development (HTML/CSS/JavaScript/React/Next.js)',
          'Back-end API development and database setup',
          'Content management system integration',
          'Third-party service integrations',
          'Performance optimization',
          'Security implementation and SSL setup'
        ],
        color: 'purple'
      },
      {
        title: 'Testing & Quality Assurance',
        description: 'Comprehensive testing across all devices and browsers. Bug fixing, performance testing, security audits, and user acceptance testing to ensure flawless functionality.',
        tasks: [
          'Cross-browser compatibility testing',
          'Mobile responsiveness testing',
          'Performance and load testing',
          'Security vulnerability assessment',
          'User acceptance testing (UAT)',
          'Bug fixing and optimization'
        ],
        color: 'orange'
      },
      {
        title: 'Deployment & Launch',
        description: 'Final deployment to production servers, DNS configuration, analytics setup, and go-live support. Post-launch monitoring and immediate issue resolution.',
        tasks: [
          'Production server setup and configuration',
          'Domain and DNS configuration',
          'SSL certificate installation',
          'Analytics and tracking implementation',
          'Final content migration',
          'Launch day support and monitoring'
        ],
        color: 'red'
      },
      {
        title: 'Training & Handover',
        description: 'Comprehensive training for your team on managing and updating the website. Complete documentation and ongoing support to ensure you\'re confident managing your new platform.',
        tasks: [
          'Admin panel training session',
          'Content management training',
          'Complete technical documentation',
          'Video tutorials for common tasks',
          'Source code and asset handover',
          'Post-launch support period'
        ],
        color: 'gray'
      }
    ] as Array<{
      title: string
      description: string
      tasks: string[]
      color: string
    }>,
    monthlyRecurring: '',
    yearlyRecurring: '',
    validUntil: '',
    notes: '',
    terms: 'Payment terms: 50% upfront, 50% upon completion. All prices in USD. Quote valid for 30 days.',
  })

  useEffect(() => {
    fetchTemplates()
    fetchClients()
    loadCompanyProfile()
    
    // Check for edit or duplicate mode
    const params = new URLSearchParams(window.location.search)
    const editId = params.get('edit')
    const isDuplicate = params.get('duplicate')
    
    if (editId) {
      loadEditQuote(editId)
    } else if (isDuplicate) {
      loadDuplicateQuote()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadEditQuote = (quoteId: string) => {
    try {
      const savedQuote = localStorage.getItem('editQuoteData')
      if (savedQuote) {
        const quote = JSON.parse(savedQuote)
        // Pre-fill form with quote data
        setFormData({
          ...formData,
          title: quote.projectName || '',
          description: quote.description || '',
          clientId: quote.clientId || '',
          setupFee: quote.setupFee?.toString() || '',
          developmentCost: quote.developmentCost?.toString() || '',
          designCost: quote.designCost?.toString() || '',
          monthlyHosting: quote.monthlyHosting?.toString() || '',
          notes: quote.notes || '',
        })
        // Clear localStorage
        localStorage.removeItem('editQuoteData')
      }
    } catch (err) {
      console.error('Error loading edit quote:', err)
    }
  }

  const loadDuplicateQuote = () => {
    try {
      const savedQuote = localStorage.getItem('duplicateQuoteData')
      if (savedQuote) {
        const quote = JSON.parse(savedQuote)
        // Pre-fill form with duplicated quote data
        setFormData({
          ...formData,
          title: quote.projectName || '',
          description: quote.description || '',
          clientId: quote.clientId || '',
          setupFee: quote.setupFee?.toString() || '',
          developmentCost: quote.developmentCost?.toString() || '',
          designCost: quote.designCost?.toString() || '',
          monthlyHosting: quote.monthlyHosting?.toString() || '',
          notes: quote.notes || '',
        })
        // Clear localStorage
        localStorage.removeItem('duplicateQuoteData')
      }
    } catch (err) {
      console.error('Error loading duplicate quote:', err)
    }
  }

  const loadCompanyProfile = () => {
    try {
      const savedProfile = localStorage.getItem('companyProfile')
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        setCompanyProfile({
          name: profile.name || 'MicroAI',
          email: profile.email || 'contact@microai.com',
          phone: profile.phone || '+1 (555) 123-4567',
          address: profile.address || '123 Tech Street, Silicon Valley, CA 94000',
          website: profile.website || 'https://microai.com',
          description: profile.description || 'Professional Web Development Services',
          logo: profile.logo || ''
        })
      }
    } catch (err) {
      console.error('Error loading company profile:', err)
    }
  }

  const handleDownloadQuote = () => {
    // Store the current quote data
    const quoteData: any = {
      ...formData,
      setupFee: formData.setupFee,
      developmentCost: formData.developmentCost,
      designCost: formData.designCost,
      monthlyHosting: formData.monthlyHosting,
      phases: (formData as any).phases || []
    }
    
    sessionStorage.setItem('quoteToPrint', JSON.stringify(quoteData))
    
    // Open PDF page in new window
    window.open('/admin/quotes/pdf', '_blank')
  }

  const handleDownloadCreatedQuote = () => {
    if (!createdQuote) return
    
    // Store the quote data
    const quoteData: any = {
      ...formData,
      ...createdQuote,
      setupFee: formData.setupFee,
      developmentCost: formData.developmentCost,
      designCost: formData.designCost,
      monthlyHosting: formData.monthlyHosting,
      phases: (formData as any).phases || []
    }
    
    sessionStorage.setItem('quoteToPrint', JSON.stringify(quoteData))
    
    // Open PDF page in new window
    window.open('/admin/quotes/pdf', '_blank')
    
    // Close modal
    setShowSuccessModal(false)
  }

  const handleSaveAsDraftAndClose = async () => {
    if (!createdQuote) return
    
    try {
      // Update quote status to draft
      await fetch(`/api/admin/quotes/${createdQuote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'draft' }),
      })
      
      setShowSuccessModal(false)
      window.location.href = '/admin/quotes'
    } catch (error) {
      console.error('Error saving as draft:', error)
      // Still redirect even if update fails
      window.location.href = '/admin/quotes'
    }
  }

  const handleSaveQuote = async (isDraft: boolean = false) => {
    setLoading(true)
    setError('')
    
    try {
      const quoteData = {
        title: formData.title,
        description: formData.description,
        clientId: formData.clientId,
        projectType: formData.projectType,
        estimatedHours: parseFloat(formData.estimatedHours) || 0,
        timeline: formData.timeline,
        techStack: JSON.stringify(formData.techStack),
        setupFee: parseFloat(formData.setupFee) || 0,
        developmentCost: parseFloat(formData.developmentCost) || 0,
        designCost: parseFloat(formData.designCost) || 0,
        monthlyHosting: parseFloat(formData.monthlyHosting) || 0,
        monthlyMaintenance: parseFloat(formData.monthlyMaintenance) || 0,
        monthlyRecurring: parseFloat(formData.monthlyRecurring) || 0,
        yearlyRecurring: parseFloat(formData.yearlyRecurring) || 0,
        deliverables: JSON.stringify(formData.deliverables),
        hostingBreakdown: JSON.stringify(formData.hostingBreakdown),
        milestones: JSON.stringify(formData.milestones),
        validUntil: formData.validUntil,
        notes: formData.notes,
        terms: formData.terms,
        status: isDraft ? 'draft' : 'sent',
        phases: JSON.stringify((formData as any).developmentPhases || []),
      }

      const totalAmount = 
        (parseFloat(formData.setupFee) || 0) +
        (parseFloat(formData.developmentCost) || 0) +
        (parseFloat(formData.designCost) || 0) +
        ((parseFloat(formData.monthlyHosting) || 0) * 12)

      const response = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...quoteData, totalAmount }),
      })

      const data = await response.json()

      if (data.success) {
        setCreatedQuote(data.quote)
        if (isDraft) {
          setSuccess('Quote saved as draft successfully!')
          setTimeout(() => {
            window.location.href = '/admin/quotes'
          }, 1500)
        } else {
          // Successfully generated - redirect to quotes dashboard immediately
          setSuccess('Quote generated successfully!')
          setTimeout(() => {
            window.location.href = '/admin/quotes'
          }, 800)
        }
      } else {
        setError(data.error || 'Failed to save quote')
      }
    } catch (err) {
      console.error('Error saving quote:', err)
      setError('Failed to save quote')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQuote = () => {
    handleSaveQuote(false)
  }

  const handleSaveAsDraft = () => {
    handleSaveQuote(true)
  }

  const togglePhase = (index: number) => {
    const newCollapsed = new Set(collapsedPhases)
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index)
    } else {
      newCollapsed.add(index)
    }
    setCollapsedPhases(newCollapsed)
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/quote-templates?active=true')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (err) {
      console.error('Error fetching templates:', err)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      const data = await response.json()
      if (data.success) {
        setClients(data.clients)
      }
    } catch (err) {
      console.error('Error fetching clients:', err)
    }
  }

  const handleTemplateSelect = (template: QuoteTemplate) => {
    setSelectedTemplate(template)
    
    const techStack = JSON.parse(template.techStack || '[]')
    const features = JSON.parse(template.features || '[]')
    const deliverables = JSON.parse(template.deliverables || '[]')
    const hostingBreakdown = JSON.parse(template.hostingBreakdown || '{}')
    const milestones = JSON.parse(template.milestones || '[]')

    const monthlyRecurring = template.monthlyHosting + template.monthlyMaintenance
    const yearlyRecurring = monthlyRecurring * 12

    setFormData({
      ...formData,
      title: template.name,
      description: template.description || '',
      projectType: template.category,
      estimatedHours: template.estimatedHours?.toString() || '',
      timeline: template.timeline || '',
      techStack,
      features,
      setupFee: template.setupFee.toString(),
      developmentCost: template.developmentCost?.toString() || '0',
      designCost: template.designCost?.toString() || '0',
      monthlyHosting: template.monthlyHosting.toString(),
      monthlyMaintenance: template.monthlyMaintenance?.toString() || '0',
      hostingBreakdown,
      deliverables,
      milestones,
      monthlyRecurring: monthlyRecurring.toString(),
      yearlyRecurring: yearlyRecurring.toString(),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const items = [
        {
          description: 'Setup Fee',
          quantity: 1,
          unitPrice: parseFloat(formData.setupFee),
          total: parseFloat(formData.setupFee),
        },
      ]

      if (parseFloat(formData.developmentCost) > 0) {
        items.push({
          description: 'Development Cost',
          quantity: 1,
          unitPrice: parseFloat(formData.developmentCost),
          total: parseFloat(formData.developmentCost),
        })
      }

      if (parseFloat(formData.designCost) > 0) {
        items.push({
          description: 'Design Cost',
          quantity: 1,
          unitPrice: parseFloat(formData.designCost),
          total: parseFloat(formData.designCost),
        })
      }

      items.push({
        description: 'Monthly Hosting & Services (12 months)',
        quantity: 12,
        unitPrice: parseFloat(formData.monthlyHosting),
        total: parseFloat(formData.monthlyHosting) * 12,
      })

      const subtotal = items.reduce((sum, item) => sum + item.total, 0)

      const quoteData = {
        title: formData.title,
        description: formData.description,
        clientId: formData.clientId || null,
        projectId: formData.projectId || null,
        items,
        subtotal,
        tax: 0,
        discount: 0,
        total: subtotal,
        validUntil: formData.validUntil || null,
        notes: formData.notes,
        terms: formData.terms,
        projectType: formData.projectType,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
        timeline: formData.timeline,
        techStack: formData.techStack,
        setupFee: parseFloat(formData.setupFee),
        developmentCost: parseFloat(formData.developmentCost || '0'),
        designCost: parseFloat(formData.designCost || '0'),
        monthlyHosting: parseFloat(formData.monthlyHosting),
        monthlyMaintenance: parseFloat(formData.monthlyMaintenance || '0'),
        hostingBreakdown: formData.hostingBreakdown,
        deliverables: formData.deliverables,
        milestones: formData.milestones,
        monthlyRecurring: parseFloat(formData.monthlyRecurring),
        yearlyRecurring: parseFloat(formData.yearlyRecurring),
      }

      const response = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Quote created successfully!')
        setCreatedQuote(data.quote)
        setShowSuccessModal(true)
        if (onQuoteCreated) {
          onQuoteCreated(data.quote)
        }
      } else {
        setError(data.error || 'Failed to create quote')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const totalSetup = 
    parseFloat(formData.setupFee || '0') + 
    parseFloat(formData.developmentCost || '0') + 
    parseFloat(formData.designCost || '0')

  const totalFirstYear = totalSetup + (parseFloat(formData.monthlyHosting || '0') * 12)
  
  // Ensure values are valid numbers
  const safeSetup = isNaN(totalSetup) ? 0 : totalSetup
  const safeFirstYear = isNaN(totalFirstYear) ? 0 : totalFirstYear
  
  const selectedClient = clients.find(c => c.id === formData.clientId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Professional Quote</h1>
            <p className="text-sm text-gray-600 mt-1">Select a template and customize to generate a detailed quote</p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit(new Event('submit') as any)}
              disabled={loading || !selectedTemplate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Creating...' : 'Create Quote'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-lg border border-green-200">
            <strong>Success!</strong> {success}
          </div>
        )}

        {/* Template Selection */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">📋 Step 1: Select Quote Template or Start Custom</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Custom Quote Option */}
              <button
                onClick={() => {
                  setSelectedTemplate({ id: 'custom' } as QuoteTemplate)
                  setFormData({
                    ...formData,
                    title: '',
                    description: '',
                    projectType: '',
                    estimatedHours: '',
                    timeline: '',
                    setupFee: '0',
                    developmentCost: '0',
                    designCost: '0',
                    monthlyHosting: '0',
                    monthlyMaintenance: '0',
                  })
                }}
                className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                  selectedTemplate?.id === 'custom'
                    ? 'border-purple-600 bg-purple-50 shadow-md'
                    : 'border-gray-300 hover:border-purple-400 border-dashed'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-purple-600">✨ Custom Quote</h3>
                  {selectedTemplate?.id === 'custom' && (
                    <span className="text-purple-600 text-xl">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">Start from scratch with full flexibility to customize everything</p>
                <div className="text-xs text-purple-600 font-medium mt-2 pt-2 border-t border-purple-200">
                  Build your own quote →
                </div>
              </button>

              {/* Existing Templates */}
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{template.name}</h3>
                    {selectedTemplate?.id === template.id && (
                      <span className="text-blue-600 text-xl">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Setup:</span>
                      <span className="font-bold text-green-600">${(template.setupFee || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Monthly:</span>
                      <span className="font-bold text-blue-600">${template.monthlyHosting || 0}/mo</span>
                    </div>
                    {template.estimatedHours > 0 && (
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                        ~{template.estimatedHours}hrs • {template.timeline}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Two Column Layout: Form + Preview */}
        {selectedTemplate && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">📝 Step 2: Quote Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Quote Title *
                        </label>
                        <Input
                          value={formData.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            setFormData({ ...formData, title: e.target.value })}
                          required
                          placeholder="e.g., Professional Website Development"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Client
                        </label>
                        <select
                          value={formData.clientId}
                          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option value="">Select a client...</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name} {client.company ? `(${client.company})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Description
                        </label>
                        <Textarea
                          value={formData.description}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                            setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          placeholder="Brief overview of the project..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-900">
                            Estimated Hours
                          </label>
                          <Input
                            type="number"
                            value={formData.estimatedHours}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setFormData({ ...formData, estimatedHours: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-900">
                            Timeline
                          </label>
                          <Input
                            value={formData.timeline}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setFormData({ ...formData, timeline: e.target.value })}
                            placeholder="e.g., 4-6 weeks"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Valid Until
                        </label>
                        <Input
                          type="date"
                          value={formData.validUntil}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            setFormData({ ...formData, validUntil: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Pricing */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">💰 Step 3: Pricing Breakdown</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Setup Fee *
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.setupFee}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            setFormData({ ...formData, setupFee: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Development Cost
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.developmentCost}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            setFormData({ ...formData, developmentCost: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Design Cost
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.designCost}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            setFormData({ ...formData, designCost: e.target.value })}
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Monthly Hosting *
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.monthlyHosting}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value
                            const monthly = parseFloat(value || '0') + parseFloat(formData.monthlyMaintenance || '0')
                            setFormData({ 
                              ...formData, 
                              monthlyHosting: value,
                              monthlyRecurring: monthly.toString(),
                              yearlyRecurring: (monthly * 12).toString()
                            })
                          }}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Monthly Maintenance
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.monthlyMaintenance}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value
                            const monthly = parseFloat(formData.monthlyHosting || '0') + parseFloat(value || '0')
                            setFormData({ 
                              ...formData, 
                              monthlyMaintenance: value,
                              monthlyRecurring: monthly.toString(),
                              yearlyRecurring: (monthly * 12).toString()
                            })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Development Details: Tech Stack, Features, Deliverables */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">🔧 Step 4: Development & Project Details</h3>
                    
                    {/* Tech Stack */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-gray-900">
                        Technology Stack
                      </label>
                      <div className="space-y-2">
                        {formData.techStack.map((tech, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={tech}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const newStack = [...formData.techStack]
                                newStack[index] = e.target.value
                                setFormData({ ...formData, techStack: newStack })
                              }}
                              placeholder="e.g., React, Next.js, TypeScript"
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                const newStack = formData.techStack.filter((_, i) => i !== index)
                                setFormData({ ...formData, techStack: newStack })
                              }}
                              className="bg-red-500 hover:bg-red-600 px-3"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            techStack: [...formData.techStack, ''] 
                          })}
                          className="bg-blue-500 hover:bg-blue-600 w-full"
                        >
                          + Add Technology
                        </Button>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-gray-900">
                        Key Features
                      </label>
                      <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={feature}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const newFeatures = [...formData.features]
                                newFeatures[index] = e.target.value
                                setFormData({ ...formData, features: newFeatures })
                              }}
                              placeholder="e.g., User authentication, Payment processing"
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                const newFeatures = formData.features.filter((_, i) => i !== index)
                                setFormData({ ...formData, features: newFeatures })
                              }}
                              className="bg-red-500 hover:bg-red-600 px-3"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            features: [...formData.features, ''] 
                          })}
                          className="bg-blue-500 hover:bg-blue-600 w-full"
                        >
                          + Add Feature
                        </Button>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-gray-900">
                        Project Deliverables
                      </label>
                      <div className="space-y-2">
                        {formData.deliverables.map((deliverable, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={deliverable}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const newDeliverables = [...formData.deliverables]
                                newDeliverables[index] = e.target.value
                                setFormData({ ...formData, deliverables: newDeliverables })
                              }}
                              placeholder="e.g., Fully functional website, Admin dashboard"
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                const newDeliverables = formData.deliverables.filter((_, i) => i !== index)
                                setFormData({ ...formData, deliverables: newDeliverables })
                              }}
                              className="bg-red-500 hover:bg-red-600 px-3"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            deliverables: [...formData.deliverables, ''] 
                          })}
                          className="bg-blue-500 hover:bg-blue-600 w-full"
                        >
                          + Add Deliverable
                        </Button>
                      </div>
                    </div>

                    {/* Development Phases */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-900">
                        Development Phases (For Quote Page 2)
                      </label>
                      <div className="space-y-4">
                        {formData.developmentPhases.map((phase, phaseIndex) => (
                          <div key={phaseIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                            <div className="flex gap-2 mb-3">
                              <div className="flex-1">
                                <Input
                                  value={phase.title}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newPhases = [...formData.developmentPhases]
                                    newPhases[phaseIndex].title = e.target.value
                                    setFormData({ ...formData, developmentPhases: newPhases })
                                  }}
                                  placeholder="Phase title (e.g., Design & Prototyping)"
                                  className="font-semibold"
                                />
                              </div>
                              <select
                                value={phase.color}
                                onChange={(e) => {
                                  const newPhases = [...formData.developmentPhases]
                                  newPhases[phaseIndex].color = e.target.value
                                  setFormData({ ...formData, developmentPhases: newPhases })
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                              >
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                                <option value="purple">Purple</option>
                                <option value="orange">Orange</option>
                                <option value="red">Red</option>
                                <option value="gray">Gray</option>
                              </select>
                              <Button
                                type="button"
                                onClick={() => {
                                  const newPhases = formData.developmentPhases.filter((_, i) => i !== phaseIndex)
                                  setFormData({ ...formData, developmentPhases: newPhases })
                                }}
                                className="bg-red-500 hover:bg-red-600 px-3"
                              >
                                ✕
                              </Button>
                            </div>
                            
                            <Textarea
                              value={phase.description}
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                const newPhases = [...formData.developmentPhases]
                                newPhases[phaseIndex].description = e.target.value
                                setFormData({ ...formData, developmentPhases: newPhases })
                              }}
                              placeholder="Phase description..."
                              rows={2}
                              className="mb-3"
                            />

                            <div className="space-y-2">
                              <label className="text-xs font-medium text-gray-700">Tasks/Deliverables:</label>
                              {phase.tasks.map((task, taskIndex) => (
                                <div key={taskIndex} className="flex gap-2">
                                  <Input
                                    value={task}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                      const newPhases = [...formData.developmentPhases]
                                      newPhases[phaseIndex].tasks[taskIndex] = e.target.value
                                      setFormData({ ...formData, developmentPhases: newPhases })
                                    }}
                                    placeholder="Task or deliverable"
                                    className="text-sm"
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      const newPhases = [...formData.developmentPhases]
                                      newPhases[phaseIndex].tasks = newPhases[phaseIndex].tasks.filter((_, i) => i !== taskIndex)
                                      setFormData({ ...formData, developmentPhases: newPhases })
                                    }}
                                    className="bg-red-400 hover:bg-red-500 px-2 text-sm"
                                  >
                                    ✕
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                onClick={() => {
                                  const newPhases = [...formData.developmentPhases]
                                  newPhases[phaseIndex].tasks.push('')
                                  setFormData({ ...formData, developmentPhases: newPhases })
                                }}
                                className="bg-green-500 hover:bg-green-600 w-full text-sm"
                              >
                                + Add Task
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            developmentPhases: [...formData.developmentPhases, {
                              title: '',
                              description: '',
                              tasks: [''],
                              color: 'blue'
                            }] 
                          })}
                          className="bg-blue-500 hover:bg-blue-600 w-full"
                        >
                          + Add Development Phase
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Notes & Terms */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">📄 Step 5: Additional Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Notes
                        </label>
                        <Textarea
                          value={formData.notes}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                            setFormData({ ...formData, notes: e.target.value })}
                          rows={3}
                          placeholder="Any additional notes or comments..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                          Terms & Conditions
                        </label>
                        <Textarea
                          value={formData.terms}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                            setFormData({ ...formData, terms: e.target.value })}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </form>
            </div>

            {/* RIGHT: Live Preview */}
            <div className="space-y-4">
              <Card>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
                  <h3 className="text-xl font-bold">📄 Multi-Page Quote Preview</h3>
                  <p className="text-blue-100 text-sm mt-1">Professional 3-page quote • Updates in real-time</p>
                </div>
                
                {/* PAGE 1: SERVICE OVERVIEW & PROJECT DETAILS */}
                <div className="p-8 bg-white border-b-4 border-gray-300">
                  {/* Company Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h1 className="text-4xl font-bold text-blue-600 mb-1">{companyProfile.name}</h1>
                      <p className="text-sm text-gray-600">{companyProfile.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{companyProfile.email} | {companyProfile.phone}</p>
                      {companyProfile.address && (
                        <p className="text-xs text-gray-500">{companyProfile.address}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Date: {new Date().toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">Quote #: QT-{Date.now().toString().slice(-6)}</div>
                      <div className="text-xs text-gray-500">Page: 1 of 3</div>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Service Quotation</h2>

                  {/* Client Information */}
                  <div className="mb-8 p-5 bg-gray-50 border border-gray-200 rounded">
                    <h3 className="font-bold text-lg mb-3 text-gray-900">Service Location / Client:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedClient ? selectedClient.name : 'Client Name'}
                        </p>
                        {selectedClient?.company && (
                          <p className="text-gray-600">ATTN: {selectedClient.company}</p>
                        )}
                        <p className="text-gray-600">{selectedClient?.email || 'client@email.com'}</p>
                      </div>
                      <div className="border-l pl-4">
                        <div className="space-y-1">
                          <div><span className="font-semibold">Project Type:</span> <span className="capitalize">{formData.projectType.replace(/-/g, ' ')}</span></div>
                          <div><span className="font-semibold">Timeline:</span> {formData.timeline || 'TBD'}</div>
                          <div><span className="font-semibold">Valid Until:</span> {formData.validUntil ? new Date(formData.validUntil).toLocaleDateString() : '30 days from issue'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Description */}
                  <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 bg-gray-100 p-3 rounded">
                      {formData.title || 'Project Title'}
                    </h3>
                    <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                      <p className="font-semibold">{formData.description || 'Project description will appear here...'}</p>
                      
                      {formData.features.length > 0 && (
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">Key Features:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            {formData.features.slice(0, 8).map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Technology Stack */}
                  {formData.techStack.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-bold text-lg mb-3 text-gray-900">Technology Stack:</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded text-sm font-medium border border-blue-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Scope Summary */}
                  <div className="mb-6 p-5 bg-blue-50 border-l-4 border-blue-600 rounded">
                    <h3 className="font-bold text-lg mb-3 text-gray-900">Project Scope Summary:</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-gray-600 uppercase mb-1">Estimated Hours</div>
                        <div className="font-bold text-xl text-blue-600">{formData.estimatedHours || '0'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 uppercase mb-1">Timeline</div>
                        <div className="font-bold text-lg">{formData.timeline || 'TBD'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 uppercase mb-1">Deliverables</div>
                        <div className="font-bold text-xl text-blue-600">{formData.deliverables.length}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAGE 2: BUILD PROCESS & DEVELOPMENT PHASES */}
                <div className="p-8 bg-white border-b-4 border-gray-300">
                  <div className="flex justify-between items-center mb-6 text-xs text-gray-500">
                    <span>Quote #: QT-{Date.now().toString().slice(-6)}</span>
                    <span>Page: 2 of 3</span>
                  </div>

                  <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b-2 border-gray-300 pb-3">
                    Development Process & Phases
                  </h2>

                  {/* Build Process Phases - Dynamic */}
                  <div className="space-y-6 mb-8">
                    {formData.developmentPhases.length > 0 ? (
                      formData.developmentPhases.map((phase, index) => {
                        const isCollapsed = collapsedPhases.has(index)
                        return (
                          <div key={index} className={`border-l-4 border-${phase.color}-600 pl-4 py-2`}>
                            <div 
                              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded" 
                              onClick={() => togglePhase(index)}
                            >
                              <h3 className={`font-bold text-lg text-${phase.color}-700`}>
                                Phase {index + 1}: {phase.title}
                              </h3>
                              <button 
                                type="button"
                                className="text-gray-600 hover:text-gray-900 font-bold text-2xl px-3 py-1 hover:bg-gray-200 rounded transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  togglePhase(index)
                                }}
                              >
                                {isCollapsed ? '+' : '−'}
                              </button>
                            </div>
                            {!isCollapsed && (
                              <div className="mt-3">
                                {phase.description && (
                                  <p className="text-sm text-gray-700 mb-2">
                                    {phase.description}
                                  </p>
                                )}
                                {phase.tasks.length > 0 && phase.tasks[0] !== '' && (
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                                    {phase.tasks.filter(task => task.trim() !== '').map((task, taskIdx) => (
                                      <li key={taskIdx}>{task}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })
                    ) : (
                      /* Default Phases if none are defined */
                      <>
                        <div className="border-l-4 border-blue-600 pl-4 py-2">
                          <h3 className="font-bold text-lg text-blue-700 mb-2">Phase 1: Discovery & Planning</h3>
                          <p className="text-sm text-gray-700 mb-2">
                            Initial consultation to understand your business goals, target audience, and project requirements. 
                            We&apos;ll create a detailed project roadmap and technical specifications document.
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                            <li>Requirements gathering and analysis</li>
                            <li>Competitive research and market analysis</li>
                            <li>Information architecture development</li>
                            <li>Project timeline and milestone planning</li>
                            <li>Technology stack finalization</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-green-600 pl-4 py-2">
                          <h3 className="font-bold text-lg text-green-700 mb-2">Phase 2: Design & Prototyping</h3>
                          <p className="text-sm text-gray-700 mb-2">
                            Creation of wireframes, mockups, and interactive prototypes. Design system development including 
                            color schemes, typography, and UI components aligned with your brand identity.
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                            <li>Wireframe creation for all key pages</li>
                            <li>High-fidelity mockup design</li>
                            <li>Interactive prototype development</li>
                            <li>Responsive design for mobile/tablet/desktop</li>
                            <li>Design review and client approval</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-purple-600 pl-4 py-2">
                          <h3 className="font-bold text-lg text-purple-700 mb-2">Phase 3: Development & Implementation</h3>
                          <p className="text-sm text-gray-700 mb-2">
                            Full-stack development using modern technologies. Building responsive front-end interfaces, 
                            robust back-end systems, database architecture, and API integrations.
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                            <li>Front-end development (HTML/CSS/JavaScript/React/Next.js)</li>
                            <li>Back-end API development and database setup</li>
                            <li>Content management system integration</li>
                            <li>Third-party service integrations</li>
                            <li>Performance optimization</li>
                            <li>Security implementation and SSL setup</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-orange-600 pl-4 py-2">
                          <h3 className="font-bold text-lg text-orange-700 mb-2">Phase 4: Testing & Quality Assurance</h3>
                          <p className="text-sm text-gray-700 mb-2">
                            Comprehensive testing across all devices and browsers. Bug fixing, performance testing, 
                            security audits, and user acceptance testing to ensure flawless functionality.
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                            <li>Cross-browser compatibility testing</li>
                            <li>Mobile responsiveness testing</li>
                            <li>Performance and load testing</li>
                            <li>Security vulnerability assessment</li>
                            <li>User acceptance testing (UAT)</li>
                            <li>Bug fixing and optimization</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-red-600 pl-4 py-2">
                          <h3 className="font-bold text-lg text-red-700 mb-2">Phase 5: Deployment & Launch</h3>
                          <p className="text-sm text-gray-700 mb-2">
                            Final deployment to production servers, DNS configuration, analytics setup, and go-live support. 
                            Post-launch monitoring and immediate issue resolution.
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                            <li>Production server setup and configuration</li>
                            <li>Domain and DNS configuration</li>
                            <li>SSL certificate installation</li>
                            <li>Analytics and tracking implementation</li>
                            <li>Final content migration</li>
                            <li>Launch day support and monitoring</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-gray-600 pl-4 py-2">
                          <h3 className="font-bold text-lg text-gray-700 mb-2">Phase 6: Training & Handover</h3>
                          <p className="text-sm text-gray-700 mb-2">
                            Comprehensive training for your team on managing and updating the website. Complete documentation 
                            and ongoing support to ensure you&apos;re confident managing your new platform.
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                            <li>Admin panel training session</li>
                            <li>Content management training</li>
                            <li>Complete technical documentation</li>
                            <li>Video tutorials for common tasks</li>
                            <li>Source code and asset handover</li>
                            <li>Post-launch support period</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Deliverables Checklist */}
                  {formData.deliverables.length > 0 && (
                    <div className="p-5 bg-green-50 border border-green-200 rounded">
                      <h3 className="font-bold text-lg mb-3 text-gray-900">Project Deliverables:</h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {formData.deliverables.map((item, index) => (
                          <div key={index} className="flex items-start text-sm">
                            <span className="text-green-600 mr-2 font-bold">✓</span>
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* PAGE 3: PRICING & TERMS */}
                <div className="p-8 bg-white">
                  <div className="flex justify-between items-center mb-6 text-xs text-gray-500">
                    <span>Quote #: QT-{Date.now().toString().slice(-6)}</span>
                    <span>Page: 3 of 3</span>
                  </div>

                  <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b-2 border-gray-300 pb-3">
                    Investment & Pricing Breakdown
                  </h2>

                  {/* Pricing Table */}
                  <div className="mb-8">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                          <th className="text-left p-3 font-semibold">#</th>
                          <th className="text-left p-3 font-semibold">Description</th>
                          <th className="text-center p-3 font-semibold">Quantity</th>
                          <th className="text-right p-3 font-semibold">Unit Price</th>
                          <th className="text-right p-3 font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="p-3">1</td>
                          <td className="p-3">
                            <div className="font-semibold">Setup & Initialization Fee</div>
                            <div className="text-sm text-gray-700 mt-1">Project setup, development environment, initial configuration</div>
                          </td>
                          <td className="text-center p-3">1</td>
                          <td className="text-right p-3">${parseFloat(formData.setupFee || '0').toLocaleString()}</td>
                          <td className="text-right p-3 font-semibold">${parseFloat(formData.setupFee || '0').toLocaleString()}</td>
                        </tr>
                        
                        {parseFloat(formData.developmentCost || '0') > 0 && (
                          <tr className="border-b border-gray-200">
                            <td className="p-3">2</td>
                            <td className="p-3">
                              <div className="font-semibold">Development Services</div>
                              <div className="text-sm text-gray-700 mt-1">Custom development work, coding, feature implementation</div>
                            </td>
                            <td className="text-center p-3">1</td>
                            <td className="text-right p-3">${parseFloat(formData.developmentCost || '0').toLocaleString()}</td>
                            <td className="text-right p-3 font-semibold">${parseFloat(formData.developmentCost || '0').toLocaleString()}</td>
                          </tr>
                        )}

                        {parseFloat(formData.designCost || '0') > 0 && (
                          <tr className="border-b border-gray-200">
                            <td className="p-3">{parseFloat(formData.developmentCost || '0') > 0 ? '3' : '2'}</td>
                            <td className="p-3">
                              <div className="font-semibold">Design Services</div>
                              <div className="text-sm text-gray-700 mt-1">UI/UX design, graphics, branding, visual assets</div>
                            </td>
                            <td className="text-center p-3">1</td>
                            <td className="text-right p-3">${parseFloat(formData.designCost || '0').toLocaleString()}</td>
                            <td className="text-right p-3 font-semibold">${parseFloat(formData.designCost || '0').toLocaleString()}</td>
                          </tr>
                        )}

                        <tr className="border-b border-gray-200 bg-blue-50">
                          <td className="p-3">{(parseFloat(formData.developmentCost || '0') > 0 ? 3 : 2) + (parseFloat(formData.designCost || '0') > 0 ? 1 : 0)}</td>
                          <td className="p-3">
                            <div className="font-semibold">Hosting & Maintenance Services</div>
                            <div className="text-sm text-gray-700 mt-1">Monthly hosting, SSL, backups, updates, technical support</div>
                          </td>
                          <td className="text-center p-3">12 months</td>
                          <td className="text-right p-3">${parseFloat(formData.monthlyHosting || '0').toLocaleString()}/mo</td>
                          <td className="text-right p-3 font-semibold">${(parseFloat(formData.monthlyHosting || '0') * 12).toLocaleString()}</td>
                        </tr>

                        {/* Subtotals */}
                        <tr className="border-t-2 border-gray-400">
                          <td colSpan={4} className="text-right p-3 font-semibold">Setup Total:</td>
                          <td className="text-right p-3 font-bold text-lg">${safeSetup.toLocaleString()}</td>
                        </tr>
                        <tr className="bg-green-100 border-t border-gray-300">
                          <td colSpan={4} className="text-right p-3 font-bold text-lg">FIRST YEAR TOTAL:</td>
                          <td className="text-right p-3 font-bold text-2xl text-green-700">${safeFirstYear.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Hosting Breakdown */}
                  {Object.keys(formData.hostingBreakdown).length > 0 && (
                    <div className="mb-8 p-5 bg-gray-50 border border-gray-200 rounded">
                      <h3 className="font-bold text-base mb-3 text-gray-900">Monthly Hosting Services Breakdown:</h3>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left p-2 font-semibold">Service</th>
                            <th className="text-right p-2 font-semibold">Monthly Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(formData.hostingBreakdown).map(([service, breakdown]: [string, any]) => (
                            <tr key={service} className="border-b border-gray-200">
                              <td className="p-2 text-gray-700">{service}</td>
                              <td className="text-right p-2 font-semibold">${breakdown.charge?.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="bg-blue-50 font-bold">
                            <td className="p-2">Total Monthly Hosting</td>
                            <td className="text-right p-2">${parseFloat(formData.monthlyHosting || '0').toFixed(2)}/month</td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="text-sm text-gray-700 mt-3 italic">
                        * Ongoing monthly investment after first year: ${parseFloat(formData.monthlyHosting || '0').toLocaleString()}/month 
                        (${(parseFloat(formData.monthlyHosting || '0') * 12).toLocaleString()}/year)
                      </p>
                    </div>
                  )}

                  {/* Payment Milestones */}
                  {formData.milestones.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-bold text-lg mb-4 text-gray-900">Payment Schedule:</h3>
                      <div className="space-y-2">
                        {formData.milestones.map((milestone: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-4 border border-gray-300 rounded bg-gray-50">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{milestone.name || 'Milestone'}</p>
                              <p className="text-sm text-gray-600">{milestone.due || 'TBD'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-green-700">${(milestone.amount || 0).toLocaleString()}</p>
                              <p className="text-sm text-gray-600">({milestone.percentage || 0}% of setup)</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Terms & Conditions */}
                  <div className="mb-6 p-5 border-2 border-gray-300 rounded bg-gray-50">
                    <h3 className="font-bold text-lg mb-3 text-gray-900">Terms & Conditions:</h3>
                    <div className="text-xs text-gray-700 space-y-2 leading-relaxed">
                      <p className="whitespace-pre-line">{formData.terms}</p>
                      
                      <div className="pt-3 border-t border-gray-300 mt-4 space-y-1">
                        <p><strong>Acceptance:</strong> This quote is valid for {formData.validUntil ? `until ${new Date(formData.validUntil).toLocaleDateString()}` : '30 days'}. All prices are in USD.</p>
                        <p><strong>Scope Changes:</strong> Any changes to the agreed scope may result in additional charges and timeline adjustments.</p>
                        <p><strong>Cancellation:</strong> Client may cancel within 7 days of signing. After development begins, cancellation fees apply.</p>
                        <p><strong>Support:</strong> Post-launch support is included for {formData.projectType === 'basic-website' ? '30' : formData.projectType === 'business-website' ? '60' : '90'} days. Extended support available separately.</p>
                        <p><strong>Ownership:</strong> Client owns all code and assets upon final payment. Source code provided via GitHub repository.</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {formData.notes && (
                    <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                      <h4 className="font-bold text-sm mb-2 text-gray-900">Additional Notes:</h4>
                      <p className="text-xs text-gray-700 whitespace-pre-line">{formData.notes}</p>
                    </div>
                  )}

                  {/* Signature Section */}
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-gray-300">
                    <div>
                      <p className="text-sm font-semibold mb-4">Accepted By (Client):</p>
                      <div className="border-b-2 border-gray-400 mb-2 h-12"></div>
                      <p className="text-xs text-gray-600">Signature</p>
                      <div className="border-b border-gray-300 mb-2 mt-4 h-8"></div>
                      <p className="text-xs text-gray-600">Date</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-4">Authorized Representative:</p>
                      <div className="border-b-2 border-gray-400 mb-2 h-12"></div>
                      <p className="text-xs text-gray-600">{companyProfile.name} - Service Provider</p>
                      <div className="border-b border-gray-300 mb-2 mt-4 h-8"></div>
                      <p className="text-xs text-gray-600">Date</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                    <p>Thank you for choosing {companyProfile.name} for your web development needs.</p>
                    <p className="mt-1">For questions regarding this quote, please contact us at {companyProfile.email} or {companyProfile.phone}</p>
                    {companyProfile.website && (
                      <p className="mt-1">Visit us: {companyProfile.website}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 space-y-3 print:hidden">
                    <button
                      onClick={handleGenerateQuote}
                      className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                    >
                      <span>📄</span>
                      <span>Generate Quote</span>
                    </button>
                    
                    <button
                      onClick={handleSaveAsDraft}
                      className="w-full px-6 py-4 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                    >
                      <span>�</span>
                      <span>Save as Draft</span>
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Generate to finalize and download PDF, or save as draft to continue later
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && createdQuote && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false)
            window.location.href = '/admin/quotes'
          }}
          title="Quote Created Successfully! 🎉"
        >
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium mb-2">
                ✓ Your quote has been created successfully!
              </p>
              <p className="text-green-700 text-sm">
                Choose what you&apos;d like to do next:
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Quote Number:</span>
                <span className="font-semibold text-gray-900">{createdQuote.quoteNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Project:</span>
                <span className="font-semibold text-gray-900">{formData.title || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-green-600 text-lg">
                  ${((parseFloat(formData.setupFee || '0') + parseFloat(formData.developmentCost || '0') + parseFloat(formData.designCost || '0') + (parseFloat(formData.monthlyHosting || '0') * 12)) || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDownloadCreatedQuote}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span>📥</span>
                <span>Download PDF</span>
              </button>
              
              <button
                onClick={handleSaveAsDraftAndClose}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>Save as Draft</span>
              </button>
              
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  window.location.href = '/admin/quotes'
                }}
                className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span>✓</span>
                <span>Done - Go to Quotes Dashboard</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
