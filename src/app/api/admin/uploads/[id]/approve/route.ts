import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin/uploads/[id]/approve - Approve an upload
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uploadId = params.id
    const body = await request.json()
    const { notes } = body

    // TODO: Add admin authentication check

    // Get upload
    const upload = await prisma.clientUpload.findUnique({
      where: { id: uploadId },
      include: {
        client: true,
      },
    })

    if (!upload) {
      return NextResponse.json(
        { success: false, error: 'Upload not found' },
        { status: 404 }
      )
    }

    if (upload.isApproved) {
      return NextResponse.json(
        { success: false, error: 'Upload already approved' },
        { status: 400 }
      )
    }

    // Get project info separately
    const project = upload.projectId
      ? await prisma.project.findUnique({ where: { id: upload.projectId } })
      : null

    // Approve upload
    const updatedUpload = await prisma.clientUpload.update({
      where: { id: uploadId },
      data: {
        isApproved: true,
        approvedAt: new Date(),
        // approvedBy: adminUserId, // TODO: Set from session
        notes,
      },
    })

    // Create notification for client
    await prisma.notification.create({
      data: {
        type: 'upload-approved',
        title: 'Document Approved',
        message: `Your ${upload.category} "${upload.name}" has been approved`,
        link: `/client/project/${upload.projectId}?tab=documents`,
        priority: 'normal',
        clientId: upload.clientId,
      },
    })

    // Queue email to client
    if (upload.client) {
      await prisma.emailQueue.create({
        data: {
          to: upload.client.email,
          subject: 'Document Approved',
          htmlContent: generateApprovalEmail({
            clientName: upload.client.name,
            documentName: upload.name,
            projectName: project?.name || 'your project',
            category: upload.category,
            notes,
          }),
          templateType: 'upload-approved',
          priority: 'normal',
        },
      })
    }

    // Create activity feed
    await prisma.activityFeed.create({
      data: {
        type: 'document-approved',
        title: 'Document Approved',
        description: `${upload.name} (${upload.category})`,
        actorType: 'admin',
        actorId: 'admin', // TODO: Use actual admin ID
        actorName: 'Admin',
        targetType: 'project',
        targetId: upload.projectId || '',
        targetName: project?.name || 'Unknown Project',
        isPublic: true,
        clientId: upload.clientId,
        icon: '✅',
        color: '#10b981',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Upload approved successfully',
      upload: updatedUpload,
    })
  } catch (error) {
    console.error('Approve upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to approve upload',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateApprovalEmail(data: {
  clientName: string
  documentName: string
  projectName: string
  category: string
  notes?: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Document Approved</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
    .content { padding: 40px 30px; }
    .success-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
    .document-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .button { display: inline-block; background: #10b981; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Document Approved</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${data.clientName}</strong>,</p>
      <p>Great news! Your uploaded document has been approved.</p>
      
      <div class="success-box">
        <p><strong>✓ Your ${data.category} has been approved</strong></p>
        <p>The document is now part of your project and will be used by our team.</p>
      </div>
      
      <div class="document-info">
        <p><strong>Document Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${data.documentName}</li>
          <li><strong>Project:</strong> ${data.projectName}</li>
          <li><strong>Category:</strong> ${data.category}</li>
        </ul>
      </div>
      
      ${data.notes ? `
      <div class="document-info">
        <p><strong>Admin Notes:</strong></p>
        <p>${data.notes}</p>
      </div>
      ` : ''}
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard" class="button">
          View Your Projects
        </a>
      </div>
      
      <p>Thank you for your contribution to the project!</p>
      
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
