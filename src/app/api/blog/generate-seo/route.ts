import { NextRequest, NextResponse } from 'next/server'
import { generateBlogSEO } from '@/lib/blog-seo-generator'

/**
 * POST: Generate SEO data for blog post
 * This endpoint analyzes content and returns auto-generated SEO metadata
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate all SEO data
    const seoData = generateBlogSEO(body.title, body.content)

    return NextResponse.json({
      success: true,
      seo: seoData
    })

  } catch (error) {
    console.error('SEO generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate SEO data' },
      { status: 500 }
    )
  }
}
