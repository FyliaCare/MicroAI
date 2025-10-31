import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/chat/typing - Set typing indicator
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, userType, isTyping = true } = body

    if (!sessionId || !userType) {
      return NextResponse.json(
        { success: false, error: 'sessionId and userType are required' },
        { status: 400 }
      )
    }

    if (isTyping) {
      // Create or update typing indicator
      await prisma.chatTypingIndicator.upsert({
        where: {
          sessionId_userType: {
            sessionId,
            userType,
          },
        },
        create: {
          sessionId,
          userType,
          isTyping: true,
        },
        update: {
          isTyping: true,
          updatedAt: new Date(),
        },
      })
    } else {
      // Remove typing indicator
      await prisma.chatTypingIndicator.deleteMany({
        where: {
          sessionId,
          userType,
        },
      })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error updating typing indicator:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update typing indicator' },
      { status: 500 }
    )
  }
}

// GET /api/chat/typing?sessionId=xxx - Get typing indicators
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId is required' },
        { status: 400 }
      )
    }

    const indicators = await prisma.chatTypingIndicator.findMany({
      where: {
        sessionId,
        isTyping: true,
        // Only show indicators from the last 10 seconds
        updatedAt: {
          gte: new Date(Date.now() - 10000),
        },
      },
    })

    return NextResponse.json({
      success: true,
      indicators,
    })
  } catch (error) {
    console.error('Error fetching typing indicators:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch typing indicators' },
      { status: 500 }
    )
  }
}
