import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin/code-access/[id]/reject - Reject code access request
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = params.id
    const body = await request.json()
    const { reason } = body

    if (!reason) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    // TODO: Add admin authentication check

    // Get request
    const codeRequest = await prisma.codeAccessRequest.findUnique({
      where: { id: requestId },
      include: {
        user: true,
      },
    })

    if (!codeRequest) {
      return NextResponse.json(
        { success: false, error: 'Code access request not found' },
        { status: 404 }
      )
    }

    if (codeRequest.status === 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Request already rejected' },
        { status: 400 }
      )
    }

    if (codeRequest.status === 'approved') {
      return NextResponse.json(
        { success: false, error: 'Cannot reject an approved request' },
        { status: 400 }
      )
    }

    // Get project separately
    const project = await prisma.project.findUnique({
      where: { id: codeRequest.projectId },
      include: { client: true },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Reject request
    const updatedRequest = await prisma.codeAccessRequest.update({
      where: { id: requestId },
      data: {
        status: 'rejected',
        reviewedAt: new Date(),
        rejectionReason: reason,
      },
    })

    // Create notification for client
    await prisma.notification.create({
      data: {
        type: 'code-access-rejected',
        title: 'Code Access Request Declined',
        message: `Your code access request for ${project.name} was declined`,
        link: `/client/project/${codeRequest.projectId}`,
        priority: 'normal',
        entityType: 'CodeAccessRequest',
        entityId: codeRequest.id,
      },
    })

    // Queue email to client
    if (codeRequest.user) {
      await prisma.emailQueue.create({
        data: {
          to: codeRequest.user.email,
          subject: 'Code Access Request Update',
          htmlContent: generateRejectionEmail({
            clientName: codeRequest.user.name,
            projectName: project.name,
            requestNumber: codeRequest.requestNumber,
            reason,
          }),
          templateType: 'code-access-rejected',
          priority: 'normal',
          userId: codeRequest.userId,
        },
      })
    }

    // Create activity feed
    await prisma.activityFeed.create({
      data: {
        type: 'code-access-rejected',
        title: 'Code Access Declined',
        description: `Request ${codeRequest.requestNumber} declined`,
        actorType: 'admin',
        actorId: 'admin', // TODO: Use actual admin ID
        actorName: 'Admin',
        targetType: 'project',
        targetId: codeRequest.projectId,
        targetName: project.name,
        isPublic: false,
        clientId: project.clientId,
        icon: '❌',
        color: '#ef4444',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Code access request rejected',
      request: updatedRequest,
    })
  } catch (error) {
    console.error('Reject code access error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to reject code access request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateRejectionEmail(data: {
  clientName: string
  projectName: string
  requestNumber: string
  reason: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Code Access Request Update</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
    .content { padding: 40px 30px; }
    .info-box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
    .reason-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: #3b82f6; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Code Access Request Update</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${data.clientName}</strong>,</p>
      <p>Thank you for your code access request for <strong>${data.projectName}</strong>.</p>
      
      <div class="info-box">
        <p><strong>Request Details:</strong></p>
        <p><strong>Request #:</strong> ${data.requestNumber}</p>
        <p><strong>Status:</strong> Declined</p>
      </div>
      
      <div class="reason-box">
        <p><strong>Reason:</strong></p>
        <p>${data.reason}</p>
      </div>
      
      <p>We understand you may have questions about this decision. Here's what you can do:</p>
      <ul>
        <li>Review the reason provided above</li>
        <li>Contact us to discuss alternative solutions</li>
        <li>Submit a new request if circumstances change</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:support@microai.systems" class="button">
          Contact Support
        </a>
      </div>
      
      <p>We're here to help and want to ensure you have the access you need while maintaining security best practices.</p>
      
      <p>Best regards,<br><strong>MicroAI Systems Team</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} MicroAI Systems. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
