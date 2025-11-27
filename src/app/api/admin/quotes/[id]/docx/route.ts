import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateQuoteDocx } from '@/lib/quoteDocxPro'
import { generateQuoteDocxTemplate, type TemplateType } from '@/lib/quoteDocxTemplates'
import { generateISOQuoteDocx } from '@/lib/docx/quoteISOProfessional'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('[DOCX Route] Starting Word document generation...')
  
  try {
    const { id: quoteId } = await params
    const { searchParams } = new URL(request.url)
    const templateParam = searchParams.get('template')
    
    // Support multiple template types
    const template: TemplateType | 'iso-professional' = 
      templateParam === 'iso-professional' ? 'iso-professional' :
      templateParam === 'minimalist-clean' ? 'minimalist-clean' :
      templateParam === 'vibrant-gradient' ? 'vibrant-gradient' :
      templateParam === 'modern-corporate' ? 'modern-corporate' :
      'iso-professional' // Default to ISO-compliant professional template
    
    console.log('[DOCX Route] Quote ID:', quoteId, 'Template:', template)

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
      id: quote.id,
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      description: quote.description || '',
      status: quote.status,
      
      // Dates
      createdAt: quote.createdAt,
      validUntil: quote.validUntil,
      startDate: quote.createdAt,
      
      // Client Information
      clientName: quote.clientName || quote.Client?.name || 'Client',
      clientEmail: quote.clientEmail || quote.Client?.email || '',
      clientCompany: quote.clientCompany || quote.Client?.company || undefined,
      clientPhone: quote.clientPhone || quote.Client?.phone || undefined,
      clientAddress: quote.clientAddress || quote.Client?.address || undefined,
      
      // Company Information
      companyName: quote.companyName || 'MicroAI Systems',
      companyTagline: 'Professional Software Development Services',
      companyAddress: quote.companyAddress || 'BR253 Pasture St. Takoradi, Ghana',
      companyEmail: quote.companyEmail || 'sales@microaisystems.com',
      companyPhone: quote.companyPhone || '+233 244486837',
      companyWebsite: quote.companyWebsite || 'www.microaisystems.com',
      
      // Project Details
      executiveSummary: quote.executiveSummary || undefined,
      projectType: quote.projectType || undefined,
      industry: undefined, // Not in schema yet
      objectives: [], // Parse from description if needed
      scopeItems: parseJSON(quote.scopeOfWork as any),
      deliverables: parseJSON(quote.deliverables as any),
      exclusions: parseJSON(quote.exclusions as any),
      assumptions: parseJSON(quote.assumptions as any),
      
      // Pricing
      lineItems: lineItems,
      currency: quote.currency || 'USD',
      subtotal: quote.subtotal || 0,
      discount: quote.discount || 0,
      tax: quote.tax || 0,
      taxRate: quote.taxRate || 0,
      total: quote.total || 0,
      
      // Timeline
      estimatedDuration: undefined, // Not in schema yet
      timeline: quote.timeline || undefined,
      milestones: milestones,
      
      // Payment Terms
      paymentSchedule: paymentSchedule,
      depositRequired: false, // Not in schema yet
      depositAmount: quote.depositAmount || undefined,
      acceptedPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayPal', 'Stripe'],
      
      // Terms & Conditions
      terms: quote.terms || undefined,
      termsAndConditions: quote.terms || undefined,
      scopeOfWork: quote.scopeOfWork || undefined,
    }

    console.log('[DOCX Route] Generating Word document with template:', template)
    
    // Use ISO professional template by default, or legacy templates if specified
    let docxBuffer: Buffer
    
    if (template === 'iso-professional') {
      docxBuffer = await generateISOQuoteDocx(quoteData as any)
    } else if (template === 'modern-corporate' || template === 'minimalist-clean' || template === 'vibrant-gradient') {
      docxBuffer = await generateQuoteDocxTemplate(quoteData as any, template as TemplateType)
    } else {
      // Fallback to ISO professional (new default)
      docxBuffer = await generateISOQuoteDocx(quoteData as any)
    }
    
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
