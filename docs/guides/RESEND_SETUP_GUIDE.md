# Resend Email Setup Guide for MicroAI Systems

## Overview

This guide shows you how to set up **Resend** for sending transactional emails from your MicroAI platform (quote PDFs, contact forms, notifications, etc.).

### Gmail vs Resend: What's the Difference?

- **Gmail/Google Workspace**: For *receiving* emails at sales@microaisystems.com
- **Resend**: For *sending* automated emails from your Next.js app

You need **both** services configured.

---

## Step 1: Create Resend Account

1. Go to **[resend.com](https://resend.com)**
2. Sign up for a free account
3. Free tier includes:
   - ✅ 100 emails per day
   - ✅ 1 custom domain
   - ✅ Full API access
   - ✅ Unlimited contacts

---

## Step 2: Get Your API Key

1. Log into Resend dashboard
2. Go to **[API Keys](https://resend.com/api-keys)**
3. Click **"Create API Key"**
4. Give it a name: `MicroAI Production`
5. Copy the API key (starts with `re_`)
   - ⚠️ **Save it now** - you won't see it again!

---

## Step 3: Add Your Domain to Resend

### 3.1 Add Domain

1. In Resend dashboard, go to **[Domains](https://resend.com/domains)**
2. Click **"Add Domain"**
3. Enter: `microaisystems.com`
4. Click **"Add"**

### 3.2 Configure DNS Records

Resend will show you 3 DNS records to add. Here's what they look like:

#### Record 1: SPF (Sender Policy Framework)
```
Type: TXT
Host: @
Value: v=spf1 include:resend.com ~all
TTL: Automatic
```

#### Record 2: DKIM (Domain Keys)
```
Type: TXT
Host: resend._domainkey
Value: [Resend will provide this - unique per domain]
TTL: Automatic
```

#### Record 3: DMARC (Email Authentication)
```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:sales@microaisystems.com
TTL: Automatic
```

### 3.3 Add Records to Namecheap

1. Log into **Namecheap**
2. Go to **Domain List** → Click **Manage** on microaisystems.com
3. Navigate to **Advanced DNS** tab
4. Click **"ADD NEW RECORD"** (red button)
5. Add each of the 3 records above
6. Click the ✓ checkmark to save each one

**Screenshot Reference:**
- You already know where this is (you did it for Gmail!)
- Same process, different values

### 3.4 Verify Domain in Resend

1. Go back to Resend dashboard → Domains
2. Click **"Verify DNS Records"**
3. If successful, you'll see: ✅ **Verified**
4. If not verified:
   - Wait 15-30 minutes for DNS propagation
   - Click "Verify" again
   - Check that all 3 records were added correctly

---

## Step 4: Configure Your .env.local File

Open your `.env.local` file and update these values:

```bash
# ==============================================
# EMAIL CONFIGURATION - RESEND
# ==============================================
# Paste your API key here (from Step 2)
RESEND_API_KEY="re_YourActualApiKeyHere"

# From email (after domain verification)
RESEND_FROM_EMAIL="MicroAI Systems <sales@microaisystems.com>"

# Where admin notifications go (your Gmail)
RESEND_TO_EMAIL="sales@microaisystems.com"
```

### Before Domain Verification

If your domain isn't verified yet, use Resend's test domain:

```bash
RESEND_FROM_EMAIL="MicroAI Systems <onboarding@resend.dev>"
```

This lets you test immediately while DNS propagates.

---

## Step 5: Test Your Setup

### 5.1 Start Your Dev Server

```powershell
npm run dev
```

### 5.2 Test the AI Chat Bot

1. Go to http://localhost:3000
2. Click the AI chat bot (bottom right)
3. Fill out the project inquiry form
4. Submit

### 5.3 Check Your Email

You should receive 2 emails:

1. **Admin Notification** (to sales@microaisystems.com):
   - Subject: "🤖 New AI Bot Inquiry from [Name]"
   - Contains all project details
   - Formatted beautifully

2. **Client Auto-Reply** (to the email you entered):
   - Subject: "🚀 Your Project Details Received"
   - Professional confirmation
   - Next steps outlined

### 5.4 Check Resend Dashboard

1. Go to **[Resend Logs](https://resend.com/emails)**
2. You should see both emails:
   - Status: ✅ Delivered
   - Opens/Clicks tracked

---

## Step 6: Update Production (Render)

When deploying to production, add these environment variables to Render:

1. Go to your **[Render Dashboard](https://dashboard.render.com)**
2. Select your MicroAI service
3. Go to **Environment** tab
4. Add:
   ```
   RESEND_API_KEY=re_YourProductionApiKeyHere
   RESEND_FROM_EMAIL=MicroAI Systems <sales@microaisystems.com>
   RESEND_TO_EMAIL=sales@microaisystems.com
   ```
5. Click **"Save Changes"**
6. Wait for automatic redeploy

---

## Troubleshooting

### Issue: "Domain not verified"

**Solution:**
- Check DNS records are exactly as shown
- Wait 30-60 minutes for DNS propagation
- Use `nslookup -type=TXT resend._domainkey.microaisystems.com` to verify
- Make sure no typos in DNS records

### Issue: Emails not sending

**Possible causes:**

1. **API Key not set**
   - Check `.env.local` has correct `RESEND_API_KEY`
   - Restart dev server after changing `.env.local`

2. **Domain not verified**
   - Use `onboarding@resend.dev` temporarily
   - Complete domain verification (Step 3)

3. **Rate limit exceeded**
   - Free tier: 100 emails/day
   - Upgrade to paid plan if needed

4. **Invalid from email**
   - Must match verified domain
   - Format: `Name <email@domain.com>`

### Issue: Emails going to spam

**Solutions:**
- ✅ Complete domain verification (SPF, DKIM, DMARC)
- ✅ Use your verified domain (not onboarding@resend.dev)
- ✅ Add proper reply-to address
- ✅ Include unsubscribe link (for marketing emails)
- ✅ Build sender reputation gradually

---

## Current Email Integrations in MicroAI

Your platform currently sends emails for:

1. **AI Chat Bot Inquiries** ✅
   - File: `/src/app/api/project-inquiry/route.ts`
   - Triggers: When user submits project inquiry
   - Sends: Admin notification + Client auto-reply

2. **Quote PDFs** (Future)
   - When: Quote is finalized
   - Sends: PDF attachment to client

3. **Client Portal** (Future)
   - Password resets
   - Portal access notifications
   - Project updates

4. **Admin Notifications** (Future)
   - New quote requests
   - Client responses
   - System alerts

---

## Advanced: Custom Email Templates

All email templates are in `/src/app/api/project-inquiry/route.ts`.

To customize:

1. Edit the HTML in `adminEmailHtml` or `clientEmailHtml`
2. Use inline CSS (email clients don't support external CSS)
3. Test with multiple email clients (Gmail, Outlook, Apple Mail)
4. Use [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com) for advanced testing

---

## Cost Breakdown

### Free Tier (Current)
- **Cost**: $0/month
- **Limit**: 100 emails/day
- **Features**: Full API, 1 domain, analytics

### Pro Plan (When Needed)
- **Cost**: $20/month
- **Limit**: 50,000 emails/month
- **Features**: Multiple domains, team access, priority support

### When to Upgrade?
- You're consistently hitting 100 emails/day
- Need multiple sending domains
- Require advanced analytics
- Want priority support

**Current estimate**: Free tier sufficient for first 6-12 months

---

## Resources

- **Resend Dashboard**: https://resend.com/overview
- **API Documentation**: https://resend.com/docs
- **Email Logs**: https://resend.com/emails
- **Domain Status**: https://resend.com/domains
- **Pricing**: https://resend.com/pricing

---

## Quick Reference Commands

```powershell
# Install Resend (already installed)
npm install resend

# Test email locally
npm run dev
# Then use AI chat bot at http://localhost:3000

# Check Resend package version
npm list resend

# Update Resend
npm update resend
```

---

## Need Help?

**Resend Support:**
- Email: support@resend.com
- Discord: https://resend.com/discord
- Documentation: https://resend.com/docs

**MicroAI Systems:**
- Email: sales@microaisystems.com
- Check `/docs/guides/EMAIL_SETUP.md` for general email configuration

---

*Last Updated: October 30, 2025*
