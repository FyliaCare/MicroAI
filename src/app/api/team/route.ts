// Team Members API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/middleware'
import { asyncHandler, formatSuccessResponse, formatErrorResponse } from '@/lib/api-errors'
import { validate, teamMemberSchema } from '@/lib/validation'
import { getPagination, getFilters } from '@/lib/middleware'
import { logCreate, logUpdate, logDelete, AuditEntityType } from '@/lib/audit'

// GET /api/team - Get all team members
export const GET = asyncHandler(async (request: NextRequest) => {
  await requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER'])
  
  const { skip, limit, page } = getPagination(request)
  const filters = getFilters(request)
  
  const where: any = {}
  
  if (filters.role) {
    where.role = filters.role
  }
  
  if (filters.status) {
    where.status = filters.status
  }
  
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  
  const [teamMembers, total] = await Promise.all([
    prisma.teamMember.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        projects: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
        timeEntries: {
          select: {
            id: true,
            hours: true,
            date: true,
          },
          take: 5,
          orderBy: { date: 'desc' },
        },
      },
    }),
    prisma.teamMember.count({ where }),
  ])
  
  return NextResponse.json(
    formatSuccessResponse({
      teamMembers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  )
})

// POST /api/team - Create new team member
export const POST = asyncHandler(async (request: NextRequest) => {
  const session = await requireRole(request, ['SUPER_ADMIN', 'ADMIN'])
  
  const body = await request.json()
  const data = await validate(teamMemberSchema, body)
  
  const teamMember = await prisma.teamMember.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      position: data.position,
      department: data.department,
      hourlyRate: data.hourlyRate,
      skills: data.skills,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      status: 'ACTIVE',
    },
    include: {
      projects: true,
    },
  })
  
  // Log the creation
  await logCreate(
    AuditEntityType.TEAM_MEMBER,
    teamMember.id,
    teamMember,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse({ teamMember }, 'Team member created successfully'),
    { status: 201 }
  )
})
