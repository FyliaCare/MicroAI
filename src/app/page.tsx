'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { StartProjectButton } from '@/components/HomeClient'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'
import { OrganizationSchema, WebsiteSchema, GlobalBusinessSchema } from '@/components/StructuredData'
import { ArrowRight, Sparkles, Zap, Shield, Code2, Brain, CheckCircle2, Clock, Trophy, Users, Code } from 'lucide-react'

const AnimatedStats = dynamic(() => import('@/components/AnimatedStats'), {
  loading: () => <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto h-32" />,
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Structured Data for SEO */}
      <OrganizationSchema />
      <WebsiteSchema />
      <GlobalBusinessSchema />
      
      {/* Advanced Navigation */}
      <AdvancedNavbar />

      {/* Hero Section - Exclusively Elegant */}
      <section className="relative pt-32 md:pt-40 pb-24 md:pb-32 px-4 overflow-hidden">
        {/* Elegant gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
        
        {/* Sophisticated mesh gradient overlay */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
        }}></div>
        
        {/* Refined dot pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Premium badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-2.5 rounded-full border border-blue-100/50 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Premium Development Partner</span>
              </div>
            </div>
            
            {/* Elegant headline */}
            <h1 className="text-center mb-8">
              <div className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
                <span className="block text-slate-900">Build Faster.</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Launch Sooner.
                </span>
              </div>
            </h1>
            
            {/* Refined subheadline */}
            <p className="text-center text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Enterprise-grade web applications delivered in{' '}
              <span className="font-semibold text-slate-900">weeks, not months</span>.
              Experience the future of software development.
            </p>
            
            {/* Premium CTA */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
              <StartProjectButton 
                className="group relative inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-slate-800 transition-all transform hover:scale-[1.02] shadow-xl shadow-slate-900/25 cursor-pointer overflow-hidden"
              />
              <Link 
                href="/portfolio" 
                className="inline-flex items-center justify-center gap-3 bg-white text-slate-700 px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-slate-50 transition-all border border-slate-200 hover:border-slate-300 shadow-sm"
              >
                <span>View Portfolio</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Elegant stats */}
            <AnimatedStats />
          </div>
        </div>
      </section>

      {/* Value Proposition - Refined Design */}
      <section className="py-24 md:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 tracking-tight">
              Exceptional Quality,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Unprecedented Speed
              </span>
            </h2>
            <p className="text-xl text-slate-600 font-light leading-relaxed">
              We combine enterprise-grade quality with revolutionary development velocity
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature 1 - Sophisticated card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl transform transition-transform group-hover:scale-[1.02]"></div>
              <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-10 border border-white/20 shadow-sm hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/25">
                  <Zap className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">10× Development Velocity</h3>
                <p className="text-slate-600 leading-relaxed text-lg font-light">
                  Advanced development systems and proven methodologies compress timelines from months to weeks without sacrificing quality.
                </p>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Average: 3-4 weeks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl transform transition-transform group-hover:scale-[1.02]"></div>
              <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-10 border border-white/20 shadow-sm hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-violet-600/25">
                  <Shield className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Enterprise-Grade Security</h3>
                <p className="text-slate-600 leading-relaxed text-lg font-light">
                  Bank-level security, comprehensive testing, and scalable architecture built into every project from day one.
                </p>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-violet-600 font-medium">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">Production-ready code</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-zinc-50 rounded-3xl transform transition-transform group-hover:scale-[1.02]"></div>
              <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-10 border border-white/20 shadow-sm hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-slate-900/25">
                  <Code2 className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Modern Technology</h3>
                <p className="text-slate-600 leading-relaxed text-lg font-light">
                  Next.js 14, TypeScript, PostgreSQL, and cutting-edge frameworks. The same stack powering Fortune 500 companies.
                </p>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm">AI-enhanced workflow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Elegant Grid */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
              What We Create
            </h2>
            <p className="text-xl text-slate-600 font-light leading-relaxed">
              Sophisticated digital solutions crafted with precision and delivered with speed
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Service 1 - Premium layout */}
            <Link 
              href="/services/web-applications" 
              className="group relative bg-white rounded-3xl p-12 border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Code2 className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">Web Applications</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-light">
                    Full-featured custom applications with complex workflows, role-based access, real-time features, and seamless integrations.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
                <span>Explore solutions</span>
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>

            {/* Service 2 */}
            <Link 
              href="/services/saas-platforms" 
              className="group relative bg-white rounded-3xl p-12 border border-slate-100 hover:border-violet-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform">
                  <Brain className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-3 text-slate-900 group-hover:text-violet-600 transition-colors">SaaS Platforms</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-light">
                    Scalable multi-tenant platforms with subscription management, payment processing, analytics, and automated workflows.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-violet-600 font-semibold group-hover:gap-4 transition-all">
                <span>Explore solutions</span>
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>

            {/* Service 3 */}
            <Link 
              href="/services/professional-websites" 
              className="group relative bg-white rounded-3xl p-12 border border-slate-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-3 text-slate-900 group-hover:text-emerald-600 transition-colors">Professional Websites</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-light">
                    Conversion-optimized websites with stunning design, lightning-fast performance, and comprehensive SEO optimization.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-4 transition-all">
                <span>Explore solutions</span>
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>

            {/* Service 4 */}
            <Link 
              href="/services/web-tools" 
              className="group relative bg-white rounded-3xl p-12 border border-slate-100 hover:border-slate-300 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-600/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-3 text-slate-900 group-hover:text-slate-700 transition-colors">Custom Tools & Automation</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-light">
                    Specialized tools that streamline operations, automate repetitive tasks, and integrate seamlessly with your existing systems.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold group-hover:gap-4 transition-all">
                <span>Explore solutions</span>
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Process - Minimalist Timeline */}
      <section className="py-24 md:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 tracking-tight">
              A Process Built for Speed
            </h2>
            <p className="text-xl text-slate-600 font-light leading-relaxed">
              From initial concept to production deployment in record time
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {[
              { 
                num: '01', 
                title: 'Discovery', 
                desc: 'Share your vision in a focused consultation. We map requirements and define clear objectives.',
                icon: Users
              },
              { 
                num: '02', 
                title: 'Blueprint', 
                desc: 'Receive a detailed technical roadmap with timeline, milestones, and transparent pricing.',
                icon: Code2
              },
              { 
                num: '03', 
                title: 'Build', 
                desc: 'Watch your project evolve with regular updates and real-time progress tracking.',
                icon: Zap
              },
              { 
                num: '04', 
                title: 'Launch', 
                desc: 'Go live with comprehensive support, training, and ongoing optimization.',
                icon: Sparkles
              }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="relative">
                  {/* Connector line */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-slate-200 to-transparent"></div>
                  )}
                  
                  {/* Icon */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-10 h-10 text-slate-700" strokeWidth={1.5} />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {item.num}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-light">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA - Sophisticated Design */}
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
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Your Digital Vision?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Join forward-thinking businesses who've accelerated their growth with exceptional software.
            Get your personalized proposal within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <StartProjectButton 
              className="group relative inline-flex items-center justify-center gap-3 bg-white text-slate-900 px-12 py-6 rounded-2xl text-lg font-semibold hover:bg-slate-100 transition-all transform hover:scale-[1.02] shadow-2xl cursor-pointer overflow-hidden"
            />
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white px-12 py-6 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all border border-white/20 hover:border-white/30"
            >
              <span>Schedule a Call</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 pt-16 border-t border-white/10">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-white mb-2">10×</div>
                <div className="text-sm text-slate-400">Faster Delivery</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-sm text-slate-400">Quality Assured</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">24hr</div>
                <div className="text-sm text-slate-400">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
