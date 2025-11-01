import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const health = {
      database: 'healthy',
      email: 'healthy',
      storage: 'healthy',
      cache: 'healthy'
    }

    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`
      health.database = 'healthy'
    } catch (error) {
      console.error('Database health check failed:', error)
      health.database = 'error'
    }

    // Check email service (Resend)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      // Just check if API key is set - don't actually send
      if (process.env.RESEND_API_KEY) {
        health.email = 'healthy'
      } else {
        health.email = 'error'
      }
    } catch (error) {
      console.error('Email service health check failed:', error)
      health.email = 'error'
    }

    // Check storage (check if uploads directory is accessible)
    try {
      const fs = require('fs')
      const path = require('path')
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      
      if (fs.existsSync(uploadsDir)) {
        health.storage = 'healthy'
      } else {
        health.storage = 'error'
      }
    } catch (error) {
      console.error('Storage health check failed:', error)
      health.storage = 'error'
    }

    // Cache is always healthy (in-memory)
    health.cache = 'healthy'

    return NextResponse.json(health)
  } catch (error) {
    console.error('System health check error:', error)
    return NextResponse.json(
      { error: 'Failed to check system health' },
      { status: 500 }
    )
  }
}
