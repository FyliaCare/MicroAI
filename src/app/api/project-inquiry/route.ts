import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ProjectInquiryData {
  projectIdea: string
  projectType: string
  timeline: string
  budget: string
  name: string
  email: string
  phone?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ProjectInquiryData = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.projectIdea) {
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

    // Create email transporter (using SendGrid)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SMTP_PASSWORD || '',
      },
    })

    // Admin notification email HTML
    const adminEmailHtml = `
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
            .badge { display: inline-block; background: #8B5CF6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-top: 10px; }
            .highlight { background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; margin: 15px 0; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🚀 New Project Inquiry via AI Bot</h1>
              <div class="badge">AI ASSISTANT</div>
            </div>
            <div class="content">
              <div class="highlight">
                <p style="margin: 0; font-weight: bold; color: #1F2937;">
                  🤖 This lead was captured by your AI Project Assistant!
                </p>
              </div>

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
              
              <div class="field">
                <span class="label">💡 Project Idea:</span>
                <div class="value" style="white-space: pre-wrap;">${body.projectIdea}</div>
              </div>
              
              <div class="field">
                <span class="label">🎯 Project Type:</span>
                <div class="value">${body.projectType}</div>
              </div>
              
              <div class="field">
                <span class="label">⏱️ Timeline:</span>
                <div class="value">${body.timeline}</div>
              </div>
              
              <div class="field">
                <span class="label">💰 Budget:</span>
                <div class="value">${body.budget}</div>
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

              <div class="highlight">
                <p style="margin: 0; color: #1F2937;">
                  <strong>💡 Next Step:</strong> Send Teams meeting invite to ${body.email}
                </p>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">MicroAI - 10x Faster Development</p>
              <p style="margin: 5px 0 0 0;">This is an automated notification from your AI Project Assistant.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const adminEmailText = `
New Project Inquiry via AI Bot 🤖

This lead was captured by your AI Project Assistant!

Name: ${body.name}
Email: ${body.email}
${body.phone ? `Phone: ${body.phone}` : ''}

Project Idea:
${body.projectIdea}

Project Type: ${body.projectType}
Timeline: ${body.timeline}
Budget: ${body.budget}

Submitted: ${new Date().toLocaleString()}

Next Step: Send Teams meeting invite to ${body.email}
    `

    // Send email to admin
    try {
      await transporter.sendMail({
        from: `"MicroAI AI Bot" <${process.env.SMTP_USER || 'microailabs@outlook.com'}>`,
        to: 'microailabs@outlook.com',
        subject: `🤖 New AI Bot Inquiry from ${body.name} - ${body.projectType}`,
        text: adminEmailText,
        html: adminEmailHtml,
        replyTo: body.email,
      })

      console.log('✅ AI Bot inquiry email sent successfully to microailabs@outlook.com')
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError)
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
              <h1 style="margin: 0; font-size: 32px;">🎉 Thanks for Sharing Your Vision, ${body.name}!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">We're excited about your ${body.projectType} project!</p>
              <div class="badge">✓ RECEIVED</div>
            </div>
            
            <div class="content">
              <div class="section">
                <p style="font-size: 18px; color: #1F2937; margin-top: 0;">
                  <strong>Awesome!</strong> Our AI assistant has captured your project details and our team is already reviewing them.
                </p>
              </div>

              <div class="highlight">
                <h2 style="margin-top: 0; font-size: 20px;">⚡ What Happens Next?</h2>
                <div class="feature">
                  <div class="feature-icon">1️⃣</div>
                  <div class="feature-text">
                    <strong>Immediate Analysis</strong><br/>
                    Our team is analyzing your project requirements right now
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">2️⃣</div>
                  <div class="feature-text">
                    <strong>Teams Meeting Invite</strong><br/>
                    You'll receive a Teams calendar invite within 24 hours
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">3️⃣</div>
                  <div class="feature-text">
                    <strong>Discovery Discussion</strong><br/>
                    We'll walk through your vision and answer all questions
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">4️⃣</div>
                  <div class="feature-text">
                    <strong>Detailed Proposal</strong><br/>
                    Receive a comprehensive proposal with timeline and pricing
                  </div>
                </div>
              </div>

              <div class="section">
                <h3 style="color: #1F2937; margin-bottom: 10px;">📋 Your Project Summary</h3>
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p style="margin: 5px 0;"><strong>Project Type:</strong> ${body.projectType}</p>
                  <p style="margin: 5px 0;"><strong>Timeline:</strong> ${body.timeline}</p>
                  <p style="margin: 5px 0;"><strong>Budget Range:</strong> ${body.budget}</p>
                  <p style="margin: 5px 0;"><strong>Date Submitted:</strong> ${new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              <div class="section" style="background: #EFF6FF; padding: 20px; border-radius: 10px; border-left: 4px solid #3B82F6;">
                <h3 style="color: #1F2937; margin-top: 0;">🚀 Why MicroAI is Different</h3>
                <ul style="margin: 10px 0; padding-left: 20px; color: #4B5563;">
                  <li><strong>10x Faster:</strong> We deliver complete projects in weeks, not months</li>
                  <li><strong>AI-Powered Development:</strong> Cutting-edge technology stack</li>
                  <li><strong>Transparent Process:</strong> You'll know exactly what to expect</li>
                  <li><strong>Production-Ready:</strong> Every project is built to scale</li>
                  <li><strong>Local + Global:</strong> Ghana-based with international standards</li>
                </ul>
              </div>

              <div class="section" style="text-align: center;">
                <p style="color: #6B7280; margin-bottom: 20px;">
                  While you wait, check out our portfolio to see what we've built for other clients!
                </p>
                <a href="https://microai-8gl3.onrender.com/portfolio" class="cta-button" style="color: white;">
                  View Our Portfolio
                </a>
              </div>

              <div class="section" style="background: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B;">
                <p style="margin: 0; color: #92400E;">
                  <strong>💡 Pro Tip:</strong> Start gathering any design references, feature lists, or examples of what you like. This will make our discussion even more productive!
                </p>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0; font-size: 14px; color: #D1D5DB;"><strong>MicroAI</strong></p>
              <p style="margin: 5px 0;">10x Faster Development | Takoradi, Ghana</p>
              <p style="margin: 5px 0;">
                📧 <a href="mailto:microailabs@outlook.com" style="color: #60A5FA;">microailabs@outlook.com</a>
              </p>
              <p style="margin: 15px 0 5px 0; font-size: 11px; color: #9CA3AF;">
                This is an automated confirmation from our AI assistant.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const clientEmailText = `
