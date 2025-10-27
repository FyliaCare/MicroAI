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
  developmentCost: number | null
  designCost: number | null
  monthlyHosting: number
  monthlyMaintenance: number | null
  estimatedHours: number | null
  timeline: string | null
  techStack: string | null
  features: string | null
  deliverables: string | null
  hostingBreakdown: string | null
  milestones: string | null
  actualCosts: string | null
  profitMargin: number | null
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
  // State
  const [templates, setTemplates] = useState<QuoteTemplate[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
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
    milestones: [] as any[],
    monthlyRecurring: '',
    yearlyRecurring: '',
    validUntil: '',
    notes: '',
    terms: '',
  })

  // Load templates and clients on mount
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
    
    // Parse JSON fields
    const techStack = template.techStack ? JSON.parse(template.techStack) : []
    const features = template.features ? JSON.parse(template.features) : []
    const deliverables = template.deliverables ? JSON.parse(template.deliverables) : []
    const hostingBreakdown = template.hostingBreakdown ? JSON.parse(template.hostingBreakdown) : {}
    const milestones = template.milestones ? JSON.parse(template.milestones) : []

    // Calculate recurring costs
    const monthlyRecurring = template.monthlyHosting + (template.monthlyMaintenance || 0)
    const yearlyRecurring = monthlyRecurring * 12

    // Auto-populate form
    setFormData({
      ...formData,
      title: template.name,
      description: template.description || '',
      projectType: template.category,
      estimatedHours: template.estimatedHours?.toString() || '',
      timeline: template.timeline || '',
      techStack,
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
      // Build line items for quote
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
        description: 'Monthly Hosting & Services',
        quantity: 12,
        unitPrice: parseFloat(formData.monthlyHosting),
        total: parseFloat(formData.monthlyHosting) * 12,
      })

      // Calculate subtotal
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
        // Enhanced fields
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
        // Reset form
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

  const totalFirstYear = 
    parseFloat(formData.setupFee || '0') + 
    parseFloat(formData.developmentCost || '0') + 
    parseFloat(formData.designCost || '0') + 
    (parseFloat(formData.monthlyHosting || '0') * 12)

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Create Quote from Template</h2>
          
          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Template
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-green-600">
                      Setup: ${template.setupFee}
                    </p>
                    <p className="font-semibold text-blue-600">
                      ${template.monthlyHosting}/month
                    </p>
                    {template.estimatedHours && (
                      <p className="text-gray-500">
                        ~{template.estimatedHours} hours
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quote Form */}
          {selectedTemplate && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg">
                  {success}
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quote Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                    required
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Pricing Breakdown */}
              <div>
                <h3 className="text-lg font-bold mb-4">Pricing Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Setup Fee *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.setupFee}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, setupFee: e.target.value })}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, developmentCost: e.target.value })}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, designCost: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Monthly Hosting *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.monthlyHosting}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, monthlyHosting: e.target.value })}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, monthlyMaintenance: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Valid Until
                    </label>
                    <Input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, validUntil: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Hosting Breakdown */}
              {Object.keys(formData.hostingBreakdown).length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Hosting Services Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Service</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Your Cost</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Client Price</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Profit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(formData.hostingBreakdown).map(([service, breakdown]: [string, any]) => (
                          <tr key={service}>
                            <td className="px-4 py-2 text-sm">{service}</td>
                            <td className="px-4 py-2 text-sm text-right">${breakdown.cost?.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-right font-semibold">${breakdown.charge?.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-right text-green-600">
                              +${breakdown.profit?.toFixed(2)}
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
                <div>
                  <h3 className="text-lg font-bold mb-2">Technology Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables */}
              {formData.deliverables.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-2">Deliverables</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {formData.deliverables.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Milestones */}
              {formData.milestones.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Payment Milestones</h3>
                  <div className="space-y-2">
                    {formData.milestones.map((milestone: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{milestone.name}</p>
                          <p className="text-sm text-gray-600">{milestone.due}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${milestone.amount}</p>
                          <p className="text-sm text-gray-600">{milestone.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estimated Hours
                  </label>
                  <Input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Timeline
                  </label>
                  <Input
                    value={formData.timeline}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, timeline: e.target.value })}
                  />
                </div>
              </div>

              {/* Notes & Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Terms & Conditions
                  </label>
                  <Textarea
                    value={formData.terms}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, terms: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Quote Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Setup Fee:</span>
                    <span className="font-semibold">${parseFloat(formData.setupFee || '0').toFixed(2)}</span>
                  </div>
                  {parseFloat(formData.developmentCost || '0') > 0 && (
                    <div className="flex justify-between">
                      <span>Development Cost:</span>
                      <span className="font-semibold">${parseFloat(formData.developmentCost).toFixed(2)}</span>
                    </div>
                  )}
                  {parseFloat(formData.designCost || '0') > 0 && (
                    <div className="flex justify-between">
                      <span>Design Cost:</span>
                      <span className="font-semibold">${parseFloat(formData.designCost).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Hosting (12 months):</span>
                    <span className="font-semibold">${(parseFloat(formData.monthlyHosting || '0') * 12).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                    <span className="text-lg font-bold">First Year Total:</span>
                    <span className="text-lg font-bold text-green-600">${totalFirstYear.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ongoing (monthly):</span>
                    <span>${parseFloat(formData.monthlyHosting || '0').toFixed(2)}/month</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => window.history.back()}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Creating...' : 'Create Quote'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}
