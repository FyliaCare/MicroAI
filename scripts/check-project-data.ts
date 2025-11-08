import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProjectData() {
  try {
    console.log('=== Checking Project Data ===\n')

    // Get all projects
    const projects = await prisma.project.findMany({
      include: {
        client: true,
      },
      take: 5,
    })

    console.log(`Found ${projects.length} projects\n`)

    for (const project of projects) {
      console.log(`\n📁 Project: ${project.name} (${project.id})`)
      console.log(`   Client: ${project.client.name}`)
      console.log(`   Status: ${project.status}`)

      // Check admin uploads
      const projectFiles = await prisma.projectFile.findMany({
        where: { projectId: project.id },
      })
      console.log(`   📎 Admin uploads: ${projectFiles.length}`)
      projectFiles.forEach(file => {
        console.log(`      - ${file.filename} (${file.uploadedBy})`)
      })

      // Check client uploads
      const clientUploads = await prisma.clientUpload.findMany({
        where: { projectId: project.id },
      })
      console.log(`   📎 Client uploads: ${clientUploads.length}`)
      clientUploads.forEach(upload => {
        console.log(`      - ${upload.originalName} (Client)`)
      })

      // Check ProjectComment table
      const projectComments = await prisma.projectComment.findMany({
        where: { projectId: project.id },
      })
      console.log(`   💬 ProjectComments: ${projectComments.length}`)
      projectComments.forEach(comment => {
        console.log(`      - ${comment.authorName} (${comment.authorRole}): ${comment.content.substring(0, 50)}...`)
      })

      // Check Comment table (legacy)
      const legacyComments = await prisma.comment.findMany({
        where: { projectId: project.id },
      })
      console.log(`   💬 Legacy Comments: ${legacyComments.length}`)
      legacyComments.forEach(comment => {
        console.log(`      - ${comment.content.substring(0, 50)}...`)
      })
    }

    console.log('\n\n=== Summary ===')
    const totalProjectFiles = await prisma.projectFile.count()
    const totalClientUploads = await prisma.clientUpload.count()
    const totalProjectComments = await prisma.projectComment.count()
    const totalLegacyComments = await prisma.comment.count()

    console.log(`Total Admin Uploads: ${totalProjectFiles}`)
    console.log(`Total Client Uploads: ${totalClientUploads}`)
    console.log(`Total ProjectComments: ${totalProjectComments}`)
    console.log(`Total Legacy Comments: ${totalLegacyComments}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProjectData()
