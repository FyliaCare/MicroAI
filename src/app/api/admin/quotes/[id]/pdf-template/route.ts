import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateQuotePDF } from '@/lib/quotePdfTemplatesPDFKit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quoteId = params.id
    const { searchParams } = new URL(request.url)
    const template = (searchParams.get('template') || 'modern') as 'modern' | 'minimalist' | 'vibrant'

    // Fetch quote with client data
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        Client: true,
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Parse line items from JSON string
    const lineItems = quote.items ? JSON.parse(quote.items) : []

    // Prepare quote data for PDF generation
    const quoteData = {
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      clientName: quote.Client?.name || quote.clientName || 'N/A',
      clientEmail: quote.Client?.email || quote.clientEmail || 'N/A',
      clientCompany: quote.Client?.company || quote.clientCompany || undefined,
      clientPhone: quote.Client?.phone || quote.clientPhone || undefined,
      clientAddress: quote.Client?.address || quote.clientAddress || undefined,
      companyName: quote.companyName || 'MicroAI Systems',
      companyAddress: quote.companyAddress || '1234 Company St, Company Town, ST 12345',
      companyEmail: quote.companyEmail || 'info@microai.systems',
      companyPhone: quote.companyPhone || '(555) 123-4567',
      lineItems: lineItems.map((item: any) => ({
        name: item.name || item.description || 'Item',
        description: item.description || undefined,
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || item.price || 0,
      })),
      subtotal: quote.subtotal || 0,
      tax: quote.tax || 0,
      total: quote.total || 0,
      currency: quote.currency || 'USD',
      createdAt: quote.createdAt,
      validUntil: quote.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      terms: quote.terms || quote.paymentTerms || undefined,
    }

    // Generate PDF with selected template
    const pdfBuffer = await generateQuotePDF(quoteData, template)

    // Return PDF as Uint8Array for Next.js compatibility
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${quote.quoteNumber}-${template}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
