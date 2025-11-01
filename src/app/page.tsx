'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { StartProjectButton } from '@/components/HomeClient'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'
import { OrganizationSchema, WebsiteSchema, GlobalBusinessSchema } from '@/components/StructuredData'
import MobileServiceCards from '@/components/MobileServiceCards'

const SpeedComparison = dynamic(() => import('@/components/SpeedComparison'), {
  loading: () => <div className="h-64 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl animate-pulse" />,
  ssr: false,
})

const AnimatedStats = dynamic(() => import('@/components/AnimatedStats'), {
  loading: () => <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto h-32" />,
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Structured Data for SEO */}
      <OrganizationSchema />
      <WebsiteSchema />
      <GlobalBusinessSchema />
      
      {/* Advanced Navigation */}
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 px-4">
        {/* Animated background - using transform for GPU acceleration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-64 md:w-96 h-64 md:h-96 bg-blue-500/20 rounded-full blur-3xl top-10 md:top-20 left-10 md:left-20 animate-pulse" style={{ transform: 'translate3d(0,0,0)' }}></div>
          <div className="absolute w-64 md:w-96 h-64 md:h-96 bg-purple-500/20 rounded-full blur-3xl top-20 md:top-40 right-10 md:right-20 animate-pulse delay-700" style={{ transform: 'translate3d(0,0,0)' }}></div>
          <div className="absolute w-64 md:w-96 h-64 md:h-96 bg-pink-500/20 rounded-full blur-3xl bottom-10 md:bottom-20 left-1/2 animate-pulse delay-1000" style={{ transform: 'translate3d(0,0,0)' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-block mb-4 md:mb-6 animate-fadeIn mobile-card-enter">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-full px-4 md:px-6 py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-blue-400 text-xs md:text-sm font-semibold">⚡ 10x Faster Development Technology</span>
            </div>
          </div>
          
          <h1 className="mobile-hero-text md:text-5xl lg:text-7xl xl:text-8xl font-bold mb-4 md:mb-6 leading-tight animate-fadeIn delay-200">
            We Build Your
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Digital Future
            </span>
            <br />
            <span className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl">10x Faster</span>
          </h1>
          
          <p className="text-sm md:text-lg lg:text-xl xl:text-2xl text-gray-400 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeIn delay-500 px-2 md:px-4">
            Revolutionary technology that delivers enterprise-grade web applications, 
            tools, and SaaS platforms in <span className="text-blue-500 font-bold">1/10th the time</span> of 
            traditional development companies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 lg:gap-6 justify-center mb-12 md:mb-16 animate-fadeIn delay-700 px-2 md:px-4">
            <StartProjectButton 
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-full text-sm md:text-base lg:text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl hover-lift cursor-pointer min-h-[48px] touch-manipulation mobile-active-state"
            />
            <Link 
              href="/services" 
              className="border-2 border-gray-700 text-white px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-full text-sm md:text-base lg:text-lg font-semibold hover:border-blue-500 hover:bg-blue-500/10 transition-all hover-scale min-h-[48px] touch-manipulation text-center mobile-active-state"
            >
              Explore Our Technology
            </Link>
          </div>

          {/* Stats */}
          <AnimatedStats />
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-12 md:py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16 px-2 md:px-4">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Our <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Secret Weapon</span>
            </h2>
            <p className="text-sm md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
              We&apos;ve invested heavily in cutting-edge development systems that revolutionize 
              how we build digital products.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            <div className="mobile-card bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:border-blue-500 transition-all hover-lift animate-slideInLeft touch-manipulation mobile-active-state">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4 animate-float">⚡</div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Lightning Fast</h3>
              <p className="text-sm md:text-base text-gray-400">
                Our proprietary development system delivers projects in 1/10th the time. 
                What takes others months, we deliver in weeks.
              </p>
            </div>
            
            <div className="mobile-card bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:border-purple-500 transition-all hover-lift animate-scaleIn delay-200 touch-manipulation mobile-active-state">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4 animate-float delay-200">🚀</div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Latest Technology</h3>
              <p className="text-sm md:text-base text-gray-400">
                Built on the most advanced frameworks and tools. Next.js, TypeScript, AI-assisted 
                development - we use it all.
              </p>
            </div>
            
            <div className="mobile-card bg-gradient-to-br from-pink-900/50 to-pink-800/30 border border-pink-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:border-pink-500 transition-all hover-lift animate-slideInRight touch-manipulation mobile-active-state">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4 animate-float delay-500">💎</div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Enterprise Quality</h3>
              <p className="text-sm md:text-base text-gray-400">
                Speed doesn&apos;t mean compromise. Every project is production-ready, scalable, 
                and built to last.
              </p>
            </div>
          </div>

          {/* Speed Comparison */}
          <SpeedComparison />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">What We Build</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400">Powerful digital solutions delivered at revolutionary speed</p>
          </div>
          
          {/* Mobile Swipeable Cards */}
          <MobileServiceCards />
          
          {/* Desktop Grid */}
          <div className="hidden lg:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/services/web-applications" className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-all cursor-pointer hover-lift animate-fadeIn block">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform hover-glow">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Web Applications</h3>
              <p className="text-gray-400 text-sm">Custom web apps built with cutting-edge technology and delivered fast.</p>
            </Link>
            <Link href="/services/web-tools" className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500 transition-all cursor-pointer hover-lift animate-fadeIn delay-200 block">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform hover-glow">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Web Tools</h3>
              <p className="text-gray-400 text-sm">Specialized tools that streamline operations and boost productivity.</p>
            </Link>
            <Link href="/services/professional-websites" className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-pink-500 transition-all cursor-pointer hover-lift animate-fadeIn delay-500 block">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform hover-glow">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Websites</h3>
              <p className="text-gray-400 text-sm">Professional, responsive websites that convert visitors to customers.</p>
            </Link>
            <Link href="/services/saas-platforms" className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-cyan-500 transition-all cursor-pointer hover-lift animate-fadeIn delay-700 block">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform hover-glow">
                <span className="text-2xl">☁️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">SaaS Platforms</h3>
              <p className="text-gray-400 text-sm">Scalable software-as-a-service solutions ready to launch fast.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fadeIn">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Ready to Build <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">10x Faster</span>?
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-gray-400 mb-8 md:mb-10 px-2">
            Stop waiting months for traditional development cycles. Share your concept with us today 
            and get immediate insights with <span className="text-blue-400 font-semibold">lightning-fast timelines</span> that 
            turn your ideas into reality in weeks, not months.
          </p>
          <StartProjectButton 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl hover-lift animate-pulse-glow cursor-pointer min-h-[48px] touch-manipulation mobile-active-state"
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}