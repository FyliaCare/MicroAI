import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// AI-powered project analysis and quote generation
async function analyzeProjectAndGenerateQuote(readmeContent: string, clientInfo: any) {
  // Extract project insights from README
  const analysis = await analyzeReadmeContent(readmeContent)
  
  // Generate intelligent pricing based on project complexity
  const pricing = await generateIntelligentPricing(analysis)
  
  // Create comprehensive quote structure
  const quote = {
    title: analysis.projectName || 'Custom Software Development Project',
    executiveSummary: analysis.executiveSummary,
    projectType: analysis.projectType,
    description: analysis.description,
    
    // Objectives extracted from README
    objectives: analysis.objectives,
    
    // Scope of Work
    scopeItems: analysis.scopeItems,
    deliverables: analysis.deliverables,
    exclusions: analysis.exclusions,
    assumptions: analysis.assumptions,
    
    // Timeline
    estimatedDuration: analysis.estimatedDuration,
    timeline: analysis.timelineDescription,
    milestones: analysis.milestones,
    
    // Intelligent Pricing
    lineItems: pricing.lineItems,
    subtotal: pricing.subtotal,
    tax: pricing.tax,
    taxRate: pricing.taxRate,
    total: pricing.total,
    
    // Payment Terms
    depositPercentage: 30, // Industry standard
    paymentSchedule: pricing.paymentSchedule,
    paymentTermsText: 'Payment is due according to the schedule outlined. Late payments may incur a 5% monthly fee.',
    
    // Support & Maintenance
    supportPeriod: '90 days post-launch',
    maintenanceIncluded: true,
    revisionsIncluded: 3,
    
    // Terms
    confidentiality: 'All project information, code, and business details shared during this engagement will remain strictly confidential.',
    intellectualProperty: 'Upon final payment, all intellectual property rights for custom-developed code will be transferred to the client. Third-party libraries and frameworks retain their original licenses.',
    termsAndConditions: 'This quote is valid for 30 days. Scope changes may result in revised pricing. Work begins upon receipt of signed quote and initial deposit.',
    
    // Client Info
    clientName: clientInfo.clientName || '',
    clientEmail: clientInfo.clientEmail || '',
    clientCompany: clientInfo.clientCompany || '',
    clientPhone: clientInfo.clientPhone || '',
    
    // Metadata
    currency: 'USD',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  }
  
  return quote
}

// Intelligent README content analysis
async function analyzeReadmeContent(content: string) {
  const lines = content.split('\n')
  const headings = lines.filter(line => line.trim().startsWith('#'))
  
  // Extract project name (usually first H1)
  const projectName = headings.find(h => h.startsWith('# '))?.replace('# ', '').trim() || 'Software Development Project'
  
  // Analyze project type
  const projectType = detectProjectType(content)
  
  // Extract description
  const description = extractDescription(content)
  
  // Generate executive summary
  const executiveSummary = generateExecutiveSummary(projectName, description, projectType)
  
  // Extract features and convert to scope items
  const scopeItems = extractFeatures(content)
  
  // Generate deliverables
  const deliverables = generateDeliverables(projectType, scopeItems)
  
  // Extract or generate objectives
  const objectives = extractObjectives(content)
  
  // Generate exclusions
  const exclusions = generateExclusions(projectType)
  
  // Generate assumptions
  const assumptions = generateAssumptions(projectType)
  
  // Estimate duration based on complexity
  const complexity = calculateComplexity(content, scopeItems)
  const estimatedDuration = estimateDuration(complexity)
  
  // Generate timeline description
  const timelineDescription = generateTimelineDescription(complexity, estimatedDuration)
  
  // Generate milestones
  const milestones = generateMilestones(projectType, complexity)
  
  return {
    projectName,
    projectType,
    description,
    executiveSummary,
    scopeItems,
    deliverables,
    objectives,
    exclusions,
    assumptions,
    estimatedDuration,
    timelineDescription,
    milestones,
    complexity,
  }
}

// Detect project type from content
function detectProjectType(content: string): string {
  const lower = content.toLowerCase()
  
  if (lower.includes('e-commerce') || lower.includes('ecommerce') || lower.includes('shopping')) {
    return 'e-commerce-platform'
  }
  if (lower.includes('saas') || lower.includes('subscription')) {
    return 'saas-platform'
  }
  if (lower.includes('mobile app') || lower.includes('ios') || lower.includes('android')) {
    return 'mobile-application'
  }
  if (lower.includes('api') || lower.includes('backend') || lower.includes('microservice')) {
    return 'api-development'
  }
  if (lower.includes('dashboard') || lower.includes('admin panel')) {
    return 'dashboard-application'
  }
  if (lower.includes('website') || lower.includes('landing page')) {
    return 'website-development'
  }
  if (lower.includes('crm') || lower.includes('management system')) {
    return 'custom-software'
  }
  
  return 'web-application'
}

