// ============================================================================
// QUOTE PDF PREVIEW & DOWNLOAD COMPONENT
// Live preview with download functionality
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import QuotePDF from './QuotePDF'
import type { Quote } from '@/types/quote'
import { Download, Eye, EyeOff, Loader2, FileText } from 'lucide-react'

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

  useEffect(() => {
    setIsClient(true)
  }, [])

  const togglePreview = () => {
    setPreviewVisible(!previewVisible)
  }

  const handleDownloadStart = () => {
    setIsGenerating(true)
    onDownloadStart?.()
  }

  const handleDownloadComplete = () => {
    setIsGenerating(false)
    onDownloadComplete?.()
  }

  const fileName = `Quote-${quote.quoteNumber}-${quote.title.replace(/\s+/g, '-')}.pdf`

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
      <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg">
        <button
          onClick={togglePreview}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          {previewVisible ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Preview
            </>
          )}
        </button>

        <PDFDownloadLink
          document={<QuotePDF quote={quote} />}
          fileName={fileName}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDownloadStart}
        >
          {({ loading, error }) => {
            if (loading || isGenerating) {
              return (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              )
            }

            if (error) {
              return (
                <>
                  <FileText className="w-4 h-4" />
                  Error - Try Again
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

        <div className="ml-auto text-sm text-slate-500">
          Quote: <span className="font-medium text-slate-700">{quote.quoteNumber}</span>
        </div>
      </div>

      {/* PDF Preview */}
      {previewVisible && (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <div className="p-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">PDF Preview</span>
              <span className="ml-auto text-xs text-slate-500">
                This is a live preview of your PDF document
              </span>
            </div>
          </div>
          
          <div className="bg-slate-100" style={{ height: '800px' }}>
            <PDFViewer
              width="100%"
              height="100%"
              showToolbar={true}
              className="border-0"
            >
              <QuotePDF quote={quote} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// LIGHTWEIGHT DOWNLOAD BUTTON (No Preview)
// ============================================================================

interface QuoteDownloadButtonProps {
  quote: Quote
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  showIcon?: boolean
  children?: React.ReactNode
}

export function QuoteDownloadButton({
  quote,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showIcon = true,
  children,
}: QuoteDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fileName = `Quote-${quote.quoteNumber}-${quote.title.replace(/\s+/g, '-')}.pdf`

  // Variant styles
  const variantStyles = {
    primary: 'text-white bg-indigo-600 hover:bg-indigo-700',
    secondary: 'text-white bg-slate-600 hover:bg-slate-700',
    outline: 'text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50',
    ghost: 'text-slate-700 bg-transparent hover:bg-slate-100',
  }

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  if (!isClient) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full justify-center' : ''}`}
      >
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
        Loading...
      </button>
    )
  }

  return (
    <PDFDownloadLink
      document={<QuotePDF quote={quote} />}
      fileName={fileName}
      className={`flex items-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full justify-center' : ''}`}
      onClick={() => setIsGenerating(true)}
    >
      {({ loading, error }) => {
        if (loading || isGenerating) {
          return (
            <>
              <Loader2 className={`${iconSizes[size]} animate-spin`} />
              Generating...
            </>
          )
        }

        if (error) {
          return (
            <>
              {showIcon && <FileText className={iconSizes[size]} />}
              Error - Retry
            </>
          )
        }

        return (
          <>
            {showIcon && <Download className={iconSizes[size]} />}
            {children || 'Download PDF'}
          </>
        )
      }}
    </PDFDownloadLink>
  )
}
