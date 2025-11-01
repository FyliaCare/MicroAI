import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET: List all newsletters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status) {
      where.status = status
    }

    const [newsletters, total] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          subject: true,
          status: true,
          sentAt: true,
          sentTo: true,
          openedCount: true,
          clickedCount: true,
          createdBy: true,
          createdByName: true,
          createdAt: true,
        }
      }),
      prisma.newsletter.count({ where })
    ])

    return NextResponse.json({
      newsletters,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Get newsletters error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletters' },
      { status: 500 }
    )
  }
}

// POST: Create draft newsletter
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    if (!body.subject) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { status: 400 }
      )
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        subject: body.subject,
        content: body.content || '',
        textContent: body.textContent,
        previewText: body.previewText,
        status: 'draft',
        createdBy: session.user?.id,
        createdByName: session.user?.name || session.user?.email,
        campaign: body.campaign,
        tags: body.tags ? JSON.stringify(body.tags) : undefined,
      }
    })

    return NextResponse.json({ success: true, newsletter }, { status: 201 })

  } catch (error) {
    console.error('Create newsletter error:', error)
    return NextResponse.json(
      { error: 'Failed to create newsletter' },
      { status: 500 }
    )
  }
}
