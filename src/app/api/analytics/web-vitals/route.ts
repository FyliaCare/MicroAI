import { NextRequest, NextResponse } from 'next/server'

/**
 * API endpoint to collect Web Vitals metrics
 * This can be extended to send data to analytics services
 */
export async function POST(request: NextRequest) {
  try {
    const metric = await request.json()

    // Log to server console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals Server]', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      })
    }

    // In production, you can send to analytics services:
    // - Google Analytics
    // - Vercel Analytics
    // - Custom analytics database
    // - Application Performance Monitoring (APM) tools

    // Example: Store in database or send to external service
    if (process.env.NODE_ENV === 'production') {
      // await prisma.webVitals.create({
      //   data: {
      //     name: metric.name,
      //     value: metric.value,
      //     rating: metric.rating,
      //     delta: metric.delta,
      //     id: metric.id,
      //   }
      // })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[Web Vitals API Error]', error)
    return NextResponse.json({ error: 'Failed to process metric' }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
