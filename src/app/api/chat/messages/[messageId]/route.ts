import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// PATCH /api/chat/messages/[messageId] - Mark message as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const message = await prisma.chatMessage.update({
      where: { id: params.messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error('Error marking message as read:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to mark message as read' },
      { status: 500 }
    )
  }
}

// POST /api/chat/messages/mark-read - Bulk mark messages as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, senderType } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId is required' },
        { status: 400 }
      )
    }

    const where: any = {
      sessionId,
      isRead: false,
    }

    if (senderType) {
      where.senderType = senderType
    }

    const result = await prisma.chatMessage.updateMany({
      where,
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      count: result.count,
    })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}
