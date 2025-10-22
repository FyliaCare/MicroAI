import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Portfolio - MicroAI',
  description: 'Explore our portfolio of successful web applications, SaaS platforms, and digital solutions.',
}

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Web Application',
    description: 'Full-featured online marketplace with payment processing, inventory management, and customer analytics.',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
    image: '🛒',
    status: 'Completed'
  },
  {
    id: 2,
    title: 'SaaS Analytics Dashboard',
    category: 'SaaS Solution',
    description: 'Comprehensive analytics platform with real-time data visualization and automated reporting.',
    technologies: ['React', 'TypeScript', 'PostgreSQL', 'Chart.js'],
    image: '📊',
    status: 'Completed'
  },
  {
    id: 3,
    title: 'Healthcare Management System',
    category: 'Web Application',
    description: 'Patient management system with appointment scheduling, medical records, and billing integration.',
    technologies: ['Next.js', 'Express', 'MySQL', 'JWT'],
    image: '🏥',
    status: 'Completed'
  },
  {
    id: 4,
    title: 'Project Management Tool',
    category: 'SaaS Solution',
    description: 'Collaborative project management platform with task tracking, team communication, and time tracking.',
    technologies: ['Next.js', 'Socket.io', 'MongoDB', 'Redis'],
    image: '📋',
    status: 'In Progress'
  },
  {
    id: 5,
    title: 'Real Estate Portal',
    category: 'Website',
    description: 'Property listing platform with advanced search, virtual tours, and agent management.',
    technologies: ['Next.js', 'Tailwind', 'Firebase', 'Google Maps API'],
    image: '🏡',
    status: 'Completed'
  },
  {
    id: 6,
    title: 'Educational Platform',
    category: 'Web Application',
    description: 'Online learning management system with video courses, quizzes, and progress tracking.',
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS S3'],
    image: '📚',
    status: 'Completed'
  }
]

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
              <Link href="/portfolio" className="text-blue-600 font-medium">Portfolio</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our successful projects and see how we&apos;ve helped businesses transform 
            their digital presence with innovative web solutions.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-6xl mb-4 text-center">{project.image}</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">{project.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{project.description}</p>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Technologies:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View Case Study →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Project Success Metrics</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <p className="text-gray-600">On-Time Delivery</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-gray-600">Projects Delivered</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let&apos;s create something amazing together. Contact us to discuss your project.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">MicroAI</h3>
            <p className="text-gray-400 mb-8">Professional Web Solutions</p>
            <p className="text-gray-400">&copy; 2024 MicroAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}