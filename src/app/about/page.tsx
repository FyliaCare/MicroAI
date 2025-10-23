import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Logo from '@/components/Logo'

const CountingStats = dynamic(() => import('@/components/CountingStats'), {
  loading: () => <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto h-32" />,
  ssr: false,
})

export const metadata: Metadata = {
  title: 'About Us - MicroAI | Revolutionary Development Technology',
  description: 'Discover the technology and team behind MicroAI - delivering web applications 10x faster than traditional development companies.',
}

export default function AboutPage() {
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
              <Link href="/about" className="text-blue-500 font-medium">About</Link>
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link>
              <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">Portfolio</Link>
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
          <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl bottom-20 left-1/2 animate-pulse delay-1000" style={{ transform: 'translate3d(0,0,0)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-full px-6 py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-blue-400 text-sm font-semibold">⚡ Redefining Development Speed</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-fadeIn delay-200">
            We&apos;re <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">MicroAI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeIn delay-500">
            A revolutionary development company powered by cutting-edge technology that 
            delivers enterprise-grade solutions in <span className="text-blue-500 font-bold">1/10th the time</span> of 
            traditional agencies.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform animate-float">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                To revolutionize web development by making enterprise-grade solutions accessible 
                to businesses of all sizes through speed, innovation, and cutting-edge technology.
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform animate-float delay-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To be the global leader in rapid development technology, setting new industry 
                standards for speed, quality, and innovation in digital solutions.
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform animate-float delay-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
              <p className="text-gray-400 leading-relaxed">
                Speed without compromise. Innovation with purpose. Excellence in execution. 
                Client success above all. Transparency in every interaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Technology</span> Behind Our Speed
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We&apos;ve invested heavily in proprietary systems and cutting-edge tools that enable 
              us to deliver in 1/10th the time without sacrificing quality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="text-5xl mr-4 animate-float">🚀</div>
                <h3 className="text-2xl font-bold">Advanced Development Stack</h3>
              </div>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">▸</span>
                  <span>Next.js 14 with App Router for optimal performance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">▸</span>
                  <span>TypeScript for type-safe, maintainable code</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">▸</span>
                  <span>AI-assisted development for rapid prototyping</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">▸</span>
                  <span>Automated testing and deployment pipelines</span>
                </li>
              </ul>
            </div>

            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="text-5xl mr-4 animate-float delay-200">⚙️</div>
                <h3 className="text-2xl font-bold">Proprietary Systems</h3>
              </div>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3 mt-1">▸</span>
                  <span>Custom component libraries and design systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3 mt-1">▸</span>
                  <span>Pre-built templates for common use cases</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3 mt-1">▸</span>
                  <span>Automated code generation and optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3 mt-1">▸</span>
                  <span>Intelligent project scaffolding systems</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            By The <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">Numbers</span>
          </h2>
          <CountingStats />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto animate-scaleIn">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden animate-gradient">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Experience the Future of Development
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Let&apos;s discuss how we can help transform your business with our revolutionary 
                technology and lightning-fast delivery.
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