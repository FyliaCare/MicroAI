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
      // Enhanced fields
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
    if (setupFee !== undefined) updateData.setupFee = parseFloat(setupFee)
    if (developmentCost !== undefined) updateData.developmentCost = parseFloat(developmentCost)
    if (designCost !== undefined) updateData.designCost = parseFloat(designCost)
    if (monthlyHosting !== undefined) updateData.monthlyHosting = parseFloat(monthlyHosting)
    if (monthlyMaintenance !== undefined) updateData.monthlyMaintenance = parseFloat(monthlyMaintenance)
    if (hostingBreakdown !== undefined) updateData.hostingBreakdown = hostingBreakdown ? JSON.stringify(hostingBreakdown) : null
    if (deliverables !== undefined) updateData.deliverables = deliverables ? JSON.stringify(deliverables) : null
    if (milestones !== undefined) updateData.milestones = milestones ? JSON.stringify(milestones) : null
    if (monthlyRecurring !== undefined) updateData.monthlyRecurring = parseFloat(monthlyRecurring)
    if (yearlyRecurring !== undefined) updateData.yearlyRecurring = parseFloat(yearlyRecurring)

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
