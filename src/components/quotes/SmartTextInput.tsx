// ============================================================================
// SMART TEXT INPUT WITH BULK PARSING
// AI-powered text input that can parse bulk text into structured lists
// ============================================================================

'use client'

import { useState } from 'react'
import { SmartTextParser } from '@/lib/quote-intelligence'
import { Wand2, X, Plus, Trash2, AlertCircle, Check } from 'lucide-react'

interface Props {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  helpText?: string
  type?: 'list' | 'milestones'
}

export default function SmartTextInput({
  label,
  items,
  onChange,
  placeholder = 'Add items...',
  helpText,
  type = 'list',
}: Props) {
  const [bulkText, setBulkText] = useState('')
  const [showBulkInput, setShowBulkInput] = useState(false)
  const [parsePreview, setParsePreview] = useState<string[]>([])
  const [newItem, setNewItem] = useState('')

  const handleParse = () => {
    if (!bulkText.trim()) return
    
    let parsed: any[]
    
    if (type === 'milestones') {
      parsed = SmartTextParser.parseToMilestones(bulkText)
    } else {
      parsed = SmartTextParser.parseToList(bulkText)
    }
    
    setParsePreview(parsed as string[])
  }

  const handleApplyParsed = () => {
    onChange([...items, ...parsePreview])
    setBulkText('')
    setParsePreview([])
    setShowBulkInput(false)
  }

  const handleAddItem = () => {
    if (!newItem.trim()) return
    onChange([...items, newItem.trim()])
    setNewItem('')
  }

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const handleUpdateItem = (index: number, value: string) => {
    const updated = [...items]
    updated[index] = value
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowBulkInput(!showBulkInput)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Wand2 className="w-3 h-3" />
          {showBulkInput ? 'Hide' : 'Bulk Import'}
        </button>
      </div>

      {helpText && (
        <p className="text-sm text-slate-500">{helpText}</p>
      )}

      {/* Bulk Import Section */}
      {showBulkInput && (
        <div className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50/50 space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-indigo-900">Smart Text Parser</p>
              <p className="text-xs text-indigo-700 mt-1">
                Paste your text in any format: numbered lists, bullet points, comma-separated, or line-by-line. 
                {type === 'milestones' && ' Can extract amounts and dates automatically.'}
              </p>
            </div>
          </div>

          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={
              type === 'milestones'
                ? 'Example:\n1. Initial deposit - $5,000 on 2024-01-15\n2. Milestone 1: Design phase complete - $10,000 by Feb 1st\n3. Final payment: $8,000'
                : 'Example:\n1. Custom user authentication\n2. Dashboard with analytics\n- Real-time notifications\n• Mobile responsive design'
            }
            rows={6}
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm font-mono bg-white"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleParse}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Wand2 className="w-4 h-4" />
              Parse Text
            </button>
            <button
              type="button"
              onClick={() => {
                setBulkText('')
                setParsePreview([])
                setShowBulkInput(false)
              }}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Parse Preview */}
          {parsePreview.length > 0 && (
            <div className="border-t border-indigo-300 pt-3 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                <Check className="w-4 h-4" />
                Found {parsePreview.length} item{parsePreview.length !== 1 ? 's' : ''}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {parsePreview.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm bg-white border border-slate-200 rounded px-3 py-2">
                    <span className="flex-shrink-0 text-indigo-600 font-medium">#{index + 1}</span>
                    <span className="flex-1 text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleApplyParsed}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add {parsePreview.length} Item{parsePreview.length !== 1 ? 's' : ''} to List
              </button>
            </div>
          )}
        </div>
      )}

      {/* Current Items List */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="flex-shrink-0 mt-3 text-sm text-slate-500 font-medium w-8">
              #{index + 1}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdateItem(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Single Item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {items.length === 0 && !showBulkInput && (
        <div className="text-center py-8 text-slate-400 text-sm">
          No items added yet. Use the button above to add items individually or use bulk import.
        </div>
      )}
    </div>
  )
}
