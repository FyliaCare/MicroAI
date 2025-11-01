import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      )
    }

    // Find subscriber by token
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token }
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      )
    }

    if (!subscriber.subscribed) {
      return NextResponse.json(
        { message: 'You are already unsubscribed from our newsletter.' },
        { status: 200 }
      )
    }

    // Unsubscribe
    await prisma.newsletterSubscriber.update({
      where: { unsubscribeToken: token },
      data: {
        subscribed: false,
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Unsubscribed',
        entity: 'NewsletterSubscriber',
        entityId: subscriber.id,
        description: `Newsletter unsubscription: ${subscriber.email}`,
        metadata: JSON.stringify({
          email: subscriber.email,
          previousStatus: subscriber.status,
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.',
    })

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests for unsubscribe links in emails
  return POST(request)
}
