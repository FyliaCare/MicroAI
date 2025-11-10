import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 POST /comments - Session check:', {
      hasSession: !!session,
      userRole: session?.user?.role,
      userEmail: session?.user?.email
    })
    
    if (!session || !['ADMIN', 'super-admin'].includes(session.user.role)) {
      console.log('❌ POST /comments - Auth failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ POST /comments - Auth passed')
    const projectId = params.id
    const body = await request.json()
    const { content, parentId } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            userId: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // If parentId is provided, verify it exists
    if (parentId) {
      const parentComment = await prisma.projectComment.findUnique({
        where: { id: parentId },
      })

      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 })
      }
    }

    // Create comment
    const comment = await prisma.projectComment.create({
      data: {
        projectId,
        content: content.trim(),
        authorName: session.user.name || 'Admin',
        authorRole: 'ADMIN',
        parentId: parentId || null,
      },
    })

    // Note: Client notifications would require a separate notification system for clients
    // Current notification system is admin-only

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 GET /comments - Session check:', {
      hasSession: !!session,
      userRole: session?.user?.role,
      userEmail: session?.user?.email
    })
    
    if (!session || !['ADMIN', 'super-admin'].includes(session.user.role)) {
      console.log('❌ GET /comments - Auth failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ GET /comments - Auth passed')
    const projectId = params.id

    // Fetch comments from both tables in parallel
    const [projectComments, legacyComments] = await Promise.all([
      // ProjectComment table (current system - admin and client comments)
      prisma.projectComment.findMany({
        where: { projectId },
        orderBy: { createdAt: 'asc' },
      }),
      // Comment table (legacy internal team comments)
      prisma.comment.findMany({
        where: { projectId, isInternal: false },
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
      }),
    ])

    // Convert legacy comments to ProjectComment format
    const normalizedLegacyComments = legacyComments.map((comment) => {
      let parsedContent
      try {
        parsedContent = JSON.parse(comment.content)
      } catch {
        parsedContent = { text: comment.content, authorType: 'admin' }
      }

      return {
        id: comment.id,
        projectId: comment.projectId || projectId,
        content: typeof parsedContent === 'string' ? parsedContent : parsedContent.text || comment.content,
        authorName: parsedContent.authorName || comment.author?.name || 'Client',
        authorRole: parsedContent.authorType === 'client' ? 'CLIENT' : 'ADMIN',
        parentId: comment.parentId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        source: 'legacy' as const,
      }
    })

    // Merge both arrays
    const allComments = [
      ...projectComments.map(c => ({ ...c, source: 'current' as const })),
      ...normalizedLegacyComments,
    ]

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

    return NextResponse.json({ comments: topLevelComments })
  } catch (error) {
    console.error('Fetch comments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID required' }, { status: 400 })
    }

    // Verify the comment exists
    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Delete the comment
    await prisma.projectComment.delete({
      where: { id: commentId },
    })

    console.log('✅ Admin comment deleted:', commentId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
