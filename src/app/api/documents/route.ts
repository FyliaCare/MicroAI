// Documents API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/middleware'
import { asyncHandler, formatSuccessResponse, NotFoundError, ValidationError } from '@/lib/api-errors'
import { getPagination, getFilters, getSort } from '@/lib/middleware'
import { logCreate, logDelete, AuditEntityType } from '@/lib/audit'
import { uploadFile, validateFile } from '@/lib/file-upload'

// GET /api/documents - List all documents
export const GET = asyncHandler(async (request: NextRequest) => {
  await requireAuth(request)
  
  const { skip, limit, page } = getPagination(request)
  const filters = getFilters(request)
  const sort = getSort(request, { createdAt: 'desc' })
  
  const where: any = {}
  
  if (filters.projectId) {
    where.projectId = filters.projectId
  }
  
  if (filters.clientId) {
    where.clientId = filters.clientId
  }
  
  if (filters.mimeType) {
    where.mimeType = { contains: filters.mimeType }
  }
  
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { filename: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  
  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      skip,
      take: limit,
      orderBy: sort,
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
    }),
    prisma.document.count({ where }),
  ])
  
  return NextResponse.json(
    formatSuccessResponse({
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  )
})

// POST /api/documents - Upload new document
export const POST = asyncHandler(async (request: NextRequest) => {
  const session = await requireAuth(request)
  
  const formData = await request.formData()
  const file = formData.get('file') as File
  const name = formData.get('name') as string
  const projectId = formData.get('projectId') as string | null
  const clientId = formData.get('clientId') as string | null
  const folder = formData.get('folder') as string | null
  
  if (!file) {
    throw new ValidationError('File is required')
  }
  
  if (!name) {
    throw new ValidationError('Document name is required')
  }
  
  // Validate file
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new ValidationError(validation.error || 'Invalid file')
  }
  
  // Upload file
  const upload = await uploadFile(file, folder || 'documents')
  
  // Save to database
  const document = await prisma.document.create({
    data: {
      name,
      filename: upload.filename,
      filePath: upload.path,
      fileUrl: upload.url,
      fileSize: upload.size,
      mimeType: upload.mimeType,
      projectId: projectId || undefined,
      clientId: clientId || undefined,
      uploadedBy: session.user?.id,
    },
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
  
  // Log the creation
  await logCreate(
    AuditEntityType.DOCUMENT,
    document.id,
    document,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse({ document }, 'Document uploaded successfully'),
    { status: 201 }
  )
})
