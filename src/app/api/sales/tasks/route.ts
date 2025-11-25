import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const taskType = searchParams.get("taskType");
    const assignedTo = searchParams.get("assignedTo");
    const leadId = searchParams.get("leadId");
    const opportunityId = searchParams.get("opportunityId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (taskType) where.taskType = taskType;
    if (assignedTo) where.assignedTo = assignedTo;
    if (leadId) where.leadId = leadId;
    if (opportunityId) where.opportunityId = opportunityId;

    const [tasks, total] = await Promise.all([
      prisma.salesTask.findMany({
        where,
        orderBy: { dueDate: "asc" },
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
      prisma.salesTask.count({ where }),
    ]);

    return NextResponse.json({
      tasks,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const task = await prisma.salesTask.create({
      data: {
        id: nanoid(),
        ...data,
      },
    });

    // Create activity log
    await prisma.salesActivity.create({
      data: {
        id: nanoid(),
        activityType: "task",
        subject: task.title,
        description: task.description,
        status: task.status === "completed" ? "completed" : "planned",
        dueDate: task.dueDate,
        completedDate: task.completedDate,
        leadId: task.leadId,
        opportunityId: task.opportunityId,
        assignedTo: task.assignedTo,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
