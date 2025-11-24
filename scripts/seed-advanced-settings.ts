import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultSettings = [
  // System Settings
  {
    key: 'system.maintenance_mode',
    value: 'false',
    category: 'system',
    type: 'boolean',
    label: 'Maintenance Mode',
    description: 'Enable maintenance mode to prevent public access',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'false'
  },
  {
    key: 'system.max_upload_size',
    value: '5242880',
    category: 'system',
    type: 'number',
    label: 'Max Upload Size (bytes)',
    description: 'Maximum file upload size in bytes (default: 5MB)',
    isPublic: false,
    isEncrypted: false,
    defaultValue: '5242880'
  },
  {
    key: 'system.session_timeout',
    value: '3600',
    category: 'system',
    type: 'number',
    label: 'Session Timeout (seconds)',
    description: 'User session timeout duration',
    isPublic: false,
    isEncrypted: false,
    defaultValue: '3600'
  },
  {
    key: 'system.password_min_length',
    value: '8',
    category: 'system',
    type: 'number',
    label: 'Minimum Password Length',
    description: 'Minimum required password length',
    isPublic: false,
    isEncrypted: false,
    defaultValue: '8'
  },

  // Email Settings
  {
    key: 'email.provider',
    value: 'resend',
    category: 'email',
    type: 'select',
    label: 'Email Provider',
    description: 'Email delivery service provider (resend or smtp)',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'resend',
    metadata: JSON.stringify({ options: ['resend', 'smtp'] })
  },
  {
    key: 'email.from_name',
    value: 'MicroAI Systems',
    category: 'email',
    type: 'string',
    label: 'From Name',
    description: 'Default sender name for emails',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'MicroAI Systems'
  },
  {
    key: 'email.from_email',
    value: 'sales@microaisystems.com',
    category: 'email',
    type: 'string',
    label: 'From Email',
    description: 'Default sender email address',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'sales@microaisystems.com'
  },
  {
    key: 'email.admin_email',
    value: 'admin@microaisystems.com',
    category: 'email',
    type: 'string',
    label: 'Admin Email',
    description: 'Admin email for system notifications',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'admin@microaisystems.com'
  },
  {
    key: 'email.resend_api_key',
    value: '',
    category: 'email',
    type: 'password',
    label: 'Resend API Key',
    description: 'API key for Resend email service',
    isPublic: false,
    isEncrypted: true,
    defaultValue: ''
  },
  {
    key: 'email.daily_limit',
    value: '1000',
    category: 'email',
    type: 'number',
    label: 'Daily Email Limit',
    description: 'Maximum emails to send per day',
    isPublic: false,
    isEncrypted: false,
    defaultValue: '1000'
  },

  // Notification Settings
  {
    key: 'notifications.email_enabled',
    value: 'true',
    category: 'notifications',
    type: 'boolean',
    label: 'Enable Email Notifications',
    description: 'Send notifications via email',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'true'
  },
  {
    key: 'notifications.slack_enabled',
    value: 'false',
    category: 'notifications',
    type: 'boolean',
    label: 'Enable Slack Notifications',
    description: 'Send notifications to Slack',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'false'
  },
  {
    key: 'notifications.slack_webhook',
    value: '',
    category: 'notifications',
    type: 'string',
    label: 'Slack Webhook URL',
    description: 'Slack webhook URL for notifications',
    isPublic: false,
    isEncrypted: true,
    defaultValue: ''
  },

  // Security Settings
  {
    key: 'security.rate_limit_enabled',
    value: 'true',
    category: 'security',
    type: 'boolean',
    label: 'Enable Rate Limiting',
    description: 'Limit API request rates',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'true'
  },
  {
    key: 'security.rate_limit_requests',
    value: '100',
    category: 'security',
    type: 'number',
    label: 'Rate Limit (requests)',
    description: 'Maximum requests per time window',
    isPublic: false,
    isEncrypted: false,
    defaultValue: '100'
  },
  {
    key: 'security.rate_limit_window',
    value: '60',
    category: 'security',
    type: 'number',
    label: 'Rate Limit Window (seconds)',
    description: 'Time window for rate limiting',
    isPublic: false,
    isEncrypted: false,
    defaultValue: '60'
  },
  {
    key: 'security.bot_protection',
    value: 'true',
    category: 'security',
    type: 'boolean',
    label: 'Enable Bot Protection',
    description: 'Protect against automated bot attacks',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'true'
  },
  {
    key: 'security.cors_enabled',
    value: 'true',
    category: 'security',
    type: 'boolean',
    label: 'Enable CORS',
    description: 'Cross-Origin Resource Sharing',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'true'
  },

  // API Settings
  {
    key: 'api.enabled',
    value: 'true',
    category: 'api',
    type: 'boolean',
    label: 'Enable API',
    description: 'Enable REST API endpoints',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'true'
  },
  {
    key: 'api.version',
    value: 'v1',
    category: 'api',
    type: 'string',
    label: 'API Version',
    description: 'Current API version',
    isPublic: true,
    isEncrypted: false,
    defaultValue: 'v1'
  },
  {
    key: 'api.docs_enabled',
    value: 'true',
    category: 'api',
    type: 'boolean',
    label: 'Enable API Docs',
    description: 'Expose API documentation',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'true'
  },

  // Theme Settings
  {
    key: 'theme.primary_color',
    value: '#6366f1',
    category: 'theme',
    type: 'color',
    label: 'Primary Color',
    description: 'Main brand color',
    isPublic: true,
    isEncrypted: false,
    defaultValue: '#6366f1'
  },
  {
    key: 'theme.logo_url',
    value: '/logo.png',
    category: 'theme',
    type: 'string',
    label: 'Logo URL',
    description: 'Company logo path or URL',
    isPublic: true,
    isEncrypted: false,
    defaultValue: '/logo.png'
  },
  {
    key: 'theme.dark_mode',
    value: 'false',
    category: 'theme',
    type: 'boolean',
    label: 'Dark Mode',
    description: 'Enable dark mode by default',
    isPublic: true,
    isEncrypted: false,
    defaultValue: 'false'
  },

  // Database Settings
  {
    key: 'database.connection_pool_size',
    value: '10',
    category: 'database',
    type: 'number',
    label: 'Connection Pool Size',
    description: 'Database connection pool size',
    isPublic: false,
    isEncrypted: false,
    defaultValue: '10'
  },
  {
    key: 'database.query_timeout',
    value: '30000',
    category: 'database',
    type: 'number',
    label: 'Query Timeout (ms)',
    description: 'Database query timeout in milliseconds',
    isPublic: false,
    isEncrypted: false,
    defaultValue: '30000'
  },

  // Backup Settings
  {
    key: 'backup.enabled',
    value: 'true',
    category: 'backup',
    type: 'boolean',
    label: 'Enable Backups',
    description: 'Enable automatic backups',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'true'
  },
  {
    key: 'backup.frequency',
    value: 'daily',
    category: 'backup',
    type: 'select',
    label: 'Backup Frequency',
    description: 'How often to create backups',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'daily',
    metadata: JSON.stringify({ options: ['hourly', 'daily', 'weekly', 'monthly'] })
  },

  // Monitoring Settings
  {
    key: 'monitoring.enabled',
    value: 'true',
    category: 'monitoring',
    type: 'boolean',
    label: 'Enable Monitoring',
    description: 'Enable system monitoring',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'true'
  },
  {
    key: 'monitoring.log_level',
    value: 'info',
    category: 'monitoring',
    type: 'select',
    label: 'Log Level',
    description: 'Logging verbosity level',
    isPublic: false,
    isEncrypted: false,
    defaultValue: 'info',
    metadata: JSON.stringify({ options: ['error', 'warn', 'info', 'debug'] })
  }
]

