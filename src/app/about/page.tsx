import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'
import CTAButton from '@/components/CTAButton'
import { Zap, Eye, Sparkles, Rocket, Code2, Brain, Shield, TrendingUp, Users, Award, ArrowRight } from 'lucide-react'

const CountingStats = dynamic(() => import('@/components/CountingStats'), {
  loading: () => <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto h-32" />,
  ssr: false,
})

export const metadata: Metadata = {
  title: 'About Us - MicroAI Systems | Revolutionary Development Technology',
  description: 'Discover the technology and team behind MicroAI Systems - delivering web applications 10x faster than traditional development companies.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Advanced Navigation */}
      <AdvancedNavbar />

      {/* Hero Section - Refined & Compact */}
      <section className="relative pt-24 md:pt-32 pb-16 px-4 overflow-hidden">
        {/* Refined background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
        
        {/* Sophisticated overlay */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
        }}></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-100/50 backdrop-blur-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Redefining Development Excellence</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="block text-slate-900">Who We Are</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl font-light leading-relaxed">
            A development company powered by modern technology,
            delivering enterprise-grade solutions in{' '}
            <span className="font-semibold text-slate-900">record time</span>.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values - Compact Editorial */}
      <section className="py-16 md:py-24 px-4 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          {/* Mission */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/4">
                <div className="relative w-14 h-14 mb-4">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="url(#missionGrad)" opacity="0.1"/>
                    <circle cx="50" cy="50" r="35" fill="url(#missionGrad)" opacity="0.2"/>
                    <path d="M50 20L60 40H40L50 20Z" fill="url(#missionGrad)"/>
                    <path d="M50 35L70 50L50 80L30 50L50 35Z" fill="url(#missionGrad)" opacity="0.8"/>
                    <circle cx="50" cy="50" r="8" fill="white"/>
                    <circle cx="50" cy="50" r="5" fill="url(#missionGrad)"/>
                    <defs>
                      <linearGradient id="missionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6"/>
                        <stop offset="100%" stopColor="#6366F1"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-slate-400 font-medium">Mission</h3>
              </div>
              <div className="md:w-3/4">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 leading-tight">
                  Making professional web development fast and accessible
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  We leverage the latest frameworks and development practices to deliver quality solutions quickly. 
                  No complexity, no unnecessary delays—just efficient, modern web development.
                </p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="mb-16 border-t border-slate-100 pt-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/4">
                <div className="relative w-14 h-14 mb-4">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="50" cy="50" rx="40" ry="25" fill="url(#visionGrad)" opacity="0.15"/>
                    <ellipse cx="50" cy="50" rx="30" ry="18" fill="url(#visionGrad)" opacity="0.25"/>
                    <circle cx="50" cy="50" r="15" fill="url(#visionGrad)"/>
                    <circle cx="50" cy="50" r="8" fill="white" opacity="0.9"/>
                    <circle cx="53" cy="47" r="3" fill="url(#visionGrad)"/>
                    <path d="M25 50 Q25 30 50 30 Q75 30 75 50 Q75 70 50 70 Q25 70 25 50" stroke="url(#visionGrad)" strokeWidth="2" fill="none" opacity="0.4"/>
                    <defs>
                      <linearGradient id="visionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6"/>
                        <stop offset="100%" stopColor="#A855F7"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-slate-400 font-medium">Vision</h3>
              </div>
              <div className="md:w-3/4">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 leading-tight">
                  Exceptional quality delivered at exceptional speed
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  To set a new standard in development timelines while maintaining enterprise-grade quality. 
                  We prove that speed and excellence aren't mutually exclusive.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="border-t border-slate-100 pt-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/4">
                <div className="relative w-14 h-14 mb-4">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="url(#valuesGrad)" opacity="0.1"/>
                    <path d="M50 15 L60 40 L87 45 L68 63 L73 90 L50 77 L27 90 L32 63 L13 45 L40 40 Z" fill="url(#valuesGrad)" opacity="0.3"/>
                    <path d="M50 25 L57 45 L78 48 L64 61 L67 82 L50 72 L33 82 L36 61 L22 48 L43 45 Z" fill="url(#valuesGrad)"/>
                    <circle cx="50" cy="55" r="8" fill="white" opacity="0.8"/>
                    <defs>
                      <linearGradient id="valuesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981"/>
                        <stop offset="100%" stopColor="#14B8A6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-slate-400 font-medium">Values</h3>
              </div>
              <div className="md:w-3/4">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 leading-tight">
                  Principles that guide our work
                </h2>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    'Speed with quality',
                    'Transparent communication',
                    'Modern best practices',
                    'Client-focused solutions',
                    'Continuous innovation',
                    'Honest timelines'
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-1 h-1 bg-slate-400 rounded-full flex-shrink-0"></div>
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section - Honest & Visual */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 tracking-tight">
              Modern technology stack
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              We use industry-leading tools and frameworks to build fast, scalable applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {/* Column 1 */}
            <div className="space-y-8">
              <div className="border-l-2 border-blue-200 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Code2 className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-slate-900">Next.js 14 & React</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Server-side rendering, optimal performance, and exceptional SEO out of the box
                </p>
              </div>

              <div className="border-l-2 border-violet-200 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-slate-900">TypeScript</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Type-safe code that catches errors early and scales with your business
                </p>
              </div>

              <div className="border-l-2 border-emerald-200 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-slate-900">Modern Database</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  PostgreSQL with Prisma ORM for robust data management and type safety
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-8">
              <div className="border-l-2 border-indigo-200 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-indigo-600" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-slate-900">Tailwind CSS</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rapid UI development with a utility-first framework for pixel-perfect designs
                </p>
              </div>

              <div className="border-l-2 border-slate-300 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-slate-700" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-slate-900">Cloud Infrastructure</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Serverless deployment with automatic scaling and global CDN delivery
                </p>
              </div>

              <div className="border-l-2 border-blue-200 pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <Rocket className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-slate-900">CI/CD Pipeline</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Automated testing and deployment for reliable, consistent releases
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different - Dynamic Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 tracking-tight">
              What makes us different
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              It's not just what we build—it's how we build it
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Speed */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 h-full border border-blue-100 hover:border-blue-200 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
                <Zap className="w-8 h-8 text-blue-600 mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Built for Speed</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We've streamlined our entire workflow—from design to deployment. What traditionally 
                  takes months, we accomplish in weeks, without cutting corners.
                </p>
              </div>
            </div>

            {/* Modern */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 p-8 h-full border border-violet-100 hover:border-violet-200 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-200/20 rounded-full blur-2xl"></div>
                <Sparkles className="w-8 h-8 text-violet-600 mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Always Modern</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We stay ahead of the curve with the latest frameworks and best practices. Your 
                  application is built with technology that won't be outdated tomorrow.
                </p>
              </div>
            </div>

            {/* Partnership */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 h-full border border-emerald-100 hover:border-emerald-200 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl"></div>
                <Users className="w-8 h-8 text-emerald-600 mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-slate-900 mb-3">True Partnership</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We're not just developers—we're your technical partners. Clear communication, 
                  realistic timelines, and a genuine commitment to your success.
                </p>
              </div>
            </div>
          </div>

          {/* Quote/Testimonial Style Element */}
          <div className="mt-16 border-l-4 border-blue-600 pl-6 py-4">
            <p className="text-xl md:text-2xl text-slate-900 font-light italic leading-relaxed mb-4">
              "We believe the best software is built through clear communication, modern technology, 
              and a relentless focus on delivering value—not vanity metrics."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">MS</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">MicroAI Systems</p>
                <p className="text-xs text-slate-500">Development Philosophy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Sophisticated */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        
        {/* Elegant overlay pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Accent gradients */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
            Experience the Future
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              of Development
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Let's discuss how we can transform your business with revolutionary 
            technology and lightning-fast delivery.
          </p>
          <CTAButton className="group inline-flex items-center justify-center gap-3 bg-white text-slate-900 px-12 py-6 rounded-2xl text-lg font-semibold hover:bg-slate-100 transition-all transform hover:scale-[1.02] shadow-2xl">
            <span>Start Your Project</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </CTAButton>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
