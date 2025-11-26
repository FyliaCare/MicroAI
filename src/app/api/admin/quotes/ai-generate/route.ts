import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  extractDescriptionAdvanced,
  generateExecutiveSummaryAdvanced,
  extractFeaturesAdvanced,
  generateDeliverablesAdvanced,
  extractObjectivesAdvanced,
  generateExclusionsAdvanced,
  generateAssumptionsAdvanced,
  calculateComplexityAdvanced,
  estimateDurationAdvanced,
  analyzeProjectRisks,
  generateTimelineDescriptionAdvanced,
  generateMilestonesAdvanced,
} from '@/lib/advancedAIAnalysis'

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

// Advanced AI-powered README analysis with deep learning patterns
async function analyzeReadmeContent(content: string) {
  const lines = content.split('\n')
  const headings = lines.filter(line => line.trim().startsWith('#'))
  
  // Advanced project name extraction with context awareness
  const projectName = extractProjectNameIntelligent(content, headings)
  
  // Deep analysis of project type with ML-style pattern matching
  const projectType = detectProjectTypeAdvanced(content)
  
  // Extract tech stack for better accuracy
  const techStack = extractTechStack(content)
  
  // Multi-layer description extraction
  const description = extractDescriptionAdvanced(content, lines)
  
  // Generate executive summary with industry insights
  const executiveSummary = generateExecutiveSummaryAdvanced(projectName, description, projectType, techStack)
  
  // Advanced feature extraction with NLP-style analysis
  const scopeItems = extractFeaturesAdvanced(content, projectType)
  
  // Intelligent deliverables based on project complexity
  const deliverables = generateDeliverablesAdvanced(projectType, scopeItems, techStack)
  
  // Extract or generate strategic objectives
  const objectives = extractObjectivesAdvanced(content, projectType)
  
  // Context-aware exclusions
  const exclusions = generateExclusionsAdvanced(projectType, scopeItems)
  
  // Industry-standard assumptions
  const assumptions = generateAssumptionsAdvanced(projectType, techStack)
  
  // Multi-factor complexity calculation
  const complexity = calculateComplexityAdvanced(content, scopeItems, techStack)
  
  // Data-driven duration estimation
  const estimatedDuration = estimateDurationAdvanced(complexity, projectType, scopeItems.length)
  
  // Detailed timeline with industry benchmarks
  const timelineDescription = generateTimelineDescriptionAdvanced(complexity, estimatedDuration, projectType)
  
  // Strategic milestones with best practices
  const milestones = generateMilestonesAdvanced(projectType, complexity, estimatedDuration)
  
  // Extract risks and mitigation strategies
  const risks = analyzeProjectRisks(content, projectType, complexity)
  
  console.log('📊 Analysis Complete:', {
    projectType,
    complexity,
    featureCount: scopeItems.length,
    techStackCount: techStack.length,
    estimatedDuration,
  })
  
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
    techStack,
    risks,
  }
}

// Intelligent project name extraction with multiple strategies
function extractProjectNameIntelligent(content: string, headings: string[]): string {
  // Strategy 1: Look for "title" or "name" metadata
  const titleMatch = content.match(/(?:title|name|project):\s*["']?([^"'\n]+)["']?/i)
  if (titleMatch) return titleMatch[1].trim()
  
  // Strategy 2: First H1 heading
  const h1 = headings.find(h => h.startsWith('# '))?.replace('# ', '').trim()
  if (h1 && h1.length < 100) return h1
  
  // Strategy 3: Package.json name pattern
  const packageMatch = content.match(/"name":\s*"([^"]+)"/i)
  if (packageMatch) {
    const name = packageMatch[1].replace(/-/g, ' ').replace(/_/g, ' ')
    return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
  
  // Strategy 4: Look for capitalized phrases in first 500 chars
  const intro = content.substring(0, 500)
  const capMatch = intro.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})/g)
  if (capMatch && capMatch.length > 0) {
    return capMatch[0]
  }
  
  return 'Advanced Software Development Project'
}

