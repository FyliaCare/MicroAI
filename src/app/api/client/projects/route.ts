import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as jwt from 'jsonwebtoken'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/client/projects - Get projects for logged-in client
// Updated: Fixed techStack parsing to handle comma-separated strings
export async function GET(request: NextRequest) {
  try {
    // Get session token from header
    const authHeader = request.headers.get('authorization')
    console.log('🔍 Projects list request - Auth header:', authHeader ? 'Present' : 'Missing')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No auth header or invalid format')
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No session token' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    console.log('🔑 Token received (first 20 chars):', token.substring(0, 20) + '...')

    let clientId: string | null = null
    let userId: string | null = null

    // Try to decode as JWT first (new format)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      console.log('✅ JWT decoded successfully:', { userId: decoded.userId, clientId: decoded.clientId, email: decoded.email })
      
      clientId = decoded.clientId
      userId = decoded.userId
    } catch (err: any) {
      console.log('⚠️  JWT decode failed, trying database lookup for old token format:', err.message)
      
      // Fallback: Try to find by sessionToken in database (old format)
      const session = await prisma.clientSession.findFirst({
        where: { 
          sessionToken: token,
          isActive: true,
          expiresAt: {
            gt: new Date()
          }
        },
        include: {
          user: {
            include: {
              client: true
            }
          },
        },
      })

      if (session?.user?.client) {
        console.log('✅ Found session in database (old format):', session.user.email)
        clientId = session.user.client.id
        userId = session.user.id
      } else {
        console.error('❌ Token is neither valid JWT nor found in database')
      }
    }

    if (!clientId || !userId) {
      console.error('❌ No clientId found - unauthorized')
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session. Please logout and login again.' },
        { status: 401 }
      )
    }

    console.log('📦 Fetching projects for client:', clientId)

    // Fetch client with projects
    const client = await prisma.client.findUnique({
      where: { id: clientId },
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
    })

    if (!client) {
      console.error('❌ Client not found')
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    const projectIds = client.projects.map((p: any) => p.id)

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
    const projects = client.projects.map((project: any) => {
      // Parse JSON fields safely
      let techStack: string[] = []
      let requirements: any = {}
      let features: any[] = []

      try {
        // Handle techStack - it's stored as comma-separated string, not JSON
        if (project.techStack) {
          if (typeof project.techStack === 'string') {
            // If it starts with '[', it's JSON array, otherwise it's comma-separated
            if (project.techStack.trim().startsWith('[')) {
              techStack = JSON.parse(project.techStack)
            } else {
              // Split by comma and trim whitespace
              techStack = project.techStack.split(',').map((t: string) => t.trim()).filter((t: string) => t)
            }
          } else if (Array.isArray(project.techStack)) {
            techStack = project.techStack
          }
        }

        // Handle requirements - safely parse JSON
        if (project.requirements) {
          if (typeof project.requirements === 'string') {
            try {
              requirements = JSON.parse(project.requirements)
            } catch {
              // If not valid JSON, treat as empty object
              requirements = {}
            }
          } else {
            requirements = project.requirements
          }
        }

        // Handle features - safely parse JSON  
        if (project.features) {
          if (typeof project.features === 'string') {
            try {
              features = JSON.parse(project.features)
            } catch {
              // If not valid JSON, treat as empty array
              features = []
            }
          } else if (Array.isArray(project.features)) {
            features = project.features
          }
        }
      } catch (e) {
        console.error('Error parsing JSON fields:', e)
        // Fallback to safe defaults
        techStack = []
        requirements = {}
        features = []
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
        id: client.id,
        name: client.name,
        email: client.email,
        company: client.company,
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
