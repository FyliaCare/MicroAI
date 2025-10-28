// Time Entries API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/middleware'
import { asyncHandler, formatSuccessResponse } from '@/lib/api-errors'
import { validate } from '@/lib/validation'
import { getPagination, getFilters, getSort } from '@/lib/middleware'
import { logCreate, AuditEntityType } from '@/lib/audit'
import { z } from 'zod'

// Time Entry schema
const timeEntrySchema = z.object({
  description: z.string().min(1, 'Description is required'),
  hours: z.number().positive('Hours must be positive'),
  date: z.string().transform((val) => new Date(val)),
  billable: z.boolean().default(true),
  hourlyRate: z.number().positive().optional(),
  projectId: z.string().uuid().optional(),
  taskId: z.string().uuid().optional(),
  memberId: z.string().uuid(),
})

// GET /api/time-entries - Get all time entries
export const GET = asyncHandler(async (request: NextRequest) => {
  await requireAuth(request)
  
  const { skip, limit, page } = getPagination(request)
  const filters = getFilters(request)
  const sort: any = getSort(request, { createdAt: 'desc' })
  
  const where: any = {}
  
  if (filters.memberId) {
    where.memberId = filters.memberId
  }
  
  if (filters.projectId) {
    where.projectId = filters.projectId
  }
  
  if (filters.billable !== undefined) {
    where.billable = filters.billable === 'true'
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
  
  const [timeEntries, total, totalHours, billableHours] = await Promise.all([
    prisma.timeEntry.findMany({
      where,
      skip,
      take: limit,
      orderBy: sort,
      include: {
        member: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            client: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    }),
    prisma.timeEntry.count({ where }),
    prisma.timeEntry.aggregate({
      where,
      _sum: { hours: true },
    }),
    prisma.timeEntry.aggregate({
      where: { ...where, billable: true },
      _sum: { hours: true },
    }),
  ])
  
  return NextResponse.json(
    formatSuccessResponse({
      timeEntries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalHours: totalHours._sum.hours || 0,
        billableHours: billableHours._sum.hours || 0,
        nonBillableHours: (totalHours._sum.hours || 0) - (billableHours._sum.hours || 0),
      },
    })
  )
})

// POST /api/time-entries - Create new time entry
export const POST = asyncHandler(async (request: NextRequest) => {
  const session = await requireAuth(request)
  
  const body = await request.json()
  const data = validate(timeEntrySchema, body)
  
  const timeEntry = await prisma.timeEntry.create({
    data: {
      description: data.description,
      hours: data.hours,
      date: data.date,
      billable: data.billable,
      hourlyRate: data.hourlyRate,
      projectId: data.projectId,
      taskId: data.taskId,
      memberId: data.memberId,
    },
    include: {
      member: true,
      project: true,
      task: true,
    },
  })
  
  // Log the creation
  await logCreate(
    AuditEntityType.TIME_ENTRY,
    timeEntry.id,
    timeEntry,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse({ timeEntry }, 'Time entry created successfully'),
    { status: 201 }
  )
})
