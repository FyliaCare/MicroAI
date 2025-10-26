import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Get single service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      service
    })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PATCH - Update service
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (priceType !== undefined) updateData.priceType = priceType
    if (basePrice !== undefined) updateData.basePrice = basePrice ? parseFloat(basePrice) : null
    if (minPrice !== undefined) updateData.minPrice = minPrice ? parseFloat(minPrice) : null
    if (maxPrice !== undefined) updateData.maxPrice = maxPrice ? parseFloat(maxPrice) : null
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate ? parseFloat(hourlyRate) : null
    if (features !== undefined) updateData.features = features ? JSON.stringify(features) : null
    if (deliverables !== undefined) updateData.deliverables = deliverables ? JSON.stringify(deliverables) : null
    if (duration !== undefined) updateData.duration = duration
    if (isActive !== undefined) updateData.isActive = isActive
    if (isPopular !== undefined) updateData.isPopular = isPopular
    if (icon !== undefined) updateData.icon = icon
    if (color !== undefined) updateData.color = color
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder
    if (tags !== undefined) updateData.tags = tags ? JSON.stringify(tags) : null
    if (notes !== undefined) updateData.notes = notes

    const service = await prisma.service.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      service
    })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.service.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
