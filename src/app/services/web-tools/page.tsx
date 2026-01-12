import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Check, Wrench, Calculator, RefreshCw, FileText, Zap, TrendingUp, ArrowRight, Clock, Shield, Target } from 'lucide-react'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Custom Web Tools & Business Automation | Calculators, Converters | MicroAI',
  description: 'Custom web tools & automation in 1-2 weeks. Build calculators, converters, report generators, form builders, scheduling tools, data analyzers & more. ROI calculators, quote generators, booking systems, inventory tools. Save hours with business automation. API integrations included.',
  keywords: [
    'custom web tools',
    'business calculators',
    'web automation tools',
    'custom calculator development',
    'ROI calculator',
    'quote generator tool',
    'data converter',
    'report generator',
    'form builder',
    'scheduling tool',
    'booking system',
    'business automation',
    'workflow automation',
    'custom web utilities',
    'API integration',
  ],
  openGraph: {
    title: 'Custom Web Tools & Business Automation - Ready in 1-2 Weeks',
    description: '15 tool types: Calculators, Converters, Reports, Forms, Scheduling, Data Analysis & more. Automate your business processes.',
    url: '/services/web-tools',
    type: 'website',
  },
  alternates: {
    canonical: '/services/web-tools',
  },
}

export default function WebToolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-200/40 rounded-full blur-3xl top-20 right-20"></div>
          <div className="absolute w-96 h-96 bg-purple-200/40 rounded-full blur-3xl bottom-20 left-20"></div>
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
              <Wrench className="w-10 h-10 text-blue-600" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700">
              Powerful Business Automation Tools
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Custom Web Tools</span><br />
            & Utilities
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
            Powerful business tools that save time and automate processes, delivered in <span className="font-bold text-blue-600">1-2 weeks</span>. From calculators to data converters.
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
                  Why Build a <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Custom Tool?</span>
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                  Off-the-shelf software rarely fits perfectly. Custom web tools are designed specifically for your business processes, eliminating manual work and reducing errors.
                </p>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Whether it's a calculator for your sales team, a data converter for your workflow, or an automation tool for repetitive tasks - we build tools that solve real problems. Best of all, web tools work everywhere - no installation required.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-600">Fast Build</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">1-2 Weeks</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-slate-600">Time Saved</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">Hours/Day</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-slate-600">Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-600">Custom Built</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">For You</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                  <h3 className="text-2xl font-bold mb-6">Perfect For:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Sales Teams</div>
                        <div className="text-blue-100 text-sm">Custom calculators & quote generators</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Automation Needs</div>
                        <div className="text-blue-100 text-sm">Eliminate repetitive manual tasks</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Data Processing</div>
                        <div className="text-blue-100 text-sm">Converters & transformers</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Lead Generation</div>
                        <div className="text-blue-100 text-sm">Engagement & capture tools</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Workflow Automation</div>
                        <div className="text-blue-100 text-sm">Streamline business processes</div>
                      </div>
                    </li>
                  </ul>
                  <Link
                    href="/contact"
                    className="mt-8 w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Discuss Your Tool Idea
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Types Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Types of Tools <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">We Build</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            From calculators to automation tools - custom solutions for every business need
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Business Calculators',
                description: 'Custom calculators for pricing, ROI, financing, mortgages, loan payments, and more.',
                examples: ['Pricing calculator', 'ROI calculator', 'Quote generator', 'Savings calculator'],
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                title: 'Data Converters',
                description: 'Convert between formats, units, currencies, or data structures instantly.',
                examples: ['File converter', 'Unit converter', 'Currency converter', 'Data transformer'],
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                title: 'Report Generators',
                description: 'Automatically generate reports, invoices, contracts, or documents from data.',
                examples: ['Invoice generator', 'Report builder', 'PDF generator', 'Document creator'],
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Search & Filter Tools',
                description: 'Custom search interfaces for databases, inventories, or large datasets.',
                examples: ['Product finder', 'Database search', 'Inventory lookup', 'Advanced filters'],
                gradient: 'from-pink-500 to-rose-500'
              },
              {
                title: 'Form Builders',
                description: 'Interactive forms with conditional logic, validation, and multi-step workflows.',
                examples: ['Survey tools', 'Application forms', 'Quiz builders', 'Assessment tools'],
                gradient: 'from-rose-500 to-orange-500'
              },
              {
                title: 'Scheduling Tools',
                description: 'Appointment booking, resource scheduling, and calendar management systems.',
                examples: ['Booking system', 'Calendar tool', 'Availability checker', 'Time scheduler'],
                gradient: 'from-orange-500 to-amber-500'
              },
              {
                title: 'Data Analyzers',
                description: 'Analyze data, generate insights, visualize trends, and create dashboards.',
                examples: ['Analytics tool', 'Data visualizer', 'Trend analyzer', 'Dashboard builder'],
                gradient: 'from-amber-500 to-yellow-500'
              },
              {
                title: 'Comparison Tools',
                description: 'Side-by-side comparisons of products, plans, options, or alternatives.',
                examples: ['Product comparison', 'Plan compare', 'vs tool', 'Decision helper'],
                gradient: 'from-yellow-500 to-lime-500'
              },
              {
                title: 'Automation Scripts',
                description: 'Automate repetitive tasks, workflows, notifications, and data processing.',
                examples: ['Task automation', 'Workflow builder', 'Email automation', 'Data sync'],
                gradient: 'from-lime-500 to-emerald-500'
              },
            ].map((type, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${type.gradient} rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">{type.title}</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{type.description}</p>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 mb-2">Examples:</h4>
                  <div className="flex flex-wrap gap-1">
                    {type.examples.map((ex, i) => (
                      <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Every Tool <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Includes</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Professional features and seamless integration built into every custom tool
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Wrench, title: 'Custom Logic', description: 'Tailored algorithms and workflows specific to your business requirements.', color: 'blue' },
              { icon: Zap, title: 'Fast Performance', description: 'Optimized for speed with instant calculations and real-time updates.', color: 'indigo' },
              { icon: Shield, title: 'Secure & Reliable', description: 'Data encryption, validation, and error handling built-in.', color: 'purple' },
              { icon: Target, title: 'Easy to Use', description: 'Intuitive interface designed for your team to use without training.', color: 'pink' },
              { icon: RefreshCw, title: 'API Integration', description: 'Connect with your existing tools and systems seamlessly.', color: 'emerald' },
              { icon: FileText, title: 'Export Options', description: 'Download results as PDF, Excel, CSV, or other formats.', color: 'teal' },
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

      {/* Development Process */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Development <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Process</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            From concept to deployment in 1-2 weeks
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Requirements', description: 'Define functionality, inputs, outputs, and business logic.', deliverables: ['Scope doc', 'Wireframes'] },
              { step: '2', title: 'Development', description: 'Build the tool with custom algorithms and interface.', deliverables: ['Working tool', 'Testing'] },
              { step: '3', title: 'Integration', description: 'Connect with your systems and configure deployment.', deliverables: ['API setup', 'Config'] },
              { step: '4', title: 'Launch', description: 'Deploy, train your team, and provide documentation.', deliverables: ['Go live', 'Support'] },
            ].map((phase, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group text-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform mx-auto mb-4">
                  {phase.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{phase.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{phase.description}</p>
                <div className="space-y-1">
                  {phase.deliverables.map((item, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 text-xs text-slate-600">
                      <Check className="w-3 h-3 text-blue-600" />
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Flexible <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Transparent pricing based on complexity and features
          </p>
          <div className="bg-white rounded-2xl p-10 shadow-xl border border-slate-200">
            <h3 className="text-2xl font-bold mb-8 text-center text-slate-900">What Influences Cost:</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Complexity of calculations/logic</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Number of features/inputs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">API integrations needed</span>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Data storage requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">User authentication needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-lg p-1 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700">Custom design requirements</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-slate-200 pt-6">
              <p className="text-center text-slate-600 text-sm mb-4">
                Every tool is unique. Let's discuss your needs and provide a custom quote.
              </p>
              <Link 
                href="/contact"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg flex items-center justify-center gap-2 group"
              >
                Get Your Free Quote
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Automate Your Business?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop wasting time on repetitive tasks. Let's build a custom tool that saves hours every day and eliminates human error.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl group"
              >
                Discuss Your Tool Idea
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
