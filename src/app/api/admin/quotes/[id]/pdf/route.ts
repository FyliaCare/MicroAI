import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import QuotePDFNew from '@/components/admin/quotes/pdf/QuotePDFNew'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params
    console.log('PDF generation started for quote:', quoteId)

    // Fetch quote from database
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        Client: true,
      },
    })

    if (!quote) {
      console.log('Quote not found:', quoteId)
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    console.log('Quote found:', quote.quoteNumber)

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

    // Prepare quote data for PDF
    const lineItems = parseJSON(quote.items as any)
    const scopeItems = parseJSON(quote.scopeOfWork as any)
    const exclusions = parseJSON(quote.exclusions as any)
    const assumptions = parseJSON(quote.assumptions as any)
    const deliverables = parseJSON(quote.deliverables as any)
    const milestones = parseJSON(quote.milestones as any)
    const paymentSchedule = parseJSON(quote.paymentTerms as any)

    console.log('Parsed data:', {
      lineItems: lineItems.length,
      scopeItems: scopeItems.length,
      milestones: milestones.length,
      paymentSchedule: paymentSchedule.length
    })

    // Prepare quote data for PDF
    const quoteData = {
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      description: quote.description || '',
      
      // Client info
      clientName: quote.clientName || quote.Client?.name || 'Client',
      clientEmail: quote.clientEmail || quote.Client?.email || '',
      clientCompany: quote.clientCompany || quote.Client?.company || undefined,
      clientPhone: quote.clientPhone || quote.Client?.phone || undefined,
      clientAddress: quote.clientAddress || quote.Client?.address || undefined,
      
      // Project details
      projectType: quote.projectType || undefined,
      executiveSummary: quote.executiveSummary || undefined,
      objectives: [],
      
      // Scope
      scopeItems: scopeItems,
      scopeOfWork: quote.scopeOfWork || undefined,
      exclusions: exclusions,
      assumptions: assumptions,
      deliverables: deliverables,
      
      // Pricing
      lineItems: lineItems,
      pricingItems: quote.pricingItems || undefined,
      currency: quote.currency || 'USD',
      discountType: (quote.discountType as 'fixed' | 'percentage' | undefined) || 'percentage',
      discountValue: quote.discount || 0,
      taxRate: quote.taxRate || 0,
      subtotal: quote.subtotal || 0,
      discount: quote.discount || 0,
      tax: quote.tax || 0,
      total: quote.total || 0,
      
      // Timeline
      startDate: quote.createdAt?.toISOString(),
      estimatedDuration: quote.estimatedHours || 0,
      milestones: milestones,
      timeline: quote.timeline || undefined,
      
      // Payment
      paymentSchedule: paymentSchedule,
      depositRequired: (quote.depositPercent || 0) > 0,
      depositPercentage: quote.depositPercent || 0,
      depositPercent: quote.depositPercent || undefined,
      depositAmount: quote.depositAmount || undefined,
      acceptedPaymentMethods: ['bank-transfer', 'credit-card', 'paypal'],
      
      // Terms
      termsAndConditions: quote.terms || undefined,
      terms: quote.terms || undefined,
      validUntil: quote.validUntil?.toISOString(),
      warranties: undefined,
      supportTerms: quote.maintenanceTerms || undefined,
      maintenanceTerms: quote.maintenanceTerms || undefined,
      revisionPolicy: quote.revisionsPolicy || undefined,
      revisionsPolicy: quote.revisionsPolicy || undefined,
      cancellationPolicy: undefined,
      confidentialityClause: quote.confidentialityClause || undefined,
      ipRights: quote.ipRights || undefined,
      paymentTerms: quote.paymentTerms || undefined,
      
      // Branding
      brandColor: '#6366f1',
      includeLogo: true,
      includePortfolio: false,
      customMessage: undefined,
      footerText: undefined,
      companyLogo: quote.companyLogo || undefined,
      companyName: quote.companyName || 'MicroAI Systems',
      companyAddress: quote.companyAddress || 'BR253 Pasture St. Takoradi, Ghana',
      companyEmail: quote.companyEmail || 'sales@microaisystems.com',
      companyPhone: quote.companyPhone || '+233 244486837',
      companyWebsite: quote.companyWebsite || 'www.microaisystems.com',
      
      // Metadata
      status: quote.status,
      issuedAt: quote.issuedAt || quote.createdAt,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
      
      // Signatures
      clientSignature: quote.clientSignature || undefined,
      clientSignedBy: quote.clientSignedBy || undefined,
      clientSignedAt: quote.clientSignedAt || undefined,
      providerSignature: quote.providerSignature || undefined,
      providerSignedBy: quote.providerSignedBy || undefined,
      providerSignedAt: quote.providerSignedAt || undefined,
      
      // Additional
      freeSupportMonths: quote.freeSupportMonths || 1,
      includedRevisions: quote.includedRevisions || 2,
    }

    console.log('Quote data prepared, generating PDF...')
    console.log('Line items count:', quoteData.lineItems?.length || 0)
    console.log('Milestones count:', quoteData.milestones?.length || 0)

    // Validate required data before generating PDF
    if (!quoteData.quoteNumber || !quoteData.clientName) {
      console.error('Missing required quote data:', { quoteNumber: quoteData.quoteNumber, clientName: quoteData.clientName })
      return NextResponse.json(
        { error: 'Missing required quote data (quoteNumber or clientName)' },
        { status: 400 }
      )
    }

    // Generate PDF using React PDF (use renderToBuffer for API routes)
    let pdfBuffer
    try {
      pdfBuffer = await renderToBuffer(React.createElement(QuotePDFNew, { quote: quoteData }) as React.ReactElement)
      console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes')
    } catch (pdfError) {
      console.error('PDF rendering error:', pdfError)
      return NextResponse.json(
        { 
          error: 'PDF rendering failed', 
          details: pdfError instanceof Error ? pdfError.message : String(pdfError)
        },
        { status: 500 }
      )
    }

    // Return the PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${quote.quoteNumber}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

