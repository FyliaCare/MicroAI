import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { renderToBuffer } from '@react-pdf/renderer'
import QuotePDFDocument from '@/components/admin/quotes/QuotePDFDocument'

// GET /api/quotes/[id]/pdf - Generate PDF for public quote
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        client: true,
      },
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Check if quote is accessible (not draft)
    if (quote.status === 'draft') {
      return NextResponse.json(
        { error: 'Quote is not yet available' },
        { status: 403 }
      )
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(<QuotePDFDocument quote={quote} />)

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
