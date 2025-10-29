import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/cron/cleanup-unverified - Delete unverified accounts after 30 days
// This endpoint should be called daily by a cron job (e.g., via Render Cron Jobs or Vercel Cron)
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron job (optional: add authorization header check)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()
    
    // Find expired unverified accounts
    const expiredUsers = await prisma.user.findMany({
      where: {
        AND: [
          { isVerified: false },
          { accessExpiresAt: { lte: now } },
          { role: 'client' },
        ],
      },
      include: {
        client: {
          include: {
            projects: true,
          },
        },
        sessions: true,
      },
    })

    console.log(`Found ${expiredUsers.length} expired unverified accounts`)

    const deletedUsers: string[] = []
    const errors: string[] = []

    for (const user of expiredUsers) {
      try {
        // Delete user and related data in a transaction
        await prisma.$transaction(async (tx) => {
          // Delete sessions
          if (user.sessions.length > 0) {
            await tx.clientSession.deleteMany({
              where: { userId: user.id },
            })
          }

          // Delete client-related data if client exists
          if (user.client) {
            // Delete project-related data
            for (const project of user.client.projects) {
              // Delete project updates
              await tx.projectUpdate.deleteMany({
                where: { projectId: project.id },
              })

              // Delete client uploads
              await tx.clientUpload.deleteMany({
                where: { projectId: project.id },
              })

              // Delete code access requests
              await tx.codeAccessRequest.deleteMany({
                where: { projectId: project.id },
              })

              // Delete GitHub integration
              await tx.gitHubIntegration.deleteMany({
                where: { projectId: project.id },
              })

              // Delete activity feed entries
              await tx.activityFeed.deleteMany({
                where: { targetId: project.id, targetType: 'project' },
              })
            }

            // Delete projects
            await tx.project.deleteMany({
              where: { clientId: user.client.id },
            })

            // Delete project requests
            await tx.projectRequest.deleteMany({
              where: { clientEmail: user.email },
            })

            // Delete activity feed entries for client
            await tx.activityFeed.deleteMany({
              where: {
                OR: [
                  { actorId: user.client.id, actorType: 'client' },
                  { targetId: user.client.id, targetType: 'client' },
                ],
              },
            })

            // Delete client
            await tx.client.delete({
              where: { id: user.client.id },
            })
          }

          // Delete email queue entries
          await tx.emailQueue.deleteMany({
            where: { userId: user.id },
          })

          // Delete activity feed entries for user
          await tx.activityFeed.deleteMany({
            where: {
              OR: [
                { actorId: user.id, actorType: 'user' },
                { targetId: user.id, targetType: 'user' },
              ],
            },
          })

          // Finally, delete the user
          await tx.user.delete({
            where: { id: user.id },
          })
        })

        deletedUsers.push(user.email)
        console.log(`Deleted expired account: ${user.email}`)

        // Log the deletion in activity feed (if admin exists)
        await prisma.activityFeed.create({
          data: {
            type: 'account-deleted',
            title: 'Expired Account Deleted',
            description: `Unverified account ${user.email} was automatically deleted after 30 days`,
            actorType: 'system',
            actorId: 'cron-job',
            actorName: 'System',
            isPublic: false,
            icon: '🗑️',
            color: '#ef4444',
          },
        }).catch((err) => {
          console.error('Failed to log deletion:', err)
        })

      } catch (err) {
        const errorMessage = `Failed to delete ${user.email}: ${err instanceof Error ? err.message : 'Unknown error'}`
        errors.push(errorMessage)
        console.error(errorMessage)
      }
    }

    // Update scheduled task record
    await prisma.scheduledTask.upsert({
      where: { taskName: 'cleanup-unverified-accounts' },
      create: {
        taskName: 'cleanup-unverified-accounts',
        taskType: 'cleanup',
        cronExpression: '0 0 * * *', // Daily at midnight
        isActive: true,
        lastRunAt: now,
        nextRunAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        lastStatus: errors.length > 0 ? 'partial-success' : 'success',
        executionCount: 1,
        config: JSON.stringify({
          description: 'Delete unverified client accounts after 30 days',
          retentionDays: 30,
        }),
      },
      update: {
        lastRunAt: now,
        nextRunAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        lastStatus: errors.length > 0 ? 'partial-success' : 'success',
        executionCount: { increment: 1 },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed',
      summary: {
        totalFound: expiredUsers.length,
        deleted: deletedUsers.length,
        errors: errors.length,
      },
      deletedAccounts: deletedUsers,
      errors: errors.length > 0 ? errors : undefined,
      executedAt: now.toISOString(),
    })

  } catch (error) {
    console.error('Cleanup cron job error:', error)
    
    // Log the error
    await prisma.scheduledTask.upsert({
      where: { taskName: 'cleanup-unverified-accounts' },
      create: {
        taskName: 'cleanup-unverified-accounts',
        taskType: 'cleanup',
        cronExpression: '0 0 * * *',
        isActive: true,
        lastRunAt: new Date(),
        lastStatus: 'error',
        lastError: error instanceof Error ? error.message : 'Unknown error',
        executionCount: 1,
      },
      update: {
        lastRunAt: new Date(),
        lastStatus: 'error',
        lastError: error instanceof Error ? error.message : 'Unknown error',
        executionCount: { increment: 1 },
      },
    }).catch(() => {
      // Ignore if this fails
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
