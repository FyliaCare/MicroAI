import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// POST /api/client/uploads - Upload a document
export async function POST(request: NextRequest) {
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
            client: true,
          },
        },
      },
    })

    if (!session || session.expiresAt < new Date() || !session.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    if (!session.user.client) {
      return NextResponse.json(
        { success: false, error: 'No client account found' },
        { status: 404 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string
    const category = formData.get('category') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const colorPalette = formData.get('colorPalette') as string | null

    if (!file || !projectId || !category || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['logo', 'brand-colors', 'flyer', 'image', 'document']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Verify project belongs to client
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: session.user.client.id,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const safeFileName = `${category}_${timestamp}.${extension}`
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', projectId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const filePath = join(uploadDir, safeFileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create database record
    const upload = await prisma.clientUpload.create({
      data: {
        name,
        description,
        fileName: file.name,
        fileUrl: `/uploads/${projectId}/${safeFileName}`,
        fileSize: file.size,
        mimeType: file.type,
        category,
        version: 1,
        projectId,
        clientId: session.user.client.id,
        uploadedById: session.user.id,
        colorPalette: colorPalette ? JSON.parse(colorPalette) : null,
      },
    })

    // Create admin notification
    await prisma.notification.create({
      data: {
        type: 'upload',
        title: 'New Document Uploaded',
        message: `${session.user.client.name} uploaded a new ${category} for ${project.name}`,
        link: `/admin/projects/${projectId}?tab=documents`,
        priority: 'normal',
      },
    })

    // Create activity feed entry
    await prisma.activityFeed.create({
      data: {
        type: 'document-uploaded',
        title: 'Document Uploaded',
        description: `${name} (${category})`,
        actorType: 'client',
        actorId: session.user.client.id,
        actorName: session.user.client.name,
        targetType: 'project',
        targetId: projectId,
        targetName: project.name,
        isPublic: true,
        clientId: session.user.client.id,
        icon: '📎',
        color: '#8b5cf6',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      upload: {
        id: upload.id,
        name: upload.name,
        fileUrl: upload.fileUrl,
        category: upload.category,
        fileSize: upload.fileSize,
        createdAt: upload.createdAt,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/client/uploads - Get uploads for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID required' },
        { status: 400 }
      )
    }

    // Get session token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
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
            client: true,
          },
        },
      },
    })

    if (!session || session.expiresAt < new Date() || !session.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    if (!session.user.client) {
      return NextResponse.json(
        { success: false, error: 'No client account found' },
        { status: 404 }
      )
    }

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: session.user.client.id,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Get uploads
    const uploads = await prisma.clientUpload.findMany({
      where: {
        projectId,
        clientId: session.user.client.id,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        approvedByUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Format uploads
    const formattedUploads = uploads.map((upload) => ({
      id: upload.id,
      name: upload.name,
      description: upload.description,
      fileName: upload.fileName,
      fileUrl: upload.fileUrl,
      fileSize: upload.fileSize,
      mimeType: upload.mimeType,
      category: upload.category,
      version: upload.version,
      isApproved: upload.isApproved,
      approvedBy: upload.approvedByUser?.name || null,
      approvedAt: upload.approvedAt,
      colorPalette: upload.colorPalette,
      createdAt: upload.createdAt,
    }))

    // Group by category
    const groupedByCategory = formattedUploads.reduce((acc, upload) => {
      if (!acc[upload.category]) {
        acc[upload.category] = []
      }
      acc[upload.category].push(upload)
      return acc
    }, {} as Record<string, typeof formattedUploads>)

    return NextResponse.json({
      success: true,
      uploads: formattedUploads,
      groupedByCategory,
      stats: {
        total: formattedUploads.length,
        approved: formattedUploads.filter((u) => u.isApproved).length,
        pending: formattedUploads.filter((u) => !u.isApproved).length,
      },
    })
  } catch (error) {
    console.error('Get uploads error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch uploads',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/client/uploads - Delete an upload
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const uploadId = searchParams.get('id')

    if (!uploadId) {
      return NextResponse.json(
        { success: false, error: 'Upload ID required' },
        { status: 400 }
      )
    }

    // Get session token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
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
            client: true,
          },
        },
      },
    })

    if (!session || session.expiresAt < new Date() || !session.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    if (!session.user.client) {
      return NextResponse.json(
        { success: false, error: 'No client account found' },
        { status: 404 }
      )
    }

    // Get upload
    const upload = await prisma.clientUpload.findFirst({
      where: {
        id: uploadId,
        clientId: session.user.client.id,
        uploadedById: session.user.id,
      },
    })

    if (!upload) {
      return NextResponse.json(
        { success: false, error: 'Upload not found or access denied' },
        { status: 404 }
      )
    }

    // Can't delete if already approved
    if (upload.isApproved) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete approved documents' },
        { status: 403 }
      )
    }

    // Delete from database
    await prisma.clientUpload.delete({
      where: { id: uploadId },
    })

    // TODO: Delete physical file (optional - keep for audit trail)

    return NextResponse.json({
      success: true,
      message: 'Upload deleted successfully',
    })
  } catch (error) {
    console.error('Delete upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete upload',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