// Extract description from README
function extractDescription(content: string): string {
  const lines = content.split('\n')
  let description = ''
  let capturing = false
  
  for (const line of lines) {
    // Start capturing after first heading
    if (line.trim().startsWith('# ')) {
      capturing = true
      continue
    }
    
    // Stop at next major heading
    if (line.trim().startsWith('## ') && description) {
      break
    }
    
    // Capture non-empty lines
    if (capturing && line.trim() && !line.trim().startsWith('#')) {
      description += line.trim() + ' '
      if (description.length > 300) break // Reasonable length
    }
  }
  
  return description.trim() || 'A comprehensive software development project designed to meet specific business requirements.'
}

// Generate executive summary
function generateExecutiveSummary(projectName: string, description: string, projectType: string): string {
  const typeDescriptions: Record<string, string> = {
    'e-commerce-platform': 'a robust e-commerce platform',
    'saas-platform': 'a scalable SaaS solution',
    'mobile-application': 'a native mobile application',
    'api-development': 'a secure API infrastructure',
    'dashboard-application': 'an intuitive dashboard system',
    'website-development': 'a professional website',
    'custom-software': 'custom software',
    'web-application': 'a modern web application',
  }
  
  const typeDesc = typeDescriptions[projectType] || 'a software solution'
  
  return `This proposal outlines the development of ${typeDesc} for ${projectName}. ${description.slice(0, 200)}${description.length > 200 ? '...' : ''} Our team will deliver a production-ready solution with modern architecture, comprehensive testing, and ongoing support to ensure project success.`
}

// Extract features from README
function extractFeatures(content: string): string[] {
  const features: string[] = []
  const lines = content.split('\n')
  let inFeatureSection = false
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Detect feature sections
    if (trimmed.toLowerCase().includes('feature') && trimmed.startsWith('#')) {
      inFeatureSection = true
      continue
    }
    
    // Stop at next major section
    if (trimmed.startsWith('## ') && !trimmed.toLowerCase().includes('feature')) {
      inFeatureSection = false
    }
    
    // Extract list items as features
    if ((inFeatureSection || features.length < 5) && (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ '))) {
      const feature = trimmed.substring(2).trim()
      if (feature && !feature.toLowerCase().includes('coming soon')) {
        features.push(feature)
      }
    }
  }
  
  // If no features found, generate generic ones
  if (features.length === 0) {
    features.push(
      'Custom user interface design and development',
      'Responsive layout for all devices',
      'User authentication and authorization',
      'Database design and implementation',
      'RESTful API development',
      'Admin dashboard with analytics',
      'Security implementation and testing',
      'Performance optimization'
    )
  }
  
  return features.slice(0, 15) // Reasonable limit
}

// Generate deliverables based on project type
function generateDeliverables(projectType: string, scopeItems: string[]): string[] {
  const deliverables = [
    'Fully functional application deployed to production',
    'Source code with comprehensive documentation',
    'Database schema and migration scripts',
    'User documentation and guides',
    'Admin training session (2 hours)',
    'Technical documentation for future maintenance',
    '90-day bug fix warranty',
  ]
  
  // Add type-specific deliverables
  if (projectType.includes('mobile')) {
    deliverables.push('App store deployment assistance', 'Marketing assets (screenshots, descriptions)')
  } else if (projectType.includes('api')) {
    deliverables.push('API documentation (Swagger/OpenAPI)', 'Postman collection for testing')
  } else if (projectType.includes('saas')) {
    deliverables.push('Multi-tenant architecture', 'Subscription management system')
  }
  
  return deliverables
}

// Extract or generate objectives
function extractObjectives(content: string): string[] {
  const objectives: string[] = []
  const lines = content.split('\n')
  let inObjectiveSection = false
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    if (trimmed.toLowerCase().includes('objective') || trimmed.toLowerCase().includes('goal')) {
      inObjectiveSection = true
      continue
    }
    
    if (trimmed.startsWith('## ') && inObjectiveSection) {
      break
    }
    
    if (inObjectiveSection && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
      objectives.push(trimmed.substring(2).trim())
    }
  }
  
  if (objectives.length === 0) {
    objectives.push(
      'Deliver a scalable and maintainable solution',
      'Ensure excellent user experience across all devices',
      'Implement robust security measures',
      'Optimize performance for fast load times',
      'Provide comprehensive documentation and training'
    )
  }
  
  return objectives
}

