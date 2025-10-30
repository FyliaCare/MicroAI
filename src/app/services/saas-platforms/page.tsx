import type { Metadata } from 'next'
import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'SaaS Platform Development | Multi-Tenant Apps, Subscription Billing | MicroAI',
  description: 'Launch-ready SaaS platforms in 2-3 weeks. Build project management, CRM, email marketing, HR, accounting, booking, e-signature platforms & more. Multi-tenant architecture, Stripe billing, user management, analytics, API integrations. Scalable cloud infrastructure with Next.js & TypeScript.',
  keywords: [
    'SaaS platform development',
    'SaaS application development',
    'multi-tenant application',
    'subscription platform development',
    'cloud SaaS development',
    'SaaS startup development',
    'project management SaaS',
    'CRM SaaS platform',
    'booking platform development',
    'Stripe integration',
    'subscription billing system',
    'scalable SaaS architecture',
    'SaaS MVP development',
    'enterprise SaaS development',
  ],
  openGraph: {
    title: 'SaaS Platform Development - Launch in 2-3 Weeks',
    description: '12 SaaS platform types: Project Management, CRM, Email Marketing, HR, Accounting & more. Multi-tenant, billing, analytics included.',
    url: '/services/saas-platforms',
    type: 'website',
  },
  alternates: {
    canonical: '/services/saas-platforms',
  },
}

