import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all visitor data
    const visitors = await prisma.visitorAnalytics.findMany({
      where: {
        visitedAt: {
          gte: startDate
        }
      },
      orderBy: {
        visitedAt: 'desc'
      }
    })

    // Aggregate by country
    const countryStats = visitors.reduce((acc: any, visitor) => {
      const country = visitor.country || 'Unknown'
      const countryCode = visitor.countryCode || 'XX'
      
      if (!acc[country]) {
        acc[country] = {
          country,
          countryCode,
          visits: 0,
          projectRequests: 0,
          totalTime: 0,
          visitCount: 0,
          latitude: visitor.latitude,
          longitude: visitor.longitude
        }
      }
      
      acc[country].visits += 1
      if (visitor.isProjectRequest) {
        acc[country].projectRequests += 1
      }
      if (visitor.timeOnPage) {
        acc[country].totalTime += visitor.timeOnPage
        acc[country].visitCount += 1
      }
      
      return acc
    }, {})

    // Calculate averages and format
    const countriesArray = Object.values(countryStats).map((country: any) => ({
      ...country,
      avgTimeOnSite: country.visitCount > 0 
        ? Math.round(country.totalTime / country.visitCount) 
        : 0
    }))

    // Sort by visits descending
    countriesArray.sort((a: any, b: any) => b.visits - a.visits)

    // Overall statistics
    const totalVisits = visitors.length
    const totalProjectRequests = visitors.filter(v => v.isProjectRequest).length
    const totalTimeSpent = visitors.reduce((sum, v) => sum + (v.timeOnPage || 0), 0)
    const avgTimeOnSite = visitors.filter(v => v.timeOnPage).length > 0
      ? Math.round(totalTimeSpent / visitors.filter(v => v.timeOnPage).length)
      : 0

    // Device breakdown
    const deviceStats = visitors.reduce((acc: any, v) => {
      const device = v.deviceType || 'unknown'
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {})

    // Browser breakdown
    const browserStats = visitors.reduce((acc: any, v) => {
      const browser = v.browser || 'Unknown'
      acc[browser] = (acc[browser] || 0) + 1
      return acc
    }, {})

    // Recent visitors
    const recentVisitors = visitors.slice(0, 10).map(v => ({
      country: v.country,
      city: v.city,
      pageUrl: v.pageUrl,
      device: v.deviceType,
      visitedAt: v.visitedAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalVisits,
          totalProjectRequests,
          avgTimeOnSite,
          conversionRate: totalVisits > 0 
            ? ((totalProjectRequests / totalVisits) * 100).toFixed(2)
            : '0.00',
          uniqueCountries: countriesArray.length
        },
        countries: countriesArray,
        devices: deviceStats,
        browsers: browserStats,
        recentVisitors,
        period: {
          days,
          startDate,
          endDate: new Date()
        }
      }
    })

  } catch (error: any) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
