/**
 * Standard Quote Defaults and Templates
 * Pre-filled content for professional, sophisticated quotes
 */

// ===== COMPANY INFORMATION =====
export const COMPANY_INFO = {
  name: 'MicroAI Systems',
  tagline: 'Innovative Web Solutions for Modern Businesses',
  email: 'sales@microaisystems.com',
  phone: '+233 244486837 | +233 544230568',
  address: 'BR253 Pasture St. Takoradi, Ghana',
  website: 'www.microaisystems.com',
  
  profile: `MicroAI Systems is a leading web development company specializing in custom web applications, e-commerce solutions, and AI-powered business tools. With years of experience delivering cutting-edge digital solutions, we help businesses transform their online presence and streamline operations through innovative technology.

Our team of expert developers, designers, and project managers work collaboratively to deliver high-quality, scalable solutions that drive business growth. We pride ourselves on transparency, timely delivery, and ongoing support for all our clients.`,

  expertise: [
    'Custom Web Application Development',
    'E-commerce Solutions & Online Stores',
    'AI Integration & Automation',
    'Progressive Web Apps (PWA)',
    'API Development & Integration',
    'Cloud Infrastructure & DevOps',
    'UI/UX Design & Branding',
    'Mobile-Responsive Design',
  ],
};

// ===== STANDARD TERMS & CONDITIONS =====
export const STANDARD_TERMS = `1. PROJECT SCOPE: The scope of work is limited to items explicitly mentioned in this quotation. Any additional features or modifications will be subject to separate quotation and approval.

2. PAYMENT TERMS: Payment must be made according to the schedule outlined in this quote. Late payments may result in project suspension and additional fees of 5% per month on outstanding amounts.

3. TIMELINE: Project timeline is contingent upon timely receipt of required materials, content, feedback, and approvals from the client. Delays in client responses may extend the delivery date accordingly.

4. CLIENT RESPONSIBILITIES: Client agrees to provide all necessary materials (content, images, branding assets, access credentials) within agreed timeframes. Client is responsible for reviewing and approving deliverables at each milestone.

5. INTELLECTUAL PROPERTY: Upon full payment, all custom code and design work becomes the property of the client. Third-party libraries, frameworks, and tools remain under their respective licenses.

6. REVISIONS: Two rounds of revisions are included in the quoted price for each milestone. Additional revisions will be billed at $75/hour.

7. HOSTING & MAINTENANCE: First month of hosting is included. Ongoing hosting, maintenance, and support packages are available separately. Client may choose to self-host using provided deployment documentation.

8. WARRANTY: We provide 30 days of bug fixes and technical support after project delivery at no additional cost. This warranty covers functionality as specified in the project scope only.

9. CONFIDENTIALITY: Both parties agree to keep confidential all proprietary information shared during the project. MicroAI Systems will not disclose client data to third parties without written consent.

10. TERMINATION: Either party may terminate this agreement with 14 days written notice. Client will be billed for all work completed up to the termination date.

11. LIMITATION OF LIABILITY: MicroAI Systems' liability is limited to the total amount paid for the project. We are not responsible for indirect damages or loss of business.

12. ACCEPTANCE: This quotation is valid for 30 days from the date of issue. Project commencement requires a signed agreement and initial deposit payment.`;

// ===== STANDARD ASSUMPTIONS =====
export const STANDARD_ASSUMPTIONS = [
  'Client will provide all necessary content, images, and branding materials in appropriate formats',
  'Client has rights to use all provided content and media',
  'Client will provide timely feedback and approvals at each milestone',
  'One primary point of contact will be designated by the client',
  'Project requirements will not significantly change after approval',
  'Client will provide access to necessary third-party services and accounts',
  'Development will be conducted in a staging environment with client access',
  'Final deployment will be to a production environment provided or approved by client',
  'Browser compatibility will target the latest two versions of major browsers',
  'Website will be optimized for desktop, tablet, and mobile devices',
];

// ===== PROJECT TYPE TEMPLATES =====