export default function SaaSPlatformPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl bottom-20 right-20 animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/services" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 text-sm">
            ← Back to Services
          </Link>
          <div className="flex items-center mb-6">
            <span className="text-7xl mr-4 animate-float">☁️</span>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold">
                SaaS <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Platform</span> Development
              </h1>
              <p className="text-xl text-gray-400 mt-4">
                Launch your software-as-a-service business in <span className="text-purple-500 font-bold">2-3 weeks</span> instead of 6+ months
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                What is <span className="text-purple-500">SaaS?</span>
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Software as a Service (SaaS) is a software distribution model where applications are hosted in the cloud and made available to customers via subscription. Instead of buying software once, users pay monthly or annually for access.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Think of Netflix for movies, Spotify for music, or Salesforce for CRM - that's SaaS. Your customers access your software through a web browser, no installation required.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4 text-purple-400">Why Build SaaS?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300"><strong>Recurring Revenue:</strong> Predictable monthly income</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300"><strong>Scalability:</strong> Serve 10 or 10,000 customers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300"><strong>Global Reach:</strong> Customers worldwide</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300"><strong>Low Overhead:</strong> No physical products</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300"><strong>Easy Updates:</strong> Deploy features instantly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Ideas Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            SaaS Platforms <span className="text-purple-500">We Can Build</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Project Management',
                description: 'Task tracking, team collaboration, time tracking, and project reporting.',
                examples: 'Like Trello, Asana, or Monday.com'
              },
              {
                title: 'Customer Support',
                description: 'Ticketing system, live chat, knowledge base, and customer portal.',
                examples: 'Like Zendesk or Freshdesk'
              },
              {
                title: 'Email Marketing',
                description: 'Campaign builder, automation, analytics, and subscriber management.',
                examples: 'Like Mailchimp or ConvertKit'
              },
              {
                title: 'HR & Recruitment',
                description: 'Applicant tracking, employee onboarding, time-off management.',
                examples: 'Like BambooHR or Workable'
              },
              {
                title: 'Accounting & Invoicing',
                description: 'Invoice generation, expense tracking, financial reports, payments.',
                examples: 'Like FreshBooks or Wave'
              },
              {
                title: 'Social Media Management',
                description: 'Post scheduling, analytics, content calendar, team collaboration.',
                examples: 'Like Hootsuite or Buffer'
              },
              {
                title: 'Form Builder',
                description: 'Drag-and-drop forms, surveys, payment collection, integrations.',
                examples: 'Like Typeform or JotForm'
              },
              {
                title: 'Video Conferencing',
                description: 'Virtual meetings, screen sharing, recording, and scheduling.',
                examples: 'Like Zoom or Google Meet'
              },
              {
                title: 'Learning Management',
                description: 'Course hosting, student progress, assignments, certifications.',
                examples: 'Like Teachable or Thinkific'
              },
              {
                title: 'Booking & Appointments',
                description: 'Calendar management, automated reminders, payment processing.',
                examples: 'Like Calendly or Acuity'
              },
              {
                title: 'E-signature Platform',
                description: 'Document signing, templates, audit trails, team management.',
                examples: 'Like DocuSign or PandaDoc'
              },
              {
                title: 'Analytics Platform',
                description: 'Data visualization, custom dashboards, reporting, insights.',
                examples: 'Like Mixpanel or Amplitude'
              },
            ].map((saas, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all">
                <h3 className="text-xl font-semibold mb-3 text-purple-400">{saas.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{saas.description}</p>
                <p className="text-xs text-gray-500 italic">{saas.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Every SaaS Platform <span className="text-purple-500">Includes</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '👤',
                title: 'Multi-Tenant Architecture',
                description: 'Each customer gets their own isolated workspace with separate data, settings, and users.'
              },
              {
                icon: '🔐',
                title: 'Advanced Authentication',
                description: 'User registration, SSO, two-factor authentication, password policies, and session management.'
              },
              {
                icon: '💳',
                title: 'Subscription Billing',
                description: 'Multiple pricing tiers, monthly/annual billing, trial periods, and payment processing via Stripe.'
              },
              {
                icon: '📊',
                title: 'Admin Dashboard',
                description: 'Manage users, view analytics, configure settings, and monitor system health from one place.'
              },
              {
                icon: '👥',
                title: 'User Management',
                description: 'Role-based access control, team invitations, permissions, and user activity tracking.'
              },
              {
                icon: '📈',
                title: 'Analytics & Reporting',
                description: 'Track key metrics, generate reports, visualize data, and export insights.'
              },
              {
                icon: '🔔',
                title: 'Notifications System',
                description: 'Email notifications, in-app alerts, custom triggers, and notification preferences.'
              },
              {
                icon: '🔌',
                title: 'API Access',
                description: 'RESTful API with documentation, webhooks, and third-party integrations.'
              },
              {
                icon: '⚙️',
                title: 'Settings Management',
                description: 'Customizable settings, feature flags, configuration options, and branding.'
              },
              {
                icon: '📱',
                title: 'Mobile Responsive',
                description: 'Works seamlessly on all devices - desktop, tablet, and mobile browsers.'
              },
              {
                icon: '🔄',
                title: 'Data Import/Export',
                description: 'CSV import, bulk operations, data export, and backup functionality.'
              },
              {
                icon: '🛡️',
                title: 'Enterprise Security',
                description: 'Data encryption, GDPR compliance, audit logs, and security monitoring.'
              },
              {
                icon: '⚡',
                title: 'High Performance',
                description: 'Fast load times, optimized queries, caching, and CDN delivery.'
              },
              {
                icon: '📧',
                title: 'Email System',
                description: 'Transactional emails, templates, scheduling, and delivery tracking.'
              },
              {
                icon: '🔍',
                title: 'Search Functionality',
                description: 'Full-text search, filters, sorting, and advanced query capabilities.'
              },
              {
                icon: '🌐',
                title: 'Multi-Language Support',
                description: 'Internationalization ready, multiple currencies, and timezone handling.'
              },
              {
                icon: '📝',
                title: 'Activity Logs',
                description: 'Track user actions, system events, changes, and compliance requirements.'
              },
              {
                icon: '💬',
                title: 'Customer Support',
                description: 'Built-in help center, FAQ system, contact forms, and support ticketing.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Enterprise-Grade <span className="text-purple-500">Technology</span> Stack
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-8">
              <h3 className="text-2xl font-semibold mb-6 text-purple-400">Platform Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3">▶</span>
                  <div>
                    <strong className="text-white">Next.js 14</strong>
                    <p className="text-sm text-gray-400">React framework with server-side rendering and API routes</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3">▶</span>
                  <div>
                    <strong className="text-white">TypeScript</strong>
                    <p className="text-sm text-gray-400">Type-safe development for fewer bugs and better maintainability</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3">▶</span>
                  <div>
                    <strong className="text-white">PostgreSQL</strong>
                    <p className="text-sm text-gray-400">Robust relational database with advanced features</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3">▶</span>
                  <div>
                    <strong className="text-white">Prisma ORM</strong>
                    <p className="text-sm text-gray-400">Type-safe database client with migrations</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8">
              <h3 className="text-2xl font-semibold mb-6 text-blue-400">Integrations</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">▶</span>
                  <div>
                    <strong className="text-white">Stripe</strong>
                    <p className="text-sm text-gray-400">Payment processing and subscription management</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">▶</span>
                  <div>
                    <strong className="text-white">SendGrid / Resend</strong>
                    <p className="text-sm text-gray-400">Reliable email delivery for transactional emails</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">▶</span>
                  <div>
                    <strong className="text-white">AWS S3</strong>
                    <p className="text-sm text-gray-400">Scalable file storage for user uploads</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">▶</span>
                  <div>
                    <strong className="text-white">Redis</strong>
                    <p className="text-sm text-gray-400">High-performance caching and session storage</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Launch Timeline: <span className="text-purple-500">2-3 Weeks</span>
          </h2>
          <div className="space-y-6">
            {[
              {
                week: 'Week 1',
                title: 'Foundation & Core Features',
                tasks: [
                  'Multi-tenant architecture setup',
                  'Authentication & user management',
                  'Database schema design',
                  'Admin dashboard foundation',
                  'Basic UI/UX implementation'
                ]
              },
              {
                week: 'Week 2',
                title: 'Advanced Features & Integrations',
                tasks: [
                  'Subscription billing integration',
                  'Core application features',
                  'Payment processing',
                  'Email system setup',
                  'Analytics implementation'
                ]
              },
              {
                week: 'Week 3',
                title: 'Polish & Launch',
                tasks: [
                  'Testing & bug fixes',
                  'Performance optimization',
                  'Security hardening',
                  'Documentation',
                  'Production deployment'
                ]
              },
            ].map((phase, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-8 hover:border-purple-500 transition-all">
                <div className="flex items-start gap-6">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-400 font-bold whitespace-nowrap">
                    {phase.week}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-4">{phase.title}</h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {phase.tasks.map((task, i) => (
                        <li key={i} className="flex items-start text-gray-300">
                          <span className="text-purple-500 mr-2 mt-1">✓</span>
                          <span className="text-sm">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">
            Investment & <span className="text-purple-500">What's Included</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            SaaS platforms are more complex than standard applications. Pricing depends on your specific features and integrations.
          </p>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6 text-center text-purple-400">Complete Package Includes:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Full SaaS platform development</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Multi-tenant architecture</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Subscription billing (Stripe)</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Admin dashboard</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>User management system</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Analytics & reporting</span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Email notification system</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>API & webhooks</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Cloud deployment</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Custom domain & SSL</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>30 days technical support</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Complete documentation</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-center text-gray-400 text-sm mb-4">
                Let's discuss your SaaS idea and provide a detailed quote
              </p>
              <Link 
                href="/contact"
                className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-lg"
              >
                Request a SaaS Quote →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Turn Your SaaS Idea Into Reality</h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Whether you have a detailed plan or just an idea, we can help you build 
                and launch your SaaS platform faster than you ever thought possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-block bg-white text-purple-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Discuss My SaaS Idea →
                </Link>
                <Link 
                  href="/services"
                  className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
