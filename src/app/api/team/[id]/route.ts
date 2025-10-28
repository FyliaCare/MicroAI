// Individual Team Member API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/middleware'
import { asyncHandler, formatSuccessResponse, NotFoundError } from '@/lib/api-errors'
import { validate, updateTeamMemberSchema } from '@/lib/validation'
import { logUpdate, logDelete, AuditEntityType } from '@/lib/audit'

interface RouteContext {
  params: { id: string }
}

// GET /api/team/[id] - Get team member by ID
export const GET = asyncHandler(async (request: NextRequest, { params }: RouteContext) => {
  await requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER'])
  
  const teamMember = await prisma.teamMember.findUnique({
    where: { id: params.id },
    include: {
      projects: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
              status: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      },
      timeEntries: {
        orderBy: { date: 'desc' },
        take: 20,
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      tasks: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })
  
  if (!teamMember) {
    throw new NotFoundError(`Team member with ID ${params.id} not found`)
  }
  
  return NextResponse.json(formatSuccessResponse({ teamMember }))
})

// PATCH /api/team/[id] - Update team member
export const PATCH = asyncHandler(async (request: NextRequest, { params }: RouteContext) => {
  const session = await requireRole(request, ['SUPER_ADMIN', 'ADMIN'])
  
  const existing = await prisma.teamMember.findUnique({
    where: { id: params.id },
  })
  
  if (!existing) {
    throw new NotFoundError(`Team member with ID ${params.id} not found`)
  }
  
  const body = await request.json()
  const data = validate(updateTeamMemberSchema, body)
  
  const teamMember = await prisma.teamMember.update({
    where: { id: params.id },
    data,
    include: {
      projects: true,
    },
  })
  
  // Log the update
  await logUpdate(
    AuditEntityType.TEAM_MEMBER,
    teamMember.id,
    existing,
    teamMember,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse({ teamMember }, 'Team member updated successfully')
  )
})

// DELETE /api/team/[id] - Delete team member
export const DELETE = asyncHandler(async (request: NextRequest, { params }: RouteContext) => {
  const session = await requireRole(request, ['SUPER_ADMIN'])
  
  const teamMember = await prisma.teamMember.findUnique({
    where: { id: params.id },
  })
  
  if (!teamMember) {
    throw new NotFoundError(`Team member with ID ${params.id} not found`)
  }
  
  await prisma.teamMember.delete({
    where: { id: params.id },
  })
  
  // Log the deletion
  await logDelete(
    AuditEntityType.TEAM_MEMBER,
    params.id,
    teamMember,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse(null, 'Team member deleted successfully')
  )
})