// Advanced project type detection with machine learning patterns
function detectProjectTypeAdvanced(content: string): string {
  const lower = content.toLowerCase()
  const scores: Record<string, number> = {
    'e-commerce-platform': 0,
    'saas-platform': 0,
    'mobile-application': 0,
    'api-development': 0,
    'dashboard-application': 0,
    'website-development': 0,
    'custom-software': 0,
    'web-application': 0,
    'fintech-application': 0,
    'healthcare-system': 0,
    'ai-ml-platform': 0,
    'blockchain-dapp': 0,
  }
  
  // E-commerce indicators
  const ecommerceKeywords = ['e-commerce', 'ecommerce', 'shopping', 'cart', 'checkout', 'payment', 'stripe', 'paypal', 'product catalog', 'inventory', 'order']
  scores['e-commerce-platform'] = ecommerceKeywords.filter(k => lower.includes(k)).length * 10
  
  // SaaS indicators
  const saasKeywords = ['saas', 'subscription', 'multi-tenant', 'tenant', 'billing', 'pricing tier', 'plan', 'usage-based', 'metered']
  scores['saas-platform'] = saasKeywords.filter(k => lower.includes(k)).length * 10
  
  // Mobile indicators
  const mobileKeywords = ['mobile app', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'app store', 'play store']
  scores['mobile-application'] = mobileKeywords.filter(k => lower.includes(k)).length * 10
  
  // API indicators  
  const apiKeywords = ['api', 'rest', 'graphql', 'microservice', 'endpoint', 'webhook', 'integration', 'backend']
  scores['api-development'] = apiKeywords.filter(k => lower.includes(k)).length * 8
  
  // Dashboard indicators
  const dashboardKeywords = ['dashboard', 'admin panel', 'analytics', 'metrics', 'reporting', 'visualization', 'chart', 'graph']
  scores['dashboard-application'] = dashboardKeywords.filter(k => lower.includes(k)).length * 9
  
  // Website indicators
  const websiteKeywords = ['website', 'landing page', 'portfolio', 'blog', 'cms', 'wordpress', 'static site']
  scores['website-development'] = websiteKeywords.filter(k => lower.includes(k)).length * 7
  
  // CRM/Custom software indicators
  const crmKeywords = ['crm', 'management system', 'erp', 'enterprise', 'workflow', 'automation']
  scores['custom-software'] = crmKeywords.filter(k => lower.includes(k)).length * 9
  
  // Fintech indicators
  const fintechKeywords = ['fintech', 'banking', 'finance', 'trading', 'wallet', 'cryptocurrency', 'ledger', 'transaction']
  scores['fintech-application'] = fintechKeywords.filter(k => lower.includes(k)).length * 12
  
  // Healthcare indicators
  const healthcareKeywords = ['healthcare', 'medical', 'patient', 'ehr', 'emr', 'telemedicine', 'hipaa', 'health']
  scores['healthcare-system'] = healthcareKeywords.filter(k => lower.includes(k)).length * 12
  
  // AI/ML indicators
  const aiKeywords = ['ai', 'machine learning', 'ml', 'neural network', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch']
  scores['ai-ml-platform'] = aiKeywords.filter(k => lower.includes(k)).length * 15
  
  // Blockchain indicators
  const blockchainKeywords = ['blockchain', 'smart contract', 'web3', 'ethereum', 'solidity', 'dapp', 'nft', 'defi']
  scores['blockchain-dapp'] = blockchainKeywords.filter(k => lower.includes(k)).length * 15
  
  // Find highest score
  let maxScore = 0
  let detectedType = 'web-application'
  
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      detectedType = type
    }
  }
  
  return detectedType
}

