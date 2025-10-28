// Expenses API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/middleware'
import { asyncHandler, formatSuccessResponse } from '@/lib/api-errors'
import { validate } from '@/lib/validation'
import { getPagination, getFilters, getSort } from '@/lib/middleware'
import { logCreate, AuditEntityType } from '@/lib/audit'
import { z } from 'zod'

// Expense schema
const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().transform((val) => new Date(val)),
  projectId: z.string().uuid(),
  receipt: z.string().optional(),
  vendor: z.string().optional(),
  notes: z.string().optional(),
  billable: z.boolean().default(true),
  reimbursable: z.boolean().default(false),
  approvedBy: z.string().uuid().optional(),
  approvedAt: z.string().transform((val) => new Date(val)).optional(),
})

// GET /api/expenses - Get all expenses
export const GET = asyncHandler(async (request: NextRequest) => {
  await requireAuth(request)
  
  const { skip, limit, page } = getPagination(request)
  const filters = getFilters(request)
  const sort = getSort(request, { date: 'desc' })
  
  const where: any = {}
  
  if (filters.projectId) {
    where.projectId = filters.projectId
  }
  
  if (filters.category) {
    where.category = filters.category
  }
  
  if (filters.billable !== undefined) {
    where.billable = filters.billable === 'true'
  }
  
  if (filters.reimbursable !== undefined) {
    where.reimbursable = filters.reimbursable === 'true'
  }
  
  if (filters.search) {
    where.OR = [
      { description: { contains: filters.search, mode: 'insensitive' } },
      { vendor: { contains: filters.search, mode: 'insensitive' } },
      { category: { contains: filters.search, mode: 'insensitive' } },
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
  
  const [expenses, total, totalAmount, categoryBreakdown] = await Promise.all([
    prisma.expense.findMany({
      where,
      skip,
      take: limit,
      orderBy: sort,
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
      },
    }),
    prisma.expense.count({ where }),
    prisma.expense.aggregate({
      where,
      _sum: { amount: true },
    }),
    prisma.expense.groupBy({
      by: ['category'],
      where: filters.projectId ? { projectId: filters.projectId } : {},
      _sum: { amount: true },
      _count: true,
    }),
  ])
  
  return NextResponse.json(
    formatSuccessResponse({
      expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalAmount: totalAmount._sum.amount || 0,
        byCategory: categoryBreakdown,
      },
    })
  )
})

// POST /api/expenses - Create new expense
export const POST = asyncHandler(async (request: NextRequest) => {
  const session = await requireAuth(request)
  
  const body = await request.json()
  const data = validate(expenseSchema, body)
  
  const expense = await prisma.expense.create({
    data: {
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
      projectId: data.projectId,
      receipt: data.receipt,
      vendor: data.vendor,
      notes: data.notes,
      billable: data.billable,
      reimbursable: data.reimbursable,
      approvedBy: data.approvedBy,
      approvedAt: data.approvedAt,
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
    AuditEntityType.EXPENSE,
    expense.id,
    expense,
    session.user?.id
  )
  
  return NextResponse.json(
    formatSuccessResponse({ expense }, 'Expense created successfully'),
    { status: 201 }
  )
})
