import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// POST /api/client/project-requests - Create new project request (pending admin approval)
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

    const client = session.user.client

    // Generate unique request number
    const requestCount = await prisma.projectRequest.count()
    const requestNumber = `PR-${String(requestCount + 1).padStart(4, '0')}`

    // Create PROJECT REQUEST (not project yet - awaiting admin approval)
    const projectRequest = await prisma.projectRequest.create({
      data: {
        requestNumber,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        clientCompany: client.company,
        clientWebsite: client.website,
        projectName: name,
        projectType: type,
        description,
        requirements: requirements || '',
        features: features || null,
        techPreferences: techPreferences || null,
        budget: budget ? parseFloat(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
        priority: priority || 'normal',
        status: 'pending', // Awaiting admin review
        clientId: client.id,
        source: 'client-portal',
      },
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'new-project-request',
        title: `New Project Request: ${name}`,
        message: `${client.name} has submitted a new project request (${requestNumber}). Click to review and approve.`,
        link: `/admin/project-requests?requestId=${projectRequest.id}`,
        priority: 'high',
        entityType: 'ProjectRequest',
        entityId: projectRequest.id,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Created',
        entity: 'ProjectRequest',
        entityId: projectRequest.id,
        description: `Client ${client.name} submitted project request: ${name} (${requestNumber})`,
        metadata: JSON.stringify({
          clientId: client.id,
          projectType: type,
          source: 'client-portal',
          requestNumber,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Project request submitted successfully! Our team will review it shortly.',
      projectRequest: {
        id: projectRequest.id,
        requestNumber: projectRequest.requestNumber,
        projectName: projectRequest.projectName,
        status: projectRequest.status,
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

    // Get project requests for this client
    const requests = await prisma.projectRequest.findMany({
      where: {
        clientId: session.user.client.id,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      requests,
    })
  } catch (error) {
    console.error('Get project requests error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}
