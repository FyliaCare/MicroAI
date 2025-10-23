import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Create email transporter
    // Note: Configure these environment variables in your deployment
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'microailabs@outlook.com',
        pass: process.env.SMTP_PASSWORD || '', // Add this to environment variables
      },
    })

    // Email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #4B5563; display: block; margin-bottom: 5px; }
            .value { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; }
            .footer { background: #1F2937; color: #9CA3AF; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
            .badge { display: inline-block; background: #10B981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🚀 New Client Request</h1>
              <div class="badge">NEW INQUIRY</div>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">👤 Name:</span>
                <div class="value">${body.name}</div>
              </div>
              
              <div class="field">
                <span class="label">📧 Email:</span>
                <div class="value"><a href="mailto:${body.email}">${body.email}</a></div>
              </div>
              
              ${body.phone ? `
              <div class="field">
                <span class="label">📱 Phone:</span>
                <div class="value"><a href="tel:${body.phone}">${body.phone}</a></div>
              </div>
              ` : ''}
              
              ${body.company ? `
              <div class="field">
                <span class="label">🏢 Company:</span>
                <div class="value">${body.company}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <span class="label">💬 Message:</span>
                <div class="value" style="white-space: pre-wrap;">${body.message}</div>
              </div>
              
              <div class="field">
                <span class="label">🕐 Submitted:</span>
                <div class="value">${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">MicroAI - 10x Faster Development</p>
              <p style="margin: 5px 0 0 0;">This is an automated notification from your website contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Plain text version
    const emailText = `
New Client Request from MicroAI Website

Name: ${body.name}
Email: ${body.email}
${body.phone ? `Phone: ${body.phone}` : ''}
${body.company ? `Company: ${body.company}` : ''}

Message:
${body.message}

Submitted: ${new Date().toLocaleString()}
    `

    // Send email
    try {
      await transporter.sendMail({
        from: `"MicroAI Contact Form" <${process.env.SMTP_USER || 'microailabs@outlook.com'}>`,
        to: 'microailabs@outlook.com',
        subject: `🚀 New Client Request from ${body.name}${body.company ? ` - ${body.company}` : ''}`,
        text: emailText,
        html: emailHtml,
        replyTo: body.email,
      })

      console.log('Email sent successfully to microailabs@outlook.com')
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Continue anyway - don't fail the request if email fails
    }

    // Log submission
    console.log('Contact form submission:', body)

    const submission = {
      id: Math.random().toString(36).substring(7),
      ...body,
      submittedAt: new Date().toISOString(),
      status: 'new'
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      data: submission
    }, { status: 201 })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    )
  }
}