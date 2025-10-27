import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('logo') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload PNG, JPG, SVG, or WebP.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Get file extension
    const ext = path.extname(file.name)
    const filename = `company-logo${ext}`

    // Save to public/uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Create uploads directory if it doesn't exist
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (err) {
      // Directory might already exist, that's fine
    }

    const filePath = path.join(uploadsDir, filename)
    await writeFile(filePath, buffer)

    // Return the public URL
    const logoUrl = `/uploads/${filename}`

    return NextResponse.json({
      success: true,
      logoUrl,
      message: 'Logo uploaded successfully'
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload logo' },
      { status: 500 }
    )
  }
}
