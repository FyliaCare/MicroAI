import { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local and .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

async function processEmailQueue() {
  try {
    console.log('📧 Starting email queue processing...\n')

    // Check environment
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'MicroAI Systems <sales@microaisystems.com>'

    if (!apiKey) {
      console.error('❌ RESEND_API_KEY not configured')
      process.exit(1)
    }

    console.log(`From Email: ${fromEmail}`)
    console.log(`API Key: ${apiKey.substring(0, 10)}...`)

    const resend = new Resend(apiKey)

    // Get pending emails
    const pendingEmails = await prisma.emailQueue.findMany({
      where: { status: 'pending' },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' },
      ],
      take: 50,
    })

    console.log(`\n📬 Found ${pendingEmails.length} pending emails\n`)

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each email
    for (const email of pendingEmails) {
      try {
        console.log(`📤 Sending to ${email.to}...`)
        console.log(`   Subject: ${email.subject}`)

        // Mark as processing
        await prisma.emailQueue.update({
          where: { id: email.id },
          data: { status: 'processing' },
        })

        // Send email
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
        console.log(`✅ Sent successfully (ID: ${data?.id})\n`)

      } catch (error: any) {
        console.error(`❌ Failed: ${error.message}\n`)

        const attempts = email.attempts + 1
        const maxAttempts = email.maxAttempts

        if (attempts >= maxAttempts) {
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
          const nextRetryAt = new Date()
          nextRetryAt.setMinutes(nextRetryAt.getMinutes() + Math.pow(2, attempts) * 5)
          
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

    console.log(`\n✨ Email queue processing complete:`)
    console.log(`   Processed: ${results.processed}`)
    console.log(`   Sent:      ${results.sent}`)
    console.log(`   Failed:    ${results.failed}`)

    if (results.errors.length > 0) {
      console.log(`\n❌ Errors:`)
      results.errors.forEach(err => console.log(`   - ${err}`))
    }

  } catch (error) {
    console.error('❌ Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

processEmailQueue()
