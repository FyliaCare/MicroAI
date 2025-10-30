import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/client/projects/[id]/comments - Add comment to project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify client owns this project
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        clientId: session.user.client.id,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { content, parentId } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment content is required' },
        { status: 400 }
      )
    }

    // Create comment (without authorId since client comments don't have TeamMember)
    // We'll store client info in the content metadata
    const comment = await prisma.comment.create({
      data: {
        content: JSON.stringify({
          text: content,
          authorType: 'client',
          authorName: session.user.client.name,
          authorEmail: session.user.client.email,
          authorId: session.user.client.id,
        }),
        projectId: params.id,
        parentId: parentId || null,
        isInternal: false, // Client comments are not internal
      },
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'new-comment',
        title: `New comment on ${project.name}`,
        message: `${session.user.client.name} commented on the project`,
        link: `/admin/projects?projectId=${params.id}`,
        priority: 'medium',
        entityType: 'Project',
        entityId: params.id,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Commented',
        entity: 'Project',
        entityId: params.id,
        description: `Client ${session.user.client.name} added a comment`,
        metadata: JSON.stringify({
          commentId: comment.id,
          clientId: session.user.client.id,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        content: JSON.parse(comment.content),
        createdAt: comment.createdAt,
      },
    })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

// GET /api/client/projects/[id]/comments - Get comments for project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify client owns this project
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        clientId: session.user.client.id,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Get all non-internal comments for this project
    const comments = await prisma.comment.findMany({
      where: {
        projectId: params.id,
        isInternal: false, // Only show non-internal comments to client
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Parse content and format for client
    const formattedComments = comments.map((comment) => {
      let parsedContent
      try {
        parsedContent = JSON.parse(comment.content)
      } catch {
        parsedContent = { text: comment.content, authorType: 'admin' }
      }

      return {
        id: comment.id,
        content: parsedContent,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: comment.author || parsedContent,
        replies: comment.replies.map((reply) => {
          let replyContent
          try {
            replyContent = JSON.parse(reply.content)
          } catch {
            replyContent = { text: reply.content, authorType: 'admin' }
          }
          return {
            id: reply.id,
            content: replyContent,
            createdAt: reply.createdAt,
            author: reply.author || replyContent,
          }
        }),
      }
    })

    return NextResponse.json({
      success: true,
      comments: formattedComments,
    })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
