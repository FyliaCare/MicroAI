import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const rating = searchParams.get("rating");
    const source = searchParams.get("source");
    const assignedTo = searchParams.get("assignedTo");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (status) where.status = status;
    if (rating) where.rating = rating;
    if (source) where.source = source;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.salesLead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.salesLead.count({ where }),
    ]);

    return NextResponse.json({
      leads,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Generate lead number
    const leadNumber = `LEAD-${nanoid(10)}`;

    // Calculate lead score based on various factors
    let leadScore = 0;
    if (data.email) leadScore += 10;
    if (data.phone) leadScore += 10;
    if (data.company) leadScore += 15;
    if (data.website) leadScore += 10;
    if (data.budget && data.budget > 5000) leadScore += 20;
    if (data.decisionMaker) leadScore += 25;
    if (data.timeline === "immediate") leadScore += 20;

    const lead = await prisma.salesLead.create({
      data: {
        id: nanoid(),
        leadNumber,
        leadScore,
        ...data,
      },
    });

    // Create activity log
    await prisma.salesActivity.create({
      data: {
        id: nanoid(),
        activityType: "note",
        subject: "Lead Created",
        description: `New lead ${lead.firstName} ${lead.lastName} from ${lead.company || "Unknown"} created`,
        status: "completed",
        completedDate: new Date(),
        leadId: lead.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
