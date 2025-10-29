import React from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { QuoteData, QuoteItem } from '../types'
import { formatCurrency, getCurrencySymbol } from '../utils'

interface Step3Props {
  quoteData: QuoteData
  setQuoteData: React.Dispatch<React.SetStateAction<QuoteData>>
  addItem: () => void
  updateItem: (id: string, field: keyof QuoteItem, value: any) => void
  removeItem: (id: string) => void
  subtotal: number
  onUseTemplate?: () => void
}

export default function Step3Pricing({
  quoteData,
  setQuoteData,
  addItem,
  updateItem,
  removeItem,
  subtotal,
  onUseTemplate,
}: Step3Props) {
  const currencySymbol = getCurrencySymbol(quoteData.currency)

  const categories = [
    { value: 'development', label: '💻 Development', color: 'blue' },
    { value: 'design', label: '🎨 Design', color: 'purple' },
    { value: 'infrastructure', label: '🔧 Infrastructure', color: 'green' },
    { value: 'maintenance', label: '🔄 Maintenance', color: 'yellow' },
    { value: 'consulting', label: '💼 Consulting', color: 'indigo' },
    { value: 'custom', label: '⚡ Custom', color: 'pink' },
  ]

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Pricing & Line Items
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Build your pricing structure with detailed line items
        </p>
      </div>

      {/* Add Item Button */}
      <div className="mb-6 flex gap-3">
        <Button onClick={addItem} className="w-full md:w-auto">
          <span className="mr-2">+</span>
          Add Line Item
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

      {/* Line Items */}
      <div className="space-y-4 mb-8">
        {quoteData.items.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No line items added yet
            </p>
            <Button onClick={addItem}>
              <span className="mr-2">+</span>
              Add Your First Item
            </Button>
          </div>
        ) : (
          quoteData.items.map((item, index) => (
            <div
              key={item.id}
              className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Item #{index + 1}
                </h3>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-xl px-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={item.category}
                    onChange={(e) =>
                      updateItem(item.id, 'category', e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Item Name *
                  </label>
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, 'name', e.target.value)
                    }
                    placeholder="e.g., Frontend Development"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, 'description', e.target.value)
                    }
                    placeholder="Detailed description of this line item..."
                    rows={2}
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Unit Price ({currencySymbol})
                  </label>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Discount (%)
                  </label>
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                {/* Taxable */}
                <div className="flex items-center pt-7">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.taxable}
                      onChange={(e) =>
                        updateItem(item.id, 'taxable', e.target.checked)
                      }
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Taxable Item
                    </span>
                  </label>
                </div>
              </div>

              {/* Item Total */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Item Total:
                  </span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatCurrency(
                      item.quantity * item.unitPrice * (1 - item.discount / 100),
                      quoteData.currency
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Global Pricing Options */}
      <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Additional Pricing Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Global Discount */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Discount Type
            </label>
            <select
              value={quoteData.discountType}
              onChange={(e) =>
                setQuoteData((prev) => ({
                  ...prev,
                  discountType: e.target.value as 'percentage' | 'fixed',
                }))
              }
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ({currencySymbol})</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Discount Value
            </label>
            <Input
              type="number"
              value={quoteData.discountValue}
              onChange={(e) =>
                setQuoteData((prev) => ({
                  ...prev,
                  discountValue: parseFloat(e.target.value) || 0,
                }))
              }
              min="0"
              step="0.01"
            />
          </div>

          {/* Tax Rate */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Tax Rate (%)
            </label>
            <Input
              type="number"
              value={quoteData.taxRate}
              onChange={(e) =>
                setQuoteData((prev) => ({
                  ...prev,
                  taxRate: parseFloat(e.target.value) || 0,
                }))
              }
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>

        {/* Subtotal Display */}
        <div className="mt-6 pt-4 border-t border-slate-300 dark:border-slate-600">
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold text-slate-900 dark:text-white">
              Current Subtotal:
            </span>
            <span className="font-bold text-2xl text-indigo-600">
              {formatCurrency(subtotal, quoteData.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>
            <strong>Pro Tip:</strong> Break down complex services into detailed line items for transparency. Clients appreciate seeing exactly what they're paying for.
          </span>
        </p>
      </div>
    </Card>
  )
}
