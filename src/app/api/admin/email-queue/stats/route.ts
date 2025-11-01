import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get email queue statistics
    const [pending, processing, sent, failed, total, lastProcessedEmail] = await Promise.all([
      prisma.emailQueue.count({ where: { status: 'pending' } }),
      prisma.emailQueue.count({ where: { status: 'processing' } }),
      prisma.emailQueue.count({ where: { status: 'sent' } }),
      prisma.emailQueue.count({ where: { status: 'failed' } }),
      prisma.emailQueue.count(),
      prisma.emailQueue.findFirst({
        where: { status: 'sent' },
        orderBy: { sentAt: 'desc' },
        select: { sentAt: true }
      })
    ])

    return NextResponse.json({
      pending,
      processing,
      sent,
      failed,
      total,
      lastProcessed: lastProcessedEmail?.sentAt || null
    })
  } catch (error) {
    console.error('Email queue stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email queue stats' },
      { status: 500 }
    )
  }
}
