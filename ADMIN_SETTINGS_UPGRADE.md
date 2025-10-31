# Admin Settings Upgrade - Complete Feature Documentation

## Overview
Comprehensive upgrade to the admin settings page (`/admin/settings`) with 9 tabs covering all major system configuration and monitoring needs.

## New Features Added

### 1. **Email Settings Tab** 📧
Configure email delivery for the entire platform.

**Features:**
- Provider selection (Resend or SMTP)
- General email configuration:
  - Admin Email (receives notifications)
  - From Email (sender address)
  - Reply-To Email
- **Resend Configuration:**
  - API key input
  - Environment variable status display
  - Integration note for Google Workspace
- **SMTP Configuration:**
  - Host, Port, Username, Password
  - Support for Gmail App Passwords

**Technical Implementation:**
- Settings stored in localStorage (can be enhanced with API)
- Environment variables take precedence
- Validates Resend/SMTP connectivity

---

### 2. **Notification Settings Tab** 🔔
Control which events trigger notifications and their behavior.

**Features:**
- **General Settings:**
  - Email notifications toggle (master switch)

- **Project Events:**
  - New Project Request
  - Project Approved
  - Project Rejected

- **Quote Events:**
  - New Quote Request
  - Quote Accepted
  - Quote Denied

- **Priority Delays:**
  - High Priority: 0 min (immediate)
  - Medium Priority: 2 min
  - Low Priority: 5 min

**Technical Implementation:**
- Settings stored in localStorage
- Each notification type independently toggleable
- Priority delays control when notifications are sent

---

### 3. **System Health Tab** 🏥
Real-time monitoring dashboard for critical system components.

**Features:**
- **Four Health Checks:**
  1. **Database** - PostgreSQL connection and query performance
  2. **Email Service** - Resend API connectivity
  3. **Storage** - File uploads directory accessibility
  4. **Cache** - In-memory cache status (always healthy)

- **Status Indicators:**
  - ✓ Healthy (green)
  - ✗ Error (red)
  - ⟳ Checking (yellow)

- **Last Check Timestamp**
- **Manual Refresh Button**

**Technical Implementation:**
- API Endpoint: `/api/admin/system-health`
- Performs actual connectivity tests
- Returns status for each component
- Automatic checks on page load
- Manual refresh available

---

### 4. **Email Queue Monitor Tab** 📨
Track and manage queued emails with statistics and manual processing.

**Features:**
- **Real-time Statistics:**
  - Pending (yellow)
  - Processing (blue)
  - Sent (green)
  - Failed (red)
  - Total (purple)

- **Queue Information:**
  - Last processed timestamp
  - Success rate calculation
  - Cron job status (Active - Every 10 minutes)

- **Manual Processing:**
  - "Process Now" button
  - Immediate queue processing trigger
  - Shows results (sent/failed/processed)

- **How It Works Section:**
  - Explains queuing behavior
  - Retry logic (exponential backoff)
  - 3-attempt maximum
  - Cron job schedule

**Technical Implementation:**
- API Endpoint: `/api/admin/email-queue/stats`
- Manual trigger: `/api/cron/process-email-queue`
- Requires CRON_SECRET for manual trigger
- Real-time statistics from EmailQueue table
- Auto-refresh on manual processing

---

### 5. **User Management Tab** 👥
Manage all platform users (admins and clients).

**Features:**
- **User List Table:**
  - Name
  - Email
  - Role (admin/client)
  - Status (active/suspended)
  - Created date
  - Actions (Suspend/Activate)

- **Role Badges:**
  - Admin (purple)
  - Client (blue)

- **Status Badges:**
  - Active (green)
  - Suspended (red)

- **User Actions:**
  - Suspend active users
  - Activate suspended users
  - One-click toggle

**Technical Implementation:**
- API Endpoint: `/api/admin/users` (GET all users)
- API Endpoint: `/api/admin/users/[id]/status` (PATCH update status)
- Fetches from User table
- Admin authentication required
- Auto-refresh after status change

---

## Existing Tabs (Preserved)

