# Contact Form Debugging Guide

## Current Status
🔴 **Production is returning 500 errors**
🟡 **Latest fixes pushed - waiting for Render deployment**

## What We Fixed
1. ✅ **Email error handling** - Emails won't break the flow even if they fail
2. ✅ **Better error logging** - Added detailed error messages for debugging

## Latest Commits
- `86b2cb2` - Add detailed error logging to contact form API
- `c307460` - Better error handling for email sending - dont break flow if email fails

## How to Debug on Render

### Step 1: Check Deployment Status
1. Go to https://dashboard.render.com/
2. Click on your "microaisystems" web service
3. Wait for deployment to show **"Live"** with green checkmark
4. Usually takes 2-5 minutes

### Step 2: View Logs
1. In Render dashboard, click **"Logs"** tab
2. Click **"Events"** to see deployment progress
3. Once deployed, test the contact form
4. Watch logs in real-time to see errors

### Step 3: Test the Contact Form
```powershell
# Test command:
Invoke-RestMethod -Uri "https://www.microaisystems.com/api/contact" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"Test User","email":"osibanjanet820@gmail.com","company":"Test Co","message":"Testing after fix"}'
```

If successful, you should see:
```json
{
  "success": true,
  "message": "Thank you for your message...",
  "data": {
    "projectRequestId": "...",
    "requestNumber": "PR-####",
    "submittedAt": "..."
  }
}
```

### Step 4: Check What You Should See in Logs
Look for these log messages:

**✅ Success Flow:**
```
📧 Sending admin notification email...
✅ Admin notification email sent successfully
📧 Sending client confirmation email...
✅ Client confirmation email sent successfully
✅ Contact form submission processed: { projectRequestId: ..., requestNumber: PR-####, name: Test User }
```

**❌ If Email Fails (Should Not Break Flow):**
```
📧 Sending admin notification email...
❌ Failed to send admin email: [error message]
📧 Sending client confirmation email...
❌ Failed to send client email: [error message]
✅ Contact form submission processed: { projectRequestId: ..., requestNumber: PR-####, name: Test User }
```

**❌ If Database Fails:**
```
❌ Contact form error: [Error object]
Error details: { message: "...", stack: "...", name: "..." }
```

## Common Issues

### Issue 1: RESEND_API_KEY Not Set
**Symptom:** Logs show "RESEND_API_KEY not configured"
**Solution:** 
1. Go to Render dashboard → Environment
2. Add: `RESEND_API_KEY` = `re_NthoCbZx_HYp37V1UXCLSWoge8tSoBxBN`
3. Save and wait for redeploy

### Issue 2: Database Connection Error
**Symptom:** Logs show Prisma/PostgreSQL errors
**Solution:**
1. Check `DATABASE_URL` environment variable
2. Verify Neon database is running
3. Check if Prisma schema matches database

### Issue 3: No Admin Users in Database
**Symptom:** Notifications not created (but no error)
**Solution:**
```bash
# Connect to your database and check:
SELECT id, email, role FROM "User" WHERE role IN ('admin', 'super-admin');

# If empty, create an admin user through the signup page
# Then update role to 'admin' in database
```

## What the Contact Form Does

1. **Validates Input** (name, email, message required)
2. **Sends Emails** (best effort, won't fail if email service down)
   - Admin notification → `sales@microaisystems.com`
   - Client confirmation → user's email
3. **Creates Database Records:**
   - ProjectRequest (with unique PR-#### number)
   - Notifications (for all admin users)
   - ActivityLog
4. **Returns Success** (with project request details)

## Environment Variables Needed

Required:
- ✅ `DATABASE_URL` - Neon PostgreSQL connection
- ✅ `NEXTAUTH_SECRET` - Auth secret
- ✅ `NEXTAUTH_URL` - https://www.microaisystems.com
- ✅ `RESEND_API_KEY` - For email sending

Optional (have defaults):
- `RESEND_FROM_EMAIL` - Default: sales@microaisystems.com
- `ADMIN_EMAIL` - Default: sales@microaisystems.com

## Next Steps After Fix Works

Once 200 OK is returned:

1. ✅ **Verify Email Delivery**
   - Check sales@microaisystems.com inbox
   - Check test email inbox
   - Both should receive formatted HTML emails

2. ✅ **Check Admin Notifications**
   - Login to admin panel
   - Click notification bell icon
   - Should see "📧 New Contact Form Submission"

3. ✅ **Verify Project Request**
   - Admin panel → Project Requests
   - Should see new request with status "pending"
   - Request number should be PR-####

## Test Chatbot Too

Once contact form works, test the chatbot:
1. Go to https://www.microaisystems.com
2. Click chatbot icon (bottom right)
3. Complete project discussion
4. Should trigger same email/notification flow

## Need Help?

If after deployment logs still show errors:
1. Copy the **full error message** from Render logs
2. Copy the **error stack trace**
3. Share it so I can identify the exact issue

The detailed logging will show exactly which line is failing!
