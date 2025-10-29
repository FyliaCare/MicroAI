# 🎯 Client Portal Setup - Quick Checklist

## ✅ COMPLETED

- [x] Database migration applied (10 new tables created)
- [x] Environment variables added to .env
- [x] Setup documentation created
- [x] Test script created
- [x] All changes committed to GitHub

---

## 📋 YOUR ACTION ITEMS

### 🔴 CRITICAL (Do These First)

#### 1. Set Up Email Provider (5 minutes)

**Option A: Resend (Recommended)**
- [ ] Go to https://resend.com and create account
- [ ] Get API key from https://resend.com/api-keys
- [ ] Update .env: `RESEND_API_KEY="re_your_actual_key"`
- [ ] Test sending: Run dev server and trigger an email

**Option B: SendGrid**
- [ ] Go to https://sendgrid.com and create account
- [ ] Get API key from Settings > API Keys
- [ ] Update .env: `SENDGRID_API_KEY="SG.your_actual_key"`

#### 2. Update Admin Email (1 minute)
```env
# In .env file, change this:
ADMIN_EMAIL="admin@microai.com"

# To your real email:
ADMIN_EMAIL="your-actual-email@example.com"
```

#### 3. Generate Secure CRON_SECRET (1 minute)
```powershell
# Run this command:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and update .env:
CRON_SECRET="paste_the_generated_secret_here"
```

---

### 🟡 IMPORTANT (Before Production)

#### 4. Test Locally (10 minutes)
```powershell
# Start dev server
npm run dev

# In another terminal, run test script:
.\scripts\test-client-portal.ps1

# Open Prisma Studio to see database:
npx prisma studio
```

#### 5. Test Complete Workflow (20 minutes)
- [ ] Submit a project request via contact form
- [ ] Approve it in admin dashboard
- [ ] Check email for client credentials
- [ ] Login as client at /client/login
- [ ] Upload a document
- [ ] Request code access
- [ ] Check admin receives notifications

---

### 🟢 PRODUCTION DEPLOYMENT

#### 6. Set Up Production Environment Variables on Render
- [ ] Go to Render dashboard → Your service → Environment
- [ ] Add all variables from .env (use production values):
  ```
  DATABASE_URL
  DIRECT_URL
  NEXTAUTH_URL (https://your-domain.com)
  NEXTAUTH_SECRET (generate new 64-char secret)
  NEXT_PUBLIC_APP_URL (https://your-domain.com)
  ADMIN_EMAIL
  CRON_SECRET (generate new secret)
  RESEND_API_KEY
  ```

#### 7. Set Up Cron Jobs on Render
- [ ] Create cron job: "Cleanup Unverified Accounts"
  - Schedule: `0 0 * * *` (daily at midnight)
  - Command: `curl -X POST https://your-domain.com/api/cron/cleanup-unverified -H "Authorization: Bearer YOUR_CRON_SECRET"`

- [ ] Create cron job: "Auto-Approve Code Access"
  - Schedule: `0 * * * *` (every hour)
  - Command: `curl -X POST https://your-domain.com/api/cron/auto-approve-code-access -H "Authorization: Bearer YOUR_CRON_SECRET"`

#### 8. Deploy to Production
```powershell
git push origin main
```
- [ ] Wait for Render to deploy
- [ ] Check deployment logs
- [ ] Verify migration ran: `npx prisma migrate deploy`
- [ ] Test production URL

---

## 📖 Detailed Guides

- **Complete Setup Guide**: `docs/guides/CLIENT_PORTAL_SETUP.md`
- **Email Setup**: `docs/guides/EMAIL_SETUP.md`
- **Deployment Guide**: `docs/deployment/DEPLOYMENT_READY.md`

---

## 🧪 Quick Test Commands

```powershell
# Test API health
curl http://localhost:3000/api/health

# Test cleanup cron (local)
curl -X POST http://localhost:3000/api/cron/cleanup-unverified `
  -H "Authorization: Bearer your-cron-secret"

# Test auto-approve cron (local)
curl -X POST http://localhost:3000/api/cron/auto-approve-code-access `
  -H "Authorization: Bearer your-cron-secret"

# Open database viewer
npx prisma studio

# Run all tests
.\scripts\test-client-portal.ps1
```

---

## ❓ Common Questions

**Q: How do I test email sending locally?**
A: Set up Resend (free tier), add API key to .env, restart dev server, trigger an email action (e.g., approve a project request)

**Q: What happens if I don't set up cron jobs?**
A: Manual tasks:
- Unverified accounts won't auto-delete (you can manually delete)
- Code access won't auto-approve after 24hrs (you can manually approve)

**Q: Can I use a different email provider?**
A: Yes, but you'll need to modify the email sending logic in the API routes. Resend/SendGrid are pre-configured.

**Q: How do I access the admin dashboard?**
A: Go to `/admin` and login with your NextAuth credentials

---

## 🎉 Next Steps After Setup

1. Customize email templates (in API routes)
2. Add your branding/logo to client portal
3. Configure GitHub integration for code delivery
4. Set up custom domain on Render
5. Add analytics tracking

---

**Total Setup Time: ~40 minutes**

**Status: All code complete, just needs configuration! 🚀**
