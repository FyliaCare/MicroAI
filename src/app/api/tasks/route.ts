// Tasks API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { asyncHandler, formatSuccessResponse } from '@/lib/api-errors'
import { validate } from '@/lib/validation'
import { getPagination, getFilters, getSort } from '@/lib/middleware'
import { logCreate, AuditEntityType } from '@/lib/audit'
import { z } from 'zod'

// Task schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'BLOCKED']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().positive().optional(),
  startDate: z.string().transform((val) => new Date(val)).optional(),
  dueDate: z.string().transform((val) => new Date(val)).optional(),
  completedAt: z.string().transform((val) => new Date(val)).optional(),
  projectId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
})

// GET /api/tasks - Get all tasks
export const GET = asyncHandler(async (request: NextRequest) => {
  await requireAuth(request)
  
  const { skip, limit, page } = getPagination(request)
  const filters = getFilters(request)
  const sort: any = getSort(request, { createdAt: 'desc' })
  
  const where: any = {}
  
  if (filters.projectId) {
    where.projectId = filters.projectId
  }
  
  if (filters.assignedToId) {
    where.assignedTo = filters.assignedToId
  }
  
  if (filters.status) {
    where.status = filters.status
  }
  
  if (filters.priority) {
    where.priority = filters.priority
  }
  
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  
  if (filters.overdue === 'true') {
    where.dueDate = { lt: new Date() }
    where.status = { notIn: ['COMPLETED'] }
  }
  
  const [tasks, total, statusCount] = await Promise.all([
    prisma.task.findMany({
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
        timeEntries: {
          select: {
            hours: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.task.count({ where }),
    prisma.task.groupBy({
      by: ['status'],
      where: filters.projectId ? { projectId: filters.projectId } : {},
      _count: true,
    }),
  ])
  
  // Calculate total time spent
  const tasksWithTime = tasks.map(task => ({
    ...task,
    totalHours: task.timeEntries.reduce((sum: number, entry: { hours: number }) => sum + entry.hours, 0),
  }))
  
  return NextResponse.json(
    formatSuccessResponse({
      tasks: tasksWithTime,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        byStatus: statusCount,
      },
    })
  )
})

// POST /api/tasks - Create new task
export const POST = asyncHandler(async (request: NextRequest) => {
  const session = await requireAuth(request)
  
  const body = await request.json()
  const data = validate(taskSchema, body)
  
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      estimatedHours: data.estimatedHours,
      actualHours: data.actualHours,
      startDate: data.startDate,
      dueDate: data.dueDate,
      completedAt: data.completedAt,
      projectId: data.projectId,
      assignedTo: data.assignedToId,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
    },
    include: {
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
    AuditEntityType.TASK,
    task.id,
    task,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse({ task }, 'Task created successfully'),
    { status: 201 }
  )
})
