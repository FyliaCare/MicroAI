'use client'

import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Copy, 
  Calculator,
  TrendingUp,
  Percent,
  Tag
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface LineItem {
  id: string
  name: string
  description: string
  category: 'development' | 'design' | 'infrastructure' | 'maintenance' | 'consulting' | 'hosting' | 'custom'
  quantity: number
  unitPrice: number
  discount: number
  taxable: boolean
  order: number
}

interface PricingTabProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export default function PricingTab({ formData, updateFormData }: PricingTabProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const categories = [
    { value: 'development', label: 'Development', color: 'bg-blue-100 text-blue-800' },
    { value: 'design', label: 'Design', color: 'bg-purple-100 text-purple-800' },
    { value: 'infrastructure', label: 'Infrastructure', color: 'bg-green-100 text-green-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-orange-100 text-orange-800' },
    { value: 'consulting', label: 'Consulting', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'hosting', label: 'Hosting', color: 'bg-pink-100 text-pink-800' },
    { value: 'custom', label: 'Custom', color: 'bg-gray-100 text-gray-800' }
  ]

  const currencies = [
    { value: 'USD', label: 'USD ($)', symbol: '$' },
    { value: 'EUR', label: 'EUR (€)', symbol: '€' },
    { value: 'GBP', label: 'GBP (£)', symbol: '£' },
    { value: 'GHS', label: 'GHS (₵)', symbol: '₵' },
    { value: 'NGN', label: 'NGN (₦)', symbol: '₦' },
    { value: 'ZAR', label: 'ZAR (R)', symbol: 'R' }
  ]

  const getCurrencySymbol = () => {
    return currencies.find(c => c.value === formData.currency)?.symbol || '$'
  }

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-800'
  }

  // Calculate totals whenever line items change
  useEffect(() => {
    calculateTotals()
  }, [formData.lineItems, formData.discountType, formData.discountValue, formData.taxRate])

  const calculateTotals = () => {
    // Calculate subtotal
    const subtotal = formData.lineItems.reduce((sum: number, item: LineItem) => {
      const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100)
      return sum + itemTotal
    }, 0)

    // Calculate discount
    const discountAmount = formData.discountType === 'percentage'
      ? subtotal * (formData.discountValue / 100)
      : formData.discountValue

    // Calculate taxable amount
    const taxableAmount = formData.lineItems
      .filter((item: LineItem) => item.taxable)
      .reduce((sum: number, item: LineItem) => {
        const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100)
        return sum + itemTotal
      }, 0)

    const afterDiscount = taxableAmount - (taxableAmount / subtotal) * discountAmount
    const tax = afterDiscount * (formData.taxRate / 100)

    // Calculate total
    const total = subtotal - discountAmount + tax

    updateFormData('subtotal', subtotal)
    updateFormData('discount', discountAmount)
    updateFormData('tax', tax)
    updateFormData('total', total)
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      name: '',
      description: '',
      category: 'custom',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxable: true,
      order: formData.lineItems.length
    }
    updateFormData('lineItems', [...formData.lineItems, newItem])
    setExpandedItem(newItem.id)
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const updated = formData.lineItems.map((item: LineItem) =>
      item.id === id ? { ...item, [field]: value } : item
    )
    updateFormData('lineItems', updated)
  }

  const removeLineItem = (id: string) => {
    updateFormData('lineItems', formData.lineItems.filter((item: LineItem) => item.id !== id))
  }

  const duplicateLineItem = (id: string) => {
    const item = formData.lineItems.find((i: LineItem) => i.id === id)
    if (item) {
      const duplicate: LineItem = {
        ...item,
        id: `item-${Date.now()}`,
        name: `${item.name} (Copy)`,
        order: formData.lineItems.length
      }
      updateFormData('lineItems', [...formData.lineItems, duplicate])
    }
  }

  const calculateItemTotal = (item: LineItem) => {
    return item.quantity * item.unitPrice * (1 - item.discount / 100)
  }

  const formatCurrency = (amount: number) => {
    return `${getCurrencySymbol()}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }

  return (
    <div className="space-y-6">
      {/* Currency & Global Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Pricing Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => updateFormData('currency', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>

          {/* Global Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type
            </label>
            <select
              value={formData.discountType}
              onChange={(e) => updateFormData('discountType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          {/* Global Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value
            </label>
            <div className="relative">
              {formData.discountType === 'percentage' ? (
                <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              ) : (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {getCurrencySymbol()}
                </span>
              )}
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.discountValue}
                onChange={(e) => updateFormData('discountValue', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  formData.discountType === 'fixed' ? 'pl-8' : 'pr-10'
                }`}
              />
            </div>
          </div>

          {/* Tax Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <div className="relative">
              <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.taxRate}
                onChange={(e) => updateFormData('taxRate', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Line Items</h2>
          <Button onClick={addLineItem} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </div>

        {formData.lineItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No line items yet</p>
            <p className="text-sm mb-4">Add your first line item to start building the quote</p>
            <Button onClick={addLineItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.lineItems.map((item: LineItem) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                          placeholder="Item name"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          placeholder="Description (optional)"
                          className="w-full px-2 py-1 mt-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs text-gray-600"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={item.category}
                          onChange={(e) => updateLineItem(item.id, 'category', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        >
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-center"
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-28 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-right"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={item.discount}
                            onChange={(e) => updateLineItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-center"
                          />
                          <span className="text-gray-500 text-xs">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-gray-900">
                        {formatCurrency(calculateItemTotal(item))}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => duplicateLineItem(item.id)}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeLineItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {formData.lineItems.map((item: LineItem, index: number) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {categories.find(c => c.value === item.category)?.label}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => duplicateLineItem(item.id)}
                        className="p-1 text-gray-400 hover:text-indigo-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                      placeholder="Item name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => updateLineItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Item Total:</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(calculateItemTotal(item))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Totals Summary */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Quote Summary</h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Subtotal</span>
            <span className="text-lg font-medium text-gray-900">{formatCurrency(formData.subtotal)}</span>
          </div>

          {formData.discountValue > 0 && (
            <div className="flex justify-between items-center py-2 text-green-600">
              <span className="flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>
                  Discount 
                  {formData.discountType === 'percentage' && ` (${formData.discountValue}%)`}
                </span>
              </span>
              <span className="text-lg font-medium">-{formatCurrency(formData.discount)}</span>
            </div>
          )}

          {formData.taxRate > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Tax ({formData.taxRate}%)</span>
              <span className="text-lg font-medium text-gray-900">+{formatCurrency(formData.tax)}</span>
            </div>
          )}

          <div className="border-t-2 border-indigo-200 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-3xl font-bold text-indigo-600">{formatCurrency(formData.total)}</span>
            </div>
          </div>

          {formData.lineItems.length > 0 && (
            <div className="pt-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Line Items:</span>
                <span className="font-medium">{formData.lineItems.length}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Total Quantity:</span>
                <span className="font-medium">
                  {formData.lineItems.reduce((sum: number, item: LineItem) => sum + item.quantity, 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
