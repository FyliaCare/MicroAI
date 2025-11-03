import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('👤 Creating admin user...\n')

    const email = 'osibanjanet820@gmail.com'
    const password = 'Admin@123'

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      console.log('⚠️  User already exists. Updating to super-admin role...')
      const updated = await prisma.user.update({
        where: { email },
        data: { role: 'super-admin' }
      })
      console.log('✅ User updated:', updated.email, '-', updated.role)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Philip Montford',
        email: email,
        password: hashedPassword,
        role: 'super-admin',
        isVerified: true,
        isActive: true,
        mustChangePassword: false,
        company: 'MicroAI Systems',
        phone: '+1234567890',
        jobTitle: 'CEO & Founder'
      }
    })

    console.log('✅ Super Admin user created successfully!')
    console.log('')
    console.log('Login Credentials:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('Role:', admin.role)
    console.log('')
    console.log('You can now login at: https://www.microaisystems.com/auth/signin')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
