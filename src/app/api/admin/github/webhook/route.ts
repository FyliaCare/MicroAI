import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // Verify GitHub webhook signature (optional but recommended)
    const signature = req.headers.get('x-hub-signature-256')
    const event = req.headers.get('x-github-event')

    // Only process push events
    if (event !== 'push') {
      return NextResponse.json({ success: true, message: 'Event ignored' })
    }

    const payload = await req.json()

    // Extract repository information
    const repoUrl = payload.repository?.html_url
    if (!repoUrl) {
      return NextResponse.json({ success: false, error: 'No repository URL found' }, { status: 400 })
    }

    // Find projects with this repository URL
    const projects = await prisma.project.findMany({
      where: {
        githubRepo: repoUrl,
      },
    })

    if (projects.length === 0) {
      return NextResponse.json({ success: true, message: 'No projects found for this repository' })
    }

    // Extract commit information
    const commits = payload.commits || []
    const lastCommit = commits[commits.length - 1]

    // Update project information
    const updateData: any = {
      updatedAt: new Date(),
    }

    // If there's a commit message, you could update notes or add to activity log
    if (lastCommit) {
      const commitInfo = `Latest commit: ${lastCommit.message} by ${lastCommit.author.name} at ${lastCommit.timestamp}`
      
      // Update notes with latest commit info
      for (const project of projects) {
        const currentNotes = project.notes || ''
        const updatedNotes = `${commitInfo}\n\n${currentNotes}`.substring(0, 1000) // Keep last 1000 chars
        
        await prisma.project.update({
          where: { id: project.id },
          data: {
            notes: updatedNotes,
            updatedAt: new Date(),
          },
        })
      }
    }

    // Optionally, you could also fetch the latest repo data and update other fields
    // This would be similar to the sync functionality

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${projects.length} project(s)`,
      updated: projects.length,
    })

  } catch (error) {
    console.error('Error processing GitHub webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
