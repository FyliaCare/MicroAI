import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        milestones: {
          orderBy: { dueDate: 'asc' },
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
        },
        quote: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Parse techStack from string to array
    const projectData = {
      ...project,
      techStack: project.techStack && project.techStack.trim()
        ? project.techStack.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [],
    }

    return NextResponse.json({
      success: true,
      project: projectData,
    })
  } catch (error: any) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/projects/[id] - Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    
    // Only update fields that are provided
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.type !== undefined) updateData.type = body.type
    if (body.status !== undefined) updateData.status = body.status
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.budget !== undefined) updateData.budget = body.budget ? parseFloat(body.budget) : null
    if (body.actualCost !== undefined) updateData.actualCost = body.actualCost ? parseFloat(body.actualCost) : null
    if (body.revenue !== undefined) updateData.revenue = body.revenue ? parseFloat(body.revenue) : null
    if (body.profitMargin !== undefined) updateData.profitMargin = body.profitMargin ? parseFloat(body.profitMargin) : null
    if (body.startDate !== undefined) updateData.startDate = body.startDate ? new Date(body.startDate) : null
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null
    if (body.deadline !== undefined) updateData.deadline = body.deadline ? new Date(body.deadline) : null
    if (body.completedAt !== undefined) updateData.completedAt = body.completedAt ? new Date(body.completedAt) : null
    if (body.techStack !== undefined) {
      // Handle techStack as array or string
      if (Array.isArray(body.techStack)) {
        updateData.techStack = body.techStack.length > 0 ? body.techStack.join(', ') : null
      } else if (typeof body.techStack === 'string') {
        updateData.techStack = body.techStack || null
      } else {
        updateData.techStack = null
      }
    }
    if (body.githubRepo !== undefined) updateData.githubRepo = body.githubRepo
    if (body.liveUrl !== undefined) updateData.liveUrl = body.liveUrl
    if (body.stagingUrl !== undefined) updateData.stagingUrl = body.stagingUrl
    if (body.progress !== undefined) updateData.progress = parseInt(body.progress)
    if (body.requirements !== undefined) updateData.requirements = body.requirements
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.clientId !== undefined) updateData.clientId = body.clientId || null

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
      include: {
        client: true,
        tasks: true,
        milestones: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Updated',
        entity: 'Project',
        entityId: project.id,
        description: `Updated project: ${project.name}`,
        metadata: JSON.stringify(Object.keys(updateData)),
      },
    })

    return NextResponse.json({
      success: true,
      project,
      message: 'Project updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { name: true },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Delete related records first (cascade delete)
    await prisma.task.deleteMany({
      where: { projectId: params.id },
    })

    await prisma.milestone.deleteMany({
      where: { projectId: params.id },
    })

    await prisma.invoice.deleteMany({
      where: { projectId: params.id },
    })

    await prisma.quote.deleteMany({
      where: { projectId: params.id },
    })

    // Delete the project
    await prisma.project.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Deleted',
        entity: 'Project',
        entityId: params.id,
        description: `Deleted project: ${project.name}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
