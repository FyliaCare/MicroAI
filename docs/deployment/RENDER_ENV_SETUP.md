# Render Environment Variables Setup

## Required Environment Variables for Render

Copy these environment variables to your Render dashboard:

### 1. DATABASE_URL (PostgreSQL - Neon)
```
postgresql://neondb_owner:npg_Rphc4QyKgCb1@ep-long-butterfly-a42v8oo9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. NODE_ENV
```
production
```

### 3. DIRECT_URL (Optional - for Prisma migrations on Neon)
```
postgresql://neondb_owner:npg_Rphc4QyKgCb1@ep-long-butterfly-a42v8oo9.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## Render Setup Steps

### Step 1: Add Environment Variables
1. Go to your Render dashboard
2. Select your web service
3. Click on "Environment" in the left sidebar
4. Add each environment variable:
   - Click "Add Environment Variable"
   - Key: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_Rphc4QyKgCb1@ep-long-butterfly-a42v8oo9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - Click "Save Changes"

### Step 2: Update Build Command (if needed)
```bash
npm install && npx prisma generate && npm run build
```

### Step 3: Update Start Command
```bash
npm run start
```

### Step 4: Deploy
- Push your code to GitHub
- Render will automatically deploy with the new environment variables

---

## What Was Configured

✅ **Prisma Schema** - Updated from SQLite to PostgreSQL
✅ **Database Connection** - Connected to your Neon PostgreSQL database
✅ **Migrations** - Created and applied PostgreSQL migration
✅ **.env File** - Updated with Neon connection string
✅ **Ready for Production** - All API routes work with PostgreSQL

---

## Testing Locally

Your app is now running locally with Neon PostgreSQL:
- **URL**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3001/admin
- **Database**: Neon PostgreSQL (Cloud)

All data created locally is stored in your Neon database!

---

## After Render Deployment

Once deployed, your admin dashboard will be available at:
```
https://your-app-name.onrender.com/admin
```

All CRUD operations (Projects, Clients, Quotes) will persist to your Neon PostgreSQL database.
