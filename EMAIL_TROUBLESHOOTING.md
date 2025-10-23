# Email Setup Troubleshooting Guide

## Quick Setup Checklist

### For Render Deployment

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your MicroAI service**
3. **Go to "Environment" tab**
4. **Add these 4 variables**:

```
SMTP_HOST = smtp-mail.outlook.com
SMTP_PORT = 587
SMTP_USER = microailabs@outlook.com
SMTP_PASSWORD = [YOUR_PASSWORD_HERE]
```

5. **Click "Save Changes"**
6. **Wait for automatic redeploy** (or manually trigger redeploy)

---

## Getting Your Outlook Password

### Option 1: Regular Password (No 2FA)
- Use your regular Outlook account password
- Make sure SMTP is enabled in Outlook settings (see "How to Enable SMTP" below)

### Option 2: App Password (If 2FA is Enabled) ⭐ RECOMMENDED

1. Go to: https://account.microsoft.com/security
2. Click **"Advanced security options"**
3. Scroll to **"App passwords"**
4. Click **"Create a new app password"**
5. Copy the generated password
6. Use THIS password in `SMTP_PASSWORD` (not your regular password)

---

## How to Enable SMTP in Outlook

### Method 1: Enable POP/IMAP (Enables SMTP)

1. **Sign in to Outlook.com**:
   - Go to: https://outlook.live.com/mail/
   - Sign in with microailabs@outlook.com

2. **Open Settings**:
   - Click the ⚙️ gear icon (top right)
   - Click "View all Outlook settings" at the bottom

3. **Navigate to Sync Email**:
   - Click "Mail" in the left sidebar
   - Click "Sync email"

4. **Enable POP and IMAP**:
   - Under "POP and IMAP", toggle to **ON**
   - Check these options:
     - ✅ "Let devices and apps use POP"
     - ✅ "Let devices and apps use IMAP"
   - Click "Save"

5. **SMTP is now enabled!**

### Method 2: Verify SMTP Access

1. **Check Account Security**:
   - Go to: https://account.microsoft.com/security
   - Look for "Security basics"
   - Ensure your account is not blocked from sending

2. **Allow Less Secure Apps** (if needed):
   - Go to: https://account.microsoft.com/security
   - Click "Advanced security options"
   - If you see "App passwords" - you have 2FA enabled (use Option 2 above)
   - If no 2FA, ensure there are no security blocks

### Method 3: Check for Blocks

1. **Recent Activity**:
   - Go to: https://account.microsoft.com/activity
   - Check if there are any "unusual activity" warnings
   - Approve any SMTP connection attempts

2. **Sign-in from New Location**:
   - If Render servers are in a different location, Microsoft might block it
   - Check your email for any "New sign-in" alerts
   - Approve the sign-in if prompted

### Screenshots Guide

**Step 1: Settings Gear Icon**
```
Outlook.com → Click ⚙️ (top right) → "View all Outlook settings"
```

**Step 2: Mail > Sync Email**
```
Settings → Mail → Sync email → Enable POP and IMAP toggle
```

**Step 3: Save**
```
Scroll down → Click "Save" button
```

---

## Testing the Email System

### Test Locally First

1. **Create `.env.local` file** in your project root:
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=microailabs@outlook.com
   SMTP_PASSWORD=your_password_here
   ```

2. **Start dev server**:
   ```bash
   npm run dev
   ```

3. **Visit**: http://localhost:3000/contact

4. **Submit test form**

5. **Check**:
   - Terminal logs for success/error messages
   - microailabs@outlook.com inbox
   - Test email sender's inbox for auto-reply

### Test on Production (Render)

1. **Ensure environment variables are set** in Render
2. **Visit your live site** contact page
3. **Submit a test inquiry**
4. **Check both inboxes**:
   - Your inbox (microailabs@outlook.com) - should receive notification
   - Test sender's inbox - should receive auto-reply confirmation

---

## Common Issues & Solutions

### Issue 1: "Authentication Failed" Error

**Cause**: Wrong password or 2FA not configured

**Solution**:
- ✅ Use App Password instead of regular password (if 2FA enabled)
- ✅ Double-check password has no extra spaces
- ✅ Verify SMTP_USER matches your Outlook email exactly

### Issue 2: "Connection Timeout"

**Cause**: Wrong SMTP settings

**Solution**:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```
NOT 465, NOT 25 - must be 587 for Outlook

