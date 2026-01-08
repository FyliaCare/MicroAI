// ============================================================================
// QUOTE PDF PREVIEW & DOWNLOAD COMPONENT - PRODUCTION VERSION
// Live preview with error handling and download functionality
// ============================================================================

'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { PDFDownloadLink } from '@react-pdf/renderer'
import QuotePDF from './QuotePDFNew'
import type { Quote } from '@/types/quote'
import { Download, Eye, EyeOff, Loader2, FileText, AlertCircle } from 'lucide-react'

// Dynamically import PDFViewer to prevent SSR issues
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-slate-600">Loading PDF viewer...</span>
      </div>
    ),
  }
)

interface QuotePDFPreviewProps {
  quote: Quote
  showPreview?: boolean
  autoDownload?: boolean
  onDownloadStart?: () => void
  onDownloadComplete?: () => void
}

export default function QuotePDFPreview({
  quote,
  showPreview = false,
  autoDownload = false,
  onDownloadStart,
  onDownloadComplete,
}: QuotePDFPreviewProps) {
  const [isClient, setIsClient] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(showPreview)
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    console.log('[PDF Preview] Component mounted, quote:', quote.quoteNumber)
  }, [quote.quoteNumber])

  useEffect(() => {
    if (previewVisible) {
      console.log('[PDF Preview] Attempting to render PDF:', {
        quoteNumber: quote.quoteNumber,
        title: quote.title,
        hasItems: !!quote.items,
        hasScope: !!(quote as any).scopeOfWork,
        hasBranding: !!(quote as any).branding,
      })
    }
  }, [previewVisible, quote])

  const togglePreview = () => {
    setPreviewVisible(!previewVisible)
    setPdfError(null)
  }

  const handleDownloadStart = () => {
    console.log('[PDF Download] Starting download for:', quote.quoteNumber)
    setIsGenerating(true)
    onDownloadStart?.()
  }

  const handleDownloadComplete = () => {
    console.log('[PDF Download] Download complete for:', quote.quoteNumber)
    setIsGenerating(false)
    onDownloadComplete?.()
  }

  const fileName = `Quote-${quote.quoteNumber || 'Draft'}-${quote.title.replace(/\s+/g, '-')}.pdf`

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 rounded-lg">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <span className="ml-3 text-slate-600">Loading PDF generator...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Control Buttons */}
      <div className="flex items-center gap-3 p-5 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl shadow-lg">
        <button
          onClick={togglePreview}
          className="flex items-center gap-2.5 px-5 py-3 text-sm font-semibold text-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-all hover:shadow-lg transform hover:-translate-y-0.5 border border-slate-300"
        >
          {previewVisible ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Live Preview
            </>
          )}
        </button>

        <PDFDownloadLink
          document={<QuotePDF quote={quote} />}
          fileName={fileName}
          className="flex items-center gap-2.5 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {({ loading, error }) => {
            if (error) {
              console.error('[PDF Download] Error generating PDF:', error)
              return (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Error - Try Again
                </>
              )
            }
            
            if (loading) {
              return (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              )
            }
            
            return (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )
          }}
        </PDFDownloadLink>

        <div className="ml-auto flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
          <FileText className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-indigo-900">{quote.quoteNumber || 'DRAFT'}</span>
        </div>
      </div>

      {/* PDF Preview */}
      {previewVisible && (
        <div className="rounded-xl overflow-hidden bg-white shadow-2xl border border-slate-200">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Live PDF Preview
                  </h3>
                  <p className="text-white/80 text-sm mt-0.5 font-medium">
                    Cover • Intro • Table of Contents • Details • Company Profile
                  </p>
                </div>
              </div>
              <button
                onClick={togglePreview}
                className="px-4 py-2 text-sm bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all font-semibold border border-white/20"
              >
                Hide Preview
              </button>
            </div>
          </div>
          
          <div className="h-[900px] bg-gradient-to-br from-slate-50 to-slate-100">
            {pdfError ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center px-8 max-w-lg bg-white rounded-2xl shadow-xl border border-red-100 p-10">
                  <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    PDF Rendering Error
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">{pdfError}</p>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setPdfError(null)}
                      className="px-6 py-3 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={togglePreview}
                      className="px-6 py-3 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold transition-all"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <ErrorBoundary onError={setPdfError}>
                <PDFViewer 
                  width="100%" 
                  height="100%" 
                  showToolbar={true}
                  className="border-0"
                >
                  <QuotePDF quote={quote} />
                </PDFViewer>
              </ErrorBoundary>
            )}
          </div>
        </div>
      )}

      {/* Info Message */}
      {previewVisible && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-2.5 rounded-lg flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-blue-900 mb-3 text-base">Professional Quote Structure</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-100">
                  <span className="font-bold text-blue-900">Page 1:</span>
                  <p className="text-blue-800 mt-1">Professional cover with logo & details</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-100">
                  <span className="font-bold text-blue-900">Page 2:</span>
                  <p className="text-blue-800 mt-1">Introduction & project overview</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-100">
                  <span className="font-bold text-blue-900">Page 3:</span>
                  <p className="text-blue-800 mt-1">Table of contents with navigation</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-100">
                  <span className="font-bold text-blue-900">Page 4+:</span>
                  <p className="text-blue-800 mt-1">Details, pricing, terms & profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: string) => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[PDF Error Boundary] Caught error:', error, errorInfo)
    this.props.onError(error.message || 'Unknown PDF rendering error')
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">PDF rendering failed</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
