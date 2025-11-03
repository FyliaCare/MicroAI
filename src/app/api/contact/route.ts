import { NextRequest, NextResponse } from 'next/server'
import { sendAdminNotificationNow, sendClientConfirmationNow } from '@/lib/send-email'
import { prisma } from '@/lib/prisma'

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

    // Send admin notification email IMMEDIATELY
    console.log('📧 Sending admin notification email...')
    
    try {
      const adminEmailResult = await sendAdminNotificationNow(
        `🚀 New Client Request from ${body.name}${body.company ? ` - ${body.company}` : ''}`,
        emailHtml,
        emailText
      )
      
      if (adminEmailResult.success) {
        console.log('✅ Admin notification email sent successfully')
      } else {
        console.error('❌ Failed to send admin email:', adminEmailResult.error)
      }
    } catch (emailError: any) {
      console.error('❌ Failed to send admin email:', emailError.message || emailError)
      // Continue anyway - don't fail the request if email fails
    }

    // Send auto-reply confirmation to client
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .section { margin-bottom: 25px; }
            .highlight { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .feature { display: flex; align-items: start; margin-bottom: 15px; }
            .feature-icon { font-size: 24px; margin-right: 12px; }
            .feature-text { flex: 1; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background: #1F2937; color: #9CA3AF; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
            .badge { display: inline-block; background: #10B981; color: white; padding: 6px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">Thank You, ${body.name}! 🎉</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your message</p>
              <div class="badge">✓ CONFIRMED</div>
            </div>
            
            <div class="content">
              <div class="section">
                <p style="font-size: 18px; color: #1F2937; margin-top: 0;">
                  <strong>Great news!</strong> Your inquiry has been successfully received and our team is already reviewing it.
                </p>
              </div>

              <div class="highlight">
                <h2 style="margin-top: 0; font-size: 20px;">⚡ What Happens Next?</h2>
                <div class="feature">
                  <div class="feature-icon">1️⃣</div>
                  <div class="feature-text">
                    <strong>Immediate Review</strong><br/>
                    Our team is reviewing your project details right now
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">2️⃣</div>
                  <div class="feature-text">
                    <strong>Quick Response</strong><br/>
                    You'll hear from us within 24 hours (usually much faster!)
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">3️⃣</div>
                  <div class="feature-text">
                    <strong>Discovery Call</strong><br/>
                    We'll schedule a call to discuss your vision in detail
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">4️⃣</div>
                  <div class="feature-text">
                    <strong>Proposal & Timeline</strong><br/>
                    Receive a detailed proposal with cost estimate and delivery timeline
                  </div>
                </div>
              </div>

              <div class="section">
                <h3 style="color: #1F2937; margin-bottom: 10px;">📋 Your Submission Summary</h3>
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p style="margin: 5px 0;"><strong>Name:</strong> ${body.name}</p>
                  <p style="margin: 5px 0;"><strong>Email:</strong> ${body.email}</p>
                  ${body.company ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${body.company}</p>` : ''}
                  <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              <div class="section" style="background: #EFF6FF; padding: 20px; border-radius: 10px; border-left: 4px solid #3B82F6;">
                <h3 style="color: #1F2937; margin-top: 0;">🚀 Why Choose MicroAI?</h3>
                <ul style="margin: 10px 0; padding-left: 20px; color: #4B5563;">
                  <li><strong>10x Faster Development:</strong> We deliver in weeks, not months</li>
                  <li><strong>Modern Technology Stack:</strong> Next.js, React, TypeScript, and more</li>
                  <li><strong>Proven Track Record:</strong> Multiple successful projects in production</li>
                  <li><strong>Based in Ghana:</strong> Local expertise with global standards</li>
                  <li><strong>24/7 Support:</strong> We're here when you need us</li>
                </ul>
              </div>

              <div class="section" style="text-align: center;">
                <p style="color: #6B7280; margin-bottom: 20px;">
                  In the meantime, feel free to explore our portfolio and learn more about our services.
                </p>
                <a href="https://poultry-investment-frontend.onrender.com" class="cta-button" style="color: white;">
                  View Our Work
                </a>
              </div>

              <div class="section" style="background: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B;">
                <p style="margin: 0; color: #92400E;">
                  <strong>💡 Pro Tip:</strong> While you wait, think about any specific features or requirements you'd like to discuss. This will help us provide you with the most accurate proposal!
                </p>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0; font-size: 14px; color: #D1D5DB;"><strong>MicroAI</strong></p>
              <p style="margin: 5px 0;">10x Faster Development | Takoradi, Ghana</p>
              <p style="margin: 5px 0;">
                📧 <a href="mailto:sales@microaisystems.com" style="color: #60A5FA;">sales@microaisystems.com</a>
              </p>
              <p style="margin: 15px 0 5px 0; font-size: 11px; color: #9CA3AF;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const clientEmailText = `
Thank You for Contacting MicroAI!

Hi ${body.name},

Great news! We've received your inquiry and our team is already reviewing it.

WHAT HAPPENS NEXT?

1. Immediate Review - Our team is reviewing your project details right now
2. Quick Response - You'll hear from us within 24 hours (usually much faster!)
3. Discovery Call - We'll schedule a call to discuss your vision in detail
4. Proposal & Timeline - Receive a detailed proposal with cost estimate

YOUR SUBMISSION SUMMARY:
Name: ${body.name}
Email: ${body.email}
${body.company ? `Company: ${body.company}` : ''}
Date: ${new Date().toLocaleDateString()}

WHY CHOOSE MICROAI?
• 10x Faster Development - We deliver in weeks, not months
• Modern Technology Stack - Next.js, React, TypeScript, and more
• Proven Track Record - Multiple successful projects in production
• Based in Ghana - Local expertise with global standards
• 24/7 Support - We're here when you need us

Best regards,
The MicroAI Team

MicroAI - 10x Faster Development
Takoradi, Ghana
sales@microaisystems.com
    `

    // Send client confirmation email IMMEDIATELY
    try {
      const clientEmailResult = await sendClientConfirmationNow(
        body.email,
        `✓ We've Received Your Message - MicroAI`,
        clientEmailHtml,
        clientEmailText
      )
      
      if (clientEmailResult.success) {
        console.log('✅ Client confirmation email sent successfully')
      } else {
        console.error('❌ Failed to send client email:', clientEmailResult.error)
      }
    } catch (replyError: any) {
      console.error('❌ Failed to send client email:', replyError.message || replyError)
      // Continue anyway
    }

    // Generate unique request number
    const lastRequest = await prisma.projectRequest.findFirst({
      orderBy: { requestNumber: 'desc' },
      select: { requestNumber: true }
    })
    
    let requestNumber = 'PR-0001'
    if (lastRequest?.requestNumber) {
      const lastNumber = parseInt(lastRequest.requestNumber.split('-')[1])
      requestNumber = `PR-${String(lastNumber + 1).padStart(4, '0')}`
    }

    // Create ProjectRequest (pending approval)
    const projectRequest = await prisma.projectRequest.create({
      data: {
        requestNumber,
        projectName: `${body.company || body.name} - Website Inquiry`,
        clientName: body.name,
        clientEmail: body.email,
        clientPhone: body.phone || null,
        clientCompany: body.company || null,
        projectType: 'web-app',
        description: body.message,
        requirements: `Source: Website Contact Form${body.company ? `\nCompany: ${body.company}` : ''}`,
        status: 'pending',
        priority: 'medium',
        source: 'contact-form'
      }
    })

    // Get all admins for notifications
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'admin' },
          { role: 'super-admin' }
        ]
      }
    })

    // Create notifications for all admins
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          type: 'project_request',
          title: '📧 New Contact Form Submission',
          message: `${body.name}${body.company ? ` from ${body.company}` : ''} submitted an inquiry. Request: ${requestNumber}`,
          link: `/admin/project-requests?requestId=${projectRequest.id}`,
          priority: 'high',
          entityType: 'admin',
          entityId: admin.id
        }
      })
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Created',
        entity: 'ProjectRequest',
        entityId: projectRequest.id,
        description: `New project request from website contact form: ${body.name} (${requestNumber})`,
        metadata: JSON.stringify({
          source: 'website-contact-form',
          email: body.email,
          company: body.company,
          requestNumber
        })
      }
    })

    // Log submission
    console.log('✅ Contact form submission processed:', {
      projectRequestId: projectRequest.id,
      requestNumber: requestNumber,
      name: body.name
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      data: {
        projectRequestId: projectRequest.id,
        requestNumber: requestNumber,
        submittedAt: new Date().toISOString()
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Contact form error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { 
        error: 'Failed to process your request. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
