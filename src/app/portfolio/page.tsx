import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Portfolio - MicroAI | Real Projects Delivered',
  description: 'Explore our portfolio of live, successful web applications and platforms built with cutting-edge technology.',
}

const projects = [
  {
    id: 1,
    title: 'Golden Errands',
    category: 'Delivery Platform',
    tagline: 'We Deliver with Passion!',
    description: 'A comprehensive delivery and logistics platform serving Ghana with food delivery, parcel services, grocery shopping, pharmaceutical delivery, and custom errands. Features real-time tracking, rider management, and multi-service integration.',
    technologies: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Real-time Tracking', 'Payment Integration'],
    icon: '�',
    status: 'Live',
    url: 'https://golden-errands-1.onrender.com',
    gradient: 'from-orange-500 to-red-500',
    features: [
      'Multi-service delivery platform',
      'Real-time order tracking',
      'Rider management system',
      'Payment processing',
      'Customer & driver apps',
      'Admin dashboard'
    ]
  },
  {
    id: 2,
    title: 'Ricks Energy',
    category: 'Corporate Website',
    tagline: 'Powering Africa\'s Energy Excellence',
    description: 'Professional corporate platform for a leading African energy services provider specializing in rope access, NDT testing, fabric maintenance, and oil & gas services. Features service showcases, project portfolios, and safety compliance information.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'SEO Optimized', 'Responsive Design'],
    icon: '⚡',
    status: 'Live',
    url: 'https://ricks-energy.onrender.com',
    gradient: 'from-blue-600 to-cyan-500',
    features: [
      'ISO certified standards showcase',
      'Service catalog management',
      'Project portfolio display',
      'Safety & compliance info',
      'Multi-page architecture',
      'Contact & quote system'
    ]
  },
  {
    id: 3,
    title: 'PoultryYield',
    category: 'FinTech Investment Platform',
    tagline: 'Invest in Poultry. Earn Real-World Yield.',
    description: 'Revolutionary agricultural investment platform enabling transparent poultry farming investments in Ghana. Investors can buy units in egg-laying (layers) or meat production (broilers) batches, track farm performance in real-time, and earn returns from actual agricultural production with full transparency.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Payment Integration', 'Real-time Analytics', 'KYC System', 'Escrow Management'],
    icon: '🐣',
    status: 'Live',
    url: 'https://poultry-investment-frontend.onrender.com',
    gradient: 'from-green-500 to-emerald-500',
    features: [
      'Dual investment products (Eggs & Chicken)',
      'Live batch tracking & metrics',
      'KYC & wallet management',
      'Automated payout system',
      'Daily performance logs with photos',
      'Mobile money & bank integration',
      'Auto-reinvest & compounding',
      'Risk disclosure & transparency'
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
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg border-b border-gray-800 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link>
              <Link href="/portfolio" className="text-blue-500 font-medium">Portfolio</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-20 left-20 animate-pulse" style={{ transform: 'translate3d(0,0,0)' }}></div>
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-40 right-20 animate-pulse delay-700" style={{ transform: 'translate3d(0,0,0)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-full px-6 py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-blue-400 text-sm font-semibold">🚀 Live Projects in Production</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-fadeIn delay-200">
            Our <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">Portfolio</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeIn delay-500">
            Real projects, real results. See how we&apos;ve transformed businesses with 
            <span className="text-blue-500 font-bold"> cutting-edge web solutions</span> delivered at lightning speed.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12">
            {projects.map((project, idx) => (
              <div 
                key={project.id}
                className={`group relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl overflow-hidden hover:border-blue-500 transition-all hover-lift animate-fadeIn ${
                  idx === 0 ? '' : 'delay-200'
                }`}
              >
                {/* Gradient overlay */}
                <div className={`absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l ${project.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="relative p-8 md:p-12">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Project Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${project.gradient} rounded-2xl flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform animate-float`}>
                          {project.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-3xl font-bold">{project.title}</h3>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/50 animate-pulse-glow">
                              ● {project.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">{project.tagline}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <span className={`inline-block px-4 py-1 bg-gradient-to-r ${project.gradient} bg-opacity-20 border border-blue-500/30 rounded-full text-sm font-medium mb-4`}>
                          {project.category}
                        </span>
                        <p className="text-gray-300 leading-relaxed text-lg">
                          {project.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wide">Key Features</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {project.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">✓</span>
                              <span className="text-sm text-gray-400">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">Technology Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg hover:border-purple-500 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col justify-between">
                      <div className="space-y-4">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block w-full text-center bg-gradient-to-r ${project.gradient} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all`}
                        >
                          🌐 Visit Live Site
                        </a>
                        <Link
                          href="/contact"
                          className="block w-full text-center border-2 border-gray-700 text-gray-300 px-6 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-white transition-all"
                        >
                          📬 Get Similar Project
                        </Link>
                      </div>

                      {/* Stats */}
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        {project.stats ? (
                          // Custom stats for PoultryYield
                          <>
                            <div className="col-span-2 text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                              <div className={`text-2xl font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                                {project.stats[0].value}
                              </div>
                              <div className="text-xs text-gray-500">{project.stats[0].label}</div>
                            </div>
                            <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                              <div className={`text-2xl font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                                {project.stats[1].value}
                              </div>
                              <div className="text-xs text-gray-500">{project.stats[1].label}</div>
                            </div>
                            <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                              <div className={`text-2xl font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                                {project.stats[2].value}
                              </div>
                              <div className="text-xs text-gray-500">{project.stats[2].label}</div>
                            </div>
                          </>
                        ) : (
                          // Default stats for other projects
                          <>
                            <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                              <div className={`text-2xl font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                                {idx === 0 ? '2 weeks' : '3 weeks'}
                              </div>
                              <div className="text-xs text-gray-500">Delivery Time</div>
                            </div>
                            <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                              <div className={`text-2xl font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                                100%
                              </div>
                              <div className="text-xs text-gray-500">Client Satisfaction</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Projects Coming Soon */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-12">
            <div className="text-6xl mb-6 animate-float">🚀</div>
            <h2 className="text-4xl font-bold mb-4">More Projects Coming Soon</h2>
            <p className="text-xl text-gray-400 mb-8">
              We&apos;re constantly delivering new projects. Check back soon to see more of our work, 
              or <span className="text-blue-500">contact us</span> to discuss your project.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">3+</div>
                <div className="text-sm text-gray-500">Live Projects</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">100%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">10x</div>
                <div className="text-sm text-gray-500">Faster</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">24/7</div>
                <div className="text-sm text-gray-500">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto animate-scaleIn">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden animate-gradient">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready for Your Success Story?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Let&apos;s build your next groundbreaking project together. Get the same quality, 
                speed, and results as our live projects.
              </p>
              <Link 
                href="/contact" 
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl hover-lift"
              >
                Start Your Project →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
                MicroAI
              </h3>
              <p className="text-gray-400 text-sm">
                Revolutionary development technology delivering projects 10x faster than traditional companies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/services" className="hover:text-blue-400 transition-colors">Web Applications</Link></li>
                <li><Link href="/services" className="hover:text-blue-400 transition-colors">SaaS Platforms</Link></li>
                <li><Link href="/services" className="hover:text-blue-400 transition-colors">Websites</Link></li>
                <li><Link href="/services" className="hover:text-blue-400 transition-colors">Web Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/portfolio" className="hover:text-blue-400 transition-colors">Portfolio</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-gray-400 text-sm mb-2">
                <a href="mailto:microailabs@outlook.com" className="hover:text-blue-400 transition-colors">
                  microailabs@outlook.com
                </a>
              </p>
              <p className="text-gray-400 text-sm">Takoradi, Ghana</p>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">&copy; 2024 MicroAI. All rights reserved. Built with cutting-edge technology.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}