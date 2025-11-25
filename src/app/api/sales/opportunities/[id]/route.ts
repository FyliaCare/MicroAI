import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const opportunity = await prisma.salesOpportunity.findUnique({
      where: { id: params.id },
      include: {
        SalesActivity: {
          orderBy: { createdAt: "desc" },
        },
        SalesNote: {
          orderBy: { createdAt: "desc" },
        },
        SalesCall: {
          orderBy: { createdAt: "desc" },
        },
        SalesEmail: {
          orderBy: { createdAt: "desc" },
        },
        SalesMeeting: {
          orderBy: { startTime: "desc" },
        },
        SalesTask: {
          orderBy: { dueDate: "asc" },
        },
        SalesProduct: true,
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunity);
  } catch (error: any) {
    console.error("Error fetching opportunity:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunity" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const opportunity = await prisma.salesOpportunity.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date(),
        stageChangedAt: data.stage ? new Date() : undefined,
      },
    });

    // Log stage change
    if (data.stage) {
      await prisma.salesActivity.create({
        data: {
          id: nanoid(),
          activityType: "note",
          subject: "Stage Changed",
          description: `Opportunity moved to ${data.stage} stage`,
          status: "completed",
          completedDate: new Date(),
          opportunityId: opportunity.id,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(opportunity);
  } catch (error: any) {
    console.error("Error updating opportunity:", error);
    return NextResponse.json(
      { error: "Failed to update opportunity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.salesOpportunity.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting opportunity:", error);
    return NextResponse.json(
      { error: "Failed to delete opportunity" },
      { status: 500 }
    );
  }
}
