import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST /api/admin/project-requests/[id]/reject - Reject project request
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { reason, notes } = body
    
    // Use session data for admin info
    const adminId = session.user.id
    const adminName = session.user.name

    if (!reason) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    // Get the project request
    const projectRequest = await prisma.projectRequest.findUnique({
      where: { id: params.id },
    })

    if (!projectRequest) {
      return NextResponse.json(
        { success: false, error: 'Project request not found' },
        { status: 404 }
      )
    }

    if (projectRequest.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: `Request is already ${projectRequest.status}` },
        { status: 400 }
      )
    }

    // Update request status
    const updatedRequest = await prisma.projectRequest.update({
      where: { id: params.id },
      data: {
        status: 'rejected',
        reviewedBy: adminId,
        reviewedAt: new Date(),
        reviewNotes: notes,
        rejectionReason: reason,
      },
    })

    // Send rejection email to client
    await prisma.emailQueue.create({
      data: {
        to: projectRequest.clientEmail,
        subject: `Update on Your Project Request - ${projectRequest.requestNumber}`,
        htmlContent: generateRejectionEmail({
          clientName: projectRequest.clientName,
          projectName: projectRequest.projectName,
          requestNumber: projectRequest.requestNumber,
          reason,
        }),
        templateType: 'project-request-rejection',
        templateVars: JSON.stringify({
          clientName: projectRequest.clientName,
          projectName: projectRequest.projectName,
          requestNumber: projectRequest.requestNumber,
          reason,
        }),
        priority: 'normal',
      },
    })

    // Create activity log
    await prisma.activityFeed.create({
      data: {
        type: 'project-request-rejected',
        title: 'Project Request Rejected',
        description: `${projectRequest.projectName} request was declined`,
        actorType: 'admin',
        actorId: adminId,
        actorName: adminName,
        targetType: 'project-request',
        targetId: projectRequest.id,
        targetName: projectRequest.projectName,
        isPublic: false,
        icon: '❌',
        color: '#ef4444',
        metadata: JSON.stringify({ reason }),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Project request rejected',
      data: {
        requestId: updatedRequest.id,
        requestNumber: updatedRequest.requestNumber,
        rejectionEmailQueued: true,
      },
    })
  } catch (error) {
    console.error('Error rejecting project request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reject project request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Helper: Generate rejection email HTML
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Request Update</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: #6b7280; color: #ffffff; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 40px 30px; }
    .reason-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .reason-box h3 { margin-top: 0; color: #dc2626; }
    .info-box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; padding: 14px 32px; background: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .button:hover { opacity: 0.9; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Update on Your Project Request</h1>
      <p>${data.requestNumber}</p>
    </div>
    
    <div class="content">
      <p>Hi <strong>${data.clientName}</strong>,</p>
      
      <p>Thank you for your interest in working with MicroAI Systems on <strong>${data.projectName}</strong>.</p>
      
      <p>After careful review of your project request, we regret to inform you that we're unable to proceed with this project at this time.</p>
      
      <div class="reason-box">
        <h3>Reason for Decline</h3>
        <p>${data.reason}</p>
      </div>
      
      <div class="info-box">
        <p><strong>💡 What You Can Do:</strong></p>
        <ul>
          <li>If the project requirements can be adjusted, feel free to submit a new request</li>
          <li>Consider alternative approaches that might better align with our services</li>
          <li>Reach out to us directly to discuss potential modifications</li>
        </ul>
      </div>
      
      <p>We appreciate you considering MicroAI Systems for your project needs. If you have any questions or would like to discuss this further, please don't hesitate to contact us.</p>
      
      <center>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" class="button">Contact Us</a>
      </center>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>MicroAI Systems Team</strong><br>
        <a href="mailto:sales@microaisystems.com">sales@microaisystems.com</a>
      </p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} MicroAI Systems. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
