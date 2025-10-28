// Communications API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { asyncHandler, formatSuccessResponse } from '@/lib/api-errors'
import { validate } from '@/lib/validation'
import { getPagination, getFilters, getSort } from '@/lib/middleware'
import { logCreate, AuditEntityType } from '@/lib/audit'
import { z } from 'zod'

// Communication schema
const communicationSchema = z.object({
  type: z.enum(['EMAIL', 'PHONE', 'MEETING', 'VIDEO_CALL', 'CHAT']),
  subject: z.string().min(1, 'Subject is required').max(255),
  content: z.string(),
  direction: z.enum(['INBOUND', 'OUTBOUND']),
  date: z.string().transform((val) => new Date(val)),
  clientId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  participants: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
})

// GET /api/communications - Get all communications
export const GET = asyncHandler(async (request: NextRequest) => {
  await requireAuth(request)
  
  const { skip, limit, page } = getPagination(request)
  const filters = getFilters(request)
  const sort = getSort(request, { date: 'desc' })
  
  const where: any = {}
  
  if (filters.clientId) {
    where.clientId = filters.clientId
  }
  
  if (filters.projectId) {
    where.projectId = filters.projectId
  }
  
  if (filters.type) {
    where.type = filters.type
  }
  
  if (filters.direction) {
    where.direction = filters.direction
  }
  
  if (filters.search) {
    where.OR = [
      { subject: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  
  if (filters.startDate || filters.endDate) {
    where.date = {}
    if (filters.startDate) {
      where.date.gte = new Date(filters.startDate)
    }
    if (filters.endDate) {
      where.date.lte = new Date(filters.endDate)
    }
  }
  
  const [communications, total, typeCount] = await Promise.all([
    prisma.communication.findMany({
      where,
      skip,
      take: limit,
      orderBy: sort,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.communication.count({ where }),
    prisma.communication.groupBy({
      by: ['type'],
      where: filters.clientId ? { clientId: filters.clientId } : {},
      _count: true,
    }),
  ])
  
  return NextResponse.json(
    formatSuccessResponse({
      communications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        byType: typeCount,
      },
    })
  )
})

// POST /api/communications - Log new communication
export const POST = asyncHandler(async (request: NextRequest) => {
  const session = await requireAuth(request)
  
  const body = await request.json()
  const data = validate(communicationSchema, body)
  
  const communication = await prisma.communication.create({
    data: {
      type: data.type,
      subject: data.subject,
      content: data.content,
      direction: data.direction,
      date: data.date,
      clientId: data.clientId,
      projectId: data.projectId,
      participants: data.participants,
      attachments: data.attachments,
      metadata: data.metadata,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
  
  // Log the creation
  await logCreate(
    AuditEntityType.COMMUNICATION,
    communication.id,
    communication,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse({ communication }, 'Communication logged successfully'),
    { status: 201 }
  )
})
