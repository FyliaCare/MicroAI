import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST /api/client/auth/login - Client login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is a client
    if (user.role !== 'client') {
      return NextResponse.json(
        { success: false, error: 'This login is for clients only. Admins should use /admin/login' },
        { status: 403 }
      )
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      )
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
      return NextResponse.json(
        { 
          success: false, 
          error: `Account is locked due to too many failed login attempts. Try again in ${minutesLeft} minutes.`,
          lockedUntil: user.lockedUntil 
        },
        { status: 423 }
      )
    }

    // Check if account has expired (unverified for 30 days)
    if (user.accessExpiresAt && user.accessExpiresAt < new Date() && !user.isVerified) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Your account verification period has expired. Please contact support to reactivate your account.',
          expired: true
        },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      // Increment failed login attempts
      const loginAttempts = (user.loginAttempts || 0) + 1
      const updateData: any = { loginAttempts }

      // Lock account after 5 failed attempts (30 minutes)
      if (loginAttempts >= 5) {
        const lockUntil = new Date()
        lockUntil.setMinutes(lockUntil.getMinutes() + 30)
        updateData.lockedUntil = lockUntil
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      })

      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email or password',
          attemptsLeft: Math.max(0, 5 - loginAttempts)
        },
        { status: 401 }
      )
    }

    // Reset login attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    })

    // Create session
    const sessionToken = generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 day session

    // Get request metadata
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await prisma.clientSession.create({
      data: {
        userId: user.id,
        sessionToken,
        ipAddress,
        userAgent,
        expiresAt,
        isActive: true,
      },
    })

    // Create activity log
    await prisma.activityFeed.create({
      data: {
        type: 'client-login',
        title: 'Client Logged In',
        description: `${user.name} logged in to the portal`,
        actorType: 'client',
        actorId: user.id,
        actorName: user.name,
        isPublic: false,
        clientId: user.client?.id,
        icon: '🔐',
        color: '#3b82f6',
      },
    })

    // Return user data
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        mustChangePassword: user.mustChangePassword,
        client: user.client,
      },
      session: {
        token: sessionToken,
        expiresAt,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Login failed. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper: Generate session token
function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 64; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}
