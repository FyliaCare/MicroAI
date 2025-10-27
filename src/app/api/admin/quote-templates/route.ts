import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/quote-templates - List all quote templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'
    const category = searchParams.get('category')

    const where: any = {}
    if (activeOnly) where.isActive = true
    if (category) where.category = category

    const templates = await prisma.quoteTemplate.findMany({
      where,
      orderBy: {
        sortOrder: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      templates,
      count: templates.length,
    })
  } catch (error: any) {
    console.error('Error fetching quote templates:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/quote-templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      category,
      description,
      setupFee,
      developmentCost,
      designCost,
      monthlyHosting,
      monthlyMaintenance,
      estimatedHours,
      timeline,
      techStack,
      features,
      deliverables,
      hostingBreakdown,
      milestones,
      actualCosts,
      profitMargin,
      isActive,
      sortOrder,
    } = body

    // Validation
    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      )
    }

    const template = await prisma.quoteTemplate.create({
      data: {
        name,
        category,
        description: description || null,
        setupFee: setupFee ? parseFloat(setupFee) : 0,
        developmentCost: developmentCost ? parseFloat(developmentCost) : null,
        designCost: designCost ? parseFloat(designCost) : null,
        monthlyHosting: monthlyHosting ? parseFloat(monthlyHosting) : 0,
        monthlyMaintenance: monthlyMaintenance ? parseFloat(monthlyMaintenance) : null,
        estimatedHours: estimatedHours ? parseInt(estimatedHours) : null,
        timeline: timeline || null,
        techStack: techStack ? JSON.stringify(techStack) : null,
        features: features ? JSON.stringify(features) : null,
        deliverables: deliverables ? JSON.stringify(deliverables) : null,
        hostingBreakdown: hostingBreakdown ? JSON.stringify(hostingBreakdown) : null,
        milestones: milestones ? JSON.stringify(milestones) : null,
        actualCosts: actualCosts ? JSON.stringify(actualCosts) : null,
        profitMargin: profitMargin ? parseFloat(profitMargin) : null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 999,
      },
    })

    return NextResponse.json({
      success: true,
      template,
      message: 'Quote template created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating quote template:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/quote-templates - Bulk update (e.g., reorder)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { updates } = body

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: 'Updates array is required' },
        { status: 400 }
      )
    }

    // Process updates in transaction
    const results = await prisma.$transaction(
      updates.map(({ id, ...data }) => 
        prisma.quoteTemplate.update({
          where: { id },
          data,
        })
      )
    )

    return NextResponse.json({
      success: true,
      updated: results.length,
      message: 'Templates updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating quote templates:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
