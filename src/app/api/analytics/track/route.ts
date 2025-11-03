import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sessionId,
      pageUrl,
      referrer,
      timeOnPage,
      isProjectRequest,
      projectRequestId
    } = body

    // Get IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    // Get user agent info
    const userAgent = request.headers.get('user-agent') || ''
    
    // Simple device detection
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent)
    const isTablet = /tablet|ipad/i.test(userAgent)
    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'

    // Simple browser detection
    let browser = 'Unknown'
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Edge')) browser = 'Edge'

    // Simple OS detection
    let os = 'Unknown'
    if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Mac')) os = 'MacOS'
    else if (userAgent.includes('Linux')) os = 'Linux'
    else if (userAgent.includes('Android')) os = 'Android'
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS'

    // Get geolocation from IP (using ip-api.com free service)
    let geoData: any = {}
    try {
      if (ip !== 'unknown' && !ip.includes('127.0.0.1') && !ip.includes('localhost')) {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,lat,lon`)
        if (geoResponse.ok) {
          geoData = await geoResponse.json()
        }
      } else {
        // Default to Ghana for local development
        geoData = {
          country: 'Ghana',
          countryCode: 'GH',
          city: 'Takoradi',
          region: 'Western',
          lat: 4.8972,
          lon: -1.7745
        }
      }
    } catch (error) {
      console.error('Geolocation error:', error)
      // Default to Ghana
      geoData = {
        country: 'Ghana',
        countryCode: 'GH'
      }
    }

    // Create visitor analytics record
    await prisma.visitorAnalytics.create({
      data: {
        sessionId,
        ipAddress: ip,
        country: geoData.country || null,
        city: geoData.city || null,
        region: geoData.region || null,
        latitude: geoData.lat || null,
        longitude: geoData.lon || null,
        landingPage: pageUrl,
        referrer: referrer || null,
        device: deviceType,
        browser,
        os,
        duration: timeOnPage || null,
        converted: isProjectRequest || false,
        interactions: isProjectRequest ? 1 : 0,
        sessionStart: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Visitor tracked successfully'
    })

  } catch (error: any) {
    console.error('Visitor tracking error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}
