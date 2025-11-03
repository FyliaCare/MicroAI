import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST /api/client/auth/change-password - Change password (first-time or regular)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, currentPassword, newPassword, confirmPassword } = body

    // Validate inputs
    if (!userId || !currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New passwords do not match' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.error },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        client: {
          select: { id: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      return NextResponse.json(
        { success: false, error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
        passwordChangedAt: new Date(),
      },
    })

    // Create activity log
    await prisma.activityFeed.create({
      data: {
        type: 'password-changed',
        title: 'Password Changed',
        description: `${user.name} changed their password`,
        actorType: 'client',
        actorId: user.id,
        actorName: user.name,
        isPublic: false,
        clientId: user.client?.id,
        icon: '🔒',
        color: '#6b7280',
      },
    })

    // Send confirmation email
    await prisma.emailQueue.create({
      data: {
        to: user.email,
        subject: 'Password Changed Successfully',
        htmlContent: generatePasswordChangeEmail({
          name: user.name,
          timestamp: new Date().toLocaleString(),
        }),
        templateType: 'password-changed',
        priority: 'high',
        userId: user.id,
        clientId: user.client?.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to change password',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper: Validate password strength
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' }
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' }
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' }
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character (!@#$%^&*...)' }
  }
  
  return { valid: true }
}

// Helper: Generate password change confirmation email
function generatePasswordChangeEmail(data: { name: string; timestamp: string }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Changed</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #6b7280; color: #ffffff; padding: 30px 20px; text-align: center; }
    .content { padding: 40px 30px; }
    .warning-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
    .info-box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Password Changed</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${data.name}</strong>,</p>
      <p>Your password was successfully changed at <strong>${data.timestamp}</strong>.</p>
      
      <div class="info-box">
        <p><strong>✅ Your account is secure</strong></p>
        <p>If you made this change, no further action is needed.</p>
      </div>
      
      <div class="warning-box">
        <p><strong>⚠️ Didn't change your password?</strong></p>
        <p>If you did not make this change, please contact us immediately at <a href="mailto:sales@microaisystems.com">sales@microaisystems.com</a></p>
      </div>
      
      <p>For security tips:</p>
      <ul>
        <li>Never share your password with anyone</li>
        <li>Use a unique password for each account</li>
        <li>Consider using a password manager</li>
        <li>Enable two-factor authentication when available</li>
      </ul>
      
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
