import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDuplicatePosts() {
  try {
    console.log('🔍 Finding duplicate blog posts...\n')

    // Get all posts grouped by title
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'asc' }
    })

    // Group by title
    const groupedByTitle: Record<string, any[]> = {}
    posts.forEach(post => {
      if (!groupedByTitle[post.title]) {
        groupedByTitle[post.title] = []
      }
      groupedByTitle[post.title].push(post)
    })

    let totalDeleted = 0

    // For each group with duplicates, keep the newest one and delete the rest
    for (const [title, duplicates] of Object.entries(groupedByTitle)) {
      if (duplicates.length > 1) {
        console.log(`📝 Found ${duplicates.length} copies of: "${title}"`)
        
        // Sort by createdAt descending (newest first)
        duplicates.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        // Keep the first one (newest), delete the rest
        const toKeep = duplicates[0]
        const toDelete = duplicates.slice(1)

        console.log(`   ✅ Keeping: ${toKeep.id} (${toKeep.createdAt})`)
        
        for (const post of toDelete) {
          console.log(`   ❌ Deleting: ${post.id} (${post.createdAt})`)
          try {
            await prisma.blogPost.delete({
              where: { id: post.id }
            })
            totalDeleted++
          } catch (deleteError: any) {
            console.log(`   ⚠️  Could not delete ${post.id}: ${deleteError.message}`)
          }
        }
        console.log('')
      }
    }

    console.log(`\n✨ Cleanup complete!`)
    console.log(`📊 Total duplicates removed: ${totalDeleted}`)
    console.log(`📊 Unique posts remaining: ${Object.keys(groupedByTitle).length}`)

  } catch (error) {
    console.error('❌ Error cleaning up duplicates:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDuplicatePosts()
