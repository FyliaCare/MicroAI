import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Check, Palette, Smartphone, Zap, Search, Shield, TrendingUp, ArrowRight, Globe, Users, Star } from 'lucide-react'
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-pink-200/40 rounded-full blur-3xl top-20 left-20"></div>
          <div className="absolute w-96 h-96 bg-blue-200/40 rounded-full blur-3xl bottom-20 right-20"></div>
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
              <Palette className="w-10 h-10 text-pink-600" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700">
              Beautiful, High-Converting Websites
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-blue-600 bg-clip-text text-transparent">Professional Website</span><br />
            Development
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
            High-converting websites that make lasting impressions, delivered in <span className="font-bold text-pink-600">3-5 days</span>. Custom design, mobile responsive, SEO optimized.
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
                  Your Website is Your <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Digital Storefront</span>
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                  In today's digital world, your website is often the first impression potential customers have of your business. A professional website establishes credibility, showcases your expertise, and converts visitors into customers.
                </p>
                <p className="text-slate-600 leading-relaxed text-lg">
                  We don't just build websites - we create powerful marketing tools that work 24/7 to grow your business.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-pink-600" />
                    <span className="text-sm font-medium text-slate-600">Fast Delivery</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">3-5 Days</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-medium text-slate-600">Responsive</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">All Devices</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-600">SEO Ready</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">Built-in</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-slate-600">Design</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">Custom</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <div className="bg-gradient-to-br from-pink-600 via-rose-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
                  <h3 className="text-2xl font-bold mb-6">Perfect For:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Small & Medium Businesses</div>
                        <div className="text-pink-100 text-sm">Establish your online presence</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Professionals & Consultants</div>
                        <div className="text-pink-100 text-sm">Showcase your expertise</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Restaurants & Local Services</div>
                        <div className="text-pink-100 text-sm">Attract more customers</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <Star className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">E-commerce Stores</div>
                        <div className="text-pink-100 text-sm">Sell products online</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-lg p-1 mt-0.5">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Portfolio & Personal Brands</div>
                        <div className="text-pink-100 text-sm">Stand out from the crowd</div>
                      </div>
                    </li>
                  </ul>
                  <Link
                    href="/contact"
                    className="mt-8 w-full bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Get Your Free Quote
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Website Types Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Types of Websites <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">We Build</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            From corporate sites to e-commerce stores - we craft websites tailored to your industry
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Corporate Website',
                description: 'Professional business website showcasing your company, services, team, and values.',
                pages: ['Home', 'About', 'Services', 'Team', 'Contact'],
                ideal: 'B2B companies, agencies',
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                title: 'Landing Page',
                description: 'Single-page website focused on one goal - capturing leads or driving sales.',
                pages: ['Hero', 'Features', 'Benefits', 'CTA'],
                ideal: 'Product launches, campaigns',
                gradient: 'from-indigo-500 to-purple-500'
              },
              {
                title: 'Portfolio Website',
                description: 'Showcase your work, skills, and achievements with a stunning portfolio.',
                pages: ['Portfolio', 'About', 'Services', 'Contact'],
                ideal: 'Designers, photographers',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'E-commerce Store',
                description: 'Sell products online with shopping cart, payment processing, and inventory.',
                pages: ['Shop', 'Product', 'Cart', 'Checkout'],
                ideal: 'Retailers, product sellers',
                gradient: 'from-pink-500 to-rose-500'
              },
              {
                title: 'Restaurant Website',
                description: 'Menu display, online reservations, ordering, and location information.',
                pages: ['Menu', 'Reservations', 'Gallery', 'Contact'],
                ideal: 'Restaurants, cafes',
                gradient: 'from-rose-500 to-orange-500'
              },
              {
                title: 'Blog / Magazine',
                description: 'Content-rich website with articles, categories, search, and subscriptions.',
                pages: ['Articles', 'Categories', 'Authors', 'About'],
                ideal: 'Content creators, publishers',
                gradient: 'from-orange-500 to-amber-500'
              },
              {
                title: 'Real Estate Website',
                description: 'Property listings, search filters, virtual tours, and agent profiles.',
                pages: ['Listings', 'Search', 'Agents', 'Contact'],
                ideal: 'Real estate agents',
                gradient: 'from-amber-500 to-emerald-500'
              },
              {
                title: 'Educational Website',
                description: 'Course listings, enrollment, resources, and student portal.',
                pages: ['Courses', 'Enrollment', 'Resources'],
                ideal: 'Schools, training centers',
                gradient: 'from-emerald-500 to-teal-500'
              },
              {
                title: 'Non-Profit Website',
                description: 'Mission showcase, donation processing, volunteer signup, and news.',
                pages: ['Mission', 'Donate', 'Volunteer', 'Impact'],
                ideal: 'Charities, NGOs',
                gradient: 'from-teal-500 to-cyan-500'
              },
            ].map((type, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${type.gradient} rounded-lg mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">{type.title}</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{type.description}</p>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-slate-500 mb-2">Typical Pages:</h4>
                  <div className="flex flex-wrap gap-1">
                    {type.pages.map((page, i) => (
                      <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">
                        {page}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic">Ideal for: {type.ideal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Every Website <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Includes</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Professional features and modern technologies built into every website we create
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Palette, title: 'Custom Design', description: 'Unique, modern design tailored to your brand - no templates, no cookie-cutter solutions.', color: 'pink' },
              { icon: Smartphone, title: 'Mobile Responsive', description: 'Perfect display on all devices - desktop, tablet, and mobile. Tested on real devices.', color: 'rose' },
              { icon: Zap, title: 'Lightning Fast', description: 'Optimized for speed with <1 second load times. Fast websites rank better and convert more.', color: 'blue' },
              { icon: Search, title: 'SEO Optimized', description: 'Built-in SEO best practices, meta tags, sitemaps, and schema markup for better rankings.', color: 'indigo' },
              { icon: Shield, title: 'SSL Certificate', description: 'Secure HTTPS encryption included. Builds trust and required for modern browsers.', color: 'purple' },
              { icon: Globe, title: 'Custom Domain', description: 'Connect your domain (yourcompany.com) with professional email setup available.', color: 'emerald' },
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

      {/* Design Process */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Our Design <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Process</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Streamlined 5-day process from concept to launch
          </p>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { day: '1', title: 'Discovery', description: 'Understanding your business, goals, target audience, and preferences.' },
              { day: '2', title: 'Design', description: 'Creating beautiful mockups and layouts based on your brand.' },
              { day: '3', title: 'Development', description: 'Building the website with clean, optimized code.' },
              { day: '4', title: 'Content', description: 'Adding your content, images, and optimizing everything.' },
              { day: '5', title: 'Launch', description: 'Final testing, training, and going live!' },
            ].map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group text-center">
                <div className="bg-gradient-to-br from-pink-500 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform mx-auto mb-4">
                  {step.day}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
            Simple, Transparent <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Professional websites without the premium price tag. Get more value for your investment.
          </p>
          <div className="bg-white rounded-2xl p-10 shadow-xl border border-slate-200">
            <h3 className="text-2xl font-bold mb-8 text-center text-slate-900">Flexible Packages:</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { type: 'Basic', pages: 'Up to 5 pages', timeline: '3-4 days' },
                { type: 'Business', pages: 'Up to 10 pages', timeline: '4-5 days' },
                { type: 'E-commerce', pages: 'Unlimited', timeline: '5-7 days' },
              ].map((plan, idx) => (
                <div key={idx} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <h4 className="text-xl font-bold mb-2 text-pink-600">{plan.type}</h4>
                  <p className="text-slate-600 text-sm mb-1">{plan.pages}</p>
                  <p className="text-blue-600 text-sm font-semibold">{plan.timeline}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-6">
              <p className="text-center text-slate-600 text-sm mb-4">
                Every project is unique. Contact us for a custom quote tailored to your needs.
              </p>
              <Link 
                href="/contact"
                className="w-full bg-gradient-to-r from-pink-600 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-pink-700 hover:to-blue-700 transition-all font-semibold text-lg flex items-center justify-center gap-2 group"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready for a Website That Converts?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop losing customers to competitors with better websites. 
              Let's build you a professional online presence that drives results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:from-pink-700 hover:to-blue-700 transition-all shadow-xl hover:shadow-2xl group"
              >
                Start Your Website
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