export const PROJECT_TEMPLATES = {
  'basic-website': {
    displayName: 'Basic Website',
    description: 'A professional, responsive website perfect for establishing your online presence',
    
    scopeOfWork: [
      'Custom responsive design for all devices (desktop, tablet, mobile)',
      'Up to 5 pages (Home, About, Services, Contact, and one additional page)',
      'Contact form with email notifications',
      'Google Maps integration for location display',
      'Basic SEO optimization (meta tags, sitemap, robots.txt)',
      'Social media links and integration',
      'Content management system (CMS) for easy updates',
      'SSL certificate setup for secure browsing',
      'Performance optimization for fast loading',
      'Cross-browser compatibility testing',
    ],
    
    milestones: [
      {
        title: 'Discovery & Design',
        duration: '1 week',
        payment: '33%',
        deliverables: ['Design mockups', 'Sitemap', 'Content structure']
      },
      {
        title: 'Development & Content',
        duration: '2 weeks',
        payment: '34%',
        deliverables: ['Functional website', 'CMS setup', 'Content integration']
      },
      {
        title: 'Testing & Launch',
        duration: '1 week',
        payment: '33%',
        deliverables: ['Testing completion', 'Client training', 'Live deployment']
      }
    ],
    
    paymentTerms: [
      {
        title: 'Initial Deposit',
        percentage: 33,
        description: 'Due upon project commencement to begin design phase'
      },
      {
        title: 'Progress Payment',
        percentage: 34,
        description: 'Due upon completion of development and content integration'
      },
      {
        title: 'Final Payment',
        percentage: 33,
        description: 'Due upon successful testing and before final deployment'
      }
    ],
    
    timeline: '3-4 weeks',
    estimatedHours: 60,
  },

  'business-website': {
    displayName: 'Business Website',
    description: 'A comprehensive business website with advanced features and integrations',
    
    scopeOfWork: [
      'Custom professional design with your branding',
      'Up to 10 pages with custom layouts',
      'Advanced contact forms with validation',
      'Blog/News section with CMS',
      'Service/Product showcase pages',
      'Team member profiles section',
      'Testimonials and case studies display',
      'Newsletter subscription integration',
      'Social media feed integration',
      'Analytics setup (Google Analytics)',
      'SEO optimization for all pages',
      'Advanced mobile responsiveness',
      'Performance optimization and caching',
      'Security hardening and monitoring',
    ],
    
    milestones: [
      {
        title: 'Strategy & Design',
        duration: '1-2 weeks',
        payment: '30%',
        deliverables: ['Brand analysis', 'Wireframes', 'Design system', 'Homepage mockup']
      },
      {
        title: 'Design Completion',
        duration: '1 week',
        payment: '20%',
        deliverables: ['All page designs', 'Responsive layouts', 'Asset preparation']
      },
      {
        title: 'Development Phase 1',
        duration: '2 weeks',
        payment: '25%',
        deliverables: ['Core functionality', 'CMS integration', 'Content pages']
      },
      {
        title: 'Development Phase 2',
        duration: '1-2 weeks',
        payment: '15%',
        deliverables: ['Advanced features', 'Integrations', 'Content population']
      },
      {
        title: 'Testing & Launch',
        duration: '1 week',
        payment: '10%',
        deliverables: ['Quality assurance', 'Performance optimization', 'Launch']
      }
    ],
    
    paymentTerms: [
      {
        title: 'Initial Deposit',
        percentage: 30,
        description: 'Due upon signing to begin strategy and design phase'
      },
      {
        title: 'Design Approval',
        percentage: 20,
        description: 'Due upon approval of all page designs'
      },
      {
        title: 'Development Milestone 1',
        percentage: 25,
        description: 'Due upon completion of core development'
      },
      {
        title: 'Development Milestone 2',
        percentage: 15,
        description: 'Due upon completion of advanced features'
      },
      {
        title: 'Final Payment',
        percentage: 10,
        description: 'Due upon successful testing and before live deployment'
      }
    ],
    
    timeline: '5-7 weeks',
    estimatedHours: 120,
  },

  'ecommerce': {
    displayName: 'E-Commerce Platform',
    description: 'A complete online store with payment processing and inventory management',
    
    scopeOfWork: [
      'Custom e-commerce design with brand identity',
      'Product catalog with categories and filters',
      'Product detail pages with image galleries',
      'Shopping cart and checkout system',
      'Payment gateway integration (Stripe/PayPal)',
      'User account creation and management',
      'Order tracking and history',
      'Admin dashboard for inventory management',
      'Order management system',
      'Email notifications (order confirmations, shipping updates)',
      'Product search and filtering',
      'Wishlist functionality',
      'Product reviews and ratings',
      'Discount codes and promotions system',
      'Shipping calculator integration',
      'Tax calculation and compliance',
      'Mobile-responsive design',
      'Security and PCI compliance',
      'SEO optimization for products',
      'Analytics and reporting',
    ],
    
    milestones: [
      {
        title: 'Planning & Design',
        duration: '2 weeks',
        payment: '25%',
        deliverables: ['User flow diagrams', 'Wireframes', 'Design mockups', 'Feature specifications']
      },
      {
        title: 'Core Development',
        duration: '3 weeks',
        payment: '30%',
        deliverables: ['Product catalog', 'Shopping cart', 'User authentication', 'Admin panel basics']
      },
      {
        title: 'Payment & Checkout',
        duration: '2 weeks',
        payment: '20%',
        deliverables: ['Payment integration', 'Checkout flow', 'Order system', 'Email notifications']
      },
      {
        title: 'Advanced Features',
        duration: '2 weeks',
        payment: '15%',
        deliverables: ['Search & filters', 'Reviews', 'Promotions', 'Shipping integration']
      },
      {
        title: 'Testing & Launch',
        duration: '1 week',
        payment: '10%',
        deliverables: ['Security testing', 'Payment testing', 'Performance optimization', 'Launch']
      }
    ],
    
    paymentTerms: [
      {
        title: 'Project Initiation',
        percentage: 25,
        description: 'Due upon contract signing to begin planning and design'
      },
      {
        title: 'Development Start',
        percentage: 30,
        description: 'Due upon design approval and beginning of core development'
      },
      {
        title: 'Checkout Integration',
        percentage: 20,
        description: 'Due upon completion of payment and checkout systems'
      },
      {
        title: 'Feature Completion',
        percentage: 15,
        description: 'Due upon completion of all advanced features'
      },
      {
        title: 'Go Live',
        percentage: 10,
        description: 'Due upon successful testing and live deployment'
      }
    ],
    
    timeline: '8-10 weeks',
    estimatedHours: 200,
  },

  'web-app': {
    displayName: 'Custom Web Application',
    description: 'A sophisticated web application tailored to your business needs',
    
    scopeOfWork: [
      'Custom application architecture and database design',
      'User authentication and authorization system',
      'Role-based access control (RBAC)',
      'Comprehensive admin dashboard',
      'User dashboard and interface',
      'RESTful API development',
      'Database design and implementation',
      'Real-time features (if required)',
      'File upload and management',
      'Data export functionality (CSV, PDF)',
      'Search and advanced filtering',
      'Responsive design for all devices',
      'Email notification system',
      'Activity logging and audit trails',
      'Data validation and error handling',
      'API documentation',
      'Security implementation (encryption, XSS prevention)',
      'Performance optimization and caching',
      'Backup and recovery system',
      'Deployment and DevOps setup',
    ],
    
    milestones: [
      {
        title: 'Discovery & Architecture',
        duration: '2 weeks',
        payment: '20%',
        deliverables: ['Requirements analysis', 'System architecture', 'Database schema', 'Technical specifications']
      },
      {
        title: 'Core Development Phase 1',
        duration: '3 weeks',
        payment: '25%',
        deliverables: ['Authentication system', 'Database setup', 'Basic CRUD operations', 'Admin framework']
      },
      {
        title: 'Core Development Phase 2',
        duration: '3 weeks',
        payment: '25%',
        deliverables: ['User dashboard', 'Core features', 'API endpoints', 'Business logic']
      },
      {
        title: 'Advanced Features',
        duration: '2 weeks',
        payment: '20%',
        deliverables: ['Advanced functionality', 'Integrations', 'Notifications', 'Reporting']
      },
      {
        title: 'Testing & Deployment',
        duration: '1-2 weeks',
        payment: '10%',
        deliverables: ['Quality assurance', 'Security audit', 'Performance optimization', 'Deployment']
      }
    ],
    
    paymentTerms: [
      {
        title: 'Project Kickoff',
        percentage: 20,
        description: 'Due upon contract execution to begin discovery and architecture'
      },
      {
        title: 'Development Milestone 1',
        percentage: 25,
        description: 'Due upon completion of authentication and database setup'
      },
      {
        title: 'Development Milestone 2',
        percentage: 25,
        description: 'Due upon completion of core features and user interface'
      },
      {
        title: 'Feature Completion',
        percentage: 20,
        description: 'Due upon delivery of all advanced features and integrations'
      },
      {
        title: 'Final Delivery',
        percentage: 10,
        description: 'Due upon successful testing and production deployment'
      }
    ],
    
    timeline: '10-12 weeks',
    estimatedHours: 280,
  },

  'saas': {
    displayName: 'SaaS Platform',
    description: 'A scalable Software-as-a-Service platform with subscription management',
    
    scopeOfWork: [
      'Multi-tenant architecture design',
      'Subscription and billing system',
      'Payment processing (Stripe integration)',
      'User authentication and authorization',
      'Organization/Team management',
      'Role-based permissions',
      'Feature flagging and plan restrictions',
      'Admin super dashboard',
      'User management portal',
      'Subscription management (upgrades, downgrades, cancellations)',
      'Usage tracking and analytics',
      'API development with rate limiting',
      'Webhook integrations',
      'Email notification system',
      'In-app notifications',
      'Onboarding flow for new users',
      'Documentation and help center',
      'Responsive design',
      'Performance optimization and CDN',
      'Security and compliance (GDPR, data encryption)',
      'Automated backups and disaster recovery',
      'CI/CD pipeline setup',
      'Monitoring and error tracking',
    ],
    
    milestones: [
      {
        title: 'Architecture & Planning',
        duration: '2-3 weeks',
        payment: '20%',
        deliverables: ['System architecture', 'Database design', 'API specifications', 'Security plan']
      },
      {
        title: 'Core Infrastructure',
        duration: '3-4 weeks',
        payment: '25%',
        deliverables: ['Multi-tenant setup', 'Authentication', 'Subscription system', 'Payment integration']
      },
      {
        title: 'Platform Features',
        duration: '4 weeks',
        payment: '25%',
        deliverables: ['Core functionality', 'User dashboard', 'Admin panel', 'Organization management']
      },
      {
        title: 'Advanced Features',
        duration: '3 weeks',
        payment: '20%',
        deliverables: ['API development', 'Webhooks', 'Analytics', 'Notifications', 'Onboarding']
      },
      {
        title: 'Testing & Launch',
        duration: '2 weeks',
        payment: '10%',
        deliverables: ['Security audit', 'Load testing', 'Documentation', 'Production deployment']
      }
    ],
    
    paymentTerms: [
      {
        title: 'Project Initiation',
        percentage: 20,
        description: 'Due upon contract signing to begin architecture and planning'
      },
      {
        title: 'Infrastructure Milestone',
        percentage: 25,
        description: 'Due upon completion of core infrastructure and payment systems'
      },
      {
        title: 'Platform Features',
        percentage: 25,
        description: 'Due upon delivery of main platform features and dashboards'
      },
      {
        title: 'Advanced Features',
        percentage: 20,
        description: 'Due upon completion of API, integrations, and advanced functionality'
      },
      {
        title: 'Production Launch',
        percentage: 10,
        description: 'Due upon successful testing and production deployment'
      }
    ],
    
    timeline: '14-16 weeks',
    estimatedHours: 400,
  },
};

