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
  
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === 'true'
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
        projectAssignments: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
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
  const validated = await validate(teamMemberSchema, body)
  
  const teamMember = await prisma.teamMember.create({
    data: {
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      role: validated.role,
      title: validated.position, // position -> title
      hourlyRate: validated.hourlyRate,
      skills: validated.skills ? JSON.stringify(validated.skills) : undefined,
      bio: validated.bio,
      avatar: validated.avatarUrl, // avatarUrl -> avatar
      isActive: true,
    },
    include: {
      projectAssignments: true,
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
