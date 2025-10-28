'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'

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
  const [uploadingLogo, setUploadingLogo] = useState(false)

  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: 'MicroAI Systems',
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
    loadCompanyProfile()
    loadTermsOfService()
  }, [])

  const loadCompanyProfile = () => {
    try {
      const saved = localStorage.getItem('companyProfile')
      if (saved) {
        setCompanyProfile(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading company profile:', error)
    }
  }

  const loadTermsOfService = () => {
    try {
      const saved = localStorage.getItem('termsOfService')
      if (saved) {
        setTermsOfService(saved)
      }
    } catch (error) {
      console.error('Error loading terms:', error)
    }
  }

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
    // Check if phases are already loaded from localStorage
    const saved = localStorage.getItem('developmentPhases')
    if (saved) {
      try {
        setPhases(JSON.parse(saved))
        return
      } catch (error) {
        console.error('Error parsing saved phases:', error)
      }
    }

    // Otherwise use default phases
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const response = await fetch('/api/admin/upload-logo', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setCompanyProfile({ ...companyProfile, logo: data.logoUrl })
        alert('Logo uploaded successfully!')
      } else {
        alert(data.error || 'Failed to upload logo')
      }
    } catch (err) {
      alert('Failed to upload logo')
      console.error('Upload error:', err)
    } finally {
      setUploadingLogo(false)
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

              <div>
                <Input
                  label="Logo URL"
                  value={companyProfile.logo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyProfile({ ...companyProfile, logo: e.target.value })}
                  placeholder="https://example.com/logo.png or /logo.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the URL to your logo image, or use a path relative to your public folder (e.g., /logo.png)
                </p>

                {/* Logo Upload Section */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Or upload a logo:</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 disabled:opacity-50"
                    />
                    {uploadingLogo && (
                      <span className="text-sm text-purple-600">Uploading...</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Accepted formats: PNG, JPG, SVG, WebP (max 5MB)
                  </p>
                </div>

                {companyProfile.logo && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Logo Preview:</p>
                    <img 
                      src={companyProfile.logo} 
                      alt="Company Logo Preview" 
                      className="h-16 w-auto object-contain border border-gray-200 rounded p-2 bg-white"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.style.display = 'none'
                        const parent = img.parentElement
                        if (parent && !parent.querySelector('.error-message')) {
                          const errorMsg = document.createElement('p')
                          errorMsg.className = 'error-message text-sm text-red-600 mt-2'
                          errorMsg.textContent = 'Failed to load logo. Please check the URL or upload a new file.'
                          parent.appendChild(errorMsg)
                        }
                      }}
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement
                        img.style.display = 'block'
                        const parent = img.parentElement
                        const errorMsg = parent?.querySelector('.error-message')
                        if (errorMsg) errorMsg.remove()
                      }}
                    />
                  </div>
                )}
              </div>

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

      {/* Template Edit Modal */}
      {showTemplateModal && editingTemplate && (
        <Modal
          isOpen={showTemplateModal}
          onClose={() => {
            setShowTemplateModal(false)
            setEditingTemplate(null)
          }}
          title={editingTemplate.id ? 'Edit Template' : 'Create New Template'}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveTemplate(editingTemplate)
            }}
            className="space-y-4"
          >
            <Input
              label="Template Name"
              value={editingTemplate.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditingTemplate({ ...editingTemplate, name: e.target.value })
              }
              required
            />

            <Textarea
              label="Description"
              value={editingTemplate.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEditingTemplate({ ...editingTemplate, description: e.target.value })
              }
              rows={2}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingTemplate.category}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value="website">Website</option>
                  <option value="webapp">Web App</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="mobile">Mobile App</option>
                  <option value="api">API Development</option>
                </select>
              </div>

              <Input
                label="Estimated Hours"
                type="number"
                value={editingTemplate.estimatedHours.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditingTemplate({ ...editingTemplate, estimatedHours: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <Input
              label="Timeline"
              value={editingTemplate.timeline}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditingTemplate({ ...editingTemplate, timeline: e.target.value })
              }
              placeholder="e.g., 4-6 weeks"
            />

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Pricing</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Setup Fee"
                  type="number"
                  step="0.01"
                  value={editingTemplate.setupFee.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditingTemplate({ ...editingTemplate, setupFee: parseFloat(e.target.value) || 0 })
                  }
                />

                <Input
                  label="Development Cost"
                  type="number"
                  step="0.01"
                  value={editingTemplate.developmentCost.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditingTemplate({ ...editingTemplate, developmentCost: parseFloat(e.target.value) || 0 })
                  }
                />

                <Input
                  label="Design Cost"
                  type="number"
                  step="0.01"
                  value={editingTemplate.designCost.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditingTemplate({ ...editingTemplate, designCost: parseFloat(e.target.value) || 0 })
                  }
                />

                <Input
                  label="Monthly Hosting"
                  type="number"
                  step="0.01"
                  value={editingTemplate.monthlyHosting.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditingTemplate({ ...editingTemplate, monthlyHosting: parseFloat(e.target.value) || 0 })
                  }
                />

                <Input
                  label="Monthly Maintenance"
                  type="number"
                  step="0.01"
                  value={editingTemplate.monthlyMaintenance.toString()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditingTemplate({ ...editingTemplate, monthlyMaintenance: parseFloat(e.target.value) || 0 })
                  }
                />

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingTemplate.isActive}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active Template
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? 'Saving...' : editingTemplate.id ? 'Update Template' : 'Create Template'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowTemplateModal(false)
                  setEditingTemplate(null)
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Phase Edit Modal */}
      {showPhaseModal && editingPhase && (
        <Modal
          isOpen={showPhaseModal}
          onClose={() => {
            setShowPhaseModal(false)
            setEditingPhase(null)
          }}
          title={editingPhase.id ? 'Edit Phase' : 'Create New Phase'}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (editingPhase.id) {
                const updatedPhases = phases.map(p => p.id === editingPhase.id ? editingPhase : p)
                setPhases(updatedPhases)
              } else {
                setPhases([...phases, { ...editingPhase, id: Date.now().toString() }])
              }
              setShowPhaseModal(false)
              setEditingPhase(null)
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phase Name"
                value={editingPhase.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditingPhase({ ...editingPhase, name: e.target.value })
                }
                required
              />

              <Input
                label="Icon"
                value={editingPhase.icon}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditingPhase({ ...editingPhase, icon: e.target.value })
                }
                placeholder="📋"
              />
            </div>

            <Input
              label="Duration"
              value={editingPhase.duration}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditingPhase({ ...editingPhase, duration: e.target.value })
              }
              placeholder="e.g., 1-2 weeks"
            />

            <Textarea
              label="Description"
              value={editingPhase.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEditingPhase({ ...editingPhase, description: e.target.value })
              }
              rows={3}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <select
                value={editingPhase.color}
                onChange={(e) =>
                  setEditingPhase({ ...editingPhase, color: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-gray-900"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
                <option value="red">Red</option>
                <option value="gray">Gray</option>
                <option value="indigo">Indigo</option>
                <option value="pink">Pink</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deliverables</label>
              <div className="space-y-2">
                {editingPhase.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => {
                        const newDeliverables = [...editingPhase.deliverables]
                        newDeliverables[index] = e.target.value
                        setEditingPhase({ ...editingPhase, deliverables: newDeliverables })
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400"
                      placeholder="Deliverable item"
                    />
                    {editingPhase.deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newDeliverables = editingPhase.deliverables.filter((_, i) => i !== index)
                          setEditingPhase({ ...editingPhase, deliverables: newDeliverables })
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingPhase({
                    ...editingPhase,
                    deliverables: [...editingPhase.deliverables, '']
                  })
                }}
                className="mt-2 px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded"
              >
                + Add Deliverable
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                {editingPhase.id ? 'Update Phase' : 'Create Phase'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowPhaseModal(false)
                  setEditingPhase(null)
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
