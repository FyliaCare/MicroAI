'use client'

import { useState } from 'react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Logo from '@/components/Logo'
import DevBanner from '@/components/DevBanner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', company: '', message: '' })
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => setSubmitStatus('idle'), 5000)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Development Banner */}
      <DevBanner />
      
      {/* Navigation */}
      <nav className="fixed top-[52px] sm:top-[56px] w-full bg-black/80 backdrop-blur-lg border-b border-gray-800 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Logo />
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">Portfolio</Link>
              <Link href="/contact" className="text-blue-500 font-medium">Contact</Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden pb-4 border-t border-gray-800 mt-2 pt-4`}>
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800">
                Home
              </Link>
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800">
                Services
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800">
                About
              </Link>
              <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800">
                Portfolio
              </Link>
              <Link href="/contact" className="text-blue-500 font-medium px-4 py-2 rounded-lg bg-blue-500/10">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-[180px] sm:pt-[200px] pb-20 px-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-20 left-20 animate-pulse" style={{ transform: 'translate3d(0,0,0)' }}></div>
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-40 right-20 animate-pulse delay-700" style={{ transform: 'translate3d(0,0,0)' }}></div>
          <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl bottom-20 left-1/2 animate-pulse delay-1000" style={{ transform: 'translate3d(0,0,0)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-full px-6 py-2 backdrop-blur-sm animate-pulse-glow">
              <span className="text-blue-400 text-sm font-semibold">💬 Let&apos;s Build Something Amazing</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fadeIn delay-200">
            Get in <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">Touch</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeIn delay-500 px-4">
            Ready to transform your idea into reality? Let&apos;s discuss your project and show you 
            how we can deliver <span className="text-blue-500 font-bold">10x faster</span> than traditional development.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Grid */}
      <section className="pb-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Contact Form - Takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Send us a Message
                  </h2>

                  {submitStatus === 'success' && (
                    <div className="mb-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg flex items-center animate-fadeIn">
                      <span className="mr-2">✅</span>
                      <span>Thank you! We&apos;ll get back to you within 24 hours.</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center animate-fadeIn">
                      <span className="mr-2">❌</span>
                      <span>Something went wrong. Please try again or email us directly.</span>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <Input
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      
                      <Input
                        type="email"
                        label="Email Address"
                        name="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <Input
                        label="Company Name"
                        name="company"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <Textarea
                      label="Project Details"
                      name="message"
                      placeholder="Tell us about your project, goals, timeline, and budget..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                    />
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3 sm:py-4 px-6 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] overflow-hidden min-h-[48px] touch-manipulation"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            🚀 Send Message
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Info - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Contact */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Quick Contact
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 group/item">
                      <div className="bg-blue-600/20 p-3 rounded-lg group-hover/item:bg-blue-600/30 transition-colors">
                        <span className="text-2xl">📧</span>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email Us</p>
                        <a href="mailto:microailabs@outlook.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                          microailabs@outlook.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 group/item">
                      <div className="bg-pink-600/20 p-3 rounded-lg group-hover/item:bg-pink-600/30 transition-colors">
                        <span className="text-2xl">📍</span>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Location</p>
                        <p className="text-pink-400">Takoradi, Ghana</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 group/item">
                      <div className="bg-orange-600/20 p-3 rounded-lg group-hover/item:bg-orange-600/30 transition-colors">
                        <span className="text-2xl">🕐</span>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Business Hours</p>
                        <p className="text-orange-400 text-sm">Mon-Fri: 9:00 AM - 6:00 PM GMT</p>
                        <p className="text-orange-400 text-sm">Weekend: On-call support</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ⚡ Fast Response
                  </h3>
                  <p className="text-gray-300 mb-4">
                    We typically respond within <span className="text-blue-400 font-bold">24 hours</span> on business days.
                  </p>
                  <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                    <p className="text-sm text-gray-400">
                      <span className="text-green-400 font-bold">🟢 Available Now</span>
                      <br />
                      Ready to discuss your project
                    </p>
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                    What Happens Next?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-500 font-bold">1.</span>
                      <p className="text-gray-300 text-sm">We review your project details</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-purple-500 font-bold">2.</span>
                      <p className="text-gray-300 text-sm">Schedule a discovery call within 48h</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-pink-500 font-bold">3.</span>
                      <p className="text-gray-300 text-sm">Provide timeline & cost estimate</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-orange-500 font-bold">4.</span>
                      <p className="text-gray-300 text-sm">Start building your solution!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-blue-600/20 p-3 rounded-lg hover:bg-blue-600/40 transition-all hover:scale-110">
                      <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-sky-600/20 p-3 rounded-lg hover:bg-sky-600/40 transition-all hover:scale-110">
                      <svg className="w-6 h-6 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-blue-700/20 p-3 rounded-lg hover:bg-blue-700/40 transition-all hover:scale-110">
                      <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Logo />
            <p className="text-gray-400 mt-4 mb-2">
              Building the future, <span className="text-blue-500 font-bold">10x faster</span>
            </p>
            <p className="text-gray-500 text-sm">
              &copy; 2024 MicroAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}