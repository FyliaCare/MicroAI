// Advanced Analytics API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/middleware'
import { asyncHandler, formatSuccessResponse } from '@/lib/api-errors'

// GET /api/analytics/advanced - Get comprehensive analytics
export const GET = asyncHandler(async (request: NextRequest) => {
  await requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER'])
  
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(new Date().setMonth(new Date().getMonth() - 6))
  const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date()
  
  // Revenue analytics
  const revenueData = await prisma.invoice.groupBy({
    by: ['status'],
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      total: true,
    },
    _count: true,
  })
  
  const totalRevenue = await prisma.invoice.aggregate({
    where: {
      status: 'PAID',
      paidAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      total: true,
    },
  })
  
  const outstandingRevenue = await prisma.invoice.aggregate({
    where: {
      status: { in: ['SENT', 'OVERDUE'] },
    },
    _sum: {
      total: true,
    },
  })
  
  // Project analytics
  const projectStats = await prisma.project.groupBy({
    by: ['status'],
    _count: true,
  })
  
  const projectRevenue = await prisma.project.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      name: true,
      budget: true,
      invoices: {
        where: { status: 'PAID' },
        select: {
          total: true,
        },
      },
      expenses: {
        select: {
          amount: true,
        },
      },
    },
  })
  
  const profitabilityData = projectRevenue.map(project => {
    const revenue = project.invoices.reduce((sum, inv) => sum + inv.total, 0)
    const expenses = project.expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const profit = revenue - expenses
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0
    
    return {
      projectId: project.id,
      projectName: project.name,
      budget: project.budget || 0,
      revenue,
      expenses,
      profit,
      margin,
    }
  })
  
  // Time tracking analytics
  const timeStats = await prisma.timeEntry.aggregate({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      hours: true,
    },
  })
  
  const billableTimeStats = await prisma.timeEntry.aggregate({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      billable: true,
    },
    _sum: {
      hours: true,
    },
  })
  
  const teamUtilization = await prisma.teamMember.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      name: true,
      role: true,
      timeEntries: {
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          hours: true,
          billable: true,
        },
      },
    },
  })
  
  const utilizationData = teamUtilization.map(member => {
    const totalHours = member.timeEntries.reduce((sum, entry) => sum + entry.hours, 0)
    const billableHours = member.timeEntries
      .filter(entry => entry.billable)
      .reduce((sum, entry) => sum + entry.hours, 0)
    const workingDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const expectedHours = workingDays * 8 // Assuming 8-hour workday
    const utilization = expectedHours > 0 ? (totalHours / expectedHours) * 100 : 0
    
    return {
      memberId: member.id,
      memberName: member.name,
      role: member.role,
      totalHours,
      billableHours,
      utilizationRate: utilization,
    }
  })
  
  // Client analytics
  const topClients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      projects: {
        select: {
          invoices: {
            where: { status: 'PAID' },
            select: {
              total: true,
            },
          },
        },
      },
    },
  })
  
  const clientRevenueData = topClients.map(client => {
    const revenue = client.projects.reduce((sum, project) => {
      return sum + project.invoices.reduce((invSum, inv) => invSum + inv.total, 0)
    }, 0)
    
    return {
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      totalRevenue: revenue,
      projectCount: client.projects.length,
    }
  }).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10)
  
  // Monthly revenue trend
  const monthlyRevenue = await prisma.$queryRaw<Array<{ month: Date; revenue: number }>>`
    SELECT 
      DATE_TRUNC('month', "paidAt") as month,
      SUM(total) as revenue
    FROM "Invoice"
    WHERE status = 'PAID'
      AND "paidAt" >= ${startDate}
      AND "paidAt" <= ${endDate}
    GROUP BY DATE_TRUNC('month', "paidAt")
    ORDER BY month
  `
  
  return NextResponse.json(
    formatSuccessResponse({
      dateRange: {
        startDate,
        endDate,
      },
      revenue: {
        total: totalRevenue._sum.total || 0,
        outstanding: outstandingRevenue._sum.total || 0,
        byStatus: revenueData,
        monthlyTrend: monthlyRevenue,
      },
      projects: {
        byStatus: projectStats,
        profitability: profitabilityData,
        topProjects: profitabilityData.sort((a, b) => b.profit - a.profit).slice(0, 10),
      },
      time: {
        totalHours: timeStats._sum.hours || 0,
        billableHours: billableTimeStats._sum.hours || 0,
        utilizationRate: ((billableTimeStats._sum.hours || 0) / (timeStats._sum.hours || 1)) * 100,
      },
      team: {
        utilization: utilizationData,
        topPerformers: utilizationData.sort((a, b) => b.billableHours - a.billableHours).slice(0, 5),
      },
      clients: {
        topClients: clientRevenueData,
        totalClients: topClients.length,
      },
    })
  )
})
