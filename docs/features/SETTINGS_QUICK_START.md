# Advanced Settings Page - Quick Start Guide

## 🚀 Getting Started

The Advanced Settings page is now fully functional and ready to use. Access it at:
**`/admin/settings`** (Admin login required)

## ✨ What's Working

### Core Features
✅ **10 Setting Categories** - System, Database, Email, Notifications, Security, API, Theme, Backup, Monitoring, Audit  
✅ **30+ Pre-configured Settings** - All seeded and ready to use  
✅ **Real-time Updates** - Changes tracked immediately  
✅ **System Health Monitoring** - Live status of database, email, storage, and cache  
✅ **Search & Filter** - Find any setting quickly  

### Advanced Operations
✅ **Export Settings** - Download complete backup as JSON  
✅ **Import Settings** - Restore from backup file  
✅ **Reset to Defaults** - Reset category or individual settings  
✅ **Audit Log** - View complete change history with modal viewer  
✅ **Encrypted Values** - Secure storage for API keys and secrets  

## 📋 How to Use

### Viewing Settings
1. Navigate to `/admin/settings`
2. Click a category in the sidebar (e.g., "System", "Email")
3. View all settings for that category

### Editing Settings
1. Click into any field to edit
2. Change the value (text input, number, or toggle)
3. An "Unsaved Changes" indicator appears
4. Click "Save All" button to persist changes

### Exporting Settings
1. Click the "Export" button in the header
2. A JSON file downloads automatically
3. Filename format: `settings-YYYY-MM-DD.json`
4. Backup record saved in database

### Importing Settings
1. Click "Import Settings" in Quick Actions sidebar
2. Select a JSON backup file
3. Confirm the import (shows count of settings)
4. Settings are restored and history logged

### Resetting Settings
1. Click "Reset to Defaults" in Quick Actions
2. Confirm the action
3. All settings in current category reset to defaults
4. History records the reset

### Viewing Audit Log
1. Click "View Audit Log" in Quick Actions
2. Modal opens with complete change history
3. Search for specific settings or users
4. Navigate through pages (50 per page)
5. See old/new values side-by-side

## 🔍 Setting Types

- **String**: Text input (e.g., email addresses, URLs)
- **Number**: Numeric input (e.g., limits, timeouts)
- **Boolean**: Toggle switch (e.g., enable/disable features)
- **Textarea**: Multi-line text (e.g., JSON config)
- **Select**: Dropdown options (metadata-driven)

## 🔒 Security Features

- **Admin Only**: All endpoints require admin role
- **Encrypted Values**: Sensitive settings (API keys) hidden by default
- **Audit Trail**: Every change logged with user, IP, timestamp
- **History Tracking**: Old/new values stored for rollback
- **Session Validation**: Authentication checked on every request

## 📊 System Health Indicators

Located in the top-right corner:

- **Green Dot**: Service healthy
- **Red Dot**: Service error
- **Animated Pulse**: Actively monitoring

Services monitored:
- Database connection
- Email service (Resend)
- Storage (uploads directory)
- Cache (in-memory)

## 🛠️ Seeding Default Settings

If you need to re-seed or add more settings:

```bash
npx tsx scripts/seed-advanced-settings.ts
```

This will:
- Create 30+ default settings across all categories
- Set up SystemConfig, ThemeConfig, etc.
- Skip existing settings (safe to re-run)

## 📦 API Endpoints

All endpoints are at `/api/admin/settings/*`:

- `GET /api/admin/settings?category=system` - Fetch settings
- `PUT /api/admin/settings` - Update settings
- `POST /api/admin/settings` - Create new setting
- `GET /api/admin/settings/export` - Export all settings
- `POST /api/admin/settings/import` - Import settings
- `POST /api/admin/settings/reset` - Reset to defaults
- `GET /api/admin/settings/history` - View change history
- `GET /api/admin/system-health` - Check system health

## 🎨 UI Components

### Main Manager
`src/components/admin/settings/AdvancedSettingsManager.tsx`
- Category navigation
- Settings grid
- Save/export controls
- System health display

### Audit Modal
`src/components/admin/settings/SettingsAuditModal.tsx`
- History viewer
- Search/filter
- Pagination
- Value comparison

## ✅ Testing

Run the test script to verify everything:

```bash
npx tsx scripts/test-advanced-settings.ts
```

This checks:
- Settings exist in database
- All categories present
- History tracking works
- Backup system ready
- Encrypted settings configured
- Config tables exist

## 🚨 Troubleshooting

### Settings Not Loading
- Check admin authentication
- Verify database connection
- Check browser console for errors

### Save Button Disabled
- Make a change to enable it
- "Unsaved Changes" indicator must be visible
- Check for validation errors

### Import Failing
- Ensure JSON format matches export structure
- Check for duplicate keys in import file
- Review error messages in alert

### Audit Log Empty
- Make some changes first to populate history
- Check that changes are being saved
- Verify SettingHistory table exists

## 📚 Documentation

Complete documentation available at:
`docs/features/ADVANCED_SETTINGS_SYSTEM.md`

Includes:
- Architecture details
- Database schemas
- API specifications
- Security implementation
- Best practices

## 🎯 Summary

The Advanced Settings page is **fully functional and production-ready**:

✅ All 30 settings seeded and working  
✅ All API endpoints operational  
✅ Audit logging implemented  
✅ Export/import functionality ready  
✅ System health monitoring active  
✅ No build errors or warnings  
✅ Secure and performant  

**You're ready to manage your platform settings!**
