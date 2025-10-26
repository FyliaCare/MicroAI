import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/projects - List all projects with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const type = searchParams.get('type')

    const where: any = {}
    if (status) where.status = status
    if (clientId) where.clientId = clientId
    if (type) where.type = type

    const projects = await prisma.project.findMany({
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
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        milestones: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
          },
        },
        quote: {
          select: {
            id: true,
            quoteNumber: true,
            total: true,
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
      projects,
      count: projects.length,
    })
  } catch (error: any) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      description,
      type,
      status,
      priority,
      budget,
      startDate,
      endDate,
      deadline,
      clientId,
      techStack,
      githubRepo,
      liveUrl,
      stagingUrl,
      notes,
    } = body

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Project type is required' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        type,
        status: status || 'planning',
        priority: priority || 'medium',
        budget: budget ? parseFloat(budget) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        clientId: clientId || null,
        techStack: techStack ? JSON.stringify(techStack) : null,
        githubRepo,
        liveUrl,
        stagingUrl,
        notes,
      },
      include: {
        client: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Created',
        entity: 'Project',
        entityId: project.id,
        description: `Created project: ${project.name}`,
      },
    })

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
