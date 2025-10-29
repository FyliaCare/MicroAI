import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Generate unique quote number
function generateQuoteNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `QT-${year}${month}-${random}`
}

// GET /api/admin/quotes - List all quotes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const where: any = {}
    if (status) where.status = status
    if (clientId) where.clientId = clientId

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      quotes,
      count: quotes.length,
    })
  } catch (error: any) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/quotes - Create a new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      clientId,
      projectId,
      items,
      subtotal,
      tax,
      discount,
      validUntil,
      notes,
      terms,
      // Legacy enhanced fields
      projectType,
      estimatedHours,
      timeline,
      techStack,
      setupFee,
      developmentCost,
      designCost,
      monthlyHosting,
      monthlyMaintenance,
      hostingBreakdown,
      deliverables,
      milestones,
      monthlyRecurring,
      yearlyRecurring,
      // New comprehensive quote fields
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyWebsite,
      companyLogo,
      clientName,
      clientCompany,
      clientEmail,
      contactPerson,
      executiveSummary,
      scopeOfWork,
      exclusions,
      technicalStack,
      paymentTerms,
      assumptions,
      clientObligations,
      maintenanceTerms,
      intellectualProperty,
      revisionsPolicy,
      confidentiality,
      authorizedSignatory,
      pricingItems,
    } = body

    // Validation
    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Quote title is required' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Quote must have at least one item' },
        { status: 400 }
      )
    }

    // Calculate total
    const taxAmount = tax || 0
    const discountAmount = discount || 0
    const total = subtotal + taxAmount - discountAmount

    // Generate unique quote number
    let quoteNumber = generateQuoteNumber()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.quote.findUnique({
        where: { quoteNumber },
      })
      if (!existing) break
      quoteNumber = generateQuoteNumber()
      attempts++
    }

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        title,
        description,
        clientId: clientId || null,
        projectId: projectId || null,
        items: JSON.stringify(items),
        subtotal: parseFloat(subtotal),
        tax: taxAmount,
        discount: discountAmount,
        total,
        validUntil: validUntil ? new Date(validUntil) : null,
        notes,
        terms,
        status: 'draft',
        // Legacy enhanced fields
        projectType: projectType || null,
        estimatedHours: estimatedHours ? parseInt(estimatedHours) : null,
        timeline: timeline || null,
        techStack: technicalStack ? JSON.stringify(technicalStack) : (techStack ? JSON.stringify(techStack) : null),
        setupFee: setupFee ? parseFloat(setupFee) : undefined,
        developmentCost: developmentCost ? parseFloat(developmentCost) : undefined,
        designCost: designCost ? parseFloat(designCost) : undefined,
        monthlyHosting: monthlyHosting ? parseFloat(monthlyHosting) : undefined,
        monthlyMaintenance: monthlyMaintenance ? parseFloat(monthlyMaintenance) : undefined,
        hostingBreakdown: hostingBreakdown ? JSON.stringify(hostingBreakdown) : null,
        deliverables: deliverables ? JSON.stringify(deliverables) : null,
        milestones: milestones ? JSON.stringify(milestones) : null,
        monthlyRecurring: monthlyRecurring ? parseFloat(monthlyRecurring) : undefined,
        yearlyRecurring: yearlyRecurring ? parseFloat(yearlyRecurring) : undefined,
        // New comprehensive quote fields
        companyName: companyName || null,
        companyEmail: companyEmail || null,
        companyPhone: companyPhone || null,
        companyAddress: companyAddress || null,
        companyWebsite: companyWebsite || null,
        companyLogo: companyLogo || null,
        clientName: clientName || null,
        clientCompany: clientCompany || null,
        clientEmail: clientEmail || null,
        contactPerson: contactPerson || null,
        executiveSummary: executiveSummary ? JSON.stringify(executiveSummary) : null,
        scopeOfWork: scopeOfWork ? JSON.stringify(scopeOfWork) : null,
        exclusions: exclusions ? JSON.stringify(exclusions) : null,
        paymentTerms: paymentTerms ? JSON.stringify(paymentTerms) : null,
        assumptions: assumptions ? JSON.stringify(assumptions) : null,
        clientObligations: clientObligations ? JSON.stringify(clientObligations) : null,
        maintenanceTerms: maintenanceTerms ? JSON.stringify(maintenanceTerms) : null,
        ipRights: intellectualProperty ? JSON.stringify(intellectualProperty) : null,
        revisionsPolicy: revisionsPolicy ? JSON.stringify(revisionsPolicy) : null,
        confidentialityClause: confidentiality || null,
        providerSignedBy: authorizedSignatory || null,
        pricingItems: pricingItems ? JSON.stringify(pricingItems) : null,
      },
      include: {
        client: true,
        project: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Created',
        entity: 'Quote',
        entityId: quote.id,
        description: `Created quote: ${quote.quoteNumber} - ${quote.title}`,
      },
    })

    return NextResponse.json({
      success: true,
      quote,
      message: 'Quote created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
