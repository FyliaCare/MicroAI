import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testEmailQueue() {
  try {
    console.log('🔍 Checking email queue status...\n')

    // Check total emails in queue
    const totalEmails = await prisma.emailQueue.count()
    console.log(`Total emails in queue: ${totalEmails}`)

    // Check by status
    const pending = await prisma.emailQueue.count({ where: { status: 'pending' } })
    const processing = await prisma.emailQueue.count({ where: { status: 'processing' } })
    const sent = await prisma.emailQueue.count({ where: { status: 'sent' } })
    const failed = await prisma.emailQueue.count({ where: { status: 'failed' } })

    console.log(`\nStatus Breakdown:`)
    console.log(`  Pending:    ${pending}`)
    console.log(`  Processing: ${processing}`)
    console.log(`  Sent:       ${sent}`)
    console.log(`  Failed:     ${failed}`)

    // Show recent pending emails
    if (pending > 0) {
      console.log(`\n📧 Recent pending emails:`)
      const recentPending = await prisma.emailQueue.findMany({
        where: { status: 'pending' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          to: true,
          subject: true,
          attempts: true,
          maxAttempts: true,
          createdAt: true,
          nextRetryAt: true,
        },
      })

      recentPending.forEach((email, i) => {
        console.log(`\n  ${i + 1}. To: ${email.to}`)
        console.log(`     Subject: ${email.subject}`)
        console.log(`     Attempts: ${email.attempts}/${email.maxAttempts}`)
        console.log(`     Created: ${email.createdAt.toLocaleString()}`)
        if (email.nextRetryAt) {
          console.log(`     Next retry: ${email.nextRetryAt.toLocaleString()}`)
        }
      })
    }

    // Show recent failed emails
    if (failed > 0) {
      console.log(`\n❌ Recent failed emails:`)
      const recentFailed = await prisma.emailQueue.findMany({
        where: { status: 'failed' },
        orderBy: { updatedAt: 'desc' },
        take: 3,
        select: {
          id: true,
          to: true,
          subject: true,
          attempts: true,
          error: true,
          updatedAt: true,
        },
      })

      recentFailed.forEach((email, i) => {
        console.log(`\n  ${i + 1}. To: ${email.to}`)
        console.log(`     Subject: ${email.subject}`)
        console.log(`     Attempts: ${email.attempts}`)
        console.log(`     Error: ${email.error}`)
        console.log(`     Last attempt: ${email.updatedAt.toLocaleString()}`)
      })
    }

    // Test manual processing
    console.log(`\n\n🔧 To manually process the queue, run:`)
    console.log(`   curl http://localhost:3000/api/cron/process-email-queue`)
    console.log(`\nOr with authorization:`)
    console.log(`   curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/process-email-queue`)

    // Check environment variables
    console.log(`\n\n⚙️  Environment Check:`)
    console.log(`   RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing'}`)
    console.log(`   RESEND_FROM_EMAIL: ${process.env.RESEND_FROM_EMAIL || '❌ Not set'}`)
    console.log(`   CRON_SECRET: ${process.env.CRON_SECRET ? '✅ Set (required for production)' : '⚠️  Not set'}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testEmailQueue()
