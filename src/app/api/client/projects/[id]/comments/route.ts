import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const dynamic = 'force-dynamic'

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

    const token = authHeader.split('Bearer ')[1]
    
    // Try JWT first
    let clientId: string | null = null
    let clientName: string | null = null
    let clientEmail: string | null = null
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      clientId = decoded.clientId
      clientEmail = decoded.email
      
      // Get client name from database
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        select: { name: true },
      })
      clientName = client?.name || 'Client'
      
      console.log('JWT auth successful:', { clientId, clientEmail, clientName })
    } catch (err) {
      console.log('JWT verification failed, trying database lookup:', err)
      
      // Fallback to database lookup for old session tokens
      const session = await prisma.clientSession.findFirst({
        where: { 
          sessionToken: token,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
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
          { success: false, error: 'Invalid or expired session' },
          { status: 401 }
        )
      }
      
      clientId = session.user.client.id
      clientName = session.user.client.name
      clientEmail = session.user.client.email
      
      console.log('Database auth successful:', { clientId, clientEmail, clientName })
    }

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID not found' },
        { status: 401 }
      )
    }

    // Verify client owns this project
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        clientId: clientId,
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

    // Create comment using ProjectComment table (unified with admin)
    const comment = await prisma.projectComment.create({
      data: {
        content: content.trim(),
        projectId: params.id,
        authorName: clientName || 'Client',
        authorRole: 'CLIENT',
        parentId: parentId || null,
      },
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'new-comment',
        title: `New comment on ${project.name}`,
        message: `${clientName} commented on the project`,
        link: `/admin/projects/${params.id}`,
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
        description: `Client ${clientName} added a comment`,
        metadata: JSON.stringify({
          commentId: comment.id,
          clientId: clientId,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        authorName: comment.authorName,
        authorRole: comment.authorRole,
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

    const token = authHeader.split('Bearer ')[1]
    
    // Try JWT first
    let clientId: string | null = null
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      clientId = decoded.clientId
      console.log('JWT auth successful:', { clientId })
    } catch (err) {
      console.log('JWT verification failed, trying database lookup')
      
      // Fallback to database lookup
      const session = await prisma.clientSession.findFirst({
        where: { 
          sessionToken: token,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
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
          { success: false, error: 'Invalid or expired session' },
          { status: 401 }
        )
      }
      
      clientId = session.user.client.id
      console.log('Database auth successful:', { clientId })
    }

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID not found' },
        { status: 401 }
      )
    }

    // Verify client owns this project
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        clientId: clientId,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Get all comments from ProjectComment table (unified with admin)
    const allComments = await prisma.projectComment.findMany({
      where: {
        projectId: params.id,
      },
      orderBy: { createdAt: 'asc' },
    })

    // Build comment tree (top-level comments with nested replies)
    const commentMap = new Map()
    const topLevelComments: any[] = []

    // First pass: create map of all comments
    allComments.forEach((comment: any) => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: build tree structure
    allComments.forEach((comment: any) => {
      const commentWithReplies = commentMap.get(comment.id)
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId)
        if (parent) {
          parent.replies.push(commentWithReplies)
        }
      } else {
        topLevelComments.push(commentWithReplies)
      }
    })

    // Sort top-level comments by date (newest first)
    topLevelComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({
      success: true,
      comments: topLevelComments,
    })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
