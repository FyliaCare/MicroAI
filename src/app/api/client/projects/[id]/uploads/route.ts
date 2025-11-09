import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'
import * as jwt from 'jsonwebtoken'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
      
      // Get client name (only if clientId exists)
      if (clientId) {
        const client = await prisma.client.findUnique({
          where: { id: clientId },
        })
        clientName = client?.name || 'Client'
      }
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

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    console.log('📤 Client uploading file to Cloudinary...')
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: `microai-projects/${project.name}/client-uploads`,
      resource_type: 'auto',
      public_id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
    })

    console.log('✅ File uploaded to Cloudinary:', uploadResponse.public_id)

    // Create database record
    const upload = await prisma.clientUpload.create({
      data: {
        name: file.name,
        originalName: file.name,
        description: description || null,
        category: 'project-file',
        fileUrl: uploadResponse.secure_url, // Cloudinary secure URL
        fileSize: file.size,
        mimeType: file.type,
        format: file.name.split('.').pop() || '',
        projectId: params.id,
        clientId: clientId,
        uploadedBy: clientId,
        uploadedByRole: 'client',
        cloudinaryId: uploadResponse.public_id, // Store for deletion
      },
    })

    console.log('✅ Client file uploaded successfully:', {
      id: upload.id,
      filename: upload.originalName,
      size: upload.fileSize,
      project: params.id,
      client: clientId
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'new-upload',
        title: `New file uploaded to ${project.name}`,
        message: `${clientName} uploaded ${file.name}`,
        link: `/admin/projects/${params.id}`,
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
          clientId: clientId,
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

    console.log('📁 Client uploads fetched:', {
      project: params.id,
      client: clientId,
      count: uploads.length
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
