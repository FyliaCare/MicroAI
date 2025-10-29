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

    // Parse JSON fields
    const quoteData = {
      ...quote,
      items: quote.items as any[],
      milestones: quote.milestones as any[],
      paymentTerms: quote.paymentTerms as any[],
      objectives: quote.objectives as string[],
      scopeOfWork: quote.scopeOfWork as string[],
      deliverables: quote.deliverables as string[],
      exclusions: quote.exclusions as string[],
      assumptions: quote.assumptions as string[],
      constraints: quote.constraints as string[],
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(QuotePDFDocument, {
        quoteData: quoteData as any,
        client: quote.client || undefined,
      })
    )

    // Return PDF
    return new NextResponse(pdfBuffer, {
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
