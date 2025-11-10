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

// POST - Simple, production-ready upload
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    let clientId: string
    let clientName = 'Client'

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      clientId = decoded.clientId
      
      const client = await prisma.client.findUnique({ where: { id: clientId } })
      if (client) clientName = client.name
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // 2. Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: params.id, clientId },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // 3. Parse file
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
    }

    // 4. Upload to Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const dataURI = `data:${file.type};base64,${buffer.toString('base64')}`

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: `microai-projects/${project.name}/client-uploads`,
      resource_type: 'auto',
    })

    // 5. Save to database
    const upload = await prisma.clientUpload.create({
      data: {
        name: file.name,
        originalName: file.name,
        fileUrl: uploadResponse.secure_url,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        format: file.name.split('.').pop() || '',
        projectId: params.id,
        clientId,
        uploadedBy: clientId,
        uploadedByRole: 'client',
        cloudinaryId: uploadResponse.public_id,
      },
    })

    // 6. Create notification
    await prisma.notification.create({
      data: {
        type: 'new-upload',
        title: `New file: ${project.name}`,
        message: `${clientName} uploaded ${file.name}`,
        link: `/admin/projects/${params.id}`,
        priority: 'medium',
        entityType: 'Project',
        entityId: params.id,
      },
    })

    return NextResponse.json({
      success: true,
      upload: {
        id: upload.id,
        fileName: upload.originalName,
        fileUrl: upload.fileUrl,
        fileSize: upload.fileSize,
        fileType: upload.mimeType,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}

// GET - Fetch uploads
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    let clientId: string

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      clientId = decoded.clientId
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: { id: params.id, clientId },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const uploads = await prisma.clientUpload.findMany({
      where: { projectId: params.id, clientId },
      orderBy: { createdAt: 'desc' },
    })

    const validUploads = uploads
      .filter(u => u.fileUrl.startsWith('http'))
      .map(u => ({
        id: u.id,
        filename: u.originalName,
        fileUrl: u.fileUrl,
        fileSize: u.fileSize,
        fileType: u.mimeType,
        uploadedAt: u.createdAt.toISOString(),
        uploaderName: 'Client',
        uploaderRole: 'Client',
      }))

    return NextResponse.json({ success: true, uploads: validUploads, files: validUploads })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// DELETE - Remove upload
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 })
    }

    const token = authHeader.split('Bearer ')[1]
    let clientId: string

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      clientId = decoded.clientId
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const upload = await prisma.clientUpload.findFirst({
      where: { id: fileId, projectId: params.id, clientId },
    })

    if (!upload) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    if (upload.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(upload.cloudinaryId)
      } catch (err) {
        console.error('Cloudinary delete failed:', err)
      }
    }

    await prisma.clientUpload.delete({ where: { id: fileId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
