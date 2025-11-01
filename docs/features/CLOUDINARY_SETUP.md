# Cloudinary Setup Guide for MicroAI Blog System

## Why Cloudinary?

Cloudinary provides:
- ✅ **Reliable CDN** - Fast image delivery worldwide
- ✅ **Automatic Optimization** - WebP, AVIF conversion
- ✅ **Image Transformations** - Resize, crop, quality adjustment
- ✅ **No Server Storage** - Saves disk space on Render
- ✅ **Free Tier** - 25GB storage, 25GB bandwidth/month

## Setup Instructions

### 1. Create Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email

### 2. Get API Credentials

1. Go to your Cloudinary Dashboard: [https://cloudinary.com/console](https://cloudinary.com/console)
2. You'll see your credentials:
   - **Cloud Name** (e.g., `dxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Reveal" to see)

### 3. Add to Environment Variables

#### Local Development (.env.local)

```env
# Cloudinary Configuration (Optional - Falls back to local upload if not set)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

#### Production (Render.com)

1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add these variables:

```
CLOUDINARY_CLOUD_NAME = your_cloud_name_here
CLOUDINARY_API_KEY = your_api_key_here
CLOUDINARY_API_SECRET = your_api_secret_here
```

### 4. Test Upload

1. Go to `/admin/blog/new`
2. Upload a cover image
3. Check the console - you should see "Uploading to CDN..."
4. Image URL should start with `https://res.cloudinary.com/`

## Fallback Behavior

**If Cloudinary is not configured:**
- System automatically falls back to local `/uploads/blog/` directory
- Console warning: `"Using local upload fallback. Configure Cloudinary for better performance."`
- Works fine for development and low-traffic sites
- For production, Cloudinary is recommended

## Benefits for SEO & Performance

### With Cloudinary:
- ⚡ **Faster Load Times** - Global CDN
- 🖼️ **Optimized Images** - Automatic WebP/AVIF conversion
- 📱 **Responsive** - Serve different sizes for mobile/desktop
- 💰 **Cost Effective** - Free tier covers most blogs
- 🔒 **Secure** - HTTPS by default

### With Local Upload:
- ✅ Works for development
- ⚠️ Slower for global users
- ⚠️ Uses server disk space
- ⚠️ No automatic optimization

## Upload API Endpoints

### Cloudinary Upload (Recommended)
```
POST /api/upload/cloudinary
```
- Max file size: 10MB
- Formats: JPEG, PNG, GIF, WebP
- Auto-optimizes to 1200x630 for blog covers
- Returns: `{ success: true, url: "https://res.cloudinary.com/..." }`

### Local Upload (Fallback)
```
POST /api/upload
```
- Max file size: 5MB
- Formats: JPEG, PNG, GIF, WebP
- Saves to: `/public/uploads/blog/`
- Returns: `{ success: true, url: "/uploads/blog/..." }`

## Image Specifications

### Blog Cover Images (Recommended)
- **Dimensions**: 1200x630px (Open Graph standard)
- **Format**: JPEG or PNG
- **File Size**: Under 500KB (Cloudinary will optimize)
- **Aspect Ratio**: 1.91:1

### In-Content Images
- **Max Width**: 1200px
- **Format**: Any (WebP recommended)
- **File Size**: Under 2MB

## Monitoring Usage

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Check "Usage" tab
3. Monitor:
   - Storage used
   - Bandwidth used
   - Transformations used

**Free Tier Limits:**
- 25GB storage
- 25GB bandwidth per month
- 25,000 transformations per month

For a typical blog:
- ~100 images = ~50MB storage
- ~10,000 monthly views = ~5GB bandwidth
- Well within free tier limits! ✅

## Troubleshooting

### Issue: Upload fails with "Unauthorized"
**Solution**: Check that you're logged in as admin

### Issue: Images not loading from Cloudinary
**Solution**: Verify credentials in environment variables

### Issue: "Using local upload fallback" message
**Solution**: Add Cloudinary credentials to enable CDN

### Issue: Upload slow or timing out
**Solution**: 
- Check internet connection
- Reduce image file size before upload
- Try JPG instead of PNG

## Migration from Local to Cloudinary

If you already have images in `/uploads/blog/`:

1. Add Cloudinary credentials
2. New uploads will go to Cloudinary automatically
3. Old images will still work from local storage
4. Optionally migrate old images:
   ```bash
   # Use Cloudinary Upload API to re-upload existing images
   # Or use Cloudinary's Media Library bulk upload
   ```

## Security Notes

- ✅ API Secret is never exposed to client
- ✅ Upload endpoint requires admin authentication
- ✅ File type validation on server
- ✅ File size limits enforced
- ✅ Cloudinary folders separate uploads

## Next Steps

1. ✅ Create Cloudinary account
2. ✅ Add credentials to environment variables
3. ✅ Test upload in blog editor
4. ✅ Monitor usage dashboard

**Ready to use! Your blog images will now load faster globally.** 🚀
