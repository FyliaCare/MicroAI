import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify client JWT token
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    let decoded: any

    try {
      decoded = verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get project with client info
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        client: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Verify this client owns this project
    if (project.clientId !== decoded.clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create notification for all admins
    await prisma.notification.create({
      data: {
        type: 'file_upload',
        title: 'New Files Uploaded',
        message: `${project.client?.name || 'A client'} has uploaded files to Google Drive for project "${project.name}".`,
        link: `/admin/projects/${project.id}?tab=files`,
        priority: 'normal',
        entityType: 'Project',
        entityId: project.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin notified successfully',
    })
  } catch (error) {
    console.error('Error notifying admin:', error)
    return NextResponse.json(
      { error: 'Failed to notify admin' },
      { status: 500 }
    )
  }
}
