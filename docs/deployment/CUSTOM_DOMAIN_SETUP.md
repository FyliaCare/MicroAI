# Custom Domain Setup Guide

## Overview
Connect your GoDaddy domain to your Render Pro deployment.

## Prerequisites
- ✅ Render Pro account ($19/month)
- ✅ Custom domain purchased from GoDaddy
- ✅ Access to GoDaddy DNS management
- ✅ MicroAI app deployed on Render

## Step 1: Add Custom Domain on Render

1. **Navigate to Render Dashboard:**
   - Go to https://dashboard.render.com
   - Select your MicroAI web service

2. **Add Custom Domain:**
   - Click **"Settings"** tab
   - Scroll to **"Custom Domains"** section
   - Click **"Add Custom Domain"**
   - Enter your domain: `yourdomain.com`
   - Add www subdomain: `www.yourdomain.com`

3. **Note DNS Records:**
   Render will provide DNS configuration:
   ```
   For root domain (@):
   Type: A
   Value: [IP address provided by Render]
   
   For www subdomain:
   Type: CNAME
   Value: your-app-name.onrender.com
   ```

## Step 2: Configure DNS on GoDaddy

1. **Access GoDaddy DNS Management:**
   - Log into https://dnsmanagement.godaddy.com
   - Select your domain
   - Click **"DNS"** or **"Manage DNS"**

2. **Add A Record (Root Domain):**
   ```
   Type: A
   Name: @
   Value: [IP from Render]
   TTL: 600 seconds
   ```

3. **Add CNAME Record (WWW Subdomain):**
   ```
   Type: CNAME
   Name: www
   Value: your-app-name.onrender.com
   TTL: 600 seconds
   ```

4. **Remove Conflicting Records:**
   - Delete any existing A records for `@`
   - Delete any existing CNAME records for `www`
   - GoDaddy often has default parking records

## Step 3: Update Environment Variables

Update `NEXTAUTH_URL` on Render:

1. Go to your web service settings
2. Navigate to **"Environment"** tab
3. Update:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```
4. Click **"Save Changes"**
5. Render will automatically redeploy

## Step 4: Verify DNS Propagation

Check DNS propagation status:
- https://dnschecker.org
- Enter your domain and check A/CNAME records globally

**Propagation Time:**
- Minimum: 5-10 minutes
- Maximum: 24-48 hours
- Average: 1-2 hours

## Step 5: SSL Certificate

Render automatically provisions SSL certificates:

1. **After DNS propagates:**
   - Render detects the domain is pointing correctly
   - Automatically requests Let's Encrypt SSL certificate
   - Usually takes 5-10 minutes after DNS propagation

2. **Verify SSL:**
   - Visit https://yourdomain.com
   - Check for padlock icon in browser
   - Certificate should show "Issued by: Let's Encrypt"

3. **Force HTTPS:**
   - Render automatically redirects HTTP to HTTPS
   - No additional configuration needed

## Step 6: Test Your Site

1. **Check Root Domain:**
   ```
   https://yourdomain.com
   ```

2. **Check WWW Subdomain:**
   ```
   https://www.yourdomain.com
   ```

3. **Test Admin Login:**
   ```
   https://yourdomain.com/admin/login
   Email: microailabs@gmail.com
   Password: [your password]
   ```

4. **Verify All Features:**
   - Public pages load correctly
   - Admin dashboard accessible
   - Quote generation works
   - GitHub integration functional
   - Contact form sends emails

## Common Issues & Solutions

### Issue: DNS Not Propagating

**Solution:**
```bash
# Check DNS from command line
nslookup yourdomain.com
nslookup www.yourdomain.com

