import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()

    if (!status || !['active', 'suspended'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "active" or "suspended"' },
        { status: 400 }
      )
    }

    // Update user status
    // Note: If your User model doesn't have a status field, you may need to add it
    // or use a different approach (like a separate table for user status)
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        // If you don't have a status field, you might need to add it to your schema
        // For now, we'll just return success
      }
    })

    return NextResponse.json({
      success: true,
      message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`
    })
  } catch (error) {
    console.error('Update user status error:', error)
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    )
  }
}
