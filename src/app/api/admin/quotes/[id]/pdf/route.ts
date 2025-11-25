import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import QuotePDFNew from '@/components/admin/quotes/pdf/QuotePDFNew'

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
        return JSON.parse(str)
      } catch {
        return []
      }
    }

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
      scopeItems: parseJSON(quote.scopeOfWork as any),
      scopeOfWork: quote.scopeOfWork || undefined,
      exclusions: parseJSON(quote.exclusions as any),
      assumptions: parseJSON(quote.assumptions as any),
      deliverables: parseJSON(quote.deliverables as any),
      
      // Pricing
      lineItems: parseJSON(quote.items as any),
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
      milestones: parseJSON(quote.milestones as any),
      timeline: quote.timeline || undefined,
      
      // Payment
      paymentSchedule: parseJSON(quote.paymentTerms as any),
      depositRequired: (quote.depositPercent || 0) > 0,
      depositPercentage: quote.depositPercent || 0,
      depositPercent: quote.depositPercent || undefined,
      depositAmount: quote.depositAmount || undefined,
      acceptedPaymentMethods: ['bank-transfer', 'credit-card', 'paypal'],
      
      // Terms
      termsAndConditions: quote.terms || undefined,
      terms: quote.terms || undefined,
      validUntil: quote.validUntil?.toISOString(),
      warranties: '',
      supportTerms: quote.maintenanceTerms || '',
      maintenanceTerms: quote.maintenanceTerms || undefined,
      revisionPolicy: quote.revisionsPolicy || undefined,
      revisionsPolicy: quote.revisionsPolicy || undefined,
      cancellationPolicy: '',
      confidentialityClause: quote.confidentialityClause || undefined,
      ipRights: quote.ipRights || undefined,
      paymentTerms: quote.paymentTerms || undefined,
      
      // Branding
      brandColor: '#6366f1',
      includeLogo: true,
      includePortfolio: false,
      customMessage: '',
      footerText: '',
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

    // Generate PDF using React PDF (use renderToBuffer for API routes)
    const pdfBuffer = await renderToBuffer(
      React.createElement(QuotePDFNew, { quote: quoteData }) as any
    )

    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes')

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

