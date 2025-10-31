#!/usr/bin/env tsx

/**
 * Test Email Configuration
 * 
 * This script tests your Resend + Google Workspace setup
 * Run: npx tsx scripts/test-email.ts
 */

import { Resend } from 'resend'
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n')

  // Check environment variables
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'sales@microaisystems.com'
  const toEmail = process.env.RESEND_TO_EMAIL || 'sales@microaisystems.com'

  console.log('📋 Configuration:')
  console.log(`   API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`   From: ${fromEmail}`)
  console.log(`   To: ${toEmail}\n`)

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not found in environment variables')
    console.log('\n💡 Steps to fix:')
    console.log('   1. Get API key from: https://resend.com/api-keys')
    console.log('   2. Add to .env.local: RESEND_API_KEY="re_your_key_here"')
    console.log('   3. Restart this script\n')
    process.exit(1)
  }

  if (apiKey === 're_your_api_key_here' || apiKey.includes('replace')) {
    console.error('❌ RESEND_API_KEY is still using placeholder value')
    console.log('\n💡 Steps to fix:')
    console.log('   1. Log into: https://resend.com')
    console.log('   2. Go to API Keys section')
    console.log('   3. Create new key or copy existing one')
    console.log('   4. Update .env.local with real key\n')
    process.exit(1)
  }

  // Initialize Resend
  const resend = new Resend(apiKey)

  console.log('📧 Sending test email...\n')

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: '✅ MicroAI Systems - Email Test Successful',
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .success-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      margin: 20px 0;
    }
    .info-box {
      background: white;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">🎉 Email Test Successful!</h1>
  </div>
  
  <div class="content">
    <div class="success-badge">✅ Configuration Working</div>
    
    <p>Great news! Your email system is configured correctly and ready to use.</p>
    
    <div class="info-box">
      <strong>📋 Configuration Details:</strong><br><br>
      <strong>Service:</strong> Resend<br>
      <strong>Sender:</strong> ${fromEmail}<br>
      <strong>Recipient:</strong> ${toEmail}<br>
      <strong>Status:</strong> ✅ Delivered<br>
      <strong>Timestamp:</strong> ${new Date().toLocaleString()}
    </div>
    
    <h3>✨ What's Working:</h3>
    <ul>
      <li>✅ Resend API connection established</li>
      <li>✅ Domain verification successful</li>
      <li>✅ Email delivery confirmed</li>
      <li>✅ Google Workspace integration active</li>
    </ul>
    
    <h3>🚀 Next Steps:</h3>
    <ol>
      <li>Test contact form on your website</li>
      <li>Test quote generation and sending</li>
      <li>Monitor Resend dashboard for analytics</li>
      <li>Set up DMARC reporting for security</li>
    </ol>
    
    <div class="info-box">
      <strong>💡 Pro Tip:</strong><br>
      Check your <a href="https://resend.com/emails" style="color: #667eea; text-decoration: none;">Resend Dashboard</a> 
      to see detailed delivery analytics, open rates, and click tracking.
    </div>
  </div>
  
  <div class="footer">
    <p>
      <strong>MicroAI Systems</strong><br>
      ${toEmail}<br>
      <a href="https://microaisystems.com" style="color: #667eea; text-decoration: none;">microaisystems.com</a>
    </p>
    <p style="font-size: 12px; color: #9ca3af;">
      This is an automated test email from your MicroAI Systems platform.
    </p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('❌ Email send failed:', error)
      console.log('\n💡 Common issues:')
      console.log('   - Domain not verified in Resend')
      console.log('   - Invalid API key')
      console.log('   - Sender email not matching verified domain')
      console.log('\n📚 See: GOOGLE_WORKSPACE_RESEND_SETUP.md for help\n')
      process.exit(1)
    }

    console.log('✅ Email sent successfully!')
    console.log(`   Email ID: ${data?.id}`)
    console.log(`   From: ${fromEmail}`)
    console.log(`   To: ${toEmail}`)
    console.log('\n📊 Check delivery status:')
    console.log(`   https://resend.com/emails/${data?.id}`)
    console.log('\n📬 Check your inbox at: ' + toEmail)
    console.log('\n✨ Your email system is ready to use!\n')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    console.log('\n📚 See: GOOGLE_WORKSPACE_RESEND_SETUP.md for troubleshooting\n')
    process.exit(1)
  }
}

// Run test
testEmail()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
