'use client'

import { useState } from 'react'
import { X, Download, Check } from 'lucide-react'
import Button from '@/components/ui/Button'

interface TemplateSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  quoteId: string
  quoteNumber: string
}

const templates = [
  {
    id: 'modern-corporate' as const,
    name: 'Modern Corporate',
    description: 'Professional design with blue color scheme, perfect for corporate clients',
    preview: '/templates/modern.png',
    colors: ['#0047AB', '#00BCD4', '#e5e7eb'],
    features: ['Corporate Header', 'Structured Layout', 'Professional Tables', 'Clear Totals Section'],
  },
  {
    id: 'minimalist-clean' as const,
    name: 'Minimalist Clean',
    description: 'Clean and elegant design focusing on clarity and readability',
    preview: '/templates/minimalist.png',
    colors: ['#1E88E5', '#FFC107', '#f9fafb'],
    features: ['Centered Title', 'Simple Bullets', 'Clean Typography', 'Spacious Layout'],
  },
  {
    id: 'vibrant-gradient' as const,
    name: 'Vibrant Gradient',
    description: 'Eye-catching design with purple-green gradients, modern and dynamic',
    preview: '/templates/vibrant.png',
    colors: ['#667eea', '#10b981', '#f9fafb'],
    features: ['Gradient Markers', 'Color Info Boxes', 'Bold Typography', 'Green Accents'],
  },
]

export default function TemplateSelectorModal({
  isOpen,
  onClose,
  quoteId,
  quoteNumber,
}: TemplateSelectorModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'modern-corporate' | 'minimalist-clean' | 'vibrant-gradient'>('modern-corporate')
  const [downloading, setDownloading] = useState(false)

  if (!isOpen) return null

  const handleDownload = async () => {
    try {
      setDownloading(true)
      
      const timestamp = Date.now()
      const response = await fetch(
        `/api/admin/quotes/${quoteId}/docx?template=${selectedTemplate}&t=${timestamp}`,
        {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `quote-${quoteNumber}.docx`
        document.body.appendChild(a)
        a.click()
        
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }, 100)
        
        onClose()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        alert(`Failed to generate document: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Document download error:', error)
      alert(`Failed to download document: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Choose Your Quote Template
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Select a professional design template for your quote document
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`
                  relative cursor-pointer rounded-xl border-2 transition-all duration-200
                  ${
                    selectedTemplate === template.id
                      ? 'border-indigo-500 shadow-lg shadow-indigo-500/30 scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:shadow-md'
                  }
                `}
              >
                {/* Selected Checkmark */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 right-3 z-10 bg-indigo-500 text-white rounded-full p-1.5">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                <div className="p-6">
                  {/* Preview */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <div className="flex gap-2 justify-center mb-3">
                        {template.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Preview
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1.5">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {templates.find((t) => t.id === selectedTemplate)?.name}
            </span>{' '}
            template selected
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? 'Generating Document...' : 'Download Document'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
