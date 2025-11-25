import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

interface RevenueByPeriod {
  [key: string]: { period: string; revenue: number; deals: number };
}

interface ForecastByPeriod {
  [key: string]: { period: string; committed: number; bestCase: number; pipeline: number; deals: number };
}

interface RevenueByTeamMember {
  [key: string]: { id: string; name: string; revenue: number; deals: number };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "monthly"; // daily, weekly, monthly, quarterly, yearly
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let dateStart = new Date();
    let dateEnd = new Date();

    if (startDate && endDate) {
      dateStart = new Date(startDate);
      dateEnd = new Date(endDate);
    } else {
      // Default date ranges based on period
      switch (period) {
        case "daily":
          dateStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "weekly":
          dateStart = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          dateStart = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          break;
        case "quarterly":
          dateStart = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000);
          break;
        case "yearly":
          dateStart = new Date(Date.now() - 1095 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    // Get all closed-won opportunities in the date range
    const wonOpportunities = await prisma.salesOpportunity.findMany({
      where: {
        stage: "closed-won",
        actualCloseDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      select: {
        value: true,
        actualCloseDate: true,
        assignedTo: true,
        assignedToName: true,
      },
    });

    // Get pipeline opportunities
    const pipelineOpportunities = await prisma.salesOpportunity.findMany({
      where: {
        stage: {
          notIn: ["closed-won", "closed-lost"],
        },
        expectedCloseDate: {
          gte: new Date(),
        },
      },
      select: {
        value: true,
        probability: true,
        expectedCloseDate: true,
        stage: true,
        forecastCategory: true,
      },
    });

    // Calculate actual revenue
    const actualRevenue = wonOpportunities.reduce(
      (sum, opp) => sum + opp.value,
      0
    );

    // Calculate forecasted revenue by category
    const committedRevenue = pipelineOpportunities
      .filter((opp) => opp.forecastCategory === "commit")
      .reduce((sum, opp) => sum + opp.value * ((opp.probability || 0) / 100), 0);

    const bestCaseRevenue = pipelineOpportunities
      .filter((opp) => opp.forecastCategory === "best-case")
      .reduce((sum, opp) => sum + opp.value * ((opp.probability || 0) / 100), 0);

    const pipelineRevenue = pipelineOpportunities
      .filter((opp) => opp.forecastCategory === "pipeline")
      .reduce((sum, opp) => sum + opp.value * ((opp.probability || 0) / 100), 0);

    // Group by time period
    const revenueByPeriod: RevenueByPeriod = {};
    wonOpportunities.forEach((opp) => {
      if (!opp.actualCloseDate) return;

      const date = new Date(opp.actualCloseDate);
      let key = "";

      switch (period) {
        case "daily":
          key = date.toISOString().split("T")[0];
          break;
        case "weekly":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split("T")[0];
          break;
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          break;
        case "quarterly":
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
          break;
        case "yearly":
          key = date.getFullYear().toString();
          break;
      }

      if (!revenueByPeriod[key]) {
        revenueByPeriod[key] = { period: key, revenue: 0, deals: 0 };
      }
      revenueByPeriod[key].revenue += opp.value;
      revenueByPeriod[key].deals += 1;
    });

    // Group pipeline by expected close period
    const forecastByPeriod: ForecastByPeriod = {};
    pipelineOpportunities.forEach((opp) => {
      if (!opp.expectedCloseDate) return;

      const date = new Date(opp.expectedCloseDate);
      let key = "";

      switch (period) {
        case "daily":
          key = date.toISOString().split("T")[0];
          break;
        case "weekly":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split("T")[0];
          break;
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          break;
        case "quarterly":
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
          break;
        case "yearly":
          key = date.getFullYear().toString();
          break;
      }

      if (!forecastByPeriod[key]) {
        forecastByPeriod[key] = {
          period: key,
          committed: 0,
          bestCase: 0,
          pipeline: 0,
          deals: 0,
        };
      }

      const weightedValue = opp.value * ((opp.probability || 0) / 100);
      
      if (opp.forecastCategory === "commit") {
        forecastByPeriod[key].committed += weightedValue;
      } else if (opp.forecastCategory === "best-case") {
        forecastByPeriod[key].bestCase += weightedValue;
      } else {
        forecastByPeriod[key].pipeline += weightedValue;
      }
      
      forecastByPeriod[key].deals += 1;
    });

    // Group by team member
    const revenueByTeamMember: RevenueByTeamMember = {};
    wonOpportunities.forEach((opp) => {
      const member = opp.assignedTo || "unassigned";
      const memberName = opp.assignedToName || "Unassigned";

      if (!revenueByTeamMember[member]) {
        revenueByTeamMember[member] = {
          id: member,
          name: memberName,
          revenue: 0,
          deals: 0,
        };
      }

      revenueByTeamMember[member].revenue += opp.value;
      revenueByTeamMember[member].deals += 1;
    });

    return NextResponse.json({
      summary: {
        actualRevenue,
        committedRevenue,
        bestCaseRevenue,
        pipelineRevenue,
        totalForecast:
          actualRevenue + committedRevenue + bestCaseRevenue + pipelineRevenue,
        closedDeals: wonOpportunities.length,
        pipelineDeals: pipelineOpportunities.length,
      },
      trends: {
        revenue: Object.values(revenueByPeriod).sort((a, b) =>
          a.period.localeCompare(b.period)
        ),
        forecast: Object.values(forecastByPeriod).sort((a, b) =>
          a.period.localeCompare(b.period)
        ),
      },
      team: Object.values(revenueByTeamMember).sort(
        (a, b) => b.revenue - a.revenue
      ),
    });
  } catch (error: any) {
    console.error("Error fetching revenue forecast:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue forecast" },
      { status: 500 }
    );
  }
}
