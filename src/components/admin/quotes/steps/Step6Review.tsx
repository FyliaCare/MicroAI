'use client'

import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { QuoteData, Client } from '../types'
import { formatCurrency } from '../utils'
import dynamic from 'next/dynamic'

const PDFPreviewModal = dynamic(() => import('../pdf/PDFPreviewModal'), {
  ssr: false,
})

interface Step6Props {
  quoteData: QuoteData
  subtotal: number
  discount: number
  tax: number
  total: number
  clients: Client[]
}

export default function Step6Review({
  quoteData,
  subtotal,
  discount,
  tax,
  total,
  clients,
}: Step6Props) {
  const client = clients.find((c) => c.id === quoteData.clientId)
  const [showPDFPreview, setShowPDFPreview] = useState(false)

  return (
    <Card className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Review & Confirm
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Review all details before creating the quote
            </p>
          </div>
          <Button
            onClick={() => setShowPDFPreview(true)}
            variant="outline"
            className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          >
            <span className="mr-2">📄</span>
            Preview PDF
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📋</span> Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Quote Number</p>
              <p className="font-semibold text-slate-900 dark:text-white">{quoteData.quoteNumber}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Client</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {client?.name || 'Not selected'} {client?.company && `(${client.company})`}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">Project Title</p>
              <p className="font-semibold text-slate-900 dark:text-white">{quoteData.title}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Project Type</p>
              <p className="font-semibold text-slate-900 dark:text-white capitalize">
                {quoteData.projectType.replace('-', ' ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Valid Until</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {quoteData.validUntil ? new Date(quoteData.validUntil).toLocaleDateString() : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Scope */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Project Scope
          </h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-4">
            {quoteData.executiveSummary && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Executive Summary</p>
                <p className="text-slate-900 dark:text-white">{quoteData.executiveSummary}</p>
              </div>
            )}
            {quoteData.scope.length > 0 && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Scope ({quoteData.scope.length} items)</p>
                <ul className="space-y-1">
                  {quoteData.scope.slice(0, 5).map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="text-green-600">✓</span> {item}
                    </li>
                  ))}
                  {quoteData.scope.length > 5 && (
                    <li className="text-sm text-slate-500">
                      ...and {quoteData.scope.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>💰</span> Pricing Summary
          </h3>
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Subtotal ({quoteData.items.length} items):
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(subtotal, quoteData.currency)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Discount:</span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(discount, quoteData.currency)}
                  </span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Tax:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(tax, quoteData.currency)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-indigo-200 dark:border-indigo-800">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-slate-900 dark:text-white">
                    Total:
                  </span>
                  <span className="font-bold text-3xl text-indigo-600">
                    {formatCurrency(total, quoteData.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📅</span> Timeline
          </h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Start Date</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {quoteData.startDate ? new Date(quoteData.startDate).toLocaleDateString() : 'TBD'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {quoteData.estimatedDuration} days
                </p>
              </div>
            </div>
            {quoteData.milestones.length > 0 && (
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Milestones ({quoteData.milestones.length})
                </p>
                <div className="space-y-2">
                  {quoteData.milestones.slice(0, 3).map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        {idx + 1}
                      </span>
                      <span className="text-slate-900 dark:text-white">{milestone.title}</span>
                    </div>
                  ))}
                  {quoteData.milestones.length > 3 && (
                    <p className="text-sm text-slate-500">
                      ...and {quoteData.milestones.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Terms */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📄</span> Payment Terms
          </h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            {quoteData.paymentTerms.length > 0 ? (
              <div className="space-y-2">
                {quoteData.paymentTerms.map((term, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded">
                    <span className="text-sm text-slate-900 dark:text-white">{term.title}</span>
                    <span className="font-semibold text-indigo-600">{term.percentage}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No payment terms defined</p>
            )}
          </div>
        </div>
      </div>

      {/* Final Confirmation */}
      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white">
        <h4 className="text-lg font-bold mb-2">Ready to Create Quote?</h4>
        <p className="text-indigo-100 mb-4">
          Please review all information carefully. Once created, you can still edit or send this quote to the client.
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span>✓</span>
          <span>All required fields completed</span>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPDFPreview && (
        <PDFPreviewModal
          quoteData={quoteData}
          client={client}
          onClose={() => setShowPDFPreview(false)}
        />
      )}
    </Card>
  )
}
