import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stage = searchParams.get("stage");
    const assignedTo = searchParams.get("assignedTo");
    const forecastCategory = searchParams.get("forecastCategory");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (stage) where.stage = stage;
    if (assignedTo) where.assignedTo = assignedTo;
    if (forecastCategory) where.forecastCategory = forecastCategory;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [opportunities, total] = await Promise.all([
      prisma.salesOpportunity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.salesOpportunity.count({ where }),
    ]);

    return NextResponse.json({
      opportunities,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const opportunityNumber = `OPP-${nanoid(10)}`;

    const opportunity = await prisma.salesOpportunity.create({
      data: {
        id: nanoid(),
        opportunityNumber,
        ...data,
      },
    });

    // Create activity log
    await prisma.salesActivity.create({
      data: {
        id: nanoid(),
        activityType: "note",
        subject: "Opportunity Created",
        description: `New opportunity ${opportunity.name} created with value $${opportunity.value}`,
        status: "completed",
        completedDate: new Date(),
        opportunityId: opportunity.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(opportunity, { status: 201 });
  } catch (error: any) {
    console.error("Error creating opportunity:", error);
    return NextResponse.json(
      { error: "Failed to create opportunity" },
      { status: 500 }
    );
  }
}
