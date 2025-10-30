import type { Metadata } from 'next'
import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Custom Web Application Development | CRM, Dashboard, Booking Systems | MicroAI',
  description: 'Enterprise-grade custom web applications in 1-2 weeks. Build CRM systems, project management tools, inventory management, booking systems, e-commerce platforms, dashboards & more. Next.js, React, TypeScript development. Full-stack solutions with responsive design, authentication, databases & cloud deployment.',
  keywords: [
    'web application development',
    'custom web applications',
    'CRM development',
    'dashboard development',
    'booking system development',
    'inventory management system',
    'project management software',
    'e-commerce platform development',
    'enterprise web applications',
    'full-stack development',
    'React web applications',
    'Next.js applications',
    'scalable web apps',
    'business web applications',
  ],
  openGraph: {
    title: 'Custom Web Application Development - Enterprise Solutions in 1-2 Weeks',
    description: 'CRM, Project Management, Inventory, LMS, Booking Systems, Dashboards, E-commerce & more. Enterprise-grade quality delivered 10x faster.',
    url: '/services/web-applications',
    type: 'website',
  },
  alternates: {
    canonical: '/services/web-applications',
  },
}

export default function WebApplicationsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-20 right-20 animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/services" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 text-sm">
            ← Back to Services
          </Link>
          <div className="flex items-center mb-6">
            <span className="text-7xl mr-4 animate-float">💻</span>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold">
                Web <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Application</span> Development
              </h1>
              <p className="text-xl text-gray-400 mt-4">
                Enterprise-grade custom web applications delivered in <span className="text-blue-500 font-bold">1-2 weeks</span> instead of months
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
                What is a <span className="text-blue-500">Web Application?</span>
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                A web application is an interactive software program that runs in your web browser. Unlike traditional websites that just display information, web applications allow users to perform complex tasks, process data, and interact with databases in real-time.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Think of platforms like Gmail, Trello, or Salesforce - these are all web applications. They're powerful, scalable, and accessible from any device with a browser.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Perfect For:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Businesses needing custom workflows</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Teams requiring collaboration tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Companies automating processes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Organizations managing data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Startups launching MVPs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Types of Web Applications <span className="text-blue-500">We Build</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'CRM Systems',
                description: 'Manage customer relationships, track leads, automate sales pipelines, and boost revenue.',
                features: ['Contact Management', 'Sales Pipeline', 'Activity Tracking', 'Custom Reports']
              },
              {
                title: 'Project Management Tools',
                description: 'Organize tasks, collaborate with teams, track progress, and meet deadlines efficiently.',
                features: ['Task Management', 'Team Collaboration', 'Gantt Charts', 'Resource Allocation']
              },
              {
                title: 'Inventory Management',
                description: 'Track stock levels, manage suppliers, automate reordering, and prevent stockouts.',
                features: ['Stock Tracking', 'Supplier Management', 'Automated Alerts', 'Reporting']
              },
              {
                title: 'Learning Management Systems',
                description: 'Deliver online courses, track student progress, manage content, and issue certificates.',
                features: ['Course Creation', 'Progress Tracking', 'Assessments', 'Certifications']
              },
              {
                title: 'Booking & Scheduling',
                description: 'Accept appointments, manage calendars, send reminders, and process payments.',
                features: ['Calendar Integration', 'Automated Reminders', 'Payment Processing', 'Customer Portal']
              },
              {
                title: 'Data Dashboards',
                description: 'Visualize metrics, generate insights, track KPIs, and make data-driven decisions.',
                features: ['Real-time Charts', 'Custom Metrics', 'Automated Reports', 'Data Export']
              },
              {
                title: 'E-commerce Platforms',
                description: 'Sell products online, manage inventory, process orders, and handle payments securely.',
                features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management']
              },
              {
                title: 'HR Management Systems',
                description: 'Manage employees, track attendance, handle payroll, and streamline HR processes.',
                features: ['Employee Database', 'Attendance Tracking', 'Leave Management', 'Performance Reviews']
              },
              {
                title: 'Custom Solutions',
                description: 'Have a unique business need? We build completely custom applications tailored to you.',
                features: ['Your Requirements', 'Your Workflows', 'Your Brand', 'Your Success']
              },
            ].map((type, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">{type.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature, i) => (
                    <li key={i} className="text-xs text-gray-500 flex items-center">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Every Application <span className="text-blue-500">Includes</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🔐',
                title: 'Secure Authentication',
                description: 'User registration, login, password recovery, role-based access control, and session management.'
              },
              {
                icon: '📱',
                title: 'Responsive Design',
                description: 'Works perfectly on desktop, tablet, and mobile devices. One application, every screen size.'
              },
              {
                icon: '💾',
                title: 'Database Integration',
                description: 'Robust PostgreSQL or MongoDB database with optimized queries and data relationships.'
              },
              {
                icon: '🎨',
                title: 'Modern UI/UX',
                description: 'Beautiful, intuitive interfaces built with latest design trends and best practices.'
              },
              {
                icon: '📊',
                title: 'Admin Dashboard',
                description: 'Powerful admin panel to manage users, content, settings, and monitor application health.'
              },
              {
                icon: '🔔',
                title: 'Real-time Updates',
                description: 'Live notifications, instant data updates, and real-time collaboration features.'
              },
              {
                icon: '📈',
                title: 'Analytics & Reporting',
                description: 'Track usage, generate reports, export data, and gain insights into your operations.'
              },
              {
                icon: '🔄',
                title: 'API Integration',
                description: 'Connect with third-party services, payment gateways, email providers, and more.'
              },
              {
                icon: '☁️',
                title: 'Cloud Deployment',
                description: 'Hosted on reliable cloud infrastructure with automatic scaling and 99.9% uptime.'
              },
              {
                icon: '🛡️',
                title: 'Security Best Practices',
                description: 'Data encryption, SQL injection protection, XSS prevention, and CSRF protection.'
              },
              {
                icon: '⚡',
                title: 'Performance Optimized',
                description: 'Lightning-fast load times, efficient caching, and optimized database queries.'
              },
              {
                icon: '🔧',
                title: 'Ongoing Maintenance',
                description: 'Bug fixes, security updates, and technical support for applications we build.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Built with <span className="text-blue-500">Cutting-Edge</span> Technology
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-blue-400">Frontend</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>React / Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-purple-400">Backend</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Node.js</li>
                <li>Python / FastAPI</li>
                <li>RESTful APIs</li>
                <li>GraphQL</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-pink-900/20 to-pink-800/20 border border-pink-500/30 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-pink-400">Database</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>PostgreSQL</li>
                <li>MongoDB</li>
                <li>Prisma ORM</li>
                <li>Redis Caching</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-cyan-400">Deployment</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>AWS / Render</li>
                <li>Docker</li>
                <li>CI/CD Pipeline</li>
                <li>Auto Scaling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our <span className="text-blue-500">Development</span> Process
          </h2>
          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Discovery & Planning',
                duration: '1-2 days',
                description: 'We discuss your business needs, target users, key features, and success metrics. Our team creates detailed specifications and wireframes.',
                deliverables: ['Requirements document', 'User stories', 'Wireframes', 'Technical architecture']
              },
              {
                step: '02',
                title: 'Design & Prototyping',
                duration: '1-2 days',
                description: 'Our designers create beautiful, user-friendly interfaces. You review and provide feedback before development begins.',
                deliverables: ['UI/UX designs', 'Interactive prototype', 'Design system', 'Asset library']
              },
              {
                step: '03',
                title: 'Development & Testing',
                duration: '5-7 days',
                description: 'Our engineers build your application using advanced AI-assisted development. We test thoroughly to ensure quality.',
                deliverables: ['Functional application', 'Admin dashboard', 'API documentation', 'Test reports']
              },
              {
                step: '04',
                title: 'Deployment & Launch',
                duration: '1-2 days',
                description: 'We deploy to production, configure your domain, set up SSL certificates, and ensure everything runs smoothly.',
                deliverables: ['Live application', 'Custom domain', 'SSL certificate', 'Deployment documentation']
              },
              {
                step: '05',
                title: 'Training & Support',
                duration: 'Ongoing',
                description: 'We provide training for your team and offer ongoing support to ensure your success.',
                deliverables: ['User training', 'Admin training', 'Documentation', 'Technical support']
              },
            ].map((phase, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-8 hover:border-blue-500 transition-all">
                <div className="flex items-start gap-6">
                  <div className="text-5xl font-bold text-blue-500/20">{phase.step}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-semibold">{phase.title}</h3>
                      <span className="text-sm text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">{phase.duration}</span>
                    </div>
                    <p className="text-gray-300 mb-4">{phase.description}</p>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Deliverables:</h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((deliverable, i) => (
                          <span key={i} className="text-xs bg-gray-800 border border-gray-700 px-3 py-1 rounded-full text-gray-400">
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
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
            Investment & <span className="text-blue-500">Timeline</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Every project is unique. Pricing depends on complexity, features, and integrations. 
            Here's what you can expect:
          </p>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Typical Timeline</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Simple App:</span>
                    <span className="font-semibold">1 week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Medium Complexity:</span>
                    <span className="font-semibold">1-2 weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Complex Application:</span>
                    <span className="font-semibold">2-3 weeks</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-400">What's Included</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Full application development
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Admin dashboard
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Cloud deployment
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    30 days of support
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Training & documentation
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-center text-gray-400 text-sm mb-4">
                Get a detailed quote tailored to your specific requirements
              </p>
              <Link 
                href="/contact"
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium text-lg"
              >
                Request a Quote →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Build Your Web Application?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Let's discuss your project and show you how we can deliver a professional 
                web application in a fraction of the usual time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Schedule Consultation →
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