// Generate exclusions
function generateExclusions(projectType: string): string[] {
  return [
    'Third-party service fees (hosting, domains, APIs)',
    'Content creation (copywriting, images, videos)',
    'Ongoing maintenance beyond warranty period',
    'Marketing and SEO services',
    'Additional features not specified in scope',
    'Server infrastructure costs',
    'SSL certificates and domain registration',
  ]
}

// Generate assumptions
function generateAssumptions(projectType: string): string[] {
  return [
    'Client will provide timely feedback on deliverables',
    'All required content and assets will be provided by client',
    'Client has necessary access to hosting and third-party services',
    'Requirements are clearly defined and changes will follow change request process',
    'Testing will be conducted in client-provided environment',
    'Client will assign a project liaison for communications',
  ]
}

// Calculate project complexity (0-100)
function calculateComplexity(content: string, scopeItems: string[]): number {
  let complexity = 20 // Base complexity
  
  // Length factor
  complexity += Math.min(content.length / 1000, 20)
  
  // Feature count
  complexity += Math.min(scopeItems.length * 2, 30)
  
  // Keyword complexity
  const complexKeywords = ['authentication', 'payment', 'api', 'real-time', 'machine learning', 'ai', 'blockchain', 'microservice', 'integration', 'analytics']
  const lower = content.toLowerCase()
  complexKeywords.forEach(keyword => {
    if (lower.includes(keyword)) complexity += 3
  })
  
  return Math.min(complexity, 100)
}

// Estimate duration based on complexity
function estimateDuration(complexity: number): string {
  if (complexity < 30) return '4-6 weeks'
  if (complexity < 50) return '8-12 weeks'
  if (complexity < 70) return '12-16 weeks'
  return '16-24 weeks'
}

// Generate timeline description
function generateTimelineDescription(complexity: number, duration: string): string {
  return `The project is estimated to take ${duration} from kickoff to production deployment. This timeline includes design, development, testing, and deployment phases. We follow an agile methodology with bi-weekly sprint reviews to ensure alignment with your expectations.`
}

// Generate milestones
function generateMilestones(projectType: string, complexity: number): any[] {
  const milestones = [
    {
      name: 'Project Kickoff & Planning',
      duration: '1 week',
      deliverables: 'Project plan, technical architecture, design mockups',
    },
    {
      name: 'Design & Prototyping',
      duration: '2 weeks',
      deliverables: 'UI/UX designs, interactive prototype, approved design system',
    },
    {
      name: 'Core Development - Phase 1',
      duration: complexity < 50 ? '3 weeks' : '4 weeks',
      deliverables: 'Database setup, authentication, basic functionality',
    },
    {
      name: 'Core Development - Phase 2',
      duration: complexity < 50 ? '3 weeks' : '5 weeks',
      deliverables: 'All major features implemented, admin dashboard',
    },
    {
      name: 'Testing & Quality Assurance',
      duration: '2 weeks',
      deliverables: 'Bug fixes, performance optimization, security audit',
    },
    {
      name: 'Deployment & Training',
      duration: '1 week',
      deliverables: 'Production deployment, user training, documentation',
    },
  ]
  
  return milestones
}

