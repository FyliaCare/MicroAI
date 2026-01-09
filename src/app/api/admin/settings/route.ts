import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas for each category
const systemSchema = z.object({
  siteName: z.string().optional(),
  siteUrl: z.string().url().optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  currency: z.string().optional(),
  language: z.string().optional(),
  sessionTimeout: z.string().optional(),
  maxUploadSize: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
  debugMode: z.boolean().optional(),
})

const securitySchema = z.object({
  passwordMinLength: z.string().optional(),
  requireUppercase: z.boolean().optional(),
  requireNumbers: z.boolean().optional(),
  requireSpecialChars: z.boolean().optional(),
  maxLoginAttempts: z.string().optional(),
  lockoutDuration: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
  sessionEncryption: z.boolean().optional(),
  corsOrigins: z.string().optional(),
  apiRateLimit: z.string().optional(),
})

const emailSchema = z.object({
  fromName: z.string().optional(),
  fromEmail: z.string().email().optional(),
  replyTo: z.string().email().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUsername: z.string().optional(),
  smtpPassword: z.string().optional(),
  smtpSecure: z.boolean().optional(),
  queueEnabled: z.boolean().optional(),
  emailRateLimit: z.string().optional(),
})

const databaseSchema = z.object({
  poolSize: z.string().optional(),
  queryTimeout: z.string().optional(),
  slowQueryThreshold: z.string().optional(),
  autoVacuum: z.boolean().optional(),
  backupEnabled: z.boolean().optional(),
  backupSchedule: z.string().optional(),
  backupRetentionDays: z.string().optional(),
})

const apiSchema = z.object({
  apiVersion: z.string().optional(),
  apiBasePath: z.string().optional(),
  apiTimeout: z.string().optional(),
  rateLimitPerMinute: z.string().optional(),
  rateLimitPerHour: z.string().optional(),
  enableWebhooks: z.boolean().optional(),
  webhookRetryAttempts: z.string().optional(),
  webhookTimeout: z.string().optional(),
  corsOrigins: z.string().optional(),
  enableApiDocs: z.boolean().optional(),
})

const themeSchema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  darkModeEnabled: z.boolean().optional(),
  fontFamily: z.string().optional(),
  borderRadius: z.string().optional(),
  customCSS: z.string().optional(),
})

const backupSchema = z.object({
  backupFrequency: z.string().optional(),
  backupTime: z.string().optional(),
  backupRetentionDays: z.string().optional(),
  backupLocation: z.string().optional(),
  s3Bucket: z.string().optional(),
  s3Region: z.string().optional(),
  compressionEnabled: z.boolean().optional(),
  encryptionEnabled: z.boolean().optional(),
  encryptionKey: z.string().optional(),
  notifyOnSuccess: z.boolean().optional(),
  notifyOnFailure: z.boolean().optional(),
})

const monitoringSchema = z.object({
  metricsInterval: z.string().optional(),
  errorReporting: z.boolean().optional(),
  errorReportingService: z.string().optional(),
  sentryDsn: z.string().optional(),
  uptimeMonitoring: z.boolean().optional(),
  uptimeCheckInterval: z.string().optional(),
  performanceMonitoring: z.boolean().optional(),
  slowRequestThreshold: z.string().optional(),
  alertEmail: z.string().email().optional(),
  slackWebhookUrl: z.string().optional(),
  cpuThreshold: z.string().optional(),
  memoryThreshold: z.string().optional(),
  diskThreshold: z.string().optional(),
})

const schemas = {
  system: systemSchema,
  security: securitySchema,
  email: emailSchema,
  database: databaseSchema,
  api: apiSchema,
  theme: themeSchema,
  backup: backupSchema,
  monitoring: monitoringSchema,
}

// GET - Fetch all settings or settings by category
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const settings = await prisma.setting.findMany({
      where: category ? { category } : undefined,
      orderBy: { key: 'asc' },
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST - Save settings for a category
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { category, settings } = body

    if (!category || !settings) {
      return NextResponse.json(
        { error: 'Category and settings are required' },
        { status: 400 }
      )
    }

    // Validate settings based on category
    const schema = schemas[category as keyof typeof schemas]
    if (schema) {
      const validation = schema.safeParse(settings)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid settings data', details: validation.error },
          { status: 400 }
        )
      }
    }

    // Update settings in database
    const updates = []
    for (const [key, value] of Object.entries(settings)) {
      const settingKey = `${category}.${key}`
      const now = new Date()
      
      // Generate a unique ID for new settings
      const settingId = `setting_${category}_${key}_${Date.now()}`
      
      updates.push(
        prisma.setting.upsert({
          where: { key: settingKey },
          update: {
            value: String(value),
            updatedBy: session.user.email || 'system',
            updatedAt: now,
          },
          create: {
            id: settingId,
            key: settingKey,
            value: String(value),
            category,
            type: typeof value === 'boolean' ? 'boolean' : 'string',
            label: key.replace(/([A-Z])/g, ' $1').trim(),
            updatedBy: session.user.email || 'system',
            updatedAt: now,
          },
        })
      )
    }

    await prisma.$transaction(updates)

    return NextResponse.json({ 
      success: true,
      message: 'Settings saved successfully' 
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
