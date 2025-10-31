import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

// GET /api/cron/process-email-queue - Process queued emails
export async function GET(request: NextRequest) {
  try {
    console.log('📧 Starting email queue processing...')

    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log('❌ Unauthorized: Invalid cron secret')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@microaisystems.com'

    // Get pending emails (limit to 50 per batch)
    const pendingEmails = await prisma.emailQueue.findMany({
      where: {
        status: 'pending',
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
      take: 50,
    })

    console.log(`📬 Found ${pendingEmails.length} pending emails`)

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each email
    for (const email of pendingEmails) {
      try {
        console.log(`📤 Sending email to ${email.to}...`)

        // Mark as processing
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: { status: 'processing' },
        })

        // Send email via Resend
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: email.to,
          ...(email.cc && { cc: email.cc }),
          ...(email.bcc && { bcc: email.bcc }),
          subject: email.subject,
          html: email.htmlContent,
          ...(email.textContent && { text: email.textContent }),
        })

        if (error) {
          throw new Error(error.message || 'Failed to send email')
        }

        // Mark as sent
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: {
            status: 'sent',
            sentAt: new Date(),
            providerId: data?.id,
            provider: 'resend',
            attempts: email.attempts + 1,
            lastAttemptAt: new Date(),
          },
        })

        results.sent++
        console.log(`✅ Email sent successfully (ID: ${data?.id})`)

      } catch (error: any) {
        console.error(`❌ Failed to send email ${email.id}:`, error.message)

        // Increment attempt count
        const attempts = email.attempts + 1
        const maxAttempts = email.maxAttempts

        if (attempts >= maxAttempts) {
          // Mark as failed after max attempts
          await prisma.emailQueue.update({
            where: { id: email.id },
            data: {
              status: 'failed',
              error: error.message,
              errorDetails: error.stack || error.message,
              attempts,
              lastAttemptAt: new Date(),
            },
          })
          results.failed++
        } else {
          // Calculate next retry time (exponential backoff)
          const nextRetryAt = new Date()
          nextRetryAt.setMinutes(nextRetryAt.getMinutes() + Math.pow(2, attempts) * 5)
          
          // Mark as pending for retry
          await prisma.emailQueue.update({
            where: { id: email.id },
            data: {
              status: 'pending',
              error: error.message,
              errorDetails: error.stack || error.message,
              attempts,
              lastAttemptAt: new Date(),
              nextRetryAt,
            },
          })
        }

        results.errors.push(`${email.to}: ${error.message}`)
      }

      results.processed++
    }

    console.log(`✨ Email queue processing complete:`, results)

    return NextResponse.json({
      success: true,
      message: 'Email queue processed',
      results,
    })

  } catch (error: any) {
    console.error('❌ Email queue processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process email queue',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

// POST endpoint for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}
