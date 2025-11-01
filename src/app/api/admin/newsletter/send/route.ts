import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { queueEmail } from '@/lib/email-queue'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface SendNewsletterData {
  subject: string
  content: string
  textContent?: string
  previewText?: string
  segment?: string
  scheduledFor?: string
  campaign?: string
  tags?: string[]
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role
    
    if (!session || (userRole !== 'admin' && userRole !== 'super-admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: SendNewsletterData = await request.json()
    
    // Validate required fields
    if (!body.subject || !body.content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      )
    }

    // Get active subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        subscribed: true,
        status: 'active',
      },
      select: {
        email: true,
        name: true,
        unsubscribeToken: true,
      }
    })

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      )
    }

    // Create newsletter record
    const newsletter = await prisma.newsletter.create({
      data: {
        subject: body.subject,
        content: body.content,
        textContent: body.textContent,
        previewText: body.previewText,
        status: body.scheduledFor ? 'scheduled' : 'sending',
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : undefined,
        campaign: body.campaign,
        tags: body.tags ? JSON.stringify(body.tags) : undefined,
        segment: body.segment,
        createdBy: session.user?.id,
        createdByName: session.user?.name || session.user?.email,
      }
    })

    // If scheduled for later, don't send now
    if (body.scheduledFor) {
      return NextResponse.json({
        success: true,
        message: `Newsletter scheduled for ${new Date(body.scheduledFor).toLocaleString()}`,
        newsletterId: newsletter.id,
        subscriberCount: subscribers.length,
      })
    }

    // Queue emails for reliable delivery
    let queuedCount = 0
    let failedCount = 0
    const errors: string[] = []

    // Queue all emails
    for (const subscriber of subscribers) {
      try {
        // Add unsubscribe link and personalization
        const personalizedContent = body.content
          .replace(/\{name\}/g, subscriber.name || 'there')
          .replace(/\{email\}/g, subscriber.email)
        
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.microaisystems.com'}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`
        
        const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; }
      .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%); color: white; padding: 30px; text-align: center; }
      .content { padding: 30px; background: #ffffff; }
      .footer { background: #1F2937; color: #9CA3AF; padding: 20px; text-align: center; font-size: 12px; }
      .footer a { color: #60A5FA; text-decoration: none; }
      .button { display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0;">MicroAI Systems</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">10x Faster Development</p>
      </div>
      
      <div class="content">
        ${personalizedContent}
      </div>
      
      <div class="footer">
        <p style="margin: 0;"><strong>MicroAI Systems</strong></p>
        <p style="margin: 5px 0;">BR253 Pasture St. Takoradi, Ghana</p>
        <p style="margin: 5px 0;">
          📧 <a href="mailto:sales@microaisystems.com">sales@microaisystems.com</a> | 
          📱 +233 244486837
        </p>
        <p style="margin: 15px 0 5px 0;">
          <a href="${unsubscribeUrl}">Unsubscribe</a> | 
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.microaisystems.com'}">Visit Website</a>
        </p>
      </div>
    </div>
  </body>
</html>
        `

        // Queue the email for reliable delivery
        await queueEmail({
          to: subscriber.email,
          subject: body.subject,
          htmlContent: emailHtml,
          priority: 'normal',
          metadata: {
            type: 'newsletter_bulk',
            newsletterId: newsletter.id,
            subscriberEmail: subscriber.email,
            unsubscribeUrl,
          },
        })

        queuedCount++
      } catch (error: any) {
        failedCount++
        errors.push(`${subscriber.email}: ${error.message}`)
        console.error(`Failed to queue email for ${subscriber.email}:`, error)
      }
    }

    // Update newsletter record
    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        status: failedCount === subscribers.length ? 'failed' : 'queued',
        sentAt: new Date(),
        sentTo: queuedCount,
        failedCount: failedCount,
        error: errors.length > 0 ? errors.slice(0, 10).join('\n') : undefined,
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Sent',
        entity: 'Newsletter',
        entityId: newsletter.id,
        description: `Newsletter queued: "${body.subject}" to ${queuedCount} subscribers`,
        userId: session.user?.id,
        metadata: JSON.stringify({
          subject: body.subject,
          queuedCount,
          failedCount,
          subscriberCount: subscribers.length,
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: `Newsletter queued successfully for ${queuedCount} subscribers. Emails will be sent automatically within 10 minutes.`,
      newsletterId: newsletter.id,
      queuedCount,
      failedCount,
      totalSubscribers: subscribers.length,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
    })

  } catch (error) {
    console.error('Newsletter send error:', error)
    return NextResponse.json(
      { error: 'Failed to send newsletter. Please try again.' },
      { status: 500 }
    )
  }
}
