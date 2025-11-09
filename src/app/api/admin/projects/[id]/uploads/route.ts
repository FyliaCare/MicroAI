import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = params.id

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const description = formData.get('description') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 })
    }

    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    console.log('📤 Uploading file to Cloudinary...')
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: `microai-projects/${project.name}`,
      resource_type: 'auto',
      public_id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
    })

    console.log('✅ File uploaded to Cloudinary:', uploadResponse.public_id)

    // Create database record with Cloudinary URLs
    const projectFile = await prisma.projectFile.create({
      data: {
        projectId,
        filename: file.name,
        fileUrl: uploadResponse.secure_url, // Cloudinary secure URL
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        description: description || undefined,
        uploadedBy: session.user.name || 'Admin',
        driveFileId: uploadResponse.public_id, // Store Cloudinary public_id for deletion
      },
    })

    console.log('✅ File uploaded successfully:', {
      id: projectFile.id,
      filename: projectFile.filename,
      size: projectFile.fileSize,
      project: projectId
    })

    return NextResponse.json({
      success: true,
      file: projectFile,
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = params.id

    // Fetch from BOTH tables - admin uploads AND client uploads
    const [projectFiles, clientUploads] = await Promise.all([
      // Admin uploaded files
      prisma.projectFile.findMany({
        where: { projectId },
        orderBy: { uploadedAt: 'desc' },
      }),
      // Client uploaded files
      prisma.clientUpload.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    console.log('📁 Files fetched for project:', projectId)
    console.log('  - Admin files:', projectFiles.length)
    console.log('  - Client files:', clientUploads.length)

    // Log individual files for debugging
    if (projectFiles.length > 0) {
      console.log('  Admin files details:')
      projectFiles.forEach((f, i) => console.log(`    ${i + 1}. ${f.filename}`))
    }
    if (clientUploads.length > 0) {
      console.log('  Client files details:')
      clientUploads.forEach((f, i) => console.log(`    ${i + 1}. ${f.originalName}`))
    }

    // Merge both types into a single array
    const allFiles = [
      ...projectFiles.map((file) => ({
        id: file.id,
        filename: file.filename,
        fileUrl: file.fileUrl,
        fileSize: file.fileSize,
        fileType: file.fileType || 'application/octet-stream',
        description: file.description || null,
        uploadedAt: file.uploadedAt.toISOString(),
        uploadedBy: file.uploadedBy || 'Admin',
        source: 'admin',
      })),
      ...clientUploads.map((upload) => ({
        id: upload.id,
        filename: upload.originalName,
        fileUrl: upload.fileUrl,
        fileSize: upload.fileSize,
        fileType: upload.mimeType || 'application/octet-stream',
        description: upload.description || null,
        uploadedAt: upload.createdAt.toISOString(),
        uploadedBy: 'Client',
        source: 'client',
      })),
    ]

    // Sort by upload date (newest first)
    allFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    console.log('📦 Total files merged:', allFiles.length)
    console.log('📤 Returning files to frontend')

    return NextResponse.json({ files: allFiles })
  } catch (error) {
    console.error('Fetch files error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}
