import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/clients - List all clients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status) where.status = status

    const clients = await prisma.client.findMany({
      where,
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
            budget: true,
          },
        },
        quotes: {
          select: {
            id: true,
            quoteNumber: true,
            total: true,
            status: true,
          },
        },
        _count: {
          select: {
            projects: true,
            quotes: true,
            invoices: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      clients,
      count: clients.length,
    })
  } catch (error: any) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      email,
      phone,
      company,
      website,
      address,
      notes,
      status,
    } = body

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Client name is required' },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Client email is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingClient = await prisma.client.findUnique({
      where: { email },
    })

    if (existingClient) {
      return NextResponse.json(
        { success: false, error: 'A client with this email already exists' },
        { status: 400 }
      )
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        company,
        website,
        address,
        notes,
        status: status || 'active',
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Created',
        entity: 'Client',
        entityId: client.id,
        description: `Created client: ${client.name}`,
      },
    })

    return NextResponse.json({
      success: true,
      client,
      message: 'Client created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
