'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Card from '@/components/ui/Card'

interface QuoteTemplate {
  id: string
  name: string
  description: string
  category: string
  setupFee: number
  developmentCost: number
  designCost: number
  monthlyHosting: number
  monthlyMaintenance: number
  estimatedHours: number
  timeline: string
  features: string[]
  deliverables: string[]
  techStack: string[]
  isActive: boolean
}

interface CompanyProfile {
  name: string
  email: string
  phone: string
  address: string
  website: string
  logo: string
  taxId: string
  description: string
}

interface DevelopmentPhase {
  id: string
  name: string
  description: string
  duration: string
  deliverables: string[]
  color: string
  icon: string
}

export default function AdvancedSettingsManager() {
  const [activeTab, setActiveTab] = useState<'templates' | 'company' | 'terms' | 'phases'>('templates')
  const [templates, setTemplates] = useState<QuoteTemplate[]>([])
  const [phases, setPhases] = useState<DevelopmentPhase[]>([])
  const [editingTemplate, setEditingTemplate] = useState<QuoteTemplate | null>(null)
  const [editingPhase, setEditingPhase] = useState<DevelopmentPhase | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showPhaseModal, setShowPhaseModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: 'MicroAI',
    email: 'contact@microai.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    website: 'https://microai.com',
    logo: '',
    taxId: '12-3456789',
    description: 'Professional web development and AI solutions'
  })

  // Terms of Service State
  const [termsOfService, setTermsOfService] = useState(`1. SCOPE OF WORK
The scope of work is defined in the quote above. Any additional features or changes will be billed separately.

2. PAYMENT TERMS
- 50% deposit required to begin work
- 50% due upon project completion
- Monthly hosting fees due on the 1st of each month

3. TIMELINE
Timeline estimates are approximate and may vary based on client feedback and revisions.

4. CANCELLATION POLICY
Projects cancelled after work has begun will be charged for work completed.

5. INTELLECTUAL PROPERTY
All code and designs become client property upon final payment.

6. SUPPORT & MAINTENANCE
30 days of free support included. Extended support available separately.`)

  useEffect(() => {
    fetchTemplates()
    fetchPhases()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/quote-templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const fetchPhases = async () => {
    // For now, use default phases - can be enhanced to fetch from API
    setPhases([
      {
        id: '1',
        name: 'Discovery & Planning',
        description: 'Initial consultation, requirements gathering, project scope definition',
        duration: '1-2 weeks',
        deliverables: ['Project brief', 'Technical specifications', 'Project timeline'],
        color: 'blue',
        icon: '🔍'
      },
      {
        id: '2',
        name: 'Design',
        description: 'UI/UX design, mockups, prototypes, client review and approval',
        duration: '2-3 weeks',
        deliverables: ['Wireframes', 'Design mockups', 'Prototype'],
        color: 'green',
        icon: '🎨'
      },
      {
        id: '3',
        name: 'Development',
        description: 'Frontend and backend development, database setup, API integration',
        duration: '4-6 weeks',
        deliverables: ['Functional website', 'Admin panel', 'Database'],
        color: 'purple',
        icon: '💻'
      },
      {
        id: '4',
        name: 'Testing & QA',
        description: 'Bug fixing, cross-browser testing, performance optimization',
        duration: '1-2 weeks',
        deliverables: ['Test reports', 'Bug fixes', 'Performance audit'],
        color: 'orange',
        icon: '🧪'
      },
      {
        id: '5',
        name: 'Deployment',
        description: 'Server setup, domain configuration, SSL installation, go-live',
        duration: '3-5 days',
        deliverables: ['Live website', 'SSL certificate', 'Backup system'],
        color: 'red',
        icon: '🚀'
      },
      {
        id: '6',
        name: 'Training & Handover',
        description: 'Client training, documentation, ongoing support setup',
        duration: '1 week',
        deliverables: ['Documentation', 'Training videos', 'Support access'],
        color: 'gray',
        icon: '📚'
      }
    ])
  }

  const handleSaveTemplate = async (template: QuoteTemplate) => {
    setLoading(true)
    try {
      const url = template.id ? `/api/admin/quote-templates/${template.id}` : '/api/admin/quote-templates'
      const method = template.id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      })

      if (response.ok) {
        await fetchTemplates()
        setShowTemplateModal(false)
        setEditingTemplate(null)
        alert('Template saved successfully!')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const response = await fetch(`/api/admin/quote-templates/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchTemplates()
        alert('Template deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Failed to delete template')
    }
  }

  const handleSaveCompanyProfile = async () => {
    setLoading(true)
    try {
      // Save to localStorage for now - can be enhanced with API
      localStorage.setItem('companyProfile', JSON.stringify(companyProfile))
      alert('Company profile saved successfully!')
    } catch (error) {
      console.error('Error saving company profile:', error)
      alert('Failed to save company profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTerms = async () => {
    setLoading(true)
    try {
      // Save to localStorage for now - can be enhanced with API
      localStorage.setItem('termsOfService', termsOfService)
      alert('Terms of service saved successfully!')
    } catch (error) {
      console.error('Error saving terms:', error)
      alert('Failed to save terms')
    } finally {
      setLoading(false)
    }
  }

  const handleSavePhases = async () => {
    setLoading(true)
    try {
      // Save to localStorage for now - can be enhanced with API
      localStorage.setItem('developmentPhases', JSON.stringify(phases))
      alert('Development phases saved successfully!')
    } catch (error) {
      console.error('Error saving phases:', error)
      alert('Failed to save phases')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </h1>
        <p className="text-gray-600 mt-1">Manage templates, company profile, and system settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Quote Templates
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'company'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏢 Company Profile
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'terms'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📄 Terms of Service
            </button>
            <button
              onClick={() => setActiveTab('phases')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'phases'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔄 Development Phases
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Quote Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Quote Templates</h2>
                <Button
                  onClick={() => {
                    setEditingTemplate({
                      id: '',
                      name: '',
                      description: '',
                      category: 'website',
                      setupFee: 0,
                      developmentCost: 0,
                      designCost: 0,
                      monthlyHosting: 0,
                      monthlyMaintenance: 0,
                      estimatedHours: 0,
                      timeline: '',
                      features: [''],
                      deliverables: [''],
                      techStack: [''],
                      isActive: true
                    })
                    setShowTemplateModal(true)
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  + Add Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Setup:</span>
                          <span className="font-semibold text-gray-900">${template.setupFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Monthly:</span>
                          <span className="font-semibold text-gray-900">${template.monthlyHosting}/mo</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Hours:</span>
                          <span className="font-semibold text-gray-900">{template.estimatedHours}h</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingTemplate(template)
                            setShowTemplateModal(true)
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                        >
                          Edit
                        </Button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Company Profile Tab */}
          {activeTab === 'company' && (
            <div className="max-w-3xl space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Company Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  value={companyProfile.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyProfile({ ...companyProfile, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={companyProfile.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyProfile({ ...companyProfile, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={companyProfile.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyProfile({ ...companyProfile, phone: e.target.value })}
                />
                <Input
                  label="Website"
                  type="url"
                  value={companyProfile.website}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyProfile({ ...companyProfile, website: e.target.value })}
                />
                <Input
                  label="Tax ID"
                  value={companyProfile.taxId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyProfile({ ...companyProfile, taxId: e.target.value })}
                />
              </div>

              <Input
                label="Address"
                value={companyProfile.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyProfile({ ...companyProfile, address: e.target.value })}
              />

              <Textarea
                label="Company Description"
                value={companyProfile.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCompanyProfile({ ...companyProfile, description: e.target.value })}
                rows={3}
              />

              <Button
                onClick={handleSaveCompanyProfile}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Saving...' : 'Save Company Profile'}
              </Button>
            </div>
          )}

          {/* Terms of Service Tab */}
          {activeTab === 'terms' && (
            <div className="max-w-3xl space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Terms of Service</h2>
              <p className="text-sm text-gray-600">
                These terms will appear on all quotes. Customize them to match your business policies.
              </p>

              <Textarea
                value={termsOfService}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTermsOfService(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />

              <Button
                onClick={handleSaveTerms}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Saving...' : 'Save Terms of Service'}
              </Button>
            </div>
          )}

          {/* Development Phases Tab */}
          {activeTab === 'phases' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Development Phases</h2>
                <Button
                  onClick={() => {
                    setEditingPhase({
                      id: '',
                      name: '',
                      description: '',
                      duration: '',
                      deliverables: [''],
                      color: 'blue',
                      icon: '📋'
                    })
                    setShowPhaseModal(true)
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  + Add Phase
                </Button>
              </div>

              <div className="space-y-4">
                {phases.map((phase, index) => (
                  <Card key={phase.id} className="hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl border-l-4 border-${phase.color}-500 pl-4`}>
                          {phase.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{phase.name}</h3>
                              <p className="text-sm text-gray-600">{phase.duration}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingPhase(phase)
                                  setShowPhaseModal(true)
                                }}
                                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{phase.description}</p>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Deliverables:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {phase.deliverables.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                onClick={handleSavePhases}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Saving...' : 'Save Phase Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
