// Individual Document API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { asyncHandler, formatSuccessResponse, NotFoundError } from '@/lib/api-errors'
import { logDelete, AuditEntityType } from '@/lib/audit'
import { deleteFile } from '@/lib/file-upload'
import { readFile } from 'fs/promises'

interface RouteContext {
  params: { id: string }
}

// GET /api/documents/[id] - Get document details or download
export const GET = asyncHandler(async (request: NextRequest, { params }: RouteContext) => {
  await requireAuth(request)
  
  const { searchParams } = new URL(request.url)
  const download = searchParams.get('download') === 'true'
  
  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
  
  if (!document) {
    throw new NotFoundError(`Document with ID ${params.id} not found`)
  }
  
  // If download requested, return file content
  if (download && document.filePath) {
    const fileContent = await readFile(document.filePath)
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': document.mimeType,
        'Content-Disposition': `attachment; filename="${document.filename}"`,
        'Content-Length': document.fileSize.toString(),
      },
    })
  }
  
  // Otherwise return document metadata
  return NextResponse.json(formatSuccessResponse({ document }))
})

// DELETE /api/documents/[id] - Delete document
export const DELETE = asyncHandler(async (request: NextRequest, { params }: RouteContext) => {
  const session = await requireAuth(request)
  
  const document = await prisma.document.findUnique({
    where: { id: params.id },
  })
  
  if (!document) {
    throw new NotFoundError(`Document with ID ${params.id} not found`)
  }
  
  // Delete file from storage
  if (document.filePath) {
    try {
      await deleteFile(document.filePath)
    } catch (error) {
      console.error('Failed to delete file from storage:', error)
      // Continue with database deletion even if file deletion fails
    }
  }
  
  // Delete from database
  await prisma.document.delete({
    where: { id: params.id },
  })
  
  // Log the deletion
  await logDelete(
    AuditEntityType.DOCUMENT,
    params.id,
    document,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse(null, 'Document deleted successfully')
  )
})
