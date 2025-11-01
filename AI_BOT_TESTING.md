# AI Project Bot - Testing & Troubleshooting Guide

## Current Status
✅ **Code is deployed and ready**
- API endpoint: `/api/project-inquiry`
- Environment variables configured
- Email templates ready
- Database integration complete

## How the AI Bot Works

### User Flow:
1. User clicks "Start Your Project" button
2. AI modal opens with friendly greeting
3. Bot asks 7 questions:
   - Project idea/description
   - Project type (Web App, SaaS, Website, Tool, Not sure)
   - Timeline (ASAP, 1 month, Flexible, Exploring)
   - Budget range ($5k, $5-15k, $15-50k, $50k+, Need quote)
   - Name
   - Email
   - Phone (optional)
4. User submits final answer
5. Bot shows success message
6. Modal closes after 5 seconds

### Behind the Scenes:
1. **Admin Notification** - Email sent to `sales@microaisystems.com` with all details
2. **Client Auto-Reply** - Beautiful confirmation email sent to client
3. **Database Records**:
   - ProjectRequest created with status 'pending'
   - Notifications created for all admins
   - Activity log entry
4. **Dashboard Notification** - Red badge appears on admin panel

## Testing the AI Bot

### Method 1: On Production (Render)
1. Visit https://www.microaisystems.com
2. Click "Start Your Project" button (usually in hero section)
3. Complete the conversation
4. Check admin email for notification
5. Check submitted email for auto-reply

### Method 2: Local Testing
1. Start dev server: `npm run dev`
2. Visit http://localhost:3000
3. Click "Start Your Project" button
4. Complete the conversation
5. Run test script: `npx tsx scripts/test-ai-bot.ts`

### Method 3: Direct API Test
```bash
# Test the endpoint directly
npx tsx scripts/test-ai-bot.ts
```

## Common Issues & Solutions

### Issue 1: Emails Not Sending
**Symptoms**: Bot completes but no emails arrive

**Check:**
```bash
# Verify API key
cat .env | grep RESEND_API_KEY

# Test email queue
npx tsx scripts/process-email-queue.ts
```

**Solutions:**
- Verify Resend API key is correct
- Check Resend dashboard for sending errors
- Verify domain is verified in Resend
- Check spam folder

### Issue 2: Database Records Not Created
**Symptoms**: Bot completes but no ProjectRequest in database

**Check:**
```bash
# Open Prisma Studio
npx prisma studio

# Look for ProjectRequest with source='ai-bot'
```

**Solutions:**
- Check DATABASE_URL is correct
- Run `npx prisma generate`
- Check server logs for database errors

### Issue 3: Button Not Showing
**Symptoms**: "Start Your Project" button missing

**Check:**
- Look for button in homepage hero section
- Check browser console for JavaScript errors
- Verify AIProjectModal component is imported

**Solutions:**
- Clear browser cache
- Check if modal is being lazy-loaded correctly
- Verify AdvancedNavbar has the modal trigger

### Issue 4: Modal Won't Open
**Symptoms**: Button clicks but nothing happens

**Check browser console for:**
- React hydration errors
- Component loading errors
- State management issues

**Solutions:**
- Hard refresh page (Ctrl+F5)
- Check for JavaScript errors
- Verify `createPortal` is working

### Issue 5: Form Submission Fails
**Symptoms**: User completes form but gets error

**Check:**
1. Browser DevTools > Network tab
2. Look for POST to `/api/project-inquiry`
3. Check response status and error message

**Solutions:**
- Verify all required fields filled
- Check email format validation
- Review server logs for API errors

## Monitoring & Debugging

### Check Recent Submissions:
```bash
# View project requests in database
npx prisma studio

# Navigate to ProjectRequest model
# Filter by source = 'ai-bot'
# Sort by createdAt descending
```

### Check Email Queue:
```bash
# See pending emails
npx tsx scripts/test-email-queue.ts

# Process stuck emails
npx tsx scripts/process-email-queue.ts
```

### Check Server Logs:
Look for these log messages:
- `✅ AI Bot inquiry email sent via Resend! ID: xxx`
- `✅ AI Bot auto-reply sent via Resend! ID: xxx`
- `✅ Database records created`
- `🤖 AI Bot project inquiry:` (full submission data)

## Expected Behavior

### Successful Submission Shows:
1. **In Browser**: Success message in modal
2. **Admin Email**: Notification with all details
3. **Client Email**: Beautiful confirmation with next steps
4. **Database**: New ProjectRequest record
5. **Admin Dashboard**: Red notification badge

### Email Content Includes:
**Admin Email:**
- 🤖 Subject: "New AI Bot Inquiry from [Name] - [Project Type]"
- All submitted information formatted nicely
- Contact details with clickable links
- Next step reminder to send Teams invite

**Client Email:**
- 🚀 Subject: "Your Project Details Received - MicroAI Systems"
- Confirmation their details were received
- What happens next (4-step process)
- Project summary
- Why MicroAI is different
- CTA to view portfolio

## Production Checklist

✅ **All Ready:**
- [x] API endpoint deployed
- [x] Environment variables set on Render
- [x] Resend API key configured
- [x] Email templates tested
- [x] Database models synchronized
- [x] Admin notifications working
- [x] Auto-reply system working

## Quick Test on Production

1. Go to https://www.microaisystems.com
2. Open browser DevTools (F12)
3. Click "Start Your Project"
4. Complete conversation with test data
5. Check DevTools > Network tab for API call
6. Check admin email inbox
7. Check admin dashboard for notification

## Support Commands

```bash
# Full test suite
npm test

# Check all environment variables
npm run check-env

# Verify email system
npx tsx scripts/test-email-queue.ts

# Process email queue
npx tsx scripts/process-email-queue.ts

# View database
npx prisma studio

# Check server logs on Render
# Go to Render dashboard > Your service > Logs
```

## Notes

- Modal uses `createPortal` to render at document.body level
- Form submission is async with proper error handling
- Emails are queued if Resend API fails
- Database operations continue even if email fails
- All admin users get notifications
- Client gets confirmation regardless of admin email status

---

**Last Updated**: November 1, 2025
**Status**: ✅ Production Ready
