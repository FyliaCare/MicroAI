import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const callType = searchParams.get("callType");
    const assignedTo = searchParams.get("assignedTo");
    const leadId = searchParams.get("leadId");
    const opportunityId = searchParams.get("opportunityId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (status) where.status = status;
    if (callType) where.callType = callType;
    if (assignedTo) where.assignedTo = assignedTo;
    if (leadId) where.leadId = leadId;
    if (opportunityId) where.opportunityId = opportunityId;

    const [calls, total] = await Promise.all([
      prisma.salesCall.findMany({
        where,
        orderBy: { startTime: "desc" },
        take: limit,
        skip: offset,
        include: {
          SalesLead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              company: true,
              phone: true,
            },
          },
          SalesOpportunity: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.salesCall.count({ where }),
    ]);

    return NextResponse.json({
      calls,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const call = await prisma.salesCall.create({
      data: {
        id: nanoid(),
        ...data,
      },
    });

    // Create activity log
    await prisma.salesActivity.create({
      data: {
        id: nanoid(),
        activityType: "call",
        subject: call.subject,
        description: call.notes,
        status: call.status === "completed" ? "completed" : "planned",
        dueDate: call.startTime,
        completedDate: call.status === "completed" ? call.endTime : undefined,
        duration: call.duration ? Math.floor(call.duration / 60) : undefined,
        leadId: call.leadId,
        opportunityId: call.opportunityId,
        assignedTo: call.assignedTo,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(call, { status: 201 });
  } catch (error: any) {
    console.error("Error creating call:", error);
    return NextResponse.json(
      { error: "Failed to create call" },
      { status: 500 }
    );
  }
}
