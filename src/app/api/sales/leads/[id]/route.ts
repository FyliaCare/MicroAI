import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await prisma.salesLead.findUnique({
      where: { id: params.id },
      include: {
        SalesActivity: {
          orderBy: { createdAt: "desc" },
          take: 50,
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
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    console.error("Error fetching lead:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead" },
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

    const lead = await prisma.salesLead.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    // Log status change
    if (data.status) {
      await prisma.salesActivity.create({
        data: {
          id: nanoid(),
          activityType: "note",
          subject: "Lead Status Changed",
          description: `Lead status changed to ${data.status}`,
          status: "completed",
          completedDate: new Date(),
          leadId: lead.id,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.salesLead.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
