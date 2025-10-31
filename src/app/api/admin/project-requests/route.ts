import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/admin/project-requests - Fetch all project requests
export async function GET(request: NextRequest) {
  try {
    console.log('📥 GET /api/admin/project-requests - Request received')
    
    const session = await getServerSession(authOptions)
    console.log('👤 Session:', { userId: session?.user?.id, role: session?.user?.role })

    if (!session || session.user.role !== 'admin') {
      console.log('❌ Unauthorized access attempt')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query params for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const limit = searchParams.get('limit')
    
    console.log('🔍 Filters:', { status, priority, limit })

    // Build where clause
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }
    if (priority) {
      where.priority = priority
    }

    console.log('📋 Where clause:', where)

    // Fetch project requests
    const requests = await prisma.projectRequest.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // pending first
        { createdAt: 'desc' }, // newest first
      ],
      take: limit ? parseInt(limit) : undefined,
    })

    console.log('✅ Found project requests:', requests.length)
    console.log('📦 Requests:', requests.map(r => ({ 
      id: r.id, 
      requestNumber: r.requestNumber, 
      status: r.status,
      clientName: r.clientName,
      projectName: r.projectName
    })))

    return NextResponse.json({
      success: true,
      requests,
      count: requests.length,
    })
  } catch (error) {
    console.error('❌ Error fetching project requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project requests' },
      { status: 500 }
    )
  }
}
