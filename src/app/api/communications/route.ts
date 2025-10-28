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
  subject: z.string().optional(),
  content: z.string(),
  direction: z.enum(['INBOUND', 'OUTBOUND']),
  clientId: z.string().uuid(),
  from: z.string().optional(),
  to: z.string().optional(),
  cc: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
})

// GET /api/communications - Get all communications
export const GET = asyncHandler(async (request: NextRequest) => {
  await requireAuth(request)
  
  const { skip, limit, page } = getPagination(request)
  const filters = getFilters(request)
  const sort: any = getSort(request, { createdAt: 'desc' })
  
  const where: any = {}
  
  if (filters.clientId) {
    where.clientId = filters.clientId
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
    where.createdAt = {}
    if (filters.startDate) {
      where.createdAt.gte = new Date(filters.startDate)
    }
    if (filters.endDate) {
      where.createdAt.lte = new Date(filters.endDate)
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
      clientId: data.clientId,
      from: data.from,
      to: data.to,
      cc: data.cc ? JSON.stringify(data.cc) : undefined,
      attachments: data.attachments ? JSON.stringify(data.attachments) : undefined,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
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
