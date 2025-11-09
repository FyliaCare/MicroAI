# Google Drive Integration Setup Guide

## Overview
MicroAI Systems now uses Google Drive for reliable, scalable file storage. All project files are automatically organized into folders:

```
📁 Google Drive
  └── 📁 MicroAI Projects/
      ├── 📁 Project Alpha/
      │   ├── 📄 design-mockup.pdf
      │   └── 📄 requirements.docx
      ├── 📁 Project Beta/
      │   └── 📄 logo.png
      └── 📁 Project Gamma/
          └── 📄 contract.pdf
```

## Why Google Drive?
- ✅ **Unlimited Storage** - No more disk space issues
- ✅ **Automatic Backup** - Files are safely stored in the cloud
- ✅ **Fast Access** - CDN-powered file delivery worldwide
- ✅ **Easy Sharing** - Direct shareable links for clients
- ✅ **Version Control** - Built-in file versioning
- ✅ **Free** - No additional hosting costs

---

## Setup Instructions

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it: `MicroAI Systems`
4. Click **"Create"**
5. Wait for the project to be created (~30 seconds)

### Step 2: Enable Google Drive API

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Drive API"**
3. Click on it and click **"Enable"**
4. Wait for it to enable (~10 seconds)

### Step 3: Create a Service Account

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"Service Account"**
3. Fill in:
   - **Service account name**: `microai-file-manager`
   - **Service account ID**: (auto-generated)
   - **Description**: `Service account for managing project files in Google Drive`
4. Click **"Create and Continue"**
5. **Select a role**: Choose **"Basic"** → **"Editor"**
6. Click **"Continue"** → **"Done"**

### Step 4: Generate Service Account Key (JSON)

1. In the **"Credentials"** page, find your service account under **"Service Accounts"**
2. Click on the service account email (e.g., `microai-file-manager@...`)
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Choose **"JSON"** format
6. Click **"Create"**
7. **IMPORTANT**: A JSON file will be downloaded - **save it securely!**

### Step 5: Add Credentials to Environment Variables

#### For Local Development (.env.local)

1. Open the downloaded JSON file
2. Copy **THE ENTIRE JSON CONTENT** (it should look like this):

```json
{
  "type": "service_account",
  "project_id": "microai-systems-xxxxx",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n",
  "client_email": "microai-file-manager@microai-systems-xxxxx.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

3. **Minify the JSON** (remove all line breaks and unnecessary spaces):
   - You can use an online tool: [JSON Minifier](https://codebeautify.org/jsonminifier)
   - Or manually remove all line breaks

4. Add to your `.env.local` file:

```env
GOOGLE_DRIVE_CREDENTIALS='{"type":"service_account","project_id":"microai-systems-xxxxx","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBA...\\n-----END PRIVATE KEY-----\\n","client_email":"microai-file-manager@microai-systems-xxxxx.iam.gserviceaccount.com","client_id":"123456789...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/..."}'
```

**IMPORTANT NOTES:**
- Must be on a single line
- Must be wrapped in single quotes `'...'`
- All `\n` in the private key must be escaped as `\\n`
- No line breaks inside the JSON

#### For Production (Render/Vercel/etc.)

1. Go to your hosting platform's environment variables settings
2. Create a new environment variable:
   - **Key**: `GOOGLE_DRIVE_CREDENTIALS`
   - **Value**: The minified JSON from above (as a single-line string)
3. Save and redeploy

### Step 6: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Log in to the admin panel
3. Go to any project
4. Try uploading a file
5. Check your Google Drive - you should see:
   - A folder called **"MicroAI Projects"**
   - Inside it, a folder with your project name
   - Your uploaded file inside that folder

---

## Troubleshooting

### Error: "GOOGLE_DRIVE_CREDENTIALS environment variable is not set"

**Solution**: Make sure you added the credentials to your `.env.local` file and restarted the server.

### Error: "Invalid Google Drive credentials"

**Solution**: 
- Make sure the JSON is properly formatted (no line breaks except `\\n`)
- Make sure it's wrapped in single quotes `'...'`
- Make sure all special characters are escaped

### Error: "Failed to upload file to Google Drive"

**Solution**:
- Check that the Google Drive API is enabled in your Google Cloud project
- Make sure the service account has the correct permissions (Editor role)
- Check the console for more detailed error messages

### Files are uploading but not visible in the UI

**Solution**:
- Clear your browser cache
- Check the browser console for errors
- Make sure the `driveFileId` is being saved in the database

### Error: "Quota exceeded"

**Solution**:
- Google Drive API has a free quota limit
- For production with heavy usage, you may need to enable billing
- Free tier: 20,000 requests per day (more than enough for most projects)

---

## Security Notes

1. **Never commit the credentials JSON file** to Git
   - It's already in `.gitignore` as `*-credentials.json`
   
2. **Keep your service account key secure**
   - Treat it like a password
   - Don't share it publicly
   - Rotate it periodically

3. **The service account only has access to:**
   - Files it creates (not your personal Google Drive)
   - The "MicroAI Projects" folder and its contents

---

## Migration from Local Storage

If you have existing files in `public/uploads/`, you'll need to:

1. **Manually upload old files** to Google Drive
2. **Update database records** with new Google Drive URLs
3. Or create a migration script (contact support)

---

## Next Steps

Once Google Drive is set up:
- ✅ All new file uploads will go to Google Drive
- ✅ Files are automatically organized by project
- ✅ Shareable links are generated automatically
- ✅ No more disk space issues
- ✅ Automatic backups

---

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Check the server logs for detailed error messages
3. Verify your service account credentials are correct
4. Ensure the Google Drive API is enabled

For additional help, contact: support@microaisystems.com
