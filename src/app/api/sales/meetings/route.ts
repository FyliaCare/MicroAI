import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const meetingType = searchParams.get("meetingType");
    const organizer = searchParams.get("organizer");
    const leadId = searchParams.get("leadId");
    const opportunityId = searchParams.get("opportunityId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (status) where.status = status;
    if (meetingType) where.meetingType = meetingType;
    if (organizer) where.organizer = organizer;
    if (leadId) where.leadId = leadId;
    if (opportunityId) where.opportunityId = opportunityId;

    const [meetings, total] = await Promise.all([
      prisma.salesMeeting.findMany({
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
      prisma.salesMeeting.count({ where }),
    ]);

    return NextResponse.json({
      meetings,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const meeting = await prisma.salesMeeting.create({
      data: {
        id: nanoid(),
        ...data,
      },
    });

    // Create activity log
    await prisma.salesActivity.create({
      data: {
        id: nanoid(),
        activityType: "meeting",
        subject: meeting.title,
        description: meeting.description,
        status: meeting.status === "completed" ? "completed" : "planned",
        dueDate: meeting.startTime,
        completedDate:
          meeting.status === "completed" ? meeting.endTime : undefined,
        duration: meeting.duration,
        leadId: meeting.leadId,
        opportunityId: meeting.opportunityId,
        assignedTo: meeting.organizer,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error: any) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
