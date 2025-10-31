import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/chat/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sessionId,
      senderType,
      senderId,
      senderName,
      message,
      messageType = 'text',
      fileUrl,
      fileName,
      fileSize,
      fileType,
    } = body

    // Validate required fields
    if (!sessionId || !senderType || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create message
    const chatMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        senderType,
        senderId,
        senderName,
        message,
        messageType,
        fileUrl,
        fileName,
        fileSize,
        fileType,
      },
    })

    // Update session last message time
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        lastMessageAt: new Date(),
      },
    })

    // Clear typing indicator for this sender
    await prisma.chatTypingIndicator.deleteMany({
      where: {
        sessionId,
        userType: senderType,
      },
    })

    // Create admin notification for visitor messages
    if (senderType === 'visitor') {
      try {
        const session = await prisma.chatSession.findUnique({
          where: { id: sessionId },
          select: { visitorName: true, visitorEmail: true },
        })

        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true },
        })

        const notificationPromises = admins.map((admin) =>
          prisma.notification.create({
            data: {
              userId: admin.id,
              type: 'CHAT_MESSAGE',
              title: 'New Chat Message',
              message: `${session?.visitorName || 'Visitor'} sent a message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
              link: '/admin/chat',
              isRead: false,
            },
          })
        )

        await Promise.all(notificationPromises)
      } catch (notifError) {
        console.error('Error creating notification:', notifError)
      }
    }

    return NextResponse.json({
      success: true,
      message: chatMessage,
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// GET /api/chat/messages?sessionId=xxx&limit=50&before=messageId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId is required' },
        { status: 400 }
      )
    }

    const where: any = { sessionId }
    
    // Pagination: get messages before a specific message ID
    if (before) {
      const beforeMessage = await prisma.chatMessage.findUnique({
        where: { id: before },
        select: { createdAt: true },
      })
      if (beforeMessage) {
        where.createdAt = {
          lt: beforeMessage.createdAt,
        }
      }
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    // Return in ascending order
    messages.reverse()

    return NextResponse.json({
      success: true,
      messages,
      hasMore: messages.length === limit,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
