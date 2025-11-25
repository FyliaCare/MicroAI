import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scriptType = searchParams.get("scriptType");
    const isActive = searchParams.get("isActive");

    const where: any = {};
    if (scriptType) where.scriptType = scriptType;
    if (isActive !== null) where.isActive = isActive === "true";

    const scripts = await prisma.salesCallScript.findMany({
      where,
      orderBy: [{ successRate: "desc" }, { usageCount: "desc" }, { name: "asc" }],
    });

    return NextResponse.json({ scripts });
  } catch (error: any) {
    console.error("Error fetching call scripts:", error);
    return NextResponse.json(
      { error: "Failed to fetch call scripts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const script = await prisma.salesCallScript.create({
      data: {
        id: nanoid(),
        ...data,
      },
    });

    return NextResponse.json(script, { status: 201 });
  } catch (error: any) {
    console.error("Error creating call script:", error);
    return NextResponse.json(
      { error: "Failed to create call script" },
      { status: 500 }
    );
  }
}
