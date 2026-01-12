import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Check, Cloud, Shield, Users, CreditCard, TrendingUp, Lock, Zap, Target, ArrowRight, BarChart } from 'lucide-react'
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-200/40 rounded-full blur-3xl top-20 left-20"></div>
          <div className="absolute w-96 h-96 bg-purple-200/40 rounded-full blur-3xl bottom-20 right-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 text-sm font-medium group transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
              <Cloud className="w-10 h-10 text-blue-600" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700">
              Enterprise-Grade SaaS Development
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">SaaS Platform</span><br />
            Development
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
            Launch your software-as-a-service business in <span className="font-bold text-blue-600">2-3 weeks</span> instead of 6+ months. Multi-tenant architecture, subscription billing, and enterprise-grade features built-in.
          </p>
        </div>
      </section>


      {/* Overview Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-slate-900">
                  What is <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SaaS?</span>
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                  Software as a Service (SaaS) is a software distribution model where applications are hosted in the cloud and made available to customers via subscription. Instead of buying software once, users pay monthly or annually for access.
                </p>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Think of Netflix for movies, Spotify for music, or Salesforce for CRM - that's SaaS. Your customers access your software through a web browser, no installation required.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-600">Fast Launch</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">2-3 Weeks</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-slate-600">Security</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">Enterprise</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-slate-600">Scalable</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">∞ Users</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-600">Multi-Tenant</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">Built-in</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                  <h3 className="text-2xl font-bold mb-6">Why Build SaaS?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Recurring Revenue</div>
                        <div className="text-blue-100 text-sm">Predictable monthly income stream</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Infinite Scalability</div>
                        <div className="text-blue-100 text-sm">Serve 10 or 10,000 customers easily</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Global Reach</div>
                        <div className="text-blue-100 text-sm">Customers worldwide, 24/7 access</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <BarChart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Low Overhead</div>
                        <div className="text-blue-100 text-sm">No physical products or inventory</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Instant Updates</div>
                        <div className="text-blue-100 text-sm">Deploy new features to all users instantly</div>
                      </div>
                    </li>
                  </ul>
                  <Link
                    href="/contact"
                    className="mt-8 w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Start Your SaaS Journey
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SaaS Ideas Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            SaaS Platforms <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">We Can Build</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            From project management to analytics platforms - we build custom SaaS solutions tailored to your market
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Project Management',
                description: 'Task tracking, team collaboration, time tracking, and project reporting.',
                examples: 'Like Trello, Asana, or Monday.com',
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                title: 'Customer Support',
                description: 'Ticketing system, live chat, knowledge base, and customer portal.',
                examples: 'Like Zendesk or Freshdesk',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                title: 'Email Marketing',
                description: 'Campaign builder, automation, analytics, and subscriber management.',
                examples: 'Like Mailchimp or ConvertKit',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'HR & Recruitment',
                description: 'Applicant tracking, employee onboarding, time-off management.',
                examples: 'Like BambooHR or Workable',
                gradient: 'from-pink-500 to-rose-500'
              },
              {
                title: 'Accounting & Invoicing',
                description: 'Invoice generation, expense tracking, financial reports, payments.',
                examples: 'Like FreshBooks or Wave',
                gradient: 'from-rose-500 to-orange-500'
              },
              {
                title: 'Social Media Management',
                description: 'Post scheduling, analytics, content calendar, team collaboration.',
                examples: 'Like Hootsuite or Buffer',
                gradient: 'from-orange-500 to-amber-500'
              },
              {
                title: 'Form Builder',
                description: 'Drag-and-drop forms, surveys, payment collection, integrations.',
                examples: 'Like Typeform or JotForm',
                gradient: 'from-amber-500 to-yellow-500'
              },
              {
                title: 'Video Conferencing',
                description: 'Virtual meetings, screen sharing, recording, and scheduling.',
                examples: 'Like Zoom or Google Meet',
                gradient: 'from-yellow-500 to-lime-500'
              },
              {
                title: 'Learning Management',
                description: 'Course hosting, student progress, assignments, certifications.',
                examples: 'Like Teachable or Thinkific',
                gradient: 'from-lime-500 to-green-500'
              },
              {
                title: 'Booking & Appointments',
                description: 'Calendar management, automated reminders, payment processing.',
                examples: 'Like Calendly or Acuity',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                title: 'E-signature Platform',
                description: 'Document signing, templates, audit trails, team management.',
                examples: 'Like DocuSign or PandaDoc',
                gradient: 'from-emerald-500 to-teal-500'
              },
              {
                title: 'Analytics Platform',
                description: 'Data visualization, custom dashboards, reporting, insights.',
                examples: 'Like Mixpanel or Amplitude',
                gradient: 'from-teal-500 to-cyan-500'
              },
            ].map((saas, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${saas.gradient} rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">{saas.title}</h3>
                <p className="text-slate-600 text-sm mb-3 leading-relaxed">{saas.description}</p>
                <p className="text-xs text-slate-500 italic">{saas.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Every SaaS Platform <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Includes</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Enterprise-grade features built into every platform we develop - no compromises
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Multi-Tenant Architecture', description: 'Each customer gets their own isolated workspace with separate data, settings, and users.', color: 'blue' },
              { icon: Lock, title: 'Advanced Authentication', description: 'User registration, SSO, two-factor authentication, password policies, and session management.', color: 'indigo' },
              { icon: CreditCard, title: 'Subscription Billing', description: 'Multiple pricing tiers, monthly/annual billing, trial periods, and payment processing via Stripe.', color: 'purple' },
              { icon: BarChart, title: 'Admin Dashboard', description: 'Manage users, view analytics, configure settings, and monitor system health from one place.', color: 'violet' },
              { icon: Users, title: 'User Management', description: 'Role-based access control, team invitations, permissions, and user activity tracking.', color: 'emerald' },
              { icon: TrendingUp, title: 'Analytics & Reporting', description: 'Track key metrics, generate reports, visualize data, and export insights.', color: 'teal' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all group hover:scale-105">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Enterprise-Grade <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Technology</span> Stack
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Built with modern, battle-tested technologies for scalability and reliability
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-transform">
              <div className="bg-white/20 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Frontend</h3>
              <ul className="space-y-2 text-sm text-blue-50">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Next.js 14 + React 18
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Tailwind CSS
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Server Components
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-transform">
              <div className="bg-white/20 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Backend</h3>
              <ul className="space-y-2 text-sm text-indigo-50">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Next.js API Routes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  PostgreSQL
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Prisma ORM
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Redis Cache
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-transform">
              <div className="bg-white/20 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Integrations</h3>
              <ul className="space-y-2 text-sm text-purple-50">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Stripe Billing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Email (Resend)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  AWS S3 Storage
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Analytics
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-transform">
              <div className="bg-white/20 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Security</h3>
              <ul className="space-y-2 text-sm text-emerald-50">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  NextAuth.js
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  2FA Support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  RBAC System
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Audit Logs
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Launch Timeline: <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">2-3 Weeks</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Structured development process from concept to production
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                week: '1',
                title: 'Foundation & Core',
                description: 'Multi-tenant setup, authentication, database design, dashboard foundation',
                deliverables: ['Architecture setup', 'User management', 'Admin panel', 'Database schema']
              },
              {
                week: '2',
                title: 'Features & Integration',
                description: 'Subscription billing, core features, payment processing, email system',
                deliverables: ['Stripe billing', 'Core features', 'Email system', 'Analytics']
              },
              {
                week: '3',
                title: 'Polish & Launch',
                description: 'Testing, optimization, security hardening, documentation, deployment',
                deliverables: ['Testing & QA', 'Optimization', 'Security audit', 'Go live']
              },
            ].map((phase, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                    {phase.week}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{phase.title}</h3>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">{phase.description}</p>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-700 mb-3">Key Deliverables:</div>
                  {phase.deliverables.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-blue-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Investment & <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">What's Included</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            SaaS platforms are more complex than standard applications. Pricing depends on your specific features and integrations.
          </p>
          <div className="bg-white rounded-2xl p-10 shadow-xl border border-slate-200">
            <h3 className="text-2xl font-bold mb-8 text-center text-slate-900">Complete Package Includes:</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Full SaaS platform development</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Multi-tenant architecture</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Subscription billing (Stripe)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Admin dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">User management system</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Analytics & reporting</span>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Email notification system</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">API & webhooks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Cloud deployment</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Custom domain & SSL</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">30 days technical support</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Complete documentation</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-slate-200 pt-6">
              <p className="text-center text-slate-600 text-sm mb-4">
                Let's discuss your SaaS idea and provide a detailed quote
              </p>
              <Link 
                href="/contact"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg flex items-center justify-center gap-2 group"
              >
                Request a SaaS Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Turn Your SaaS Idea Into Reality</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you have a detailed plan or just an idea, we can help you build 
              and launch your SaaS platform faster than you ever thought possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl group"
              >
                Discuss My SaaS Idea
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
