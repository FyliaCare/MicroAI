# Fix Render Database Connection Error

## Problem
```
Can't reach database server at `ep-long-butterfly-a42v8oo9-pooler.us-east-1.aws.neon.tech:5432`
```

## Likely Causes
1. **Neon database is asleep** (free tier sleeps after inactivity)
2. **DATABASE_URL missing or incorrect** in Render environment
3. **SSL mode not specified** in connection string

## Solutions

### Step 1: Wake Up Neon Database
1. Go to https://console.neon.tech/
2. Sign in to your account
3. Find your database project
4. Click on it to wake it up (it auto-wakes on first connection attempt)
5. Verify it shows "Active" status

### Step 2: Verify DATABASE_URL in Render
1. Go to https://dashboard.render.com/
2. Select your web service
3. Go to **Environment** tab
4. Verify `DATABASE_URL` exists and has this format:

```
postgresql://neondb_owner:npg_Rphc4QyKgCb1@ep-long-butterfly-a42v8oo9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Important:** Make sure it includes `?sslmode=require` at the end!

### Step 3: If DATABASE_URL is Missing or Wrong

**Correct Format:**
```
postgresql://[username]:[password]@[host]/[database]?sslmode=require
```

**Your Connection Details:**
- **Host:** `ep-long-butterfly-a42v8oo9-pooler.us-east-1.aws.neon.tech`
- **Database:** `neondb`
- **Username:** `neondb_owner`
- **Password:** `npg_Rphc4QyKgCb1` (get the real one from Neon)

**To Update in Render:**
1. Go to your web service → Environment
2. Find `DATABASE_URL` variable
3. Click **Edit**
4. Paste the correct connection string
5. Click **Save Changes**
6. **Redeploy** your service (it should auto-redeploy on env change)

### Step 4: Get Fresh Connection String from Neon

If you're unsure about the password:

1. Go to https://console.neon.tech/
2. Select your project
3. Go to **Dashboard**
4. Under **Connection Details**, click **Show password**
5. Copy the full connection string
6. Make sure it includes `?sslmode=require`
7. Update it in Render

### Step 5: Test Connection

After updating:
1. Render will automatically redeploy
2. Watch the deployment logs
3. Look for successful database connection messages
4. Visit your site at https://your-app.onrender.com

### Alternative: Check if Database is Paused

Neon free tier databases pause after inactivity:

1. Go to Neon console
2. Your database might show "Paused" or "Inactive"
3. Click anywhere in the dashboard to wake it
4. Wait 10-30 seconds for it to activate
5. Try deploying again on Render

## Quick Copy-Paste for Render Environment

Add/Update these in Render → Environment:

```bash
DATABASE_URL=postgresql://neondb_owner:YOUR_ACTUAL_PASSWORD@ep-long-butterfly-a42v8oo9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Replace `YOUR_ACTUAL_PASSWORD` with the real password from Neon.

## Verify It Works

Once deployed, you should see in Render logs:
```
✓ Database connection established
✓ Prisma Client initialized
```

Instead of:
```
✗ Can't reach database server
```

## Still Not Working?

1. **Check Neon is actually running:**
   - Log into Neon console
   - Verify project status is "Active"
   - Try connecting from your local machine first

2. **Verify connection string format:**
   ```
   postgresql://USER:PASS@HOST/DB?sslmode=require
   ```
   - No spaces
   - No extra characters
   - Must include `?sslmode=require`

3. **Check Render logs for other errors:**
   - Go to your service → Logs
   - Look for authentication errors
   - Look for SSL certificate errors

4. **Nuclear option - Regenerate Neon password:**
   - Go to Neon console
   - Settings → Reset password
   - Get new connection string
   - Update in Render
   - Redeploy

---

**Most Common Fix:** Database was asleep. Just wake it up in Neon console and redeploy on Render.
