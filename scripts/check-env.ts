import 'dotenv/config'

console.log('Environment Variables Check:')
console.log('============================')
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not set')
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || '❌ Not set')
console.log('RESEND_TO_EMAIL:', process.env.RESEND_TO_EMAIL || '❌ Not set')
console.log('CRON_SECRET:', process.env.CRON_SECRET ? '✅ Set' : '❌ Not set')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set')
