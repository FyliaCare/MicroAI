import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/chat/poll - Poll for new messages and updates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const lastMessageId = searchParams.get('lastMessageId')
    const isAdmin = searchParams.get('isAdmin') === 'true'

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId is required' },
        { status: 400 }
      )
    }

    // Get new messages
    const where: any = { sessionId }
    if (lastMessageId) {
      const lastMessage = await prisma.chatMessage.findUnique({
        where: { id: lastMessageId },
        select: { createdAt: true },
      })
      if (lastMessage) {
        where.createdAt = {
          gt: lastMessage.createdAt,
        }
      }
    }

    const newMessages = await prisma.chatMessage.findMany({
      where,
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Get typing indicators
    const typingIndicators = await prisma.chatTypingIndicator.findMany({
      where: {
        sessionId,
        isTyping: true,
        updatedAt: {
          gte: new Date(Date.now() - 10000),
        },
        // Exclude own typing indicator
        userType: isAdmin ? 'visitor' : 'admin',
      },
    })

    // Get unread count
    const unreadCount = await prisma.chatMessage.count({
      where: {
        sessionId,
        isRead: false,
        senderType: isAdmin ? 'visitor' : 'admin',
      },
    })

    // Get session status
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: {
        status: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      newMessages,
      typingIndicators,
      unreadCount,
      sessionStatus: session?.status,
      assignedAgent: session?.assignedTo,
    })
  } catch (error) {
    console.error('Error polling for updates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to poll for updates' },
      { status: 500 }
    )
  }
}
