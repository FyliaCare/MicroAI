import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/quotes/[id] - Get a single quote
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            phone: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            description: true,
          },
        },
      },
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      quote,
    })
  } catch (error: any) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/admin/quotes/[id] - Update a quote
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Check if quote exists
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!existingQuote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

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
      status,
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

    // Calculate total if financial fields are provided
    let total = existingQuote.total
    if (subtotal !== undefined) {
      const taxAmount = tax !== undefined ? tax : existingQuote.tax
      const discountAmount = discount !== undefined ? discount : existingQuote.discount
      total = subtotal + taxAmount - discountAmount
    }

    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (clientId !== undefined) updateData.clientId = clientId || null
    if (projectId !== undefined) updateData.projectId = projectId || null
    if (items !== undefined) updateData.items = JSON.stringify(items)
    if (subtotal !== undefined) updateData.subtotal = parseFloat(subtotal)
    if (tax !== undefined) updateData.tax = tax
    if (discount !== undefined) updateData.discount = discount
    if (total !== undefined) updateData.total = total
    if (validUntil !== undefined) updateData.validUntil = validUntil ? new Date(validUntil) : null
    if (notes !== undefined) updateData.notes = notes
    if (terms !== undefined) updateData.terms = terms
    if (status !== undefined) updateData.status = status

    // Enhanced fields
    if (projectType !== undefined) updateData.projectType = projectType
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours ? parseInt(estimatedHours) : null
    if (timeline !== undefined) updateData.timeline = timeline
    if (techStack !== undefined) updateData.techStack = techStack ? JSON.stringify(techStack) : null
    if (setupFee !== undefined) updateData.setupFee = setupFee ? parseFloat(setupFee) : null
    if (developmentCost !== undefined) updateData.developmentCost = developmentCost ? parseFloat(developmentCost) : null
    if (designCost !== undefined) updateData.designCost = designCost ? parseFloat(designCost) : null
    if (monthlyHosting !== undefined) updateData.monthlyHosting = monthlyHosting ? parseFloat(monthlyHosting) : null
    if (monthlyMaintenance !== undefined) updateData.monthlyMaintenance = monthlyMaintenance ? parseFloat(monthlyMaintenance) : null
    if (hostingBreakdown !== undefined) updateData.hostingBreakdown = hostingBreakdown ? JSON.stringify(hostingBreakdown) : null
    if (deliverables !== undefined) updateData.deliverables = deliverables ? JSON.stringify(deliverables) : null
    if (milestones !== undefined) updateData.milestones = milestones ? JSON.stringify(milestones) : null
    if (monthlyRecurring !== undefined) updateData.monthlyRecurring = monthlyRecurring ? parseFloat(monthlyRecurring) : null
    if (yearlyRecurring !== undefined) updateData.yearlyRecurring = yearlyRecurring ? parseFloat(yearlyRecurring) : null

    // New comprehensive quote fields
    if (companyName !== undefined) updateData.companyName = companyName
    if (companyEmail !== undefined) updateData.companyEmail = companyEmail
    if (companyPhone !== undefined) updateData.companyPhone = companyPhone
    if (companyAddress !== undefined) updateData.companyAddress = companyAddress
    if (companyWebsite !== undefined) updateData.companyWebsite = companyWebsite
    if (companyLogo !== undefined) updateData.companyLogo = companyLogo
    if (clientName !== undefined) updateData.clientName = clientName
    if (clientCompany !== undefined) updateData.clientCompany = clientCompany
    if (clientEmail !== undefined) updateData.clientEmail = clientEmail
    if (contactPerson !== undefined) updateData.contactPerson = contactPerson
    if (executiveSummary !== undefined) updateData.executiveSummary = executiveSummary ? JSON.stringify(executiveSummary) : null
    if (scopeOfWork !== undefined) updateData.scopeOfWork = scopeOfWork ? JSON.stringify(scopeOfWork) : null
    if (exclusions !== undefined) updateData.exclusions = exclusions ? JSON.stringify(exclusions) : null
    if (technicalStack !== undefined) updateData.techStack = technicalStack ? JSON.stringify(technicalStack) : null
    if (paymentTerms !== undefined) updateData.paymentTerms = paymentTerms ? JSON.stringify(paymentTerms) : null
    if (assumptions !== undefined) updateData.assumptions = assumptions ? JSON.stringify(assumptions) : null
    if (clientObligations !== undefined) updateData.clientObligations = clientObligations ? JSON.stringify(clientObligations) : null
    if (maintenanceTerms !== undefined) updateData.maintenanceTerms = maintenanceTerms ? JSON.stringify(maintenanceTerms) : null
    if (intellectualProperty !== undefined) updateData.ipRights = intellectualProperty ? JSON.stringify(intellectualProperty) : null
    if (revisionsPolicy !== undefined) updateData.revisionsPolicy = revisionsPolicy ? JSON.stringify(revisionsPolicy) : null
    if (confidentiality !== undefined) updateData.confidentialityClause = confidentiality
    if (authorizedSignatory !== undefined) updateData.providerSignedBy = authorizedSignatory
    if (pricingItems !== undefined) updateData.pricingItems = pricingItems ? JSON.stringify(pricingItems) : null

    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        project: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Updated',
        entity: 'Quote',
        entityId: quote.id,
        description: `Updated quote: ${quote.quoteNumber} - ${quote.title}`,
      },
    })

    return NextResponse.json({
      success: true,
      quote,
      message: 'Quote updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/quotes/[id] - Delete a quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if quote exists
    const existingQuote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!existingQuote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Delete the quote
    await prisma.quote.delete({
      where: { id },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Deleted',
        entity: 'Quote',
        entityId: id,
        description: `Deleted quote: ${existingQuote.quoteNumber} - ${existingQuote.title}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting quote:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
