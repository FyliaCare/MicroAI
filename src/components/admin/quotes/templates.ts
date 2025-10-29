import { QuoteItem, Milestone, PaymentTerm } from './types'

// ============================================================================
// PRICING TEMPLATES
// ============================================================================

export interface PricingTemplate {
  id: string
  name: string
  category: string
  description: string
  items: Omit<QuoteItem, 'id'>[]
  estimatedDuration?: number
}

export const pricingTemplates: PricingTemplate[] = [
  {
    id: 'basic-website',
    name: 'Basic Website',
    category: 'Website',
    description: '5-page responsive website with contact form',
    estimatedDuration: 14,
    items: [
      {
        category: 'design',
        name: 'UI/UX Design',
        description: 'Custom design for 5 pages',
        quantity: 1,
        unitPrice: 1500,
        discount: 0,
        taxable: true,
      },
      {
        category: 'development',
        name: 'Frontend Development',
        description: 'Responsive HTML/CSS/JS implementation',
        quantity: 1,
        unitPrice: 2500,
        discount: 0,
        taxable: true,
      },
      {
        category: 'infrastructure',
        name: 'Hosting & Domain Setup',
        description: 'First year hosting and domain',
        quantity: 1,
        unitPrice: 300,
        discount: 0,
        taxable: true,
      },
    ],
  },
  {
    id: 'ecommerce-platform',
    name: 'E-commerce Platform',
    category: 'E-commerce',
    description: 'Full-featured online store with payment integration',
    estimatedDuration: 45,
    items: [
      {
        category: 'design',
        name: 'E-commerce UI/UX',
        description: 'Custom storefront design',
        quantity: 1,
        unitPrice: 3500,
        discount: 0,
        taxable: true,
      },
      {
        category: 'development',
        name: 'Product Catalog System',
        description: 'Product management, categories, search',
        quantity: 1,
        unitPrice: 5000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'development',
        name: 'Shopping Cart & Checkout',
        description: 'Cart functionality with secure checkout',
        quantity: 1,
        unitPrice: 4000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'development',
        name: 'Payment Gateway Integration',
        description: 'Stripe/PayPal integration',
        quantity: 1,
        unitPrice: 2500,
        discount: 0,
        taxable: true,
      },
      {
        category: 'infrastructure',
        name: 'E-commerce Hosting',
        description: 'Secure hosting with SSL',
        quantity: 12,
        unitPrice: 150,
        discount: 0,
        taxable: true,
      },
    ],
  },
  {
    id: 'web-application',
    name: 'Custom Web Application',
    category: 'Web Application',
    description: 'Full-stack web application with database',
    estimatedDuration: 60,
    items: [
      {
        category: 'consulting',
        name: 'Requirements Analysis',
        description: 'Detailed requirements gathering and planning',
        quantity: 20,
        unitPrice: 150,
        discount: 0,
        taxable: true,
      },
      {
        category: 'design',
        name: 'Application Design',
        description: 'Complete UI/UX design system',
        quantity: 1,
        unitPrice: 5000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'development',
        name: 'Backend Development',
        description: 'API, database, authentication',
        quantity: 1,
        unitPrice: 12000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'development',
        name: 'Frontend Development',
        description: 'React/Vue application',
        quantity: 1,
        unitPrice: 10000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'infrastructure',
        name: 'Cloud Infrastructure',
        description: 'AWS/Azure setup and deployment',
        quantity: 1,
        unitPrice: 2000,
        discount: 0,
        taxable: true,
      },
    ],
  },
  {
    id: 'mobile-app',
    name: 'Mobile App (iOS & Android)',
    category: 'Mobile',
    description: 'Cross-platform mobile application',
    estimatedDuration: 90,
    items: [
      {
        category: 'design',
        name: 'Mobile UI/UX Design',
        description: 'iOS and Android designs',
        quantity: 1,
        unitPrice: 4000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'development',
        name: 'Mobile App Development',
        description: 'React Native development',
        quantity: 1,
        unitPrice: 18000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'development',
        name: 'Backend API',
        description: 'REST API for mobile app',
        quantity: 1,
        unitPrice: 8000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'consulting',
        name: 'App Store Submission',
        description: 'Publish to Apple and Google stores',
        quantity: 1,
        unitPrice: 1500,
        discount: 0,
        taxable: true,
      },
    ],
  },
  {
    id: 'saas-mvp',
    name: 'SaaS MVP',
    category: 'SaaS',
    description: 'Minimum viable product for SaaS platform',
    estimatedDuration: 120,
    items: [
      {
        category: 'consulting',
        name: 'Product Strategy',
        description: 'Market research and product planning',
        quantity: 30,
        unitPrice: 200,
        discount: 0,
        taxable: true,
      },
      {
        category: 'design',
        name: 'SaaS Platform Design',
        description: 'Complete platform UI/UX',
        quantity: 1,
        unitPrice: 8000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'development',
        name: 'User Authentication & Billing',
        description: 'Auth, subscriptions, Stripe integration',
        quantity: 1,
        unitPrice: 6000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'development',
        name: 'Core Features Development',
        description: 'MVP feature set implementation',
        quantity: 1,
        unitPrice: 20000,
        discount: 0,
        taxable: true,
      },
      {
        category: 'infrastructure',
        name: 'Production Infrastructure',
        description: 'Scalable cloud setup',
        quantity: 1,
        unitPrice: 3500,
        discount: 0,
        taxable: true,
      },
    ],
  },
  {
    id: 'maintenance-package',
    name: 'Monthly Maintenance',
    category: 'Maintenance',
    description: 'Ongoing support and maintenance',
    estimatedDuration: 30,
    items: [
      {
        category: 'maintenance',
        name: 'Bug Fixes & Updates',
        description: 'Monthly bug fixes and security updates',
        quantity: 10,
        unitPrice: 150,
        discount: 0,
        taxable: true,
      },
      {
        category: 'maintenance',
        name: 'Performance Monitoring',
        description: 'Server and application monitoring',
        quantity: 1,
        unitPrice: 500,
        discount: 0,
        taxable: true,
      },
      {
        category: 'infrastructure',
        name: 'Hosting & Backups',
        description: 'Managed hosting with daily backups',
        quantity: 1,
        unitPrice: 200,
        discount: 0,
        taxable: true,
      },
    ],
  },
]

