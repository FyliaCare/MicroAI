import type { Metadata } from 'next'
import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'
import CTAButton from '@/components/CTAButton'

export const metadata: Metadata = {
  title: 'Portfolio - MicroAI Systems | Enterprise Solutions Delivered',
  description: 'Explore our portfolio of live enterprise web applications including CRM systems, e-commerce platforms, FinTech solutions, and business advisory platforms built with cutting-edge technology.',
  keywords: [
    'web development portfolio',
    'enterprise web applications',
    'CRM development',
    'e-commerce platform',
    'FinTech development',
    'business platforms',
    'Next.js projects',
    'live web applications',
  ],
}

const projects = [
  {
    id: 1,
    title: 'Taadiway CRM',
    category: 'Enterprise CRM System',
    tagline: 'Complete Business Management Solution',
    description: 'Comprehensive CRM and business management platform for modern enterprises. Features advanced customer relationship management, sales pipeline tracking, project management, team collaboration tools, automated workflows, and powerful analytics dashboard. Built for scalability with role-based access control and multi-tenant architecture.',
    technologies: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'NextAuth', 'Tailwind CSS', 'Real-time Updates', 'Advanced Analytics'],
    icon: '📊',
    status: 'Live',
    url: 'https://taadiway-crm.onrender.com',
    gradient: 'from-blue-600 to-indigo-600',
    features: [
      'Customer relationship management',
      'Sales pipeline & funnel tracking',
      'Project & task management',
      'Team collaboration workspace',
      'Automated workflow engine',
      'Advanced reporting & analytics',
      'Role-based access control',
      'Multi-tenant architecture',
      'Email integration & automation',
      'Custom fields & forms',
      'API access & webhooks',
      'Mobile-responsive design'
    ],
    stats: [
      { label: 'Delivery Time', value: '2 weeks' },
      { label: 'Features', value: '50+' },
      { label: 'User Roles', value: '8 levels' }
    ]
  },
  {
    id: 2,
    title: 'Auxilium Consult',
    category: 'Business Advisory Platform',
    tagline: 'Bridging African Businesses to Global Capital',
    description: 'Professional business advisory and investment facilitation platform connecting credible African businesses with global investors. Features project portfolio showcase, investment structuring tools, client portal for deal tracking, partner network management, and comprehensive advisory services across energy, agribusiness, mining, and industry sectors.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma ORM', 'SEO Optimized', 'Admin Dashboard', 'Client Portal'],
    icon: '🤝',
    status: 'Live',
    url: 'https://auxilium-consult.onrender.com',
    gradient: 'from-purple-600 to-blue-600',
    features: [
      'Investment portfolio showcase',
      'Project structuring framework',
      'Client relationship management',
      'Partner network directory',
      'Advisory services catalog',
      'Success stories & testimonials',
      'Multi-sector coverage (4 sectors)',
      'Professional admin dashboard',
      'Secure client portal access',
      'Contact & inquiry system',
      'Document management',
      'Responsive corporate design'
    ],
    stats: [
      { label: 'Delivery Time', value: '3 weeks' },
      { label: 'Sectors Covered', value: '4' },
      { label: 'Portfolio Projects', value: '5+' }
    ]
  },
  {
    id: 3,
    title: 'DDS & TTS Tech Hive',
    category: 'E-commerce Platform',
    tagline: 'Your Trusted Tech Partner in Ghana',
    description: 'Full-featured e-commerce platform for electronics retail and repair services. Complete product catalog with 500+ items including phones, laptops, gaming consoles, and accessories. Features advanced search and filtering, shopping cart, secure checkout, inventory management, repair service booking, flash sales system, customer reviews, and comprehensive admin dashboard.',
    technologies: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Payment Gateway', 'Inventory System', 'Order Management', 'Real-time Sync'],
    icon: '🛒',
    status: 'Live',
    url: 'https://dds-tts-tech-hive.onrender.com',
    gradient: 'from-cyan-500 to-blue-600',
    features: [
      '500+ product catalog',
      'Advanced search & filters',
      'Shopping cart & wishlist',
      'Secure payment processing',
      'Inventory management system',
      'Order tracking & history',
      'Repair service booking',
      'Flash sales & promotions',
      'Customer reviews & ratings',
      'Multi-category organization',
      'Admin dashboard & analytics',
      'Mobile-optimized shopping'
    ],
    stats: [
      { label: 'Delivery Time', value: '2 weeks' },
      { label: 'Products', value: '500+' },
      { label: 'Categories', value: '8' }
    ]
  },
  {
    id: 4,
    title: 'PoultryYield',
    category: 'FinTech Investment Platform',
    tagline: 'Invest in Poultry. Earn Real-World Yield.',
    description: 'Revolutionary agricultural investment platform enabling transparent poultry farming investments. Dual investment products (Egg Note for monthly income, Chicken Note for 7-8 week cycles). Features include KYC verification, wallet management, live batch tracking with daily performance metrics and photos, automated payout system, mobile money integration, auto-reinvest options, and complete transparency with risk disclosures.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Payment Gateway', 'KYC System', 'Real-time Analytics', 'Escrow Management', 'Mobile Money API'],
    icon: '🐣',
    status: 'Live',
    url: 'https://poultry-investment-frontend.onrender.com',
    gradient: 'from-green-500 to-emerald-600',
    features: [
      'Dual investment products',
      'KYC & identity verification',
      'Digital wallet system',
      'Live batch performance tracking',
      'Daily metrics & photo logs',
      'Automated payout system',
      'Mobile money integration',
      'Bank transfer support',
      'Auto-reinvest & compounding',
      'Investor portfolio dashboard',
      'Risk disclosure system',
      'Farm performance analytics'
    ],
    stats: [
      { label: 'Egg ROI', value: '1% monthly' },
      { label: 'Chicken ROI', value: '18% per cycle' },
      { label: 'Cycle Duration', value: '7-8 weeks' }
    ]
  }
]

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Advanced Navigation */}
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 px-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-64 md:w-96 h-64 md:h-96 bg-blue-500/20 rounded-full blur-3xl top-10 md:top-20 left-10 md:left-20 animate-pulse" style={{ transform: 'translate3d(0,0,0)' }}></div>
          <div className="absolute w-64 md:w-96 h-64 md:h-96 bg-purple-500/20 rounded-full blur-3xl top-20 md:top-40 right-10 md:right-20 animate-pulse delay-700" style={{ transform: 'translate3d(0,0,0)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 md:mb-6 animate-fadeIn mobile-card-enter">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-full px-4 md:px-6 py-1.5 md:py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-blue-400 text-xs md:text-sm font-semibold">🚀 4 Live Enterprise Projects in Production</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight animate-fadeIn delay-200">
            Enterprise <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">Portfolio</span>
          </h1>
          
          <p className="text-sm md:text-lg lg:text-xl text-gray-400 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeIn delay-500">
            Live, production-grade applications serving real businesses. From CRM systems to FinTech platforms, 
            <span className="text-blue-500 font-bold"> these are the solutions we deliver</span> at 10x speed with enterprise quality.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 md:gap-8">
            {projects.map((project, idx) => (
              <div 
                key={project.id}
                className={`group relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500 transition-all hover-lift animate-fadeIn mobile-card ${
                  idx === 0 ? '' : 'delay-200'
                }`}
              >
                {/* Gradient overlay */}
                <div className={`absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l ${project.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="relative p-5 md:p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Left: Project Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${project.gradient} rounded-xl flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform animate-float`}>
                          {project.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-xl md:text-2xl font-bold">{project.title}</h3>
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-semibold rounded-full border border-green-500/50 animate-pulse-glow whitespace-nowrap">
                              ● {project.status}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-400 leading-tight">{project.tagline}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className={`inline-block px-3 py-0.5 bg-gradient-to-r ${project.gradient} bg-opacity-20 border border-blue-500/30 rounded-full text-xs font-medium mb-3`}>
                          {project.category}
                        </span>
                        <p className="text-gray-300 leading-relaxed text-sm">
                          {project.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wide">Key Features</h4>
                        <div className="grid grid-cols-2 gap-1.5">
                          {project.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-1.5">
                              <span className="text-blue-500 mt-0.5 text-xs flex-shrink-0">✓</span>
                              <span className="text-xs text-gray-400 leading-snug">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wide">Technology Stack</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech, index) => (
                            <span 
                              key={index}
                              className="px-2 py-0.5 bg-gray-800 border border-gray-700 text-gray-300 text-[10px] rounded-md hover:border-purple-500 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions & Stats */}
                    <div className="flex flex-col justify-between">
                      <div className="space-y-3">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block w-full text-center bg-gradient-to-r ${project.gradient} text-white px-4 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all text-sm mobile-active-state touch-manipulation`}
                        >
                          🌐 Visit Live Site
                        </a>
                        <Link
                          href="/contact"
                          className="block w-full text-center border-2 border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg font-semibold hover:border-blue-500 hover:text-white transition-all text-sm mobile-active-state touch-manipulation"
                        >
                          📬 Get Similar Project
                        </Link>
                      </div>

                      {/* Stats */}
                      {project.stats && (
                        <div className="mt-6 grid grid-cols-3 gap-2">
                          {project.stats.map((stat, statIdx) => (
                            <div key={statIdx} className="text-center p-2.5 bg-gray-800/50 rounded-lg border border-gray-700">
                              <div className={`text-base md:text-lg font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                                {stat.value}
                              </div>
                              <div className="text-[10px] text-gray-500">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Our Track Record</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                  4
                </div>
                <div className="text-sm text-gray-400">Live Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
                  10x
                </div>
                <div className="text-sm text-gray-400">Faster Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                  2-3wk
                </div>
                <div className="text-sm text-gray-400">Avg Timeline</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto animate-scaleIn">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden animate-gradient">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Ready to Join Our Success Stories?
              </h2>
              <p className="text-base md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Let&apos;s build your enterprise-grade solution together. Get the same quality, 
                speed, and results as our portfolio projects.
              </p>
              <CTAButton className="inline-block bg-white text-blue-600 px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl hover-lift">
                Start Your Project →
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
