import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const targets = await prisma.salesTarget.findMany({
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({ targets });
  } catch (error: any) {
    console.error("Error fetching targets:", error);
    return NextResponse.json(
      { error: "Failed to fetch targets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const target = await prisma.salesTarget.create({
      data: {
        id: nanoid(),
        ...data,
      },
    });

    return NextResponse.json(target, { status: 201 });
  } catch (error: any) {
    console.error("Error creating target:", error);
    return NextResponse.json(
      { error: "Failed to create target" },
      { status: 500 }
    );
  }
}
