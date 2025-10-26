import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Generate unique quote number
function generateQuoteNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `QT-${year}${month}-${random}`
}

// GET /api/admin/quotes - List all quotes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const where: any = {}
    if (status) where.status = status
    if (clientId) where.clientId = clientId

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      quotes,
      count: quotes.length,
    })
  } catch (error: any) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/quotes - Create a new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      clientId,
      projectId,
      items,
      subtotal,
      tax,
      discount,
      validUntil,
      notes,
      terms,
    } = body

    // Validation
    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Quote title is required' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Quote must have at least one item' },
        { status: 400 }
      )
    }

    // Calculate total
    const taxAmount = tax || 0
    const discountAmount = discount || 0
    const total = subtotal + taxAmount - discountAmount

    // Generate unique quote number
    let quoteNumber = generateQuoteNumber()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.quote.findUnique({
        where: { quoteNumber },
      })
      if (!existing) break
      quoteNumber = generateQuoteNumber()
      attempts++
    }

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        title,
        description,
        clientId: clientId || null,
        projectId: projectId || null,
        items: JSON.stringify(items),
        subtotal: parseFloat(subtotal),
        tax: taxAmount,
        discount: discountAmount,
        total,
        validUntil: validUntil ? new Date(validUntil) : null,
        notes,
        terms,
        status: 'draft',
      },
      include: {
        client: true,
        project: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Created',
        entity: 'Quote',
        entityId: quote.id,
        description: `Created quote: ${quote.quoteNumber} - ${quote.title}`,
      },
    })

    return NextResponse.json({
      success: true,
      quote,
      message: 'Quote created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
