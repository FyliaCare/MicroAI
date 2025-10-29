import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/quotes/[id] - Get public quote details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: {
        id: true,
        quoteNumber: true,
        title: true,
        description: true,
        status: true,
        total: true,
        currency: true,
        validUntil: true,
        createdAt: true,
        issuedAt: true,
        
        // Company info
        companyName: true,
        companyEmail: true,
        companyPhone: true,
        companyAddress: true,
        companyWebsite: true,
        companyLogo: true,
        
        // Client info
        clientName: true,
        clientCompany: true,
        clientEmail: true,
        clientPhone: true,
        clientAddress: true,
        
        // Project details
        projectType: true,
        
        // Scope
        scopeOfWork: true,
        exclusions: true,
        
        // Pricing
        pricingItems: true,
        subtotal: true,
        tax: true,
        discount: true,
        
        // Timeline
        timeline: true,
        estimatedHours: true,
        milestones: true,
        
        // Terms
        paymentTerms: true,
        assumptions: true,
        clientObligations: true,
        terms: true,
        
        // Signatures
        clientSignature: true,
        clientSignedAt: true,
        clientSignedBy: true,
      },
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Check if quote is accessible (not draft or deleted)
    if (quote.status === 'draft') {
      return NextResponse.json(
        { success: false, error: 'Quote is not yet available' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, quote })
  } catch (error) {
    console.error('Get quote error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}
