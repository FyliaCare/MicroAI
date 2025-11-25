import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const userId = searchParams.get("userId");

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const activityFilter: any = {};
    if (Object.keys(dateFilter).length > 0) {
      activityFilter.createdAt = dateFilter;
    }
    if (userId) activityFilter.assignedTo = userId;

    // Fetch activity metrics
    const [
      totalActivities,
      activitiesByType,
      completedActivities,
      pendingActivities,
      callMetrics,
      emailMetrics,
      meetingMetrics,
      taskMetrics,
      dailyActivity,
    ] = await Promise.all([
      // Total activities
      prisma.salesActivity.count({ where: activityFilter }),

      // Activities by type
      prisma.salesActivity.groupBy({
        by: ["activityType"],
        where: activityFilter,
        _count: {
          id: true,
        },
      }),

      // Completed activities
      prisma.salesActivity.count({
        where: {
          ...activityFilter,
          status: "completed",
        },
      }),

      // Pending activities
      prisma.salesActivity.count({
        where: {
          ...activityFilter,
          status: { in: ["planned", "in-progress"] },
        },
      }),

      // Call metrics
      prisma.salesCall.groupBy({
        by: ["outcome"],
        where: {
          ...(Object.keys(dateFilter).length > 0 && { startTime: dateFilter }),
          ...(userId && { assignedTo: userId }),
        },
        _count: {
          id: true,
        },
      }),

      // Email metrics
      prisma.salesEmail.aggregate({
        where: {
          ...(Object.keys(dateFilter).length > 0 && { sentAt: dateFilter }),
          ...(userId && { assignedTo: userId }),
        },
        _count: {
          id: true,
        },
        _sum: {
          openedCount: true,
          clickedCount: true,
        },
      }),

      // Meeting metrics
      prisma.salesMeeting.groupBy({
        by: ["status"],
        where: {
          ...(Object.keys(dateFilter).length > 0 && { startTime: dateFilter }),
          ...(userId && { organizer: userId }),
        },
        _count: {
          id: true,
        },
      }),

      // Task metrics
      prisma.salesTask.groupBy({
        by: ["status"],
        where: {
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
          ...(userId && { assignedTo: userId }),
        },
        _count: {
          id: true,
        },
      }),

      // Daily activity trend (last 30 days)
      prisma.salesActivity
        .findMany({
          where: {
            ...activityFilter,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          select: {
            createdAt: true,
            activityType: true,
          },
        })
        .then((activities) => {
          const dailyData: any = {};

          activities.forEach((activity) => {
            const date = activity.createdAt.toISOString().split("T")[0];

            if (!dailyData[date]) {
              dailyData[date] = {
                date,
                calls: 0,
                emails: 0,
                meetings: 0,
                tasks: 0,
                total: 0,
              };
            }

            dailyData[date].total += 1;
            if (activity.activityType === "call") dailyData[date].calls += 1;
            if (activity.activityType === "email") dailyData[date].emails += 1;
            if (activity.activityType === "meeting")
              dailyData[date].meetings += 1;
            if (activity.activityType === "task") dailyData[date].tasks += 1;
          });

          return Object.values(dailyData).sort((a: any, b: any) =>
            a.date.localeCompare(b.date)
          );
        }),
    ]);

    // Calculate completion rate
    const completionRate =
      totalActivities > 0
        ? ((completedActivities / totalActivities) * 100).toFixed(2)
        : "0";

    // Email engagement rate
    const emailEngagementRate =
      emailMetrics._count.id > 0
        ? (
            ((emailMetrics._sum.openedCount || 0) / emailMetrics._count.id) *
            100
          ).toFixed(2)
        : "0";

    const emailClickRate =
      (emailMetrics._sum.openedCount || 0) > 0
        ? (
            ((emailMetrics._sum.clickedCount || 0) /
              (emailMetrics._sum.openedCount || 1)) *
            100
          ).toFixed(2)
        : "0";

    return NextResponse.json({
      overview: {
        totalActivities,
        completedActivities,
        pendingActivities,
        completionRate: parseFloat(completionRate),
      },
      byType: activitiesByType.map((type) => ({
        type: type.activityType,
        count: type._count.id,
      })),
      calls: {
        byOutcome: callMetrics.map((call) => ({
          outcome: call.outcome,
          count: call._count.id,
        })),
      },
      emails: {
        total: emailMetrics._count.id,
        totalOpened: emailMetrics._sum.openedCount || 0,
        totalClicked: emailMetrics._sum.clickedCount || 0,
        openRate: parseFloat(emailEngagementRate),
        clickRate: parseFloat(emailClickRate),
      },
      meetings: {
        byStatus: meetingMetrics.map((meeting) => ({
          status: meeting.status,
          count: meeting._count.id,
        })),
      },
      tasks: {
        byStatus: taskMetrics.map((task) => ({
          status: task.status,
          count: task._count.id,
        })),
      },
      trends: {
        daily: dailyActivity,
      },
    });
  } catch (error: any) {
    console.error("Error fetching activity analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity analytics" },
      { status: 500 }
    );
  }
}
