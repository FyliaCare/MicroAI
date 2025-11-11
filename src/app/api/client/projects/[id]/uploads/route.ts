import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as jwt from 'jsonwebtoken'

export async function POST() {
  return NextResponse.json({ success: false, error: 'File uploads now via Google Drive' }, { status: 410 })
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    let clientId: string | null = null

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      clientId = decoded.clientId
    } catch (err) {
      const session = await prisma.clientSession.findFirst({
        where: { sessionToken: token, isActive: true, expiresAt: { gt: new Date() } },
        include: { user: { include: { client: true } } }
      })
      if (session?.user?.client) clientId = session.user.client.id
    }

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 })
    }

    const project = await prisma.project.findFirst({ where: { id: params.id, clientId } })
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    const files = await prisma.projectFile.findMany({ where: { projectId: params.id }, orderBy: { uploadedAt: 'desc' } })
    const uploads = files.map(f => ({ id: f.id, filename: f.filename, fileUrl: f.fileUrl, fileSize: f.fileSize, fileType: f.fileType, uploadedAt: f.uploadedAt.toISOString() }))

    return NextResponse.json({ success: true, uploads, files: uploads })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch uploads' }, { status: 500 })
  }
}

export async function DELETE() {
  return NextResponse.json({ success: false, error: 'File deletion via Google Drive' }, { status: 410 })
}