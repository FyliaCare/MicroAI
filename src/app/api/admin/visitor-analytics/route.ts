import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/visitor-analytics - Get all visitor analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d' // 24h, 7d, 30d, all
    const limit = parseInt(searchParams.get('limit') || '100')

    let dateFilter: any = {}
    
    switch (period) {
      case '24h':
        dateFilter = {
          sessionStart: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        }
        break
      case '7d':
        dateFilter = {
          sessionStart: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        }
        break
      case '30d':
        dateFilter = {
          sessionStart: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        }
        break
      default:
        dateFilter = {}
    }

    // Get visitor data
    const visitors = await prisma.visitorAnalytics.findMany({
      where: dateFilter,
      orderBy: {
        sessionStart: 'desc',
      },
      take: limit,
    })

    // Get summary statistics
    const stats = await prisma.visitorAnalytics.aggregate({
      where: dateFilter,
      _count: true,
      _sum: {
        duration: true,
        interactions: true,
      },
      _avg: {
        duration: true,
        interactions: true,
      },
    })

    // Get country distribution
    const countryStats = await prisma.visitorAnalytics.groupBy({
      by: ['country'],
      where: dateFilter,
      _count: true,
      orderBy: {
        _count: {
          country: 'desc',
        },
      },
      take: 10,
    })

    // Get browser/device stats
    const deviceStats = await prisma.visitorAnalytics.groupBy({
      by: ['device'],
      where: dateFilter,
      _count: true,
    })

    const browserStats = await prisma.visitorAnalytics.groupBy({
      by: ['browser'],
      where: dateFilter,
      _count: true,
    })

    // Get conversion stats
    const conversionStats = await prisma.visitorAnalytics.groupBy({
      by: ['converted'],
      where: dateFilter,
      _count: true,
    })

    return NextResponse.json({
      success: true,
      visitors,
      stats: {
        total: stats._count,
        totalDuration: stats._sum.duration || 0,
        avgDuration: Math.round(stats._avg.duration || 0),
        totalInteractions: stats._sum.interactions || 0,
        avgInteractions: Math.round(stats._avg.interactions || 0),
      },
      countryStats,
      deviceStats,
      browserStats,
      conversionStats,
    })
  } catch (error) {
    console.error('Error fetching visitor analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// POST /api/admin/visitor-analytics - Track visitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      visitorId,
      sessionId,
      ipAddress,
      country,
      city,
      region,
      latitude,
      longitude,
      device,
      browser,
      os,
      referrer,
      landingPage,
    } = body

    const analytics = await prisma.visitorAnalytics.create({
      data: {
        visitorId,
        sessionId,
        ipAddress,
        country,
        city,
        region,
        latitude,
        longitude,
        device,
        browser,
        os,
        referrer,
        landingPage,
        pagesVisited: JSON.stringify([landingPage]),
      },
    })

    return NextResponse.json({
      success: true,
      analytics,
    })
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}