// ============================================================================
// MILESTONE TEMPLATES
// ============================================================================

export interface MilestoneTemplate {
  id: string
  name: string
  description: string
  milestones: Omit<Milestone, 'id'>[]
}

export const milestoneTemplates: MilestoneTemplate[] = [
  {
    id: 'standard-web-project',
    name: 'Standard Web Project',
    description: '5-phase project timeline from discovery to launch',
    milestones: [
      {
        title: 'Discovery & Planning',
        description: 'Requirements gathering, research, and planning',
        deliverables: [
          'Project brief and scope document',
          'Sitemap and user flows',
          'Technical specifications',
        ],
        duration: 7,
        percentage: 10,
        dependencies: [],
      },
      {
        title: 'Design Phase',
        description: 'UI/UX design and client approval',
        deliverables: [
          'Wireframes',
          'High-fidelity mockups',
          'Design system documentation',
        ],
        duration: 14,
        percentage: 25,
        dependencies: [],
      },
      {
        title: 'Development',
        description: 'Frontend and backend implementation',
        deliverables: [
          'Functional website/application',
          'Admin panel',
          'Database setup',
        ],
        duration: 21,
        percentage: 40,
        dependencies: [],
      },
      {
        title: 'Testing & QA',
        description: 'Comprehensive testing and bug fixes',
        deliverables: [
          'Test results documentation',
          'Bug fixes completed',
          'Performance optimization',
        ],
        duration: 7,
        percentage: 15,
        dependencies: [],
      },
      {
        title: 'Launch & Deployment',
        description: 'Production deployment and go-live',
        deliverables: [
          'Production deployment',
          'DNS configuration',
          'Training documentation',
        ],
        duration: 3,
        percentage: 10,
        dependencies: [],
      },
    ],
  },
]

// ============================================================================
// PAYMENT TERM TEMPLATES
// ============================================================================

export interface PaymentTermTemplate {
  id: string
  name: string
  description: string
  terms: Omit<PaymentTerm, 'id'>[]
}

export const paymentTermTemplates: PaymentTermTemplate[] = [
  {
    id: 'standard-50-50',
    name: '50/50 Split',
    description: '50% upfront, 50% on completion',
    terms: [
      {
        title: 'Initial Deposit',
        percentage: 50,
        dueDate: 'onSigning',
        description: 'Due upon contract signing',
      },
      {
        title: 'Final Payment',
        percentage: 50,
        dueDate: 'milestone',
        description: 'Due upon project completion',
      },
    ],
  },
  {
    id: 'three-part',
    name: 'Three Payments',
    description: '33% upfront, 33% midway, 34% on completion',
    terms: [
      {
        title: 'Initial Deposit',
        percentage: 33,
        dueDate: 'onSigning',
        description: 'Due upon contract signing',
      },
      {
        title: 'Progress Payment',
        percentage: 33,
        dueDate: 'milestone',
        description: 'Due at 50% project completion',
      },
      {
        title: 'Final Payment',
        percentage: 34,
        dueDate: 'milestone',
        description: 'Due upon project completion',
      },
    ],
  },
  {
    id: 'milestone-based',
    name: 'Milestone-Based (4 payments)',
    description: 'Payment tied to specific milestones',
    terms: [
      {
        title: 'Deposit',
        percentage: 25,
        dueDate: 'onSigning',
        description: 'Due upon contract signing',
      },
      {
        title: 'Design Approval',
        percentage: 25,
        dueDate: 'milestone',
        description: 'Due upon design approval',
      },
      {
        title: 'Development Complete',
        percentage: 25,
        dueDate: 'milestone',
        description: 'Due when development is complete',
      },
      {
        title: 'Launch',
        percentage: 25,
        dueDate: 'milestone',
        description: 'Due upon successful launch',
      },
    ],
  },
  {
    id: 'monthly-retainer',
    name: 'Monthly Retainer',
    description: 'Equal monthly payments',
    terms: [
      {
        title: 'Monthly Payment',
        percentage: 100,
        dueDate: 'net30',
        description: 'Due monthly',
      },
    ],
  },
]
