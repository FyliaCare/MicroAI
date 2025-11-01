import 'dotenv/config'

async function testAIBotEndpoint() {
  console.log('\n🤖 Testing AI Bot Project Inquiry Endpoint...\n')
  
  // Check environment variables
  console.log('📋 Environment Check:')
  console.log(`RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Set (' + process.env.RESEND_API_KEY.substring(0, 15) + '...)' : '❌ Not set'}`)
  console.log(`RESEND_FROM_EMAIL: ${process.env.RESEND_FROM_EMAIL || '❌ Not set'}`)
  console.log(`RESEND_TO_EMAIL: ${process.env.RESEND_TO_EMAIL || '❌ Not set'}`)
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}`)
  
  // Test the endpoint with sample data
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    projectIdea: 'I want to build a web application for managing inventory',
    projectType: '1', // Web Application
    timeline: '2', // Within a month
    budget: '2' // $5k - $15k
  }
  
  console.log('\n📤 Test Data:')
  console.log(JSON.stringify(testData, null, 2))
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    console.log(`\n🌐 Sending POST request to: ${baseUrl}/api/project-inquiry`)
    
    const response = await fetch(`${baseUrl}/api/project-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })
    
    const result = await response.json()
    
    console.log('\n📥 Response:')
    console.log(`Status: ${response.status} ${response.statusText}`)
    console.log('Body:', JSON.stringify(result, null, 2))
    
    if (response.ok) {
      console.log('\n✅ Success! AI Bot endpoint is working correctly.')
      console.log('\nNext steps:')
      console.log('1. Check admin email for notification')
      console.log('2. Check test@example.com for auto-reply confirmation')
      console.log('3. Verify database record was created')
    } else {
      console.log('\n❌ Failed! Check the error message above.')
    }
  } catch (error: any) {
    console.error('\n❌ Error testing AI Bot endpoint:', error.message)
    console.error('\nMake sure:')
    console.error('1. Development server is running (npm run dev)')
    console.error('2. Environment variables are properly set')
    console.error('3. Database is accessible')
  }
}

testAIBotEndpoint().catch(console.error)