### Issue 3: No Email Received (But No Errors)

**Possible Causes**:
1. Email went to spam folder ➜ Check spam/junk
2. Outlook blocking SMTP ➜ Enable SMTP in Outlook settings
3. Rate limiting ➜ Wait a few minutes and try again

**Solution**:
- Check spam folders
- Add microailabs@outlook.com to safe senders
- **Enable POP and IMAP in Outlook**:
  1. Go to https://outlook.live.com
  2. Click ⚙️ gear icon → "View all Outlook settings"
  3. Mail → Sync email
  4. Toggle "Let devices and apps use POP" to ON
  5. Toggle "Let devices and apps use IMAP" to ON
  6. Click Save

### Issue 4: "Invalid Login" Error

**Solution**:
1. Try signing in to https://outlook.com in browser
2. If prompted, complete any security verification
3. Enable "Less secure app access" or use App Password
4. Re-enter credentials in Render environment variables

### Issue 5: Emails Working Locally But Not on Render

**Cause**: Environment variables not set in Render

**Solution**:
1. Go to Render Dashboard
2. Select your service
3. Environment tab
4. Verify ALL 4 variables are present:
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USER
   - SMTP_PASSWORD
5. Click "Manual Deploy" → "Clear build cache & deploy"

---

## Checking Render Logs

### How to View Logs:

1. Go to Render Dashboard
2. Select your MicroAI service
3. Click "Logs" tab
4. Look for these messages:

**Success Messages**:
```
Email sent successfully to microailabs@outlook.com
Auto-reply confirmation sent to client: [client-email]
```

**Error Messages**:
```
Email sending error: [error details]
Auto-reply error: [error details]
```

### What to Look For:

- ✅ "Email sent successfully" = Working perfectly
- ❌ "Authentication failed" = Wrong password
- ❌ "Connection timeout" = Wrong SMTP settings
- ❌ "Invalid login" = Account issue

---

## Alternative: Using Gmail (If Outlook Issues Persist)

### Gmail Setup:

1. **Enable 2-Step Verification**: https://myaccount.google.com/security
2. **Create App Password**: https://myaccount.google.com/apppasswords
3. **Update Environment Variables**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-character-app-password
   ```

---

## Email Features Included

### Admin Notification Email:
- 🚀 Beautiful gradient header
- 👤 Client's full details
- 💬 Complete message
- 🕐 Timestamp
- 📧 Direct reply option

### Client Auto-Reply Email:
- ✓ Confirmation badge
- ⚡ "What happens next" timeline
- 📋 Submission summary
- 🚀 Why choose MicroAI section
- 💡 Pro tips
- 🔗 Link to portfolio

---

## Final Checklist

Before going live, verify:

- [ ] Environment variables set in Render
- [ ] SMTP_PASSWORD is correct (use App Password if 2FA)
- [ ] Test email sent successfully
- [ ] Admin receives notification
- [ ] Client receives auto-reply
- [ ] Both emails formatted properly
- [ ] No errors in Render logs

---

## Need More Help?

### Check These:
1. **Render Logs** - Most errors show here
2. **Outlook Settings** - Ensure SMTP is enabled
3. **Spam Folders** - Check both admin and client
4. **Environment Variables** - Verify spelling and values

### Still Not Working?

Try this debugging test:

1. Add console.log to see if email function is called
2. Check if transporter is created successfully
3. Verify SMTP credentials are loaded from env
4. Test with a different email address
5. Try Gmail instead of Outlook temporarily

---

## Contact Form Flow

```
User fills form
      ↓
Validates data
      ↓
Sends to your inbox (microailabs@outlook.com)
      ↓
Sends auto-reply to client
      ↓
Both see confirmation message
```

**Important**: Form submission succeeds even if emails fail (graceful degradation)
