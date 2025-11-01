# Email Queue Cron Job Setup Guide

## Current Status
✅ **Email queue is working** - Emails processed successfully when triggered manually
⚠️ **Cron job needs setup** - Automatic processing not running on schedule

## What's Working
- ✅ Email queue API endpoint: `/api/cron/process-email-queue`
- ✅ Manual processing script: `scripts/process-email-queue.ts`
- ✅ Resend API integration
- ✅ Database queue system
- ✅ Retry logic with exponential backoff

## Recent Test Results
```bash
npx tsx scripts/process-email-queue.ts
# Result: 3/3 emails sent successfully ✅
```

## Setup Automatic Processing on Render

### Method 1: Render Cron Jobs (Recommended)

1. **Go to Render Dashboard**
   - Navigate to your service
   - Click on "Cron Jobs" tab

2. **Create New Cron Job**
   ```
   Name: Process Email Queue
   Schedule: */10 * * * *  (every 10 minutes)
   Command: curl -X POST -H "Authorization: Bearer ${CRON_SECRET}" https://www.microaisystems.com/api/cron/process-email-queue
   ```

3. **Important**: Make sure `CRON_SECRET` is set in your environment variables

### Method 2: External Cron Service

#### Option A: cron-job.org (Free)
1. Go to https://cron-job.org
2. Create free account
3. Add new cron job:
   - URL: `https://www.microaisystems.com/api/cron/process-email-queue`
   - Schedule: Every 10 minutes
   - Add header: `Authorization: Bearer YOUR_CRON_SECRET`

#### Option B: EasyCron (Free tier available)
1. Go to https://www.easycron.com
2. Create account
3. Add cron job:
   - URL: `https://www.microaisystems.com/api/cron/process-email-queue`
   - Interval: 10 minutes
   - Custom headers: `Authorization: Bearer YOUR_CRON_SECRET`

#### Option C: UptimeRobot (Free monitoring + cron)
1. Go to https://uptimerobot.com
2. Create HTTP(s) monitor
3. Set check interval to 10 minutes
4. URL: `https://www.microaisystems.com/api/cron/process-email-queue`

### Method 3: Simple GitHub Actions (Free)

Create `.github/workflows/email-queue.yml`:

```yaml
name: Process Email Queue

on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
  workflow_dispatch:  # Allow manual trigger

jobs:
  process-emails:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger email processing
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://www.microaisystems.com/api/cron/process-email-queue
```

**Add secret to GitHub:**
- Go to repo Settings > Secrets and variables > Actions
- Add `CRON_SECRET` with your secret value

## Environment Variables Required

### On Render:
```bash
RESEND_API_KEY="re_NthpCbZx_HYp37V1UXCLSWoge8tSoBxBN"
RESEND_FROM_EMAIL="sales@microaisystems.com"
CRON_SECRET="your-secure-random-string"  # Generate with: openssl rand -hex 32
```

### Generate a secure CRON_SECRET:
```bash
# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# On Linux/Mac:
openssl rand -hex 32
```

## Testing the Cron Endpoint

### Test Locally (without auth):
```bash
# PowerShell
curl http://localhost:3000/api/cron/process-email-queue
```

### Test Production (with auth):
```bash
# PowerShell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET"
}
Invoke-RestMethod -Uri "https://www.microaisystems.com/api/cron/process-email-queue" -Headers $headers -Method POST
```

### Test Production (curl):
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://www.microaisystems.com/api/cron/process-email-queue
```

## Manual Processing Options

### Option 1: Run Script Directly
```bash
npx tsx scripts/process-email-queue.ts
```

### Option 2: Call API Endpoint
```bash
# From browser or terminal
curl https://www.microaisystems.com/api/cron/process-email-queue
```

## Monitoring & Troubleshooting

### Check Queue Status:
```bash
npx tsx scripts/test-email-queue.ts
```

### View Render Logs:
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Search for: `📧 Starting email queue processing`

### Common Issues:

#### Issue 1: "Unauthorized" Error
**Cause**: CRON_SECRET mismatch or missing
**Fix**: 
- Verify CRON_SECRET is set in Render environment variables
- Use correct secret in Authorization header
- Or temporarily remove auth check for testing

#### Issue 2: No Emails Being Sent
**Cause**: Cron job not running
**Fix**:
- Check cron job is active
- Verify schedule expression
- Test endpoint manually

#### Issue 3: "Email service not configured"
**Cause**: RESEND_API_KEY missing
**Fix**: Add RESEND_API_KEY to environment variables

#### Issue 4: Emails Stuck in "pending"
**Cause**: Cron job not processing or API errors
**Fix**: 
- Run manual script: `npx tsx scripts/process-email-queue.ts`
- Check Resend dashboard for API errors
- Verify domain is verified in Resend

## Recommended Schedule

- **Every 10 minutes**: `*/10 * * * *` (Production)
- **Every 5 minutes**: `*/5 * * * *` (High volume)
- **Every 30 minutes**: `*/30 * * * *` (Low volume)

## Current Queue Configuration

- **Max Attempts**: 3 per email
- **Retry Backoff**: Exponential (5, 10, 20 minutes)
- **Batch Size**: 50 emails per run
- **Priority**: High priority emails first
- **Ordering**: Oldest first within priority

## Success Metrics

✅ **Working Indicators:**
- Emails move from "pending" to "sent" status
- `sentAt` timestamp is populated
- Resend dashboard shows delivered emails
- Recipients receive emails

## Quick Commands Reference

```bash
# Check queue status
npx tsx scripts/test-email-queue.ts

# Process queue manually
npx tsx scripts/process-email-queue.ts

# Test cron endpoint (production)
curl -H "Authorization: Bearer YOUR_SECRET" https://www.microaisystems.com/api/cron/process-email-queue

# View database
npx prisma studio
# Navigate to EmailQueue model
```

## Next Steps

1. **Choose a cron method** (Render, external service, or GitHub Actions)
2. **Set up the cron job** with 10-minute interval
3. **Add CRON_SECRET** to environment variables
4. **Test the endpoint** manually first
5. **Monitor logs** to verify it's running
6. **Check queue status** after 10 minutes

## Alternative: Disable Auth Temporarily

If you need to test without authentication, you can temporarily modify the endpoint:

```typescript
// In src/app/api/cron/process-email-queue/route.ts
// Comment out the auth check:
/*
if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  )
}
*/
```

**Note**: Re-enable authentication for production!

---

**Status**: System is ready - just needs cron job configuration
**Last Updated**: November 1, 2025
