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

    const templates = await prisma.salesEmailTemplate.findMany({
      where,
      orderBy: [{ usageCount: "desc" }, { name: "asc" }],
    });

    return NextResponse.json({ templates });
  } catch (error: any) {
    console.error("Error fetching email templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch email templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const template = await prisma.salesEmailTemplate.create({
      data: {
        id: nanoid(),
        ...data,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error: any) {
    console.error("Error creating email template:", error);
    return NextResponse.json(
      { error: "Failed to create email template" },
      { status: 500 }
    );
  }
}
