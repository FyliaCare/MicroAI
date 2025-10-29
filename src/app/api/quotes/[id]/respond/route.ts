import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/quotes/[id]/respond - Accept or reject quote
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = params.id
    const body = await request.json()
    const { action, signature, signerName } = body

    if (!action || !['accept', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        client: true,
      },
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Check if quote can be responded to
    if (!['sent', 'viewed'].includes(quote.status)) {
      return NextResponse.json(
        { success: false, error: 'Quote cannot be responded to' },
        { status: 400 }
      )
    }

    // Check if quote is expired
    if (quote.validUntil && new Date(quote.validUntil) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Quote has expired' },
        { status: 400 }
      )
    }

    if (action === 'accept') {
      if (!signature || !signerName) {
        return NextResponse.json(
          { success: false, error: 'Signature and signer name are required' },
          { status: 400 }
        )
      }

      // Update quote with acceptance
      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          status: 'accepted',
          clientSignature: signature,
          clientSignedBy: signerName,
          clientSignedAt: new Date(),
          respondedAt: new Date(),
        } as any, // Type assertion for Prisma client sync
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          action: 'Accepted',
          entity: 'Quote',
          entityId: quote.id,
          description: `Quote ${quote.quoteNumber} was accepted by ${signerName}`,
          metadata: JSON.stringify({
            signerName,
            signedAt: new Date().toISOString(),
          }),
        },
      })

      // Create notification for admin
      await prisma.notification.create({
        data: {
          type: 'quote-accepted',
          title: 'Quote Accepted',
          message: `${signerName} accepted quote ${quote.quoteNumber}`,
          link: `/admin/quotes/${quote.id}/edit`,
          priority: 'high',
          entityType: 'Quote',
          entityId: quote.id,
        },
      })

      // TODO: Send email notification to admin
      // TODO: Send confirmation email to client

      return NextResponse.json({
        success: true,
        message: 'Quote accepted successfully',
      })
    } else {
      // Reject quote
      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          status: 'rejected',
          respondedAt: new Date(),
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          action: 'Rejected',
          entity: 'Quote',
          entityId: quote.id,
          description: `Quote ${quote.quoteNumber} was rejected by client`,
        },
      })

      // Create notification for admin
      await prisma.notification.create({
        data: {
          type: 'quote-rejected',
          title: 'Quote Rejected',
          message: `Client rejected quote ${quote.quoteNumber}`,
          link: `/admin/quotes/${quote.id}/edit`,
          priority: 'normal',
          entityType: 'Quote',
          entityId: quote.id,
        },
      })

      // TODO: Send email notification to admin

      return NextResponse.json({
        success: true,
        message: 'Quote rejected',
      })
    }
  } catch (error) {
    console.error('Quote response error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process response' },
      { status: 500 }
    )
  }
}
