import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-800/50 bg-black">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-transparent pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
                  MicroAI
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Revolutionary AI-powered development delivering enterprise-grade projects 10x faster than traditional companies.
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4 pt-2">
                <a 
                  href="mailto:microailabs@outlook.com"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Email"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all mr-0 group-hover:mr-2"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all mr-0 group-hover:mr-2"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all mr-0 group-hover:mr-2"></span>
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all mr-0 group-hover:mr-2"></span>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all mr-0 group-hover:mr-2"></span>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-purple-400 transition-all mr-0 group-hover:mr-2"></span>
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Admin
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="hidden lg:block">
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Our Services</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <span className="text-blue-500 mr-2">💻</span>
                    Web Applications
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <span className="text-purple-500 mr-2">🚀</span>
                    SaaS Platforms
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <span className="text-pink-500 mr-2">🌐</span>
                    Company Websites
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <span className="text-cyan-500 mr-2">🛠️</span>
                    Custom Web Tools
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Get In Touch</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <a 
                      href="mailto:microailabs@outlook.com" 
                      className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                    >
                      microailabs@outlook.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-gray-300 text-sm">Takoradi, Ghana</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Response Time</p>
                    <p className="text-gray-300 text-sm">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} MicroAI. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
