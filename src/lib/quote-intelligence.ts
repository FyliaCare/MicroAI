// ============================================================================
// SMART QUOTE INTELLIGENCE ENGINE
// AI-powered quote generation with learning capabilities
// ============================================================================

interface SmartSuggestion {
  field: string
  suggestions: string[]
  confidence: number
  source: 'history' | 'ai' | 'template'
}

interface QuotePattern {
  projectType: string
  industry: string
  commonDeliverables: string[]
  commonObjectives: string[]
  commonExclusions: string[]
  commonAssumptions: string[]
  averageTimeline: string
  averageHours: number
  commonTechStack: string[]
  averageCost: number
}

/**
 * Smart Text Parser - Converts bulk text into structured bullet points
 * Uses AI-like pattern matching to intelligently break down text
 */
export class SmartTextParser {
  /**
   * Parse bulk text into structured list items
   * Handles various input formats: comma-separated, newlines, numbered lists, bullet points
   */
  static parseToList(text: string): string[] {
    if (!text || !text.trim()) return []

    // Remove extra whitespace
    const cleaned = text.trim()

    // Detect format and parse accordingly
    const items: string[] = []

    // Check for numbered lists (1. item, 2. item)
    if (/^\d+[\.\)]\s/.test(cleaned)) {
      const numbered = cleaned.split(/\n\d+[\.\)]\s/).filter(Boolean)
      items.push(...numbered.map(item => item.trim()))
    }
    // Check for bullet points (-, *, •)
    else if (/^[-\*•]\s/.test(cleaned)) {
      const bulleted = cleaned.split(/\n[-\*•]\s/).filter(Boolean)
      items.push(...bulleted.map(item => item.trim()))
    }
    // Check for newline-separated items
    else if (cleaned.includes('\n')) {
      const lines = cleaned.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
      items.push(...lines)
    }
    // Check for comma-separated items
    else if (cleaned.includes(',')) {
      const commaSeparated = cleaned.split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
      items.push(...commaSeparated)
    }
    // Check for semicolon-separated items
    else if (cleaned.includes(';')) {
      const semiSeparated = cleaned.split(';')
        .map(item => item.trim())
        .filter(item => item.length > 0)
      items.push(...semiSeparated)
    }
    // Single item
    else {
      items.push(cleaned)
    }

    // Post-process: remove empty items and numbering prefixes
    return items
      .map(item => item.replace(/^\d+[\.\)]\s*/, '').replace(/^[-\*•]\s*/, '').trim())
      .filter(item => item.length > 3) // Filter out very short items
  }

  /**
   * Parse milestone text into structured milestones
   * Extracts name, amount, date, description
   */
  static parseToMilestones(text: string): Array<{
    name: string
    amount?: number
    dueDate?: string
    description: string
  }> {
    const lines = this.parseToList(text)
    const milestones: Array<{ name: string; amount?: number; dueDate?: string; description: string }> = []

    lines.forEach((line, index) => {
      // Extract amount if present (e.g., "$1000", "1000", "1,000")
      const amountMatch = line.match(/\$?([\d,]+(?:\.\d{2})?)/)
      const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : undefined

      // Extract date if present (various formats)
      const dateMatch = line.match(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/)
      const dueDate = dateMatch ? dateMatch[0] : undefined

      // Remove amount and date from line to get clean description
      let cleanLine = line
        .replace(/\$?([\d,]+(?:\.\d{2})?)/, '')
        .replace(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/, '')
        .trim()

      // Generate milestone name (first few words)
      const words = cleanLine.split(' ').slice(0, 4).join(' ')
      const name = words || `Milestone ${index + 1}`

      milestones.push({
        name,
        amount,
        dueDate,
        description: cleanLine || line,
      })
    })

    return milestones
  }
}

/**
 * Quote Learning System - Learns from historical quotes
 */
export class QuoteLearningSystem {
  private static STORAGE_KEY = 'quote_history_patterns'

