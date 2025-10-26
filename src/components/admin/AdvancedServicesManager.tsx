'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Service {
  id: string
  name: string
  description?: string
  category: string
  priceType: string
  basePrice?: number
  minPrice?: number
  maxPrice?: number
  hourlyRate?: number
  features?: string
  deliverables?: string
  duration?: string
  isActive: boolean
  isPopular: boolean
  icon?: string
  color?: string
  sortOrder: number
  tags?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function AdvancedServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'price' | 'popular' | 'sortOrder'>('sortOrder')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'web-development',
    priceType: 'fixed',
    basePrice: '',
    minPrice: '',
    maxPrice: '',
    hourlyRate: '',
    duration: '',
    isActive: true,
    isPopular: false,
    icon: '💻',
    color: '#3B82F6',
    sortOrder: 0,
    notes: '',
  })

  const [features, setFeatures] = useState<string[]>([''])
  const [deliverables, setDeliverables] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([''])

  useEffect(() => {
    fetchServices()
  }, [filterCategory, filterStatus])

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams()
      if (filterCategory) params.append('category', filterCategory)
      if (filterStatus) params.append('isActive', filterStatus)
      
      const response = await fetch(`/api/admin/services?${params}`)
      const data = await response.json()
      if (data.success) {
        setServices(data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseJsonField = (field?: string): string[] => {
    if (!field) return []
    try {
      return JSON.parse(field)
    } catch {
      return []
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const serviceData = {
      ...formData,
      basePrice: formData.basePrice ? parseFloat(formData.basePrice) : null,
      minPrice: formData.minPrice ? parseFloat(formData.minPrice) : null,
      maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
      features: features.filter(f => f.trim() !== ''),
      deliverables: deliverables.filter(d => d.trim() !== ''),
      tags: tags.filter(t => t.trim() !== ''),
    }

    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services'
      
      const method = editingService ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        setShowModal(false)
        resetForm()
        fetchServices()
      } else {
        alert(data.error || 'Failed to save service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Failed to save service')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      category: service.category,
      priceType: service.priceType,
      basePrice: service.basePrice?.toString() || '',
      minPrice: service.minPrice?.toString() || '',
      maxPrice: service.maxPrice?.toString() || '',
      hourlyRate: service.hourlyRate?.toString() || '',
      duration: service.duration || '',
      isActive: service.isActive,
      isPopular: service.isPopular,
      icon: service.icon || '💻',
      color: service.color || '#3B82F6',
      sortOrder: service.sortOrder,
      notes: service.notes || '',
    })
    setFeatures(parseJsonField(service.features).length > 0 ? parseJsonField(service.features) : [''])
    setDeliverables(parseJsonField(service.deliverables).length > 0 ? parseJsonField(service.deliverables) : [''])
    setTags(parseJsonField(service.tags).length > 0 ? parseJsonField(service.tags) : [''])
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Service deleted successfully')
        fetchServices()
      } else {
        alert(data.error || 'Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'web-development',
      priceType: 'fixed',
      basePrice: '',
      minPrice: '',
      maxPrice: '',
      hourlyRate: '',
      duration: '',
      isActive: true,
      isPopular: false,
      icon: '💻',
      color: '#3B82F6',
      sortOrder: 0,
      notes: '',
    })
    setFeatures([''])
    setDeliverables([''])
    setTags([''])
    setEditingService(null)
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'web-development': 'Web Development',
      'design': 'Design',
      'consulting': 'Consulting',
      'maintenance': 'Maintenance',
      'other': 'Other'
    }
    return labels[category] || category
  }

  const getPriceDisplay = (service: Service) => {
    switch (service.priceType) {
      case 'fixed':
        return service.basePrice ? `$${service.basePrice.toLocaleString()}` : 'Custom Pricing'
      case 'hourly':
        return service.hourlyRate ? `$${service.hourlyRate}/hr` : 'Hourly Rate'
      case 'project-based':
        if (service.minPrice && service.maxPrice) {
          return `$${service.minPrice.toLocaleString()} - $${service.maxPrice.toLocaleString()}`
        }
        return 'Project-Based'
      case 'custom':
        return 'Custom Pricing'
      default:
        return 'Contact for Pricing'
    }
  }

  const handleArrayFieldChange = (
    index: number,
    value: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newArray = [...array]
    newArray[index] = value
    setArray(newArray)
  }

  const addArrayField = (array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    setArray([...array, ''])
  }

  const removeArrayField = (
    index: number,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (array.length > 1) {
      setArray(array.filter((_, i) => i !== index))
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = searchQuery === '' || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'category':
        return a.category.localeCompare(b.category)
      case 'price':
        return (b.basePrice || 0) - (a.basePrice || 0)
      case 'popular':
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
      default:
        return a.sortOrder - b.sortOrder
    }
  })

  const stats = {
    total: services.length,
    active: services.filter(s => s.isActive).length,
    inactive: services.filter(s => !s.isActive).length,
    popular: services.filter(s => s.isPopular).length,
    webDev: services.filter(s => s.category === 'web-development').length,
    design: services.filter(s => s.category === 'design').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Services Management
          </h1>
          <p className="text-gray-600 mt-1">Manage your service offerings and packages</p>
        </div>
        
        <Button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Total Services</p>
            <svg className="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Active</p>
            <svg className="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{stats.active}</p>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Inactive</p>
            <svg className="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{stats.inactive}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Popular</p>
            <svg className="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{stats.popular}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Web Dev</p>
            <svg className="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{stats.webDev}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Design</p>
            <svg className="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <p className="text-3xl font-bold">{stats.design}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="design">Design</option>
            <option value="consulting">Consulting</option>
            <option value="maintenance">Maintenance</option>
            <option value="other">Other</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* View Mode Toggle */}
          <div className="lg:col-span-2 flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <div className="flex gap-2">
            {[
              { value: 'sortOrder', label: 'Default' },
              { value: 'name', label: 'Name' },
              { value: 'category', label: 'Category' },
              { value: 'price', label: 'Price' },
              { value: 'popular', label: 'Popular' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  sortBy === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid/List */}
      {sortedServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first service</p>
          <Button onClick={() => { resetForm(); setShowModal(true); }}>
            Add Service
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedServices.map((service) => {
            const serviceFeatures = parseJsonField(service.features)
            const serviceTags = parseJsonField(service.tags)
            
            return (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden cursor-pointer group border-2 border-transparent hover:border-blue-200"
                onClick={() => {
                  setSelectedService(service)
                  setShowDetailsModal(true)
                }}
                style={{ borderTopColor: service.color || '#3B82F6', borderTopWidth: '4px' }}
              >
                {/* Service Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <div className="text-4xl mr-3">{service.icon || '💻'}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600">{getCategoryLabel(service.category)}</p>
                      </div>
                    </div>
                    {service.isPopular && (
                      <svg className="w-6 h-6 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      service.isActive
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 bg-gray-50">
                  {service.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{service.description}</p>
                  )}

                  {/* Features Preview */}
                  {serviceFeatures.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 uppercase">Key Features:</p>
                      <ul className="space-y-1">
                        {serviceFeatures.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                        {serviceFeatures.length > 3 && (
                          <li className="text-xs text-blue-600 font-medium">+{serviceFeatures.length - 3} more...</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="p-6 bg-white border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Pricing:</span>
                    <span className="text-xl font-bold text-blue-600">{getPriceDisplay(service)}</span>
                  </div>
                  {service.duration && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900 font-medium">{service.duration}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {serviceTags.length > 0 && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {serviceTags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {serviceTags.length > 4 && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                          +{serviceTags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-4 bg-gray-100 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(service)
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(service.id)
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{service.icon || '💻'}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {service.name}
                          {service.isPopular && (
                            <svg className="w-4 h-4 text-yellow-500 ml-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          )}
                        </div>
                        {service.description && (
                          <div className="text-xs text-gray-500 max-w-xs truncate">{service.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getCategoryLabel(service.category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {getPriceDisplay(service)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.duration || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.isActive
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          resetForm()
        }}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="web-development">Web Development</option>
                <option value="design">Design</option>
                <option value="consulting">Consulting</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="💻"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>

            <Input
              label="Sort Order"
              type="number"
              value={formData.sortOrder.toString()}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </div>

          {/* Pricing Section */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
                <option value="project-based">Project-Based</option>
                <option value="custom">Custom Pricing</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {formData.priceType === 'fixed' && (
                <Input
                  label="Base Price"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="5000"
                  step="0.01"
                />
              )}

              {formData.priceType === 'hourly' && (
                <Input
                  label="Hourly Rate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  placeholder="150"
                  step="0.01"
                />
              )}

              {formData.priceType === 'project-based' && (
                <>
                  <Input
                    label="Min Price"
                    type="number"
                    value={formData.minPrice}
                    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                    placeholder="5000"
                    step="0.01"
                  />
                  <Input
                    label="Max Price"
                    type="number"
                    value={formData.maxPrice}
                    onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                    placeholder="50000"
                    step="0.01"
                  />
                </>
              )}

              <Input
                label="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="2-4 weeks"
              />
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              <button
                type="button"
                onClick={() => addArrayField(features, setFeatures)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                + Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayFieldChange(index, e.target.value, features, setFeatures)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter feature"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, features, setFeatures)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Deliverables</h3>
              <button
                type="button"
                onClick={() => addArrayField(deliverables, setDeliverables)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                + Add Deliverable
              </button>
            </div>
            <div className="space-y-2">
              {deliverables.map((deliverable, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={deliverable}
                    onChange={(e) => handleArrayFieldChange(index, e.target.value, deliverables, setDeliverables)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter deliverable"
                  />
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, deliverables, setDeliverables)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              <button
                type="button"
                onClick={() => addArrayField(tags, setTags)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                + Add Tag
              </button>
            </div>
            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleArrayFieldChange(index, e.target.value, tags, setTags)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tag"
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, tags, setTags)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
          />

          <div className="flex items-center gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Popular Service</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingService ? 'Update Service' : 'Create Service'}
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

      {/* Service Details Modal */}
      {selectedService && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedService(null)
          }}
          title="Service Details"
        >
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6" style={{ borderLeftColor: selectedService.color, borderLeftWidth: '6px' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-5xl mr-4">{selectedService.icon || '💻'}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
                    <p className="text-gray-600">{getCategoryLabel(selectedService.category)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedService.isActive
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-800 border border-gray-300'
                  }`}>
                    {selectedService.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {selectedService.isPopular && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Popular
                    </span>
                  )}
                </div>
              </div>

              {selectedService.description && (
                <p className="text-gray-700 mt-4">{selectedService.description}</p>
              )}
            </div>

            {/* Pricing Information */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pricing</p>
                  <p className="text-3xl font-bold mt-1">{getPriceDisplay(selectedService)}</p>
                </div>
                {selectedService.duration && (
                  <div className="text-right">
                    <p className="text-sm opacity-90">Duration</p>
                    <p className="text-lg font-semibold mt-1">{selectedService.duration}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {parseJsonField(selectedService.features).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {parseJsonField(selectedService.features).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deliverables */}
            {parseJsonField(selectedService.deliverables).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deliverables</h3>
                <ul className="bg-blue-50 rounded-lg p-4 space-y-2">
                  {parseJsonField(selectedService.deliverables).map((deliverable, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {parseJsonField(selectedService.tags).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {parseJsonField(selectedService.tags).map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedService.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Notes</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedService.notes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  handleEdit(selectedService)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Edit Service
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
