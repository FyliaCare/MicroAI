import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/quote-templates/[id] - Get a single template
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.quoteTemplate.findUnique({
      where: { id: params.id },
    })

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      template,
    })
  } catch (error: any) {
    console.error('Error fetching quote template:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/quote-templates/[id] - Update a template
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const template = await prisma.quoteTemplate.update({
      where: { id: params.id },
      data: {
        ...body.name && { name: body.name },
        ...body.category && { category: body.category },
        ...body.description !== undefined && { description: body.description },
        ...body.setupFee !== undefined && { setupFee: parseFloat(body.setupFee) },
        ...body.developmentCost !== undefined && { developmentCost: parseFloat(body.developmentCost) },
        ...body.designCost !== undefined && { designCost: parseFloat(body.designCost) },
        ...body.monthlyHosting !== undefined && { monthlyHosting: parseFloat(body.monthlyHosting) },
        ...body.monthlyMaintenance !== undefined && { monthlyMaintenance: parseFloat(body.monthlyMaintenance) },
        ...body.estimatedHours !== undefined && { estimatedHours: parseInt(body.estimatedHours) },
        ...body.timeline !== undefined && { timeline: body.timeline },
        ...body.techStack !== undefined && { techStack: JSON.stringify(body.techStack) },
        ...body.features !== undefined && { features: JSON.stringify(body.features) },
        ...body.deliverables !== undefined && { deliverables: JSON.stringify(body.deliverables) },
        ...body.hostingBreakdown !== undefined && { hostingBreakdown: JSON.stringify(body.hostingBreakdown) },
        ...body.milestones !== undefined && { milestones: JSON.stringify(body.milestones) },
        ...body.actualCosts !== undefined && { actualCosts: JSON.stringify(body.actualCosts) },
        ...body.profitMargin !== undefined && { profitMargin: parseFloat(body.profitMargin) },
        ...body.isActive !== undefined && { isActive: body.isActive },
        ...body.sortOrder !== undefined && { sortOrder: parseInt(body.sortOrder) },
      },
    })

    return NextResponse.json({
      success: true,
      template,
      message: 'Template updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating quote template:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/quote-templates/[id] - Delete a template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.quoteTemplate.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting quote template:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