// Extract technology stack with pattern matching
function extractTechStack(content: string): string[] {
  const tech: Set<string> = new Set()
  const lower = content.toLowerCase()
  
  // Frontend frameworks
  if (lower.includes('react')) tech.add('React')
  if (lower.includes('vue')) tech.add('Vue.js')
  if (lower.includes('angular')) tech.add('Angular')
  if (lower.includes('next.js') || lower.includes('nextjs')) tech.add('Next.js')
  if (lower.includes('svelte')) tech.add('Svelte')
  
  // Backend frameworks
  if (lower.includes('node.js') || lower.includes('nodejs') || lower.includes('express')) tech.add('Node.js')
  if (lower.includes('django')) tech.add('Django')
  if (lower.includes('flask')) tech.add('Flask')
  if (lower.includes('spring') || lower.includes('java')) tech.add('Spring Boot')
  if (lower.includes('laravel') || lower.includes('php')) tech.add('Laravel')
  if (lower.includes('ruby on rails') || lower.includes('rails')) tech.add('Ruby on Rails')
  if (lower.includes('.net') || lower.includes('asp.net') || lower.includes('c#')) tech.add('.NET')
  
  // Databases
  if (lower.includes('postgresql') || lower.includes('postgres')) tech.add('PostgreSQL')
  if (lower.includes('mysql')) tech.add('MySQL')
  if (lower.includes('mongodb')) tech.add('MongoDB')
  if (lower.includes('redis')) tech.add('Redis')
  if (lower.includes('elasticsearch')) tech.add('Elasticsearch')
  
  // Cloud/DevOps
  if (lower.includes('aws') || lower.includes('amazon web services')) tech.add('AWS')
  if (lower.includes('azure')) tech.add('Azure')
  if (lower.includes('gcp') || lower.includes('google cloud')) tech.add('Google Cloud')
  if (lower.includes('docker')) tech.add('Docker')
  if (lower.includes('kubernetes') || lower.includes('k8s')) tech.add('Kubernetes')
  
  // Mobile
  if (lower.includes('react native')) tech.add('React Native')
  if (lower.includes('flutter')) tech.add('Flutter')
  if (lower.includes('swift')) tech.add('Swift')
  if (lower.includes('kotlin')) tech.add('Kotlin')
  
  return Array.from(tech)
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

// Advanced intelligent pricing based on industry research and benchmarks
async function generateIntelligentPricing(analysis: any) {
  const complexity = analysis.complexity
  const scopeItems = analysis.scopeItems || []
  const projectType = analysis.projectType
  const techStack = analysis.techStack || []
  
  // Dynamic hourly rate based on project type and complexity (industry research 2024-2025)
  const baseRates: Record<string, number> = {
    'website-development': 75,
    'web-application': 85,
    'mobile-application': 95,
    'e-commerce-platform': 90,
    'saas-platform': 95,
    'api-development': 85,
    'dashboard-application': 85,
    'custom-software': 90,
    'fintech-application': 120, // Requires specialized knowledge
    'healthcare-system': 115, // HIPAA compliance expertise
    'ai-ml-platform': 130, // Specialized AI/ML skills
    'blockchain-dapp': 125, // Blockchain expertise
  }
  
  let hourlyRate = baseRates[projectType] || 85
  
  // Complexity adjustment (0-100 scale affects rate ±20%)
  const complexityMultiplier = 1 + ((complexity - 50) / 250) // -0.2 to +0.2
  hourlyRate = Math.round(hourlyRate * complexityMultiplier)
  
  // Tech stack premium (modern/specialized tech costs more)
  const premiumTech = ['Next.js', 'React Native', 'Flutter', 'Kubernetes', 'AWS', 'Azure', 'TensorFlow', 'PyTorch']
  const techPremium = techStack.filter((t: string) => premiumTech.includes(t)).length * 3
  hourlyRate += techPremium
  
  console.log('💰 Pricing Calculation:', { projectType, baseRate: baseRates[projectType], complexity, finalRate: hourlyRate })
  
  // Estimate hours using industry benchmarks
  let totalHours = 0
  
  // Planning & Architecture (12-15% based on research)
  const planningHours = Math.max(40, Math.round(complexity * 0.9 + scopeItems.length * 2))
  totalHours += planningHours
  
  // Frontend Development (25-30%)
  const frontendHours = Math.max(80, Math.round(complexity * 1.8 + scopeItems.length * 4))
  totalHours += frontendHours
  
  // Backend Development (30-35%)
  const backendHours = Math.max(100, Math.round(complexity * 2.2 + scopeItems.length * 5))
  totalHours += backendHours
  
  // Database (8-12%)
  const databaseHours = Math.max(30, Math.round(complexity * 0.7 + scopeItems.length * 1.5))
  totalHours += databaseHours
  
  // Testing & QA (15-20%)
  const testingHours = Math.max(50, Math.round(complexity * 1.3 + scopeItems.length * 2))
  totalHours += testingHours
  
  // DevOps & Deployment (8-10%)
  const devopsHours = Math.max(30, Math.round(complexity * 0.8 + (techStack.includes('Kubernetes') ? 20 : 10)))
  totalHours += devopsHours
  
  // Documentation & Training (5-8%)
  const docsHours = Math.max(20, Math.round(complexity * 0.5 + 15))
  totalHours += docsHours
  
  // Project-specific adjustments
  if (projectType === 'e-commerce-platform') {
    totalHours += 40 // Payment gateway integration, product management
  }
  if (projectType === 'mobile-application') {
    totalHours += 60 // iOS + Android, app store submissions
  }
  if (projectType === 'fintech-application' || projectType === 'healthcare-system') {
    totalHours += 80 // Compliance, security audits, certifications
  }
  if (projectType === 'ai-ml-platform') {
    totalHours += 100 // Model training, data pipelines, ML infrastructure
  }
  
  console.log('⏱️ Time Estimation:', { totalHours, breakdown: {
    planning: planningHours,
    frontend: frontendHours,
    backend: backendHours,
    database: databaseHours,
    testing: testingHours,
    devops: devopsHours,
    docs: docsHours
  }})
  
  // Create detailed line items with industry-standard breakdown
  const lineItems = [
    {
      name: 'Project Planning & Architecture Design',
      description: 'Requirements analysis, stakeholder workshops, technical architecture blueprint, database schema design, UI/UX wireframes, and project roadmap',
      quantity: planningHours,
      unitPrice: hourlyRate,
      details: `${planningHours}hrs × $${hourlyRate}/hr | Includes: Requirements doc, architecture diagrams, design mockups`,
    },
    {
      name: 'Frontend Development',
      description: 'Modern responsive UI development, component library, state management, API integration, and cross-browser compatibility',
      quantity: frontendHours,
      unitPrice: hourlyRate,
      details: `${frontendHours}hrs × $${hourlyRate}/hr | Tech: ${techStack.filter((t: string) => ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte'].includes(t)).join(', ') || 'Modern framework'}`,
    },
    {
      name: 'Backend API Development',
      description: 'RESTful/GraphQL APIs, business logic implementation, third-party integrations, authentication/authorization, and data processing',
      quantity: backendHours,
      unitPrice: hourlyRate,
      details: `${backendHours}hrs × $${hourlyRate}/hr | Tech: ${techStack.filter((t: string) => ['Node.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', '.NET'].includes(t)).join(', ') || 'Backend framework'}`,
    },
    {
      name: 'Database Design & Optimization',
      description: 'Schema design, indexing strategy, query optimization, data migrations, backup procedures, and performance tuning',
      quantity: databaseHours,
      unitPrice: hourlyRate,
      details: `${databaseHours}hrs × $${hourlyRate}/hr | Tech: ${techStack.filter((t: string) => ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'].includes(t)).join(', ') || 'Database system'}`,
    },
    {
      name: 'Testing & Quality Assurance',
      description: 'Unit testing (80%+ coverage), integration testing, end-to-end testing, security vulnerability scanning, performance testing, and bug resolution',
      quantity: testingHours,
      unitPrice: hourlyRate,
      details: `${testingHours}hrs × $${hourlyRate}/hr | Includes: Automated test suite, manual QA, security audit`,
    },
    {
      name: 'DevOps & Cloud Deployment',
      description: 'CI/CD pipeline setup, containerization, cloud infrastructure provisioning, monitoring configuration, and production deployment',
      quantity: devopsHours,
      unitPrice: hourlyRate,
      details: `${devopsHours}hrs × $${hourlyRate}/hr | Platform: ${techStack.filter((t: string) => ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'].includes(t)).join(', ') || 'Cloud platform'}`,
    },
    {
      name: 'Documentation & Knowledge Transfer',
      description: 'Technical documentation, API documentation, user guides, admin manuals, video tutorials, and team training sessions',
      quantity: docsHours,
      unitPrice: hourlyRate,
      details: `${docsHours}hrs × $${hourlyRate}/hr | Deliverables: Full documentation suite + 3x 2-hour training sessions`,
    },
  ]
  
  // Add project-specific line items
  if (projectType === 'e-commerce-platform') {
    lineItems.push({
      name: 'E-commerce Integration',
      description: 'Payment gateway integration (Stripe/PayPal), inventory management, order processing, and shipping API integration',
      quantity: 40,
      unitPrice: hourlyRate,
      details: '40hrs × $' + hourlyRate + '/hr | Payment gateway + shipping integration',
    })
  }
  
  if (projectType === 'mobile-application') {
    lineItems.push({
      name: 'Mobile App Development & Deployment',
      description: 'iOS and Android native builds, app store optimization, submission and review process, push notifications setup',
      quantity: 60,
      unitPrice: hourlyRate,
      details: '60hrs × $' + hourlyRate + '/hr | iOS + Android + App Store submissions',
    })
  }
  
  if (projectType === 'fintech-application' || projectType === 'healthcare-system') {
    lineItems.push({
      name: 'Compliance & Security Audit',
      description: `${projectType === 'fintech-application' ? 'PCI-DSS' : 'HIPAA'} compliance implementation, security penetration testing, encryption protocols, and certification documentation`,
      quantity: 80,
      unitPrice: hourlyRate + 20, // Premium for compliance expertise
      details: '80hrs × $' + (hourlyRate + 20) + '/hr | Compliance + security certification',
    })
  }
  
  if (projectType === 'ai-ml-platform') {
    lineItems.push({
      name: 'AI/ML Model Development',
      description: 'Data preprocessing pipeline, model training and optimization, model deployment infrastructure, and A/B testing framework',
      quantity: 100,
      unitPrice: hourlyRate + 30, // Premium for ML expertise
      details: '100hrs × $' + (hourlyRate + 30) + '/hr | ML pipeline + model optimization',
    })
  }
  
  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const taxRate = 0 // Adjust based on location/requirements
  const tax = subtotal * taxRate
  const total = subtotal + tax
  
  // Generate payment schedule (industry-standard milestone-based)
  const paymentSchedule = [
    {
      phase: 'Project Initiation Deposit',
      description: 'Contract signing, project kickoff, requirements gathering, and planning phase',
      amount: Math.round(total * 0.30), // 30% upfront (industry standard)
      dueDate: 'Upon contract execution',
    },
    {
      phase: 'Design & Architecture Approval',
      description: 'Design mockups approved, architecture finalized, development environment setup',
      amount: Math.round(total * 0.25), // 25% after design
      dueDate: 'Upon design sign-off (Week 2-3)',
    },
    {
      phase: 'Development Milestone - Phase 1',
      description: 'Core functionality complete, backend APIs operational, database implemented',
      amount: Math.round(total * 0.20), // 20% mid-development
      dueDate: 'Upon Phase 1 completion (Week 6-8)',
    },
    {
      phase: 'Development Milestone - Phase 2',
      description: 'All features complete, testing begun, staging environment deployed',
      amount: Math.round(total * 0.15), // 15% near completion
      dueDate: 'Upon Phase 2 completion (Week 10-12)',
    },
    {
      phase: 'Final Delivery & Go-Live',
      description: 'Production deployment complete, training delivered, documentation finalized, warranty begins',
      amount: Math.round(total * 0.10), // 10% on delivery
      dueDate: 'Upon final delivery and go-live',
    },
  ]
  
  console.log('💵 Final Quote:', { 
    subtotal, 
    total, 
    totalHours: Math.round(totalHours), 
    avgRate: Math.round(total / totalHours),
    lineItemsCount: lineItems.length 
  })
  
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