// Generate intelligent pricing based on analysis
async function generateIntelligentPricing(analysis: any) {
  const complexity = analysis.complexity
  const scopeItems = analysis.scopeItems || []
  
  // Base hourly rate for development
  const hourlyRate = 85 // Industry standard for mid-level development
  
  // Estimate hours based on complexity and scope
  let totalHours = 0
  
  // Planning & Design (15% of total)
  const planningHours = Math.max(40, complexity * 0.8)
  totalHours += planningHours
  
  // Development (50% of total)
  const developmentHours = Math.max(120, complexity * 3 + scopeItems.length * 8)
  totalHours += developmentHours
  
  // Testing & QA (20% of total)
  const testingHours = Math.max(40, complexity * 1.2)
  totalHours += testingHours
  
  // Deployment & Training (15% of total)
  const deploymentHours = Math.max(20, complexity * 0.6)
  totalHours += deploymentHours
  
  // Create line items with industry-standard breakdown
  const lineItems = [
    {
      name: 'Project Planning & Architecture',
      description: 'Requirements analysis, technical architecture design, project planning, and design mockups',
      quantity: Math.round(planningHours),
      unitPrice: hourlyRate,
      details: 'Includes stakeholder meetings, wireframes, and technical specifications',
    },
    {
      name: 'Frontend Development',
      description: 'User interface development with modern frameworks, responsive design, and accessibility',
      quantity: Math.round(developmentHours * 0.4),
      unitPrice: hourlyRate,
      details: 'React/Next.js development with Tailwind CSS',
    },
    {
      name: 'Backend Development',
      description: 'Server-side logic, database design, API development, and integrations',
      quantity: Math.round(developmentHours * 0.4),
      unitPrice: hourlyRate,
      details: 'RESTful APIs, authentication, data processing',
    },
    {
      name: 'Database Design & Implementation',
      description: 'Schema design, optimization, migrations, and data modeling',
      quantity: Math.round(developmentHours * 0.2),
      unitPrice: hourlyRate,
      details: 'PostgreSQL/MongoDB with Prisma ORM',
    },
    {
      name: 'Testing & Quality Assurance',
      description: 'Unit testing, integration testing, performance testing, and security audit',
      quantity: Math.round(testingHours),
      unitPrice: hourlyRate,
      details: 'Automated tests, manual QA, bug fixes',
    },
    {
      name: 'Deployment & DevOps',
      description: 'Production deployment, CI/CD setup, monitoring, and infrastructure configuration',
      quantity: Math.round(deploymentHours * 0.6),
      unitPrice: hourlyRate,
      details: 'Cloud deployment with automated pipelines',
    },
    {
      name: 'Documentation & Training',
      description: 'Technical documentation, user guides, and admin training sessions',
      quantity: Math.round(deploymentHours * 0.4),
      unitPrice: hourlyRate,
      details: 'Comprehensive docs and 2-hour training',
    },
  ]
  
  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const taxRate = 0 // Can be adjusted based on location
  const tax = subtotal * taxRate
  const total = subtotal + tax
  
  // Generate payment schedule (industry standard)
  const paymentSchedule = [
    {
      phase: 'Deposit',
      description: 'Project kickoff and planning phase',
      amount: Math.round(total * 0.30), // 30% upfront
      dueDate: 'Upon contract signing',
    },
    {
      phase: 'Milestone 1',
      description: 'Design approval and development start',
      amount: Math.round(total * 0.25), // 25% after design
      dueDate: 'Upon design approval',
    },
    {
      phase: 'Milestone 2',
      description: 'Core functionality complete',
      amount: Math.round(total * 0.25), // 25% mid-development
      dueDate: 'Upon Phase 1 completion',
    },
    {
      phase: 'Final Payment',
      description: 'Testing complete and production deployment',
      amount: Math.round(total * 0.20), // 20% on delivery
      dueDate: 'Upon final delivery',
    },
  ]
  
  return {
    lineItems,
    subtotal,
    tax,
    taxRate,
    total,
    paymentSchedule,
    estimatedHours: Math.round(totalHours),
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 AI Generate - Session Details:', {
      hasSession: !!session,
      session: session ? {
        user: session.user,
        expires: session.expires
      } : null
    })
    
    if (!session || !session.user?.role || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
      console.error('❌ Unauthorized access attempt:', { 
        hasSession: !!session,
        hasUser: !!session?.user,
        role: session?.user?.role,
        email: session?.user?.email
      })
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    console.log('✅ Authorization successful for:', session.user.email)
    
    const body = await request.json()
    const { readmeContent, clientInfo } = body
    
    console.log('AI Quote Generation Request:', {
      hasReadme: !!readmeContent,
      readmeLength: readmeContent?.length,
      hasClientInfo: !!clientInfo,
    })
    
    if (!readmeContent) {
      return NextResponse.json(
        { error: 'README content is required' },
        { status: 400 }
      )
    }
    
    // Generate intelligent quote
    console.log('Starting quote generation...')
    const quote = await analyzeProjectAndGenerateQuote(readmeContent, clientInfo || {})
    console.log('Quote generated successfully')
    
    return NextResponse.json({
      success: true,
      quote,
    })
    
  } catch (error: any) {
    console.error('AI quote generation error:', {
      message: error.message,
      stack: error.stack,
      error
    })
    return NextResponse.json(
      { 
        error: 'Failed to generate quote',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
