# 🔍 File Upload Debug Guide

## Current Status
✅ **Comprehensive step-by-step logging implemented**
- 10-step upload process with detailed logs
- Frontend & backend logging synchronized
- Error type detection and reporting
- Cloudinary integration verified

## Testing Instructions

### 1. **Test on Localhost (IMPORTANT)**
The dev server is running on `localhost:3000`. You **must** test there to see the debug logs.

```
🌐 URL: http://localhost:3000/client/login
📧 Email: ojmontymonty@gmail.com
🔑 Password: [your password]
```

### 2. **Navigate to Project**
After login:
1. Go to "Projects" (client dashboard)
2. Click on any project (e.g., "Test Project" - ID: `32294230-758a-4b26-8620-e5cb0e598d2e`)

### 3. **Attempt File Upload**
1. Scroll to "Project Files" section
2. Click "Select Files" or drag & drop
3. Choose a file (under 50MB)
4. Click "Upload 1 File" button

### 4. **Check Terminal Immediately**
Look for logs in the terminal where `npm run dev` is running. You should see:

#### **Frontend Logs (Browser Console):**
```
🚀 [Frontend] Starting upload process...
   Endpoint: /api/client/projects/[id]/uploads
   Files to upload: 1
   Is Admin: false

📤 [Frontend] Uploading file 1/1: example.jpg
   Form data created
   File size: 123456 bytes
   File type: image/jpeg
   Authorization header added
   Sending POST request...
```

#### **Backend Logs (Terminal):**
```
🚀 ========== CLIENT UPLOAD REQUEST START ==========
📍 Project ID: 32294230-758a-4b26-8620-e5cb0e598d2e
🕐 Timestamp: 2025-11-10T...

🔐 Step 1: Checking authorization header...
   Auth header present: true
   Auth header value: Bearer eyJhbGciOiJIUzI1NiIs...
✅ Token extracted, length: 243

🔑 Step 2: Verifying JWT token...
✅ JWT verified successfully
   Decoded payload: { userId: '...', clientId: '...', email: '...' }
👤 Fetching client details...
   Client name: Jay Monty
✅ Step 2 complete: User authenticated

📁 Step 3: Verifying project ownership...
✅ Step 3 complete: Project verified
   Project name: Test Project

📦 Step 4: Parsing form data...
   File object: Present
   File name: example.jpg
   File size: 123456 bytes
   File type: image/jpeg
✅ Step 4 complete: File received

⚖️ Step 5: Validating file size...
   Max allowed: 52428800 bytes
   File size: 123456 bytes
✅ Step 5 complete: File size valid

🔄 Step 6: Converting file to base64...
   Array buffer size: 123456
   Buffer created, length: 123456
   Base64 string length: 164608
✅ Step 6 complete: File converted to data URI

☁️ Step 7: Uploading to Cloudinary...
   Cloudinary config: { cloud_name: 'dnd8cqgo1', has_api_key: true, has_api_secret: true }
   Upload folder: microai-projects/Test Project/client-uploads
   Public ID: 1699999999999-example_jpg
✅ Step 7 complete: File uploaded to Cloudinary
   Cloudinary ID: microai-projects/Test Project/client-uploads/1699999999999-example_jpg
   Secure URL: https://res.cloudinary.com/dnd8cqgo1/image/upload/v1699999999/...
   File format: jpg
   Resource type: image

💾 Step 8: Creating database record...
   Database record data: { ... }
✅ Step 8 complete: Database record created
   Upload ID: [UUID]
   Created at: 2025-11-10T...

📢 Step 9: Creating notifications and activity logs...
   ✓ Notification created
   ✓ Activity log created
✅ Step 9 complete: Notifications and logs created

📤 Step 10: Preparing success response...
✅ CLIENT UPLOAD SUCCESSFUL!
🎉 ========== REQUEST COMPLETE ==========
```

### 5. **If No Logs Appear**

#### Scenario A: No Frontend Logs
**Problem:** JavaScript not executing
**Check:**
- Browser console (F12) for errors
- Is button clickable?
- Any JavaScript errors blocking execution?

#### Scenario B: Frontend Logs but No Backend Logs
**Problem:** Request not reaching server
**Possible Causes:**
1. Testing on production site instead of localhost
2. Network/CORS issue
3. Request being blocked

**Solutions:**
- Verify URL is `localhost:3000` not `microaisystems.com`
- Check Network tab (F12) for request status
- Look for CORS or CSP errors

