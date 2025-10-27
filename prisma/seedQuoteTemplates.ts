import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedQuoteTemplates() {
  console.log('🎯 Seeding quote templates...')

  // 1. Basic Website Template
  await prisma.quoteTemplate.upsert({
    where: { id: 'basic-website-template' },
    update: {},
    create: {
      id: 'basic-website-template',
      name: 'Basic Website',
      category: 'basic-website',
      description: 'Professional landing page with contact form - perfect for small businesses and freelancers',
      setupFee: 200,
      developmentCost: 0,
      designCost: 0,
      monthlyHosting: 30,
      monthlyMaintenance: 0,
      estimatedHours: 16,
      timeline: '1-2 weeks',
      techStack: JSON.stringify(['Next.js', 'React', 'Tailwind CSS', 'Vercel', 'Resend']),
      features: JSON.stringify([
        'Custom responsive design',
        'Up to 5 pages (Home, About, Services, Portfolio, Contact)',
        'Contact form with email notifications',
        'SEO optimization',
        'Mobile-friendly design',
        'Fast loading speeds',
        'SSL certificate included',
        'Social media integration'
      ]),
      deliverables: JSON.stringify([
        'Fully functional website',
        'Custom domain setup',
        'Contact form integration',
        'Google Analytics setup',
        'Basic SEO configuration',
        'Source code repository',
        '30 days of support'
      ]),
      hostingBreakdown: JSON.stringify({
        'Vercel Hosting': { cost: 15, charge: 20, profit: 5 },
        'Resend Email': { cost: 10, charge: 10, profit: 0 },
        'Domain (yearly)': { cost: 1.25, charge: 3, profit: 1.75 }
      }),
      milestones: JSON.stringify([
        { name: 'Project Start', percentage: 50, amount: 100, due: 'Upon acceptance' },
        { name: 'Completion & Launch', percentage: 50, amount: 100, due: 'Upon delivery' }
      ]),
      actualCosts: JSON.stringify({
        monthly: {
          'Vercel': 15,
          'Resend': 10,
          'Domain (amortized)': 1.25,
          total: 26.25
        },
        setup: {
          'Development Time (16 hrs × $0)': 0,
          total: 0
        }
      }),
      profitMargin: 100,
      sortOrder: 1
    }
  })

  // 2. Business Website with Database
  await prisma.quoteTemplate.upsert({
    where: { id: 'business-website-template' },
    update: {},
    create: {
      id: 'business-website-template',
      name: 'Business Website with Admin Panel',
      category: 'business-website',
      description: 'Full-featured business website with content management and admin dashboard',
      setupFee: 600,
      developmentCost: 0,
      designCost: 0,
      monthlyHosting: 80,
      monthlyMaintenance: 0,
      estimatedHours: 48,
      timeline: '3-4 weeks',
      techStack: JSON.stringify(['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Render', 'Neon', 'Resend']),
      features: JSON.stringify([
        'Custom professional design',
        'Up to 10 pages',
        'Admin dashboard for content management',
        'Database-driven content',
        'Blog/news section',
        'Contact form with CRM integration',
        'Advanced SEO optimization',
        'Analytics dashboard',
        'User authentication',
        'Email automation',
        'Mobile & tablet optimized',
        'Performance optimization'
      ]),
      deliverables: JSON.stringify([
        'Complete website with admin panel',
        'Database setup and configuration',
        'Content management system',
        'Custom domain and SSL',
        'Email integration',
        'Analytics setup (Google Analytics)',
        'SEO configuration',
        'Training session (1 hour)',
        'Source code repository',
        'Documentation',
        '60 days of support'
      ]),
      hostingBreakdown: JSON.stringify({
        'Render Hosting': { cost: 20, charge: 40, profit: 20 },
        'Neon Database': { cost: 5, charge: 15, profit: 10 },
        'Resend Email': { cost: 10, charge: 25, profit: 15 },
        'Domain (yearly)': { cost: 1.25, charge: 3, profit: 1.75 }
      }),
      milestones: JSON.stringify([
        { name: 'Project Start & Design', percentage: 30, amount: 180, due: 'Upon acceptance' },
        { name: 'Development Phase', percentage: 40, amount: 240, due: 'At 50% completion' },
        { name: 'Launch & Training', percentage: 30, amount: 180, due: 'Upon delivery' }
      ]),
      actualCosts: JSON.stringify({
        monthly: {
          'Render': 20,
          'Neon': 5,
          'Resend': 10,
          'Domain (amortized)': 1.25,
          total: 36.25
        },
        setup: {
          'Development Time (48 hrs × $0)': 0,
          total: 0
        }
      }),
      profitMargin: 120,
      sortOrder: 2
    }
  })

  // 3. Web App / Dashboard / Portal
  await prisma.quoteTemplate.upsert({
    where: { id: 'web-app-template' },
    update: {},
    create: {
      id: 'web-app-template',
      name: 'Web Application / Dashboard',
      category: 'web-app',
      description: 'Interactive web application with user management, dashboards, and real-time features',
      setupFee: 1200,
      developmentCost: 0,
      designCost: 0,
      monthlyHosting: 120,
      monthlyMaintenance: 0,
      estimatedHours: 96,
      timeline: '6-8 weeks',
      techStack: JSON.stringify(['Next.js 14', 'TypeScript', 'React', 'Tailwind CSS', 'Prisma ORM', 'PostgreSQL', 'NextAuth.js', 'Render', 'Neon', 'Resend']),
      features: JSON.stringify([
        'Custom web application architecture',
        'User authentication & authorization',
        'Role-based access control',
        'Interactive dashboards with charts',
        'Real-time data updates',
        'Advanced data tables & filters',
        'CRUD operations for all entities',
        'API endpoints',
        'File uploads',
        'Email notifications',
        'Activity logging',
        'Advanced search & filtering',
        'Export functionality (CSV, PDF)',
        'Mobile responsive design',
        'Admin panel',
        'User management system'
      ]),
      deliverables: JSON.stringify([
        'Fully functional web application',
        'User authentication system',
        'Admin dashboard',
        'Database with all relationships',
        'RESTful API',
        'Email notification system',
        'Custom domain & SSL',
        'Database backups setup',
        'Analytics integration',
        'Training session (2 hours)',
        'Complete documentation',
        'API documentation',
        'Source code repository',
        '90 days of support'
      ]),
      hostingBreakdown: JSON.stringify({
        'Render Hosting': { cost: 35, charge: 70, profit: 35 },
        'Neon Database': { cost: 10, charge: 25, profit: 15 },
        'Resend Email': { cost: 15, charge: 25, profit: 10 },
        'Domain (yearly)': { cost: 1.25, charge: 3, profit: 1.75 }
      }),
      milestones: JSON.stringify([
        { name: 'Project Kickoff & Planning', percentage: 20, amount: 240, due: 'Upon acceptance' },
        { name: 'Core Development', percentage: 30, amount: 360, due: 'Week 3' },
        { name: 'Feature Development', percentage: 30, amount: 360, due: 'Week 5' },
        { name: 'Testing & Launch', percentage: 20, amount: 240, due: 'Upon delivery' }
      ]),
      actualCosts: JSON.stringify({
        monthly: {
          'Render': 35,
          'Neon': 10,
          'Resend': 15,
          'Domain (amortized)': 1.25,
          total: 61.25
        },
        setup: {
          'Development Time (96 hrs × $0)': 0,
          total: 0
        }
      }),
      profitMargin: 95,
      sortOrder: 3
    }
  })

  // 4. E-commerce / SaaS Platform
  await prisma.quoteTemplate.upsert({
    where: { id: 'ecommerce-template' },
    update: {},
    create: {
      id: 'ecommerce-template',
      name: 'E-commerce / SaaS Platform',
      category: 'ecommerce',
      description: 'Full-stack e-commerce or SaaS platform with payment integration, subscriptions, and advanced features',
      setupFee: 2000,
      developmentCost: 0,
      designCost: 0,
      monthlyHosting: 180,
      monthlyMaintenance: 50,
      estimatedHours: 160,
      timeline: '10-12 weeks',
      techStack: JSON.stringify(['Next.js 14', 'TypeScript', 'React', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Stripe', 'NextAuth.js', 'Render', 'Neon', 'Resend', 'AWS S3']),
      features: JSON.stringify([
        'Custom e-commerce/SaaS architecture',
        'Product/service catalog management',
        'Shopping cart & checkout',
        'Stripe payment integration',
        'Subscription management',
        'User accounts & profiles',
        'Order management system',
        'Inventory tracking',
        'Analytics & reporting',
        'Email automation',
        'Customer dashboard',
        'Admin panel',
        'Multi-tier pricing plans',
        'Discount codes & promotions',
        'Automated invoicing',
        'Transaction history',
        'Search & filtering',
        'Reviews & ratings',
        'Wishlist functionality',
        'Mobile app-ready API',
        'Advanced security',
        'PCI compliance ready'
      ]),
      deliverables: JSON.stringify([
        'Complete e-commerce/SaaS platform',
        'Payment gateway integration (Stripe)',
        'User authentication & management',
        'Product/service management system',
        'Order processing system',
        'Admin dashboard',
        'Customer portal',
        'Email notification system',
        'Analytics dashboard',
        'Database with backups',
        'Custom domain & SSL',
        'CDN setup for assets',
        'Security audit',
        'Training session (4 hours)',
        'Complete documentation',
        'API documentation',
        'Source code repository',
        '6 months of support'
      ]),
      hostingBreakdown: JSON.stringify({
        'Render Hosting': { cost: 50, charge: 100, profit: 50 },
        'Neon Database': { cost: 20, charge: 40, profit: 20 },
        'Resend Email': { cost: 20, charge: 40, profit: 20 },
        'AWS S3 Storage': { cost: 10, charge: 20, profit: 10 },
        'Domain (yearly)': { cost: 1.25, charge: 3, profit: 1.75 }
      }),
      milestones: JSON.stringify([
        { name: 'Discovery & Architecture', percentage: 15, amount: 300, due: 'Upon acceptance' },
        { name: 'Core Platform Development', percentage: 25, amount: 500, due: 'Week 3' },
        { name: 'Payment Integration', percentage: 20, amount: 400, due: 'Week 6' },
        { name: 'Feature Completion', percentage: 25, amount: 500, due: 'Week 9' },
        { name: 'Testing & Launch', percentage: 15, amount: 300, due: 'Upon delivery' }
      ]),
      actualCosts: JSON.stringify({
        monthly: {
          'Render': 50,
          'Neon': 20,
          'Resend': 20,
          'AWS S3': 10,
          'Stripe fees': '2.9% + $0.30 per transaction',
          'Domain (amortized)': 1.25,
          total: 101.25
        },
        setup: {
          'Development Time (160 hrs × $0)': 0,
          'Stripe setup': 0,
          total: 0
        }
      }),
      profitMargin: 75,
      sortOrder: 4
    }
  })

  console.log('✅ Quote templates seeded successfully!')
}

async function main() {
  await seedQuoteTemplates()
}

main()
  .catch((e) => {
    console.error('Error seeding quote templates:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
