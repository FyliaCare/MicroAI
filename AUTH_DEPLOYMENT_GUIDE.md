# Authentication Deployment Guide for Render

## 🚨 Issue: Authentication Not Working on Production

Your authentication works locally but not on the deployed site because the **required environment variables are missing** on Render.

## ✅ Solution: Add Environment Variables to Render

### Step 1: Generate a Secure Secret

Run this command in your terminal to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this Node.js command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the generated secret for the next step.

### Step 2: Add Environment Variables on Render

1. Go to your Render Dashboard: https://dashboard.render.com/
2. Click on your **microai-platform** service
3. Go to the **Environment** tab
4. Click **Add Environment Variable** and add each of these:

#### Required Variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NEXTAUTH_URL` | `https://your-app-name.onrender.com` | Replace with your actual Render URL |
| `NEXTAUTH_SECRET` | `[paste generated secret]` | The secret you generated in Step 1 |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_Rphc4QyKgCb1@ep-long-butterfly-a42v8oo9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require` | Your Neon PostgreSQL connection string |

### Step 3: Find Your Render URL

Your Render URL should be something like:
- `https://microai-platform.onrender.com`
- Or the custom domain if you set one up

To find it:
1. Go to your service dashboard on Render
2. Look at the top of the page for the URL
3. Use this EXACT URL (with https://) for `NEXTAUTH_URL`

### Step 4: Redeploy

After adding the environment variables:
1. Render will automatically redeploy
2. OR click **Manual Deploy** → **Deploy latest commit**
3. Wait for the deployment to complete (~2-5 minutes)

## 🔍 Quick Setup Instructions

Here's the exact setup in order:

```bash
# 1. Generate secret
openssl rand -base64 32

# 2. Add these to Render Environment Variables:
NEXTAUTH_URL=https://microai-platform.onrender.com
NEXTAUTH_SECRET=<generated-secret-from-step-1>
DATABASE_URL=postgresql://neondb_owner:npg_Rphc4QyKgCb1@ep-long-butterfly-a42v8oo9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# 3. Redeploy on Render
```

## 📋 Verification Checklist

After deployment, verify:

- [ ] Can access login page: `https://your-app.onrender.com/admin/login`
- [ ] Login form loads without errors
- [ ] Can submit login with credentials (admin@microai.com / admin123)
- [ ] Successfully redirected to `/admin` after login
- [ ] Admin dashboard shows user name in header
- [ ] Logout button works
- [ ] Accessing `/admin` without login redirects to login page

## 🐛 Troubleshooting

### Issue: Still Not Working After Adding Variables

**Solution:** Check Render logs
1. Go to **Logs** tab in Render dashboard
2. Look for errors related to `NEXTAUTH_URL` or `NEXTAUTH_SECRET`
3. Verify environment variables are set correctly in **Environment** tab

### Issue: "Invalid NEXTAUTH_URL"

**Solution:** Make sure NEXTAUTH_URL includes `https://` and matches your exact Render URL
- ✅ Correct: `https://microai-platform.onrender.com`
- ❌ Wrong: `microai-platform.onrender.com` (missing https://)
- ❌ Wrong: `http://microai-platform.onrender.com` (http instead of https)

### Issue: Database Connection Errors

**Solution:** Verify DATABASE_URL is set correctly
1. Make sure it includes the full connection string from Neon
2. Should have `?sslmode=require` at the end
3. Check Neon dashboard to ensure database is active

### Issue: "Authentication Configuration Error"

**Solution:** Check that NEXTAUTH_SECRET is set
1. It should be a random 32+ character string
2. Generate a new one if needed
3. Don't use spaces or special characters that might be escaped

## 🔐 Production Security Notes

- ✅ Use HTTPS in production (Render provides this automatically)
- ✅ Keep NEXTAUTH_SECRET private (never commit to Git)
- ✅ Change default admin password after first login
- ✅ Use strong, random secret (32+ characters)

## 📝 Next Steps After Deployment

1. **Test Authentication:**
   - Visit: `https://your-app.onrender.com/admin/login`
   - Login with: `admin@microai.com` / `admin123`
   - Verify dashboard access

2. **Change Default Password:**
   - Currently using: `admin123`
   - Create password change feature or update directly in database

3. **Create Additional Admin Users:**
   - Run seed script on production
   - Or create admin user management UI

## 🎯 Expected Behavior After Fix

✅ **Login Page:** Accessible at `/admin/login`
✅ **Authentication:** Works with email/password
✅ **Protected Routes:** `/admin/*` requires login
✅ **API Protection:** `/api/admin/*` returns 401 if not logged in
✅ **Session Persistence:** Stays logged in for 30 days
✅ **Logout:** Destroys session and redirects to login

## 📞 Still Having Issues?

If authentication still doesn't work after following these steps:

1. Check Render logs for specific error messages
2. Verify all environment variables are set correctly
3. Try clearing browser cache/cookies
4. Test in incognito/private browsing mode
5. Check if Prisma migrations ran successfully

## 🚀 Quick Deploy Command

After adding environment variables to Render, push your updated render.yaml:

```bash
git add render.yaml
git commit -m "chore: Update render.yaml with auth environment variables"
git push
```

Render will automatically detect the changes and redeploy.

---

**Important:** The authentication system is fully implemented and working locally. The ONLY issue is missing environment variables on your production server (Render). Adding the three environment variables above will fix it completely.
