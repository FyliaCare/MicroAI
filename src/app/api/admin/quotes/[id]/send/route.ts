import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface EmailPayload {
  to: string
  subject: string
  text: string
  html: string
}

async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    // Queue the email in database
    await prisma.emailQueue.create({
      data: {
        id: `email-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        to: payload.to,
        subject: payload.subject,
        htmlContent: payload.html,
        textContent: payload.text,
        status: 'pending',
        priority: 'high',
        updatedAt: new Date(),
      },
    })
    
    console.log('✅ Email queued successfully:', payload.to)
    return true
  } catch (error) {
    console.error('❌ Failed to queue email:', error)
    return false
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: quoteId } = await params
    console.log('[Send Email] Processing quote:', quoteId)

    // Fetch quote with client details
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        Client: true,
      },
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Get client email
    let clientEmail = quote.clientEmail
    if (!clientEmail && quote.Client) {
      clientEmail = quote.Client.email
    }

    if (!clientEmail) {
      return NextResponse.json(
        { error: 'Client email not found. Please add a client email to send the quote.' },
        { status: 400 }
      )
    }

    // Get client name
    const clientName = quote.clientName || quote.Client?.name || 'Valued Client'

    // Generate quote link (for client to view online)
    const quoteLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/quotes/${quote.id}`

    // Prepare email content
    const subject = `Quote ${quote.quoteNumber} from MicroAI Systems`
    
    const textBody = `
Dear ${clientName},

Your quote is ready for review!

Quote Number: ${quote.quoteNumber}
Title: ${quote.title}
Total: $${quote.total?.toFixed(2) || '0.00'}
Valid Until: ${quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : 'N/A'}

View your quote online: ${quoteLink}

If you have any questions or would like to accept this quote, please don't hesitate to reach out.

Best regards,
MicroAI Systems Team
    `.trim()

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .quote-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-label { font-weight: 600; color: #6b7280; }
    .detail-value { color: #111827; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { text-align: center; color: #6b7280; margin-top: 30px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">Your Quote is Ready!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Quote ${quote.quoteNumber}</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Dear ${clientName},</p>
      
      <p>Thank you for your interest in MicroAI Systems. Your custom quote has been prepared and is ready for your review.</p>
      
      <div class="quote-details">
        <div class="detail-row">
          <span class="detail-label">Quote Number:</span>
          <span class="detail-value">${quote.quoteNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Title:</span>
          <span class="detail-value">${quote.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total Amount:</span>
          <span class="detail-value" style="font-size: 18px; font-weight: 700; color: #667eea;">$${quote.total?.toFixed(2) || '0.00'}</span>
        </div>
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Valid Until:</span>
          <span class="detail-value">${quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${quoteLink}" class="cta-button">View Quote Online</a>
      </div>
      
      <p style="margin-top: 30px;">If you have any questions or would like to discuss this quote, please don't hesitate to contact us. We're here to help!</p>
      
      <p style="margin-top: 20px;">Best regards,<br><strong>The MicroAI Systems Team</strong></p>
    </div>
    
    <div class="footer">
      <p>MicroAI Systems | Professional Software Solutions</p>
      <p style="font-size: 12px; margin-top: 10px;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
    `.trim()

    // Send the email
    const emailSent = await sendEmail({
      to: clientEmail,
      subject,
      text: textBody,
      html: htmlBody,
    })

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      )
    }

    // Update quote status to 'sent' if not already
    if (quote.status !== 'sent') {
      await prisma.quote.update({
        where: { id: quoteId },
        data: { 
          status: 'sent',
          updatedAt: new Date(),
        },
      })
    }

    console.log('✅ Quote email sent successfully to:', clientEmail)

    return NextResponse.json({
      success: true,
      message: 'Quote sent successfully!',
      emailSent: true,
      recipient: clientEmail,
    })
  } catch (error) {
    console.error('[Send Email] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send quote',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
