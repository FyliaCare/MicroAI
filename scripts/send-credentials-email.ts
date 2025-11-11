import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function sendManualCredentials() {
  try {
    const email = 'Benjyamp@gmail.com'
    const password = 'MicroAI2025!'
    const loginUrl = 'https://microai-kz7f.onrender.com/client/login'
    
    console.log('\n📧 Sending credentials email...\n')
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { client: true }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    // Queue a simple credentials email
    await prisma.emailQueue.create({
      data: {
        to: email,
        subject: '🔑 Your MicroAI Systems Login Credentials',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your Login Credentials</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #667eea; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
    .content { padding: 30px; }
    .credentials-box { background: #f0f4ff; border: 2px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .credential-row { margin: 15px 0; padding: 10px; background: white; border-radius: 4px; }
    .credential-label { font-weight: bold; color: #555; display: block; margin-bottom: 5px; }
    .credential-value { font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #667eea; background: #f8f9fa; padding: 10px; border-radius: 4px; display: block; word-break: break-all; }
    .button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 20px 0; }
    .button:hover { opacity: 0.9; }
    .important { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔑 Your Login Credentials</h1>
      <p>MicroAI Systems Client Portal</p>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Here are your login credentials for the MicroAI Systems client portal:</p>
      
      <div class="credentials-box">
        <h3 style="margin-top: 0; color: #667eea;">Login Information</h3>
        
        <div class="credential-row">
          <span class="credential-label">📧 Email:</span>
          <span class="credential-value">${email}</span>
        </div>
        
        <div class="credential-row">
          <span class="credential-label">🔐 Password:</span>
          <span class="credential-value">${password}</span>
        </div>
        
        <div class="credential-row">
          <span class="credential-label">🌐 Login URL:</span>
          <span class="credential-value">${loginUrl}</span>
        </div>
      </div>
      
      <div class="important">
        <strong>⚠️ Important:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>You will be prompted to change your password after first login</li>
          <li>Keep these credentials secure</li>
          <li>Never share your password with anyone</li>
        </ul>
      </div>
      
      <center>
        <a href="${loginUrl}" class="button">Login to Client Portal</a>
      </center>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      
      <p style="margin-top: 20px;">If you have any questions or need assistance, please contact us:</p>
      <p>
        📧 Email: <a href="mailto:sales@microaisystems.com">sales@microaisystems.com</a><br>
        🌐 Website: <a href="https://microai-kz7f.onrender.com">https://microai-kz7f.onrender.com</a>
      </p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>MicroAI Systems Team</strong>
      </p>
    </div>
  </div>
</body>
</html>
        `.trim(),
        templateType: 'credentials',
        templateVars: JSON.stringify({
          name: user.name,
          email,
          password,
          loginUrl,
        }),
        priority: 'high',
        userId: user.id,
        clientId: user.client?.id,
      }
    })
    
    console.log('✅ Credentials email queued!\n')
    console.log('📧 Email Details:')
    console.log(`   To: ${email}`)
    console.log(`   Subject: 🔑 Your MicroAI Systems Login Credentials`)
    console.log('\n🔐 Credentials in email:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   Login URL: ${loginUrl}`)
    console.log('\n📬 Email will be sent within 5 minutes!\n')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

sendManualCredentials()
