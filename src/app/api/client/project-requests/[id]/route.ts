import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// PATCH /api/client/project-requests/[id] - Update a project request
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify token by checking if a user session exists
    const userSession = await prisma.session.findFirst({
      where: { 
        sessionToken: token,
        expires: { gt: new Date() }
      },
      include: { user: true }
    })

    if (!userSession) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const userEmail = userSession.user.email

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

    // Verify ownership (client email matches)
    if (projectRequest.clientEmail !== userEmail) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own requests' },
        { status: 403 }
      )
    }

    // Only allow editing pending or rejected requests
    if (projectRequest.status !== 'pending' && projectRequest.status !== 'rejected') {
      return NextResponse.json(
        { success: false, error: `Cannot edit ${projectRequest.status} requests` },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      projectName,
      projectType,
      description,
      requirements,
      features,
      techPreferences,
      budget,
      budgetRange,
      deadline,
      priority,
    } = body

    // Update the request
    const updatedRequest = await prisma.projectRequest.update({
      where: { id: params.id },
      data: {
        projectName,
        projectType,
        description,
        requirements,
        features: features || null,
        techPreferences: techPreferences || null,
        budget: budget ? parseFloat(budget) : null,
        budgetRange: budgetRange || null,
        deadline: deadline || null,
        priority: priority || 'normal',
        // If it was rejected, change status back to pending
        status: projectRequest.status === 'rejected' ? 'pending' : 'pending',
        rejectionReason: null, // Clear rejection reason on resubmit
        updatedAt: new Date(),
      },
    })

    // If resubmitted (was rejected), create a new notification for admin
    if (projectRequest.status === 'rejected') {
      // Get all admins
      const admins = await prisma.admin.findMany({
        where: { isActive: true },
      })

      // Create notifications for all admins
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            type: 'project_request',
            title: `Project Request Resubmitted: ${projectName}`,
            message: `${projectRequest.clientName} has resubmitted their project request (${projectRequest.requestNumber}). Click to review and approve.`,
            link: `/admin/project-requests?requestId=${params.id}`,
            priority: 'high',
            entityType: 'admin',
            entityId: admin.id,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      request: updatedRequest,
      message: projectRequest.status === 'rejected' 
        ? 'Request resubmitted successfully' 
        : 'Request updated successfully',
    })
  } catch (error) {
    console.error('Error updating project request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project request' },
      { status: 500 }
    )
  }
}
