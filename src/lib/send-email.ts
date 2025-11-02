import { Resend } from 'resend'

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
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY not configured - email will not be sent')
      // Return success but log warning - don't break the flow
      return { success: true, error: 'Email service not configured (key missing)' }
    }

    const fromEmail = options.from || process.env.RESEND_FROM_EMAIL || 'MicroAI Systems <sales@microaisystems.com>'

    console.log(`📤 Sending email immediately to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}...`)

    // Create new Resend instance with API key
    const resendClient = new Resend(apiKey)

    const { data, error } = await resendClient.emails.send({
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
      // Return success but log error - don't break the flow
      return { success: true, error: error.message }
    }

    console.log(`✅ Email sent successfully! ID: ${data?.id}`)
    return { success: true, id: data?.id }

  } catch (error: any) {
    console.error('❌ Email send error:', error)
    // Return success but log error - don't break the user flow
    return { success: true, error: error.message || 'Unknown error' }
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
