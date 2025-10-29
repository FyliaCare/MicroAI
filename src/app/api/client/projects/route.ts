import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
                    updates: {
                      where: { isPublic: true },
                      orderBy: { createdAt: 'desc' },
                      take: 5,
                      include: {
                        readBy: {
                          where: {
                            userId: undefined, // Will be set below
                          },
                        },
                      },
                    },
                    uploads: {
                      where: {
                        OR: [
                          { uploadedById: undefined }, // Will be set below
                          { isApproved: true },
                        ],
                      },
                      orderBy: { createdAt: 'desc' },
                    },
                    codeAccessRequests: {
                      orderBy: { createdAt: 'desc' },
                      take: 1,
                    },
                    githubIntegration: true,
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
    if (!session.user.client) {
      return NextResponse.json(
        { success: false, error: 'No client account found' },
        { status: 404 }
      )
    }

    // Get projects with computed fields
    const projects = session.user.client.projects.map((project) => {
      // Parse JSON fields
      const techStack = project.techStack ? JSON.parse(project.techStack) : []
      const requirements = project.requirements ? JSON.parse(project.requirements) : {}
      const features = project.features ? JSON.parse(project.features) : []

      // Calculate progress percentage
      const progressPercentage = project.progress || 0

      // Count unread updates
      const unreadUpdates = project.updates.filter(
        (update) => !update.readBy.some((read) => read.userId === session.user.id)
      ).length

      // Get latest code access request status
      const latestCodeAccess = project.codeAccessRequests[0]
      const codeAccessStatus = latestCodeAccess
        ? latestCodeAccess.status
        : 'not-requested'

      // Count uploads
      const totalUploads = project.uploads.length

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        type: project.type,
        status: project.status,
        priority: project.priority,
        progress: progressPercentage,
        
        // Timeline
        startDate: project.startDate,
        endDate: project.endDate,
        deadline: project.deadline,
        completedAt: project.completedAt,
        
        // Technical
        techStack,
        liveUrl: project.liveUrl,
        stagingUrl: project.stagingUrl,
        demoUrl: project.demoUrl,
        
        // Project details
        requirements,
        features,
        
        // URLs (only if code access granted)
        githubRepo: latestCodeAccess?.status === 'approved' ? project.githubRepo : null,
        
        // Stats
        unreadUpdates,
        totalUploads,
        codeAccessStatus,
        hasGithubIntegration: !!project.githubIntegration,
        
        // Recent updates (limited)
        recentUpdates: project.updates.slice(0, 3).map((update) => ({
          id: update.id,
          title: update.title,
          type: update.type,
          createdAt: update.createdAt,
          isRead: update.readBy.some((read) => read.userId === session.user.id),
        })),
        
        // Metadata
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }
    })

    // Get overall stats
    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === 'in-progress').length,
      completedProjects: projects.filter((p) => p.status === 'completed').length,
      totalUnreadUpdates: projects.reduce((sum, p) => sum + p.unreadUpdates, 0),
      totalUploads: projects.reduce((sum, p) => sum + p.totalUploads, 0),
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
