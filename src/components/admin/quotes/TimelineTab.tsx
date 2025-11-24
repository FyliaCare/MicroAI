'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Edit2,
  Flag,
  GitBranch,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

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

interface TimelineTabProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export default function TimelineTab({ formData, updateFormData }: TimelineTabProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)
  const [newDeliverable, setNewDeliverable] = useState<Record<string, string>>({})

  // Calculate dates for milestones based on start date and durations
  useEffect(() => {
    if (formData.startDate && formData.milestones.length > 0) {
      calculateMilestoneDates()
    }
  }, [formData.startDate, formData.milestones.length])

  const calculateMilestoneDates = () => {
    let currentDate = new Date(formData.startDate)
    const updatedMilestones = formData.milestones.map((milestone: Milestone) => {
      const startDate = new Date(currentDate)
      currentDate.setDate(currentDate.getDate() + milestone.duration)
      const endDate = new Date(currentDate)

      return {
        ...milestone,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    })

    updateFormData('milestones', updatedMilestones)

    // Update estimated duration
    const totalDuration = formData.milestones.reduce(
      (sum: number, m: Milestone) => sum + m.duration,
      0
    )
    updateFormData('estimatedDuration', totalDuration)
  }

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      description: '',
      deliverables: [],
      duration: 7,
      percentage: 0,
      dependencies: []
    }
    updateFormData('milestones', [...formData.milestones, newMilestone])
    setExpandedMilestone(newMilestone.id)
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    const updated = formData.milestones.map((m: Milestone) =>
      m.id === id ? { ...m, [field]: value } : m
    )
    updateFormData('milestones', updated)
  }

  const removeMilestone = (id: string) => {
    updateFormData('milestones', formData.milestones.filter((m: Milestone) => m.id !== id))
    if (expandedMilestone === id) {
      setExpandedMilestone(null)
    }
  }

  const addDeliverable = (milestoneId: string) => {
    const deliverable = newDeliverable[milestoneId]?.trim()
    if (deliverable) {
      const milestone = formData.milestones.find((m: Milestone) => m.id === milestoneId)
      if (milestone) {
        updateMilestone(milestoneId, 'deliverables', [...milestone.deliverables, deliverable])
        setNewDeliverable({ ...newDeliverable, [milestoneId]: '' })
      }
    }
  }

  const removeDeliverable = (milestoneId: string, index: number) => {
    const milestone = formData.milestones.find((m: Milestone) => m.id === milestoneId)
    if (milestone) {
      const updated = milestone.deliverables.filter((_: string, i: number) => i !== index)
      updateMilestone(milestoneId, 'deliverables', updated)
    }
  }

  const toggleDependency = (milestoneId: string, dependencyId: string) => {
    const milestone = formData.milestones.find((m: Milestone) => m.id === milestoneId)
    if (milestone) {
      const dependencies = milestone.dependencies || []
      const updated = dependencies.includes(dependencyId)
        ? dependencies.filter((d: string) => d !== dependencyId)
        : [...dependencies, dependencyId]
      updateMilestone(milestoneId, 'dependencies', updated)
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return 'bg-red-500'
    if (percentage < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTotalPercentage = () => {
    return formData.milestones.reduce((sum: number, m: Milestone) => sum + m.percentage, 0)
  }

  const formatDuration = (days: number) => {
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''}`
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7
    if (remainingDays === 0) return `${weeks} week${weeks !== 1 ? 's' : ''}`
    return `${weeks}w ${remainingDays}d`
  }

  return (
    <div className="space-y-6">
      {/* Project Timeline Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Project Timeline</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Start Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateFormData('startDate', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Estimated Duration (Calculated) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Duration
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formatDuration(formData.estimatedDuration)}
                readOnly
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Calculated from milestone durations
            </p>
          </div>

          {/* End Date (Calculated) */}
          {formData.startDate && formData.estimatedDuration > 0 && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Completion Date
              </label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={(() => {
                    const endDate = new Date(formData.startDate)
                    endDate.setDate(endDate.getDate() + formData.estimatedDuration)
                    return endDate.toISOString().split('T')[0]
                  })()}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Milestones */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Flag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Project Milestones</h2>
          </div>
          <Button onClick={addMilestone} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </Button>
        </div>

        {/* Total Percentage Warning */}
        {formData.milestones.length > 0 && (
          <div className={`mb-4 p-3 rounded-lg ${
            getTotalPercentage() === 100 
              ? 'bg-green-50 text-green-800' 
              : getTotalPercentage() > 100
              ? 'bg-red-50 text-red-800'
              : 'bg-yellow-50 text-yellow-800'
          }`}>
            <p className="text-sm font-medium">
              Total Milestone Percentage: {getTotalPercentage()}%
              {getTotalPercentage() !== 100 && (
                <span className="ml-2">
                  {getTotalPercentage() < 100 ? '(Should equal 100%)' : '(Exceeds 100%)'}
                </span>
              )}
            </p>
          </div>
        )}

        {formData.milestones.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Flag className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No milestones yet</p>
            <p className="text-sm mb-4">Break down your project into key milestones</p>
            <Button onClick={addMilestone}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Milestone
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.milestones.map((milestone: Milestone, index: number) => (
              <div
                key={milestone.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Milestone Header */}
                <div className="bg-gray-50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-bold">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                          placeholder="Milestone title"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-11">
                        {/* Duration */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Duration (days)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={milestone.duration}
                            onChange={(e) => updateMilestone(milestone.id, 'duration', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          />
                        </div>

                        {/* Percentage */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Percentage (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={milestone.percentage}
                            onChange={(e) => updateMilestone(milestone.id, 'percentage', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          />
                        </div>

                        {/* Date Range */}
                        {milestone.startDate && milestone.endDate && (
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Date Range
                            </label>
                            <div className="flex items-center space-x-2 text-xs text-gray-600 py-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(milestone.startDate).toLocaleDateString()} - {new Date(milestone.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 ml-4">
                      <button
                        onClick={() => setExpandedMilestone(
                          expandedMilestone === milestone.id ? null : milestone.id
                        )}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        {expandedMilestone === milestone.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => removeMilestone(milestone.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="ml-11 mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(milestone.percentage)}`}
                        style={{ width: `${Math.min(milestone.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedMilestone === milestone.id && (
                  <div className="p-4 space-y-4 bg-white">
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={milestone.description}
                        onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                        placeholder="Describe this milestone and what needs to be accomplished..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Deliverables */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deliverables
                      </label>
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={newDeliverable[milestone.id] || ''}
                          onChange={(e) => setNewDeliverable({ ...newDeliverable, [milestone.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && addDeliverable(milestone.id)}
                          placeholder="Add deliverable..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() => addDeliverable(milestone.id)}
                          disabled={!newDeliverable[milestone.id]?.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {milestone.deliverables.map((deliverable: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded group hover:bg-gray-100"
                          >
                            <span className="text-sm text-gray-900">{deliverable}</span>
                            <button
                              onClick={() => removeDeliverable(milestone.id, idx)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dependencies */}
                    {formData.milestones.length > 1 && (
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                          <GitBranch className="w-4 h-4" />
                          <span>Dependencies</span>
                        </label>
                        <div className="space-y-2">
                          {formData.milestones
                            .filter((m: Milestone) => m.id !== milestone.id)
                            .map((m: Milestone, idx: number) => (
                              <label
                                key={m.id}
                                className="flex items-center space-x-2 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={milestone.dependencies?.includes(m.id) || false}
                                  onChange={() => toggleDependency(milestone.id, m.id)}
                                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-900">
                                  Milestone {formData.milestones.findIndex((mi: Milestone) => mi.id === m.id) + 1}: {m.title || 'Untitled'}
                                </span>
                              </label>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Visual Timeline (Gantt-style) */}
      {formData.milestones.length > 0 && formData.startDate && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Timeline Visualization</h2>
          </div>

          <div className="space-y-3">
            {formData.milestones.map((milestone: Milestone, index: number) => (
              <div key={milestone.id} className="flex items-center space-x-3">
                <div className="w-32 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">
                    Milestone {index + 1}
                  </span>
                  <p className="text-xs text-gray-500">{formatDuration(milestone.duration)}</p>
                </div>
                <div className="flex-1">
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        left: `${(formData.milestones.slice(0, index).reduce((sum: number, m: Milestone) => sum + m.duration, 0) / formData.estimatedDuration) * 100}%`,
                        width: `${(milestone.duration / formData.estimatedDuration) * 100}%`
                      }}
                    >
                      {milestone.percentage}%
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">{milestone.title || 'Untitled'}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
