import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixEmailUrl() {
  try {
    const emailId = '5230f416-ea56-4cb6-bc5b-439fe37bb7aa' // Benjamin's pending email
    const productionUrl = 'https://microai-kz7f.onrender.com'
    
    console.log('\n🔧 Fixing email URLs...\n')
    
    const email = await prisma.emailQueue.findUnique({
      where: { id: emailId }
    })
    
    if (!email) {
      console.log('❌ Email not found')
      return
    }
    
    console.log('📧 Current email:')
    console.log(`   To: ${email.to}`)
    console.log(`   Subject: ${email.subject}`)
    console.log(`   Status: ${email.status}`)
    
    // Replace localhost with production URL
    const updatedHtml = email.htmlContent
      .replace(/http:\/\/localhost:3000/g, productionUrl)
    
    const updatedVars = email.templateVars
      ? email.templateVars.replace(/http:\/\/localhost:3000/g, productionUrl)
      : null
    
    await prisma.emailQueue.update({
      where: { id: emailId },
      data: {
        htmlContent: updatedHtml,
        templateVars: updatedVars,
      }
    })
    
    console.log('\n✅ Email URLs updated to production!')
    console.log(`   Production URL: ${productionUrl}`)
    console.log('\n📬 Email will be sent within 5 minutes\n')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

fixEmailUrl()
