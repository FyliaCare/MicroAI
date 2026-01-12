import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, ArrowRight, Check, Star, TrendingUp, Zap, Shield } from 'lucide-react'
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
    title: 'CAGhana - Creative Approach',
    category: 'Drone Services Platform',
    tagline: 'Ghana-Wide Professional Drone Photography & Aerial Services',
    description: 'Full-service drone photography and aerial imagery platform serving Creative Approach Ghana. Showcasing comprehensive drone services including aerial photography & videography, drone inspection & monitoring, mapping & surveying, 3D modeling, documentary production, and emergency response. Ghana-wide coverage with professional drone pilots.',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'SEO Optimized', 'Responsive Design', 'Performance Optimized', 'Modern UI/UX'],
    icon: '🚁',
    status: 'Live',
    url: 'https://caghana.com',
    gradient: 'from-sky-600 to-cyan-600',
    image: '/screenshots/caghana-screenshot.jpg',
    features: [
      'Professional service showcase (6 drone services)',
      'Aerial photography & videography portfolio',
      'Drone inspection & monitoring solutions',
      'Mapping, surveying & 3D modeling services',
      'Documentary films & photography',
      'Custom training & emergency response',
      'Interactive service detail pages',
      'Project inquiry & quote system',
      'Client testimonials display',
      'Ghana-wide coverage map',
      'Mobile-optimized booking flow',
      'Fast page load speeds (95+ score)'
    ],
    stats: [
      { label: 'Delivery Time', value: '1 week' },
      { label: 'Page Speed', value: '95+' },
      { label: 'Services', value: '6 Drone Services' }
    ]
  }
]

export default function PortfolioPage() {
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

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-6 py-2 mb-6">
            <Star className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-700 text-sm font-semibold">Featured Live Project</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Enterprise <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Portfolio</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Live, production-grade application serving real business needs. Professional drone services platform 
            <span className="font-bold text-blue-600"> delivered with enterprise quality</span> and exceptional speed.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8">
            {projects.map((project, idx) => (
              <div 
                key={project.id}
                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l ${project.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Project Info */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${project.gradient} rounded-xl flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform flex-shrink-0`}>
                          {project.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{project.title}</h3>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                              {project.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium">{project.tagline}</p>
                        </div>
                      </div>

                      <div>
                        <span className={`inline-block px-3 py-1.5 bg-gradient-to-r ${project.gradient} text-white rounded-lg text-xs font-semibold mb-4`}>
                          {project.category}
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                          <Check className="w-4 h-4 text-blue-600" />
                          Key Features
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {project.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-600 leading-snug">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-600" />
                          Technology Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions & Stats */}
                    <div className="flex flex-col justify-between gap-6">
                      <div className="space-y-3">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-2 w-full bg-gradient-to-r ${project.gradient} text-white px-6 py-3.5 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all group/btn`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit Live Site
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                        <Link
                          href="/contact"
                          className="flex items-center justify-center gap-2 w-full border-2 border-slate-200 text-slate-700 px-6 py-3.5 rounded-lg font-semibold hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
                        >
                          Get Similar Project
                        </Link>
                      </div>

                      {/* Stats */}
                      {project.stats && (
                        <div className="grid grid-cols-3 gap-3">
                          {project.stats.map((stat, statIdx) => (
                            <div key={statIdx} className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                              <div className={`text-xl font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent mb-1`}>
                                {stat.value}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
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
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">
              Project Highlights
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  1 Week
                </div>
                <div className="text-sm text-slate-600 font-medium">Delivery Time</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  95+
                </div>
                <div className="text-sm text-slate-600 font-medium">Page Speed Score</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-sm text-slate-600 font-medium">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  8+
                </div>
                <div className="text-sm text-slate-600 font-medium">Services Offered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready for Your Own Success Story?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Let&apos;s build your enterprise-grade solution together. Get the same quality, 
              speed, and results as CAGhana.com.
            </p>
            <CTAButton className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl group">
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </CTAButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
