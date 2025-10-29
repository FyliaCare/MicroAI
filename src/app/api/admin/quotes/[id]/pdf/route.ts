import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { prisma } from '@/lib/prisma'
import QuotePDFDocument from '@/components/admin/quotes/pdf/QuotePDFDocument'
import React from 'react'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id

    // Fetch quote from database
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        client: true,
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Parse JSON fields safely
    const parseJSON = (field: any): any => {
      if (!field) return []
      if (typeof field === 'string') {
        try {
          return JSON.parse(field)
        } catch {
          return []
        }
      }
      return field
    }

    const quoteAny = quote as any

    const quoteData = {
      ...quote,
      items: parseJSON(quoteAny.items) as any[],
      milestones: parseJSON(quoteAny.milestones) as any[],
      paymentTerms: parseJSON(quoteAny.pricingItems || quoteAny.paymentTerms) as any[],
      objectives: parseJSON(quoteAny.executiveSummary) as string[],
      scope: parseJSON(quoteAny.scopeOfWork || quoteAny.scope) as string[],
      outOfScope: parseJSON(quoteAny.exclusions || quoteAny.outOfScope) as string[],
      assumptions: parseJSON(quoteAny.assumptions) as string[],
      constraints: [] as string[],
      currency: quoteAny.currency || 'USD',
      taxRate: quoteAny.taxRate || 0,
      discountValue: quoteAny.discount || 0,
      discountType: (quoteAny.discountType as 'percentage' | 'fixed') || 'fixed',
      estimatedDuration: Math.ceil((quoteAny.estimatedHours || 0) / 8),
      startDate: quote.issuedAt?.toISOString().split('T')[0] || '',
      validUntil: quote.validUntil?.toISOString().split('T')[0] || '',
      lateFeePercentage: 0,
      earlyPaymentDiscount: 0,
      acceptedPaymentMethods: [] as string[],
      termsAndConditions: quote.terms || '',
      warranties: '',
      supportTerms: '',
      brandColor: '#6366f1',
      includeCompanyLogo: true,
      includePortfolio: false,
      includeTestimonials: false,
      customCoverMessage: '',
      footerText: '',
      criticalPath: [] as string[],
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(QuotePDFDocument, {
        quoteData: quoteData as any,
        client: quote.client ? {
          ...quote.client,
          company: quote.client.company || undefined,
          phone: quote.client.phone || undefined,
          address: quote.client.address || undefined,
        } : undefined,
      }) as any // Type assertion for renderToBuffer
    )

    // Return PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${quote.quoteNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
