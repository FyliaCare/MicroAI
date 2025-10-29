import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/quotes/[id]/view - Mark quote as viewed
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Update status to viewed if it's currently sent
    if (quote.status === 'sent') {
      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          status: 'viewed',
          viewedAt: new Date(),
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          action: 'Viewed',
          entity: 'Quote',
          entityId: quote.id,
          description: `Quote ${quote.quoteNumber} was viewed by client`,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark viewed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update quote' },
      { status: 500 }
    )
  }
}
