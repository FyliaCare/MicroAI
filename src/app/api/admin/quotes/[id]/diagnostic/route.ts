import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params
    console.log('📋 Diagnostic check for quote:', quoteId)

    // Fetch quote from database
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        Client: true,
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Parse JSON fields
    const parseJSON = (str: string | null) => {
      if (!str) return []
      try {
        return JSON.parse(str)
      } catch (e) {
        return { error: `Invalid JSON: ${e instanceof Error ? e.message : String(e)}` }
      }
    }

    const diagnostics = {
      quote: {
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        title: quote.title,
        status: quote.status,
        total: quote.total,
      },
      client: {
        name: quote.clientName || quote.Client?.name,
        email: quote.clientEmail || quote.Client?.email,
        company: quote.clientCompany || quote.Client?.company,
      },
      jsonFields: {
        items: {
          raw: typeof quote.items,
          parsed: parseJSON(quote.items as any),
        },
        scopeOfWork: {
          raw: typeof quote.scopeOfWork,
          parsed: parseJSON(quote.scopeOfWork as any),
        },
        deliverables: {
          raw: typeof quote.deliverables,
          parsed: parseJSON(quote.deliverables as any),
        },
        milestones: {
          raw: typeof quote.milestones,
          parsed: parseJSON(quote.milestones as any),
        },
        paymentTerms: {
          raw: typeof quote.paymentTerms,
          parsed: parseJSON(quote.paymentTerms as any),
        },
      },
      pricing: {
        subtotal: quote.subtotal,
        discount: quote.discount,
        tax: quote.tax,
        total: quote.total,
        currency: quote.currency,
      },
    }

    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error) {
    console.error('Diagnostic error:', error)
    return NextResponse.json(
      { 
        error: 'Diagnostic failed', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
