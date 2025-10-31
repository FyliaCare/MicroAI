import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/clients/[id]/profile
 * Get a specific client's profile (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = params.id

    // Get user profile with all related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        company: true,
        website: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
        bio: true,
        jobTitle: true,
        avatar: true,
        timezone: true,
        role: true,
        isActive: true,
        isVerified: true,
        emailNotifications: true,
        smsNotifications: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
            website: true,
            address: true,
            city: true,
            country: true,
            industry: true,
            companySize: true,
            status: true,
            notes: true,
            hasPortalAccess: true,
            createdAt: true,
            _count: {
              select: {
                projects: true,
                quotes: true,
                projectRequests: true,
                invoices: true,
              }
            }
          }
        },
        _count: {
          select: {
            codeAccessRequests: true,
            sessions: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Get recent activity
    const recentProjects = await prisma.project.findMany({
      where: {
        client: {
          userId: userId
        }
      },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        priority: true,
        progress: true,
        budget: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    })

    const recentQuotes = await prisma.quote.findMany({
      where: {
        client: {
          userId: userId
        }
      },
      select: {
        id: true,
        title: true,
        projectType: true,
        status: true,
        total: true,
        currency: true,
        createdAt: true,
        validUntil: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return NextResponse.json({
      user,
      recentProjects,
      recentQuotes,
    })
  } catch (error) {
    console.error('Error fetching client profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client profile' },
      { status: 500 }
    )
  }
}
