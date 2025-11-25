import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

// POST /api/admin/settings/import - Import settings from backup
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { data, mergeMode = 'replace' } = body

    if (!data || !data.settings) {
      return NextResponse.json(
        { error: 'Invalid import data format' },
        { status: 400 }
      )
    }

    const importedSettings = data.settings as any[]
    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Process each setting
    for (const setting of importedSettings) {
      try {
        const existingSetting = await prisma.setting.findUnique({
          where: { key: setting.key }
        })

        if (existingSetting) {
          if (mergeMode === 'skip') {
            continue
          }

          // Update existing setting
          await prisma.setting.update({
            where: { id: existingSetting.id },
            data: {
              value: setting.value,
              type: setting.type,
              category: setting.category,
              description: setting.description,
              label: setting.label,
              defaultValue: setting.defaultValue,
              isEncrypted: setting.isEncrypted,
              isPublic: setting.isPublic,
              metadata: setting.metadata,
              validation: setting.validation,
              updatedBy: session.user?.email || 'admin',
              updatedAt: new Date()
            }
          })

          // Create history record
          await prisma.settingHistory.create({
            data: {
              id: nanoid(),
              settingId: existingSetting.id,
              key: setting.key,
              oldValue: existingSetting.value,
              newValue: setting.value,
              changedBy: session.user?.email || 'admin',
              changeReason: 'Imported from backup',
              ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown'
            }
          })
        } else {
          // Create new setting
          await prisma.setting.create({
            data: {
              id: nanoid(),
              key: setting.key,
              value: setting.value,
              type: setting.type || 'string',
              category: setting.category,
              description: setting.description,
              label: setting.label,
              defaultValue: setting.defaultValue || setting.value,
              isEncrypted: setting.isEncrypted || false,
              isPublic: setting.isPublic || false,
              metadata: setting.metadata,
              validation: setting.validation,
              createdBy: session.user?.email || 'admin',
              updatedBy: session.user?.email || 'admin',
              updatedAt: new Date()
            }
          })
        }

        successCount++
      } catch (error: any) {
        errorCount++
        errors.push(`${setting.key}: ${error.message}`)
        console.error(`Error importing setting ${setting.key}:`, error)
      }
    }

    // Create backup record of the import
    await prisma.settingsBackup.create({
      data: {
        id: nanoid(),
        name: `Import ${new Date().toLocaleDateString()}`,
        description: `Settings imported by ${session.user?.email}. Success: ${successCount}, Errors: ${errorCount}`,
        data: JSON.stringify(data),
        version: data.version || '1.0.0',
        createdBy: session.user?.email || 'admin'
      }
    })

    return NextResponse.json({
      success: true,
      message: `Import completed. ${successCount} settings imported successfully${errorCount > 0 ? `, ${errorCount} errors` : ''}`,
      successCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('Error importing settings:', error)
    return NextResponse.json(
      { error: 'Failed to import settings' },
      { status: 500 }
    )
  }
}