### 6. **Quote Templates Tab** 📋
Manage quote templates for the quote system.

### 7. **Company Profile Tab** 🏢
Configure company information and logo.

### 8. **Terms of Service Tab** 📄
Edit terms that appear on all quotes.

### 9. **Development Phases Tab** 🔄
Configure project development phases and deliverables.

---

## New API Endpoints Created

### `/api/admin/system-health` (GET)
**Purpose:** Check health of all system components

**Authentication:** Admin only (NextAuth session)

**Response:**
```json
{
  "database": "healthy" | "error" | "checking",
  "email": "healthy" | "error" | "checking",
  "storage": "healthy" | "error" | "checking",
  "cache": "healthy" | "error" | "checking"
}
```

**Checks Performed:**
- Database: `SELECT 1` query
- Email: Resend API key validation
- Storage: `/public/uploads` directory exists
- Cache: Always returns healthy

---

### `/api/admin/email-queue/stats` (GET)
**Purpose:** Get email queue statistics

**Authentication:** Admin only (NextAuth session)

**Response:**
```json
{
  "pending": 5,
  "processing": 1,
  "sent": 142,
  "failed": 3,
  "total": 151,
  "lastProcessed": "2025-01-29T10:30:00Z"
}
```

**Queries:**
- Counts by status from EmailQueue table
- Last sent email timestamp

---

### `/api/admin/users` (GET)
**Purpose:** List all platform users

**Authentication:** Admin only (NextAuth session)

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin" | "client",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Features:**
- Returns admins and clients
- Ordered by creation date (newest first)

---

### `/api/admin/users/[id]/status` (PATCH)
**Purpose:** Update user status (activate/suspend)

**Authentication:** Admin only (NextAuth session)

**Request Body:**
```json
{
  "status": "active" | "suspended"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User activated successfully"
}
```

**Note:** Requires `status` field in User model schema

---

## UI Component Enhancements

### Input Component (`src/components/ui/Input.tsx`)
**New Feature:** `helpText` prop

**Usage:**
```tsx
<Input
  label="Admin Email"
  type="email"
  value={email}
  onChange={handleChange}
  helpText="Receives system notifications and project requests"
/>
```

**Display:**
- Appears below input field
- Small gray text (text-xs text-gray-500)
- Provides contextual help to users

---

## Technical Architecture

### State Management
- **localStorage** for settings that don't need server persistence
- **API calls** for real-time data (health, queue stats, users)
- **React state** for UI interactions

### Tab Structure
```tsx
type TabType = 
  | 'templates'      // Quote Templates
  | 'company'        // Company Profile
  | 'terms'          // Terms of Service
  | 'phases'         // Development Phases
  | 'email'          // Email Settings
  | 'notifications'  // Notification Settings
  | 'system'         // System Health
  | 'queue'          // Email Queue Monitor
  | 'users'          // User Management
```

### Authentication
- All admin settings require NextAuth session
- Role check: `session.user.role === 'admin'`
- Unauthorized requests return 401

---

## Environment Variables

### Required for Full Functionality
```env
# Email (Resend)
RESEND_API_KEY=re_••••••••••••••••••••
RESEND_FROM_EMAIL=sales@microaisystems.com

# Admin Contact
ADMIN_EMAIL=sales@microaisystems.com

# Cron Job (for manual email queue trigger)
CRON_SECRET=your-secret-key-here

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://microaisystems.com

# Database
DATABASE_URL=postgresql://...
```

---

## Usage Guide

### Accessing Settings
1. Log in as admin
2. Navigate to `/admin/settings`
3. Click any tab to configure

### Email Settings
1. Select provider (Resend or SMTP)
2. Fill in email addresses
3. Add API key or SMTP credentials
4. Click "Save Email Settings"

### System Health Check
1. Click "System Health" tab
2. View component status
3. Click "🔄 Refresh Status" for latest check
4. Green = healthy, Red = error

### Email Queue Management
1. Click "Email Queue" tab
2. View statistics
3. Click "⚡ Process Now" to manually process
4. Confirm action
5. View processing results

