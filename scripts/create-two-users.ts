import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createUsers() {
  try {
    console.log('👥 Creating admin users...\n')

    // User 1: Super Admin
    const admin1 = {
      email: 'admin@microaisystems.com',
      password: '1Billion7991.',
      name: 'Admin',
      role: 'super-admin'
    }

    // User 2: Sales Admin
    const admin2 = {
      email: 'sales@microaisystems.com',
      password: 'Cherbu@2000',
      name: 'Sales',
      role: 'super-admin'
    }

    const users = [admin1, admin2]

    for (const userData of users) {
      // Check if admin already exists
      const existing = await prisma.admin.findUnique({
        where: { email: userData.email }
      })

      if (existing) {
        console.log(`⚠️  ${userData.email} already exists. Updating password...`)
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        await prisma.admin.update({
          where: { email: userData.email },
          data: { 
            password: hashedPassword,
            role: 'super-admin',
            isActive: true
          }
        })
        console.log(`✅ Updated: ${userData.email}`)
        console.log(`   Password: ${userData.password}`)
        console.log('')
        continue
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Create admin user in Admin table
      const admin = await prisma.admin.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          isActive: true
        }
      })

      console.log(`✅ Created: ${admin.email}`)
      console.log(`   Name: ${admin.name}`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Password: ${userData.password}`)
      console.log('')
    }

    console.log('🎉 All admin accounts created successfully!')
    console.log('')
    console.log('Login at: https://www.microaisystems.com/admin')
    console.log('')
    console.log('Admin 1:')
    console.log('  Email: admin@microaisystems.com')
    console.log('  Password: 1Billion7991.')
    console.log('')
    console.log('Admin 2:')
    console.log('  Email: sales@microaisystems.com')
    console.log('  Password: Cherbu@2000')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createUsers()
