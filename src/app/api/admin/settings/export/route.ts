import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// GET /api/admin/settings/export - Export all settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all settings
    const settings = await prisma.setting.findMany({
      orderBy: [{ category: 'asc' }, { label: 'asc' }]
    })

    // Fetch all config tables
    const [
      systemConfig,
      emailConfig,
      themeConfig,
      notificationConfig,
      securityConfig,
      apiConfig
    ] = await Promise.all([
      prisma.systemConfig.findFirst({ where: { id: 'default' } }),
      prisma.emailConfig.findFirst(),
      prisma.themeConfig.findFirst({ where: { isActive: true } }),
      prisma.notificationConfig.findFirst(),
      prisma.securityConfig.findFirst(),
      prisma.aPIConfig.findFirst()
    ])

    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      exportedBy: session.user?.email || 'admin',
      settings,
      configs: {
        system: systemConfig,
        email: emailConfig,
        theme: themeConfig,
        notifications: notificationConfig,
        security: securityConfig,
        api: apiConfig
      }
    }

    // Create backup record
    await prisma.settingsBackup.create({
      data: {
        id: nanoid(),
        name: `Export ${new Date().toLocaleDateString()}`,
        description: `Settings export by ${session.user?.email}`,
        data: JSON.stringify(exportData),
        version: '1.0.0',
        createdBy: session.user?.email || 'admin'
      }
    })

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="settings-${Date.now()}.json"`
      }
    })
  } catch (error) {
    console.error('Error exporting settings:', error)
    return NextResponse.json(
      { error: 'Failed to export settings' },
      { status: 500 }
    )
  }
}