🎉 Thanks for Sharing Your Vision, ${body.name}!

Hi ${body.name},

Awesome! Our AI assistant has captured your project details and our team is already reviewing them.

WHAT HAPPENS NEXT?

1. Immediate Analysis - Our team is analyzing your project requirements
2. Teams Meeting Invite - You'll receive a Teams calendar invite within 24 hours
3. Discovery Discussion - We'll walk through your vision and answer all questions
4. Detailed Proposal - Receive a comprehensive proposal with timeline and pricing

YOUR PROJECT SUMMARY:
Project Type: ${body.projectType}
Timeline: ${body.timeline}
Budget Range: ${body.budget}
Date Submitted: ${new Date().toLocaleDateString()}

WHY MICROAI IS DIFFERENT:
• 10x Faster - We deliver complete projects in weeks, not months
• AI-Powered Development - Cutting-edge technology stack
• Transparent Process - You'll know exactly what to expect
• Production-Ready - Every project is built to scale
• Local + Global - Ghana-based with international standards

Best regards,
The MicroAI Team

MicroAI - 10x Faster Development
Takoradi, Ghana
microailabs@outlook.com
    `

    // Send auto-reply to client
    try {
      await transporter.sendMail({
        from: `"MicroAI AI Assistant" <${process.env.SMTP_USER || 'microailabs@outlook.com'}>`,
        to: body.email,
        subject: `🚀 Your Project Details Received - MicroAI`,
        text: clientEmailText,
        html: clientEmailHtml,
      })

      console.log('✅ AI Bot auto-reply sent to client:', body.email)
    } catch (replyError) {
      console.error('❌ Auto-reply error:', replyError)
      // Continue anyway
    }

    // Log submission
    console.log('🤖 AI Bot project inquiry:', body)

    const submission = {
      id: Math.random().toString(36).substring(7),
      ...body,
      submittedAt: new Date().toISOString(),
      status: 'new',
      source: 'ai-bot'
    }

    return NextResponse.json({
      success: true,
      message: 'Project inquiry received! Check your email for confirmation.',
      data: submission
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Project inquiry error:', error)
    return NextResponse.json(
      { error: 'Failed to process your inquiry. Please try again.' },
      { status: 500 }
    )
  }
}
