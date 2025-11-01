# Deployment Guide - MicroAI Systems Platform

## Overview
This guide covers deploying the MicroAI Systems platform to Render.com with Neon PostgreSQL database.

## Prerequisites
- GitHub account with repository access
- Render.com account (free tier available)
- Neon PostgreSQL database (free tier available)

## Database Setup (Neon)

### 1. Create Neon Database
1. Go to [neon.tech](https://neon.tech) and create account
2. Create new project: "microai-production"
3. Copy the connection strings:
   - **Pooled connection** (for app): `postgresql://user:pass@host/db?sslmode=require`
   - **Direct connection** (for migrations): `postgresql://user:pass@host/db?sslmode=require`

### 2. Run Database Migrations
```bash
# Set environment variables locally
export DATABASE_URL="your_neon_pooled_connection_string"
export DIRECT_URL="your_neon_direct_connection_string"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed initial data
npm run db:seed
```

## Render Deployment

### 1. Connect GitHub Repository
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select the `MicroAI` repository

### 2. Configure Service
Render will auto-detect `render.yaml`. Verify these settings:

- **Name**: microai-platform
- **Environment**: Node
- **Region**: Oregon (or nearest)
- **Branch**: main
- **Build Command**: `npm install --legacy-peer-deps && npx prisma generate && npm run build`
- **Start Command**: `npm start`

### 3. Set Environment Variables
Add these in Render Dashboard → Environment:

```bash
# Required
NODE_ENV=production
DATABASE_URL=postgresql://your_neon_pooled_connection
DIRECT_URL=postgresql://your_neon_direct_connection
NEXTAUTH_URL=https://your-app.onrender.com
NEXTAUTH_SECRET=generate_random_32_char_secret_here

# Email (SMTP)
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=sales@microaisystems.com
SMTP_PASSWORD=your_outlook_password
EMAIL_FROM=sales@microaisystems.com

# API
NEXT_PUBLIC_API_URL=https://your-app.onrender.com

# Optional
GITHUB_TOKEN=your_github_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Generate Secrets
```bash
# Generate NEXTAUTH_SECRET (run locally)
openssl rand -base64 32
```

### 5. Deploy
1. Click "Create Web Service"
2. Render will:
   - Install dependencies
   - Generate Prisma client
   - Build Next.js app
   - Start production server
3. Monitor build logs for any errors

## Post-Deployment

### 1. Verify Deployment
- Visit: `https://your-app.onrender.com`
- Check: Database connection (should see homepage)
- Test: API routes at `/api/analytics`

### 2. Create Admin User
```bash
# Connect to Neon database and run:
INSERT INTO "Admin" (id, email, password, name, role, "isActive")
VALUES (
  gen_random_uuid(),
  'admin@microai.com',
  '$2a$10$YourHashedPasswordHere',
  'Super Admin',
  'SUPER_ADMIN',
  true
);
```

Or use bcrypt to hash password:
```bash
npx tsx -e "import bcrypt from 'bcryptjs'; console.log(bcrypt.hashSync('your_password', 10))"
```

### 3. Configure Custom Domain (Optional)
1. Render Dashboard → Settings → Custom Domain
2. Add your domain: `microai.com`
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `DATABASE_URL` | Yes | Neon pooled connection | `postgresql://...` |
| `DIRECT_URL` | Yes | Neon direct connection | `postgresql://...` |
| `NEXTAUTH_URL` | Yes | App URL | `https://app.onrender.com` |
| `NEXTAUTH_SECRET` | Yes | Auth encryption key | `32+ char random string` |
| `SMTP_HOST` | Yes | Email server | `smtp-mail.outlook.com` |
| `SMTP_PORT` | Yes | Email port | `587` |
| `SMTP_USER` | Yes | Email username | `email@outlook.com` |
| `SMTP_PASSWORD` | Yes | Email password | `your_password` |
| `EMAIL_FROM` | Yes | Sender email | `noreply@microai.com` |
| `NEXT_PUBLIC_API_URL` | No | Public API URL | `https://app.com` |
| `GITHUB_TOKEN` | No | GitHub integration | `ghp_...` |

## Troubleshooting

### Build Fails
- Check Render build logs
- Verify all environment variables set
- Ensure `DATABASE_URL` and `DIRECT_URL` are correct

### Database Connection Error
- Verify Neon database is active
- Check connection string format
- Ensure SSL mode enabled: `?sslmode=require`

### Migration Issues
```bash
# Reset migrations (CAUTION: deletes data)
npx prisma migrate reset

# Or deploy specific migration
npx prisma migrate deploy
```

### App Crashes
- Check Render logs: Dashboard → Logs
- Verify environment variables
- Check database connection

## Monitoring

### Health Check
- Endpoint: `https://your-app.onrender.com/`
- Status: Should return 200 OK

### Database Monitoring
- Neon Dashboard: Monitor queries, connections
- Enable query insights for performance

### Application Logs
- Render Dashboard → Logs tab
- Filter by severity: Error, Warning, Info

## Maintenance

### Database Backups
- Neon: Automatic backups (point-in-time recovery)
- Manual: Export via `pg_dump`

### Updates
```bash
# Pull latest changes
git pull origin main

# Render auto-deploys on push to main branch
```

### Scaling
- Render: Upgrade plan for more resources
- Neon: Upgrade for more storage/compute

## Security Checklist
- [ ] All environment variables set
- [ ] NEXTAUTH_SECRET is random and secure
- [ ] Database connection uses SSL
- [ ] SMTP credentials secured
- [ ] Admin password is strong
- [ ] CORS configured properly
- [ ] Rate limiting enabled

## Support
- Render: [render.com/docs](https://render.com/docs)
- Neon: [neon.tech/docs](https://neon.tech/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

## Production Checklist
- [ ] Database created on Neon
- [ ] Migrations run successfully
- [ ] Environment variables configured
- [ ] Render service created
- [ ] Build completed successfully
- [ ] Homepage loads correctly
- [ ] Admin login works
- [ ] Email sending works
- [ ] API routes functional
- [ ] Custom domain configured (optional)
