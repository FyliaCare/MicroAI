import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminNotificationNow, sendClientConfirmationNow } from '@/lib/send-email'

// POST /api/project-request - Submit new project request from chatbot/form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      // Client info
      clientName,
      clientEmail,
      clientPhone,
      clientCompany,
      clientWebsite,
      
      // Project details
      projectName,
      projectType,
      description,
      industry,
      
      // Requirements (from AI conversation)
      requirements, // JSON object
      features, // Array
      techPreferences, // Array
      
      // Budget & Timeline
      budget,
      budgetRange,
      timeline,
      startDate,
      deadline,
      
      // Priority
      priority = 'normal',
      
      // Communication
      chatTranscript,
      attachments,
      
      // Tracking
      source = 'website',
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body

    // Validate required fields
    if (!clientName || !clientEmail || !projectName || !projectType || !description) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: clientName, clientEmail, projectName, projectType, description' 
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get IP and location info from request
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    
    // Generate unique request number
    const year = new Date().getFullYear()
    const count = await prisma.projectRequest.count({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1)
        }
      }
    })
    const requestNumber = `REQ-${year}-${String(count + 1).padStart(4, '0')}`

    // Create project request
    const projectRequest = await prisma.projectRequest.create({
      data: {
        requestNumber,
        clientName,
        clientEmail,
        clientPhone,
        clientCompany,
        clientWebsite,
        projectName,
        projectType,
        description,
        industry,
        requirements: JSON.stringify(requirements || {}),
        features: JSON.stringify(features || []),
        techPreferences: JSON.stringify(techPreferences || []),
        budget: budget ? parseFloat(budget) : null,
        budgetRange,
        timeline,
        startDate: startDate ? new Date(startDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        priority,
        chatTranscript,
        attachments: JSON.stringify(attachments || []),
        source,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        ipAddress,
        status: 'pending',
      },
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'new-project-request',
        title: '🚀 New Project Request',
        message: `${clientName} from ${clientCompany || 'N/A'} submitted a request for ${projectName}`,
        link: `/admin/requests/${projectRequest.id}`,
        priority: priority === 'urgent' ? 'urgent' : 'high',
        entityType: 'ProjectRequest',
        entityId: projectRequest.id,
      },
    })

    // Send confirmation email to client IMMEDIATELY
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .badge { display: inline-block; background: #10B981; color: white; padding: 6px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 10px; }
            .footer { background: #1F2937; color: #9CA3AF; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You! 🎉</h1>
              <div class="badge">✓ REQUEST RECEIVED</div>
            </div>
            <div class="content">
              <p><strong>Hi ${clientName},</strong></p>
              <p>We've received your project request for <strong>${projectName}</strong> (${requestNumber}).</p>
              <p>Our team will review your requirements and get back to you within 24-48 hours.</p>
              <h3>Request Details:</h3>
              <ul>
                <li><strong>Project:</strong> ${projectName}</li>
                <li><strong>Type:</strong> ${projectType}</li>
                <li><strong>Budget Range:</strong> ${budgetRange || 'To be discussed'}</li>
                <li><strong>Timeline:</strong> ${timeline || 'Flexible'}</li>
              </ul>
              <p>If you have any questions, feel free to reply to this email.</p>
              <p>Best regards,<br>MicroAI Systems Team</p>
            </div>
            <div class="footer">
              <p>MicroAI - 10x Faster Development</p>
              <p>sales@microaisystems.com</p>
            </div>
          </div>
        </body>
      </html>
    `

    try {
      await sendClientConfirmationNow(
        clientEmail,
        `Project Request Received - ${requestNumber}`,
        clientEmailHtml
      )
    } catch (error) {
      console.error('Failed to send client confirmation email:', error)
    }

    // Send admin notification email IMMEDIATELY
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>🚀 New Project Request</h2>
          <p><strong>Request Number:</strong> ${requestNumber}</p>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Project:</strong> ${projectName}</p>
          <p><strong>Type:</strong> ${projectType}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Budget Range:</strong> ${budgetRange || 'To be discussed'}</p>
          <p><strong>Timeline:</strong> ${timeline || 'Flexible'}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.microaisystems.com'}/admin/project-requests">View in Admin Panel</a></p>
        </body>
      </html>
    `

    try {
      await sendAdminNotificationNow(
        `🚀 New Project Request: ${projectName}`,
        adminEmailHtml
      )
    } catch (error) {
      console.error('Failed to send admin notification email:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Project request submitted successfully',
      data: {
        requestNumber,
        id: projectRequest.id,
        estimatedResponse: '24-48 hours',
      },
    })
  } catch (error) {
    console.error('Error creating project request:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit project request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/project-request - Get project requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const [requests, total] = await Promise.all([
      prisma.projectRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
            },
          },
        },
      }),
      prisma.projectRequest.count({ where }),
    ])

    // Parse JSON fields
    const formattedRequests = requests.map((req) => ({
      ...req,
      requirements: req.requirements ? JSON.parse(req.requirements) : {},
      features: req.features ? JSON.parse(req.features) : [],
      techPreferences: req.techPreferences ? JSON.parse(req.techPreferences) : [],
      attachments: req.attachments ? JSON.parse(req.attachments) : [],
    }))

    return NextResponse.json({
      success: true,
      requests: formattedRequests,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching project requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project requests' },
      { status: 500 }
    )
  }
}
