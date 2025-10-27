'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

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
    monthlyRecurring: '',
    yearlyRecurring: '',
    validUntil: '',
    notes: '',
    terms: 'Payment terms: 50% upfront, 50% upon completion. All prices in USD. Quote valid for 30 days.',
  })

  useEffect(() => {
    fetchTemplates()
    fetchClients()
  }, [])

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
        if (onQuoteCreated) {
          onQuoteCreated(data.quote)
        }
        setTimeout(() => {
          window.location.href = '/admin/quotes'
        }, 1500)
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
            <h2 className="text-lg font-bold mb-4">📋 Step 1: Select Quote Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <span className="font-bold text-green-600">${template.setupFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Monthly:</span>
                      <span className="font-bold text-blue-600">${template.monthlyHosting}/mo</span>
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
                    <h3 className="text-lg font-bold mb-4">📝 Step 2: Quote Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
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
                        <label className="block text-sm font-medium mb-2">
                          Client
                        </label>
                        <select
                          value={formData.clientId}
                          onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <label className="block text-sm font-medium mb-2">
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
                          <label className="block text-sm font-medium mb-2">
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
                          <label className="block text-sm font-medium mb-2">
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
                        <label className="block text-sm font-medium mb-2">
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
                    <h3 className="text-lg font-bold mb-4">💰 Step 3: Pricing Breakdown</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
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
                        <label className="block text-sm font-medium mb-2">
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
                        <label className="block text-sm font-medium mb-2">
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
                        <label className="block text-sm font-medium mb-2">
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
                        <label className="block text-sm font-medium mb-2">
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

                {/* Notes & Terms */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">📄 Step 4: Additional Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
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
                        <label className="block text-sm font-medium mb-2">
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
            <div className="lg:sticky lg:top-24 h-fit">
              <Card>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
                  <h3 className="text-xl font-bold">📄 Live Quote Preview</h3>
                  <p className="text-blue-100 text-sm mt-1">Updates in real-time as you fill the form</p>
                </div>
                
                <div className="p-8 bg-white">
                  {/* Quote Header */}
                  <div className="mb-6 pb-6 border-b-2 border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {formData.title || 'Quote Title'}
                        </h1>
                        <p className="text-gray-600 text-sm">
                          {formData.description || 'No description provided'}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xs text-gray-500 uppercase mb-1">Quote For:</div>
                        <div className="font-semibold text-gray-900">
                          {selectedClient ? selectedClient.name : 'No client selected'}
                        </div>
                        {selectedClient?.company && (
                          <div className="text-sm text-gray-600">{selectedClient.company}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500 uppercase mb-1">Project Type</div>
                      <div className="font-semibold capitalize">{formData.projectType.replace('-', ' ') || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase mb-1">Timeline</div>
                      <div className="font-semibold">{formData.timeline || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase mb-1">Estimated Hours</div>
                      <div className="font-semibold">{formData.estimatedHours || '0'} hours</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase mb-1">Valid Until</div>
                      <div className="font-semibold text-sm">
                        {formData.validUntil ? new Date(formData.validUntil).toLocaleDateString() : '30 days'}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-4 text-gray-900">Cost Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2.5 border-b border-gray-200">
                        <span className="text-gray-700">Setup Fee</span>
                        <span className="font-semibold">${parseFloat(formData.setupFee || '0').toLocaleString()}</span>
                      </div>
                      {parseFloat(formData.developmentCost || '0') > 0 && (
                        <div className="flex justify-between py-2.5 border-b border-gray-200">
                          <span className="text-gray-700">Development Cost</span>
                          <span className="font-semibold">${parseFloat(formData.developmentCost).toLocaleString()}</span>
                        </div>
                      )}
                      {parseFloat(formData.designCost || '0') > 0 && (
                        <div className="flex justify-between py-2.5 border-b border-gray-200">
                          <span className="text-gray-700">Design Cost</span>
                          <span className="font-semibold">${parseFloat(formData.designCost).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2.5 border-b border-gray-200">
                        <span className="text-gray-700">Hosting & Services <span className="text-sm text-gray-500">(12 months)</span></span>
                        <span className="font-semibold">${(parseFloat(formData.monthlyHosting || '0') * 12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-4 bg-blue-50 px-4 rounded-lg mt-4">
                        <span className="font-bold text-lg">Setup Total</span>
                        <span className="font-bold text-lg text-blue-600">${totalSetup.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-4 bg-green-50 px-4 rounded-lg border-2 border-green-200">
                        <span className="font-bold text-xl">First Year Total</span>
                        <span className="font-bold text-xl text-green-600">${totalFirstYear.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 px-2 text-sm text-gray-600 bg-gray-50 rounded mt-2">
                        <span>Ongoing Monthly</span>
                        <span className="font-semibold">${parseFloat(formData.monthlyHosting || '0').toLocaleString()}/month</span>
                      </div>
                    </div>
                  </div>

                  {/* Hosting Breakdown */}
                  {Object.keys(formData.hostingBreakdown).length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-lg mb-3 text-gray-900">Hosting Services Included</h4>
                      <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">Service</th>
                              <th className="px-4 py-3 text-right font-semibold text-gray-700">Monthly Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {Object.entries(formData.hostingBreakdown).map(([service, breakdown]: [string, any]) => (
                              <tr key={service} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">{service}</td>
                                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                  ${breakdown.charge?.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Tech Stack */}
                  {formData.techStack.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-lg mb-3 text-gray-900">Technology Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deliverables */}
                  {formData.deliverables.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-lg mb-3 text-gray-900">Deliverables</h4>
                      <ul className="space-y-2.5">
                        {formData.deliverables.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-3 mt-0.5 text-lg">✓</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Milestones */}
                  {formData.milestones.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-lg mb-3 text-gray-900">Payment Milestones</h4>
                      <div className="space-y-2.5">
                        {formData.milestones.map((milestone: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                              <p className="font-semibold text-gray-900">{milestone.name}</p>
                              <p className="text-sm text-gray-600 mt-0.5">{milestone.due}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-green-600">${milestone.amount?.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{milestone.percentage}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Terms */}
                  {formData.terms && (
                    <div className="pt-6 border-t-2 border-gray-200">
                      <h4 className="font-bold text-sm mb-2 text-gray-700 uppercase">Terms & Conditions</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{formData.terms}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {formData.notes && (
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <h4 className="font-bold text-sm mb-2 text-gray-700 uppercase">Additional Notes</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{formData.notes}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
