import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

interface SubscribeData {
  email: string
  name?: string
  source?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeData = await request.json()
    
    // Validate email
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Get IP and location data
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const referrer = request.headers.get('referer') || request.headers.get('referrer')

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: body.email }
    })

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        )
      } else {
        // Resubscribe
        await prisma.newsletterSubscriber.update({
          where: { email: body.email },
          data: {
            subscribed: true,
            status: 'active',
            unsubscribedAt: null,
            confirmedAt: new Date(),
            name: body.name || existing.name,
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter.',
        })
      }
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: body.email,
        name: body.name,
        source: body.source || 'website',
        status: 'active',
        subscribed: true,
        confirmedAt: new Date(),
        ipAddress: ipAddress.split(',')[0].trim(),
        referrer: referrer || undefined,
      }
    })

    // Send welcome email
    try {
      const resend = new Resend(process.env.RESEND_API_KEY || '')
      
      const welcomeEmailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
      .button { display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
      .footer { background: #1F2937; color: #9CA3AF; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
      .feature { margin: 15px 0; padding-left: 25px; position: relative; }
      .feature:before { content: "✓"; position: absolute; left: 0; color: #10B981; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0; font-size: 32px;">Welcome to MicroAI! 🎉</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">You're now part of our community</p>
      </div>
      
      <div class="content">
        <p style="font-size: 18px; color: #1F2937; margin-top: 0;">
          <strong>Hi${body.name ? ` ${body.name}` : ''}!</strong>
        </p>
        
        <p style="color: #4B5563;">
          Thank you for subscribing to the MicroAI newsletter! You'll now receive:
        </p>
        
        <div class="feature">Latest updates on our projects and services</div>
        <div class="feature">Exclusive insights into web development trends</div>
        <div class="feature">Special offers and early access to new features</div>
        <div class="feature">Tips and tricks for building better web applications</div>
        
        <p style="color: #4B5563; margin-top: 25px;">
          We respect your inbox and promise to only send valuable content. No spam, ever!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.microaisystems.com" class="button">
            Visit Our Website
          </a>
        </div>
        
        <p style="color: #6B7280; font-size: 14px; margin-top: 25px;">
          Want to get in touch? Reply to this email or reach us at 
          <a href="mailto:sales@microaisystems.com" style="color: #3B82F6;">sales@microaisystems.com</a>
        </p>
      </div>
      
      <div class="footer">
        <p style="margin: 0; font-size: 14px; color: #D1D5DB;"><strong>MicroAI Systems</strong></p>
        <p style="margin: 5px 0;">BR253 Pasture St. Takoradi, Ghana</p>
        <p style="margin: 5px 0;">
          📧 sales@microaisystems.com | 📱 +233 244486837
        </p>
        <p style="margin: 15px 0 5px 0; font-size: 11px; color: #9CA3AF;">
          You received this email because you subscribed to our newsletter.
          <br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.microaisystems.com'}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}" style="color: #60A5FA;">Unsubscribe</a>
        </p>
      </div>
    </div>
  </body>
</html>
      `

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'MicroAI <onboarding@resend.dev>',
        to: [body.email],
        subject: '🎉 Welcome to MicroAI Newsletter!',
        html: welcomeEmailHtml,
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the subscription if email fails
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Subscribed',
        entity: 'NewsletterSubscriber',
        entityId: subscriber.id,
        description: `New newsletter subscription: ${body.email}`,
        metadata: JSON.stringify({
          source: body.source || 'website',
          name: body.name,
          ipAddress: ipAddress.split(',')[0].trim(),
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Check your email for a welcome message.',
    }, { status: 201 })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    )
  }
}
