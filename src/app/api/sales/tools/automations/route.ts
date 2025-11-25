import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const automations = await prisma.salesAutomation.findMany({
      orderBy: { executionCount: "desc" },
    });

    return NextResponse.json({ automations });
  } catch (error: any) {
    console.error("Error fetching automations:", error);
    return NextResponse.json(
      { error: "Failed to fetch automations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const automation = await prisma.salesAutomation.create({
      data: {
        id: nanoid(),
        ...data,
      },
    });

    return NextResponse.json(automation, { status: 201 });
  } catch (error: any) {
    console.error("Error creating automation:", error);
    return NextResponse.json(
      { error: "Failed to create automation" },
      { status: 500 }
    );
  }
}
