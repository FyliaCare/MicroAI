import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const assignedTo = searchParams.get("assignedTo");

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const leadFilter: any = {};
    if (Object.keys(dateFilter).length > 0) {
      leadFilter.createdAt = dateFilter;
    }
    if (assignedTo) leadFilter.assignedTo = assignedTo;

    const oppFilter: any = {};
    if (Object.keys(dateFilter).length > 0) {
      oppFilter.createdAt = dateFilter;
    }
    if (assignedTo) oppFilter.assignedTo = assignedTo;

    // Fetch all key metrics in parallel
    const [
      totalLeads,
      newLeads,
      qualifiedLeads,
      totalOpportunities,
      wonOpportunities,
      lostOpportunities,
      pipelineValue,
      wonValue,
      conversionRate,
      leadsByStatus,
      leadsBySource,
      opportunitiesByStage,
      recentActivities,
      upcomingTasks,
      teamPerformance,
    ] = await Promise.all([
      // Total leads
      prisma.salesLead.count({ where: leadFilter }),

      // New leads (last 30 days)
      prisma.salesLead.count({
        where: {
          ...leadFilter,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Qualified leads
      prisma.salesLead.count({
        where: {
          ...leadFilter,
          status: "qualified",
        },
      }),

      // Total opportunities
      prisma.salesOpportunity.count({ where: oppFilter }),

      // Won opportunities
      prisma.salesOpportunity.count({
        where: {
          ...oppFilter,
          stage: "closed-won",
        },
      }),

      // Lost opportunities
      prisma.salesOpportunity.count({
        where: {
          ...oppFilter,
          stage: "closed-lost",
        },
      }),

      // Pipeline value
      prisma.salesOpportunity.aggregate({
        where: {
          ...oppFilter,
          stage: {
            notIn: ["closed-won", "closed-lost"],
          },
        },
        _sum: {
          value: true,
        },
      }),

      // Won value
      prisma.salesOpportunity.aggregate({
        where: {
          ...oppFilter,
          stage: "closed-won",
        },
        _sum: {
          value: true,
        },
      }),

      // Conversion rate calculation (leads to opportunities)
      Promise.all([
        prisma.salesLead.count({
          where: {
            ...leadFilter,
            convertedToOpportunity: true,
          },
        }),
        prisma.salesLead.count({ where: leadFilter }),
      ]).then(([converted, total]) => 
        total > 0 ? ((converted / total) * 100).toFixed(2) : "0.00"
      ),

      // Leads by status
      prisma.salesLead.groupBy({
        by: ["status"],
        where: leadFilter,
        _count: {
          status: true,
        },
      }),

      // Leads by source
      prisma.salesLead.groupBy({
        by: ["source"],
        where: leadFilter,
        _count: {
          source: true,
        },
        orderBy: {
          _count: {
            source: "desc",
          },
        },
        take: 10,
      }),

      // Opportunities by stage
      prisma.salesOpportunity.groupBy({
        by: ["stage"],
        where: oppFilter,
        _count: {
          stage: true,
        },
        _sum: {
          value: true,
        },
      }),

      // Recent activities
      prisma.salesActivity.findMany({
        where: assignedTo ? { assignedTo } : {},
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          SalesLead: {
            select: {
              firstName: true,
              lastName: true,
              company: true,
            },
          },
          SalesOpportunity: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Upcoming tasks
      prisma.salesTask.findMany({
        where: {
          status: { notIn: ["completed", "cancelled"] },
          dueDate: { gte: new Date() },
          ...(assignedTo && { assignedTo }),
        },
        orderBy: { dueDate: "asc" },
        take: 10,
        include: {
          SalesLead: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          SalesOpportunity: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Team performance
      prisma.salesOpportunity.groupBy({
        by: ["assignedTo"],
        where: oppFilter,
        _count: {
          id: true,
        },
        _sum: {
          value: true,
        },
        orderBy: {
          _sum: {
            value: "desc",
          },
        },
        take: 10,
      }),
    ]);

    // Calculate average deal size
    const avgDealSize =
      wonOpportunities > 0
        ? ((wonValue._sum.value || 0) / wonOpportunities).toFixed(2)
        : "0.00";

    // Calculate win rate
    const totalClosed = wonOpportunities + lostOpportunities;
    const winRate =
      totalClosed > 0
        ? ((wonOpportunities / totalClosed) * 100).toFixed(2)
        : "0.00";

    return NextResponse.json({
      overview: {
        totalLeads,
        newLeads,
        qualifiedLeads,
        totalOpportunities,
        wonOpportunities,
        lostOpportunities,
        pipelineValue: pipelineValue._sum.value || 0,
        wonValue: wonValue._sum.value || 0,
        conversionRate: parseFloat(conversionRate),
        avgDealSize: parseFloat(avgDealSize),
        winRate: parseFloat(winRate),
      },
      charts: {
        leadsByStatus,
        leadsBySource,
        opportunitiesByStage,
      },
      activities: {
        recent: recentActivities,
        upcomingTasks,
      },
      performance: {
        team: teamPerformance,
      },
    });
  } catch (error: any) {
    console.error("Error fetching dashboard analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard analytics" },
      { status: 500 }
    );
  }
}