  /**
   * Analyze historical quotes and extract patterns
   */
  static async analyzeQuoteHistory(quotes: any[]): Promise<QuotePattern[]> {
    const patterns: Map<string, QuotePattern> = new Map()

    quotes.forEach(quote => {
      const key = `${quote.projectType || 'general'}_${quote.industry || 'general'}`
      
      if (!patterns.has(key)) {
        patterns.set(key, {
          projectType: quote.projectType || 'General',
          industry: quote.industry || 'General',
          commonDeliverables: [],
          commonObjectives: [],
          commonExclusions: [],
          commonAssumptions: [],
          averageTimeline: '',
          averageHours: 0,
          commonTechStack: [],
          averageCost: 0,
        })
      }

      const pattern = patterns.get(key)!

      // Extract and aggregate data
      try {
        const scope = typeof quote.scopeOfWork === 'string' ? JSON.parse(quote.scopeOfWork) : quote.scopeOfWork
        if (scope) {
          if (scope.deliverables) pattern.commonDeliverables.push(...scope.deliverables)
          if (scope.objectives) pattern.commonObjectives.push(...scope.objectives)
          if (scope.exclusions) pattern.commonExclusions.push(...scope.exclusions)
          if (scope.assumptions) pattern.commonAssumptions.push(...scope.assumptions)
        }

        const techStack = typeof quote.techStack === 'string' ? JSON.parse(quote.techStack) : quote.techStack
        if (techStack) pattern.commonTechStack.push(...techStack)
      } catch (e) {
        // Skip parsing errors
      }

      if (quote.timeline) pattern.averageTimeline = quote.timeline
      if (quote.estimatedHours) {
        pattern.averageHours = (pattern.averageHours + quote.estimatedHours) / 2
      }
      if (quote.total) {
        pattern.averageCost = (pattern.averageCost + quote.total) / 2
      }
    })

    // Deduplicate and sort by frequency
    patterns.forEach(pattern => {
      pattern.commonDeliverables = this.getTopN(pattern.commonDeliverables, 10)
      pattern.commonObjectives = this.getTopN(pattern.commonObjectives, 8)
      pattern.commonExclusions = this.getTopN(pattern.commonExclusions, 8)
      pattern.commonAssumptions = this.getTopN(pattern.commonAssumptions, 8)
      pattern.commonTechStack = this.getTopN(pattern.commonTechStack, 6)
    })

    return Array.from(patterns.values())
  }

  /**
   * Get top N most frequent items
   */
  private static getTopN(items: string[], n: number): string[] {
    const frequency = new Map<string, number>()
    items.forEach(item => {
      const lower = item.toLowerCase().trim()
      frequency.set(lower, (frequency.get(lower) || 0) + 1)
    })

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([item]) => {
        // Return original casing from first occurrence
        return items.find(i => i.toLowerCase().trim() === item) || item
      })
  }

  /**
   * Get suggestions based on current quote context
   */
  static getSuggestions(
    field: string,
    projectType: string,
    industry: string,
    patterns: QuotePattern[]
  ): SmartSuggestion {
    const relevantPattern = patterns.find(
      p => p.projectType === projectType && p.industry === industry
    ) || patterns.find(
      p => p.projectType === projectType
    ) || patterns[0]

    if (!relevantPattern) {
      return { field, suggestions: [], confidence: 0, source: 'template' }
    }

    let suggestions: string[] = []
    let confidence = 0.8

    switch (field) {
      case 'deliverables':
        suggestions = relevantPattern.commonDeliverables
        break
      case 'objectives':
        suggestions = relevantPattern.commonObjectives
        break
      case 'exclusions':
        suggestions = relevantPattern.commonExclusions
        break
      case 'assumptions':
        suggestions = relevantPattern.commonAssumptions
        break
      case 'techStack':
        suggestions = relevantPattern.commonTechStack
        break
      case 'timeline':
        suggestions = [relevantPattern.averageTimeline].filter(Boolean)
        confidence = 0.6
        break
      case 'estimatedHours':
        suggestions = [Math.round(relevantPattern.averageHours).toString()].filter(Boolean)
        confidence = 0.6
        break
      default:
        confidence = 0
    }

    return {
      field,
      suggestions: suggestions.filter(Boolean),
      confidence,
      source: 'history',
    }
  }

  /**
   * Save quote pattern for future learning
   */
  static saveQuotePattern(quote: any): void {
    if (typeof window === 'undefined') return

    try {
      const existing = localStorage.getItem(this.STORAGE_KEY)
      const patterns = existing ? JSON.parse(existing) : []
      
      const newPattern = {
        projectType: quote.projectType,
        industry: quote.industry,
        timestamp: new Date().toISOString(),
        fields: {
          deliverables: quote.scope?.deliverables || [],
          objectives: quote.scope?.objectives || [],
          exclusions: quote.scope?.exclusions || [],
          assumptions: quote.scope?.assumptions || [],
          techStack: quote.techStack || [],
          timeline: quote.timeline,
          estimatedHours: quote.estimatedHours,
        },
      }

      patterns.push(newPattern)
      
      // Keep only last 100 patterns
      if (patterns.length > 100) {
        patterns.shift()
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(patterns))
    } catch (e) {
      console.error('Failed to save quote pattern:', e)
    }
  }

  /**
   * Load saved patterns from localStorage
   */
  static loadSavedPatterns(): any[] {
    if (typeof window === 'undefined') return []

    try {
      const existing = localStorage.getItem(this.STORAGE_KEY)
      return existing ? JSON.parse(existing) : []
    } catch (e) {
      return []
    }
  }
}

