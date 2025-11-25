import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");

    const where: any = {};
    if (category) where.category = category;
    if (isActive !== null) where.isActive = isActive === "true";

    const playbooks = await prisma.salesPlaybook.findMany({
      where,
      orderBy: [{ viewCount: "desc" }, { name: "asc" }],
    });

    return NextResponse.json({ playbooks });
  } catch (error: any) {
    console.error("Error fetching playbooks:", error);
    return NextResponse.json(
      { error: "Failed to fetch playbooks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const playbook = await prisma.salesPlaybook.create({
      data: {
        id: nanoid(),
        ...data,
      },
    });

    return NextResponse.json(playbook, { status: 201 });
  } catch (error: any) {
    console.error("Error creating playbook:", error);
    return NextResponse.json(
      { error: "Failed to create playbook" },
      { status: 500 }
    );
  }
}
