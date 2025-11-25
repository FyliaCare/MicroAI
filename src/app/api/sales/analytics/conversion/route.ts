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

    // Fetch conversion funnel data
    const [
      totalLeads,
      contactedLeads,
      qualifiedLeads,
      proposalLeads,
      negotiationLeads,
      wonLeads,
      lostLeads,
      avgTimeToQualify,
      avgTimeToClose,
      opportunitiesByStage,
    ] = await Promise.all([
      // Total leads
      prisma.salesLead.count({ where: leadFilter }),

      // Contacted leads
      prisma.salesLead.count({
        where: {
          ...leadFilter,
          status: { in: ["contacted", "qualified", "proposal", "negotiation", "won"] },
        },
      }),

      // Qualified leads
      prisma.salesLead.count({
        where: {
          ...leadFilter,
          status: { in: ["qualified", "proposal", "negotiation", "won"] },
        },
      }),

      // Proposal stage
      prisma.salesLead.count({
        where: {
          ...leadFilter,
          status: { in: ["proposal", "negotiation", "won"] },
        },
      }),

      // Negotiation stage
      prisma.salesLead.count({
        where: {
          ...leadFilter,
          status: { in: ["negotiation", "won"] },
        },
      }),

      // Won
      prisma.salesLead.count({
        where: {
          ...leadFilter,
          status: "won",
        },
      }),

      // Lost
      prisma.salesLead.count({
        where: {
          ...leadFilter,
          status: "lost",
        },
      }),

      // Average time to qualify (in days)
      prisma.salesLead
        .findMany({
          where: {
            ...leadFilter,
            status: { in: ["qualified", "proposal", "negotiation", "won"] },
          },
          select: {
            createdAt: true,
            updatedAt: true,
          },
        })
        .then((leads) => {
          if (leads.length === 0) return 0;
          const totalDays = leads.reduce((sum, lead) => {
            const days = Math.floor(
              (lead.updatedAt.getTime() - lead.createdAt.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return sum + days;
          }, 0);
          return Math.round(totalDays / leads.length);
        }),

      // Average time to close (in days)
      prisma.salesOpportunity
        .findMany({
          where: {
            ...oppFilter,
            stage: "closed-won",
            actualCloseDate: { not: null },
          },
          select: {
            createdAt: true,
            actualCloseDate: true,
          },
        })
        .then((opps) => {
          if (opps.length === 0) return 0;
          const totalDays = opps.reduce((sum, opp) => {
            if (!opp.actualCloseDate) return sum;
            const days = Math.floor(
              (opp.actualCloseDate.getTime() - opp.createdAt.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return sum + days;
          }, 0);
          return Math.round(totalDays / opps.length);
        }),

      // Opportunities by stage with value
      prisma.salesOpportunity.groupBy({
        by: ["stage"],
        where: oppFilter,
        _count: {
          id: true,
        },
        _sum: {
          value: true,
        },
      }),
    ]);

    // Calculate conversion rates
    const contactedRate =
      totalLeads > 0 ? ((contactedLeads / totalLeads) * 100).toFixed(2) : "0";
    const qualifiedRate =
      contactedLeads > 0
        ? ((qualifiedLeads / contactedLeads) * 100).toFixed(2)
        : "0";
    const proposalRate =
      qualifiedLeads > 0
        ? ((proposalLeads / qualifiedLeads) * 100).toFixed(2)
        : "0";
    const negotiationRate =
      proposalLeads > 0
        ? ((negotiationLeads / proposalLeads) * 100).toFixed(2)
        : "0";
    const winRate =
      negotiationLeads > 0
        ? ((wonLeads / negotiationLeads) * 100).toFixed(2)
        : "0";

    // Overall conversion rate
    const overallConversionRate =
      totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(2) : "0";

    // Calculate stage metrics for opportunities
    const stageMetrics = opportunitiesByStage.map((stage) => {
      const avgValue =
        stage._count.id > 0
          ? Math.round((stage._sum.value || 0) / stage._count.id)
          : 0;

      return {
        stage: stage.stage,
        count: stage._count.id,
        totalValue: stage._sum.value || 0,
        avgValue,
      };
    });

    return NextResponse.json({
      funnel: {
        leads: totalLeads,
        contacted: contactedLeads,
        qualified: qualifiedLeads,
        proposal: proposalLeads,
        negotiation: negotiationLeads,
        won: wonLeads,
        lost: lostLeads,
      },
      conversionRates: {
        toContacted: parseFloat(contactedRate),
        toQualified: parseFloat(qualifiedRate),
        toProposal: parseFloat(proposalRate),
        toNegotiation: parseFloat(negotiationRate),
        toWon: parseFloat(winRate),
        overall: parseFloat(overallConversionRate),
      },
      timingMetrics: {
        avgTimeToQualify,
        avgTimeToClose,
      },
      opportunityStages: stageMetrics,
    });
  } catch (error: any) {
    console.error("Error fetching conversion analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversion analytics" },
      { status: 500 }
    );
  }
}
