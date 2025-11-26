import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateQuoteDocx } from '@/lib/quoteDocxPro'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('[DOCX Route] Starting Word document generation...')
  
  try {
    const { id: quoteId } = await params
    console.log('[DOCX Route] Quote ID:', quoteId)

    // Fetch quote from database
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        Client: true,
      },
    })

    if (!quote) {
      console.error('[DOCX Route] Quote not found:', quoteId)
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    console.log('[DOCX Route] Quote found:', quote.quoteNumber)

    // Parse JSON fields
    const parseJSON = (str: string | null) => {
      if (!str) return []
      try {
        const parsed = JSON.parse(str)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.warn('JSON parse error:', e)
        return []
      }
    }

    // Prepare quote data
    const lineItems = parseJSON(quote.items as any)
    const milestones = parseJSON(quote.milestones as any)
    const paymentSchedule = parseJSON(quote.paymentTerms as any)

    const quoteData = {
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      description: quote.description || '',
      
      clientName: quote.clientName || quote.Client?.name || 'Client',
      clientEmail: quote.clientEmail || quote.Client?.email || '',
      clientCompany: quote.clientCompany || quote.Client?.company || undefined,
      clientPhone: quote.clientPhone || quote.Client?.phone || undefined,
      clientAddress: quote.clientAddress || quote.Client?.address || undefined,
      
      lineItems: lineItems,
      currency: quote.currency || 'USD',
      subtotal: quote.subtotal || 0,
      discount: quote.discount || 0,
      tax: quote.tax || 0,
      total: quote.total || 0,
      
      validUntil: quote.validUntil,
      createdAt: quote.createdAt,
      
      companyName: quote.companyName || 'MicroAI Systems',
      companyAddress: quote.companyAddress || 'BR253 Pasture St. Takoradi, Ghana',
      companyEmail: quote.companyEmail || 'sales@microaisystems.com',
      companyPhone: quote.companyPhone || '+233 244486837',
      
      terms: quote.terms || undefined,
      scopeOfWork: quote.scopeOfWork || undefined,
      milestones: milestones,
      paymentSchedule: paymentSchedule,
    }

    console.log('[DOCX Route] Generating Word document...')
    const docxBuffer = await generateQuoteDocx(quoteData as any)
    
    console.log('[DOCX Route] Document generated successfully! Size:', docxBuffer.length, 'bytes')

    // Return the Word document (convert Buffer to Uint8Array)
    return new NextResponse(new Uint8Array(docxBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="quote-${quote.quoteNumber}.docx"`,
        'Cache-Control': 'no-cache',
        'Content-Length': docxBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('[DOCX Route] Error:', error)
    if (error instanceof Error) {
      console.error('[DOCX Route] Error message:', error.message)
      console.error('[DOCX Route] Error stack:', error.stack)
    }
    return NextResponse.json(
      { 
        error: 'Failed to generate Word document', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}
