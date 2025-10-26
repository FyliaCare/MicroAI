import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/dashboard - Get dashboard analytics
export async function GET(request: NextRequest) {
  try {
    // Get counts
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalClients,
      activeClients,
      totalQuotes,
      pendingQuotes,
      acceptedQuotes,
      totalTasks,
      completedTasks,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'in-progress' } }),
      prisma.project.count({ where: { status: 'completed' } }),
      prisma.client.count(),
      prisma.client.count({ where: { status: 'active' } }),
      prisma.quote.count(),
      prisma.quote.count({ where: { status: { in: ['draft', 'sent'] } } }),
      prisma.quote.count({ where: { status: 'accepted' } }),
      prisma.task.count(),
      prisma.task.count({ where: { status: 'completed' } }),
    ])

    // Get financial summary
    const projects = await prisma.project.findMany({
      select: {
        budget: true,
        actualCost: true,
        revenue: true,
        profitMargin: true,
      },
    })

    const financialSummary = projects.reduce(
      (acc, project) => {
        if (project.budget) acc.totalBudget += project.budget
        if (project.actualCost) acc.totalCost += project.actualCost
        if (project.revenue) acc.totalRevenue += project.revenue
        if (project.profitMargin) acc.totalProfit += project.profitMargin
        return acc
      },
      { totalBudget: 0, totalCost: 0, totalRevenue: 0, totalProfit: 0 }
    )

    // Get recent projects
    const recentProjects = await prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    })

    // Get recent clients
    const recentClients = await prisma.client.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    })

    // Get project status breakdown
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: true,
    })

    // Get projects by type
    const projectsByType = await prisma.project.groupBy({
      by: ['type'],
      _count: true,
    })

    // Get recent activity
    const recentActivity = await prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    })

    // Calculate task completion rate
    const taskCompletionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0

    // Calculate project completion rate
    const projectCompletionRate = totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0

    return NextResponse.json({
      success: true,
      dashboard: {
        overview: {
          projects: {
            total: totalProjects,
            active: activeProjects,
            completed: completedProjects,
            completionRate: projectCompletionRate,
          },
          clients: {
            total: totalClients,
            active: activeClients,
          },
          quotes: {
            total: totalQuotes,
            pending: pendingQuotes,
            accepted: acceptedQuotes,
          },
          tasks: {
            total: totalTasks,
            completed: completedTasks,
            completionRate: taskCompletionRate,
          },
        },
        financial: financialSummary,
        charts: {
          projectsByStatus: projectsByStatus.map(item => ({
            status: item.status,
            count: item._count,
          })),
          projectsByType: projectsByType.map(item => ({
            type: item.type,
            count: item._count,
          })),
        },
        recent: {
          projects: recentProjects,
          clients: recentClients,
          activity: recentActivity,
        },
      },
    })
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
