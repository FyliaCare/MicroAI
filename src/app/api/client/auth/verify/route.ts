import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/client/auth/verify - Verify email with token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification token' },
        { status: 404 }
      )
    }

    // Check if token has expired
    if (user.verificationExpiry && user.verificationExpiry < new Date()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Verification link has expired. Please request a new one.',
          expired: true
        },
        { status: 410 }
      )
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email already verified',
          alreadyVerified: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        }
      )
    }

    // Verify the account
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpiry: null,
        accessExpiresAt: null, // Remove expiry once verified
      },
    })

    // Create activity log
    await prisma.activityFeed.create({
      data: {
        type: 'account-verified',
        title: 'Account Verified',
        description: `${user.name} verified their email address`,
        actorType: 'client',
        actorId: user.id,
        actorName: user.name,
        isPublic: false,
        clientId: user.client?.id,
        icon: '✅',
        color: '#10b981',
      },
    })

    // Send welcome confirmation email
    await prisma.emailQueue.create({
      data: {
        to: user.email,
        subject: 'Welcome to MicroAI Systems! 🎉',
        htmlContent: generateWelcomeConfirmationEmail({
          name: user.name,
          portalUrl: `${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard`,
        }),
        templateType: 'account-verified',
        priority: 'normal',
        userId: user.id,
        clientId: user.client?.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mustChangePassword: user.mustChangePassword,
      },
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Email verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper: Generate welcome confirmation email
function generateWelcomeConfirmationEmail(data: { name: string; portalUrl: string }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to MicroAI Systems</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 40px 20px; text-align: center; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; padding: 14px 32px; background: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Email Verified!</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${data.name}</strong>,</p>
      <p>Your email has been successfully verified! 🎉</p>
      <p>You now have full access to your client portal where you can:</p>
      <ul>
        <li>Track your project progress</li>
        <li>Upload project materials</li>
        <li>Receive real-time updates</li>
        <li>Request code access</li>
        <li>Communicate with our team</li>
      </ul>
      <center>
        <a href="${data.portalUrl}" class="button">Go to Dashboard</a>
      </center>
      <p style="margin-top: 30px;">Welcome aboard!</p>
      <p>Best regards,<br><strong>MicroAI Systems Team</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} MicroAI Systems. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
