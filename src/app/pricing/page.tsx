'use client'

import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'
import PricingCalculator from '@/components/PricingCalculator'

export default function PricingPage() {

  const packages = [
    {
      name: 'Corporate Website',
      icon: '🌐',
      setupFee: '$2,200',
      setupFeeGHS: 'GHS 33,000',
      monthly: '$120',
      monthlyGHS: 'GHS 1,800',
      timeline: '2-3 weeks',
      features: [
        'Responsive 5-10 page design',
        'Custom domain & hosting',
        'Content management system',
        'Business email setup',
        'SEO optimization',
        'Google Analytics',
        'SSL security',
        'Monthly maintenance',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Web Tool / Dashboard',
      icon: '🛠️',
      setupFee: '$3,500',
      setupFeeGHS: 'GHS 52,500',
      monthly: '$180',
      monthlyGHS: 'GHS 2,700',
      timeline: '3-5 weeks',
      features: [
        'Custom dashboard UI',
        'Secure authentication',
        'PostgreSQL database',
        'Admin portal',
        'Email notifications',
        'Activity tracking',
        'Daily backups',
        'Domain & SSL',
      ],
      color: 'from-purple-500 to-pink-500',
      popular: true,
    },
    {
      name: 'Web Application',
      icon: '💻',
      setupFee: '$8,000',
      setupFeeGHS: 'GHS 120,000',
      monthly: '$250',
      monthlyGHS: 'GHS 3,750',
      timeline: '6-8 weeks',
      features: [
        'Full-stack application',
        'Multi-user authentication',
        'Database with backups',
        'Payment integration',
        'Analytics dashboard',
        'Automated emails',
        'High-performance hosting',
        'Code updates & patches',
      ],
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'SaaS Platform',
      icon: '☁️',
      setupFee: '$18,000',
      setupFeeGHS: 'GHS 270,000',
      monthly: '$450',
      monthlyGHS: 'GHS 6,750',
      timeline: '10-14 weeks',
      features: [
        'Scalable cloud architecture',
        'Multi-tenant SaaS',
        'Stripe/Paystack billing',
        'Custom admin dashboards',
        'Automated workflows',
        'Advanced analytics',
        'Monitoring & backups',
        'Continuous support',
      ],
      color: 'from-green-500 to-teal-500',
    },
  ]

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Advanced Navigation */}
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-40 right-20 animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/50 rounded-full px-6 py-2 backdrop-blur-sm">
              <span className="text-green-400 text-sm font-semibold">💰 Transparent Pricing • No Hidden Fees</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fadeIn delay-200">
            Simple, <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">Transparent</span> Pricing
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeIn delay-500 px-4">
            Professional development packages with upfront costs. No surprises, no hidden charges.
          </p>
        </div>
      </section>

      {/* Interactive Calculator */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <PricingCalculator />
        </div>
      </section>

      {/* Package Cards */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Choose Your <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Package</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
              All packages include hosting, maintenance, and support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-gray-900 border ${
                  pkg.popular ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-gray-800'
                } rounded-2xl p-6 hover:border-blue-500 transition-all hover-lift`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      ⭐ MOST POPULAR
                    </div>
                  </div>
                )}

                <div className={`w-16 h-16 bg-gradient-to-br ${pkg.color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                  {pkg.icon}
                </div>

                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-sm text-gray-400 mb-4">{pkg.timeline}</div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">{pkg.setupFee}</div>
                  <div className="text-sm text-gray-500">{pkg.setupFeeGHS}</div>
                  <div className="text-xs text-gray-600 mt-1">One-time setup</div>
                </div>

                <div className="mb-6">
                  <div className="text-xl font-semibold text-blue-400">{pkg.monthly}/mo</div>
                  <div className="text-xs text-gray-500">{pkg.monthlyGHS}/mo</div>
                  <div className="text-xs text-gray-600">Monthly maintenance</div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`block w-full text-center bg-gradient-to-r ${pkg.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Frequently Asked <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Questions</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'What does the setup fee include?',
                a: 'The setup fee covers complete development, design, testing, deployment, domain setup, SSL configuration, and initial content upload. It\'s a one-time cost with no recurring charges.',
              },
              {
                q: 'What does monthly maintenance cover?',
                a: 'Monthly maintenance includes hosting, security updates, bug fixes, content updates, backups, monitoring, and technical support. Your site stays secure and up-to-date.',
              },
              {
                q: 'Can I upgrade my package later?',
                a: 'Absolutely! You can upgrade to a higher package anytime. We\'ll credit your existing setup fee and only charge the difference.',
              },
              {
                q: 'Do you offer payment plans?',
                a: 'Yes! We offer flexible payment plans. Contact us to discuss options that work for your budget.',
              },
              {
                q: 'What if I need custom features?',
                a: 'Use our calculator above to estimate custom requirements. We\'ll provide a detailed quote based on your specific needs.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Get <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Started</span>?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Contact us today for a detailed quote tailored to your project
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl"
          >
            📧 Contact Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
