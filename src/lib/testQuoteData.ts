/**
 * Test Quote Data Generator
 * 
 * This script creates a comprehensive test quote with all fields populated
 * to verify the complete quote system implementation.
 * 
 * Usage:
 * 1. Ensure dev server is running: npm run dev
 * 2. Run this in browser console or create via UI
 * 3. Use this data structure to test all 14 quote sections
 */

export const testQuoteData = {
  // Basic Information
  title: 'Enterprise Web Application Development',
  description: 'Custom web application for inventory management with real-time analytics and reporting capabilities',
  
  // Client Selection (set to actual client ID or null)
  clientId: null, // Replace with actual client ID from database
  projectId: null,
  
  // Timeline & Estimation
  timeline: '8-10 weeks',
  estimatedHours: 320,
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  
  // Company Profile (auto-filled from settings)
  companyName: 'MicroAI Systems',
  companyEmail: 'contact@microai.com',
  companyPhone: '+1 (555) 123-4567',
  companyAddress: '123 Tech Street, Silicon Valley, CA 94000',
  companyWebsite: 'https://microai.com',
  companyLogo: '',
  
  // Client Information
  clientName: 'John Smith',
  clientCompany: 'Acme Corporation',
  clientEmail: 'john.smith@acme.com',
  contactPerson: 'John Smith',
  
  // 1. Executive Summary
  executiveSummary: {
    problem: 'The client currently manages inventory using spreadsheets, leading to data inconsistencies, limited real-time visibility, and difficulty scaling operations. Manual processes are error-prone and time-consuming, resulting in lost revenue and customer dissatisfaction.',
    solution: 'We will develop a cloud-based inventory management system with real-time tracking, automated reporting, role-based access control, and mobile-friendly interface. The system will integrate with their existing QuickBooks accounting software and provide customizable dashboards.',
    businessImpact: 'Expected outcomes: 90% reduction in inventory errors, 20 hours per week saved in manual data entry, real-time decision-making capabilities, support for 5x business growth without additional staff, and positive ROI within 6 months of deployment.'
  },
  
  // 2. Scope of Work
  scopeOfWork: [
    {
      title: 'Database Design & Backend API Development',
      description: 'Design and implement a scalable PostgreSQL database schema with normalized tables. Build a RESTful API with JWT authentication, rate limiting, and comprehensive error handling.',
      deliverables: [
        'Normalized database schema with migration scripts',
        'RESTful API with 20+ endpoints',
        'API documentation (Swagger/OpenAPI)',
        'Unit tests (90%+ coverage)',
        'Integration tests for all endpoints',
        'Authentication & authorization system'
      ]
    },
    {
      title: 'Frontend User Interface Development',
      description: 'Build a modern, responsive web application using React 18 and Next.js 14. Implement real-time updates, intuitive navigation, and accessibility standards (WCAG 2.1 AA).',
      deliverables: [
        'Dashboard with real-time metrics and charts',
        'Inventory management interface (CRUD operations)',
        'Advanced search and filtering',
        'Reporting module with export functionality',
        'User management and permissions',
        'Mobile-responsive design (tablet and phone)',
        'Dark mode support'
      ]
    },
    {
      title: 'Third-Party Integration & Deployment',
      description: 'Integrate with QuickBooks API for accounting sync. Deploy to AWS cloud infrastructure with automated CI/CD pipeline, monitoring, and backup systems.',
      deliverables: [
        'QuickBooks API integration',
        'AWS infrastructure setup (EC2, RDS, S3)',
        'CI/CD pipeline (GitHub Actions)',
        'SSL certificate and domain configuration',
        'Automated backup system',
        'Monitoring and alerting (CloudWatch)',
        'Performance optimization'
      ]
    }
  ],
  
  // 3. Exclusions
  exclusions: [
    'Custom hardware integration (barcode scanners, RFID readers)',
    'Data migration from legacy systems (available as separate service)',
    'Training videos or comprehensive user manuals',
    'Ongoing content updates or feature additions after launch',
    'Native mobile applications (iOS/Android)',
    'Multi-language support (English only initially)',
    'Advanced AI/ML features for demand forecasting'
  ],
  
  // 4. Technical Stack
  technicalStack: [
    {
      category: 'Frontend',
      tools: ['React 18', 'Next.js 14', 'TypeScript', 'Tailwind CSS', 'Chart.js']
    },
    {
      category: 'Backend',
      tools: ['Node.js', 'Express.js', 'Prisma ORM', 'JWT Authentication']
    },
    {
      category: 'Database',
      tools: ['PostgreSQL 15', 'Redis (caching)']
    },
    {
      category: 'Cloud & DevOps',
      tools: ['AWS (EC2, RDS, S3)', 'GitHub Actions', 'Docker', 'Nginx']
    },
    {
      category: 'Third-Party',
      tools: ['QuickBooks API', 'SendGrid (email)', 'Stripe (payments)']
    }
  ],
  
  // 5. Timeline & Milestones
  milestones: [
    {
      title: 'Project Kickoff & Planning',
      date: 'Week 1',
      deliverables: [
        'Requirements finalization',
        'Database schema design',
        'UI/UX wireframes approved',
        'Development environment setup'
      ]
    },
    {
      title: 'Backend Development Complete',
      date: 'Week 4',
      deliverables: [
        'Database implemented',
        'All API endpoints functional',
        'Authentication system complete',
        'API tests passing'
      ]
    },
    {
      title: 'Frontend Development Complete',
      date: 'Week 7',
      deliverables: [
        'All UI screens implemented',
        'Integration with backend complete',
        'Responsive design verified',
        'User testing conducted'
      ]
    },
    {
      title: 'Testing & Deployment',
      date: 'Week 10',
      deliverables: [
        'All tests passing',
        'QuickBooks integration verified',
        'Production deployment complete',
        'Training session conducted'
      ]
    }
  ],
  
  // 6. Pricing Breakdown
  pricingItems: [
    {
      name: 'Project Setup & Planning',
      description: 'Requirements analysis, database design, project planning',
      amount: '5000'
    },
    {
      name: 'Backend API Development',
      description: 'Database implementation, RESTful API, authentication',
      amount: '15000'
    },
    {
      name: 'Frontend Development',
      description: 'React application, dashboard, reporting interface',
      amount: '18000'
    },
    {
      name: 'Integration Services',
      description: 'QuickBooks API, third-party services',
      amount: '8000'
    },
    {
      name: 'Testing & QA',
      description: 'Unit tests, integration tests, UAT',
      amount: '4000'
    },
    {
      name: 'Deployment & Training',
      description: 'AWS deployment, CI/CD, client training',
      amount: '3000'
    }
  ],
  
  subtotal: 53000,
  tax: 0,
  discount: 0,
  total: 53000,
  monthlyMaintenance: 1500,
  
  // 7. Payment Terms
  paymentTerms: [
    {
      milestone: 'Project Kickoff',
      percentage: 30,
      description: 'Due upon contract signing and project kickoff'
    },
    {
      milestone: 'Backend Complete',
      percentage: 30,
      description: 'Due when API development and database are complete'
    },
    {
      milestone: 'Frontend Complete',
      percentage: 20,
      description: 'Due when UI development is complete and approved'
    },
    {
      milestone: 'Final Delivery',
      percentage: 20,
      description: 'Due upon successful deployment and client acceptance'
    }
  ],
  
  // 8. Assumptions
  assumptions: [
    'Client will provide all necessary content, branding assets, and QuickBooks credentials within 1 week of project start',
    'Access to existing systems for integration testing will be provided by client IT team',
    'Client will assign a dedicated point of contact for weekly check-ins and feedback sessions',
    'All feedback and change requests will be consolidated and provided within 48 hours of review',
    'Hosting infrastructure budget ($200/month) is approved and funded separately',
    'Client has necessary QuickBooks API subscription and permissions',
    'Client team will be available for UAT during week 9'
  ],
  
  // 9. Client Obligations
  clientObligations: [
    'Provide timely feedback on designs and deliverables (within 48 hours)',
    'Assign a dedicated project manager or point of contact',
    'Provide access to necessary systems, credentials, and data',
    'Review and approve all milestone deliverables',
    'Participate in weekly status meetings',
    'Conduct user acceptance testing during designated testing period',
    'Provide final sign-off upon satisfactory completion'
  ],
  
  // 10. Maintenance & Support Terms
  maintenanceTerms: {
    coverage: 'Bug fixes, security updates, minor enhancements, and 24/7 monitoring',
    responseTime: 'Critical issues: 4 hours | High priority: 24 hours | Normal: 48 hours',
    updates: 'Monthly security patches, quarterly feature updates, annual technology refresh'
  },
  
  // 11. Intellectual Property
  intellectualProperty: {
    sourceCode: 'Full source code ownership transfers to client upon final payment. We retain the right to use generic components in future projects.',
    designAssets: 'All custom design assets created for this project become property of the client.',
    thirdParty: 'Third-party libraries and frameworks remain under their respective open-source licenses. Client is responsible for ongoing license compliance.'
  },
  
  // 12. Revisions Policy
  revisionsPolicy: {
    included: 'Two rounds of revisions per major milestone at no additional cost',
    additional: 'Additional revision rounds billed at $150/hour',
    changeProcess: 'All change requests must be submitted in writing and will be evaluated for timeline and cost impact before implementation'
  },
  
  // 13. Confidentiality
  confidentiality: 'Both parties agree to maintain confidentiality of all proprietary information shared during the project. This includes but is not limited to business processes, data, code, and strategic plans. Confidentiality obligations remain in effect for 3 years after project completion.',
  
  // 14. Authorized Signatory
  authorizedSignatory: 'Jane Doe, CEO',
  
  // Legacy fields (for backward compatibility)
  setupFee: 5000,
  developmentCost: 33000,
  designCost: 8000,
  monthlyHosting: 200,
  monthlyRecurring: 1500,
  yearlyRecurring: 18000,
  
  items: [
    { description: 'Setup Fee', quantity: 1, unitPrice: 5000, total: 5000 },
    { description: 'Development Cost', quantity: 1, unitPrice: 33000, total: 33000 },
    { description: 'Design & UI/UX', quantity: 1, unitPrice: 8000, total: 8000 },
    { description: 'Integration Services', quantity: 1, unitPrice: 7000, total: 7000 }
  ],
  
  techStack: ['React', 'Next.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  
  deliverables: [
    'Fully functional web application',
    'Source code repository',
    'API documentation',
    'Deployment guide',
    'Training session recording'
  ],
  
  features: [
    'Real-time inventory tracking',
    'Automated reporting',
    'QuickBooks integration',
    'Role-based access control',
    'Mobile-responsive interface'
  ],
  
  notes: 'This is a comprehensive test quote to verify all 14 sections of the enhanced quote system. All fields have been populated with realistic data.',
  
  terms: 'Payment terms: 30% upfront, 30% at backend completion, 20% at frontend completion, 20% upon final delivery. All prices in USD. Quote valid for 30 days from issue date. Client responsible for hosting costs. Source code and assets transfer upon final payment.'
}

// Helper function to create the quote via API
export async function createTestQuote() {
  try {
    const response = await fetch('/api/admin/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testQuoteData)
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Test quote created successfully!')
      console.log('Quote Number:', data.quote.quoteNumber)
      console.log('Quote ID:', data.quote.id)
      return data.quote
    } else {
      console.error('❌ Failed to create quote:', data.error)
      return null
    }
  } catch (error) {
    console.error('❌ Error creating quote:', error)
    return null
  }
}

// Helper to generate PDF
export function generatePDF(quote: any) {
  // Store quote data in sessionStorage
  sessionStorage.setItem('quoteToPrint', JSON.stringify(quote))
  
  // Open PDF page
  window.open(`/admin/quotes/pdf?id=${quote.id}`, '_blank')
}

// Usage in browser console:
// import { createTestQuote, generatePDF } from './path/to/this/file'
// const quote = await createTestQuote()
// generatePDF(quote)
