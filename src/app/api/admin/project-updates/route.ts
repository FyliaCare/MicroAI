import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin/project-updates - Create a project update
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check

    const body = await request.json()
    const { 
      projectId, 
      title, 
      content, 
      type = 'progress', 
      isPublic = true,
      progressBefore,
      progressAfter,
      sendEmail = true 
    } = body

    if (!projectId || !title || !content) {
      return NextResponse.json(
        { success: false, error: 'Project ID, title, and content are required' },
        { status: 400 }
      )
    }

    // Get project with client
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Create update
    const update = await prisma.projectUpdate.create({
      data: {
        projectId,
        title,
        content,
        type,
        isPublic,
        progressBefore: progressBefore || project.progress || 0,
        progressAfter: progressAfter || project.progress || 0,
      },
    })

    // Update project progress if changed
    if (progressAfter !== undefined && progressAfter !== project.progress) {
      await prisma.project.update({
        where: { id: projectId },
        data: { progress: progressAfter },
      })
    }

    // Create client notification
    if (project.client) {
      await prisma.notification.create({
        data: {
          type: 'project-update',
          title: `Project Update: ${project.name}`,
          message: title,
          link: `/client/project/${projectId}?tab=updates`,
          priority: type === 'issue' ? 'high' : 'normal',
          entityType: 'Project',
          entityId: projectId,
        },
      })
    }

    // Send email notification
    if (sendEmail && project.client?.user) {
      await prisma.emailQueue.create({
        data: {
          to: project.client.user.email,
          subject: `Project Update: ${project.name}`,
          htmlContent: generateUpdateEmail({
            clientName: project.client.name,
            projectName: project.name,
            updateTitle: title,
            updateContent: content,
            updateType: type,
            progressBefore: progressBefore || project.progress || 0,
            progressAfter: progressAfter || project.progress || 0,
            projectId,
          }),
          templateType: 'project-update',
          priority: type === 'issue' ? 'high' : 'normal',
          userId: project.client.userId,
          clientId: project.clientId,
        },
      })

      // Mark email as sent
      await prisma.projectUpdate.update({
        where: { id: update.id },
        data: { emailSent: true },
      })
    }

    // Create activity feed
    await prisma.activityFeed.create({
      data: {
        type: 'project-updated',
        title: 'Project Update Posted',
        description: title,
        actorType: 'admin',
        actorId: 'admin', // TODO: Use actual admin ID
        actorName: 'Admin',
        targetType: 'project',
        targetId: projectId,
        targetName: project.name,
        isPublic,
        clientId: project.clientId,
        icon: type === 'milestone' ? '🎯' : type === 'issue' ? '⚠️' : '📢',
        color: type === 'milestone' ? '#8b5cf6' : type === 'issue' ? '#ef4444' : '#3b82f6',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Project update created successfully',
      update: {
        id: update.id,
        title: update.title,
        type: update.type,
        createdAt: update.createdAt,
      },
    })
  } catch (error) {
    console.error('Create project update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create project update',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/admin/project-updates - Get project updates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    // TODO: Add admin authentication check

    const where: any = {}
    if (projectId) {
      where.projectId = projectId
    }

    const updates = await prisma.projectUpdate.findMany({
      where,
      include: {
        readBy: {
          select: {
            userId: true,
            readAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get all unique project IDs
    const projectIds = [...new Set(updates.map(u => u.projectId))]
    
    // Fetch all projects
    const projects = await prisma.project.findMany({
      where: { id: { in: projectIds } },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Create a map for quick lookup
    const projectMap = new Map(projects.map(p => [p.id, p]))

    return NextResponse.json({
      success: true,
      updates: updates.map((update) => {
        const project = projectMap.get(update.projectId)
        return {
          id: update.id,
          title: update.title,
          content: update.content,
          type: update.type,
          isPublic: update.isPublic,
          progressBefore: update.progressBefore,
          progressAfter: update.progressAfter,
          emailSent: update.emailSent,
          projectId: update.projectId,
          projectName: project?.name || 'Unknown Project',
          clientName: project?.client?.name || 'Unknown Client',
          readCount: update.readBy.length,
          createdAt: update.createdAt,
        }
      }),
    })
  } catch (error) {
    console.error('Get project updates error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch project updates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateUpdateEmail(data: {
  clientName: string
  projectName: string
  updateTitle: string
  updateContent: string
  updateType: string
  progressBefore: number
  progressAfter: number
  projectId: string
}): string {
  const typeColors: Record<string, string> = {
    progress: '#3b82f6',
    milestone: '#8b5cf6',
    issue: '#ef4444',
    completed: '#10b981',
  }

  const typeLabels: Record<string, string> = {
    progress: '📢 Progress Update',
    milestone: '🎯 Milestone Reached',
    issue: '⚠️ Important Notice',
    completed: '✅ Completed',
  }

  const progressChanged = data.progressAfter !== data.progressBefore

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Project Update</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, ${typeColors[data.updateType] || '#3b82f6'} 0%, #1e40af 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
    .content { padding: 40px 30px; }
    .update-box { background: #f8f9fa; border-left: 4px solid ${typeColors[data.updateType] || '#3b82f6'}; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .progress-bar { width: 100%; background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
    .progress-fill { height: 100%; background: ${typeColors[data.updateType] || '#3b82f6'}; transition: width 0.3s ease; }
    .button { display: inline-block; background: ${typeColors[data.updateType] || '#3b82f6'}; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${typeLabels[data.updateType] || '📢 Project Update'}</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">${data.projectName}</p>
    </div>
    <div class="content">
      <p>Hi <strong>${data.clientName}</strong>,</p>
      <p>We have a new update on your project:</p>
      
      <div class="update-box">
        <h2 style="margin-top: 0; color: ${typeColors[data.updateType] || '#3b82f6'};">${data.updateTitle}</h2>
        <p>${data.updateContent.replace(/\n/g, '<br>')}</p>
      </div>
      
      ${progressChanged ? `
      <div style="margin: 30px 0;">
        <p><strong>Project Progress:</strong></p>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px;">
          <span>${data.progressBefore}%</span>
          <span>→</span>
          <span><strong>${data.progressAfter}%</strong></span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${data.progressAfter}%"></div>
        </div>
      </div>
      ` : ''}
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/project/${data.projectId}" class="button">
          View Project Details
        </a>
      </div>
      
      <p>You can view all project updates and details by logging into your client portal.</p>
      
      <p>If you have any questions or concerns, please don't hesitate to reach out.</p>
      
      <p>Best regards,<br><strong>MicroAI Systems Team</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} MicroAI Systems. All rights reserved.</p>
      <p style="font-size: 12px; margin-top: 10px;">
        You're receiving this because you're a client of MicroAI Systems.<br>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard" style="color: #3b82f6;">Manage your preferences</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
