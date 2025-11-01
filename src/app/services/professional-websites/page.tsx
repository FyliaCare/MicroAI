import type { Metadata } from 'next'
import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Professional Website Design & Development in 3-5 Days | MicroAI Systems',
  description: 'High-converting professional websites in 3-5 days. Corporate sites, e-commerce, portfolios, restaurants, real estate, educational sites & more. Custom design, mobile responsive, SEO optimized, CMS included, SSL certificate. Modern Next.js websites with lightning-fast performance.',
  keywords: [
    'professional website design',
    'website development',
    'custom website design',
    'corporate website design',
    'business website development',
    'e-commerce website',
    'portfolio website design',
    'restaurant website design',
    'real estate website',
    'responsive website design',
    'SEO optimized websites',
    'fast website development',
    'modern website design',
    'Next.js website',
  ],
  openGraph: {
    title: 'Professional Website Design & Development - Ready in 3-5 Days',
    description: 'Corporate, E-commerce, Portfolio, Restaurant, Real Estate websites. Custom design, mobile responsive, SEO optimized, CMS included.',
    url: '/services/professional-websites',
    type: 'website',
  },
  alternates: {
    canonical: '/services/professional-websites',
  },
}

export default function ProfessionalWebsitesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl bottom-20 right-20 animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/services" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 text-sm">
            ← Back to Services
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
            <span className="text-5xl sm:text-6xl md:text-7xl animate-float">🎨</span>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Professional <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">Website</span> Development
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 mt-3 sm:mt-4">
                High-converting websites that make lasting impressions, delivered in <span className="text-pink-500 font-bold">3-5 days</span>
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
                Your Website is Your <span className="text-pink-500">Digital Storefront</span>
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                In today's digital world, your website is often the first impression potential customers have of your business. A professional website establishes credibility, showcases your expertise, and converts visitors into customers.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We don't just build websites - we create powerful marketing tools that work 24/7 to grow your business.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-900/20 to-blue-900/20 border border-pink-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4 text-pink-400">Perfect For:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Small & medium businesses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Professionals & consultants</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Restaurants & local services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">E-commerce stores</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-300">Portfolio & personal brands</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Website Types Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Types of Websites <span className="text-pink-500">We Build</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Corporate Website',
                description: 'Professional business website showcasing your company, services, team, and values.',
                pages: ['Home', 'About', 'Services', 'Team', 'Contact'],
                ideal: 'B2B companies, agencies, consultancies'
              },
              {
                title: 'Landing Page',
                description: 'Single-page website focused on one goal - capturing leads or driving sales.',
                pages: ['Hero', 'Features', 'Benefits', 'Testimonials', 'CTA'],
                ideal: 'Product launches, lead generation'
              },
              {
                title: 'Portfolio Website',
                description: 'Showcase your work, skills, and achievements with a stunning portfolio.',
                pages: ['Portfolio', 'About', 'Services', 'Testimonials', 'Contact'],
                ideal: 'Designers, photographers, artists'
              },
              {
                title: 'E-commerce Store',
                description: 'Sell products online with shopping cart, payment processing, and inventory.',
                pages: ['Shop', 'Product Pages', 'Cart', 'Checkout', 'Account'],
                ideal: 'Retailers, product sellers'
              },
              {
                title: 'Restaurant Website',
                description: 'Menu display, online reservations, ordering, and location information.',
                pages: ['Menu', 'Reservations', 'Gallery', 'About', 'Contact'],
                ideal: 'Restaurants, cafes, food services'
              },
              {
                title: 'Blog / Magazine',
                description: 'Content-rich website with articles, categories, search, and subscriptions.',
                pages: ['Articles', 'Categories', 'Authors', 'Subscribe', 'About'],
                ideal: 'Content creators, publishers'
              },
              {
                title: 'Real Estate Website',
                description: 'Property listings, search filters, virtual tours, and agent profiles.',
                pages: ['Listings', 'Search', 'Agents', 'About', 'Contact'],
                ideal: 'Real estate agents, agencies'
              },
              {
                title: 'Educational Website',
                description: 'Course listings, enrollment, resources, and student portal.',
                pages: ['Courses', 'Enrollment', 'Resources', 'About', 'Contact'],
                ideal: 'Schools, training centers'
              },
              {
                title: 'Non-Profit Website',
                description: 'Mission showcase, donation processing, volunteer signup, and news.',
                pages: ['Mission', 'Donate', 'Volunteer', 'Impact', 'Contact'],
                ideal: 'Charities, NGOs, foundations'
              },
            ].map((type, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-pink-500 transition-all">
                <h3 className="text-xl font-semibold mb-3 text-pink-400">{type.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{type.description}</p>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">Typical Pages:</h4>
                  <div className="flex flex-wrap gap-1">
                    {type.pages.map((page, i) => (
                      <span key={i} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">
                        {page}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic">Ideal for: {type.ideal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Every Website <span className="text-pink-500">Includes</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'Custom Design',
                description: 'Unique, modern design tailored to your brand - no templates, no cookie-cutter solutions.'
              },
              {
                icon: '📱',
                title: 'Mobile Responsive',
                description: 'Perfect display on all devices - desktop, tablet, and mobile. Tested on real devices.'
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Optimized for speed with <1 second load times. Fast websites rank better and convert more.'
              },
              {
                icon: '🔍',
                title: 'SEO Optimized',
                description: 'Built-in SEO best practices, meta tags, sitemaps, and schema markup for better rankings.'
              },
              {
                icon: '✏️',
                title: 'Easy to Update',
                description: 'Content management system included. Update text, images, and pages without coding.'
              },
              {
                icon: '🔐',
                title: 'SSL Certificate',
                description: 'Secure HTTPS encryption included. Builds trust and required for modern browsers.'
              },
              {
                icon: '📧',
                title: 'Contact Forms',
                description: 'Functional contact forms with spam protection, email notifications, and validation.'
              },
              {
                icon: '📊',
                title: 'Analytics Setup',
                description: 'Google Analytics configured to track visitors, traffic sources, and user behavior.'
              },
              {
                icon: '🌐',
                title: 'Custom Domain',
                description: 'Connect your domain (yourcompany.com) with professional email setup available.'
              },
              {
                icon: '♿',
                title: 'Accessibility',
                description: 'WCAG compliant for users with disabilities. Proper contrast, alt tags, and keyboard navigation.'
              },
              {
                icon: '🔄',
                title: 'Regular Backups',
                description: 'Automated daily backups ensure your data is always safe and recoverable.'
              },
              {
                icon: '🛡️',
                title: 'Security Hardened',
                description: 'Protected against common attacks, regular security updates, and monitoring.'
              },
              {
                icon: '💬',
                title: 'Live Chat Widget',
                description: 'Optional chat widget integration for real-time customer support.'
              },
              {
                icon: '🎬',
                title: 'Video Integration',
                description: 'Embed YouTube, Vimeo, or custom videos optimized for fast loading.'
              },
              {
                icon: '🗺️',
                title: 'Google Maps',
                description: 'Interactive map showing your location, directions, and contact information.'
              },
              {
                icon: '📱',
                title: 'Social Media Links',
                description: 'Integration with your social media profiles and shareable content.'
              },
              {
                icon: '📰',
                title: 'Newsletter Signup',
                description: 'Email list building with integration to Mailchimp, ConvertKit, or similar.'
              },
              {
                icon: '🎯',
                title: 'Call-to-Action',
                description: 'Strategic placement of buttons and forms to maximize conversions.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-pink-500 transition-all">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Process */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Design <span className="text-pink-500">Process</span>
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                day: 'Day 1',
                title: 'Discovery',
                description: 'Understanding your business, goals, target audience, and preferences.'
              },
              {
                day: 'Day 2',
                title: 'Design',
                description: 'Creating beautiful mockups and layouts based on your brand.'
              },
              {
                day: 'Day 3',
                title: 'Development',
                description: 'Building the website with clean, optimized code.'
              },
              {
                day: 'Day 4',
                title: 'Content',
                description: 'Adding your content, images, and optimizing everything.'
              },
              {
                day: 'Day 5',
                title: 'Launch',
                description: 'Final testing, training, and going live!'
              },
            ].map((step, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 text-center hover:border-pink-500 transition-all">
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg px-3 py-1 inline-block mb-3 text-pink-400 font-bold text-sm">
                  {step.day}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">
            Simple, Transparent <span className="text-pink-500">Pricing</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Professional websites without the premium price tag. Get more value for your investment.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                type: 'Basic Website',
                pages: 'Up to 5 pages',
                timeline: '3-4 days',
                features: ['Custom design', 'Mobile responsive', 'Contact form', 'SEO basics', 'SSL certificate']
              },
              {
                type: 'Business Website',
                pages: 'Up to 10 pages',
                timeline: '4-5 days',
                features: ['Everything in Basic', 'CMS integration', 'Blog functionality', 'Advanced SEO', 'Analytics']
              },
              {
                type: 'E-commerce',
                pages: 'Unlimited',
                timeline: '5-7 days',
                features: ['Everything in Business', 'Shopping cart', 'Payment gateway', 'Inventory', 'Order management']
              },
            ].map((plan, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-pink-500 transition-all">
                <h3 className="text-xl font-semibold mb-2 text-pink-400">{plan.type}</h3>
                <p className="text-gray-400 text-sm mb-1">{plan.pages}</p>
                <p className="text-blue-400 text-sm mb-4">{plan.timeline}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
            <p className="text-gray-400 mb-4">
              Every project is unique. Contact us for a custom quote tailored to your needs.
            </p>
            <Link 
              href="/contact"
              className="inline-block bg-gradient-to-r from-pink-600 to-blue-600 text-white px-10 py-4 rounded-lg hover:from-pink-700 hover:to-blue-700 transition-all font-medium text-lg"
            >
              Get Your Free Quote →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-pink-600 to-blue-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready for a Website That Converts?</h2>
              <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
                Stop losing customers to competitors with better websites. 
                Let's build you a professional online presence that drives results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-block bg-white text-pink-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Start Your Website →
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
