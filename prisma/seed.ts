import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default admin user
  const defaultEmail = 'microailabs@gmail.com'
  const defaultPassword = '1Billion7991.'
  
  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: defaultEmail }
  })

  if (existingAdmin) {
    console.log('✅ Default admin already exists:', defaultEmail)
  } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        name: 'MicroAI Systems',
        role: 'super-admin',
        isActive: true,
      }
    })

    console.log('✅ Created admin user:')
    console.log('   Email:', admin.email)
    console.log('   Password: 1Billion7991.')
  }

  // Create some sample data (optional)
  console.log('\n📊 Creating sample data...')

  // Create client user for portal access
  const clientEmail = 'chiefclient@microaisystems.com'
  const clientPassword = '1Billion7991.'
  
  const existingClientUser = await prisma.user.findUnique({
    where: { email: clientEmail }
  })

  let clientUser
  if (existingClientUser) {
    console.log('✅ Client user already exists:', clientEmail)
    clientUser = existingClientUser
  } else {
    const hashedClientPassword = await bcrypt.hash(clientPassword, 10)
    
    clientUser = await prisma.user.create({
      data: {
        email: clientEmail,
        password: hashedClientPassword,
        name: 'Chief Client',
        role: 'client',
        isActive: true,
        isVerified: true,
        mustChangePassword: false,
      }
    })
    
    console.log('✅ Created client user:')
    console.log('   Email:', clientUser.email)
    console.log('   Password: 1Billion7991.')
  }

  // Sample client with portal access
  const client = await prisma.client.upsert({
    where: { email: clientEmail },
    update: {
      hasPortalAccess: true,
      userId: clientUser.id,
    },
    create: {
      name: 'Chief Client',
      email: clientEmail,
      phone: '+233 244486837',
      company: 'MicroAI Systems',
      website: 'https://microaisystems.com',
      status: 'active',
      hasPortalAccess: true,
      userId: clientUser.id,
      notes: 'Primary client with full portal access'
    }
  })

  console.log('✅ Created client with portal access:', client.name)

  // Sample client without portal access
  const sampleClient = await prisma.client.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Acme Corp',
      website: 'https://acmecorp.com',
      status: 'active',
      notes: 'Sample client for testing'
    }
  })

  console.log('✅ Created sample client:', sampleClient.name)

  // Sample project
  const project = await prisma.project.create({
    data: {
      name: 'E-commerce Platform',
      description: 'Modern e-commerce solution with advanced features',
      type: 'web-app',
      status: 'in-progress',
      priority: 'high',
      budget: 50000,
      actualCost: 25000,
      revenue: 45000,
      profitMargin: 40,
      progress: 65,
      techStack: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe']),
      clientId: client.id,
      startDate: new Date('2025-01-15'),
      deadline: new Date('2025-04-30'),
    }
  })

  console.log('✅ Created sample project:', project.name)

  // Sample service
  const service = await prisma.service.create({
    data: {
      name: 'Custom Web Application',
      description: 'Full-stack web application development with modern technologies',
      category: 'web-development',
      priceType: 'project-based',
      minPrice: 10000,
      maxPrice: 100000,
      features: JSON.stringify([
        'Custom design and UI/UX',
        'Responsive layout for all devices',
        'Database integration',
        'API development',
        'Authentication system',
        'Admin dashboard',
        'Performance optimization',
        '3 months support'
      ]),
      deliverables: JSON.stringify([
        'Source code repository',
        'Deployment on your server',
        'Documentation',
        'Training session'
      ]),
      duration: '4-12 weeks',
      isActive: true,
      isPopular: true,
      icon: '💻',
      color: '#3B82F6',
      tags: JSON.stringify(['web', 'custom', 'full-stack'])
    }
  })

  console.log('✅ Created sample service:', service.name)

  console.log('\n🎉 Database seed completed successfully!')
  console.log('\n📝 Admin Credentials:')
  console.log('   Email: microailabs@gmail.com')
  console.log('   Password: 1Billion7991.')
  console.log('   Login at: http://localhost:3000/admin/login')
  console.log('\n👤 Client Portal Credentials:')
  console.log('   Email: chiefclient@microaisystems.com')
  console.log('   Password: 1Billion7991.')
  console.log('   Login at: http://localhost:3000/client/login')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