/**
 * Company Profile Manager - Stores and retrieves company information
 */
export class CompanyProfileManager {
  private static STORAGE_KEY = 'microai_company_profile'

  static getDefaultProfile() {
    return {
      // Core Company Info
      companyName: 'MicroAI Systems',
      tagline: '10x Faster Development - Revolutionary Technology',
      companyEmail: 'sales@microaisystems.com',
      companyPhone: '+233 244 486 837 | +233 544 230 568',
      companyWebsite: 'www.microaisystems.com',
      companyAddress: 'BR253 Pasture St. Takoradi, Ghana',
      
      // Extended Info
      companyDescription: 'MicroAI Systems delivers revolutionary development technology, building web applications, SaaS platforms, and digital solutions in 1/10th the time. Serving clients worldwide across Africa, North America, Europe, UK, and Australia.',
      
      servicesOverview: [
        'Custom Web Application Development',
        'SaaS Platform Development',
        'E-commerce Solutions',
        'Business Management Systems',
        'AI Integration & Automation',
        'API Development & Integration',
        'Database Design & Optimization',
        'Cloud Infrastructure Setup',
      ],
      
      certifications: [
        'Verified Production Portfolio',
        'Full-Stack Development Expertise',
        'Multiple Live Projects in Production',
        'Ghana-Based with Global Standards',
      ],
      
      expertise: [
        'Next.js 14 & React 18',
        'TypeScript & JavaScript',
        'Prisma ORM & PostgreSQL',
        'Tailwind CSS & Modern UI',
        'NextAuth.js Authentication',
        'RESTful API Development',
        'Vercel & Render Deployment',
        'Git & GitHub Workflows',
      ],
      
      companyLogo: '/MICROAI SYSTEMS OFFICIAL LOGO.png',
      brandColor: '#4F46E5',
      
      // About Section for Quotes
      aboutSection: `MicroAI Systems is revolutionizing software development with cutting-edge technology that delivers enterprise-grade projects 10x faster than traditional companies. Based in Takoradi, Ghana, we serve clients globally across Africa, North America, Europe, UK, and Australia.

Our expertise spans full-stack web applications, SaaS platforms, e-commerce solutions, and business management systems. Using modern technologies like Next.js, React, TypeScript, and Prisma, we build scalable, production-ready solutions with transparent communication and predictable timelines.

Every project benefits from our proven methodology that combines speed with quality, ensuring your digital product launches faster without compromising on excellence. We deliver in weeks, not months, giving you a competitive advantage in today's fast-paced market.`,

      // Values & Principles
      coreValues: [
        '10x Faster: Deliver in weeks, not months',
        'Production Quality: Real projects, real results',
        'Transparent Pricing: No hidden costs or surprises',
        'Modern Stack: Next.js, TypeScript, Tailwind CSS',
        'Global Standards: Ghana-based, world-class quality',
        'Client Success: Your growth is our mission',
      ],
      
      // Team Info
      teamSize: 'Expert Development Team',
      yearsInBusiness: '3+ years',
      projectsCompleted: '25+ projects',
      
      // Contact & Social
      linkedIn: '',
      github: 'https://github.com/FyliaCare',
      twitter: 'https://x.com/microai_systems',
      
      // Legal
      registrationNumber: '',
      taxId: '',
      
      // Support
      supportEmail: 'sales@microaisystems.com',
      salesEmail: 'sales@microaisystems.com',
    }
  }

