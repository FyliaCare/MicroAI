import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  cc?: string | string[]
  bcc?: string | string[]
  from?: string
}

/**
 * Send email IMMEDIATELY (no queue, no delay)
 * Use this for time-sensitive notifications that must be sent instantly
 */
export async function sendEmailNow(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured')
      return { success: false, error: 'Email service not configured' }
    }

    const fromEmail = options.from || process.env.RESEND_FROM_EMAIL || 'MicroAI Systems <sales@microaisystems.com>'

    console.log(`📤 Sending email immediately to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}...`)

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: options.to,
      ...(options.cc && { cc: options.cc }),
      ...(options.bcc && { bcc: options.bcc }),
      subject: options.subject,
      html: options.html,
      ...(options.text && { text: options.text }),
    })

    if (error) {
      console.error('❌ Email send failed:', error)
      return { success: false, error: error.message }
    }

    console.log(`✅ Email sent successfully! ID: ${data?.id}`)
    return { success: true, id: data?.id }

  } catch (error: any) {
    console.error('❌ Email send error:', error)
    return { success: false, error: error.message || 'Unknown error' }
  }
}

/**
 * Send admin notification email IMMEDIATELY
 */
export async function sendAdminNotificationNow(
  subject: string,
  html: string,
  text?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_TO_EMAIL || 'sales@microaisystems.com'

  return sendEmailNow({
    to: adminEmail,
    subject,
    html,
    text,
  })
}

/**
 * Send client confirmation email IMMEDIATELY
 */
export async function sendClientConfirmationNow(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  return sendEmailNow({
    to,
    subject,
    html,
    text,
  })
}
