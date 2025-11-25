import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const direction = searchParams.get("direction");
    const assignedTo = searchParams.get("assignedTo");
    const leadId = searchParams.get("leadId");
    const opportunityId = searchParams.get("opportunityId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (status) where.status = status;
    if (direction) where.direction = direction;
    if (assignedTo) where.assignedTo = assignedTo;
    if (leadId) where.leadId = leadId;
    if (opportunityId) where.opportunityId = opportunityId;

    const [emails, total] = await Promise.all([
      prisma.salesEmail.findMany({
        where,
        orderBy: { sentAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          SalesLead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
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
      prisma.salesEmail.count({ where }),
    ]);

    return NextResponse.json({
      emails,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const email = await prisma.salesEmail.create({
      data: {
        id: nanoid(),
        ...data,
      },
    });

    // Create activity log
    await prisma.salesActivity.create({
      data: {
        id: nanoid(),
        activityType: "email",
        subject: email.subject,
        description: `Email ${email.direction}: ${email.subject}`,
        status: email.status === "sent" ? "completed" : "planned",
        completedDate: email.sentAt,
        leadId: email.leadId,
        opportunityId: email.opportunityId,
        assignedTo: email.assignedTo,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(email, { status: 201 });
  } catch (error: any) {
    console.error("Error creating email:", error);
    return NextResponse.json(
      { error: "Failed to create email" },
      { status: 500 }
    );
  }
}
