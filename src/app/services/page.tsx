import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services - MicroAI',
  description: 'Explore our comprehensive range of web development services including web applications, SaaS solutions, and digital tools.',
}

const services = [
  {
    id: 1,
    title: 'Web Application Development',
    icon: '💻',
    description: 'Enterprise-grade web applications built with cutting-edge technology and delivered 10x faster.',
    features: [
      'Full-stack development with latest frameworks',
      'Responsive & mobile-optimized design',
      'Scalable architecture',
      'Database design & integration',
      'Cloud deployment ready',
      'Performance optimization',
      'Ongoing maintenance for what we build'
    ],
    pricing: 'Custom Quote',
    timeline: '1-2 weeks (vs 10-20 weeks traditional)'
  },
  {
    id: 2,
    title: 'SaaS Platform Development',
    icon: '☁️',
    description: 'Launch-ready SaaS platforms built with our revolutionary development system.',
    features: [
      'Multi-tenant architecture',
      'User authentication & authorization',
      'Subscription & payment integration',
      'Admin dashboard included',
      'Analytics & reporting',
      'Automated scaling infrastructure',
      'Maintenance & updates included'
    ],
    pricing: 'Custom Quote',
    timeline: '2-3 weeks (vs 20-30 weeks traditional)'
  },
  {
    id: 3,
    title: 'Professional Websites',
    icon: '🎨',
    description: 'High-converting websites that make lasting impressions, delivered at lightning speed.',
    features: [
      'Custom modern design',
      'SEO optimization built-in',
      'Content management system',
      'Mobile-first responsive',
      'Lightning-fast load times',
      'Analytics integration',
      'Ongoing maintenance available'
    ],
    pricing: 'Custom Quote',
    timeline: '3-5 days (vs 3-5 weeks traditional)'
  },
  {
    id: 4,
    title: 'Web Tools & Utilities',
    icon: '🛠️',
    description: 'Custom web tools that automate processes and boost productivity.',
    features: [
      'Tailored to your workflow',
      'Intuitive user interface',
      'Data processing & automation',
      'Third-party integrations',
      'Real-time functionality',
      'Secure & reliable',
      'Maintenance for our builds'
    ],
    pricing: 'Custom Quote',
    timeline: '1-2 weeks (vs 10-15 weeks traditional)'
  }
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">MicroAI</Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
              <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
              <Link href="/services" className="text-blue-500 font-medium">Services</Link>
              <Link href="/portfolio" className="text-gray-300 hover:text-white">Portfolio</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-20 right-20 animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-full px-6 py-2 animate-pulse-glow">
              <span className="text-blue-400 text-sm font-semibold">⚡ 10x Faster Delivery</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn delay-200">
            Our <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">Services</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto animate-fadeIn delay-500">
            Revolutionary development services powered by cutting-edge technology. 
            We deliver in <span className="text-blue-500 font-bold">1/10th the time</span> without compromising quality.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <div 
                key={service.id}
                className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-blue-500 transition-all hover-lift animate-scaleIn ${
                  idx === 0 ? '' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-500' : 'delay-700'
                }`}
              >
                <div className="text-6xl mb-4 animate-float">{service.icon}</div>
                <h3 className="text-3xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wide">What&apos;s Included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-300">
                        <span className="text-blue-500 mr-2 mt-1">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-gray-700 pt-6 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">Investment:</span>
                    <span className="font-semibold text-white">{service.pricing}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-gray-400">Timeline:</span>
                    <span className="font-semibold text-green-400">{service.timeline}</span>
                  </div>
                  <Link 
                    href="/contact"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium hover-scale"
                  >
                    Get Started →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 animate-fadeIn">
            Our <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">Lightning-Fast</span> Process
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center animate-fadeIn">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform hover-glow animate-float">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Discovery Call</h3>
              <p className="text-gray-400 text-sm">
                Quick 30-min call to understand your vision and requirements.
              </p>
            </div>
            <div className="text-center animate-fadeIn delay-200">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform hover-glow animate-float delay-200">
                <span className="text-white text-3xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Rapid Planning</h3>
              <p className="text-gray-400 text-sm">
                Our AI-powered system creates detailed specs in hours, not days.
              </p>
            </div>
            <div className="text-center animate-fadeIn delay-500">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform hover-glow animate-float delay-500">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Development</h3>
              <p className="text-gray-400 text-sm">
                Advanced tools accelerate development by 10x without quality loss.
              </p>
            </div>
            <div className="text-center animate-fadeIn delay-700">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform hover-glow animate-float delay-700">
                <span className="text-white text-3xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Launch</h3>
              <p className="text-gray-400 text-sm">
                Deploy to production and start seeing results immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto animate-scaleIn">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden animate-gradient">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Stop Waiting. Start Building.</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Every day you wait is a day your competitors get ahead. Let&apos;s discuss 
                your project and show you how we can deliver 10x faster.
              </p>
              <Link 
                href="/contact"
                className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl hover-lift"
              >
                Schedule Free Consultation →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">MicroAI</h3>
          <p className="text-gray-400 mb-8">10x Faster Development Technology</p>
          <p className="text-gray-500 text-sm">&copy; 2024 MicroAI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}