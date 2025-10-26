import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - List all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    const where: any = {}

    if (category) {
      where.category = category
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      services,
      total: services.length
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      description,
      category,
      priceType,
      basePrice,
      minPrice,
      maxPrice,
      hourlyRate,
      features,
      deliverables,
      duration,
      isActive,
      isPopular,
      icon,
      color,
      sortOrder,
      tags,
      notes
    } = body

    // Validation
    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        category,
        priceType: priceType || 'fixed',
        basePrice: basePrice ? parseFloat(basePrice) : null,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        features: features ? JSON.stringify(features) : null,
        deliverables: deliverables ? JSON.stringify(deliverables) : null,
        duration,
        isActive: isActive !== undefined ? isActive : true,
        isPopular: isPopular || false,
        icon,
        color,
        sortOrder: sortOrder || 0,
        tags: tags ? JSON.stringify(tags) : null,
        notes
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      service
    })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
