import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/cron/auto-approve-code-access - Auto-approve code access requests after 24 hours
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron job
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()
    
    // Find requests ready for auto-approval
    const readyRequests = await prisma.codeAccessRequest.findMany({
      where: {
        status: 'pending',
        autoApprovedAt: { lte: now },
      },
      include: {
        user: true,
      },
    })

    console.log(`Found ${readyRequests.length} requests ready for auto-approval`)

    const approved: string[] = []
    const errors: string[] = []

    for (const request of readyRequests) {
      try {
        // Fetch project separately
        const project = await prisma.project.findUnique({
          where: { id: request.projectId },
          include: { client: true },
        })

        if (!project) {
          errors.push(`Project not found for request ${request.requestNumber}`)
          continue
        }

        // Prepare repo access
        let repoUrl = project.githubRepo
        let downloadUrl = repoUrl
        let downloadExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

        // Auto-approve the request
        await prisma.codeAccessRequest.update({
          where: { id: request.id },
          data: {
            status: 'approved',
            accessGranted: true,
            accessGrantedAt: now,
            reviewedAt: now,
            repoUrl,
            downloadUrl,
            downloadExpiry,
            inviteSent: true,
            reviewNotes: 'Auto-approved after 24 hours',
          },
        })

        // Create notification for client
        await prisma.notification.create({
          data: {
            type: 'code-access-approved',
            title: 'Code Access Approved',
            message: `Your code access request for ${project.name} has been automatically approved`,
            link: `/client/project/${request.projectId}?tab=code`,
            priority: 'high',
            entityType: 'CodeAccessRequest',
            entityId: request.id,
          },
        })

        // Queue email to client
        if (request.user) {
          await prisma.emailQueue.create({
            data: {
              to: request.user.email,
              subject: 'Code Access Approved',
              htmlContent: generateApprovalEmail({
                clientName: request.user.name,
                projectName: project.name,
                requestNumber: request.requestNumber,
                repoUrl: repoUrl || 'Repository information will be provided separately',
                downloadUrl,
                downloadExpiry: downloadExpiry.toLocaleDateString(),
              }),
              templateType: 'code-access-auto-approved',
              priority: 'high',
              userId: request.userId,
            },
          })
        }

        // Create activity feed
        await prisma.activityFeed.create({
          data: {
            type: 'code-access-auto-approved',
            title: 'Code Access Auto-Approved',
            description: `Request ${request.requestNumber} automatically approved after 24 hours`,
            actorType: 'system',
            actorId: 'auto-approval',
            actorName: 'System',
            targetType: 'project',
            targetId: request.projectId,
            targetName: project.name,
            isPublic: true,
            clientId: project.clientId,
            icon: '⏰',
            color: '#10b981',
          },
        })

        approved.push(request.requestNumber)
        console.log(`Auto-approved request: ${request.requestNumber}`)

        // Notify admin
        await prisma.notification.create({
          data: {
            type: 'code-access-auto-approved',
            title: 'Code Access Auto-Approved',
            message: `Request ${request.requestNumber} for ${project.name} was automatically approved`,
            link: `/admin/code-access/${request.id}`,
            priority: 'normal',
            entityType: 'CodeAccessRequest',
            entityId: request.id,
          },
        })

      } catch (err) {
        const errorMessage = `Failed to auto-approve ${request.requestNumber}: ${err instanceof Error ? err.message : 'Unknown error'}`
        errors.push(errorMessage)
        console.error(errorMessage)
      }
    }

    // Update scheduled task record
    await prisma.scheduledTask.upsert({
      where: { taskName: 'auto-approve-code-access' },
      create: {
        taskName: 'auto-approve-code-access',
        taskType: 'automation',
        cronExpression: '0 * * * *', // Every hour
        isActive: true,
        lastRunAt: now,
        nextRunAt: new Date(now.getTime() + 60 * 60 * 1000), // Next hour
        lastStatus: errors.length > 0 ? 'partial-success' : 'success',
        executionCount: 1,
        config: {
          description: 'Auto-approve code access requests after 24 hours',
          approvalDelay: '24 hours',
        },
      },
      update: {
        lastRunAt: now,
        nextRunAt: new Date(now.getTime() + 60 * 60 * 1000),
        lastStatus: errors.length > 0 ? 'partial-success' : 'success',
        executionCount: { increment: 1 },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Auto-approval completed',
      summary: {
        totalProcessed: readyRequests.length,
        approved: approved.length,
        errors: errors.length,
      },
      approvedRequests: approved,
      errors: errors.length > 0 ? errors : undefined,
      executedAt: now.toISOString(),
    })

  } catch (error) {
    console.error('Auto-approval cron job error:', error)
    
    // Log the error
    await prisma.scheduledTask.upsert({
      where: { taskName: 'auto-approve-code-access' },
      create: {
        taskName: 'auto-approve-code-access',
        taskType: 'automation',
        cronExpression: '0 * * * *',
        isActive: true,
        lastRunAt: new Date(),
        lastStatus: 'error',
        lastError: error instanceof Error ? error.message : 'Unknown error',
        executionCount: 1,
      },
      update: {
        lastRunAt: new Date(),
        lastStatus: 'error',
        lastError: error instanceof Error ? error.message : 'Unknown error',
        executionCount: { increment: 1 },
      },
    }).catch(() => {
      // Ignore if this fails
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Auto-approval failed',
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
  downloadExpiry: string
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
    .info-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: #10b981; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Code Access Automatically Approved</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${data.clientName}</strong>,</p>
      <p>Your code access request has been automatically approved after the 24-hour review period.</p>
      
      <div class="success-box">
        <p><strong>✓ Access Granted</strong></p>
        <p>You now have access to the project repository for <strong>${data.projectName}</strong></p>
        <p><strong>Request #:</strong> ${data.requestNumber}</p>
      </div>
      
      <div class="info-box">
        <p><strong>ℹ️ Auto-Approval Notice</strong></p>
        <p>This request was automatically approved as no admin action was taken within 24 hours.</p>
      </div>
      
      <div class="code-box">
        <p><strong>Repository URL:</strong></p>
        <p><a href="${data.repoUrl}" style="color: #3b82f6;">${data.repoUrl}</a></p>
        
        ${data.downloadUrl ? `
        <p style="margin-top: 15px;"><strong>Download Link:</strong></p>
        <p><a href="${data.downloadUrl}" style="color: #3b82f6;">Access Repository</a></p>
        <p style="font-size: 12px; color: #666;">Expires: ${data.downloadExpiry}</p>
        ` : ''}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard" class="button">
          Go to Dashboard
        </a>
      </div>
      
      <p><strong>Security Reminder:</strong></p>
      <ul>
        <li>Keep the repository link confidential</li>
        <li>Do not share access credentials</li>
        <li>Use the code in accordance with your agreement</li>
      </ul>
      
      <p>If you have any questions, please contact us.</p>
      
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
