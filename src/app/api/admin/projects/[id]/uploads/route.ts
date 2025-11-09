import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'projects', projectId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${sanitizedFilename}`
    const filepath = join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Create database record
    const fileUrl = `/uploads/projects/${projectId}/${filename}`
    const projectFile = await prisma.projectFile.create({
      data: {
        projectId,
        filename: file.name,
        fileUrl,
        fileSize: file.size,
        fileType: file.type,
        description: description || undefined,
        uploadedBy: session.user.name || 'Admin',
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

    // Merge both types into a single array
    const allFiles = [
      ...projectFiles.map((file) => ({
        id: file.id,
        filename: file.filename,
        fileUrl: file.fileUrl,
        fileSize: file.fileSize,
        fileType: file.fileType,
        description: file.description,
        uploadedAt: file.uploadedAt,
        uploadedBy: file.uploadedBy,
        source: 'admin',
      })),
      ...clientUploads.map((upload) => ({
        id: upload.id,
        filename: upload.originalName,
        fileUrl: upload.fileUrl,
        fileSize: upload.fileSize,
        fileType: upload.mimeType,
        description: upload.description,
        uploadedAt: upload.createdAt,
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
