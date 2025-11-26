// Advanced AI Analysis Functions for Quote Generation
// Industry-standard patterns and best practices

// Advanced description extraction with multi-strategy approach
export function extractDescriptionAdvanced(content: string, lines: string[]): string {
  let description = ''
  
  // Strategy 1: Look for description metadata
  const descMatch = content.match(/(?:description|about|overview):\s*["']?([^"'\n]+)["']?/i)
  if (descMatch) return descMatch[1].trim()
  
  // Strategy 2: Find first substantial paragraph after title
  let foundTitle = false
  let paragraphLines: string[] = []
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    if (trimmed.startsWith('# ')) {
      foundTitle = true
      continue
    }
    
    if (foundTitle && trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```')) {
      paragraphLines.push(trimmed)
      if (paragraphLines.join(' ').length > 200) break
    }
    
    if (trimmed.startsWith('## ') && paragraphLines.length > 0) break
  }
  
  description = paragraphLines.join(' ')
  
  // Strategy 3: Extract from first 1000 characters if still empty
  if (!description) {
    const intro = content.substring(0, 1000).replace(/#+\s+[^\n]+\n/g, '')
    description = intro.split('\n').filter(l => l.trim().length > 50)[0] || ''
  }
  
  return description.trim() || 'A comprehensive software development project designed to deliver exceptional value through modern technology and best practices.'
}

// Generate advanced executive summary with industry insights
export function generateExecutiveSummaryAdvanced(
  projectName: string, 
  description: string, 
  projectType: string,
  techStack: string[]
): string {
  const typeInsights: Record<string, string> = {
    'e-commerce-platform': 'leveraging industry-leading e-commerce patterns to drive conversion rates up to 3.5x industry average',
    'saas-platform': 'implementing multi-tenant architecture with 99.9% uptime SLA and horizontal scalability',
    'mobile-application': 'utilizing native performance optimization for 60 FPS smooth experiences across devices',
    'api-development': 'following RESTful best practices with OAuth 2.0 security and rate limiting for enterprise-grade reliability',
    'dashboard-application': 'incorporating real-time data visualization with sub-second refresh rates and responsive design',
    'website-development': 'implementing Core Web Vitals optimization for 90+ PageSpeed scores and superior SEO performance',
    'custom-software': 'applying domain-driven design principles and SOLID architecture for long-term maintainability',
    'web-application': 'building with modern web standards, progressive enhancement, and accessibility compliance',
    'fintech-application': 'adhering to PCI-DSS compliance, AES-256 encryption, and industry financial regulations',
    'healthcare-system': 'ensuring HIPAA compliance, HL7 FHIR standards, and patient data security protocols',
    'ai-ml-platform': 'implementing production-grade ML pipelines with model versioning and A/B testing capabilities',
    'blockchain-dapp': 'utilizing secure smart contract patterns with comprehensive auditing and gas optimization',
  }
  
  const insight = typeInsights[projectType] || 'employing industry best practices and modern development methodologies'
  const techMention = techStack.length > 0 ? ` Built with ${techStack.slice(0, 3).join(', ')}, ` : ''
  
  return `This proposal outlines the development of ${projectName}, ${insight}. ${techMention}${description.slice(0, 250)}${description.length > 250 ? '...' : ''} Our team brings proven expertise with similar projects averaging 95%+ client satisfaction, delivering production-ready solutions on time and within budget. We'll implement comprehensive testing, security auditing, and performance optimization to ensure your investment delivers measurable ROI.`
}

// Advanced feature extraction with NLP-style patterns
export function extractFeaturesAdvanced(content: string, projectType: string): string[] {
  const features: string[] = []
  const lines = content.split('\n')
  let inFeatureSection = false
  let inRequirementsSection = false
  
  // Pattern 1: Extract from feature sections
  for (const line of lines) {
    const trimmed = line.trim()
    const lower = trimmed.toLowerCase()
    
    if ((lower.includes('feature') || lower.includes('functionality') || lower.includes('capability')) && trimmed.startsWith('#')) {
      inFeatureSection = true
      continue
    }
    
    if ((lower.includes('requirement') || lower.includes('specification')) && trimmed.startsWith('#')) {
      inRequirementsSection = true
      continue
    }
    
    if (trimmed.startsWith('## ') && !lower.includes('feature') && !lower.includes('requirement')) {
      inFeatureSection = false
      inRequirementsSection = false
    }
    
    if ((inFeatureSection || inRequirementsSection || features.length < 8) && 
        (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ') || /^\d+\.\s/.test(trimmed))) {
      let feature = trimmed.replace(/^[-*+]\s|^\d+\.\s/, '').trim()
      
      // Clean up markdown
      feature = feature.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      feature = feature.replace(/`([^`]+)`/g, '$1') // Remove code marks
      feature = feature.replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      
      if (feature && feature.length > 10 && feature.length < 150 && !lower.includes('coming soon') && !lower.includes('todo')) {
        features.push(feature)
      }
    }
  }
  
  // Pattern 2: Detect implied features from keywords
  const lower = content.toLowerCase()
  const impliedFeatures = []
  
  if (lower.includes('auth') || lower.includes('login') || lower.includes('sign')) {
    impliedFeatures.push('Secure user authentication with JWT tokens and session management')
  }
  if (lower.includes('payment') || lower.includes('stripe') || lower.includes('paypal')) {
    impliedFeatures.push('Payment processing integration with PCI-compliant security')
  }
  if (lower.includes('search')) {
    impliedFeatures.push('Advanced search functionality with filters and autocomplete')
  }
  if (lower.includes('notification') || lower.includes('email')) {
    impliedFeatures.push('Real-time notifications via email, SMS, and push')
  }
  if (lower.includes('admin') || lower.includes('dashboard')) {
    impliedFeatures.push('Comprehensive admin dashboard with analytics and reporting')
  }
  if (lower.includes('api')) {
    impliedFeatures.push('RESTful API with comprehensive documentation and rate limiting')
  }
  if (lower.includes('mobile') || lower.includes('responsive')) {
    impliedFeatures.push('Fully responsive design optimized for mobile, tablet, and desktop')
  }
  if (lower.includes('upload') || lower.includes('file')) {
    impliedFeatures.push('Secure file upload and management system with cloud storage')
  }
  
  // Combine and deduplicate
  const allFeatures = [...features, ...impliedFeatures]
  const unique = Array.from(new Set(allFeatures))
  
  // Add industry-standard features if still too few
  if (unique.length < 6) {
    const standardFeatures = getStandardFeaturesByType(projectType)
    unique.push(...standardFeatures.slice(0, 8 - unique.length))
  }
  
  return unique.slice(0, 20) // Cap at reasonable number
}

function getStandardFeaturesByType(projectType: string): string[] {
  const standards: Record<string, string[]> = {
    'e-commerce-platform': [
      'Product catalog with advanced filtering and search',
      'Shopping cart with real-time inventory updates',
      'Secure checkout with multiple payment gateways',
      'Order management and tracking system',
      'Customer account portal with order history',
      'Admin inventory management dashboard',
      'Abandoned cart recovery automation',
      'Customer reviews and ratings system',
    ],
    'saas-platform': [
      'Multi-tenant architecture with data isolation',
      'Subscription and billing management',
      'Usage analytics and reporting dashboard',
      'API access with rate limiting',
      'Team collaboration features',
      'Role-based access control',
      'Webhook integrations',
      'Audit logging and compliance tracking',
    ],
    'mobile-application': [
      'Native iOS and Android applications',
      'Offline functionality with data sync',
      'Push notifications',
      'Biometric authentication',
      'App store deployment and compliance',
      'Performance monitoring and crash reporting',
      'In-app messaging',
      'Deep linking support',
    ],
    'fintech-application': [
      'PCI-DSS compliant payment processing',
      'Multi-factor authentication',
      'Transaction monitoring and fraud detection',
      'Encrypted data storage (AES-256)',
      'Audit trail and compliance reporting',
      'Real-time balance and transaction updates',
      'Account aggregation',
      'Regulatory reporting tools',
    ],
    'healthcare-system': [
      'HIPAA-compliant data handling',
      'Patient record management (EHR/EMR)',
      'Appointment scheduling system',
      'Telemedicine video consultation',
      'Prescription management',
      'Lab results integration',
      'Provider dashboard with patient insights',
      'Insurance verification and billing',
    ],
  }
  
  return standards[projectType] || [
    'User authentication and authorization',
    'Responsive web design for all devices',
    'Database design and implementation',
    'RESTful API development',
    'Admin dashboard with analytics',
    'Security implementation and penetration testing',
    'Performance optimization (< 2s load time)',
    'Automated backup and disaster recovery',
  ]
}

// Advanced deliverables generation
export function generateDeliverablesAdvanced(
  projectType: string, 
  scopeItems: string[],
  techStack: string[]
): string[] {
  const baseDeliverables = [
    'Fully functional application deployed to production environment',
    'Complete source code with Git version control and branching strategy',
    'Comprehensive technical documentation (architecture, API, database schema)',
    'User documentation and training materials (video tutorials and guides)',
    'Automated test suite with 80%+ code coverage',
    'CI/CD pipeline configuration for automated deployments',
    'Security audit report and penetration testing results',
    'Performance optimization report (load time, database queries, caching)',
    '90-day warranty for bug fixes and critical issues',
    'Knowledge transfer sessions (3 x 2-hour sessions)',
  ]
  
  // Add project-specific deliverables
  const specificDeliverables: Record<string, string[]> = {
    'e-commerce-platform': [
      'Payment gateway integration testing documentation',
      'Product import/export templates and scripts',
      'SEO optimization report and sitemap',
    ],
    'saas-platform': [
      'Multi-tenant data isolation verification',
      'Billing and subscription integration documentation',
      'API documentation with Swagger/OpenAPI',
    ],
    'mobile-application': [
      'iOS App Store and Google Play Store submissions',
      'App signing certificates and provisioning profiles',
      'Mobile analytics dashboard setup',
    ],
    'fintech-application': [
      'PCI-DSS compliance documentation',
      'Security audit certificate',
      'Regulatory compliance checklist',
    ],
    'healthcare-system': [
      'HIPAA compliance documentation',
      'Data encryption certificates',
      'BAA (Business Associate Agreement) support',
    ],
    'ai-ml-platform': [
      'Model training pipeline documentation',
      'Model versioning and rollback procedures',
      'Dataset preparation guidelines',
    ],
  }
  
  const combined = [...baseDeliverables, ...(specificDeliverables[projectType] || [])]
  
  // Add tech-specific deliverables
  if (techStack.includes('Docker')) {
    combined.push('Docker containerization with docker-compose configuration')
  }
  if (techStack.includes('Kubernetes')) {
    combined.push('Kubernetes deployment manifests and Helm charts')
  }
  if (techStack.includes('AWS') || techStack.includes('Azure') || techStack.includes('Google Cloud')) {
    combined.push('Cloud infrastructure as code (Terraform/CloudFormation)')
  }
  
  return combined
}

// Extract strategic objectives
export function extractObjectivesAdvanced(content: string, projectType: string): string[] {
  const objectives: string[] = []
  const lines = content.split('\n')
  let inObjectiveSection = false
  
  for (const line of lines) {
    const trimmed = line.trim()
    const lower = trimmed.toLowerCase()
    
    if ((lower.includes('objective') || lower.includes('goal') || lower.includes('aim')) && trimmed.startsWith('#')) {
      inObjectiveSection = true
      continue
    }
    
    if (trimmed.startsWith('## ') && !lower.includes('objective') && !lower.includes('goal')) {
      inObjectiveSection = false
    }
    
    if (inObjectiveSection && (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed))) {
      const objective = trimmed.replace(/^[-*]\s|^\d+\.\s/, '').trim()
      if (objective.length > 15) {
        objectives.push(objective)
      }
    }
  }
  
  // Generate strategic objectives if none found
  if (objectives.length === 0) {
    const typeObjectives: Record<string, string[]> = {
      'e-commerce-platform': [
        'Increase online revenue by 200% through optimized conversion funnel',
        'Reduce cart abandonment rate to below 40% industry average',
        'Achieve 2-second page load time for 95th percentile users',
        'Implement scalable infrastructure to handle 10,000+ concurrent users',
      ],
      'saas-platform': [
        'Achieve 99.9% uptime SLA with redundant infrastructure',
        'Reduce customer churn by 35% through improved UX',
        'Scale to 100,000+ users without performance degradation',
        'Implement self-service onboarding reducing support tickets by 60%',
      ],
      'mobile-application': [
        'Achieve 4.5+ star rating on app stores within 6 months',
        'Reach 100,000+ downloads in first year',
        'Maintain crash rate below 0.1% industry standard',
        'Achieve 30% monthly active user retention',
      ],
      'fintech-application': [
        'Achieve PCI-DSS Level 1 compliance certification',
        'Process $10M+ transactions monthly with 99.99% accuracy',
        'Reduce fraud rate to below 0.1% through ML detection',
        'Maintain sub-100ms transaction processing time',
      ],
      'healthcare-system': [
        'Achieve HIPAA compliance with zero data breaches',
        'Reduce administrative overhead by 40% through automation',
        'Improve patient satisfaction scores by 25%',
        'Enable telemedicine for 5,000+ patients monthly',
      ],
    }
    
    objectives.push(...(typeObjectives[projectType] || [
      'Deliver MVP within projected timeline with core features',
      'Achieve 95% user satisfaction through intuitive UX design',
      'Build scalable architecture supporting 5x growth',
      'Implement security best practices with zero critical vulnerabilities',
      'Reduce operational costs by 30% through automation',
    ]))
  }
  
  return objectives.slice(0, 6)
}

// Context-aware exclusions
export function generateExclusionsAdvanced(projectType: string, scopeItems: string[]): string[] {
  const baseExclusions = [
    'Third-party software licenses and subscriptions',
    'Content creation (copywriting, photography, video production)',
    'Domain registration and SSL certificate costs',
    'Ongoing marketing and SEO services',
    'Hardware procurement and physical infrastructure',
  ]
  
  const typeExclusions: Record<string, string[]> = {
    'e-commerce-platform': [
      'Product photography and catalog content',
      'Payment gateway transaction fees',
      'Inventory management system integration',
      'Shipping carrier API fees',
    ],
    'mobile-application': [
      'App store developer account fees ($99/year iOS, $25 Android)',
      'Push notification service costs beyond initial setup',
      'App marketing and user acquisition',
      'Ongoing app store optimization',
    ],
    'saas-platform': [
      'Customer acquisition and marketing campaigns',
      'White-label reseller agreements',
      'Enterprise sales support',
      'Custom integrations beyond initial scope',
    ],
  }
  
  return [...baseExclusions, ...(typeExclusions[projectType] || [])]
}

// Industry-standard assumptions
export function generateAssumptionsAdvanced(projectType: string, techStack: string[]): string[] {
  const baseAssumptions = [
    'Client provides timely feedback and approvals within 3 business days',
    'All required assets and content provided in agreed formats',
    'Client has necessary third-party accounts and credentials',
    'Project scope remains stable; changes require change request process',
    'Development environment access provided within 2 business days',
    'UAT (User Acceptance Testing) completed within agreed timeframe',
  ]
  
  const techAssumptions: string[] = []
  
  if (techStack.includes('AWS') || techStack.includes('Azure') || techStack.includes('Google Cloud')) {
    techAssumptions.push('Client provides cloud account with appropriate permissions')
  }
  if (techStack.length > 0) {
    techAssumptions.push(`Tech stack approved: ${techStack.slice(0, 5).join(', ')}`)
  }
  
  const typeAssumptions: Record<string, string[]> = {
    'e-commerce-platform': [
      'Product catalog data provided in structured format (CSV/JSON)',
      'Payment gateway account pre-approved by client',
      'Shipping rates and policies defined before integration',
    ],
    'mobile-application': [
      'App store accounts created before submission',
      'App store guidelines compliance verified by client',
      'Push notification certificates provided by client',
    ],
    'saas-platform': [
      'Billing requirements finalized before integration phase',
      'Multi-tenant architecture approved for data isolation model',
    ],
  }
  
  return [...baseAssumptions, ...techAssumptions, ...(typeAssumptions[projectType] || [])]
}

// Multi-factor complexity calculation
export function calculateComplexityAdvanced(
  content: string, 
  scopeItems: string[],
  techStack: string[]
): number {
  let complexity = 0
  const lower = content.toLowerCase()
  
  // Base complexity from content length
  complexity += Math.min(content.length / 500, 20) // Max 20 points
  
  // Feature count
  complexity += Math.min(scopeItems.length * 2, 30) // Max 30 points
  
  // Tech stack complexity
  complexity += techStack.length * 3 // 3 points per technology
  
  // Integration complexity
  const integrations = [
    'stripe', 'paypal', 'payment', 'aws', 'azure', 'gcp', 
    'api', 'webhook', 'oauth', 'saml', 'ldap', 'sso',
    'elasticsearch', 'redis', 'kafka', 'rabbitmq',
    'twilio', 'sendgrid', 'mailchimp',
  ]
  complexity += integrations.filter(i => lower.includes(i)).length * 4
  
  // Architecture complexity
  if (lower.includes('microservice')) complexity += 15
  if (lower.includes('multi-tenant')) complexity += 12
  if (lower.includes('real-time') || lower.includes('websocket')) complexity += 10
  if (lower.includes('machine learning') || lower.includes('ai')) complexity += 20
  if (lower.includes('blockchain')) complexity += 20
  
  // Security complexity
  if (lower.includes('hipaa')) complexity += 15
  if (lower.includes('pci') || lower.includes('pci-dss')) complexity += 15
  if (lower.includes('gdpr')) complexity += 10
  if (lower.includes('soc 2')) complexity += 12
  
  // Scale indicators
  if (lower.includes('scale')) complexity += 8
  if (lower.includes('million') || lower.includes('thousand')) complexity += 8
  
  return Math.min(complexity, 100) // Cap at 100
}

// Data-driven duration estimation
export function estimateDurationAdvanced(
  complexity: number, 
  projectType: string,
  featureCount: number
): string {
  // Base hours by project type (industry research-based)
  const baseHours: Record<string, number> = {
    'e-commerce-platform': 600,
    'saas-platform': 800,
    'mobile-application': 700,
    'api-development': 400,
    'dashboard-application': 500,
    'website-development': 300,
    'custom-software': 600,
    'web-application': 500,
    'fintech-application': 900,
    'healthcare-system': 900,
    'ai-ml-platform': 1000,
    'blockchain-dapp': 800,
  }
  
  const base = baseHours[projectType] || 500
  
  // Complexity multiplier (0-100 scale to 0.5-2.0 multiplier)
  const complexityMultiplier = 0.5 + (complexity / 100) * 1.5
  
  // Feature count adjustment
  const featureAdjustment = featureCount * 20 // 20 hours per feature
  
  const totalHours = base * complexityMultiplier + featureAdjustment
  const weeks = Math.ceil(totalHours / 40) // 40 hours per week
  
  if (weeks <= 4) return `${weeks} weeks`
  if (weeks <= 12) return `${weeks} weeks (${Math.ceil(weeks / 4)} months)`
  
  const months = Math.ceil(weeks / 4)
  return `${months} months (${weeks} weeks)`
}

// Analyze project risks
export function analyzeProjectRisks(
  content: string, 
  projectType: string,
  complexity: number
): string[] {
  const risks: string[] = []
  const lower = content.toLowerCase()
  
  if (complexity > 70) {
    risks.push('High complexity may require additional discovery phase')
  }
  
  if (lower.includes('third-party') || lower.includes('integration')) {
    risks.push('Third-party API dependencies may affect timeline')
  }
  
  if (lower.includes('migrate') || lower.includes('migration')) {
    risks.push('Data migration requires careful planning and validation')
  }
  
  if (projectType === 'fintech-application' || projectType === 'healthcare-system') {
    risks.push('Regulatory compliance requirements need legal review')
  }
  
  return risks
}

// Advanced timeline description
export function generateTimelineDescriptionAdvanced(
  complexity: number,
  estimatedDuration: string,
  projectType: string
): string {
  const urgency = complexity > 70 ? 'comprehensive' : complexity > 40 ? 'structured' : 'streamlined'
  
  return `This ${urgency} project will be delivered over ${estimatedDuration} following industry-standard Agile methodology with 2-week sprints. Timeline includes: requirements gathering (10%), design phase (15%), development iterations (50%), testing and QA (15%), and deployment with documentation (10%). Regular progress updates provided via weekly standups and sprint reviews.`
}

// Strategic milestones
export function generateMilestonesAdvanced(
  projectType: string,
  complexity: number,
  estimatedDuration: string
): Array<{name: string, duration: string, description: string}> {
  const isComplex = complexity > 60
  
  const baseMilestones = [
    {
      name: 'Project Kickoff & Discovery',
      duration: '1 week',
      description: 'Requirements gathering, technical specifications, architecture design, and project plan finalization',
    },
    {
      name: 'Design & Prototyping',
      duration: isComplex ? '3 weeks' : '2 weeks',
      description: 'UI/UX design, wireframes, interactive prototypes, and design system creation with client feedback',
    },
    {
      name: 'Core Development - Phase 1',
      duration: isComplex ? '4 weeks' : '3 weeks',
      description: 'Foundation setup, authentication, database implementation, and core functionality development',
    },
    {
      name: 'Core Development - Phase 2',
      duration: isComplex ? '4 weeks' : '3 weeks',
      description: 'Advanced features, integrations, admin dashboard, and business logic implementation',
    },
    {
      name: 'Testing & Quality Assurance',
      duration: isComplex ? '3 weeks' : '2 weeks',
      description: 'Unit testing, integration testing, security audit, performance optimization, and bug fixes',
    },
    {
      name: 'Deployment & Launch',
      duration: '1 week',
      description: 'Production deployment, DNS configuration, monitoring setup, and go-live support',
    },
  ]
  
  // Add project-specific milestones
  if (projectType === 'mobile-application') {
    baseMilestones.splice(5, 0, {
      name: 'App Store Submission',
      duration: '1 week',
      description: 'App store compliance review, submission preparation, and app review process',
    })
  }
  
  if (projectType === 'saas-platform') {
    baseMilestones.splice(4, 0, {
      name: 'Billing Integration',
      duration: '1 week',
      description: 'Stripe/payment gateway integration, subscription logic, and billing dashboard',
    })
  }
  
  return baseMilestones
}
