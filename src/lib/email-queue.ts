import { prisma } from '@/lib/prisma'

export interface EmailQueueData {
  to: string
  subject: string
  htmlContent: string
  textContent?: string
  priority?: 'low' | 'normal' | 'high'
  metadata?: Record<string, any>
}

/**
 * Add email to queue for reliable delivery
 * Emails are processed by the cron job every 10 minutes
 */
export async function queueEmail(data: EmailQueueData): Promise<void> {
  try {
    await prisma.emailQueue.create({
      data: {
        to: data.to,
        subject: data.subject,
        htmlContent: data.htmlContent,
        textContent: data.textContent || null,
        status: 'pending',
        priority: data.priority || 'normal',
        attempts: 0,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    })
    console.log(`✅ Email queued for ${data.to}: ${data.subject}`)
  } catch (error) {
    console.error('❌ Failed to queue email:', error)
    throw error
  }
}

/**
 * Queue admin notification email
 */
export async function queueAdminNotificationEmail(
  subject: string,
  htmlContent: string,
  textContent?: string,
  priority: 'low' | 'normal' | 'high' = 'high'
): Promise<void> {
  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.RESEND_TO_EMAIL ||
    'sales@microaisystems.com'

  await queueEmail({
    to: adminEmail,
    subject,
    htmlContent,
    textContent,
    priority,
    metadata: {
      type: 'admin_notification',
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Queue client confirmation email
 */
export async function queueClientConfirmationEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string,
  priority: 'low' | 'normal' | 'high' = 'normal'
): Promise<void> {
  await queueEmail({
    to,
    subject,
    htmlContent,
    textContent,
    priority,
    metadata: {
      type: 'client_confirmation',
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Queue project update email
 */
export async function queueProjectUpdateEmail(
  to: string,
  projectName: string,
  status: string,
  htmlContent: string,
  textContent?: string
): Promise<void> {
  await queueEmail({
    to,
    subject: `Update on Your Project Request - ${projectName}`,
    htmlContent,
    textContent,
    priority: 'high',
    metadata: {
      type: 'project_update',
      projectName,
      status,
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Get email queue stats
 */
export async function getEmailQueueStats() {
  const stats = await prisma.emailQueue.groupBy({
    by: ['status'],
    _count: true,
  })

  return {
    total: stats.reduce((sum, stat) => sum + stat._count, 0),
    pending: stats.find((s) => s.status === 'pending')?._count || 0,
    processing: stats.find((s) => s.status === 'processing')?._count || 0,
    sent: stats.find((s) => s.status === 'sent')?._count || 0,
    failed: stats.find((s) => s.status === 'failed')?._count || 0,
  }
}
