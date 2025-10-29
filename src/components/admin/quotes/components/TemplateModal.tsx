import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import {
  pricingTemplates,
  milestoneTemplates,
  paymentTermTemplates,
  PricingTemplate,
  MilestoneTemplate,
  PaymentTermTemplate,
} from '../templates'

interface TemplateModalProps {
  type: 'pricing' | 'milestone' | 'payment'
  onClose: () => void
  onApply: (template: any) => void
}

export default function TemplateModal({
  type,
  onClose,
  onApply,
}: TemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const templates =
    type === 'pricing'
      ? pricingTemplates
      : type === 'milestone'
      ? milestoneTemplates
      : paymentTermTemplates

  const handleApply = () => {
    const template = templates.find((t) => t.id === selectedTemplate)
    if (template) {
      onApply(template)
      onClose()
      setSelectedTemplate('')
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'pricing':
        return '💰'
      case 'milestone':
        return '🎯'
      case 'payment':
        return '💳'
      default:
        return '📋'
    }
  }

  const getTitle = (type: string) => {
    switch (type) {
      case 'pricing':
        return 'Select Pricing Template'
      case 'milestone':
        return 'Select Milestone Template'
      case 'payment':
        return 'Select Payment Template'
      default:
        return 'Select Template'
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={getTitle(type)}>
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-400">
          Choose a pre-built template to get started quickly
        </p>

        <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedTemplate === template.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getIcon(type)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {template.description}
                  </p>
                  {type === 'pricing' && 'items' in template && (
                    <p className="text-xs text-slate-500 mt-2">
                      {template.items.length} items •{' '}
                      {template.estimatedDuration} days
                    </p>
                  )}
                  {type === 'milestone' && 'milestones' in template && (
                    <p className="text-xs text-slate-500 mt-2">
                      {template.milestones.length} milestones
                    </p>
                  )}
                  {type === 'payment' && 'terms' in template && (
                    <p className="text-xs text-slate-500 mt-2">
                      {template.terms.length} payment terms
                    </p>
                  )}
                </div>
                {selectedTemplate === template.id && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!selectedTemplate}>
            Apply Template
          </Button>
        </div>
      </div>
    </Modal>
  )
}
