// Test Bot Protection System
// Run: npx ts-node scripts/test-bot-protection.ts

import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000'

interface TestResult {
  name: string
  expected: 'BLOCKED' | 'ALLOWED'
  actual: 'BLOCKED' | 'ALLOWED' | 'ERROR'
  score?: number
  reason?: string
}

const results: TestResult[] = []

async function testSubmission(name: string, data: any, expectedResult: 'BLOCKED' | 'ALLOWED') {
  try {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': data.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify(data.body)
    })

    const result = await response.json() as { error?: string; success?: boolean }
    const actual = response.status === 429 ? 'BLOCKED' : 'ALLOWED'

    results.push({
      name,
      expected: expectedResult,
      actual,
      reason: result.error
    })

    console.log(`\n${actual === expectedResult ? '✅' : '❌'} ${name}`)
    console.log(`   Expected: ${expectedResult}, Got: ${actual}`)
    if (result.error) console.log(`   Reason: ${result.error}`)

  } catch (error) {
    results.push({
      name,
      expected: expectedResult,
      actual: 'ERROR',
      reason: error instanceof Error ? error.message : 'Unknown error'
    })
    console.log(`\n❌ ${name} - ERROR`)
    console.log(`   ${error}`)
  }
}

async function runTests() {
  console.log('🛡️  Testing Bot Protection System\n')
  console.log('=' .repeat(60))

  // Test 1: Honeypot field filled (should be blocked)
  await testSubmission(
    'Test 1: Honeypot Trap',
    {
      body: {
        name: 'Bot Test',
        email: 'bot@test.com',
        message: 'Test message',
        _honeypot: 'I am a bot', // Filled honeypot
        _timestamp: Date.now()
      }
    },
    'BLOCKED'
  )

  await new Promise(resolve => setTimeout(resolve, 1000))

  // Test 2: Bot User-Agent (should be blocked)
  await testSubmission(
    'Test 2: Bot User-Agent',
    {
      userAgent: 'python-requests/2.28.0',
      body: {
        name: 'Python Script',
        email: 'test@example.com',
        message: 'Automated submission',
        _honeypot: '',
        _timestamp: Date.now()
      }
    },
    'BLOCKED'
  )

  await new Promise(resolve => setTimeout(resolve, 1000))

  // Test 3: Disposable email (should be blocked)
  await testSubmission(
    'Test 3: Disposable Email',
    {
      body: {
        name: 'Temp User',
        email: 'test@tempmail.com',
        message: 'Message from disposable email',
        _honeypot: '',
        _timestamp: Date.now()
      }
    },
    'BLOCKED'
  )

  await new Promise(resolve => setTimeout(resolve, 1000))

  // Test 4: Spam content (should be blocked)
  await testSubmission(
    'Test 4: Spam Content',
    {
      body: {
        name: 'Spammer',
        email: 'spam@example.com',
        message: 'BUY NOW!!! CLICK HERE!!! http://spam.com http://scam.com http://fake.ru VIAGRA CASINO $$$ !!!',
        _honeypot: '',
        _timestamp: Date.now()
      }
    },
    'BLOCKED'
  )

  await new Promise(resolve => setTimeout(resolve, 1000))

  // Test 5: Legitimate submission (should be allowed)
  await testSubmission(
    'Test 5: Legitimate User',
    {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      body: {
        name: 'John Doe',
        email: 'john@legitcompany.com',
        company: 'Legit Company Inc',
        message: 'Hi, I am interested in building a web application for my business. Can we schedule a call?',
        _honeypot: '',
        _timestamp: Date.now()
      }
    },
    'ALLOWED'
  )

  await new Promise(resolve => setTimeout(resolve, 1000))

  // Test 6: Rate limit (4th submission in short time - should be blocked)
  console.log('\n⏱️  Testing Rate Limiting (submitting 4 times rapidly)...')
  
  for (let i = 1; i <= 4; i++) {
    await testSubmission(
      `Test 6.${i}: Rate Limit Test (${i}/4)`,
      {
        body: {
          name: `User ${i}`,
          email: `user${i}@test.com`,
          message: `Test message ${i}`,
          _honeypot: '',
          _timestamp: Date.now()
        }
      },
      i <= 3 ? 'ALLOWED' : 'BLOCKED' // 4th should be blocked
    )
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST SUMMARY\n')
  
  const passed = results.filter(r => r.actual === r.expected).length
  const failed = results.filter(r => r.actual !== r.expected).length
  const total = results.length

  console.log(`Total Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`)

  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:')
    results.filter(r => r.actual !== r.expected).forEach(r => {
      console.log(`   - ${r.name}: Expected ${r.expected}, got ${r.actual}`)
    })
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n💡 Check /admin/bot-protection dashboard to view blocked requests')
  console.log('💡 Run: npm run dev (if not already running)\n')
}

// Run tests
console.log('⚠️  Make sure the development server is running (npm run dev)\n')
console.log('Starting tests in 3 seconds...\n')

setTimeout(() => {
  runTests().catch(console.error)
}, 3000)
