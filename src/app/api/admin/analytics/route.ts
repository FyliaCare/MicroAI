import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'all':
        startDate = new Date(2000, 0, 1)
        break
    }

    // Fetch all data
    const [projects, clients, quotes, invoices] = await Promise.all([
      prisma.project.findMany({
        where: { createdAt: { gte: startDate } },
        include: { client: true }
      }),
      prisma.client.findMany({
        where: { createdAt: { gte: startDate } },
        include: {
          projects: true,
          quotes: true,
          invoices: true
        }
      }),
      prisma.quote.findMany({
        where: { createdAt: { gte: startDate } },
        include: { client: true }
      }),
      prisma.invoice.findMany({
        where: { createdAt: { gte: startDate } }
      })
    ])

    // Calculate overview metrics
    const totalRevenue = projects.reduce((sum: number, p: any) => sum + (p.revenue || 0), 0)
    const totalProjects = projects.length
    const activeClients = clients.filter((c: any) => c.status === 'active').length
    const avgProjectValue = totalProjects > 0 ? totalRevenue / totalProjects : 0

    // Calculate growth (comparing to previous period)
    const previousPeriodStart = new Date(startDate)
    previousPeriodStart.setTime(previousPeriodStart.getTime() - (now.getTime() - startDate.getTime()))
    
    const [previousProjects, previousClients] = await Promise.all([
      prisma.project.findMany({
        where: {
          createdAt: {
            gte: previousPeriodStart,
            lt: startDate
          }
        }
      }),
      prisma.client.findMany({
        where: {
          createdAt: {
            gte: previousPeriodStart,
            lt: startDate
          },
          status: 'active'
        }
      })
    ])

    const previousRevenue = previousProjects.reduce((sum: number, p: any) => sum + (p.revenue || 0), 0)
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0
    const projectsGrowth = previousProjects.length > 0 ? ((totalProjects - previousProjects.length) / previousProjects.length) * 100 : 0
    const clientsGrowth = previousClients.length > 0 ? ((activeClients - previousClients.length) / previousClients.length) * 100 : 0
    const previousAvgValue = previousProjects.length > 0 ? previousRevenue / previousProjects.length : 0
    const projectValueGrowth = previousAvgValue > 0 ? ((avgProjectValue - previousAvgValue) / previousAvgValue) * 100 : 0

    // Monthly revenue trend (last 12 months)
    const monthlyRevenue = []
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthProjects = projects.filter((p: any) => {
        const createdAt = new Date(p.createdAt)
        return createdAt >= monthStart && createdAt <= monthEnd
      })
      
      const revenue = monthProjects.reduce((sum: number, p: any) => sum + (p.revenue || 0), 0)
      const costs = monthProjects.reduce((sum: number, p: any) => sum + (p.actualCost || 0), 0)
      const profit = revenue - costs
      
      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue,
        profit
      })
    }

    // Revenue by category (project type)
    const revenueByType: Record<string, number> = {}
    projects.forEach((p: any) => {
      if (!revenueByType[p.type]) revenueByType[p.type] = 0
      revenueByType[p.type] += p.revenue || 0
    })
    
    const totalCategoryRevenue = Object.values(revenueByType).reduce((sum: number, val: number) => sum + val, 0)
    const revenueByCategory = Object.entries(revenueByType)
      .map(([category, amount]) => ({
        category: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        amount,
        percentage: totalCategoryRevenue > 0 ? (amount / totalCategoryRevenue) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)

    // Revenue by client
    const revenueByClient: Record<string, { amount: number; projects: number; name: string }> = {}
    projects.forEach((p: any) => {
      if (p.clientId && p.client) {
        if (!revenueByClient[p.clientId]) {
          revenueByClient[p.clientId] = { amount: 0, projects: 0, name: p.client.name }
        }
        revenueByClient[p.clientId].amount += p.revenue || 0
        revenueByClient[p.clientId].projects += 1
      }
    })

    // Projects by status
    const statusCounts: Record<string, number> = {}
    projects.forEach((p: any) => {
      if (!statusCounts[p.status]) statusCounts[p.status] = 0
      statusCounts[p.status] += 1
    })
    
    const projectsByStatus = Object.entries(statusCounts)
      .map(([status, count]) => ({
        status,
        count,
        percentage: totalProjects > 0 ? (count / totalProjects) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)

    // Projects by type
    const typeCounts: Record<string, { count: number; revenue: number }> = {}
    projects.forEach((p: any) => {
      if (!typeCounts[p.type]) typeCounts[p.type] = { count: 0, revenue: 0 }
      typeCounts[p.type].count += 1
      typeCounts[p.type].revenue += p.revenue || 0
    })
    
    const projectsByType = Object.entries(typeCounts)
      .map(([type, data]) => ({
        type,
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.count - a.count)

    // Project completion
    const completedOnTime = projects.filter((p: any) => {
      if (p.status !== 'completed' || !p.completedAt || !p.deadline) return false
      return new Date(p.completedAt) <= new Date(p.deadline)
    }).length
    
    const completedDelayed = projects.filter((p: any) => {
      if (p.status !== 'completed' || !p.completedAt || !p.deadline) return false
      return new Date(p.completedAt) > new Date(p.deadline)
    }).length
    
    const completedTotal = completedOnTime + completedDelayed || 1 // Avoid division by zero

    // Client status
    const clientsByStatus = [
      { status: 'active', count: clients.filter((c: any) => c.status === 'active').length },
      { status: 'inactive', count: clients.filter((c: any) => c.status === 'inactive').length },
      { status: 'archived', count: clients.filter((c: any) => c.status === 'archived').length }
    ]

    // Top clients
    const topClients = Object.values(revenueByClient)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .map(c => ({
        name: c.name,
        projects: c.projects,
        revenue: c.amount
      }))

    // Client retention
    const allClients = await prisma.client.findMany()
    const clientsWithMultipleProjects = allClients.filter((c: any) => 
      c.status === 'active' && 
      projects.filter((p: any) => p.clientId === c.id).length > 1
    ).length
    const retentionRate = activeClients > 0 ? (clientsWithMultipleProjects / activeClients) * 100 : 0

    // Financial overview
    const totalBudget = projects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0)
    const totalActualCost = projects.reduce((sum: number, p: any) => sum + (p.actualCost || 0), 0)
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalActualCost) / totalRevenue) * 100 : 0

    const invoicesPaid = invoices.filter((i: any) => i.status === 'paid').reduce((sum: number, i: any) => sum + i.total, 0)
    const invoicesPending = invoices.filter((i: any) => i.status === 'sent' || i.status === 'viewed').reduce((sum: number, i: any) => sum + i.total, 0)
    const invoicesOverdue = invoices.filter((i: any) => {
      if (i.status === 'overdue') return true
      if (i.dueDate && new Date(i.dueDate) < now && i.status !== 'paid') return true
      return false
    }).reduce((sum: number, i: any) => sum + i.total, 0)

    const analytics = {
      overview: {
        totalRevenue,
        revenueGrowth,
        totalProjects,
        projectsGrowth,
        activeClients,
        clientsGrowth,
        avgProjectValue,
        projectValueGrowth
      },
      revenue: {
        monthly: monthlyRevenue,
        byCategory: revenueByCategory,
        byClient: Object.values(revenueByClient).sort((a, b) => b.amount - a.amount)
      },
      projects: {
        byStatus: projectsByStatus,
        byType: projectsByType,
        completion: {
          onTime: completedOnTime,
          delayed: completedDelayed,
          total: completedTotal
        }
      },
      clients: {
        byStatus: clientsByStatus,
        topClients,
        retention: {
          rate: retentionRate,
          newClients: clients.filter((c: any) => {
            const projectCount = projects.filter((p: any) => p.clientId === c.id).length
            return projectCount === 1
          }).length,
          returningClients: clientsWithMultipleProjects
        }
      },
      financial: {
        totalBudget,
        totalActualCost,
        totalRevenue,
        profitMargin,
        invoices: {
          paid: invoicesPaid,
          pending: invoicesPending,
          overdue: invoicesOverdue
        }
      }
    }

    return NextResponse.json({
      success: true,
      analytics
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
