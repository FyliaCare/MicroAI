// ============================================================================
// COMPREHENSIVE SETTINGS SEED SCRIPT
// Seeds all platform settings with default values
// ============================================================================

import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

const COMPREHENSIVE_SETTINGS = [
  // ============================================================================
  // SYSTEM SETTINGS
  // ============================================================================
  {
    key: 'SYSTEM_NAME',
    value: 'MicroAI Systems',
    category: 'system',
    type: 'text',
    label: 'System Name',
    description: 'Display name of the platform',
    isEncrypted: false,
  },
  {
    key: 'SYSTEM_URL',
    value: 'https://microaisystems.com',
    category: 'system',
    type: 'text',
    label: 'System URL',
    description: 'Base URL of the platform',
    isEncrypted: false,
  },
  {
    key: 'SYSTEM_TIMEZONE',
    value: 'UTC',
    category: 'system',
    type: 'text',
    label: 'Default Timezone',
    description: 'System default timezone',
    isEncrypted: false,
  },
  {
    key: 'SYSTEM_DATE_FORMAT',
    value: 'YYYY-MM-DD',
    category: 'system',
    type: 'text',
    label: 'Date Format',
    description: 'Default date display format',
    isEncrypted: false,
  },
  {
    key: 'SYSTEM_CURRENCY',
    value: 'USD',
    category: 'system',
    type: 'text',
    label: 'Default Currency',
    description: 'System default currency code',
    isEncrypted: false,
  },
  {
    key: 'SYSTEM_LANGUAGE',
    value: 'en',
    category: 'system',
    type: 'text',
    label: 'Default Language',
    description: 'System default language code',
    isEncrypted: false,
  },
  {
    key: 'SYSTEM_MAINTENANCE_MODE',
    value: 'false',
    category: 'system',
    type: 'boolean',
    label: 'Maintenance Mode',
    description: 'Enable system-wide maintenance mode',
    isEncrypted: false,
  },
  {
    key: 'SYSTEM_DEBUG_MODE',
    value: 'false',
    category: 'system',
    type: 'boolean',
    label: 'Debug Mode',
    description: 'Enable debug logging and error display',
    isEncrypted: false,
  },
  {
    key: 'SYSTEM_SESSION_TIMEOUT',
    value: '3600',
    category: 'system',
    type: 'number',
    label: 'Session Timeout (seconds)',
    description: 'User session timeout duration',
    isEncrypted: false,
  },
  {
    key: 'SYSTEM_MAX_UPLOAD_SIZE',
    value: '10485760',
    category: 'system',
    type: 'number',
    label: 'Max Upload Size (bytes)',
    description: 'Maximum file upload size (10MB default)',
    isEncrypted: false,
  },

  // ============================================================================
  // DATABASE SETTINGS
  // ============================================================================
  {
    key: 'DB_POOL_SIZE',
    value: '20',
    category: 'database',
    type: 'number',
    label: 'Connection Pool Size',
    description: 'Maximum database connection pool size',
    isEncrypted: false,
  },
  {
    key: 'DB_QUERY_TIMEOUT',
    value: '30000',
    category: 'database',
    type: 'number',
    label: 'Query Timeout (ms)',
    description: 'Database query timeout in milliseconds',
    isEncrypted: false,
  },
  {
    key: 'DB_SLOW_QUERY_THRESHOLD',
    value: '1000',
    category: 'database',
    type: 'number',
    label: 'Slow Query Threshold (ms)',
    description: 'Log queries slower than this threshold',
    isEncrypted: false,
  },
  {
    key: 'DB_AUTO_VACUUM',
    value: 'true',
    category: 'database',
    type: 'boolean',
    label: 'Auto Vacuum',
    description: 'Automatically vacuum database tables',
    isEncrypted: false,
  },
  {
    key: 'DB_BACKUP_ENABLED',
    value: 'true',
    category: 'database',
    type: 'boolean',
    label: 'Automatic Backups',
    description: 'Enable automatic database backups',
    isEncrypted: false,
  },
  {
    key: 'DB_BACKUP_SCHEDULE',
    value: '0 2 * * *',
    category: 'database',
    type: 'text',
    label: 'Backup Schedule (Cron)',
    description: 'Cron expression for backup schedule',
    isEncrypted: false,
  },
  {
    key: 'DB_BACKUP_RETENTION_DAYS',
    value: '30',
    category: 'database',
    type: 'number',
    label: 'Backup Retention (days)',
    description: 'Number of days to retain backups',
    isEncrypted: false,
  },

  // ============================================================================
  // EMAIL SETTINGS
  // ============================================================================
  {
    key: 'EMAIL_FROM_NAME',
    value: 'MicroAI Systems',
    category: 'email',
    type: 'text',
    label: 'From Name',
    description: 'Default sender name for emails',
    isEncrypted: false,
  },
  {
    key: 'EMAIL_FROM_ADDRESS',
    value: 'noreply@microaisystems.com',
    category: 'email',
    type: 'text',
    label: 'From Email',
    description: 'Default sender email address',
    isEncrypted: false,
  },
  {
    key: 'EMAIL_REPLY_TO',
    value: 'support@microaisystems.com',
    category: 'email',
    type: 'text',
    label: 'Reply-To Email',
    description: 'Default reply-to email address',
    isEncrypted: false,
  },
  {
    key: 'SMTP_HOST',
    value: 'smtp.gmail.com',
    category: 'email',
    type: 'text',
    label: 'SMTP Host',
    description: 'SMTP server hostname',
    isEncrypted: false,
  },
  {
    key: 'SMTP_PORT',
    value: '587',
    category: 'email',
    type: 'number',
    label: 'SMTP Port',
    description: 'SMTP server port',
    isEncrypted: false,
  },
  {
    key: 'SMTP_SECURE',
    value: 'true',
    category: 'email',
    type: 'boolean',
    label: 'SMTP Secure (TLS)',
    description: 'Use TLS encryption for SMTP',
    isEncrypted: false,
  },
  {
    key: 'SMTP_USERNAME',
    value: '',
    category: 'email',
    type: 'text',
    label: 'SMTP Username',
    description: 'SMTP authentication username',
    isEncrypted: true,
  },
  {
    key: 'SMTP_PASSWORD',
    value: '',
    category: 'email',
    type: 'password',
    label: 'SMTP Password',
    description: 'SMTP authentication password',
    isEncrypted: true,
  },
  {
    key: 'EMAIL_QUEUE_ENABLED',
    value: 'true',
    category: 'email',
    type: 'boolean',
    label: 'Email Queue',
    description: 'Enable email queue system',
    isEncrypted: false,
  },
  {
    key: 'EMAIL_RATE_LIMIT',
    value: '100',
    category: 'email',
    type: 'number',
    label: 'Rate Limit (per hour)',
    description: 'Maximum emails to send per hour',
    isEncrypted: false,
  },

  // ============================================================================
  // NOTIFICATION SETTINGS
  // ============================================================================
  {
    key: 'NOTIFICATIONS_ENABLED',
    value: 'true',
    category: 'notifications',
    type: 'boolean',
    label: 'Enable Notifications',
    description: 'Master toggle for all notifications',
    isEncrypted: false,
  },
  {
    key: 'NOTIFICATIONS_EMAIL',
    value: 'true',
    category: 'notifications',
    type: 'boolean',
    label: 'Email Notifications',
    description: 'Send notifications via email',
    isEncrypted: false,
  },
  {
    key: 'NOTIFICATIONS_PUSH',
    value: 'false',
    category: 'notifications',
    type: 'boolean',
    label: 'Push Notifications',
    description: 'Send browser push notifications',
    isEncrypted: false,
  },
  {
    key: 'NOTIFICATIONS_SMS',
    value: 'false',
    category: 'notifications',
    type: 'boolean',
    label: 'SMS Notifications',
    description: 'Send notifications via SMS',
    isEncrypted: false,
  },
  {
    key: 'NOTIFICATIONS_NEW_QUOTE',
    value: 'true',
    category: 'notifications',
    type: 'boolean',
    label: 'New Quote Notifications',
    description: 'Notify on new quote creation',
    isEncrypted: false,
  },
  {
    key: 'NOTIFICATIONS_QUOTE_ACCEPTED',
    value: 'true',
    category: 'notifications',
    type: 'boolean',
    label: 'Quote Accepted Notifications',
    description: 'Notify when quote is accepted',
    isEncrypted: false,
  },
  {
    key: 'NOTIFICATIONS_NEW_PROJECT',
    value: 'true',
    category: 'notifications',
    type: 'boolean',
    label: 'New Project Notifications',
    description: 'Notify on new project creation',
    isEncrypted: false,
  },
  {
    key: 'NOTIFICATIONS_PROJECT_COMPLETED',
    value: 'true',
    category: 'notifications',
    type: 'boolean',
    label: 'Project Completed Notifications',
    description: 'Notify when project is completed',
    isEncrypted: false,
  },

  // ============================================================================
  // SECURITY SETTINGS
  // ============================================================================
  {
    key: 'SECURITY_PASSWORD_MIN_LENGTH',
    value: '8',
    category: 'security',
    type: 'number',
    label: 'Minimum Password Length',
    description: 'Minimum characters required for passwords',
    isEncrypted: false,
  },
  {
    key: 'SECURITY_PASSWORD_REQUIRE_UPPERCASE',
    value: 'true',
    category: 'security',
    type: 'boolean',
    label: 'Require Uppercase Letters',
    description: 'Password must contain uppercase letters',
    isEncrypted: false,
  },
  {
    key: 'SECURITY_PASSWORD_REQUIRE_NUMBERS',
    value: 'true',
    category: 'security',
    type: 'boolean',
    label: 'Require Numbers',
    description: 'Password must contain numbers',
    isEncrypted: false,
  },
  {
    key: 'SECURITY_PASSWORD_REQUIRE_SPECIAL',
    value: 'false',
    category: 'security',
    type: 'boolean',
    label: 'Require Special Characters',
    description: 'Password must contain special characters',
    isEncrypted: false,
  },
  {
    key: 'SECURITY_MAX_LOGIN_ATTEMPTS',
    value: '5',
    category: 'security',
    type: 'number',
    label: 'Max Login Attempts',
    description: 'Maximum failed login attempts before lockout',
    isEncrypted: false,
  },
  {
    key: 'SECURITY_LOCKOUT_DURATION',
    value: '900',
    category: 'security',
    type: 'number',
    label: 'Lockout Duration (seconds)',
    description: 'Account lockout duration after max attempts',
    isEncrypted: false,
  },
  {
    key: 'SECURITY_TWO_FACTOR_ENABLED',
    value: 'false',
    category: 'security',
    type: 'boolean',
    label: 'Two-Factor Authentication',
    description: 'Enable 2FA for all admin users',
    isEncrypted: false,
  },
  {
    key: 'SECURITY_SESSION_ENCRYPTION',
    value: 'true',
    category: 'security',
    type: 'boolean',
    label: 'Session Encryption',
    description: 'Encrypt session data',
    isEncrypted: false,
  },
  {
    key: 'SECURITY_CORS_ORIGINS',
    value: '*',
    category: 'security',
    type: 'textarea',
    label: 'CORS Allowed Origins',
    description: 'Comma-separated list of allowed origins',
    isEncrypted: false,
  },
  {
    key: 'SECURITY_RATE_LIMIT_API',
    value: '100',
    category: 'security',
    type: 'number',
    label: 'API Rate Limit (per minute)',
    description: 'Maximum API requests per minute',
    isEncrypted: false,
  },

  // ============================================================================
  // API SETTINGS
  // ============================================================================
  {
    key: 'API_VERSION',
    value: 'v1',
    category: 'api',
    type: 'text',
    label: 'API Version',
    description: 'Current API version',
    isEncrypted: false,
  },
  {
    key: 'API_BASE_PATH',
    value: '/api',
    category: 'api',
    type: 'text',
    label: 'API Base Path',
    description: 'Base URL path for API endpoints',
    isEncrypted: false,
  },
  {
    key: 'API_TIMEOUT',
    value: '30000',
    category: 'api',
    type: 'number',
    label: 'API Timeout (ms)',
    description: 'API request timeout in milliseconds',
    isEncrypted: false,
  },
  {
    key: 'API_RATE_LIMIT',
    value: '1000',
    category: 'api',
    type: 'number',
    label: 'Rate Limit (per hour)',
    description: 'Maximum API requests per hour per user',
    isEncrypted: false,
  },
  {
    key: 'API_KEY_ROTATION_DAYS',
    value: '90',
    category: 'api',
    type: 'number',
    label: 'API Key Rotation (days)',
    description: 'Days before API keys must be rotated',
    isEncrypted: false,
  },
  {
    key: 'API_ENABLE_DOCS',
    value: 'true',
    category: 'api',
    type: 'boolean',
    label: 'Enable API Documentation',
    description: 'Expose API documentation endpoint',
    isEncrypted: false,
  },
  {
    key: 'API_ENABLE_WEBHOOKS',
    value: 'true',
    category: 'api',
    type: 'boolean',
    label: 'Enable Webhooks',
    description: 'Allow webhook integrations',
    isEncrypted: false,
  },

  // ============================================================================
  // THEME SETTINGS
  // ============================================================================
  {
    key: 'THEME_PRIMARY_COLOR',
    value: '#4F46E5',
    category: 'theme',
    type: 'text',
    label: 'Primary Color',
    description: 'Primary brand color (hex)',
    isEncrypted: false,
  },
  {
    key: 'THEME_SECONDARY_COLOR',
    value: '#7C3AED',
    category: 'theme',
    type: 'text',
    label: 'Secondary Color',
    description: 'Secondary brand color (hex)',
    isEncrypted: false,
  },
  {
    key: 'THEME_ACCENT_COLOR',
    value: '#EC4899',
    category: 'theme',
    type: 'text',
    label: 'Accent Color',
    description: 'Accent color for highlights (hex)',
    isEncrypted: false,
  },
  {
    key: 'THEME_DARK_MODE',
    value: 'false',
    category: 'theme',
    type: 'boolean',
    label: 'Dark Mode',
    description: 'Enable dark mode by default',
    isEncrypted: false,
  },
  {
    key: 'THEME_ALLOW_USER_THEMES',
    value: 'true',
    category: 'theme',
    type: 'boolean',
    label: 'User Custom Themes',
    description: 'Allow users to customize theme',
    isEncrypted: false,
  },
  {
    key: 'THEME_LOGO_URL',
    value: '/MICROAI SYSTEMS OFFICIAL LOGO.png',
    category: 'theme',
    type: 'text',
    label: 'Logo URL',
    description: 'URL to company logo',
    isEncrypted: false,
  },
  {
    key: 'THEME_FAVICON_URL',
    value: '/favicon.ico',
    category: 'theme',
    type: 'text',
    label: 'Favicon URL',
    description: 'URL to favicon',
    isEncrypted: false,
  },

  // ============================================================================
  // BACKUP & RESTORE SETTINGS
  // ============================================================================
  {
    key: 'BACKUP_ENABLED',
    value: 'true',
    category: 'backup',
    type: 'boolean',
    label: 'Enable Backups',
    description: 'Enable automatic system backups',
    isEncrypted: false,
  },
  {
    key: 'BACKUP_FREQUENCY',
    value: 'daily',
    category: 'backup',
    type: 'text',
    label: 'Backup Frequency',
    description: 'Backup frequency (hourly, daily, weekly)',
    isEncrypted: false,
  },
  {
    key: 'BACKUP_RETENTION_COUNT',
    value: '7',
    category: 'backup',
    type: 'number',
    label: 'Backup Retention Count',
    description: 'Number of backups to retain',
    isEncrypted: false,
  },
  {
    key: 'BACKUP_INCLUDE_UPLOADS',
    value: 'true',
    category: 'backup',
    type: 'boolean',
    label: 'Include Uploads in Backup',
    description: 'Include user uploads in backups',
    isEncrypted: false,
  },
  {
    key: 'BACKUP_STORAGE_PATH',
    value: '/backups',
    category: 'backup',
    type: 'text',
    label: 'Backup Storage Path',
    description: 'Local or cloud storage path for backups',
    isEncrypted: false,
  },
  {
    key: 'BACKUP_COMPRESSION',
    value: 'true',
    category: 'backup',
    type: 'boolean',
    label: 'Compress Backups',
    description: 'Compress backup files to save space',
    isEncrypted: false,
  },
  {
    key: 'BACKUP_ENCRYPTION',
    value: 'true',
    category: 'backup',
    type: 'boolean',
    label: 'Encrypt Backups',
    description: 'Encrypt backup files for security',
    isEncrypted: false,
  },

  // ============================================================================
  // MONITORING SETTINGS
  // ============================================================================
  {
    key: 'MONITORING_ENABLED',
    value: 'true',
    category: 'monitoring',
    type: 'boolean',
    label: 'Enable Monitoring',
    description: 'Enable system monitoring and metrics',
    isEncrypted: false,
  },
  {
    key: 'MONITORING_METRICS_INTERVAL',
    value: '60',
    category: 'monitoring',
    type: 'number',
    label: 'Metrics Collection Interval (seconds)',
    description: 'How often to collect system metrics',
    isEncrypted: false,
  },
  {
    key: 'MONITORING_ERROR_REPORTING',
    value: 'true',
    category: 'monitoring',
    type: 'boolean',
    label: 'Error Reporting',
    description: 'Enable automatic error reporting',
    isEncrypted: false,
  },
  {
    key: 'MONITORING_PERFORMANCE_TRACKING',
    value: 'true',
    category: 'monitoring',
    type: 'boolean',
    label: 'Performance Tracking',
    description: 'Track application performance metrics',
    isEncrypted: false,
  },
  {
    key: 'MONITORING_USER_ANALYTICS',
    value: 'true',
    category: 'monitoring',
    type: 'boolean',
    label: 'User Analytics',
    description: 'Track user behavior and analytics',
    isEncrypted: false,
  },
  {
    key: 'MONITORING_UPTIME_CHECKS',
    value: 'true',
    category: 'monitoring',
    type: 'boolean',
    label: 'Uptime Monitoring',
    description: 'Monitor system uptime and availability',
    isEncrypted: false,
  },
  {
    key: 'MONITORING_ALERT_EMAIL',
    value: 'alerts@microaisystems.com',
    category: 'monitoring',
    type: 'text',
    label: 'Alert Email',
    description: 'Email address for system alerts',
    isEncrypted: false,
  },

  // ============================================================================
  // AUDIT TRAIL SETTINGS
  // ============================================================================
  {
    key: 'AUDIT_ENABLED',
    value: 'true',
    category: 'audit',
    type: 'boolean',
    label: 'Enable Audit Trail',
    description: 'Log all system changes and actions',
    isEncrypted: false,
  },
  {
    key: 'AUDIT_LOG_RETENTION_DAYS',
    value: '365',
    category: 'audit',
    type: 'number',
    label: 'Log Retention (days)',
    description: 'Number of days to retain audit logs',
    isEncrypted: false,
  },
  {
    key: 'AUDIT_LOG_USER_ACTIONS',
    value: 'true',
    category: 'audit',
    type: 'boolean',
    label: 'Log User Actions',
    description: 'Log all user actions and changes',
    isEncrypted: false,
  },
  {
    key: 'AUDIT_LOG_SYSTEM_EVENTS',
    value: 'true',
    category: 'audit',
    type: 'boolean',
    label: 'Log System Events',
    description: 'Log system events and errors',
    isEncrypted: false,
  },
  {
    key: 'AUDIT_LOG_API_CALLS',
    value: 'true',
    category: 'audit',
    type: 'boolean',
    label: 'Log API Calls',
    description: 'Log all API requests and responses',
    isEncrypted: false,
  },
  {
    key: 'AUDIT_LOG_SENSITIVE_DATA',
    value: 'false',
    category: 'audit',
    type: 'boolean',
    label: 'Log Sensitive Data',
    description: 'Include sensitive data in audit logs (not recommended)',
    isEncrypted: false,
  },
]

async function main() {
  console.log('🌱 Seeding comprehensive settings...')

  for (const setting of COMPREHENSIVE_SETTINGS) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      create: {
        id: nanoid(),
        ...setting,
        updatedBy: 'system',
        updatedAt: new Date(),
      },
      update: {
        value: setting.value,
        label: setting.label,
        description: setting.description,
        type: setting.type,
        category: setting.category,
        isEncrypted: setting.isEncrypted,
        updatedAt: new Date(),
      },
    })
  }

  console.log(`✅ Successfully seeded ${COMPREHENSIVE_SETTINGS.length} settings`)
  console.log('\n📊 Settings breakdown by category:')
  
  const categoryCounts: Record<string, number> = {}
  COMPREHENSIVE_SETTINGS.forEach(s => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1
  })
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   - ${category}: ${count} settings`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error seeding settings:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
