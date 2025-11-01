import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper function to calculate reading time (words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// GET: List all blog posts (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Check if user is admin (for draft posts)
    const session = await getServerSession(authOptions)
    const isAdmin = session && (session.user as any).role === 'admin'

    const where: any = {}
    
    // Non-admin users can only see published posts
    if (!isAdmin) {
      where.published = true
      where.status = 'published'
    } else if (status) {
      where.status = status
    }
    
    if (category) {
      where.category = category
    }
    
    if (featured === 'true') {
      where.featured = true
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          coverImageAlt: true,
          authorName: true,
          authorAvatar: true,
          status: true,
          published: true,
          publishedAt: true,
          featured: true,
          category: true,
          tags: true,
          views: true,
          likes: true,
          readingTime: true,
          createdAt: true,
          updatedAt: true,
        }
      }),
      prisma.blogPost.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Get blog posts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST: Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug
    let slug = body.slug || generateSlug(body.title)
    
    // Ensure slug is unique
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })
    
    if (existingPost) {
      slug = `${slug}-${Date.now()}`
    }

    // Calculate reading time
    const readingTime = calculateReadingTime(body.content)

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        coverImageAlt: body.coverImageAlt,
        author: session.user?.id,
        authorName: session.user?.name || session.user?.email,
        authorAvatar: (session.user as any)?.avatar,
        status: body.status || 'draft',
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
        featured: body.featured || false,
        category: body.category,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        seoKeywords: body.seoKeywords,
        readingTime,
        allowComments: body.allowComments !== undefined ? body.allowComments : true,
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Created',
        entity: 'BlogPost',
        entityId: post.id,
        description: `Created blog post: "${body.title}"`,
        userId: session.user?.id,
        metadata: JSON.stringify({
          slug,
          status: post.status,
          published: post.published,
        })
      }
    })

    return NextResponse.json({ success: true, post }, { status: 201 })

  } catch (error) {
    console.error('Create blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
