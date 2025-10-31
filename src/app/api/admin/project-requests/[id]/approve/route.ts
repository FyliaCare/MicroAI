import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

// POST /api/admin/project-requests/[id]/approve - Approve project request
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notes } = body
    
    // Use session data for admin info
    const adminId = session.user.id
    const adminName = session.user.name

    // Get the project request
    const projectRequest = await prisma.projectRequest.findUnique({
      where: { id: params.id },
    })

    if (!projectRequest) {
      return NextResponse.json(
        { success: false, error: 'Project request not found' },
        { status: 404 }
      )
    }

    if (projectRequest.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: `Request is already ${projectRequest.status}` },
        { status: 400 }
      )
    }

    // Generate temporary password
    const tempPassword = generateSecurePassword()
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Calculate account expiry (30 days from now)
    const accessExpiresAt = new Date()
    accessExpiresAt.setDate(accessExpiresAt.getDate() + 30)

    // Generate verification token
    const verificationToken = generateToken()
    const verificationExpiry = new Date()
    verificationExpiry.setHours(verificationExpiry.getHours() + 72) // 72 hour verification window

    // Start transaction to create everything atomically
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User account
      const user = await tx.user.create({
        data: {
          email: projectRequest.clientEmail,
          password: hashedPassword,
          name: projectRequest.clientName,
          role: 'client',
          isActive: true,
          isVerified: false,
          mustChangePassword: true,
          accessExpiresAt,
          verificationToken,
          verificationExpiry,
        },
      })

      // 2. Create or update Client record
      let client = await tx.client.findUnique({
        where: { email: projectRequest.clientEmail },
      })

      if (!client) {
        client = await tx.client.create({
          data: {
            name: projectRequest.clientName,
            email: projectRequest.clientEmail,
            phone: projectRequest.clientPhone,
            company: projectRequest.clientCompany,
            website: projectRequest.clientWebsite,
            industry: projectRequest.industry,
            status: 'active',
            hasPortalAccess: true,
            userId: user.id,
            source: projectRequest.source,
            referredBy: projectRequest.referrer,
          },
        })
      } else {
        // Update existing client with portal access
        client = await tx.client.update({
          where: { id: client.id },
          data: {
            hasPortalAccess: true,
            userId: user.id,
          },
        })
      }

      // 3. Create Project
      const requirements = projectRequest.requirements
        ? JSON.parse(projectRequest.requirements)
        : {}
      const features = projectRequest.features
        ? JSON.parse(projectRequest.features)
        : []
      const techPrefs = projectRequest.techPreferences
        ? JSON.parse(projectRequest.techPreferences)
        : []

      const project = await tx.project.create({
        data: {
          name: projectRequest.projectName,
          description: projectRequest.description,
          type: projectRequest.projectType,
          status: 'planning',
          priority: projectRequest.priority,
          budget: projectRequest.budget,
          startDate: projectRequest.startDate,
          deadline: projectRequest.deadline,
          clientId: client.id,
          requirements: JSON.stringify(requirements),
          techStack: JSON.stringify(techPrefs),
          tags: JSON.stringify(features),
          notes: `Created from project request ${projectRequest.requestNumber}`,
        },
      })

      // 4. Update ProjectRequest status
      const updatedRequest = await tx.projectRequest.update({
        where: { id: params.id },
        data: {
          status: 'approved',
          convertedToProject: true,
          projectId: project.id,
          clientId: client.id,
          reviewedBy: adminId,
          reviewedAt: new Date(),
          reviewNotes: notes,
        },
      })

      // 5. Create welcome email in queue
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/client/login`
      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/client/verify?token=${verificationToken}`

      await tx.emailQueue.create({
        data: {
          to: projectRequest.clientEmail,
          subject: '🎉 Welcome to MicroAI Systems - Your Project Has Been Approved!',
          htmlContent: generateWelcomeEmail({
            clientName: projectRequest.clientName,
            projectName: projectRequest.projectName,
            email: projectRequest.clientEmail,
            tempPassword,
            loginUrl,
            verifyUrl,
            expiryDays: 30,
          }),
          templateType: 'welcome',
          templateVars: JSON.stringify({
            clientName: projectRequest.clientName,
            projectName: projectRequest.projectName,
            email: projectRequest.clientEmail,
            tempPassword,
            loginUrl,
            verifyUrl,
          }),
          priority: 'high',
          userId: user.id,
          clientId: client.id,
          projectId: project.id,
        },
      })

      // 6. Create admin notification
      await tx.notification.create({
        data: {
          type: 'project-created',
          title: '✅ Project Approved & Created',
          message: `${projectRequest.projectName} has been approved. Client account created for ${projectRequest.clientName}.`,
          link: `/admin/projects/${project.id}`,
          priority: 'normal',
          entityType: 'Project',
          entityId: project.id,
        },
      })

      // 7. Create activity feed entry
      await tx.activityFeed.create({
        data: {
          type: 'project-created',
          title: 'New Project Created',
          description: `${projectRequest.projectName} has been approved and set up`,
          actorType: 'admin',
          actorId: adminId,
          actorName: adminName,
          targetType: 'project',
          targetId: project.id,
          targetName: projectRequest.projectName,
          projectId: project.id,
          clientId: client.id,
          isPublic: true,
          visibleToClients: JSON.stringify([client.id]),
          icon: '🚀',
          color: '#10b981',
        },
      })

      return {
        user,
        client,
        project,
        updatedRequest,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Project request approved successfully',
      data: {
        projectId: result.project.id,
        clientId: result.client.id,
        userId: result.user.id,
        projectName: result.project.name,
        clientEmail: result.user.email,
        welcomeEmailQueued: true,
      },
    })
  } catch (error) {
    console.error('Error approving project request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to approve project request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Helper: Generate secure random password
function generateSecurePassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

// Helper: Generate verification token
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

// Helper: Generate welcome email HTML
function generateWelcomeEmail(data: {
  clientName: string
  projectName: string
  email: string
  tempPassword: string
  loginUrl: string
  verifyUrl: string
  expiryDays: number
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MicroAI Systems</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .credentials-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .credentials-box h3 { margin-top: 0; color: #667eea; }
    .credential-item { margin: 10px 0; }
    .credential-label { font-weight: bold; color: #555; }
    .credential-value { font-family: monospace; background: #fff; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-left: 10px; border: 1px solid #ddd; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .button:hover { opacity: 0.9; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
    .steps { background: #e8f4f8; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .steps ol { margin: 10px 0; padding-left: 20px; }
    .steps li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to MicroAI Systems!</h1>
      <p>Your Project Has Been Approved</p>
    </div>
    
    <div class="content">
      <p>Hi <strong>${data.clientName}</strong>,</p>
      
      <p>Great news! We've reviewed your project request for <strong>${data.projectName}</strong>, and we're excited to move forward with you!</p>
      
      <p>We've created a dedicated client portal account for you where you can:</p>
      <ul>
        <li>✅ Track your project progress in real-time</li>
        <li>📁 Upload project documents (logos, brand colors, images)</li>
        <li>💬 Receive project updates and notifications</li>
        <li>🔐 Request access to your project code</li>
        <li>📊 View milestones and timelines</li>
      </ul>
      
      <div class="credentials-box">
        <h3>🔑 Your Login Credentials</h3>
        <div class="credential-item">
          <span class="credential-label">Email:</span>
          <span class="credential-value">${data.email}</span>
        </div>
        <div class="credential-item">
          <span class="credential-label">Temporary Password:</span>
          <span class="credential-value">${data.tempPassword}</span>
        </div>
      </div>
      
      <div class="warning">
        ⚠️ <strong>Important:</strong> You must verify your account within ${data.expiryDays} days. Unverified accounts will be automatically deleted for security.
      </div>
      
      <div class="steps">
        <h3>📝 Next Steps:</h3>
        <ol>
          <li>Click the button below to verify your email and log in</li>
          <li>You'll be prompted to change your password immediately</li>
          <li>Once logged in, explore your project dashboard</li>
          <li>Upload any project materials (logos, brand guidelines, etc.)</li>
        </ol>
      </div>
      
      <center>
        <a href="${data.verifyUrl}" class="button">Verify Account & Login</a>
      </center>
      
      <p style="margin-top: 30px;">Or copy this link to your browser:</p>
      <p style="background: #f8f9fa; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">
        ${data.verifyUrl}
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      
      <p><strong>What Happens Next?</strong></p>
      <p>Our team will begin working on <strong>${data.projectName}</strong> and keep you updated every step of the way. You'll receive email notifications whenever there's a project update.</p>
      
      <p>If you have any questions or need assistance, feel free to reply to this email or contact us directly.</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>MicroAI Systems Team</strong><br>
        <a href="mailto:support@microai.systems">support@microai.systems</a>
      </p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} MicroAI Systems. All rights reserved.</p>
      <p style="font-size: 12px; color: #999;">
        This is an automated message. Please do not reply directly to this email for support inquiries.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
