import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// POST /api/admin/settings/reset - Reset settings to defaults
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { category, settingIds } = body

    let resetCount = 0

    if (settingIds && Array.isArray(settingIds)) {
      // Reset specific settings
      for (const settingId of settingIds) {
        const setting = await prisma.setting.findUnique({
          where: { id: settingId }
        })

        if (setting && setting.defaultValue) {
          await prisma.setting.update({
            where: { id: settingId },
            data: {
              value: setting.defaultValue,
              updatedBy: session.user?.email || 'admin',
              updatedAt: new Date()
            }
          })

          // Create history record
          await prisma.settingHistory.create({
            data: {
              id: nanoid(),
              settingId: setting.id,
              key: setting.key,
              oldValue: setting.value,
              newValue: setting.defaultValue,
              changedBy: session.user?.email || 'admin',
              changeReason: 'Reset to default value',
              ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown'
            }
          })

          resetCount++
        }
      }
    } else if (category) {
      // Reset all settings in a category
      const settings = await prisma.setting.findMany({
        where: { category }
      })

      for (const setting of settings) {
        if (setting.defaultValue) {
          await prisma.setting.update({
            where: { id: setting.id },
            data: {
              value: setting.defaultValue,
              updatedBy: session.user?.email || 'admin',
              updatedAt: new Date()
            }
          })

          // Create history record
          await prisma.settingHistory.create({
            data: {
              id: nanoid(),
              settingId: setting.id,
              key: setting.key,
              oldValue: setting.value,
              newValue: setting.defaultValue,
              changedBy: session.user?.email || 'admin',
              changeReason: `Reset category '${category}' to defaults`,
              ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown'
            }
          })

          resetCount++
        }
      }
    } else {
      return NextResponse.json(
        { error: 'Must specify either category or settingIds' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Reset ${resetCount} settings to default values`,
      resetCount
    })
  } catch (error) {
    console.error('Error resetting settings:', error)
    return NextResponse.json(
      { error: 'Failed to reset settings' },
      { status: 500 }
    )
  }
}
