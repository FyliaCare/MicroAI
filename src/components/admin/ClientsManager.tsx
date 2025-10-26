'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  website?: string
  address?: string
  notes?: string
  status: string
  createdAt: string
  projects?: any[]
  quotes?: any[]
  _count?: {
    projects: number
    quotes: number
    invoices: number
  }
}

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [filterStatus, setFilterStatus] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    address: '',
    notes: '',
    status: 'active',
  })

  useEffect(() => {
    fetchClients()
  }, [filterStatus])

  const fetchClients = async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.append('status', filterStatus)
      
      const response = await fetch(`/api/admin/clients?${params}`)
      const data = await response.json()
      if (data.success) {
        setClients(data.clients)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingClient
        ? `/api/admin/clients/${editingClient.id}`
        : '/api/admin/clients'
      
      const method = editingClient ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        setShowModal(false)
        resetForm()
        fetchClients()
      } else {
        alert(data.error || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving client:', error)
      alert('Failed to save client')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return

    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        fetchClients()
      } else {
        alert(data.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Failed to delete client')
    }
  }

  const openEditModal = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      company: client.company || '',
      website: client.website || '',
      address: client.address || '',
      notes: client.notes || '',
      status: client.status,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingClient(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      address: '',
      notes: '',
      status: 'active',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">{clients.length} total clients</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
          >
            + New Client
          </Button>
        </div>

        {/* Filters */}
        <div className="mt-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                {client.company && (
                  <p className="text-sm text-gray-600 mt-1">{client.company}</p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                  {client.email}
                </a>
              </div>
              
              {client.phone && (
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">{client.phone}</span>
                </div>
              )}

              {client.website && (
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                    {client.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm py-4 border-y border-gray-100 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{client._count?.projects || 0}</div>
                <div className="text-gray-600">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{client._count?.quotes || 0}</div>
                <div className="text-gray-600">Quotes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{client._count?.invoices || 0}</div>
                <div className="text-gray-600">Invoices</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(client)}
                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(client.id)}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No clients found</p>
          <Button onClick={() => setShowModal(true)}>Add Your First Client</Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          resetForm()
        }}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Client Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          <Input
            label="Website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://"
          />

          <Textarea
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={2}
          />

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingClient ? 'Update Client' : 'Add Client'}
            </Button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
