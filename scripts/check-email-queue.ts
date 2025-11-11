import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkEmailQueue() {
  try {
    console.log('\n📧 EMAIL QUEUE STATUS\n')
    
    // Get all emails from queue
    const emails = await prisma.emailQueue.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    
    if (emails.length === 0) {
      console.log('❌ No emails in queue')
      return
    }
    
    console.log(`Found ${emails.length} recent emails:\n`)
    
    for (const email of emails) {
      console.log(`\n${'='.repeat(80)}`)
      console.log(`📬 Email ID: ${email.id}`)
      console.log(`   To: ${email.to}`)
      console.log(`   Subject: ${email.subject}`)
      console.log(`   Template: ${email.templateType}`)
      console.log(`   Status: ${email.status}`)
      console.log(`   Created: ${email.createdAt.toLocaleString()}`)
      console.log(`   Attempts: ${email.attempts}`)
      
      if (email.sentAt) {
        console.log(`   Sent: ${email.sentAt.toLocaleString()}`)
      }
      
      if (email.error) {
        console.log(`   Error: ${email.error}`)
      }
      
      // Check if password is in HTML content (for debugging)
      if (email.htmlContent.includes('Temporary Password')) {
        console.log(`   ✅ Contains password credentials`)
        
        // Extract password if present
        const passwordMatch = email.htmlContent.match(/Temporary Password:<\/span>\s*<span class="credential-value">([^<]+)<\/span>/)
        if (passwordMatch) {
          console.log(`   🔑 Password: ${passwordMatch[1]}`)
        }
      } else if (email.htmlContent.includes('New Project Approved')) {
        console.log(`   ℹ️  Existing user notification (no password)`)
      }
      
      // Show template vars if available
      if (email.templateVars) {
        try {
          const vars = JSON.parse(email.templateVars)
          if (vars.tempPassword) {
            console.log(`   🔑 Template Password: ${vars.tempPassword}`)
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    
    console.log(`\n${'='.repeat(80)}\n`)
    
    // Summary
    const pendingCount = await prisma.emailQueue.count({ where: { status: 'pending' } })
    const sentCount = await prisma.emailQueue.count({ where: { status: 'sent' } })
    const failedCount = await prisma.emailQueue.count({ where: { status: 'failed' } })
    
    console.log('\n📊 QUEUE SUMMARY:')
    console.log(`   Pending: ${pendingCount}`)
    console.log(`   Sent: ${sentCount}`)
    console.log(`   Failed: ${failedCount}`)
    console.log(`   Total: ${pendingCount + sentCount + failedCount}\n`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkEmailQueue()