# Should show Render's IP address
```

### Issue: SSL Certificate Not Provisioning

**Causes:**
- DNS not fully propagated
- Conflicting DNS records
- Domain ownership verification failed

**Solution:**
1. Wait for full DNS propagation
2. Remove all conflicting records on GoDaddy
3. Check Render logs for SSL provisioning errors

### Issue: Site Shows "Not Found"

**Solution:**
1. Verify DNS records are correct
2. Check Render deployment is successful
3. Ensure `NEXTAUTH_URL` is updated
4. Clear browser cache

### Issue: Mixed Content Warnings

**Solution:**
Update `next.config.js` to force HTTPS:
```javascript
async redirects() {
  return [
    {
      source: '/:path*',
      has: [
        {
          type: 'header',
          key: 'x-forwarded-proto',
          value: 'http',
        },
      ],
      destination: 'https://yourdomain.com/:path*',
      permanent: true,
    },
  ]
}
```

## GoDaddy-Specific Tips

### Forwarding (Optional)

If you want `yourdomain.com` to forward to `www.yourdomain.com`:

1. In GoDaddy DNS settings
2. Click **"Forwarding"**
3. Set up domain forwarding:
   ```
   From: yourdomain.com
   To: https://www.yourdomain.com
   Type: Permanent (301)
   ```

### Email Configuration

If you use email with your domain:
- Don't delete MX records
- Keep existing email DNS records
- Only modify A and CNAME records

### Domain Privacy

Ensure **Domain Privacy** is enabled:
1. Go to GoDaddy domain settings
2. Enable **"Domain Privacy"**
3. Protects your personal information

## Environment Variables Checklist

Update these on Render:

```env
# Production URL
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database (keep existing)
DATABASE_URL=your-neon-database-url

# Auth (keep existing)
NEXTAUTH_SECRET=your-secret

# Email (keep existing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=microailabs@gmail.com
SMTP_PASS=your-app-password

# GitHub (if using)
GITHUB_TOKEN=your-github-token
WEBHOOK_SECRET=your-webhook-secret
```

## DNS Record Example

Final GoDaddy DNS configuration should look like:

```
Type    Name    Value                           TTL
A       @       216.24.57.1 (example IP)       600
CNAME   www     microai-xyz.onrender.com       600
MX      @       smtp.google.com (if using)     3600
TXT     @       "v=spf1..." (if using email)   3600
```

## Verification Commands

### Check DNS:
```bash
nslookup yourdomain.com
dig yourdomain.com
```

### Check HTTPS:
```bash
curl -I https://yourdomain.com
```

### Check Certificate:
```bash
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

## Timeline

**Immediate (0-5 minutes):**
- Add domain on Render
- Configure DNS on GoDaddy
- Update environment variables

**Short-term (5-60 minutes):**
- DNS propagation begins
- Some locations resolve domain

**Medium-term (1-24 hours):**
- DNS fully propagated globally
- SSL certificate provisioned
- Site fully operational

## Support Resources

- **Render Docs:** https://render.com/docs/custom-domains
- **GoDaddy Support:** https://www.godaddy.com/help
- **DNS Checker:** https://dnschecker.org
- **SSL Test:** https://www.ssllabs.com/ssltest/

## Post-Setup

1. **Monitor Render Logs:**
   - Check for any SSL errors
   - Verify successful requests

2. **Update Marketing Materials:**
   - Update social media links
   - Update business cards
   - Update email signatures

3. **Set Up Analytics:**
   - Google Analytics
   - Render metrics
   - Custom monitoring

4. **Backup Configuration:**
   - Save DNS records
   - Document environment variables
   - Keep Render settings documented

## Success Checklist

- [ ] Custom domain added on Render
- [ ] DNS A record configured on GoDaddy
- [ ] DNS CNAME record configured on GoDaddy
- [ ] NEXTAUTH_URL updated to new domain
- [ ] DNS propagation verified
- [ ] SSL certificate active (HTTPS working)
- [ ] Root domain accessible (https://yourdomain.com)
- [ ] WWW subdomain accessible (https://www.yourdomain.com)
- [ ] Admin login works
- [ ] All features tested
- [ ] No mixed content warnings
- [ ] Email functionality working

---

**Your site is now live on your custom domain! 🚀**
