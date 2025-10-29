import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin/code-access/[id]/approve - Approve code access request
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = params.id
    const body = await request.json()
    const { notes, grantGithubAccess = true } = body

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

    if (codeRequest.status === 'approved') {
      return NextResponse.json(
        { success: false, error: 'Request already approved' },
        { status: 400 }
      )
    }

    if (codeRequest.status === 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Cannot approve a rejected request' },
        { status: 400 }
      )
    }

    // Get project and client separately
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

    // Prepare repo URLs
    let repoUrl = project.githubRepo
    let downloadUrl = null
    let downloadExpiry = null

    // If GitHub repo exists, prepare access
    if (grantGithubAccess && repoUrl) {
      // Generate time-limited download URL (valid for 30 days)
      downloadExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      // TODO: Integrate with GitHub API to create invite or generate download token
      downloadUrl = repoUrl // For now, just use the repo URL
    }

    // Approve request
    const updatedRequest = await prisma.codeAccessRequest.update({
      where: { id: requestId },
      data: {
        status: 'approved',
        accessGranted: true,
        accessGrantedAt: new Date(),
        reviewedAt: new Date(),
        repoUrl,
        downloadUrl,
        downloadExpiry,
        inviteSent: grantGithubAccess,
        reviewNotes: notes,
      },
    })

    // Queue email to client
    if (codeRequest.user) {
      await prisma.emailQueue.create({
        data: {
          to: codeRequest.user.email,
          subject: 'Code Access Approved',
          htmlContent: generateApprovalEmail({
            clientName: codeRequest.user.name,
            projectName: project.name,
            requestNumber: codeRequest.requestNumber,
            repoUrl: repoUrl || 'Repository URL will be provided separately',
            downloadUrl,
            downloadExpiry: downloadExpiry?.toLocaleDateString() || null,
            notes,
          }),
          templateType: 'code-access-approved',
          priority: 'high',
          userId: codeRequest.userId,
        },
      })
    }

    // Create activity feed
    await prisma.activityFeed.create({
      data: {
        type: 'code-access-approved',
        title: 'Code Access Approved',
        description: `Request ${codeRequest.requestNumber} approved`,
        actorType: 'admin',
        actorId: 'admin', // TODO: Use actual admin ID
        actorName: 'Admin',
        targetType: 'project',
        targetId: codeRequest.projectId,
        targetName: project.name,
        isPublic: true,
        clientId: project.clientId,
        icon: '✅',
        color: '#10b981',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Code access request approved successfully',
      request: updatedRequest,
    })
  } catch (error) {
    console.error('Approve code access error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to approve code access request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateApprovalEmail(data: {
  clientName: string
  projectName: string
  requestNumber: string
  repoUrl: string
  downloadUrl: string | null
  downloadExpiry: string | null
  notes?: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Code Access Approved</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
    .content { padding: 40px 30px; }
    .success-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
    .code-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: monospace; }
    .warning-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: #10b981; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Code Access Approved</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${data.clientName}</strong>,</p>
      <p>Great news! Your code access request has been approved.</p>
      
      <div class="success-box">
        <p><strong>✓ Access Granted</strong></p>
        <p>You now have access to the project repository for <strong>${data.projectName}</strong></p>
        <p><strong>Request #:</strong> ${data.requestNumber}</p>
      </div>
      
      <div class="code-box">
        <p><strong>Repository URL:</strong></p>
        <p><a href="${data.repoUrl}" style="color: #3b82f6;">${data.repoUrl}</a></p>
        
        ${data.downloadUrl ? `
        <p style="margin-top: 15px;"><strong>Download Link:</strong></p>
        <p><a href="${data.downloadUrl}" style="color: #3b82f6;">${data.downloadUrl}</a></p>
        ${data.downloadExpiry ? `<p style="font-size: 12px; color: #666;">Expires: ${data.downloadExpiry}</p>` : ''}
        ` : ''}
      </div>
      
      ${data.notes ? `
      <div class="code-box">
        <p><strong>Admin Notes:</strong></p>
        <p>${data.notes}</p>
      </div>
      ` : ''}
      
      <div class="warning-box">
        <p><strong>⚠️ Important:</strong></p>
        <ul>
          <li>Please keep the repository link confidential</li>
          <li>Do not share access credentials with third parties</li>
          <li>Use the code in accordance with your project agreement</li>
          <li>Contact us if you have any questions or need assistance</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard" class="button">
          Go to Dashboard
        </a>
      </div>
      
      <p>If you need any help accessing the repository, please don't hesitate to contact us.</p>
      
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