#### Scenario C: Backend Logs Stop at Specific Step
**Problem:** Error at that step
**Look For:**
- Step 1-2 fail: Authentication issue
- Step 3 fail: Project ownership/not found
- Step 4 fail: Form data parsing
- Step 5 fail: File size > 50MB
- Step 6 fail: Buffer conversion
- Step 7 fail: **CLOUDINARY ISSUE** (most common)
- Step 8 fail: Database/Prisma error
- Step 9 fail: Notification creation error

### 6. **Common Issues & Solutions**

#### Issue: "Cloudinary ERROR"
```bash
🔴 CLOUDINARY ERROR - Check API credentials
```
**Solution:**
1. Verify `.env.local` has correct credentials:
   ```
   CLOUDINARY_CLOUD_NAME=dnd8cqgo1
   CLOUDINARY_API_KEY=[your-key]
   CLOUDINARY_API_SECRET=[your-secret]
   ```
2. Restart dev server after changing .env

#### Issue: "DATABASE ERROR"
```bash
🔴 DATABASE ERROR - Check Prisma connection
```
**Solution:**
1. Check database connection in `.env.local`
2. Run `npx prisma studio` to verify database is accessible
3. Check if `ClientUpload` table exists

#### Issue: "AUTH ERROR"
```bash
🔴 AUTH ERROR - Check JWT secret and token
```
**Solution:**
1. Log out and log back in
2. Verify `JWT_SECRET` in `.env.local`
3. Check localStorage has valid `clientSession`

#### Issue: "File too large"
```bash
❌ File size exceeds 50MB limit
```
**Solution:** Use a smaller file (under 50MB)

#### Issue: "No authentication token found"
**Solution:**
1. Clear browser cache and localStorage
2. Log in again
3. Session may have expired

### 7. **Verify Current Setup**

Run these checks before testing:

```powershell
# 1. Check if server is running
# Should show: "▲ Next.js 14.2.15 - Local: http://localhost:3000"

# 2. Check environment variables
node -e "require('dotenv').config({ path: '.env.local' }); console.log('Cloudinary:', !!process.env.CLOUDINARY_API_KEY)"

# 3. Check database connection
npx prisma db push
```

### 8. **What to Share**

If upload still fails, please provide:

1. **Terminal output** (from `npm run dev` terminal)
   - Copy everything from "🚀 ========== CLIENT UPLOAD REQUEST START =========="
   - to "🎉 ========== REQUEST COMPLETE =========="
   - OR the error section if it fails

2. **Browser console** (F12 → Console tab)
   - Copy logs starting with "[Frontend]"
   - Copy any red error messages

3. **Network tab** (F12 → Network tab)
   - Find the POST request to `.../uploads`
   - Share: Status code, Response tab content, Headers tab

4. **Screenshot** of the upload interface showing the error

## Expected Behavior

### ✅ Successful Upload
1. Progress bar fills from 0% → 100%
2. File appears in "Project Files" list immediately
3. Terminal shows all 10 steps completing
4. No error messages
5. File downloadable and previewable

### ❌ Failed Upload
1. Red error banner appears with specific message
2. Terminal shows which step failed
3. Error type identified (Cloudinary/Database/Auth)
4. File does NOT appear in list

## Next Steps After Testing

1. Test upload on localhost
2. Copy terminal logs to share
3. If successful: Test admin upload
4. If successful: Deploy to production and test there
5. Verify files persist after page refresh

---

## Debug Logging Features

The new implementation includes:
- ✅ 10 distinct steps with emoji indicators
- ✅ Detailed data logging at each step
- ✅ Error type detection (Cloudinary/Database/Auth)
- ✅ Timestamp tracking
- ✅ Full error stack traces
- ✅ Frontend-backend logging correlation
- ✅ File metadata verification
- ✅ Cloudinary config validation

All logs are prefixed with emojis for easy visual scanning:
- 🚀 Start of process
- 🔐 Authentication
- 📁 Project verification
- 📦 File parsing
- ⚖️ Validation
- 🔄 Conversion
- ☁️ Cloudinary upload
- 💾 Database operations
- 📢 Notifications
- 📤 Response
- ✅ Success
- ❌ Error
- 🔴 Critical error with type

---

**Last Updated:** November 10, 2025
**Commit:** d958e85
**Status:** Ready for testing on localhost:3000
