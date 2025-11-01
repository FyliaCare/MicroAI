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

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// GET: Get single blog post by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const session = await getServerSession(authOptions)
    const isAdmin = session && (session.user as any).role === 'admin'

    // Try to find by ID first, then by slug
    let post = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!post) {
      post = await prisma.blogPost.findUnique({
        where: { slug: id }
      })
    }

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Non-admin users can only see published posts
    if (!isAdmin && (!post.published || post.status !== 'published')) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Increment view count (only for published posts, not for admin preview)
    if (post.published && !isAdmin) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } }
      })
      post.views += 1
    }

    return NextResponse.json({ post })

  } catch (error) {
    console.error('Get blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// PUT: Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Update slug if title changed
    let slug = existingPost.slug
    if (body.title && body.title !== existingPost.title) {
      slug = body.slug || generateSlug(body.title)
      
      // Check if new slug conflicts with another post
      const conflictingPost = await prisma.blogPost.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      })
      
      if (conflictingPost) {
        slug = `${slug}-${Date.now()}`
      }
    }

    // Calculate reading time if content changed
    let readingTime = existingPost.readingTime
    if (body.content && body.content !== existingPost.content) {
      readingTime = calculateReadingTime(body.content)
    }

    // Update publishedAt if changing from unpublished to published
    let publishedAt = existingPost.publishedAt
    if (body.published && !existingPost.published) {
      publishedAt = new Date()
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        coverImageAlt: body.coverImageAlt,
        status: body.status,
        published: body.published,
        publishedAt,
        featured: body.featured,
        category: body.category,
        tags: body.tags ? JSON.stringify(body.tags) : undefined,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        seoKeywords: body.seoKeywords,
        readingTime,
        allowComments: body.allowComments,
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Updated',
        entity: 'BlogPost',
        entityId: post.id,
        description: `Updated blog post: "${post.title}"`,
        userId: session.user?.id,
        metadata: JSON.stringify({
          slug: post.slug,
          status: post.status,
          published: post.published,
        })
      }
    })

    return NextResponse.json({ success: true, post })

  } catch (error) {
    console.error('Update blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE: Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const post = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    await prisma.blogPost.delete({
      where: { id }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'Deleted',
        entity: 'BlogPost',
        entityId: id,
        description: `Deleted blog post: "${post.title}"`,
        userId: session.user?.id,
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
