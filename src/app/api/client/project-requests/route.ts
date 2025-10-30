import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/client/project-requests - Create new project request
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessionToken = authHeader.split('Bearer ')[1]

    // Validate session
    const session = await prisma.clientSession.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: {
            client: true,
          },
        },
      },
    })

    if (!session || !session.user?.client) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, type, priority, budget, deadline, requirements, features, techPreferences } = body

    // Validation
    if (!name || !description || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, type' },
        { status: 400 }
      )
    }

    // Combine features into requirements since features field doesn't exist in schema
    const combinedRequirements = [
      requirements || '',
      features ? `\n\nKey Features:\n${features}` : ''
    ].filter(Boolean).join('')

    // Create project with 'planning' status (admin needs to approve/review)
    const project = await prisma.project.create({
      data: {
        name,
        description,
        type: type || 'web-app',
        status: 'planning', // Starts in planning, admin can change
        priority: priority || 'medium',
        progress: 0,
        clientId: session.user.client.id,
        budget: budget ? parseFloat(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
        requirements: combinedRequirements || null,
        techStack: techPreferences || null,
        notes: `Requested by client via portal.`,
      },
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'new-project-request',
        title: `New Project Request: ${name}`,
        message: `${session.user.client.name} has submitted a new project request.`,
        link: `/admin/projects?projectId=${project.id}`,
        priority: 'high',
        entityType: 'Project',
        entityId: project.id,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Created',
        entity: 'Project',
        entityId: project.id,
        description: `Client ${session.user.client.name} requested new project: ${name}`,
        metadata: JSON.stringify({
          clientId: session.user.client.id,
          projectType: type,
          source: 'client-portal',
        }),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Project request submitted successfully',
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
      },
    })
  } catch (error) {
    console.error('Create project request error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project request' },
      { status: 500 }
    )
  }
}

// GET /api/client/project-requests - Get all project requests for client
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessionToken = authHeader.split('Bearer ')[1]

    const session = await prisma.clientSession.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: {
            client: {
              include: {
                projects: {
                  where: {
                    status: 'planning', // Only show pending requests
                  },
                  orderBy: { createdAt: 'desc' },
                },
              },
            },
          },
        },
      },
    })

    if (!session || !session.user?.client) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      requests: session.user.client.projects,
    })
  } catch (error) {
    console.error('Get project requests error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}
