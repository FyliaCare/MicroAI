import type { Metadata } from 'next'
import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'
import { ArrowLeft, Check, Code2, Shield, Smartphone, Database, Zap, Cloud, Users, Lock, Gauge, Target, ArrowRight } from 'lucide-react'

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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Background mesh gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f9ff_1px,transparent_1px),linear-gradient(to_bottom,#f0f9ff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-10 blur-[100px]"></div>
          <div className="absolute right-1/4 top-20 -z-10 h-[200px] w-[200px] rounded-full bg-indigo-400 opacity-10 blur-[80px]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/services" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-8 text-sm font-medium transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>
          
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-200 rounded-full px-4 py-2 mb-6 shadow-sm">
              <Code2 className="w-4 h-4 text-blue-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-blue-600">Web Applications</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 leading-tight">
              Custom Web <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Applications</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl leading-relaxed">
              Enterprise-grade custom web applications delivered in{' '}
              <span className="font-semibold text-slate-900">1-2 weeks</span>, not months
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                What is a Web Application?
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  A web application is an interactive software program that runs in your web browser. Unlike traditional websites that just display information, web applications allow users to perform complex tasks, process data, and interact with databases in real-time.
                </p>
                <p>
                  Think of platforms like Gmail, Trello, or Salesforce - these are all web applications. They're powerful, scalable, and accessible from any device with a browser.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {[
                  { icon: Gauge, label: '10x Faster', desc: 'Than traditional development' },
                  { icon: Shield, label: 'Enterprise Security', desc: 'Bank-level protection' },
                  { icon: Cloud, label: 'Cloud Hosted', desc: 'Scalable infrastructure' },
                  { icon: Users, label: 'User-Centric', desc: 'Intuitive interfaces' }
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <Icon className="w-5 h-5 text-blue-600" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 mb-1">{item.label}</div>
                        <div className="text-sm text-slate-600">{item.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="sticky top-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 rounded-2xl p-8 border border-blue-100 shadow-lg shadow-blue-100/50">
                <h3 className="text-xl font-bold mb-6 text-slate-900">Perfect For:</h3>
                <ul className="space-y-3">
                  {[
                    'Businesses needing custom workflows',
                    'Teams requiring collaboration tools',
                    'Companies automating processes',
                    'Organizations managing data',
                    'Startups launching MVPs'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/contact"
                  className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Types of Applications We Build
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Custom solutions tailored to your unique business needs
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'CRM Systems',
                description: 'Manage customer relationships, track leads, automate sales pipelines.',
                features: ['Contact Management', 'Sales Pipeline', 'Activity Tracking', 'Reports']
              },
              {
                title: 'Project Management',
                description: 'Organize tasks, collaborate with teams, track progress efficiently.',
                features: ['Task Management', 'Team Collaboration', 'Gantt Charts', 'Resources']
              },
              {
                title: 'Inventory Management',
                description: 'Track stock levels, manage suppliers, automate reordering.',
                features: ['Stock Tracking', 'Supplier Management', 'Auto Alerts', 'Reporting']
              },
              {
                title: 'Learning Management',
                description: 'Deliver online courses, track progress, manage content.',
                features: ['Course Creation', 'Progress Tracking', 'Assessments', 'Certificates']
              },
              {
                title: 'Booking & Scheduling',
                description: 'Accept appointments, manage calendars, send reminders.',
                features: ['Calendar Sync', 'Auto Reminders', 'Payments', 'Portal']
              },
              {
                title: 'Data Dashboards',
                description: 'Visualize metrics, generate insights, track KPIs.',
                features: ['Real-time Charts', 'Custom Metrics', 'Auto Reports', 'Export']
              },
              {
                title: 'E-commerce Platforms',
                description: 'Sell products online, manage inventory, process orders.',
                features: ['Product Catalog', 'Shopping Cart', 'Payments', 'Orders']
              },
              {
                title: 'HR Management',
                description: 'Manage employees, track attendance, handle payroll.',
                features: ['Employee DB', 'Attendance', 'Leave', 'Performance']
              },
              {
                title: 'Custom Solutions',
                description: 'Unique business needs? We build completely custom applications.',
                features: ['Your Requirements', 'Your Workflows', 'Your Brand', 'Your Success']
              },
            ].map((type, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">{type.title}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{type.description}</p>
                <div className="flex flex-wrap gap-2">
                  {type.features.map((feature, i) => (
                    <span key={i} className="text-xs bg-slate-50 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Every Application Includes
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Enterprise features built-in from day one
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Authentication',
                description: 'User registration, login, password recovery, and role-based access control.'
              },
              {
                icon: Smartphone,
                title: 'Responsive Design',
                description: 'Works perfectly on desktop, tablet, and mobile. One app, every screen size.'
              },
              {
                icon: Database,
                title: 'Database Integration',
                description: 'Robust PostgreSQL or MongoDB with optimized queries and data relationships.'
              },
              {
                icon: Code2,
                title: 'Modern UI/UX',
                description: 'Beautiful, intuitive interfaces built with latest design trends and practices.'
              },
              {
                icon: Zap,
                title: 'Admin Dashboard',
                description: 'Powerful admin panel to manage users, content, settings, and monitor health.'
              },
              {
                icon: Cloud,
                title: 'Real-time Updates',
                description: 'Live notifications, instant data updates, and real-time collaboration features.'
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="group">
                  <div className="relative mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 group-hover:border-blue-300 group-hover:shadow-lg group-hover:shadow-blue-100/50 transition-all duration-300">
                      <Icon className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Built with <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Modern Technology</span>
            </h2>
            <p className="text-lg text-slate-600">
              Industry-leading tools and frameworks
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                <Code2 className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">Frontend</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  React / Next.js
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Tailwind CSS
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Responsive Design
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
                <Zap className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">Backend</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  Node.js
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  Python / FastAPI
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  RESTful APIs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  GraphQL
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25">
                <Database className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">Database</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                  PostgreSQL
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                  MongoDB
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                  Prisma ORM
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                  Redis Caching
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/25">
                <Cloud className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">Deployment</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  AWS / Render
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Docker
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  CI/CD Pipeline
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Auto Scaling
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Our <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Development</span> Process
            </h2>
            <p className="text-lg text-slate-600">
              From concept to launch in 1-2 weeks
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Discovery & Planning',
                duration: '1-2 days',
                description: 'We discuss your needs, users, features, and goals. Our team creates detailed specifications.',
                deliverables: ['Requirements', 'User Stories', 'Wireframes', 'Architecture']
              },
              {
                step: '02',
                title: 'Design & Prototyping',
                duration: '1-2 days',
                description: 'Beautiful, user-friendly interfaces. You review and provide feedback before development.',
                deliverables: ['UI/UX Designs', 'Prototype', 'Design System', 'Assets']
              },
              {
                step: '03',
                title: 'Development & Testing',
                duration: '5-7 days',
                description: 'Our engineers build your application with advanced tools. We test thoroughly for quality.',
                deliverables: ['Application', 'Admin Panel', 'API Docs', 'Tests']
              },
              {
                step: '04',
                title: 'Deployment & Launch',
                duration: '1-2 days',
                description: 'Deploy to production, configure domain, set up SSL, ensure smooth operation.',
                deliverables: ['Live App', 'Custom Domain', 'SSL', 'Documentation']
              },
              {
                step: '05',
                title: 'Training & Support',
                duration: 'Ongoing',
                description: 'Team training and ongoing support to ensure your success.',
                deliverables: ['User Training', 'Admin Training', 'Docs', 'Support']
              },
            ].map((phase, idx) => (
              <div key={idx} className="group bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25">
                      <span className="text-2xl font-bold text-white">{phase.step}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <h3 className="text-xl font-bold text-slate-900">{phase.title}</h3>
                      <span className="inline-flex items-center text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-medium">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-4 leading-relaxed">{phase.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.deliverables.map((deliverable, i) => (
                        <span key={i} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Investment & <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Timeline</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Every project is unique. Pricing depends on complexity, features, and integrations.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Typical Timeline
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Simple App', time: '1 week', color: 'emerald' },
                    { label: 'Medium Complexity', time: '1-2 weeks', color: 'blue' },
                    { label: 'Complex Application', time: '2-3 weeks', color: 'violet' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-700 font-medium">{item.label}:</span>
                      <span className={`font-bold text-${item.color}-600`}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {[
                    'Full application development',
                    'Admin dashboard',
                    'Cloud deployment',
                    '30 days of support',
                    'Training & documentation'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-8">
              <p className="text-center text-slate-600 mb-6">
                Get a detailed quote tailored to your specific requirements
              </p>
              <Link 
                href="/contact"
                className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg shadow-blue-600/25"
              >
                Request a Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-12 overflow-hidden shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-violet-600/20"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Build Your Web Application?
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Let's discuss your project and show you how we can deliver a professional 
                web application in weeks, not months.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-slate-100 transition-all shadow-xl"
                >
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/services"
                  className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all border border-white/20 hover:border-white/30"
                >
                  View All Services
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
