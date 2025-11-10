import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'
import * as jwt from 'jsonwebtoken'

// Cloudinary automatically reads from environment variables:
// CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// No manual config needed if env vars are set correctly

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
    const dataURI = `data:${file.type || 'application/octet-stream'};base64,${base64}`

    // Upload to Cloudinary
    console.log('📤 Client uploading file to Cloudinary...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    })
    
    // Sanitize project name for Cloudinary folder (alphanumeric only)
    const sanitizedProjectName = project.name
      .replace(/[^a-zA-Z0-9]+/g, '_')  // Replace ANY non-alphanumeric chars with underscore
      .replace(/_+/g, '_')  // Replace multiple underscores with single
      .replace(/^_|_$/g, '')  // Remove leading/trailing underscores
    
    console.log('🔧 Cloudinary upload config:', {
      folder: `microai-projects/${sanitizedProjectName}/client-uploads`,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKeyLength: process.env.CLOUDINARY_API_KEY?.length,
      apiSecretLength: process.env.CLOUDINARY_API_SECRET?.length,
    })
    
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: `microai-projects/${sanitizedProjectName}/client-uploads`,
      resource_type: 'auto',
      public_id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
    })

    console.log('✅ File uploaded to Cloudinary:', uploadResponse.public_id)

    // Create database record in ProjectFile (same as admin uploads)
    const upload = await prisma.projectFile.create({
      data: {
        projectId: params.id,
        filename: file.name,
        fileUrl: uploadResponse.secure_url, // Cloudinary secure URL
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        description: description || undefined,
        uploadedBy: clientName || 'Client',
        cloudinaryId: uploadResponse.public_id, // Store for deletion
      },
    })

    console.log('✅ Client file uploaded successfully:', {
      id: upload.id,
      filename: upload.filename,
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
      file: upload,
      upload: {
        id: upload.id,
        fileName: upload.filename,
        filePath: upload.fileUrl,
        fileSize: upload.fileSize,
        fileType: upload.fileType,
        description: upload.description,
        createdAt: upload.uploadedAt,
      },
    })
  } catch (error) {
    console.error('❌ Upload file error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload file',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      },
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

    // Get all files for this project (both admin and client uploads)
    const projectFiles = await prisma.projectFile.findMany({
      where: {
        projectId: params.id,
      },
      orderBy: { uploadedAt: 'desc' },
    })

    // Map to consistent response format
    const uploads = projectFiles.map((file) => ({
      id: file.id,
      filename: file.filename,
      fileUrl: file.fileUrl,
      fileSize: file.fileSize,
      fileType: file.fileType,
      description: file.description,
      uploadedAt: file.uploadedAt.toISOString(),
      uploaderName: file.uploadedBy,
      uploaderRole: file.uploadedBy.toLowerCase().includes('client') ? 'Client' : 'Admin',
    }))

    console.log('📁 Client uploads fetched:', {
      project: params.id,
      client: clientId,
      total: uploads.length,
    })

    return NextResponse.json({
      success: true,
      uploads: uploads,
      files: uploads, // Dual response for compatibility
    })
  } catch (error) {
    console.error('Get uploads error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch uploads' },
      { status: 500 }
    )
  }
}

// DELETE /api/client/projects/[id]/uploads - Delete a file
export async function DELETE(
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
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      )
    }

    let clientId: string | null = null

    // Try JWT decode first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      clientId = decoded.clientId
    } catch (err) {
      // Fallback to session lookup
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

    // Try to find in ProjectFile table
    const projectFile = await prisma.projectFile.findFirst({
      where: {
        id: fileId,
        projectId: params.id,
      },
    })

    if (!projectFile) {
      return NextResponse.json(
        { success: false, error: 'File not found or access denied' },
        { status: 404 }
      )
    }

    // Delete from Cloudinary
    if (projectFile.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(projectFile.cloudinaryId)
        console.log('🗑️ Deleted from Cloudinary:', projectFile.cloudinaryId)
      } catch (err) {
        console.error('⚠️ Failed to delete from Cloudinary:', err)
      }
    }

    // Delete from database
    await prisma.projectFile.delete({
      where: { id: fileId },
    })

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
