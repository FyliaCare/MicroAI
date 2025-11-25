import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activityType = searchParams.get("activityType");
    const status = searchParams.get("status");
    const assignedTo = searchParams.get("assignedTo");
    const leadId = searchParams.get("leadId");
    const opportunityId = searchParams.get("opportunityId");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (activityType) where.activityType = activityType;
    if (status) where.status = status;
    if (assignedTo) where.assignedTo = assignedTo;
    if (leadId) where.leadId = leadId;
    if (opportunityId) where.opportunityId = opportunityId;

    const [activities, total] = await Promise.all([
      prisma.salesActivity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          SalesLead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              company: true,
            },
          },
          SalesOpportunity: {
            select: {
              id: true,
              name: true,
              value: true,
            },
          },
        },
      }),
      prisma.salesActivity.count({ where }),
    ]);

    return NextResponse.json({
      activities,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const activity = await prisma.salesActivity.create({
      data: {
        id: nanoid(),
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error: any) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
