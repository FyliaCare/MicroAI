'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Project {
  id: string
  name: string
  description?: string
  type: string
  status: string
  priority: string
  budget?: number
  progress: number
  startDate?: string
  deadline?: string
  notes?: string
  client?: {
    id: string
    name: string
    email: string
    company?: string
  }
  tasks?: any[]
  milestones?: any[]
  quote?: any
  createdAt: string
}

interface Client {
  id: string
  name: string
  email: string
  company?: string
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'web-app',
    status: 'planning',
    priority: 'medium',
    budget: '',
    startDate: '',
    deadline: '',
    clientId: '',
    notes: '',
  })

  useEffect(() => {
    fetchProjects()
    fetchClients()
  }, [filterStatus, filterType])

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.append('status', filterStatus)
      if (filterType) params.append('type', filterType)
      
      const response = await fetch(`/api/admin/projects?${params}`)
      const data = await response.json()
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      const data = await response.json()
      if (data.success) {
        setClients(data.clients)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : '/api/admin/projects'
      
      const method = editingProject ? 'PATCH' : 'POST'
      
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
        fetchProjects()
      } else {
        alert(data.error || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        fetchProjects()
      } else {
        alert(data.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description || '',
      type: project.type,
      status: project.status,
      priority: project.priority,
      budget: project.budget?.toString() || '',
      startDate: project.startDate?.split('T')[0] || '',
      deadline: project.deadline?.split('T')[0] || '',
      clientId: project.client?.id || '',
      notes: project.notes || '',
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingProject(null)
    setFormData({
      name: '',
      description: '',
      type: 'web-app',
      status: 'planning',
      priority: 'medium',
      budget: '',
      startDate: '',
      deadline: '',
      clientId: '',
      notes: '',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      review: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      'on-hold': 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    }
    return colors[priority] || 'text-gray-600'
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
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">{projects.length} total projects</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
          >
            + New Project
          </Button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="web-app">Web Application</option>
            <option value="saas">SaaS Platform</option>
            <option value="website">Website</option>
            <option value="web-tool">Web Tool</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                {project.client && (
                  <p className="text-sm text-gray-600 mt-1">
                    {project.client.company || project.client.name}
                  </p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>

            {project.description && (
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{project.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900 capitalize">{project.type.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Priority:</span>
                <span className={`font-medium capitalize ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>
              {project.budget && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium text-gray-900">
                    ${project.budget.toLocaleString()}
                  </span>
                </div>
              )}
              {project.deadline && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{project.progress}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
              <span>{project.tasks?.length || 0} tasks</span>
              <span>{project.milestones?.length || 0} milestones</span>
              {project.quote && <span className="text-green-600">✓ Quoted</span>}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(project)}
                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No projects found</p>
          <Button onClick={() => setShowModal(true)}>Create Your First Project</Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          resetForm()
        }}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="web-app">Web Application</option>
                <option value="saas">SaaS Platform</option>
                <option value="website">Website</option>
                <option value="web-tool">Web Tool</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <Input
              label="Budget ($)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />

            <Input
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company && `(${client.company})`}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingProject ? 'Update Project' : 'Create Project'}
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
