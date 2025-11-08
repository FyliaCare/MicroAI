import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProjectData() {
  try {
    console.log('=== COMPREHENSIVE PROJECT DATA CHECK ===\n')

    // Get all clients with their projects
    const clients = await prisma.client.findMany({
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
            techStack: true,
            description: true,
            progress: true,
          },
        },
      },
      take: 10,
    })

    console.log(`Found ${clients.length} clients\n`)

    for (const client of clients) {
      console.log(`\n👤 CLIENT: ${client.name} (${client.email})`)
      console.log(`   Client ID: ${client.id}`)
      console.log(`   Projects: ${client.projects.length}`)

      for (const project of client.projects) {
        console.log(`\n   📁 PROJECT: ${project.name}`)
        console.log(`      Project ID: ${project.id}`)
        console.log(`      Status: ${project.status}`)
        console.log(`      Progress: ${project.progress}%`)
        console.log(`      TechStack type: ${typeof project.techStack}`)
        console.log(`      TechStack value: ${JSON.stringify(project.techStack)}`)
        console.log(`      Description: ${project.description?.substring(0, 50)}...`)

        // Check uploads for this specific project
        const [projectFiles, clientUploads] = await Promise.all([
          prisma.projectFile.findMany({
            where: { projectId: project.id },
            select: {
              id: true,
              filename: true,
              uploadedBy: true,
              uploadedAt: true,
            },
          }),
          prisma.clientUpload.findMany({
            where: { projectId: project.id },
            select: {
              id: true,
              originalName: true,
              createdAt: true,
            },
          }),
        ])

        console.log(`      📎 Admin Files: ${projectFiles.length}`)
        projectFiles.forEach(file => {
          console.log(`         - ${file.filename} (by ${file.uploadedBy})`)
        })

        console.log(`      📎 Client Files: ${clientUploads.length}`)
        clientUploads.forEach(file => {
          console.log(`         - ${file.originalName}`)
        })

        // Check comments for this specific project
        const [projectComments, legacyComments] = await Promise.all([
          prisma.projectComment.findMany({
            where: { projectId: project.id },
            select: {
              id: true,
              content: true,
              authorName: true,
              authorRole: true,
              createdAt: true,
            },
          }),
          prisma.comment.findMany({
            where: { projectId: project.id },
            select: {
              id: true,
              content: true,
              createdAt: true,
            },
          }),
        ])

        console.log(`      💬 Project Comments: ${projectComments.length}`)
        projectComments.forEach(comment => {
          console.log(`         - ${comment.authorName} (${comment.authorRole}): ${comment.content.substring(0, 40)}...`)
        })

        console.log(`      💬 Legacy Comments: ${legacyComments.length}`)
        legacyComments.forEach(comment => {
          const preview = typeof comment.content === 'string' 
            ? comment.content.substring(0, 40) 
            : JSON.stringify(comment.content).substring(0, 40)
          console.log(`         - ${preview}...`)
        })
      }
    }

    console.log('\n\n=== DATABASE SUMMARY ===')
    const [
      totalProjects,
      totalProjectFiles,
      totalClientUploads,
      totalProjectComments,
      totalLegacyComments,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.projectFile.count(),
      prisma.clientUpload.count(),
      prisma.projectComment.count(),
      prisma.comment.count(),
    ])

    console.log(`Total Projects: ${totalProjects}`)
    console.log(`Total Admin Files (ProjectFile): ${totalProjectFiles}`)
    console.log(`Total Client Files (ClientUpload): ${totalClientUploads}`)
    console.log(`Total Comments (ProjectComment): ${totalProjectComments}`)
    console.log(`Total Comments (Legacy Comment): ${totalLegacyComments}`)

    // Check for data integrity issues
    console.log('\n=== DATA INTEGRITY CHECKS ===')
    
    // Projects with null/invalid techStack or description
    const projectsWithIssues = await prisma.project.findMany({
      where: {
        OR: [
          { techStack: null },
          { description: null },
        ],
      },
      select: {
        id: true,
        name: true,
        techStack: true,
        status: true,
        description: true,
      },
    })

    console.log(`\nProjects with null fields: ${projectsWithIssues.length}`)
    projectsWithIssues.forEach(p => {
      console.log(`  - ${p.name}:`)
      console.log(`    techStack: ${p.techStack === null ? 'NULL' : 'OK'}`)
      console.log(`    status: ${p.status}`)
      console.log(`    description: ${p.description === null ? 'NULL' : 'OK'}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProjectData()
