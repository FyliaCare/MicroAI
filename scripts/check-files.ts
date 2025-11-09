import { prisma } from '../src/lib/prisma'

async function checkFiles() {
  try {
    console.log('🔍 Checking files in database...\n')

    // Get all projects
    const projects = await prisma.project.findMany({
      select: { id: true, name: true }
    })

    console.log(`📁 Found ${projects.length} projects\n`)

    for (const project of projects) {
      console.log(`\n📂 Project: ${project.name} (${project.id})`)
      
      // Check ProjectFile table (admin uploads)
      const projectFiles = await prisma.projectFile.findMany({
        where: { projectId: project.id }
      })
      
      // Check ClientUpload table (client uploads)
      const clientUploads = await prisma.clientUpload.findMany({
        where: { projectId: project.id }
      })

      console.log(`  - Admin uploads: ${projectFiles.length}`)
      console.log(`  - Client uploads: ${clientUploads.length}`)
      console.log(`  - Total files: ${projectFiles.length + clientUploads.length}`)

      if (projectFiles.length > 0) {
        console.log(`\n  Admin Files:`)
        projectFiles.forEach((file, idx) => {
          console.log(`    ${idx + 1}. ${file.filename} (${(file.fileSize / 1024).toFixed(2)} KB)`)
          console.log(`       URL: ${file.fileUrl}`)
          console.log(`       Uploaded by: ${file.uploadedBy}`)
        })
      }

      if (clientUploads.length > 0) {
        console.log(`\n  Client Files:`)
        clientUploads.forEach((file, idx) => {
          console.log(`    ${idx + 1}. ${file.originalName} (${(file.fileSize / 1024).toFixed(2)} KB)`)
          console.log(`       URL: ${file.fileUrl}`)
        })
      }
    }

    console.log('\n✅ File check complete!')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkFiles()
