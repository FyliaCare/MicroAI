/**
 * Test contact form submission
 * Run: npx tsx scripts/test-contact-form.ts
 */

async function testContactForm() {
  try {
    console.log('🧪 Testing contact form submission...\n')

    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      message: 'This is a test message from the testing script'
    }

    console.log('📤 Submitting test data:', testData)

    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    const data = await response.json()

    console.log('\n📊 Response Status:', response.status)
    console.log('📊 Response Data:', JSON.stringify(data, null, 2))

    if (response.ok) {
      console.log('\n✅ TEST PASSED - Contact form working!')
      console.log('\nWhat should have happened:')
      console.log('  ✓ Project request created in database')
      console.log('  ✓ Notification created for admin')
      console.log('  ✓ Emails attempted (check logs for email status)')
      console.log('  ✓ Activity log created')
    } else {
      console.log('\n❌ TEST FAILED - Contact form returned error')
      console.log('Error:', data.error || 'Unknown error')
    }

  } catch (error: any) {
    console.error('\n❌ TEST ERROR:', error.message)
    console.error('Make sure dev server is running: npm run dev')
  }
}

testContactForm()