async function seedAdvancedSettings() {
  console.log('🌱 Seeding advanced settings...')

  for (const setting of defaultSettings) {
    try {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: setting,
        create: {
          ...setting,
          createdBy: 'system',
          updatedBy: 'system'
        }
      })
      console.log(`✓ ${setting.label}`)
    } catch (error) {
      console.error(`✗ Failed to seed ${setting.label}:`, error)
    }
  }

  // Create default system config
  try {
    await prisma.systemConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' }
    })
    console.log('✓ System Config')
  } catch (error) {
    console.error('✗ System Config:', error)
  }

  // Create default theme config
  try {
    await prisma.themeConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default', name: 'MicroAI Default' }
    })
    console.log('✓ Theme Config')
  } catch (error) {
    console.error('✗ Theme Config:', error)
  }

  // Create default security config
  try {
    await prisma.securityConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' }
    })
    console.log('✓ Security Config')
  } catch (error) {
    console.error('✗ Security Config:', error)
  }

  // Create default notification config
  try {
    await prisma.notificationConfig.upsert({
      where: { id: 'default' },
      update: {},
      create: { 
        id: 'default',
        events: JSON.stringify({
          newProject: true,
          projectApproved: true,
          quoteAccepted: true
        })
      }
    })
    console.log('✓ Notification Config')
  } catch (error) {
    console.error('✗ Notification Config:', error)
  }

  console.log('✅ Advanced settings seeded successfully!')
}

seedAdvancedSettings()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
