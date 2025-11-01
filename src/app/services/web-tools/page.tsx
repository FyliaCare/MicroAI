import type { Metadata } from 'next'
import Link from 'next/link'
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
    <main className="min-h-screen bg-black text-white">
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-20 right-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-20 left-20 animate-pulse delay-700"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/services" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 text-sm">
            ← Back to Services
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
            <span className="text-5xl sm:text-6xl md:text-7xl animate-float">🛠️</span>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Custom Web <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Tools & Utilities</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 mt-3 sm:mt-4">
                Powerful business tools that save time and automate processes, delivered in <span className="text-blue-500 font-bold">1-2 weeks</span>
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
                Why Build a <span className="text-blue-500">Custom Tool?</span>
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Off-the-shelf software rarely fits perfectly. Custom web tools are designed specifically for your business processes, eliminating manual work and reducing errors.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Whether it's a calculator for your sales team, a data converter for your workflow, or an automation tool for repetitive tasks - we build tools that solve real problems.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Best of all, web tools work everywhere - no installation, no downloads, just open a browser and use it.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Perfect For:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Sales teams needing custom calculators</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Businesses with repetitive manual tasks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Data processing and conversion needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Lead generation and engagement tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Workflow automation requirements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Types Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Types of Tools <span className="text-blue-500">We Build</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🧮',
                title: 'Business Calculators',
                description: 'Custom calculators for pricing, ROI, financing, mortgages, loan payments, and more.',
                examples: ['Pricing calculator', 'ROI calculator', 'Quote generator', 'Savings calculator']
              },
              {
                icon: '🔄',
                title: 'Data Converters',
                description: 'Convert between formats, units, currencies, or data structures instantly.',
                examples: ['File format converter', 'Unit converter', 'Currency converter', 'Data transformer']
              },
              {
                icon: '📊',
                title: 'Report Generators',
                description: 'Automatically generate reports, invoices, contracts, or documents from data.',
                examples: ['Invoice generator', 'Report builder', 'PDF generator', 'Document creator']
              },
              {
                icon: '🔍',
                title: 'Search & Filter Tools',
                description: 'Custom search interfaces for databases, inventories, or large datasets.',
                examples: ['Product finder', 'Database search', 'Inventory lookup', 'Advanced filters']
              },
              {
                icon: '📝',
                title: 'Form Builders',
                description: 'Interactive forms with conditional logic, validation, and multi-step workflows.',
                examples: ['Survey tools', 'Application forms', 'Quiz builders', 'Assessment tools']
              },
              {
                icon: '📅',
                title: 'Scheduling Tools',
                description: 'Appointment booking, availability checking, and calendar integration.',
                examples: ['Booking system', 'Availability checker', 'Appointment scheduler', 'Calendar tool']
              },
              {
                icon: '📧',
                title: 'Email Automation',
                description: 'Automated email sending, templates, campaigns, and tracking.',
                examples: ['Email sender', 'Template manager', 'Campaign tool', 'Auto-responder']
              },
              {
                icon: '🎯',
                title: 'Lead Generators',
                description: 'Interactive tools that capture leads while providing value to visitors.',
                examples: ['Assessment tools', 'Cost estimators', 'Configurators', 'Interactive quotes']
              },
              {
                icon: '📈',
                title: 'Data Analyzers',
                description: 'Process and analyze data with custom visualizations and insights.',
                examples: ['Data processor', 'Chart generator', 'Trend analyzer', 'Statistics tool']
              },
              {
                icon: '🖼️',
                title: 'Image Tools',
                description: 'Image processing, resizing, optimization, and manipulation tools.',
                examples: ['Image resizer', 'Logo generator', 'Watermark tool', 'Image optimizer']
              },
              {
                icon: '🔐',
                title: 'Generators',
                description: 'Generate passwords, codes, IDs, keys, or any custom content.',
                examples: ['Password generator', 'QR code creator', 'Barcode generator', 'ID maker']
              },
              {
                icon: '🌐',
                title: 'API Integrations',
                description: 'Connect external services and APIs into a unified interface.',
                examples: ['API dashboard', 'Data sync tool', 'Service connector', 'Integration hub']
              },
              {
                icon: '📦',
                title: 'Inventory Tools',
                description: 'Track, manage, and organize inventory, assets, or resources.',
                examples: ['Stock tracker', 'Asset manager', 'Resource planner', 'Inventory system']
              },
              {
                icon: '💰',
                title: 'Financial Tools',
                description: 'Budgeting, expense tracking, profit calculations, and financial planning.',
                examples: ['Budget planner', 'Expense tracker', 'Profit calculator', 'Finance dashboard']
              },
              {
                icon: '⏱️',
                title: 'Time Trackers',
                description: 'Time logging, timesheet management, and productivity tracking.',
                examples: ['Time logger', 'Timesheet tool', 'Task timer', 'Productivity tracker']
              },
            ].map((tool, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all">
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-400">{tool.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                <div className="space-y-1">
                  {tool.examples.map((example, i) => (
                    <div key={i} className="text-xs text-gray-500 flex items-center">
                      <span className="text-blue-500 mr-2">→</span>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Every Tool <span className="text-blue-500">Includes</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🎨',
                title: 'Custom Interface',
                description: 'Designed to match your brand and be intuitive for your users.'
              },
              {
                icon: '📱',
                title: 'Mobile Friendly',
                description: 'Works perfectly on phones, tablets, and desktops.'
              },
              {
                icon: '⚡',
                title: 'Fast Performance',
                description: 'Instant calculations and responses, no waiting.'
              },
              {
                icon: '💾',
                title: 'Data Export',
                description: 'Export results as PDF, Excel, CSV, or JSON.'
              },
              {
                icon: '📧',
                title: 'Email Integration',
                description: 'Send results via email automatically.'
              },
              {
                icon: '🔐',
                title: 'Secure & Private',
                description: 'Your data is encrypted and never shared.'
              },
              {
                icon: '📊',
                title: 'Usage Analytics',
                description: 'Track how your tool is being used.'
              },
              {
                icon: '🔄',
                title: 'Easy Updates',
                description: 'We can update formulas and logic anytime.'
              },
              {
                icon: '🎯',
                title: 'Lead Capture',
                description: 'Optional lead forms to capture user info.'
              },
              {
                icon: '🌐',
                title: 'API Access',
                description: 'Integrate with other systems via API.'
              },
              {
                icon: '📝',
                title: 'Validation',
                description: 'Input validation and error handling.'
              },
              {
                icon: '💬',
                title: 'Help & Tooltips',
                description: 'Built-in guidance for users.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Examples Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Real-World <span className="text-blue-500">Examples</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Solar Panel ROI Calculator',
                industry: 'Renewable Energy',
                description: 'Helps customers calculate savings from solar panel installation based on their location, energy usage, and system size.',
                features: ['Electricity cost input', 'System size calculator', '25-year projection', 'Tax incentive calculator', 'PDF report generation'],
                impact: 'Increased qualified leads by 340%'
              },
              {
                title: 'Construction Cost Estimator',
                industry: 'Construction',
                description: 'Generates instant estimates for construction projects based on materials, labor, location, and project complexity.',
                features: ['Material cost database', 'Labor rate calculator', 'Location adjustment', 'Itemized breakdown', 'Email quotes to clients'],
                impact: 'Saved 15 hours/week on estimates'
              },
              {
                title: 'E-commerce Shipping Calculator',
                industry: 'E-commerce',
                description: 'Real-time shipping cost calculations integrated with multiple carriers and automatic rate comparisons.',
                features: ['Multi-carrier integration', 'Weight-based pricing', 'Zone calculation', 'Bulk discounts', 'Tracking integration'],
                impact: 'Reduced shipping errors by 95%'
              },
              {
                title: 'HR Salary Benchmarking Tool',
                industry: 'Human Resources',
                description: 'Helps HR teams determine competitive salaries based on position, experience, location, and industry data.',
                features: ['Industry data integration', 'Experience calculator', 'Location adjuster', 'Benefits calculator', 'Comparison reports'],
                impact: 'Improved hiring success rate by 60%'
              },
            ].map((example, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-8 hover:border-blue-500 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-blue-400">{example.title}</h3>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">{example.industry}</span>
                </div>
                <p className="text-gray-300 mb-6">{example.description}</p>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {example.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start">
                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                  <p className="text-green-400 font-semibold text-sm">{example.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Development <span className="text-blue-500">Process</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Requirements',
                duration: '1-2 days',
                description: 'Understanding your workflow, logic, calculations, and desired features.'
              },
              {
                step: '2',
                title: 'Design & Build',
                duration: '3-5 days',
                description: 'Creating the interface and implementing the logic with your feedback.'
              },
              {
                step: '3',
                title: 'Testing',
                duration: '2-3 days',
                description: 'Thorough testing with real data and edge cases to ensure accuracy.'
              },
              {
                step: '4',
                title: 'Deployment',
                duration: '1 day',
                description: 'Launching the tool, training your team, and providing documentation.'
              },
            ].map((phase, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-blue-400 font-bold text-xl">
                  {phase.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{phase.title}</h3>
                <p className="text-blue-400 text-sm mb-3">{phase.duration}</p>
                <p className="text-gray-400 text-sm">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">
            Transparent <span className="text-blue-500">Pricing</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Pricing depends on complexity, but most tools fall into these ranges:
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                type: 'Simple Tool',
                description: 'Basic calculator or converter',
                timeline: '3-5 days',
                examples: ['Unit converter', 'Simple calculator', 'Basic form']
              },
              {
                type: 'Standard Tool',
                description: 'Multi-step logic with data handling',
                timeline: '1-2 weeks',
                examples: ['ROI calculator', 'Quote generator', 'Report builder']
              },
              {
                type: 'Advanced Tool',
                description: 'Complex logic, integrations, databases',
                timeline: '2-3 weeks',
                examples: ['API integration', 'Data analyzer', 'Full workflow tool']
              },
            ].map((tier, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all">
                <h3 className="text-xl font-semibold mb-2 text-blue-400">{tier.type}</h3>
                <p className="text-gray-400 text-sm mb-3">{tier.description}</p>
                <p className="text-blue-400 text-sm mb-4 font-semibold">{tier.timeline}</p>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-2">Examples:</p>
                  {tier.examples.map((example, i) => (
                    <div key={i} className="text-xs text-gray-400 flex items-center">
                      <span className="text-blue-500 mr-2">→</span>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
            <p className="text-gray-400 mb-6">
              <span className="text-white font-semibold">Not sure what you need?</span><br />
              Describe your problem and we'll recommend the right solution.
            </p>
            <Link 
              href="/contact"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium text-lg"
            >
              Discuss Your Tool →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Automate Your Business Processes</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Stop wasting time on manual tasks. Let's build a tool that saves hours every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Build Your Tool →
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
