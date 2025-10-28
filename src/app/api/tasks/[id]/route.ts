// Individual Task API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { asyncHandler, formatSuccessResponse, NotFoundError } from '@/lib/api-errors'
import { validate } from '@/lib/validation'
import { logUpdate, logDelete, AuditEntityType } from '@/lib/audit'
import { z } from 'zod'

interface RouteContext {
  params: { id: string }
}

const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'BLOCKED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().positive().optional(),
  startDate: z.string().transform((val) => new Date(val)).optional(),
  dueDate: z.string().transform((val) => new Date(val)).optional(),
  completedAt: z.string().transform((val) => new Date(val)).optional(),
  assignedToId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
})

// GET /api/tasks/[id] - Get task by ID
export const GET = asyncHandler(async (request: NextRequest, { params }: RouteContext) => {
  await requireAuth(request)
  
  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
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
      timeEntries: {
        orderBy: { date: 'desc' },
        include: {
          member: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  })
  
  if (!task) {
    throw new NotFoundError(`Task with ID ${params.id} not found`)
  }
  
  return NextResponse.json(formatSuccessResponse({ task }))
})

// PATCH /api/tasks/[id] - Update task
export const PATCH = asyncHandler(async (request: NextRequest, { params }: RouteContext) => {
  const session = await requireAuth(request)
  
  const existing = await prisma.task.findUnique({
    where: { id: params.id },
  })
  
  if (!existing) {
    throw new NotFoundError(`Task with ID ${params.id} not found`)
  }
  
  const body = await request.json()
  const data = validate(updateTaskSchema, body)
  
  // Auto-set completedAt when status changes to COMPLETED
  const updateData: any = { ...data }
  if (data.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
    updateData.completedAt = new Date()
  }
  
  const task = await prisma.task.update({
    where: { id: params.id },
    data: updateData,
    include: {
      project: true,
    },
  })
  
  // Log the update
  await logUpdate(
    AuditEntityType.TASK,
    task.id,
    existing,
    task,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse({ task }, 'Task updated successfully')
  )
})

// DELETE /api/tasks/[id] - Delete task
export const DELETE = asyncHandler(async (request: NextRequest, { params }: RouteContext) => {
  const session = await requireAuth(request)
  
  const task = await prisma.task.findUnique({
    where: { id: params.id },
  })
  
  if (!task) {
    throw new NotFoundError(`Task with ID ${params.id} not found`)
  }
  
  await prisma.task.delete({
    where: { id: params.id },
  })
  
  // Log the deletion
  await logDelete(
    AuditEntityType.TASK,
    params.id,
    task,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse(null, 'Task deleted successfully')
  )
})
