import React from 'react'
import Card from '@/components/ui/Card'
import { QuoteData } from '../types'
import { formatCurrency } from '../utils'

interface QuoteSummaryProps {
  quoteData: QuoteData
  subtotal: number
  discount: number
  tax: number
  total: number
}

export default function QuoteSummary({
  quoteData,
  subtotal,
  discount,
  tax,
  total,
}: QuoteSummaryProps) {
  return (
    <Card className="p-6 sticky top-4">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        Quote Summary
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatCurrency(subtotal, quoteData.currency)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Discount ({quoteData.discountType === 'percentage' ? `${quoteData.discountValue}%` : 'Fixed'}):
            </span>
            <span className="font-semibold text-red-600">
              -{formatCurrency(discount, quoteData.currency)}
            </span>
          </div>
        )}

        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Tax ({quoteData.taxRate}%):
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatCurrency(tax, quoteData.currency)}
            </span>
          </div>
        )}

        <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              Total:
            </span>
            <div className="text-right">
              <div className="font-bold text-2xl text-indigo-600">
                {formatCurrency(total, quoteData.currency)}
              </div>
              {quoteData.currency !== 'USD' && (
                <div className="text-xs text-slate-500">
                  ≈ {formatCurrency(total * 1.0, 'USD')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
          Quick Stats
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              <span className="mr-2">📦</span>
              Line Items:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {quoteData.items.length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              <span className="mr-2">🎯</span>
              Milestones:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {quoteData.milestones.length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              <span className="mr-2">💳</span>
              Payment Terms:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {quoteData.paymentTerms.length}
            </span>
          </div>
          {quoteData.estimatedDuration > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                <span className="mr-2">⏱️</span>
                Duration:
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {quoteData.estimatedDuration} days
              </span>
            </div>
          )}
          {quoteData.validUntil && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                <span className="mr-2">📅</span>
                Valid Until:
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {new Date(quoteData.validUntil).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ 
                width: `${Math.min(100, (
                  (quoteData.title ? 15 : 0) +
                  (quoteData.clientId ? 15 : 0) +
                  (quoteData.items.length > 0 ? 20 : 0) +
                  (quoteData.milestones.length > 0 ? 20 : 0) +
                  (quoteData.paymentTerms.length > 0 ? 15 : 0) +
                  (quoteData.executiveSummary ? 15 : 0)
                ))}%` 
              }}
            />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Complete all sections to generate quote
        </p>
      </div>
    </Card>
  )
}
