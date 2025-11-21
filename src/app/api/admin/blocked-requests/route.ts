import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'

// GET /api/admin/blocked-requests - Get blocked requests
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIdentifier = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientIdentifier, { windowMs: 60 * 1000, maxRequests: 100 })
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const minScore = parseFloat(searchParams.get('minScore') || '0')
    const endpoint = searchParams.get('endpoint')
    const ipAddress = searchParams.get('ip')

    // Build where clause
    const where: any = {}
    if (minScore > 0) {
      where.botScore = { gte: minScore }
    }
    if (endpoint) {
      where.endpoint = { contains: endpoint }
    }
    if (ipAddress) {
      where.ipAddress = ipAddress
    }

    const [requests, total, uniqueIPs] = await Promise.all([
      prisma.blockedRequest.findMany({
        where,
        orderBy: { blockedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.blockedRequest.count({ where }),
      prisma.blockedRequest.groupBy({
        by: ['ipAddress'],
        where,
        _count: true,
      })
    ])

    // Parse JSON fields
    const formattedRequests = requests.map((req: any) => ({
      ...req,
      reasons: req.reasons ? JSON.parse(req.reasons) : [],
      fingerprint: req.fingerprint ? JSON.parse(req.fingerprint) : null,
      formData: req.formData ? JSON.parse(req.formData) : null,
    }))

    // Calculate statistics
    const stats = {
      total,
      uniqueIPs: uniqueIPs.length,
      avgBotScore: requests.length > 0 
        ? requests.reduce((sum: number, r: any) => sum + r.botScore, 0) / requests.length 
        : 0,
      topIPs: uniqueIPs
        .sort((a: any, b: any) => b._count - a._count)
        .slice(0, 10)
        .map((ip: any) => ({ ip: ip.ipAddress, count: ip._count }))
    }

    return NextResponse.json({
      success: true,
      requests: formattedRequests,
      stats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching blocked requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blocked requests' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/blocked-requests - Clear old blocked requests
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const daysOld = parseInt(searchParams.get('daysOld') || '30')

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.blockedRequest.deleteMany({
      where: {
        blockedAt: {
          lt: cutoffDate
        }
      }
    })

    return NextResponse.json({
      success: true,
      deleted: result.count,
      message: `Deleted ${result.count} blocked requests older than ${daysOld} days`
    })
  } catch (error) {
    console.error('Error deleting blocked requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete blocked requests' },
      { status: 500 }
    )
  }
}
