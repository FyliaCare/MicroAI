import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkBotProtection } from '@/lib/bot-protection'

export const dynamic = 'force-dynamic'

// POST /api/chat/sessions - Create or get existing chat session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      visitorId,
      visitorName,
      visitorEmail,
      visitorPhone,
      visitorIp,
      visitorDevice,
      visitorBrowser,
      visitorLocation,
      currentPage,
      referrer,
    } = body

    // Bot protection check for new session creation
    const protection = await checkBotProtection(request, body)
    if (!protection.allowed) {
      console.log('🚫 Chat session creation blocked:', protection.fingerprint.ip, protection.reason)
      return NextResponse.json(
        { success: false, error: 'Unable to start chat session. Please try again later.' },
        { status: 429 }
      )
    }

    // Check if visitor already has an active session
    let session = null
    if (visitorId) {
      session = await prisma.chatSession.findFirst({
        where: {
          visitorId,
          status: 'active',
        },
        include: {
          ChatMessage: {
            orderBy: { createdAt: 'asc' },
            take: 50,
          },
          User: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })
    }

    // Create new session if none exists
    if (!session) {
      const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      session = await prisma.chatSession.create({
        data: {
          id: sessionId,
          visitorId,
          visitorName,
          visitorEmail,
          visitorPhone,
          visitorIp,
          visitorDevice,
          visitorBrowser,
          visitorLocation,
          currentPage,
          referrer,
          status: 'active',
        },
        include: {
          ChatMessage: true,
          User: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })

      // Create system message
      await prisma.chatMessage.create({
        data: {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sessionId: session.id,
          senderType: 'system',
          senderName: 'System',
          message: 'Chat session started. An agent will be with you shortly.',
          messageType: 'system',
        },
      })
    }

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    console.error('Error creating/getting chat session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create chat session' },
      { status: 500 }
    )
  }
}

// GET /api/chat/sessions - Get all chat sessions (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const assignedToId = searchParams.get('assignedTo')

    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }
    if (assignedToId) {
      where.assignedToId = assignedToId
    }

    const sessions = await prisma.chatSession.findMany({
      where,
      include: {
        ChatMessage: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        User: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            ChatMessage: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      take: 100,
    })

    // Get unread message counts per session
    const sessionsWithUnread = await Promise.all(
      sessions.map(async (session) => {
        const unreadCount = await prisma.chatMessage.count({
          where: {
            sessionId: session.id,
            senderType: 'visitor',
            isRead: false,
          },
        })

        return {
          ...session,
          unreadCount,
        }
      })
    )

    return NextResponse.json({
      success: true,
      sessions: sessionsWithUnread,
    })
  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat sessions' },
      { status: 500 }
    )
  }
}
