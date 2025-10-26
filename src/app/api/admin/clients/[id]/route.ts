import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/clients/[id] - Get single client
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' },
        },
        quotes: {
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      client,
    })
  } catch (error: any) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/clients/[id] - Update client
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const existingClient = await prisma.client.findUnique({
      where: { id: params.id },
    })

    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    // Check email uniqueness if email is being updated
    if (body.email && body.email !== existingClient.email) {
      const emailExists = await prisma.client.findUnique({
        where: { email: body.email },
      })

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'A client with this email already exists' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.company !== undefined) updateData.company = body.company
    if (body.website !== undefined) updateData.website = body.website
    if (body.address !== undefined) updateData.address = body.address
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.status !== undefined) updateData.status = body.status

    const client = await prisma.client.update({
      where: { id: params.id },
      data: updateData,
      include: {
        projects: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Updated',
        entity: 'Client',
        entityId: client.id,
        description: `Updated client: ${client.name}`,
      },
    })

    return NextResponse.json({
      success: true,
      client,
      message: 'Client updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/clients/[id] - Delete client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      select: {
        name: true,
        _count: {
          select: {
            projects: true,
            quotes: true,
            invoices: true,
          },
        },
      },
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    // Check if client has active projects
    if (client._count.projects > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete client with ${client._count.projects} active project(s). Please delete or reassign projects first.`,
        },
        { status: 400 }
      )
    }

    // Delete related quotes and invoices
    await prisma.quote.deleteMany({
      where: { clientId: params.id },
    })

    await prisma.invoice.deleteMany({
      where: { clientId: params.id },
    })

    // Delete the client
    await prisma.client.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Deleted',
        entity: 'Client',
        entityId: params.id,
        description: `Deleted client: ${client.name}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
