import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = params.id
    const body = await request.json()
    const { content, parentId } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = params.id

    // Fetch all comments (including replies)
    const allComments = await prisma.projectComment.findMany({
      where: { projectId },
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

    return NextResponse.json({ comments: topLevelComments })
  } catch (error) {
    console.error('Fetch comments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
