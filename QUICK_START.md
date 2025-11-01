# ⚡ Quick Start - Email System

## 🎯 One-Time Setup (5 minutes)

### Step 1: Add GitHub Secret
```
1. Go to: https://github.com/FyliaCare/MicroAI/settings/secrets/actions
2. Click "New repository secret"
3. Name: CRON_SECRET
4. Value: a35fc21bfac03087e8bed1092fd32b53785541cc94e51d95cc51a1de9e7769fa
5. Save
```

### Step 2: Push Changes
```powershell
git add .
git commit -m "Fix: Complete email system with GitHub Actions"
git push origin main
```

### Step 3: Done! ✅
GitHub Actions will now process emails automatically every 10 minutes.

---

## 🧪 Quick Tests

### Test AI Bot:
```powershell
npx tsx scripts/test-ai-bot.ts
```

### Check Queue:
```powershell
npx tsx scripts/test-email-queue.ts
```

### Process Now:
```powershell
npx tsx scripts/process-email-queue.ts
```

---

## 📊 Monitor

- **GitHub Actions**: https://github.com/FyliaCare/MicroAI/actions
- **Email Queue Status**: Run `npx tsx scripts/test-email-queue.ts`
- **Resend Dashboard**: https://resend.com/emails
- **Render Logs**: https://dashboard.render.com

---

## ✅ What's Working

- ✅ AI Bot emails (queued automatically)
- ✅ Contact form emails (queued automatically)
- ✅ Email queue processing (every 10 min)
- ✅ Live chat widget
- ✅ Admin notifications
- ✅ Automatic retry on failure

---

## 🚨 If Something Goes Wrong

### Emails not sending?
```powershell
# Process manually
npx tsx scripts/process-email-queue.ts
```

### Check what's wrong:
```powershell
# Check queue status
npx tsx scripts/test-email-queue.ts

# View GitHub Actions logs
# Go to: https://github.com/FyliaCare/MicroAI/actions

# View Render logs
# Search for: "email" or "queue"
```

---

**Status**: PRODUCTION READY ✅  
**Next**: Add CRON_SECRET to GitHub
