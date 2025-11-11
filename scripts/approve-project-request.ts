import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function approveProjectRequest() {
  try {
    const requestNumber = process.argv[2] || 'PR-1762870410356850'
    
    console.log(`\n✅ Approving project request: ${requestNumber}\n`)
    
    const projectRequest = await prisma.projectRequest.findUnique({
      where: { requestNumber }
    })
    
    if (!projectRequest) {
      console.log('❌ Project request not found')
      return
    }
    
    if (projectRequest.status !== 'pending') {
      console.log(`❌ Request is already ${projectRequest.status}`)
      return
    }
    
    console.log('📋 Approving request:')
    console.log(`   Client: ${projectRequest.clientName}`)
    console.log(`   Email: ${projectRequest.clientEmail}`)
    console.log(`   Project: ${projectRequest.projectName}`)
    
    // Generate credentials
    const tempPassword = generateSecurePassword()
    const hashedPassword = await bcrypt.hash(tempPassword, 10)
    const verificationToken = generateToken()
    const verificationExpiry = new Date()
    verificationExpiry.setHours(verificationExpiry.getHours() + 72)
    const accessExpiresAt = new Date()
    accessExpiresAt.setDate(accessExpiresAt.getDate() + 30)
    
    // Create everything in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User
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
      
      // 2. Create Client
      const client = await tx.client.create({
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
      
      // 3. Create Project
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
          requirements: projectRequest.requirements || '',
          techStack: projectRequest.techPreferences || '',
          tags: projectRequest.features || '',
          notes: `Created from project request ${projectRequest.requestNumber}`,
        },
      })
      
      // 4. Update ProjectRequest
      await tx.projectRequest.update({
        where: { requestNumber },
        data: {
          status: 'approved',
          convertedToProject: true,
          projectId: project.id,
          clientId: client.id,
          reviewedAt: new Date(),
        },
      })
      
      // 5. Queue welcome email
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://microai-kz7f.onrender.com'}/client/login`
      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://microai-kz7f.onrender.com'}/client/verify?token=${verificationToken}`
      
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
      
      return { user, client, project, tempPassword, verifyUrl, loginUrl }
    })
    
    console.log('\n✅ Project approved and account created!')
    console.log('\n📧 New Account Credentials:')
    console.log(`   Email: ${projectRequest.clientEmail}`)
    console.log(`   🔑 Password: ${result.tempPassword}`)
    console.log(`   Login URL: ${result.loginUrl}`)
    console.log(`   Verify URL: ${result.verifyUrl}`)
    console.log('\n📬 Welcome email queued for delivery!')
    console.log('   Email will be sent within 5 minutes\n')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

function generateSecurePassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]
  
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

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
  <title>Welcome to MicroAI Systems</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 40px 20px; text-align: center; }
    .content { padding: 40px 30px; }
    .credentials-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .credential-value { font-family: monospace; background: #fff; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-left: 10px; border: 1px solid #ddd; font-size: 16px; font-weight: bold; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
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
      <p>Great news! We've approved your project request for <strong>${data.projectName}</strong>!</p>
      
      <div class="credentials-box">
        <h3>🔑 Your Login Credentials</h3>
        <div style="margin: 10px 0;">
          <span style="font-weight: bold;">Email:</span>
          <span class="credential-value">${data.email}</span>
        </div>
        <div style="margin: 10px 0;">
          <span style="font-weight: bold;">Temporary Password:</span>
          <span class="credential-value">${data.tempPassword}</span>
        </div>
      </div>
      
      <div class="warning">
        ⚠️ <strong>Important:</strong> You must verify your account within ${data.expiryDays} days.
      </div>
      
      <center style="margin: 30px 0;">
        <a href="${data.verifyUrl}" class="button">Verify Account & Login</a>
      </center>
      
      <p>If you have any questions, contact us at sales@microaisystems.com</p>
      <p>Best regards,<br><strong>MicroAI Systems Team</strong></p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

approveProjectRequest()