### User Management
1. Click "Users" tab
2. View all users in table
3. Click "Suspend" to suspend active user
4. Click "Activate" to activate suspended user

---

## Performance Considerations

### Optimizations
- System health checks are cached (manual refresh available)
- Email queue stats only load when tab is active
- Users list only fetches when tab is active
- All API calls are authenticated and rate-limited

### Scalability
- Settings stored in localStorage reduce database load
- Real-time data fetched on-demand
- Manual refresh prevents unnecessary API calls
- Efficient database queries with proper indexes

---

## Future Enhancements

### Potential Additions
1. **Email Settings:**
   - Test email button (send test email)
   - Email template editor
   - Batch email sender

2. **Notification Settings:**
   - Per-admin notification preferences
   - Slack/Discord integration
   - SMS notifications

3. **System Health:**
   - Detailed error logs viewer
   - Performance metrics graphs
   - Uptime tracking

4. **Email Queue:**
   - Failed email retry button
   - Email preview before sending
   - Filter by status/date

5. **User Management:**
   - Bulk actions (suspend multiple)
   - User activity logs
   - Password reset functionality
   - Role assignment

---

## Security Notes

### Authentication
- All settings require admin authentication
- Session validation on every API call
- Role-based access control (RBAC)

### Data Protection
- Passwords are type="password" (masked input)
- API keys hidden in password fields
- Sensitive data not logged
- HTTPS enforced in production

### Authorization
- Only admins can access settings
- Client users redirected to their portal
- Unauthorized API calls return 401

---

## Testing Checklist

### Manual Testing
- [ ] Email Settings tab loads correctly
- [ ] Can save email settings to localStorage
- [ ] Notification Settings toggles work
- [ ] System Health shows accurate status
- [ ] Email Queue stats display correctly
- [ ] Manual queue processing works
- [ ] Users list loads all users
- [ ] User suspend/activate works
- [ ] All existing tabs still functional
- [ ] No console errors

### API Testing
```bash
# System Health
curl https://microaisystems.com/api/admin/system-health

# Email Queue Stats
curl https://microaisystems.com/api/admin/email-queue/stats

# Users List
curl https://microaisystems.com/api/admin/users

# Update User Status
curl -X PATCH https://microaisystems.com/api/admin/users/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status":"suspended"}'
```

---

## Deployment Notes

### Files Changed
- `src/components/admin/SettingsManager.tsx` (upgraded)
- `src/components/ui/Input.tsx` (added helpText prop)
- `src/app/api/admin/system-health/route.ts` (new)
- `src/app/api/admin/email-queue/stats/route.ts` (new)
- `src/app/api/admin/users/route.ts` (new)
- `src/app/api/admin/users/[id]/status/route.ts` (new)

### Git Commit
```
commit 4d1f9de
feat: Comprehensive admin settings upgrade with 9 tabs

Added new settings management features:
- Email Settings: Configure Resend/SMTP
- Notification Settings: Control all notification types
- System Health: Real-time monitoring
- Email Queue Monitor: View stats, manual trigger
- User Management: View users, manage status
```

### Deployment Status
✅ Committed to main branch
✅ Pushed to GitHub
⏳ Render auto-deploy in progress
⏳ Testing required after deployment

---

## Support & Troubleshooting

### Common Issues

**Email Settings not saving:**
- Check browser localStorage is enabled
- Clear cache and try again

**System Health shows errors:**
- Verify environment variables are set
- Check Render logs for specific errors
- Test database connection separately

**Email Queue not processing:**
- Verify CRON_SECRET is set in Render
- Check cron job is running on Render dashboard
- Review email queue processor logs

**Users tab empty:**
- Verify database has User records
- Check admin authentication
- Review API endpoint logs

---

## Documentation Links
- Main README: `/README.md`
- Email System: `/EMAIL_SYSTEM_FIX.md`
- Quote System: `/docs/features/QUOTE_SYSTEM_GUIDE.md`
- Deployment: `/DEPLOYMENT.md`

---

**Version:** 1.0.0  
**Date:** January 29, 2025  
**Author:** MicroAI Systems Development Team