  static saveProfile(profile: any): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile))
    } catch (e) {
      console.error('Failed to save company profile:', e)
    }
  }

  static loadProfile(): any {
    if (typeof window === 'undefined') return this.getDefaultProfile()

    try {
      const existing = localStorage.getItem(this.STORAGE_KEY)
      return existing ? { ...this.getDefaultProfile(), ...JSON.parse(existing) } : this.getDefaultProfile()
    } catch (e) {
      return this.getDefaultProfile()
    }
  }
}

/**
 * Smart Autocomplete Engine - Provides intelligent suggestions as user types
 */
export class SmartAutocomplete {
  private static commonPhrases: Record<string, string[]> = {
    deliverables: [
      'Fully functional responsive website',
      'Admin dashboard with CMS capabilities',
      'Mobile-responsive design across all devices',
      'SEO optimization with meta tags and sitemap',
      'Performance optimization and lazy loading',
      'User authentication and authorization',
      'Database design and implementation',
      'API development and integration',
      'Testing and quality assurance',
      'Deployment and hosting setup',
      'Documentation and training materials',
      'Email notification system',
      'Payment gateway integration',
      'Analytics and reporting dashboard',
      'Content management system',
    ],
    objectives: [
      'Develop a professional, modern website',
      'Improve user experience and engagement',
      'Increase conversion rates and sales',
      'Enhance brand visibility and credibility',
      'Streamline business operations',
      'Reduce manual processes through automation',
      'Provide excellent customer service',
      'Ensure data security and compliance',
      'Achieve high performance and scalability',
      'Optimize for search engines (SEO)',
    ],
    exclusions: [
      'Content writing services (client provides content)',
      'Custom logo design or brand identity development',
      'E-commerce or payment gateway integration',
      'Multi-language/internationalization support',
      'Native mobile app development',
      'Third-party API integrations beyond basic requirements',
      'Video production or professional photography',
      'Ongoing hosting fees (handled separately)',
      'Email server setup or email hosting',
      'Social media management or marketing services',
      'Print materials or offline marketing collateral',
      'Ongoing maintenance beyond initial support period',
    ],
    assumptions: [
      'Client will provide all content in a timely manner',
      'Client has access to domain name and DNS management',
      'Client will provide feedback within 3-5 business days',
      'All necessary branding assets are available',
      'Client has obtained rights to all provided content',
      'Modern web browsers are the target environment',
      'SSL certificate will be configured as part of deployment',
      'Initial training session is included',
      'Project communication through designated portal',
      'Up to 3 rounds of revisions are included',
    ],
  }

  static getSuggestions(field: string, query: string): string[] {
    const phrases = this.commonPhrases[field] || []
    
    if (!query || query.length < 2) {
      return phrases.slice(0, 5)
    }

    const lowerQuery = query.toLowerCase()
    const matches = phrases.filter(phrase => 
      phrase.toLowerCase().includes(lowerQuery)
    )

    return matches.slice(0, 8)
  }
}
