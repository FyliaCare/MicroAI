import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// PATCH /api/chat/sessions/[sessionId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const body = await request.json()
    const { status, assignedToId, rating, feedback, tags, metadata } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId
    if (rating !== undefined) updateData.rating = rating
    if (feedback !== undefined) updateData.feedback = feedback
    if (tags !== undefined) updateData.tags = tags
    if (metadata !== undefined) updateData.metadata = metadata

    if (status === 'closed') {
      updateData.closedAt = new Date()
    }

    const session = await prisma.chatSession.update({
      where: { id: params.sessionId },
      data: updateData,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    // If assigned, create system message
    if (assignedToId && updateData.assignedToId) {
      await prisma.chatMessage.create({
        data: {
          sessionId: params.sessionId,
          senderType: 'system',
          senderName: 'System',
          message: 'An agent has joined the chat.',
          messageType: 'system',
        },
      })
    }

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    console.error('Error updating chat session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update chat session' },
      { status: 500 }
    )
  }
}

// GET /api/chat/sessions/[sessionId]
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: params.sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    console.error('Error fetching chat session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat session' },
      { status: 500 }
    )
  }
}

// DELETE /api/chat/sessions/[sessionId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Delete all messages first
    await prisma.chatMessage.deleteMany({
      where: { sessionId: params.sessionId },
    })

    // Delete typing indicators
    await prisma.chatTypingIndicator.deleteMany({
      where: { sessionId: params.sessionId },
    })

    // Delete session
    await prisma.chatSession.delete({
      where: { id: params.sessionId },
    })

    return NextResponse.json({
      success: true,
      message: 'Chat session deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting chat session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete chat session' },
      { status: 500 }
    )
  }
}
