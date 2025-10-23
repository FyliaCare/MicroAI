# Quick Visual Guide: Enable SMTP in Outlook

## ⚡ 3-Minute Setup

### Step 1: Open Outlook Settings
1. Go to **https://outlook.live.com**
2. Sign in with **microailabs@outlook.com**
3. Click the **⚙️ gear icon** (top-right corner)
4. Click **"View all Outlook settings"** (bottom of the panel)

```
┌─────────────────────────────────────────┐
│  Outlook.com                    [⚙️]    │
│                                         │
│  Click here → View all Outlook settings│
└─────────────────────────────────────────┘
```

---

### Step 2: Navigate to Sync Email
1. In the Settings window, look at the **left sidebar**
2. Click **"Mail"**
3. Click **"Sync email"**

```
Settings Window:
┌──────────────────────────────────────┐
│ ┌──────────┐                         │
│ │ General  │                         │
│ │ Mail ◄──── Click here              │
│ │   Sync email ◄──── Then click here │
│ │   Rules                            │
│ │ Calendar │                         │
│ └──────────┘                         │
└──────────────────────────────────────┘
```

---

### Step 3: Enable POP and IMAP
1. Scroll down to **"POP and IMAP"** section
2. Find two toggles
3. Turn **BOTH** to **ON** (blue)
   - ✅ Let devices and apps use POP
   - ✅ Let devices and apps use IMAP

```
POP and IMAP Section:
┌──────────────────────────────────────────────┐
│ POP and IMAP                                 │
│                                              │
│ Let devices and apps use POP         [ON]   │
│ Let devices and apps use IMAP        [ON]   │
│                                              │
│ ← Make sure both are blue/ON                │
└──────────────────────────────────────────────┘
```

---

### Step 4: Save Changes
1. Scroll to the **bottom** of the page
2. Click the **"Save"** button
3. Close the settings window

```
┌──────────────────────────────────────┐
│                                      │
│                          [ Save ]    │
│                                      │
└──────────────────────────────────────┘
```

---

## ✅ That's It! SMTP is Now Enabled

Your Outlook account can now send emails via SMTP (port 587).

---

## 🔐 If You Have 2-Factor Authentication (2FA)

If you see "App passwords" in your security settings, you need to use an App Password instead:

### Generate App Password:

1. Go to: **https://account.microsoft.com/security**
2. Click **"Advanced security options"**
3. Scroll to **"App passwords"**
4. Click **"Create a new app password"**
5. **Copy the password** (format: xxxx-xxxx-xxxx-xxxx)
6. Use THIS in your Render environment variables

```
Microsoft Account Security:
┌──────────────────────────────────────────┐
│ Advanced security options                │
│                                          │
│ App passwords                            │
│ Create a new app password to use with    │
│ apps that don't support two-step...      │
│                                          │
│ [ Create a new app password ]           │
└──────────────────────────────────────────┘
```

---

## 📝 Add to Render (After Enabling SMTP)

1. **Go to**: https://dashboard.render.com
2. **Select**: Your MicroAI service
3. **Click**: "Environment" tab
4. **Add these 4 variables**:

```
SMTP_HOST = smtp-mail.outlook.com
SMTP_PORT = 587
SMTP_USER = microailabs@outlook.com
SMTP_PASSWORD = [your password or app password here]
```

5. **Click**: "Save Changes"
6. **Wait**: For automatic redeploy (or click "Manual Deploy")

---

## 🧪 Test It!

### Local Test:
```bash
# Create .env.local file
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=microailabs@outlook.com
SMTP_PASSWORD=your_password

# Run dev server
npm run dev

# Visit http://localhost:3000/contact
# Submit test form
# Check inbox!
```

### Production Test:
1. Visit your live site's contact page
2. Submit a test inquiry
3. Check **microailabs@outlook.com** inbox
4. Check the test sender's inbox for auto-reply

---

## ⚠️ Common Mistakes

### ❌ Don't Do This:
- Using regular password when 2FA is enabled → Use App Password instead
- Setting SMTP_PORT to 465 or 25 → Must be **587**
- Forgetting to enable IMAP → Must enable both POP **and** IMAP
- Typo in email address → Must be exact: **microailabs@outlook.com**

### ✅ Do This:
- Use App Password if you have 2FA
- Set SMTP_PORT to **587**
- Enable both POP and IMAP toggles
- Double-check spelling in environment variables
- Check spam folder first time

---

## 🆘 Still Not Working?

### Check These In Order:

1. **Verify Outlook Settings**:
   - Go to Outlook.com → Settings → Mail → Sync email
   - Confirm both POP and IMAP are ON (blue)

2. **Check Environment Variables**:
   - Render Dashboard → Your service → Environment
   - All 4 variables present and correct?

3. **View Render Logs**:
   - Render Dashboard → Your service → Logs
   - Look for "Email sent successfully" or error messages

4. **Check Email**:
   - Look in spam/junk folders
   - Add microailabs@outlook.com to safe senders

5. **Try App Password**:
   - Even without 2FA, App Passwords can work better
   - Generate one at account.microsoft.com/security

---

## 📞 Need Help?

If still stuck after following all steps:

1. **Check Render logs** for specific error messages
2. **Try Gmail temporarily** to isolate the issue
3. **Verify Outlook account** isn't locked or restricted
4. **Contact Microsoft support** if account issues persist

---

## ✨ Success Looks Like This

### In Render Logs:
```
✅ Email sent successfully to microailabs@outlook.com
✅ Auto-reply confirmation sent to client: test@example.com
```

### In Your Inbox:
```
📧 New email: "🚀 New Client Request from [Name]"
Beautiful HTML email with client details
```

### In Client's Inbox:
```
📧 New email: "✓ We've Received Your Message - MicroAI"
Professional auto-reply with next steps
```

---

**That's it! Your contact form is now fully functional with email notifications! 🎉**
