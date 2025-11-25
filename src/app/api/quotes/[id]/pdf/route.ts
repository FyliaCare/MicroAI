import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { renderToBuffer } from '@react-pdf/renderer'
import QuotePDFNew from '@/components/admin/quotes/pdf/QuotePDFNew'
import React from 'react'

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
        Client: true,
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

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(QuotePDFNew, { quote: quoteData }) as any
    )

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
