import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import * as jwt from 'jsonwebtoken'

// POST /api/client/projects/[id]/uploads - Upload file for project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    
    let clientId: string | null = null
    let userId: string | null = null
    let clientName: string | null = null

    // Try JWT decode first (new format)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      clientId = decoded.clientId
      userId = decoded.userId
      
      // Get client name
      const client = await prisma.client.findUnique({
        where: { id: clientId },
      })
      clientName = client?.name || 'Client'
    } catch (err) {
      // Fallback: database lookup (old format)
      const session = await prisma.clientSession.findFirst({
        where: { 
          sessionToken: token,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
        include: {
          user: {
            include: {
              client: true,
            },
          },
        },
      })

      if (session?.user?.client) {
        clientId = session.user.client.id
        userId = session.user.id
        clientName = session.user.client.name
      }
    }

    if (!clientId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    // Verify client owns this project
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        clientId: clientId,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'clients', clientId, params.id)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${safeFileName}`
    const filePath = join(uploadDir, fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create database record
    const upload = await prisma.clientUpload.create({
      data: {
        name: fileName,
        originalName: file.name,
        description: description || null,
        category: 'project-file',
        fileUrl: `/uploads/clients/${clientId}/${params.id}/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
        format: file.name.split('.').pop() || '',
        projectId: params.id,
        clientId: clientId,
        uploadedBy: clientId,
        uploadedByRole: 'client',
      },
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'new-upload',
        title: `New file uploaded to ${project.name}`,
        message: `${clientName} uploaded ${file.name}`,
        link: `/admin/projects?projectId=${params.id}`,
        priority: 'medium',
        entityType: 'Project',
        entityId: params.id,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Uploaded File',
        entity: 'Project',
        entityId: params.id,
        description: `Client ${clientName} uploaded ${file.name}`,
        metadata: JSON.stringify({
          uploadId: upload.id,
          fileName: file.name,
          fileSize: file.size,
          clientId: session.user.client.id,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      upload: {
        id: upload.id,
        fileName: upload.originalName,
        filePath: upload.fileUrl,
        fileSize: upload.fileSize,
        fileType: upload.mimeType,
        description: upload.description,
        createdAt: upload.createdAt,
      },
    })
  } catch (error) {
    console.error('Upload file error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// GET /api/client/projects/[id]/uploads - Get uploads for project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    
    let clientId: string | null = null

    // Try JWT decode first (new format)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      clientId = decoded.clientId
    } catch (err) {
      // Fallback: database lookup (old format)
      const session = await prisma.clientSession.findFirst({
        where: { 
          sessionToken: token,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
        include: {
          user: {
            include: {
              client: true,
            },
          },
        },
      })

      if (session?.user?.client) {
        clientId = session.user.client.id
      }
    }

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    // Verify client owns this project
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        clientId: clientId,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Get all uploads for this project
    const uploads = await prisma.clientUpload.findMany({
      where: {
        projectId: params.id,
        clientId: clientId,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      uploads: uploads.map((upload) => ({
        id: upload.id,
        fileName: upload.originalName,
        filePath: upload.fileUrl,
        fileSize: upload.fileSize,
        fileType: upload.mimeType,
        description: upload.description,
        createdAt: upload.createdAt,
      })),
    })
  } catch (error) {
    console.error('Get uploads error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch uploads' },
      { status: 500 }
    )
  }
}
