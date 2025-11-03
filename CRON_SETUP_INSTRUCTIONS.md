# Email Queue Cron Setup

## Problem
Render's cron jobs are unreliable and emails aren't being sent automatically.

## Solution
Use an external free cron service to trigger email processing every 5 minutes.

## Setup Instructions

### Option 1: cron-job.org (Recommended - Free)

1. Go to https://cron-job.org/en/
2. Create a free account
3. Click "Create Cronjob"
4. Configure:
   - **Title**: MicroAI Email Queue Processor
   - **URL**: `https://www.microaisystems.com/api/cron/process-email-queue`
   - **Schedule**: Every 5 minutes (`*/5 * * * *`)
   - **Request Method**: POST
   - **Headers**: Add header `Authorization` with value `Bearer YOUR_CRON_SECRET`
     (Get CRON_SECRET from Render dashboard environment variables)
   - **Notification**: Email on failure (optional)

5. Save and enable the cron job

### Option 2: EasyCron (Free tier available)

1. Go to https://www.easycron.com/
2. Sign up for free account
3. Create new cron job:
   - **URL**: `https://www.microaisystems.com/api/cron/process-email-queue`
   - **Cron Expression**: `*/5 * * * *` (every 5 minutes)
   - **HTTP Method**: POST
   - **HTTP Headers**: `Authorization: Bearer YOUR_CRON_SECRET`

### Option 3: GitHub Actions (Free, built-in)

Create `.github/workflows/process-emails.yml`:

```yaml
name: Process Email Queue

on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:  # Allow manual trigger

jobs:
  process-emails:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Email Processing
        run: |
          curl -X POST "https://www.microaisystems.com/api/cron/process-email-queue" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

Then add `CRON_SECRET` to GitHub repository secrets.

## Manual Testing

Test the endpoint manually:

```powershell
# Windows PowerShell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET_HERE"
}
Invoke-RestMethod -Uri "https://www.microaisystems.com/api/cron/process-email-queue" -Method POST -Headers $headers
```

```bash
# Linux/Mac
curl -X POST "https://www.microaisystems.com/api/cron/process-email-queue" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Current Status

- **Pending Emails**: 36 emails waiting to be sent
- **Cron Status**: Not configured (Render's cron was removed)
- **Action Required**: Set up external cron using one of the options above

## Monitoring

Check email queue status anytime:
```powershell
npx tsx scripts/test-email-queue.ts
```

## Notes

- The endpoint processes up to 50 emails per run
- Failed emails retry with exponential backoff
- Max 3 attempts before marking as failed
- High priority emails are sent first
