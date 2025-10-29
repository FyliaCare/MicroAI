// Email Utility with Template Support
import { prisma } from './prisma'
import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

/**
 * Create email transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions) {
  const transporter = createTransporter()
  
  const from = `${process.env.COMPANY_NAME || 'MicroAI Systems'} <${process.env.SMTP_FROM || process.env.SMTP_USER}>`
  
  const mailOptions = {
    from,
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
    bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
    attachments: options.attachments,
  }
  
  try {
    const info = await transporter.sendMail(mailOptions)
    
    // Log successful email
    await logEmail({
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      status: 'SENT',
      messageId: info.messageId,
    })
    
    return info
  } catch (error) {
    // Log failed email
    await logEmail({
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      status: 'FAILED',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    
    throw error
  }
}

/**
 * Log email to database
 */
async function logEmail(data: {
  to: string[]
  subject: string
  status: 'SENT' | 'FAILED'
  messageId?: string
  error?: string
}) {
  try {
    await prisma.emailLog.create({
      data: {
        to: data.to.join(', '), // Convert array to comma-separated string
        from: process.env.EMAIL_FROM || 'noreply@microai.com',
        subject: data.subject,
        status: data.status.toLowerCase(),
        providerId: data.messageId,
        error: data.error,
        sentAt: data.status === 'SENT' ? new Date() : undefined,
      },
    })
  } catch (error) {
    console.error('Failed to log email:', error)
  }
}

/**
 * Render email template
 */
export async function renderEmailTemplate(
  templateKey: string,
  variables: Record<string, any>
): Promise<string> {
  const template = await prisma.emailTemplate.findFirst({
    where: { type: templateKey, isActive: true },
  })
  
  if (!template) {
    throw new Error(`Email template not found: ${templateKey}`)
  }
  
  // Simple template variable replacement
  let content = template.content
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    content = content.replace(placeholder, String(value))
  })
  
  return content
}

/**
 * Send templated email
 */
export async function sendTemplatedEmail(
  templateKey: string,
  to: string | string[],
  variables: Record<string, any>
) {
  const template = await prisma.emailTemplate.findFirst({
    where: { type: templateKey, isActive: true },
  })
  
  if (!template) {
    throw new Error(`Email template not found: ${templateKey}`)
  }
  
  const html = await renderEmailTemplate(templateKey, variables)
  
  return await sendEmail({
    to,
    subject: template.subject,
    html,
  })
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(to: string, name: string) {
  return await sendTemplatedEmail('welcome', to, { name })
}

/**
 * Send quote email
 */
export async function sendQuoteEmail(
  to: string,
  quoteName: string,
  quoteNumber: string,
  amount: number,
  pdfUrl: string
) {
  return await sendTemplatedEmail('quote', to, {
    quoteName,
    quoteNumber,
    amount: amount.toFixed(2),
    pdfUrl,
  })
}

/**
 * Send invoice email
 */
export async function sendInvoiceEmail(
  to: string,
  invoiceNumber: string,
  amount: number,
  dueDate: string,
  pdfUrl: string
) {
  return await sendTemplatedEmail('invoice', to, {
    invoiceNumber,
    amount: amount.toFixed(2),
    dueDate,
    pdfUrl,
  })
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  to: string,
  invoiceNumber: string,
  amount: number,
  receiptUrl: string
) {
  return await sendTemplatedEmail('payment-confirmation', to, {
    invoiceNumber,
    amount: amount.toFixed(2),
    receiptUrl,
  })
}

/**
 * Send project update email
 */
export async function sendProjectUpdateEmail(
  to: string | string[],
  projectName: string,
  updateMessage: string,
  dashboardUrl: string
) {
  return await sendTemplatedEmail('project-update', to, {
    projectName,
    updateMessage,
    dashboardUrl,
  })
}

/**
 * Send notification email
 */
export async function sendNotificationEmail(
  to: string | string[],
  title: string,
  message: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          <p>${message}</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MicroAI Systems. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  return await sendEmail({
    to,
    subject: title,
    html,
  })
}