// ===== HELPER FUNCTION TO GET DEFAULTS =====
export function getQuoteDefaults(projectType?: string) {
  const template = projectType ? PROJECT_TEMPLATES[projectType as keyof typeof PROJECT_TEMPLATES] : null;
  
  return {
    // Company information
    companyName: COMPANY_INFO.name,
    companyEmail: COMPANY_INFO.email,
    companyPhone: COMPANY_INFO.phone,
    companyAddress: COMPANY_INFO.address,
    companyWebsite: COMPANY_INFO.website,
    companyProfile: COMPANY_INFO.profile,
    
    // Standard terms
    terms: STANDARD_TERMS,
    assumptions: STANDARD_ASSUMPTIONS,
    
    // Project-specific defaults (if template exists)
    ...(template && {
      scopeOfWork: template.scopeOfWork,
      milestones: template.milestones,
      paymentTerms: template.paymentTerms,
      timeline: template.timeline,
      estimatedHours: template.estimatedHours,
    }),
  };
}

// ===== COMPANY PROFILE FOR PDF =====
export function getCompanyProfileSection() {
  return {
    title: COMPANY_INFO.tagline,
    description: COMPANY_INFO.profile,
    expertise: COMPANY_INFO.expertise,
  };
}

// ===== STANDARD PRICING BREAKDOWN =====
export function getStandardPricingItems(projectTotal: number = 0) {
  // Calculate breakdown if total is provided
  const setupFee = projectTotal > 0 ? Math.round(projectTotal * 0.15) : 0;
  const uiuxCost = projectTotal > 0 ? Math.round(projectTotal * 0.20) : 0;
  const frontendCost = projectTotal > 0 ? Math.round(projectTotal * 0.25) : 0;
  const backendCost = projectTotal > 0 ? Math.round(projectTotal * 0.25) : 0;
  const apiIntegration = projectTotal > 0 ? Math.round(projectTotal * 0.10) : 0;
  const emailSetup = projectTotal > 0 ? Math.round(projectTotal * 0.05) : 0;
  
  return [
    {
      name: 'Setup Fee',
      description: 'Project initialization, requirements analysis, environment setup, and configuration. Includes domain setup, SSL certificate, initial server configuration, and project management tools.',
      quantity: 1,
      unitPrice: setupFee,
      price: setupFee,
    },
    {
      name: 'UI/UX Design',
      description: 'Complete user interface and user experience design including wireframes, mockups, prototypes, design system creation, and brand-consistent visual design for all pages and components.',
      quantity: 1,
      unitPrice: uiuxCost,
      price: uiuxCost,
    },
    {
      name: 'Frontend Development',
      description: 'Responsive client-side development using modern frameworks (React/Next.js). Includes component development, state management, responsive design implementation, and cross-browser compatibility.',
      quantity: 1,
      unitPrice: frontendCost,
      price: frontendCost,
    },
    {
      name: 'Backend Development',
      description: 'Server-side development including database design, business logic implementation, authentication system, data validation, and admin panel development with secure API endpoints.',
      quantity: 1,
      unitPrice: backendCost,
      price: backendCost,
    },
    {
      name: 'API Integration',
      description: 'Third-party service integrations including payment gateways (Stripe/PayPal), analytics (Google Analytics), social media APIs, CRM systems, and any required external services.',
      quantity: 1,
      unitPrice: apiIntegration,
      price: apiIntegration,
    },
    {
      name: 'Email Setup & Automation',
      description: 'Email configuration including transactional emails (notifications, confirmations), SMTP setup, email templates design, automated email workflows, and newsletter integration if required.',
      quantity: 1,
      unitPrice: emailSetup,
      price: emailSetup,
    },
  ];
}

// ===== STANDARD RECURRING COSTS =====
export function getStandardRecurringCosts() {
  return [
    {
      name: 'Monthly Hosting',
      description: 'Professional cloud hosting on AWS/Azure/DigitalOcean with SSL, CDN, automatic backups, 99.9% uptime guarantee, and performance monitoring. Includes server maintenance and security updates.',
      quantity: 1,
      unitPrice: 50,
      price: 50,
      isRecurring: true,
      frequency: 'monthly',
    },
    {
      name: 'Monthly Maintenance & Support',
      description: 'Ongoing technical support, bug fixes, security patches, performance monitoring, monthly backups, and up to 2 hours of minor updates or content changes per month.',
      quantity: 1,
      unitPrice: 100,
      price: 100,
      isRecurring: true,
      frequency: 'monthly',
    },
  ];
}
