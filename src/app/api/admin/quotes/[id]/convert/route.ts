import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin/quotes/[id]/convert - Convert accepted quote to project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id

    // Fetch the quote with client info
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        client: true,
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Verify quote is accepted
    if (quote.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Only accepted quotes can be converted to projects' },
        { status: 400 }
      )
    }

    // Check if already converted
    if (quote.projectId) {
      return NextResponse.json(
        { error: 'Quote has already been converted to a project', projectId: quote.projectId },
        { status: 400 }
      )
    }

    // Parse quote data safely
    let items: any[] = []
    let milestones: any[] = []
    let scopeOfWork: any[] = []
    
    try {
      items = quote.items ? JSON.parse(quote.items) : []
    } catch (e) {
      console.error('Failed to parse items:', e)
    }
    
    try {
      milestones = quote.milestones ? JSON.parse(quote.milestones) : []
    } catch (e) {
      console.error('Failed to parse milestones:', e)
    }
    
    try {
      const quoteData = quote as any
      scopeOfWork = quoteData.scopeOfWork ? JSON.parse(quoteData.scopeOfWork) : []
    } catch (e) {
      console.error('Failed to parse scopeOfWork:', e)
    }

    // Calculate project budget
    const budget = quote.total || 0

    // Determine project timeline
    const estimatedDays = quote.estimatedHours ? Math.ceil(quote.estimatedHours / 8) : 30
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + estimatedDays)

    // Create project description from quote
    let description = quote.description || ''
    
    // Add scope of work if available
    if (scopeOfWork.length > 0) {
      description += '\n\nScope of Work:\n' + scopeOfWork.join('\n')
    }

    // Get project type
    const projectType = quote.projectType || 'custom'

    // Create the project
    const project = await prisma.project.create({
      data: {
        name: quote.title,
        description: description,
        clientId: quote.clientId,
        type: projectType,
        status: 'planning',
        priority: 'medium',
        budget: budget,
        startDate: startDate,
        endDate: endDate,
        notes: `Converted from quote ${quote.quoteNumber}`,
        customFields: JSON.stringify({
          convertedFromQuote: true,
          quoteId: quote.id,
          quoteNumber: quote.quoteNumber,
          items: items,
          milestones: milestones,
          originalTotal: quote.total,
          projectType: projectType,
        }),
      } as any, // Type assertion for Prisma client sync
    })

    // Update quote with project reference
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        projectId: project.id,
      },
    })

    // Create project milestones from quote milestones
    if (milestones.length > 0) {
      let currentDate = new Date(startDate)
      
      for (const milestone of milestones) {
        const dueDate = new Date(currentDate)
        dueDate.setDate(dueDate.getDate() + (milestone.duration || 7))
        
        await prisma.milestone.create({
          data: {
            projectId: project.id,
            title: milestone.title,
            description: milestone.description || '',
            dueDate: dueDate,
            status: 'pending',
            deliverables: JSON.stringify(milestone.deliverables || []),
            paymentAmount: milestone.amount || 0,
          },
        })
        
        currentDate = dueDate
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Converted',
        entity: 'Quote',
        entityId: quote.id,
        description: `Converted quote ${quote.quoteNumber} to project: ${project.name}`,
        metadata: JSON.stringify({
          projectId: project.id,
          projectName: project.name,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      project,
      message: 'Quote successfully converted to project',
    })
  } catch (error) {
    console.error('Quote conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to convert quote to project' },
      { status: 500 }
    )
  }
}
