import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// GET /api/admin/settings - Get settings by category
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'system'

    const settings = await prisma.setting.findMany({
      where: { category },
      orderBy: { label: 'asc' }
    })

    return NextResponse.json({ 
      success: true,
      settings,
      category 
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { settings, category } = body

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 })
    }

    // Update each setting and create history
    const updates = settings.map(async (setting: any) => {
      const oldSetting = await prisma.setting.findUnique({
        where: { id: setting.id }
      })

      // Update setting
      const updated = await prisma.setting.update({
        where: { id: setting.id },
        data: {
          value: setting.value,
          updatedBy: session.user?.email || 'admin',
          updatedAt: new Date()
        }
      })

      // Create history record
      if (oldSetting && oldSetting.value !== setting.value) {
        await prisma.settingHistory.create({
          data: {
            id: nanoid(),
            settingId: setting.id,
            key: setting.key,
            oldValue: oldSetting.value,
            newValue: setting.value,
            changedBy: session.user?.email || 'admin',
            changeReason: `Updated via settings manager`,
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown'
          }
        })
      }

      return updated
    })

    await Promise.all(updates)

    return NextResponse.json({ 
      success: true,
      message: 'Settings updated successfully',
      count: settings.length 
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/settings - Create new setting
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      key,
      value,
      category,
      type = 'string',
      label,
      description,
      isEncrypted = false,
      defaultValue
    } = body

    if (!key || !value || !category || !label) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const setting = await prisma.setting.create({
      data: {
        id: nanoid(),
        key,
        value,
        category,
        type,
        label,
        description,
        isEncrypted,
        defaultValue: defaultValue || value,
        createdBy: session.user?.email || 'admin',
        updatedBy: session.user?.email || 'admin',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      setting
    })
  } catch (error: any) {
    console.error('Error creating setting:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Setting key already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create setting' },
      { status: 500 }
    )
  }
}
