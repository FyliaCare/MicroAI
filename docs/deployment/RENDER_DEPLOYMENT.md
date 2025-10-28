# Render Deployment Guide for MicroAI Platform

## Quick Deployment Steps

### 1. Prerequisites
- GitHub account with your MicroAI repository
- Render account (sign up at https://render.com)

### 2. Deploy to Render

#### Option A: Using render.yaml (Recommended)
1. Go to https://render.com/dashboard
2. Click "New +"
3. Select "Blueprint"
4. Connect your GitHub repository: `FyliaCare/MicroAI`
5. Select the `main` branch
6. Render will automatically detect the `render.yaml` file
7. Click "Apply" to deploy

#### Option B: Manual Setup
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `FyliaCare/MicroAI`
4. Configure the service:
   - **Name**: microai-platform
   - **Region**: Oregon (or your preferred region)
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 3. Environment Variables (if needed)
Add these in the Render dashboard under "Environment":
- `NODE_ENV`: production
- `NEXT_PUBLIC_API_URL`: (your Render URL will be provided after deployment)

### 4. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy your application
- Your site will be available at: `https://microai-platform.onrender.com` (or similar)

## Post-Deployment

### Access Your Application
- **Live Site**: Your Render URL (e.g., https://microai-platform.onrender.com)
- **Admin Dashboard**: https://your-render-url.onrender.com/admin

### Auto-Deploy
Render automatically deploys when you push to the `main` branch on GitHub.

### Custom Domain (Optional)
1. Go to your service settings on Render
2. Navigate to "Custom Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Monitoring
- View logs in the Render dashboard
- Monitor performance and uptime
- Set up notifications for deployment status

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

### App Not Loading
- Check if the build completed successfully
- Review application logs
- Verify environment variables are set correctly

### Performance Issues
- Consider upgrading from Free tier
- Enable caching
- Optimize images and assets

## Free Tier Limitations
- Spins down after 15 minutes of inactivity
- Takes ~30 seconds to spin up on first request
- 750 hours/month of runtime
- Upgrade to Starter plan ($7/month) for always-on service

## Support
- Render Documentation: https://render.com/docs
- GitHub Repository: https://github.com/FyliaCare/MicroAI
