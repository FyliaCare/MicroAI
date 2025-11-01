import type { Metadata} from 'next'
import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Web Development Services - Custom Apps, SaaS, Websites | MicroAI Systems',
  description: 'Expert web development services delivered 10x faster: Custom Web Applications (1-2 weeks), SaaS Platforms (2-3 weeks), Professional Websites (3-5 days), Web Tools & Automation. Next.js, TypeScript, React development. Enterprise-grade quality with revolutionary speed.',
  keywords: [
    'web development services',
    'custom web application development',
    'SaaS platform development',
    'professional website design',
    'web tools development',
    'fast web development',
    'enterprise web applications',
    'React development services',
    'Next.js development',
    'full-stack development',
    'rapid application development',
    'business automation tools',
  ],
  openGraph: {
    title: 'Web Development Services - 10x Faster Delivery | MicroAI Systems',
    description: 'Custom Web Apps in 1-2 weeks. Professional Websites in 3-5 days. SaaS Platforms in 2-3 weeks. Enterprise-grade quality, revolutionary speed.',
    url: '/services',
    type: 'website',
    images: [
      {
        url: '/microAi logo main.png',
        width: 1200,
        height: 630,
        alt: 'MicroAI Systems Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Development Services - 10x Faster | MicroAI',
    description: 'Custom Web Apps, SaaS Platforms, Professional Websites delivered at revolutionary speed.',
  },
  alternates: {
    canonical: '/services',
  },
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
    timeline: '1-2 weeks (vs 10-20 weeks traditional)',
    link: '/services/web-applications'
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
    timeline: '2-3 weeks (vs 20-30 weeks traditional)',
    link: '/services/saas-platforms'
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
    timeline: '3-5 days (vs 3-5 weeks traditional)',
    link: '/services/professional-websites'
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
    timeline: '1-2 weeks (vs 10-15 weeks traditional)',
    link: '/services/web-tools'
  }
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Advanced Navigation */}
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl top-10 md:top-20 left-10 md:left-20 animate-pulse"></div>
          <div className="absolute w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl bottom-10 md:bottom-20 right-10 md:right-20 animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 md:mb-6 animate-fadeIn mobile-card-enter">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-full px-4 md:px-6 py-1.5 md:py-2 animate-pulse-glow">
              <span className="text-blue-400 text-xs md:text-sm font-semibold">⚡ 10x Faster Delivery</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fadeIn delay-200">
            Our <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">Services</span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto animate-fadeIn delay-500 leading-relaxed">
            Revolutionary development services powered by cutting-edge technology. 
            We deliver in <span className="text-blue-500 font-bold">1/10th the time</span> without compromising quality.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, idx) => (
              <div 
                key={service.id}
                className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all hover-lift animate-scaleIn mobile-card ${
                  idx === 0 ? '' : idx === 1 ? 'delay-200' : idx === 2 ? 'delay-500' : 'delay-700'
                }`}
              >
                <div className="text-4xl mb-3 animate-float">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2 leading-tight">{service.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wide">What&apos;s Included:</h4>
                  <ul className="space-y-1.5">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-xs text-gray-300 leading-snug">
                        <span className="text-blue-500 mr-2 mt-0.5 flex-shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-400">Investment:</span>
                    <span className="font-semibold text-white text-sm">{service.pricing}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-gray-400">Timeline:</span>
                    <span className="font-semibold text-green-400 text-sm">{service.timeline}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      href={service.link}
                      className="block text-center bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition-all font-medium text-sm mobile-active-state touch-manipulation"
                    >
                      Learn More
                    </Link>
                    <Link 
                      href="/contact"
                      className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium hover-scale text-sm mobile-active-state touch-manipulation"
                    >
                      Get Started →
                    </Link>
                  </div>
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
      <Footer />
    </main>
  )
}