'use client'

import React, { useState } from 'react'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import QuotePDFDocument from './QuotePDFDocument'
import { QuoteData, Client } from '../types'

interface PDFPreviewModalProps {
  quoteData: QuoteData
  client?: Client
  onClose: () => void
}

export default function PDFPreviewModal({ quoteData, client, onClose }: PDFPreviewModalProps) {
  const [showPreview, setShowPreview] = useState(true)

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Quote PDF Preview"
      size="xl"
    >
      <div className="space-y-4">
        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <Button
              variant={showPreview ? 'primary' : 'outline'}
              onClick={() => setShowPreview(true)}
              className="text-sm"
            >
              👁️ Preview
            </Button>
            <Button
              variant={!showPreview ? 'primary' : 'outline'}
              onClick={() => setShowPreview(false)}
              className="text-sm"
            >
              📄 Download Only
            </Button>
          </div>

          <PDFDownloadLink
            document={<QuotePDFDocument quoteData={quoteData} client={client} />}
            fileName={`quote-${quoteData.quoteNumber}.pdf`}
          >
            {({ loading }) => (
              <Button disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                {loading ? '⏳ Generating...' : '⬇️ Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>

        {/* Preview or Instructions */}
        {showPreview ? (
          <div className="w-full h-[600px] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <PDFViewer width="100%" height="100%" showToolbar={true}>
              <QuotePDFDocument quoteData={quoteData} client={client} />
            </PDFViewer>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="text-6xl mb-4">📥</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Ready to Download
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Click the "Download PDF" button above to save your quote
            </p>
            <div className="text-sm text-slate-500 dark:text-slate-500">
              <p>Quote: {quoteData.quoteNumber}</p>
              <p>Client: {client?.name || 'N/A'}</p>
              <p>Project: {quoteData.title}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            💡 Tip: You can preview the PDF before downloading
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
