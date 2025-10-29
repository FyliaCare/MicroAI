import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/client/updates - Get project updates for client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    // Get session token from header
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

    if (!session || session.expiresAt < new Date() || !session.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    if (!session.user.client) {
      return NextResponse.json(
        { success: false, error: 'No client account found' },
        { status: 404 }
      )
    }

    // Build query
    const where: any = {
      project: {
        clientId: session.user.client.id,
      },
      isPublic: true, // Only show public updates to clients
    }

    if (projectId) {
      // Verify project access
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          clientId: session.user.client.id,
        },
      })

      if (!project) {
        return NextResponse.json(
          { success: false, error: 'Project not found or access denied' },
          { status: 404 }
        )
      }

      where.projectId = projectId
    }

    // Get updates
    const updates = await prisma.projectUpdate.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        readBy: {
          where: {
            userId: session.user.id,
          },
          select: {
            readAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      updates: updates.map((update) => ({
        id: update.id,
        projectId: update.projectId,
        projectName: update.project.name,
        title: update.title,
        content: update.content,
        type: update.type,
        progressBefore: update.progressBefore,
        progressAfter: update.progressAfter,
        isRead: update.readBy.length > 0,
        readAt: update.readBy[0]?.readAt || null,
        createdAt: update.createdAt,
      })),
      stats: {
        total: updates.length,
        unread: updates.filter((u) => u.readBy.length === 0).length,
      },
    })
  } catch (error) {
    console.error('Get client updates error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch updates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/client/updates/[id]/read - Mark update as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { updateId } = body

    if (!updateId) {
      return NextResponse.json(
        { success: false, error: 'Update ID required' },
        { status: 400 }
      )
    }

    // Get session token from header
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

    if (!session || session.expiresAt < new Date() || !session.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    if (!session.user.client) {
      return NextResponse.json(
        { success: false, error: 'No client account found' },
        { status: 404 }
      )
    }

    // Get update and verify access
    const update = await prisma.projectUpdate.findFirst({
      where: {
        id: updateId,
        project: {
          clientId: session.user.client.id,
        },
        isPublic: true,
      },
    })

    if (!update) {
      return NextResponse.json(
        { success: false, error: 'Update not found or access denied' },
        { status: 404 }
      )
    }

    // Check if already read
    const existingRead = await prisma.projectUpdateRead.findFirst({
      where: {
        updateId,
        userId: session.user.id,
      },
    })

    if (existingRead) {
      return NextResponse.json({
        success: true,
        message: 'Update already marked as read',
        readAt: existingRead.readAt,
      })
    }

    // Mark as read
    const read = await prisma.projectUpdateRead.create({
      data: {
        updateId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Update marked as read',
      readAt: read.readAt,
    })
  } catch (error) {
    console.error('Mark update as read error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to mark update as read',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
