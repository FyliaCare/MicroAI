import React from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { QuoteData, PaymentTerm } from '../types'
import { getCurrencySymbol } from '../utils'

interface Step5Props {
  quoteData: QuoteData
  setQuoteData: React.Dispatch<React.SetStateAction<QuoteData>>
  addPaymentTerm: () => void
  updatePaymentTerm: (id: string, field: keyof PaymentTerm, value: any) => void
  removePaymentTerm: (id: string) => void
  onUseTemplate?: () => void
}

export default function Step5Terms({
  quoteData,
  setQuoteData,
  addPaymentTerm,
  updatePaymentTerm,
  removePaymentTerm,
  onUseTemplate,
}: Step5Props) {
  const currencySymbol = getCurrencySymbol(quoteData.currency)

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Payment Terms & Conditions
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Define payment schedule and legal terms
        </p>
      </div>

      {/* Add Payment Term Button */}
      <div className="mb-6 flex gap-3">
        <Button onClick={addPaymentTerm} className="w-full md:w-auto">
          <span className="mr-2">+</span>
          Add Payment Term
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

      {/* Payment Terms */}
      <div className="space-y-4 mb-8">
        {quoteData.paymentTerms.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No payment terms added yet
            </p>
            <Button onClick={addPaymentTerm}>
              <span className="mr-2">+</span>
              Add Your First Payment Term
            </Button>
          </div>
        ) : (
          quoteData.paymentTerms.map((term, index) => (
            <div
              key={term.id}
              className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Payment #{index + 1}
                </h3>
                <button
                  onClick={() => removePaymentTerm(term.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-xl px-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Title *
                  </label>
                  <Input
                    value={term.title}
                    onChange={(e) =>
                      updatePaymentTerm(term.id, 'title', e.target.value)
                    }
                    placeholder="e.g., Initial Deposit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Percentage (%)
                  </label>
                  <Input
                    type="number"
                    value={term.percentage.toString()}
                    onChange={(e) =>
                      updatePaymentTerm(
                        term.id,
                        'percentage',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Due Date
                  </label>
                  <select
                    value={term.dueDate}
                    onChange={(e) =>
                      updatePaymentTerm(term.id, 'dueDate', e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="onSigning">Upon Signing</option>
                    <option value="milestone">At Milestone Completion</option>
                    <option value="net15">Net 15 Days</option>
                    <option value="net30">Net 30 Days</option>
                    <option value="net60">Net 60 Days</option>
                    <option value="custom">Custom Date</option>
                  </select>
                </div>

                {term.dueDate === 'custom' && (
                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Custom Due Date
                    </label>
                    <Input
                      type="date"
                      value={term.customDate || ''}
                      onChange={(e) =>
                        updatePaymentTerm(term.id, 'customDate', e.target.value)
                      }
                    />
                  </div>
                )}

                {term.dueDate === 'milestone' && (
                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Linked Milestone
                    </label>
                    <select
                      value={term.milestoneId || ''}
                      onChange={(e) =>
                        updatePaymentTerm(term.id, 'milestoneId', e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select milestone...</option>
                      {quoteData.milestones.map((milestone) => (
                        <option key={milestone.id} value={milestone.id}>
                          {milestone.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={term.description || ''}
                    onChange={(e) =>
                      updatePaymentTerm(term.id, 'description', e.target.value)
                    }
                    placeholder="Additional details about this payment..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Terms & Conditions
          </label>
          <Textarea
            value={quoteData.termsAndConditions}
            onChange={(e) =>
              setQuoteData((prev) => ({
                ...prev,
                termsAndConditions: e.target.value,
              }))
            }
            placeholder="Standard terms and conditions for this quote..."
            rows={6}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Warranties & Guarantees
          </label>
          <Textarea
            value={quoteData.warranties}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, warranties: e.target.value }))
            }
            placeholder="Warranty information and guarantees..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Support Terms
          </label>
          <Textarea
            value={quoteData.supportTerms}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, supportTerms: e.target.value }))
            }
            placeholder="Post-launch support and maintenance terms..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Late Fee (%)
            </label>
            <Input
              type="number"
              value={quoteData.lateFeePercentage.toString()}
              onChange={(e) =>
                setQuoteData((prev) => ({
                  ...prev,
                  lateFeePercentage: parseFloat(e.target.value) || 0,
                }))
              }
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Early Payment Discount (%)
            </label>
            <Input
              type="number"
              value={quoteData.earlyPaymentDiscount.toString()}
              onChange={(e) =>
                setQuoteData((prev) => ({
                  ...prev,
                  earlyPaymentDiscount: parseFloat(e.target.value) || 0,
                }))
              }
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>
            <strong>Pro Tip:</strong> Clear payment terms reduce disputes. Consider milestone-based payments for larger projects.
          </span>
        </p>
      </div>
    </Card>
  )
}
