# Email Queue Cron Job - Fix Guide

## Issue Found: Invalid Resend API Key

The email queue processing is failing because the Resend API key is invalid.

## Current Status
- ✅ 8 pending emails in queue
- ✅ Email queue script working correctly
- ✅ Environment variables configured
- ❌ Resend API key is invalid or expired

## Solution

### 1. Get a Valid Resend API Key

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Sign in or create an account
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Update Environment Variables

Update both `.env` and `.env.local` files:

```bash
RESEND_API_KEY="re_YOUR_NEW_API_KEY_HERE"
RESEND_FROM_EMAIL="MicroAI Systems <sales@microaisystems.com>"
RESEND_TO_EMAIL="sales@microaisystems.com"
```

**IMPORTANT**: For the FROM email to work, you must either:
- Use Resend's test domain: `onboarding@resend.dev` (for testing only)
- Verify your domain `microaisystems.com` in Resend (for production)

### 3. Domain Verification (Production)

To use `sales@microaisystems.com` as FROM address:

1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter: `microaisystems.com`
4. Add the DNS records provided by Resend to your domain registrar:
   - SPF record
   - DKIM record
   - DMARC record (optional but recommended)
5. Wait for verification (usually takes a few minutes)

### 4. Testing Configuration

Use the test domain first to verify everything works:

```bash
# In .env and .env.local
RESEND_FROM_EMAIL="MicroAI Systems <onboarding@resend.dev>"
```

Then run:
```bash
npx tsx scripts/process-email-queue.ts
```

### 5. Manual Email Queue Processing

To manually process emails anytime:

```bash
# Check queue status
npx tsx scripts/test-email-queue.ts

# Process pending emails
npx tsx scripts/process-email-queue.ts
```

### 6. Automatic Processing (Production)

#### Option A: Render Cron Jobs (Recommended)

1. In Render Dashboard, go to your service
2. Add a new Cron Job:
   - **Schedule**: `*/10 * * * *` (every 10 minutes)
   - **Command**: `curl https://your-app.onrender.com/api/cron/process-email-queue`
   - **Environment Variables**: Add `CRON_SECRET`

#### Option B: External Cron Service

Use a service like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [UptimeRobot](https://uptimerobot.com)

Configure to hit:
```
https://your-app.onrender.com/api/cron/process-email-queue
```

With header:
```
Authorization: Bearer YOUR_CRON_SECRET
```

## Current Pending Emails

You have 8 emails waiting to be sent:
1. chiefclient@microaisystems.com - Project Request Updates (3 emails)
2. ojmontymonty@gmail.com - Welcome + Password Change (2 emails)
3. mercycherbu21@gmail.com - Welcome + Password Change (2 emails)
4. fyliacare@gmail.com - Project Approval Welcome (1 email)

Once you update the Resend API key, run:
```bash
npx tsx scripts/process-email-queue.ts
```

All emails will be sent automatically!

## Quick Fix Summary

1. Get new Resend API key from https://resend.com/api-keys
2. Update `.env` and `.env.local` files with the new key
3. Use `onboarding@resend.dev` for testing OR verify `microaisystems.com` domain
4. Run: `npx tsx scripts/process-email-queue.ts`
5. Set up automatic cron job for production

---

**Need Help?**
- Resend Documentation: https://resend.com/docs
- Domain Verification Guide: https://resend.com/docs/dashboard/domains/introduction
