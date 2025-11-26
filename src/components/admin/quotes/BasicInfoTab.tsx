'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Briefcase,
  Calendar,
  Search,
  Plus,
  Check
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Client {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  address?: string
}

interface BasicInfoTabProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export default function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showClientModal, setShowClientModal] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoadingClients(true)
      const res = await fetch('/api/admin/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error('Failed to load clients:', error)
    } finally {
      setLoadingClients(false)
    }
  }

  const handleCreateClient = async () => {
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      })

      if (res.ok) {
        const data = await res.json()
        const client = data.client
        
        // Add to clients list
        setClients([...clients, client])
        
        // Select the new client
        selectClient(client)
        
        // Reset form and close modal
        setNewClient({ name: '', email: '', company: '', phone: '', address: '' })
        setShowClientModal(false)
      }
    } catch (error) {
      console.error('Failed to create client:', error)
    }
  }

  const selectClient = (client: Client) => {
    updateFormData('clientId', client.id)
    updateFormData('clientName', client.name)
    updateFormData('clientEmail', client.email)
    updateFormData('clientCompany', client.company || '')
    updateFormData('clientPhone', client.phone || '')
    updateFormData('clientAddress', client.address || '')
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const projectTypes = [
    { value: 'web-application', label: 'Web Application' },
    { value: 'mobile-app', label: 'Mobile Application' },
    { value: 'e-commerce', label: 'E-Commerce' },
    { value: 'website', label: 'Website' },
    { value: 'api', label: 'API Development' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'maintenance', label: 'Maintenance & Support' },
    { value: 'custom', label: 'Custom Project' }
  ]

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'retail', label: 'Retail & E-Commerce' },
    { value: 'education', label: 'Education' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'hospitality', label: 'Hospitality & Tourism' },
    { value: 'logistics', label: 'Logistics & Transportation' },
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'nonprofit', label: 'Non-Profit' },
    { value: 'government', label: 'Government' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="space-y-6">
      {/* Client Selection */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-600" />
            <span>Client Information</span>
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowClientModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Client</span>
          </Button>
        </div>

        {/* Search Clients */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Client List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {loadingClients ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2">Loading clients...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No clients found</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowClientModal(true)}
                className="mt-4"
              >
                Create First Client
              </Button>
            </div>
          ) : (
            filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => selectClient(client)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  formData.clientId === client.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{client.name}</h3>
                      {formData.clientId === client.id && (
                        <Check className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{client.email}</p>
                    {client.company && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>{client.company}</span>
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Selected Client Details */}
        {formData.clientId && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{formData.clientName}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center space-x-2 text-gray-900">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{formData.clientEmail}</span>
                </div>
              </div>
              {formData.clientCompany && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{formData.clientCompany}</span>
                  </div>
                </div>
              )}
              {formData.clientPhone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{formData.clientPhone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Quote Details */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>Quote Details</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quote Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="e.g., Website Redesign & Development"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Type *
            </label>
            <select
              value={formData.projectType}
              onChange={(e) => updateFormData('projectType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {projectTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              value={formData.industry}
              onChange={(e) => updateFormData('industry', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {industries.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>

          {/* Valid Until Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valid Until *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.validUntil ? new Date(formData.validUntil).toISOString().split('T')[0] : ''}
                onChange={(e) => updateFormData('validUntil', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Quote Number (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote Number
            </label>
            <input
              type="text"
              value={formData.quoteNumber}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>
      </Card>

      {/* Project Description */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>

        <div className="space-y-6">
          {/* Executive Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Executive Summary
              <span className="text-gray-500 font-normal ml-2">
                (Brief overview for decision makers)
              </span>
            </label>
            <textarea
              value={formData.executiveSummary}
              onChange={(e) => updateFormData('executiveSummary', e.target.value)}
              placeholder="A concise summary of the project value proposition and key benefits..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
              <span className="text-gray-500 font-normal ml-2">
                (Complete project description)
              </span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Provide a comprehensive description of the project requirements, goals, and expected outcomes..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </Card>

      {/* New Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Client</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="123 Main St, City, Country"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowClientModal(false)
                  setNewClient({ name: '', email: '', company: '', phone: '', address: '' })
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateClient}
                disabled={!newClient.name || !newClient.email}
                className="flex-1"
              >
                Create Client
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
