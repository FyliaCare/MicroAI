import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { QuoteData, Milestone } from '../types'

interface Step4Props {
  quoteData: QuoteData
  setQuoteData: React.Dispatch<React.SetStateAction<QuoteData>>
  addMilestone: () => void
  updateMilestone: (id: string, field: keyof Milestone, value: any) => void
  removeMilestone: (id: string) => void
  onUseTemplate?: () => void
}

export default function Step4Timeline({
  quoteData,
  setQuoteData,
  addMilestone,
  updateMilestone,
  removeMilestone,
  onUseTemplate,
}: Step4Props) {
  const [newDeliverable, setNewDeliverable] = useState<{[key: string]: string}>({})

  const addDeliverable = (milestoneId: string, value: string) => {
    if (!value.trim()) return
    const milestone = quoteData.milestones.find((m) => m.id === milestoneId)
    if (milestone) {
      updateMilestone(milestoneId, 'deliverables', [
        ...milestone.deliverables,
        value.trim(),
      ])
      setNewDeliverable((prev) => ({ ...prev, [milestoneId]: '' }))
    }
  }

  const removeDeliverable = (milestoneId: string, index: number) => {
    const milestone = quoteData.milestones.find((m) => m.id === milestoneId)
    if (milestone) {
      updateMilestone(
        milestoneId,
        'deliverables',
        milestone.deliverables.filter((_, i) => i !== index)
      )
    }
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Timeline & Milestones
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Define project timeline and key milestones
        </p>
      </div>

      {/* Project Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Project Start Date
          </label>
          <Input
            type="date"
            value={quoteData.startDate}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Estimated Duration (days)
          </label>
          <Input
            type="number"
            value={quoteData.estimatedDuration.toString()}
            onChange={(e) =>
              setQuoteData((prev) => ({
                ...prev,
                estimatedDuration: parseInt(e.target.value) || 0,
              }))
            }
            min="0"
          />
        </div>
      </div>

      {/* Add Milestone Button */}
      <div className="mb-6 flex gap-3">
        <Button onClick={addMilestone} className="w-full md:w-auto">
          <span className="mr-2">+</span>
          Add Milestone
        </Button>
        {onUseTemplate && (
          <Button
            onClick={onUseTemplate}
            variant="outline"
            className="w-full md:w-auto border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          >
            <span className="mr-2">📋</span>
            Use Template
          </Button>
        )}
      </div>

      {/* Milestones */}
      <div className="space-y-6">
        {quoteData.milestones.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No milestones added yet
            </p>
            <Button onClick={addMilestone}>
              <span className="mr-2">+</span>
              Add Your First Milestone
            </Button>
          </div>
        ) : (
          quoteData.milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Milestone #{index + 1}
                  </h3>
                </div>
                <button
                  onClick={() => removeMilestone(milestone.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-xl px-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Milestone Title *
                  </label>
                  <Input
                    value={milestone.title}
                    onChange={(e) =>
                      updateMilestone(milestone.id, 'title', e.target.value)
                    }
                    placeholder="e.g., Phase 1: Discovery & Design"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={milestone.description}
                    onChange={(e) =>
                      updateMilestone(milestone.id, 'description', e.target.value)
                    }
                    placeholder="Describe this milestone..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Duration (days)
                  </label>
                  <Input
                    type="number"
                    value={milestone.duration.toString()}
                    onChange={(e) =>
                      updateMilestone(milestone.id, 'duration', parseInt(e.target.value) || 0)
                    }
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Cost Percentage (%)
                  </label>
                  <Input
                    type="number"
                    value={milestone.percentage.toString()}
                    onChange={(e) =>
                      updateMilestone(milestone.id, 'percentage', parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Deliverables */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Deliverables
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newDeliverable[milestone.id] || ''}
                    onChange={(e) =>
                      setNewDeliverable((prev) => ({
                        ...prev,
                        [milestone.id]: e.target.value,
                      }))
                    }
                    placeholder="Add a deliverable..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addDeliverable(
                          milestone.id,
                          newDeliverable[milestone.id] || ''
                        )
                      }
                    }}
                  />
                  <Button
                    onClick={() =>
                      addDeliverable(milestone.id, newDeliverable[milestone.id] || '')
                    }
                    type="button"
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {milestone.deliverables.map((deliverable, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded group"
                    >
                      <span className="text-indigo-600 dark:text-indigo-400">
                        ✓
                      </span>
                      <span className="flex-1 text-sm text-slate-900 dark:text-white">
                        {deliverable}
                      </span>
                      <button
                        onClick={() => removeDeliverable(milestone.id, idx)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>
            <strong>Pro Tip:</strong> Break the project into clear, measurable milestones. This helps manage client expectations and track progress.
          </span>
        </p>
      </div>
    </Card>
  )
}
