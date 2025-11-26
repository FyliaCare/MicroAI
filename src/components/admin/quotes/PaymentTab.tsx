'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  DollarSign,
  Calendar,
  Percent,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface PaymentSchedule {
  id: string
  title: string
  percentage: number
  amount: number
  dueDate: 'onSigning' | 'milestone' | 'net15' | 'net30' | 'net60' | 'custom'
  milestoneId?: string
  customDate?: string
  description?: string
}

interface PaymentTabProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export default function PaymentTab({ formData, updateFormData }: PaymentTabProps) {
  const paymentMethods = [
    { value: 'bank-transfer', label: 'Bank Transfer', icon: '🏦' },
    { value: 'credit-card', label: 'Credit Card', icon: '💳' },
    { value: 'paypal', label: 'PayPal', icon: '🅿️' },
    { value: 'crypto', label: 'Cryptocurrency', icon: '₿' },
    { value: 'check', label: 'Check/Cheque', icon: '📝' },
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'wire', label: 'Wire Transfer', icon: '🔄' },
    { value: 'mobile-money', label: 'Mobile Money', icon: '📱' }
  ]

  const dueDateOptions = [
    { value: 'onSigning', label: 'Upon Signing' },
    { value: 'milestone', label: 'Milestone Completion' },
    { value: 'net15', label: 'Net 15 Days' },
    { value: 'net30', label: 'Net 30 Days' },
    { value: 'net60', label: 'Net 60 Days' },
    { value: 'custom', label: 'Custom Date' }
  ]

  const getCurrencySymbol = () => {
    const currencies: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      GHS: '₵',
      NGN: '₦',
      ZAR: 'R'
    }
    return currencies[formData.currency] || '$'
  }

  const formatCurrency = (amount: number) => {
    return `${getCurrencySymbol()}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }

  // Recalculate payment amounts when total changes
  useEffect(() => {
    if (formData.paymentSchedule.length > 0) {
      const updated = formData.paymentSchedule.map((term: PaymentSchedule) => ({
        ...term,
        amount: formData.total * (term.percentage / 100)
      }))
      updateFormData('paymentSchedule', updated)
    }
  }, [formData.total])

  const addPaymentTerm = () => {
    const newTerm: PaymentSchedule = {
      id: `payment-${Date.now()}`,
      title: '',
      percentage: 0,
      amount: 0,
      dueDate: 'net30',
      description: ''
    }
    updateFormData('paymentSchedule', [...formData.paymentSchedule, newTerm])
  }

  const updatePaymentTerm = (id: string, field: keyof PaymentSchedule, value: any) => {
    const updated = formData.paymentSchedule.map((term: PaymentSchedule) => {
      if (term.id === id) {
        const updatedTerm = { ...term, [field]: value }
        // Recalculate amount if percentage changes
        if (field === 'percentage') {
          updatedTerm.amount = formData.total * (value / 100)
        }
        return updatedTerm
      }
      return term
    })
    updateFormData('paymentSchedule', updated)
  }

  const removePaymentTerm = (id: string) => {
    updateFormData('paymentSchedule', formData.paymentSchedule.filter((t: PaymentSchedule) => t.id !== id))
  }

  const togglePaymentMethod = (method: string) => {
    const methods = formData.acceptedPaymentMethods || []
    const updated = methods.includes(method)
      ? methods.filter((m: string) => m !== method)
      : [...methods, method]
    updateFormData('acceptedPaymentMethods', updated)
  }

  const getTotalPercentage = () => {
    return formData.paymentSchedule.reduce((sum: number, term: PaymentSchedule) => sum + term.percentage, 0)
  }

  const createStandardSchedule = (type: 'deposit' | 'milestone' | 'installments') => {
    let schedule: PaymentSchedule[] = []

    switch (type) {
      case 'deposit':
        schedule = [
          {
            id: `payment-${Date.now()}-1`,
            title: 'Initial Deposit',
            percentage: 50,
            amount: formData.total * 0.5,
            dueDate: 'onSigning',
            description: 'Due upon contract signing'
          },
          {
            id: `payment-${Date.now()}-2`,
            title: 'Final Payment',
            percentage: 50,
            amount: formData.total * 0.5,
            dueDate: 'net30',
            description: 'Due upon project completion'
          }
        ]
        break

      case 'milestone':
        const milestoneCount = formData.milestones.length || 3
        const percentage = Math.floor(100 / milestoneCount)
        const remainder = 100 - (percentage * milestoneCount)
        
        schedule = formData.milestones.map((milestone: any, index: number) => ({
          id: `payment-${Date.now()}-${index}`,
          title: milestone.title || `Milestone ${index + 1} Payment`,
          percentage: percentage + (index === milestoneCount - 1 ? remainder : 0),
          amount: formData.total * ((percentage + (index === milestoneCount - 1 ? remainder : 0)) / 100),
          dueDate: 'milestone' as const,
          milestoneId: milestone.id,
          description: `Due upon completion of ${milestone.title || `Milestone ${index + 1}`}`
        }))
        break

      case 'installments':
        schedule = [
          {
            id: `payment-${Date.now()}-1`,
            title: 'First Installment',
            percentage: 33.33,
            amount: formData.total * 0.3333,
            dueDate: 'onSigning',
            description: 'Due upon contract signing'
          },
          {
            id: `payment-${Date.now()}-2`,
            title: 'Second Installment',
            percentage: 33.33,
            amount: formData.total * 0.3333,
            dueDate: 'net30',
            description: 'Due after 30 days'
          },
          {
            id: `payment-${Date.now()}-3`,
            title: 'Final Installment',
            percentage: 33.34,
            amount: formData.total * 0.3334,
            dueDate: 'net60',
            description: 'Due upon completion'
          }
        ]
        break
    }

    updateFormData('paymentSchedule', schedule)
  }

  return (
    <div className="space-y-6">
      {/* Deposit Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Deposit Requirements</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.depositRequired}
              onChange={(e) => updateFormData('depositRequired', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Require initial deposit to start project
            </span>
          </label>

          {formData.depositRequired && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit Percentage
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={formData.depositPercentage}
                  onChange={(e) => updateFormData('depositPercentage', parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.depositPercentage}
                    onChange={(e) => updateFormData('depositPercentage', parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                  />
                  <span className="text-gray-700 font-medium">%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Deposit Amount: <span className="font-bold text-indigo-600">
                  {formatCurrency(formData.total * (formData.depositPercentage / 100))}
                </span>
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Payment Schedule */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Payment Schedule</h2>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => createStandardSchedule('deposit')}
            >
              50/50 Split
            </Button>
            {formData.milestones.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => createStandardSchedule('milestone')}
              >
                By Milestones
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => createStandardSchedule('installments')}
            >
              3 Installments
            </Button>
            <Button
              size="sm"
              onClick={addPaymentTerm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Custom Term
            </Button>
          </div>
        </div>

        {/* Total Percentage Warning */}
        {formData.paymentSchedule.length > 0 && (
          <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
            getTotalPercentage() === 100 
              ? 'bg-green-50 text-green-800' 
              : getTotalPercentage() > 100
              ? 'bg-red-50 text-red-800'
              : 'bg-yellow-50 text-yellow-800'
          }`}>
            {getTotalPercentage() === 100 ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-medium">
              Total: {getTotalPercentage()}%
              {getTotalPercentage() !== 100 && (
                <span className="ml-2">
                  {getTotalPercentage() < 100 
                    ? `(${100 - getTotalPercentage()}% remaining)` 
                    : '(Exceeds 100%)'}
                </span>
              )}
            </p>
          </div>
        )}

        {formData.paymentSchedule.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No payment terms yet</p>
            <p className="text-sm mb-4">Create a payment schedule or use a template</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.paymentSchedule.map((term: PaymentSchedule, index: number) => (
              <div
                key={term.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full font-bold flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <input
                      type="text"
                      value={term.title}
                      onChange={(e) => updatePaymentTerm(term.id, 'title', e.target.value)}
                      placeholder="Payment title (e.g., Initial Deposit)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Percentage */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Percentage
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={term.percentage}
                            onChange={(e) => updatePaymentTerm(term.id, 'percentage', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Amount (Calculated) */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Amount
                        </label>
                        <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium">
                          {formatCurrency(term.amount)}
                        </div>
                      </div>

                      {/* Due Date */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Due Date
                        </label>
                        <select
                          value={term.dueDate}
                          onChange={(e) => updatePaymentTerm(term.id, 'dueDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          {dueDateOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Custom Date */}
                    {term.dueDate === 'custom' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Custom Date
                        </label>
                        <input
                          type="date"
                          value={term.customDate ? new Date(term.customDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => updatePaymentTerm(term.id, 'customDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Milestone Selection */}
                    {term.dueDate === 'milestone' && formData.milestones.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Linked Milestone
                        </label>
                        <select
                          value={term.milestoneId || ''}
                          onChange={(e) => updatePaymentTerm(term.id, 'milestoneId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Select milestone...</option>
                          {formData.milestones.map((milestone: any, idx: number) => (
                            <option key={milestone.id} value={milestone.id}>
                              Milestone {idx + 1}: {milestone.title || 'Untitled'}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={term.description || ''}
                        onChange={(e) => updatePaymentTerm(term.id, 'description', e.target.value)}
                        placeholder="Additional notes about this payment..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => removePaymentTerm(term.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Accepted Payment Methods */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Accepted Payment Methods</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.value}
              onClick={() => togglePaymentMethod(method.value)}
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.acceptedPaymentMethods?.includes(method.value)
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="text-3xl mb-2">{method.icon}</div>
              <div className="text-sm font-medium text-gray-900">{method.label}</div>
              {formData.acceptedPaymentMethods?.includes(method.value) && (
                <CheckCircle className="w-5 h-5 text-indigo-600 mx-auto mt-2" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Late Payment Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Late Payment Policy</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Late Fee Percentage
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="0"
                max="25"
                step="0.5"
                placeholder="1.5"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <span className="text-gray-700">% per month on overdue amount</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grace Period (Days)
            </label>
            <input
              type="number"
              min="0"
              max="30"
              placeholder="7"
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Number of days after due date before late fees apply
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
