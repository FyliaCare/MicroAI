import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/client/code-access - Request code access
export async function POST(request: NextRequest) {
  try {
    // Get session token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No session token' },
        { status: 401 }
      )
    }

    const sessionToken = authHeader.split('Bearer ')[1]

    // Validate session
    const session = await prisma.clientSession.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: {
            client: true,
          },
        },
      },
    })

    if (!session || session.expiresAt < new Date() || !session.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    if (!session.user.client) {
      return NextResponse.json(
        { success: false, error: 'No client account found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { projectId, reason } = body

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID required' },
        { status: 400 }
      )
    }

    // Verify project belongs to client
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: session.user.client.id,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Check for existing pending or approved requests
    const existingRequest = await prisma.codeAccessRequest.findFirst({
      where: {
        projectId,
        userId: session.user.id,
        status: {
          in: ['pending', 'approved'],
        },
      },
    })

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: 'You already have a pending or approved request for this project' },
        { status: 400 }
      )
    }

    // Generate request number (CAR-YYYY-NNNN)
    const year = new Date().getFullYear()
    const latestRequest = await prisma.codeAccessRequest.findFirst({
      where: {
        requestNumber: {
          startsWith: `CAR-${year}-`,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    let requestNumber: string
    if (latestRequest) {
      const lastNumber = parseInt(latestRequest.requestNumber.split('-')[2])
      requestNumber = `CAR-${year}-${String(lastNumber + 1).padStart(4, '0')}`
    } else {
      requestNumber = `CAR-${year}-0001`
    }

    // Calculate auto-approval time (24 hours from now)
    const autoApproveAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Create code access request
    const codeAccessRequest = await prisma.codeAccessRequest.create({
      data: {
        requestNumber,
        projectId,
        userId: session.user.id,
        reason: reason || 'Client requested code access',
        status: 'pending',
        autoApproveAt,
      },
    })

    // Create admin notification
    await prisma.notification.create({
      data: {
        type: 'code-access-request',
        title: 'Code Access Request',
        message: `${session.user.client.name} requested code access for ${project.name}`,
        link: `/admin/code-access/${codeAccessRequest.id}`,
        priority: 'high',
      },
    })

    // Queue email to admin
    await prisma.emailQueue.create({
      data: {
        to: process.env.ADMIN_EMAIL || 'admin@microai.systems',
        subject: `Code Access Request: ${project.name}`,
        htmlContent: generateAdminNotificationEmail({
          clientName: session.user.client.name,
          projectName: project.name,
          requestNumber,
          reason: reason || 'No reason provided',
          autoApproveAt: autoApproveAt.toLocaleString(),
        }),
        templateType: 'code-access-request',
        priority: 'high',
      },
    })

    // Create activity feed
    await prisma.activityFeed.create({
      data: {
        type: 'code-access-requested',
        title: 'Code Access Requested',
        description: `Request ${requestNumber}`,
        actorType: 'client',
        actorId: session.user.client.id,
        actorName: session.user.client.name,
        targetType: 'project',
        targetId: projectId,
        targetName: project.name,
        isPublic: false,
        clientId: session.user.client.id,
        icon: '🔐',
        color: '#f59e0b',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Code access request submitted successfully',
      request: {
        id: codeAccessRequest.id,
        requestNumber,
        status: 'pending',
        autoApproveAt,
      },
    })
  } catch (error) {
    console.error('Code access request error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit code access request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/client/code-access - Get code access requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    // Get session token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessionToken = authHeader.split('Bearer ')[1]

    // Validate session
    const session = await prisma.clientSession.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: {
            client: true,
          },
        },
      },
    })

    if (!session || session.expiresAt < new Date() || !session.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    if (!session.user.client) {
      return NextResponse.json(
        { success: false, error: 'No client account found' },
        { status: 404 }
      )
    }

    // Build query
    const where: any = {
      userId: session.user.id,
    }

    if (projectId) {
      // Verify project access
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          clientId: session.user.client.id,
        },
      })

      if (!project) {
        return NextResponse.json(
          { success: false, error: 'Project not found or access denied' },
          { status: 404 }
        )
      }

      where.projectId = projectId
    }

    // Get requests
    const requests = await prisma.codeAccessRequest.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            githubRepo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      requests: requests.map((req) => ({
        id: req.id,
        requestNumber: req.requestNumber,
        projectId: req.projectId,
        projectName: req.project.name,
        reason: req.reason,
        status: req.status,
        accessGranted: req.accessGranted,
        repoUrl: req.repoUrl,
        downloadUrl: req.downloadUrl,
        downloadExpiry: req.downloadExpiry,
        autoApproveAt: req.autoApproveAt,
        approvedAt: req.approvedAt,
        rejectedAt: req.rejectedAt,
        rejectionReason: req.rejectionReason,
        createdAt: req.createdAt,
      })),
    })
  } catch (error) {
    console.error('Get code access requests error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch code access requests',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateAdminNotificationEmail(data: {
  clientName: string
  projectName: string
  requestNumber: string
  reason: string
  autoApproveAt: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Code Access Request</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
    .content { padding: 40px 30px; }
    .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
    .info-box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: #f59e0b; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Code Access Request</h1>
    </div>
    <div class="content">
      <p>Hi Admin,</p>
      <p>A client has requested access to a project repository.</p>
      
      <div class="info-box">
        <p><strong>Request Details:</strong></p>
        <ul>
          <li><strong>Request #:</strong> ${data.requestNumber}</li>
          <li><strong>Client:</strong> ${data.clientName}</li>
          <li><strong>Project:</strong> ${data.projectName}</li>
          <li><strong>Reason:</strong> ${data.reason}</li>
        </ul>
      </div>
      
      <div class="warning-box">
        <p><strong>⏰ Auto-Approval Notice</strong></p>
        <p>This request will be automatically approved at:</p>
        <p><strong>${data.autoApproveAt}</strong></p>
        <p>Please review and take action before this time if needed.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/code-access/${data.requestNumber}" class="button">
          Review Request
        </a>
      </div>
      
      <p>You can approve or reject this request from the admin panel.</p>
      
      <p>Best regards,<br><strong>MicroAI Systems</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} MicroAI Systems. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
