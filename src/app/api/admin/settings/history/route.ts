import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/settings/history - Get settings change history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const settingId = searchParams.get('settingId')
    const key = searchParams.get('key')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}

    if (settingId) {
      where.settingId = settingId
    }

    if (key) {
      where.key = key
    }

    const [history, total] = await Promise.all([
      prisma.settingHistory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          Setting: {
            select: {
              key: true,
              label: true,
              category: true
            }
          }
        }
      }),
      prisma.settingHistory.count({ where })
    ])

    return NextResponse.json({
      success: true,
      history,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Error fetching settings history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings history' },
      { status: 500 }
    )
  }
}
