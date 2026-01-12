import type { Metadata} from 'next'
import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'
import CTAButton from '@/components/CTAButton'
import { Code2, Cloud, Palette, Wrench, Check, Sparkles, Clock, TrendingUp, Target } from 'lucide-react'

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
        url: '/MICROAI SYSTEMS OFFICIAL LOGO.png',
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
    icon: Code2,
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
    icon: Cloud,
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
    icon: Palette,
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
    icon: Wrench,
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Advanced Navigation */}
      <AdvancedNavbar />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 relative overflow-hidden">
        {/* Background mesh gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f9ff_1px,transparent_1px),linear-gradient(to_bottom,#f0f9ff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-10 blur-[100px]"></div>
          <div className="absolute right-1/4 top-20 -z-10 h-[200px] w-[200px] rounded-full bg-violet-400 opacity-10 blur-[80px]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" strokeWidth={2} />
            <span className="text-sm font-semibold text-blue-600">10x Faster Delivery</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
            Our <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Revolutionary development services powered by cutting-edge technology. 
            We deliver in <span className="text-blue-600 font-semibold">1/10th the time</span> without compromising quality.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <div 
                  key={service.id}
                  className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <IconComponent className="w-6 h-6 text-blue-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wide">What's Included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-slate-700">
                          <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-6 mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Investment:</span>
                      <span className="font-semibold text-slate-900">{service.pricing}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Timeline:</span>
                      <span className="font-semibold text-emerald-600">{service.timeline}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <Link 
                        href={service.link}
                        className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg hover:border-slate-300 hover:bg-slate-100 transition-all font-medium text-sm"
                      >
                        Learn More
                      </Link>
                      <CTAButton className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-sm shadow-sm">
                        Get Started
                      </CTAButton>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Lightning-Fast</span> Process
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From initial consultation to launch, our streamlined process ensures rapid delivery without compromising quality.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative mx-auto mb-6 w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl blur opacity-20"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Discovery Call</h3>
              <p className="text-slate-600 text-sm">
                Quick 30-min call to understand your vision and requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="relative mx-auto mb-6 w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-2xl blur opacity-20"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Rapid Planning</h3>
              <p className="text-slate-600 text-sm">
                Detailed specifications and roadmap created in hours, not days.
              </p>
            </div>
            <div className="text-center">
              <div className="relative mx-auto mb-6 w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-violet-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-violet-600 to-violet-400 rounded-2xl blur opacity-20"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Fast Development</h3>
              <p className="text-slate-600 text-sm">
                Advanced tools accelerate development by 10x without quality loss.
              </p>
            </div>
            <div className="text-center">
              <div className="relative mx-auto mb-6 w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">4</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl blur opacity-20"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Instant Launch</h3>
              <p className="text-slate-600 text-sm">
                Deploy to production and start seeing results immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-violet-600/20"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Stop Waiting. Start Building.</h2>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Every day you wait is a day your competitors get ahead. Let's discuss 
                your project and show you how we can deliver 10x faster.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
              >
                Schedule Free Consultation
                <Target className="w-5 h-5" strokeWidth={2} />
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
