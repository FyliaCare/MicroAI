import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'

// POST route disabled - file uploads now handled via Google Drive
// Admin configures Google Drive link, clients upload directly to Google Drive
export async function POST() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'File uploads are now handled via Google Drive. Please configure Google Drive settings in project settings.' 
    }, 
    { status: 410 }
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session - must pass request for App Router
    const session = await getServerSession(authOptions)
    
    console.log('🔍 GET /uploads - Session check:', {
      hasSession: !!session,
      userRole: session?.user?.role,
      userEmail: session?.user?.email
    })
    
    if (!session || !['ADMIN', 'super-admin'].includes(session.user.role)) {
      console.log('❌ GET /uploads - Auth failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ GET /uploads - Auth passed')
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
        uploaderName: file.uploadedBy || 'Admin',
        uploaderRole: file.uploadedBy.includes('Client') ? 'Client' : 'Admin',
      })),
      ...clientUploads.map((upload) => ({
        id: upload.id,
        filename: upload.originalName,
        fileUrl: upload.fileUrl,
        fileSize: upload.fileSize,
        fileType: upload.mimeType || 'application/octet-stream',
        description: upload.description || null,
        uploadedAt: upload.createdAt.toISOString(),
        uploaderName: 'Client',
        uploaderRole: 'Client',
      })),
    ]

    // Filter out legacy files with local paths (only keep Cloudinary URLs)
    const validFiles = allFiles.filter(file => {
      const isCloudinary = file.fileUrl.startsWith('http://') || file.fileUrl.startsWith('https://')
      if (!isCloudinary) {
        console.log(`⚠️ Skipping legacy file with local path: ${file.filename}`)
      }
      return isCloudinary
    })

    // Sort by upload date (newest first)
    validFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    console.log('📦 Total files merged:', allFiles.length)
    console.log('✅ Valid Cloudinary files:', validFiles.length)
    console.log('⚠️ Legacy files filtered:', allFiles.length - validFiles.length)
    console.log('📤 Returning files to frontend')

    return NextResponse.json({ files: validFiles })
  } catch (error) {
    console.error('Fetch files error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}
