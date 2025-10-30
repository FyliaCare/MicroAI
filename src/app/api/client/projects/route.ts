import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/client/projects - Get projects for logged-in client  
export async function GET(request: NextRequest) {
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
            client: {
              include: {
                projects: {
                  include: {
                    client: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                  orderBy: { createdAt: 'desc' },
                },
              },
            },
          },
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    // Check session expiry
    if (session.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Session expired - Please log in again' },
        { status: 401 }
      )
    }

    // Check if session is active
    if (!session.isActive) {
      return NextResponse.json(
        { success: false, error: 'Session deactivated - Please log in again' },
        { status: 401 }
      )
    }

    // Check if user has client
    if (!session.user?.client) {
      return NextResponse.json(
        { success: false, error: 'No client account found' },
        { status: 404 }
      )
    }

    const userId = session.user.id
    const clientId = session.user.client.id
    const projectIds = session.user.client.projects.map((p: any) => p.id)

    // Fetch related data for all projects in parallel
    const [updates, uploads, codeAccessRequests] = await Promise.all([
      // Get public updates
      prisma.projectUpdate.findMany({
        where: {
          projectId: { in: projectIds },
          isPublic: true,
        },
        include: {
          readBy: {
            where: { userId },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      // Get uploads
      prisma.clientUpload.findMany({
        where: {
          projectId: { in: projectIds },
          clientId,
        },
        orderBy: { createdAt: 'desc' },
      }),
      // Get code access requests
      prisma.codeAccessRequest.findMany({
        where: {
          projectId: { in: projectIds },
          userId,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    // Group data by project
    const updatesByProject = new Map<string, typeof updates>()
    const uploadsByProject = new Map<string, typeof uploads>()
    const codeAccessByProject = new Map<string, typeof codeAccessRequests>()

    updates.forEach((u) => {
      if (!updatesByProject.has(u.projectId)) {
        updatesByProject.set(u.projectId, [])
      }
      updatesByProject.get(u.projectId)!.push(u)
    })

    uploads.forEach((u) => {
      if (u.projectId) {
        if (!uploadsByProject.has(u.projectId)) {
          uploadsByProject.set(u.projectId, [])
        }
        uploadsByProject.get(u.projectId)!.push(u)
      }
    })

    codeAccessRequests.forEach((c) => {
      if (!codeAccessByProject.has(c.projectId)) {
        codeAccessByProject.set(c.projectId, [])
      }
      codeAccessByProject.get(c.projectId)!.push(c)
    })

    // Get projects with computed fields
    const projects = session.user.client.projects.map((project: any) => {
      // Parse JSON fields safely
      let techStack: string[] = []
      let requirements: any = {}
      let features: any[] = []

      try {
        techStack = project.techStack ? (typeof project.techStack === 'string' ? JSON.parse(project.techStack) : project.techStack) : []
        requirements = project.requirements ? (typeof project.requirements === 'string' ? JSON.parse(project.requirements) : project.requirements) : {}
        features = project.features ? (typeof project.features === 'string' ? JSON.parse(project.features) : project.features) : []
      } catch (e) {
        console.error('Error parsing JSON fields:', e)
      }

      // Calculate progress percentage
      const progressPercentage = project.progress || 0

      const projectUpdates = updatesByProject.get(project.id) || []
      const projectUploads = uploadsByProject.get(project.id) || []
      const projectCodeAccess = codeAccessByProject.get(project.id) || []

      // Count unread updates
      const unreadUpdates = projectUpdates.filter(
        (update) => update.readBy.length === 0
      ).length

      // Get latest code access request status
      const latestCodeAccess = projectCodeAccess[0]
      const codeAccessStatus = latestCodeAccess
        ? latestCodeAccess.status
        : 'not-requested'

      const codeAccessGranted = latestCodeAccess?.accessGranted || false

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        type: project.type,
        status: project.status,
        priority: project.priority,
        progress: progressPercentage,
        startDate: project.startDate,
        deadline: project.deadline,
        techStack,
        requirements,
        features,
        githubRepo: project.githubRepo,
        liveUrl: project.liveUrl,
        stagingUrl: project.stagingUrl,

        // Computed fields
        unreadUpdates,
        totalUploads: projectUploads.length,
        codeAccessStatus,
        codeAccessGranted,

        // Related data (limited)
        recentUpdates: projectUpdates.slice(0, 3).map((update) => ({
          id: update.id,
          title: update.title,
          type: update.type,
          createdAt: update.createdAt,
          isRead: update.readBy.length > 0,
        })),

        // Client info
        client: project.client,

        // Timestamps
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }
    })

    // Calculate overall stats
    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter((p: any) => p.status === 'in-progress').length,
      completedProjects: projects.filter((p: any) => p.status === 'completed').length,
      totalUnreadUpdates: projects.reduce((sum: number, p: any) => sum + p.unreadUpdates, 0),
      totalUploads: projects.reduce((sum: number, p: any) => sum + p.totalUploads, 0),
    }

    return NextResponse.json({
      success: true,
      projects,
      stats,
      client: {
        id: session.user.client.id,
        name: session.user.client.name,
        email: session.user.client.email,
        company: session.user.client.company,
      },
    })
  } catch (error) {
    console.error('Get client projects error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
