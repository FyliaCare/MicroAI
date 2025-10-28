# Email Setup Guide for MicroAI Contact Form

## Overview
When clients submit the contact form, their information is automatically sent to **microailabs@outlook.com**

## Local Development Setup

1. **Create `.env.local` file** in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your Outlook credentials** to `.env.local`:
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=microailabs@outlook.com
   SMTP_PASSWORD=your_actual_password
   ```

3. **Enable SMTP in Outlook**:
   - Go to Outlook settings
   - Enable "Let devices and apps use POP" or use an App Password if 2FA is enabled
   - For 2FA accounts: Create an App Password at https://account.microsoft.com/security

## Production Deployment (Render)

1. **Go to your Render Dashboard**
2. **Select your service**
3. **Go to "Environment" tab**
4. **Add these environment variables**:
   ```
   SMTP_HOST = smtp-mail.outlook.com
   SMTP_PORT = 587
   SMTP_USER = microailabs@outlook.com
   SMTP_PASSWORD = [your password or app password]
   ```

5. **Save and redeploy**

## Email Features

When a client submits the form, you'll receive an email with:

- ✅ **Beautiful HTML formatted email** with your brand colors
- 👤 Client's full name
- 📧 Email address (clickable to reply)
- 📱 Phone number (if provided)
- 🏢 Company name (if provided)
- 💬 Full message content
- 🕐 Submission timestamp
- 🔄 Reply-to automatically set to client's email

## Email Template Preview

The email includes:
- Gradient header with MicroAI branding
- "NEW INQUIRY" badge
- Well-organized fields
- Direct reply option
- Professional footer

## Testing

1. **Local Testing**:
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3000/contact
   - Fill out and submit the form
   - Check microailabs@outlook.com inbox

2. **Production Testing**:
   - Visit your live site
   - Submit a test inquiry
   - Verify email delivery

## Troubleshooting

### Email not sending?

1. **Check credentials**: Verify SMTP_PASSWORD is correct
2. **Check 2FA**: If 2FA enabled, use App Password instead
3. **Check spam folder**: First emails may go to spam
4. **Check logs**: Look at Render logs for error messages

### Common Issues

- **"Authentication failed"**: Wrong password or 2FA not configured
- **"Connection timeout"**: Check SMTP_HOST and SMTP_PORT
- **"Sender rejected"**: Verify SMTP_USER matches your Outlook email

## Security Notes

- ⚠️ Never commit `.env.local` to git (it's in .gitignore)
- ⚠️ Use App Passwords for accounts with 2FA
- ⚠️ Store credentials securely in Render's environment variables
- ✅ Form submissions continue to work even if email fails

## Alternative Email Providers

If you want to use a different email service:

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### SendGrid (Recommended for production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

## Support

If you encounter issues, check:
1. Environment variables are set correctly
2. Email credentials are valid
3. Outlook/email provider allows SMTP access
4. Check Render logs for detailed error messages
