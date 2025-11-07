import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verify } from 'jsonwebtoken'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try NextAuth session first
    let session = await getServerSession(authOptions)
    let clientId: string | null = null

    // If no NextAuth session, try Bearer token
    if (!session) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        try {
          const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
          if (decoded.clientId) {
            clientId = decoded.clientId
          }
        } catch (err) {
          return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
          )
        }
      }
    } else if (session.user.role === 'CLIENT') {
      // Find client from NextAuth session
      const client = await prisma.client.findUnique({
        where: { userId: session.user.id },
      })
      if (client) {
        clientId = client.id
      }
    }

    if (!clientId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch the project
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        clientId: clientId, // Ensure client can only see their own projects
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const projectData = {
      ...project,
      techStack: project.techStack ? project.techStack.split(',').map(t => t.trim()) : [],
    }

    return NextResponse.json({ project: projectData })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}
