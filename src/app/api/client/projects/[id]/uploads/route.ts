import { NextRequest, NextResponse } from 'next/server'

// FILE UPLOAD TEMPORARILY DISABLED
// Feature disabled due to production issues - will be re-implemented

// POST /api/client/projects/[id]/uploads - Upload file for project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('\n🚀 ========== CLIENT UPLOAD REQUEST START ==========')
  console.log('📍 Project ID:', params.id)
  console.log('🕐 Timestamp:', new Date().toISOString())
  
  try {
    // Step 1: Check authorization header
    console.log('🔐 Step 1: Checking authorization header...')
    const authHeader = request.headers.get('authorization')
    console.log('   Auth header present:', !!authHeader)
    console.log('   Auth header value:', authHeader ? authHeader.substring(0, 30) + '...' : 'null')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Auth header missing or invalid format')
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    console.log('✅ Token extracted, length:', token.length)
    
    let clientId: string | null = null
    let userId: string | null = null
    let clientName: string | null = null

    // Step 2: Verify JWT token
    console.log('🔑 Step 2: Verifying JWT token...')
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      console.log('✅ JWT verified successfully')
      console.log('   Decoded payload:', { userId: decoded.userId, clientId: decoded.clientId, email: decoded.email })
      
      clientId = decoded.clientId
      userId = decoded.userId
      
      // Get client name (only if clientId exists)
      if (clientId) {
        console.log('👤 Fetching client details...')
        const client = await prisma.client.findUnique({
          where: { id: clientId },
        })
        clientName = client?.name || 'Client'
        console.log('   Client name:', clientName)
      }
    } catch (jwtErr) {
      console.log('⚠️ JWT verification failed, trying session lookup...')
      console.log('   JWT error:', jwtErr instanceof Error ? jwtErr.message : 'Unknown')
      
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
        console.log('✅ Session found in database')
        clientId = session.user.client.id
        userId = session.user.id
        clientName = session.user.client.name
      } else {
        console.log('❌ No valid session found in database')
      }
    }

    if (!clientId || !userId) {
      console.log('❌ Auth failed: clientId or userId missing')
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }
    
    console.log('✅ Step 2 complete: User authenticated')
    console.log('   Client ID:', clientId)
    console.log('   User ID:', userId)
    console.log('   Client Name:', clientName)

    // Step 3: Verify project ownership
    console.log('📁 Step 3: Verifying project ownership...')
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        clientId: clientId,
      },
    })

    if (!project) {
      console.log('❌ Project not found or access denied')
      console.log('   Project ID:', params.id)
      console.log('   Client ID:', clientId)
      return NextResponse.json(
        { success: false, error: 'Project not found or access denied' },
        { status: 404 }
      )
    }
    
    console.log('✅ Step 3 complete: Project verified')
    console.log('   Project name:', project.name)

    // Step 4: Parse form data
    console.log('📦 Step 4: Parsing form data...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const description = formData.get('description') as string
    
    console.log('   File object:', file ? 'Present' : 'Missing')
    if (file) {
      console.log('   File name:', file.name)
      console.log('   File size:', file.size, 'bytes')
      console.log('   File type:', file.type)
    }

    if (!file) {
      console.log('❌ No file in form data')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Step 5: Validate file size
    console.log('⚖️ Step 5: Validating file size...')
    const maxSize = 50 * 1024 * 1024 // 50MB
    console.log('   Max allowed:', maxSize, 'bytes')
    console.log('   File size:', file.size, 'bytes')
    
    if (file.size > maxSize) {
      console.log('❌ File too large')
      return NextResponse.json(
        { success: false, error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }
    
    console.log('✅ Step 5 complete: File size valid')

    // Step 6: Convert file to base64 for Cloudinary
    console.log('🔄 Step 6: Converting file to base64...')
    const bytes = await file.arrayBuffer()
    console.log('   Array buffer size:', bytes.byteLength)
    
    const buffer = Buffer.from(bytes)
    console.log('   Buffer created, length:', buffer.length)
    
    const base64 = buffer.toString('base64')
    console.log('   Base64 string length:', base64.length)
    
    const dataURI = `data:${file.type};base64,${base64}`
    console.log('✅ Step 6 complete: File converted to data URI')

    // Step 7: Upload to Cloudinary
    console.log('☁️ Step 7: Uploading to Cloudinary...')
    console.log('   Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      has_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_api_secret: !!process.env.CLOUDINARY_API_SECRET,
    })
    
    const folderPath = `microai-projects/${project.name}/client-uploads`
    const publicId = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    console.log('   Upload folder:', folderPath)
    console.log('   Public ID:', publicId)
    
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: folderPath,
      resource_type: 'auto',
      public_id: publicId,
    })

    console.log('✅ Step 7 complete: File uploaded to Cloudinary')
    console.log('   Cloudinary ID:', uploadResponse.public_id)
    console.log('   Secure URL:', uploadResponse.secure_url)
    console.log('   File format:', uploadResponse.format)
    console.log('   Resource type:', uploadResponse.resource_type)

    // Step 8: Create database record
    console.log('💾 Step 8: Creating database record...')
    const dbData = {
      name: file.name,
      originalName: file.name,
      description: description || null,
      category: 'project-file',
      fileUrl: uploadResponse.secure_url,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      format: file.name.split('.').pop() || '',
      projectId: params.id,
      clientId: clientId,
      uploadedBy: clientId,
      uploadedByRole: 'client',
      cloudinaryId: uploadResponse.public_id,
    }
    console.log('   Database record data:', JSON.stringify(dbData, null, 2))
    
    const upload = await prisma.clientUpload.create({
      data: dbData,
    })

    console.log('✅ Step 8 complete: Database record created')
    console.log('   Upload ID:', upload.id)
    console.log('   Created at:', upload.createdAt)

    // Step 9: Create notifications and activity logs
    console.log('📢 Step 9: Creating notifications and activity logs...')
    
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
    console.log('   ✓ Notification created')

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
    console.log('   ✓ Activity log created')
    console.log('✅ Step 9 complete: Notifications and logs created')

    // Step 10: Return success response
    console.log('📤 Step 10: Preparing success response...')
    const response = {
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
    }
    
    console.log('✅ CLIENT UPLOAD SUCCESSFUL!')
    console.log('🎉 ========== REQUEST COMPLETE ==========\n')
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('\n💥 ========== UPLOAD ERROR ==========')
    console.error('❌ Error type:', error?.constructor?.name)
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('❌ Project ID:', params.id)
    console.error('❌ Timestamp:', new Date().toISOString())
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('Cloudinary')) {
        console.error('🔴 CLOUDINARY ERROR - Check API credentials')
      } else if (error.message.includes('Prisma') || error.message.includes('database')) {
        console.error('🔴 DATABASE ERROR - Check Prisma connection')
      } else if (error.message.includes('JWT') || error.message.includes('token')) {
        console.error('🔴 AUTH ERROR - Check JWT secret and token')
      }
    }
    
    console.error('========================================\n')
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to upload file' },
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

    // Get files from BOTH tables - ProjectFile (Cloudinary new) AND ClientUpload (old local files)
    const [projectFiles, clientUploads] = await Promise.all([
      // New Cloudinary uploads from ProjectFile table
      prisma.projectFile.findMany({
        where: {
          projectId: params.id,
          uploadedBy: { contains: 'Client' }, // Filter for client uploads
        },
        orderBy: { uploadedAt: 'desc' },
      }),
      // Old local file uploads from ClientUpload table
      prisma.clientUpload.findMany({
        where: {
          projectId: params.id,
          clientId: clientId,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    // Combine both sources into one list with matching field names
    const allUploads = [
      // New Cloudinary files
      ...projectFiles.map((file) => ({
        id: file.id,
        filename: file.filename,
        fileUrl: file.fileUrl,
        fileSize: file.fileSize,
        fileType: file.fileType,
        description: file.description,
        uploadedAt: file.uploadedAt.toISOString(),
        uploaderName: 'Client',
        uploaderRole: 'Client',
      })),
      // Old local files
      ...clientUploads.map((upload) => ({
        id: upload.id,
        filename: upload.originalName,
        fileUrl: upload.fileUrl,
        fileSize: upload.fileSize,
        fileType: upload.mimeType,
        description: upload.description,
        uploadedAt: upload.createdAt.toISOString(),
        uploaderName: 'Client',
        uploaderRole: 'Client',
      })),
    ]

    // Filter out legacy files with local paths (only keep Cloudinary URLs)
    const validUploads = allUploads.filter(file => {
      const isCloudinary = file.fileUrl.startsWith('http://') || file.fileUrl.startsWith('https://')
      if (!isCloudinary) {
        console.log(`⚠️ Skipping legacy file with local path: ${file.filename}`)
      }
      return isCloudinary
    }).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    console.log('📁 Client uploads fetched:', {
      project: params.id,
      client: clientId,
      cloudinaryCount: projectFiles.length,
      localCount: clientUploads.length,
      total: allUploads.length,
      valid: validUploads.length,
    })

    return NextResponse.json({
      success: true,
      uploads: validUploads,
      files: validUploads, // Dual response for compatibility
    })
  } catch (error) {
    console.error('❌ Get client uploads error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      projectId: params.id
    })
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

    // Try to find in ProjectFile table first (Cloudinary)
    const projectFile = await prisma.projectFile.findFirst({
      where: {
        id: fileId,
        projectId: params.id,
        uploadedBy: { contains: 'Client' }, // Only client uploads
      },
    })

    if (projectFile) {
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
    }

    // Try ClientUpload table (old local files)
    const clientUpload = await prisma.clientUpload.findFirst({
      where: {
        id: fileId,
        projectId: params.id,
        clientId: clientId,
      },
    })

    if (clientUpload) {
      // Delete from database (local file deletion handled elsewhere)
      await prisma.clientUpload.delete({
        where: { id: fileId },
      })

      return NextResponse.json({
        success: true,
        message: 'File deleted successfully',
      })
    }

    return NextResponse.json(
      { success: false, error: 'File not found or access denied' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
