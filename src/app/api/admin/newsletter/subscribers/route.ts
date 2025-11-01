import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET: List all subscribers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role
    
    if (!session || (userRole !== 'admin' && userRole !== 'super-admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.newsletterSubscriber.count({ where })
    ])

    // Get stats
    const stats = await prisma.newsletterSubscriber.groupBy({
      by: ['status'],
      _count: true,
    })

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: stats.reduce((acc: any, stat: any) => {
        acc[stat.status] = stat._count
        return acc
      }, {} as Record<string, number>),
    })

  } catch (error) {
    console.error('Get subscribers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}

// POST: Add subscriber manually
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role
    
    if (!session || (userRole !== 'admin' && userRole !== 'super-admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: body.email,
        name: body.name,
        source: 'admin',
        status: 'active',
        subscribed: true,
        confirmedAt: new Date(),
      }
    })

    return NextResponse.json({ success: true, subscriber }, { status: 201 })

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }
    console.error('Add subscriber error:', error)
    return NextResponse.json(
      { error: 'Failed to add subscriber' },
      { status: 500 }
    )
  }
}

// DELETE: Remove subscriber
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role
    
    if (!session || (userRole !== 'admin' && userRole !== 'super-admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      )
    }

    await prisma.newsletterSubscriber.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete subscriber error:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    )
  }
}
