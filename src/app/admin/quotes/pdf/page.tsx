'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function PDFQuoteContent() {
  const searchParams = useSearchParams()
  const quoteId = searchParams.get('id')
  
  const [quote, setQuote] = useState<any>(null)
  const [companyProfile, setCompanyProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load company profile
    const loadCompanyProfile = () => {
      try {
        const savedProfile = localStorage.getItem('companyProfile')
        if (savedProfile) {
          setCompanyProfile(JSON.parse(savedProfile))
        } else {
          setCompanyProfile({
            name: 'MicroAI',
            email: 'contact@microai.com',
            phone: '+1 (555) 123-4567',
            address: '123 Tech Street, Silicon Valley, CA 94000',
            website: 'https://microai.com',
            description: 'Professional Web Development Services'
          })
        }
      } catch (err) {
        console.error('Error loading company profile:', err)
      }
    }

    // Load quote data
    const loadQuoteData = () => {
      try {
        // Try to get from sessionStorage first (from generator)
        let quoteData = sessionStorage.getItem('quoteToPrint')
        
        // Try localStorage (from manager)
        if (!quoteData) {
          quoteData = localStorage.getItem('pdfQuoteData')
        }

        if (quoteData) {
          const parsedQuote = JSON.parse(quoteData)
          setQuote(parsedQuote)
          
          // Auto-print after a short delay
          setTimeout(() => {
            window.print()
          }, 1000)
        }
      } catch (err) {
        console.error('Error loading quote data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCompanyProfile()
    loadQuoteData()
  }, [quoteId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quote...</p>
        </div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Quote not found</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close Window
          </button>
        </div>
      </div>
    )
  }

  // Calculate totals
  const setupFee = parseFloat(quote.setupFee || '0')
  const developmentCost = parseFloat(quote.developmentCost || '0')
  const designCost = parseFloat(quote.designCost || '0')
  const monthlyHosting = parseFloat(quote.monthlyHosting || '0')
  
  const setupTotal = setupFee + developmentCost + designCost
  const yearlyHosting = monthlyHosting * 12
  const firstYearTotal = setupTotal + yearlyHosting

  const phases = Array.isArray(quote.phases) ? quote.phases : []

  return (
    <div className="min-h-screen bg-white">
      {/* PAGE 1: OVERVIEW */}
      <div className="page p-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b-2 border-gray-300">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {companyProfile?.name || 'MicroAI'}
              </h1>
              <p className="text-gray-600 mb-4">{companyProfile?.description || 'Professional Web Development Services'}</p>
              <div className="text-sm text-gray-700 space-y-1">
                <p>📧 {companyProfile?.email || 'contact@microai.com'}</p>
                <p>📱 {companyProfile?.phone || '+1 (555) 123-4567'}</p>
                <p>🌐 {companyProfile?.website || 'https://microai.com'}</p>
                <p>📍 {companyProfile?.address || '123 Tech Street, Silicon Valley, CA 94000'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Quote Number</p>
              <p className="text-xl font-bold text-blue-600">QT-{Date.now().toString().slice(-6)}</p>
              <p className="text-sm text-gray-500 mt-4">Date</p>
              <p className="font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Project Overview</h2>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{quote.title || 'Web Development Project'}</h3>
            <p className="text-gray-700 leading-relaxed">{quote.description || 'Custom web development project tailored to your business needs.'}</p>
          </div>
        </div>

        {/* Project Specifications */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Project Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-600 mb-1">Project Type</p>
              <p className="font-semibold text-gray-900">{quote.projectType || 'Web Application'}</p>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-600 mb-1">Timeline</p>
              <p className="font-semibold text-gray-900">{quote.timeline || '8-12 weeks'}</p>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-600 mb-1">Estimated Hours</p>
              <p className="font-semibold text-gray-900">{quote.estimatedHours || 'TBD'} hours</p>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-600 mb-1">Tech Stack</p>
              <p className="font-semibold text-gray-900">{Array.isArray(quote.techStack) ? quote.techStack.join(', ') : 'Modern Web Technologies'}</p>
            </div>
          </div>
        </div>

        {/* Investment Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-blue-100 text-sm mb-1">Setup & Development</p>
              <p className="text-3xl font-bold">${setupTotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">First Year Hosting</p>
              <p className="text-3xl font-bold">${yearlyHosting.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">First Year Total</p>
              <p className="text-4xl font-bold">${firstYearTotal.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-right">
          Page 1 of 3
        </div>
      </div>

      {/* PAGE 2: DEVELOPMENT PHASES */}
      <div className="page p-8 page-break">
        <div className="flex justify-between items-center mb-6 text-xs text-gray-500">
          <span>Quote #: QT-{Date.now().toString().slice(-6)}</span>
          <span>Page: 2 of 3</span>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b-2 border-gray-300 pb-3">
          Development Process & Phases
        </h2>

        <div className="space-y-6">
          {phases.length > 0 ? phases.map((phase: any, index: number) => (
            <div key={index} className="border-l-4 border-blue-600 pl-4">
              <div className="bg-gray-50 p-4 rounded-r">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Phase {index + 1}: {phase.title}
                </h3>
                {phase.description && (
                  <p className="text-sm text-gray-700 mb-2">{phase.description}</p>
                )}
                {phase.tasks && Array.isArray(phase.tasks) && phase.tasks.length > 0 && phase.tasks[0] !== '' && (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                    {phase.tasks.filter((task: string) => task && task.trim() !== '').map((task: string, taskIdx: number) => (
                      <li key={taskIdx}>{task}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )) : (
            <>
              {/* Default phases */}
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="bg-gray-50 p-4 rounded-r">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Phase 1: Discovery & Planning</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Initial consultation to understand your business goals, target audience, and project requirements. 
                    We&apos;ll create a detailed project roadmap and technical specifications document.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                    <li>Requirements gathering and analysis</li>
                    <li>Competitive research and market analysis</li>
                    <li>Project scope definition</li>
                    <li>Technical architecture planning</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <div className="bg-gray-50 p-4 rounded-r">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Phase 2: Design & Prototyping</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Creating wireframes and high-fidelity mockups that bring your vision to life. 
                    Interactive prototypes allow you to experience the user journey before development begins.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                    <li>User experience (UX) design</li>
                    <li>User interface (UI) design</li>
                    <li>Interactive prototypes</li>
                    <li>Design system creation</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <div className="bg-gray-50 p-4 rounded-r">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Phase 3: Development</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Building your application with clean, scalable code using modern technologies. 
                    Regular updates keep you informed of progress throughout the development cycle.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                    <li>Frontend development</li>
                    <li>Backend development and API integration</li>
                    <li>Database design and implementation</li>
                    <li>Security implementation</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-orange-600 pl-4">
                <div className="bg-gray-50 p-4 rounded-r">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Phase 4: Testing & Quality Assurance</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Comprehensive testing ensures your application works flawlessly across all devices and browsers. 
                    We identify and fix issues before your users ever encounter them.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                    <li>Functional testing</li>
                    <li>Cross-browser compatibility</li>
                    <li>Mobile responsiveness testing</li>
                    <li>Performance optimization</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-red-600 pl-4">
                <div className="bg-gray-50 p-4 rounded-r">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Phase 5: Deployment & Launch</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Smooth deployment to production servers with proper configuration and monitoring. 
                    We ensure everything is optimized and ready for your users.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                    <li>Server setup and configuration</li>
                    <li>Domain and SSL setup</li>
                    <li>Production deployment</li>
                    <li>Monitoring and analytics setup</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-cyan-600 pl-4">
                <div className="bg-gray-50 p-4 rounded-r">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Phase 6: Training & Handover</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Comprehensive training for your team on managing and updating the website. Complete documentation 
                    and ongoing support to ensure you&apos;re confident managing your new platform.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                    <li>Admin panel training session</li>
                    <li>Documentation delivery</li>
                    <li>30-day support period</li>
                    <li>Knowledge transfer</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 text-xs text-gray-500 text-right">
          Page 2 of 3
        </div>
      </div>

      {/* PAGE 3: PRICING & TERMS */}
      <div className="page p-8 page-break">
        <div className="flex justify-between items-center mb-6 text-xs text-gray-500">
          <span>Quote #: QT-{Date.now().toString().slice(-6)}</span>
          <span>Page: 3 of 3</span>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b-2 border-gray-300 pb-3">
          Investment & Pricing Breakdown
        </h2>

        {/* Pricing Table */}
        <div className="mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left p-3 font-semibold">#</th>
                <th className="text-left p-3 font-semibold">Description</th>
                <th className="text-center p-3 font-semibold">Quantity</th>
                <th className="text-right p-3 font-semibold">Unit Price</th>
                <th className="text-right p-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3">1</td>
                <td className="p-3">
                  <div className="font-semibold">Setup & Initialization Fee</div>
                  <div className="text-sm text-gray-700 mt-1">Project setup, development environment, initial configuration</div>
                </td>
                <td className="text-center p-3">1</td>
                <td className="text-right p-3">${setupFee.toLocaleString()}</td>
                <td className="text-right p-3 font-semibold">${setupFee.toLocaleString()}</td>
              </tr>
              
              {developmentCost > 0 && (
                <tr className="border-b border-gray-200">
                  <td className="p-3">2</td>
                  <td className="p-3">
                    <div className="font-semibold">Development Services</div>
                    <div className="text-sm text-gray-700 mt-1">Custom development work, coding, feature implementation</div>
                  </td>
                  <td className="text-center p-3">1</td>
                  <td className="text-right p-3">${developmentCost.toLocaleString()}</td>
                  <td className="text-right p-3 font-semibold">${developmentCost.toLocaleString()}</td>
                </tr>
              )}

              {designCost > 0 && (
                <tr className="border-b border-gray-200">
                  <td className="p-3">{developmentCost > 0 ? '3' : '2'}</td>
                  <td className="p-3">
                    <div className="font-semibold">Design Services</div>
                    <div className="text-sm text-gray-700 mt-1">UI/UX design, graphics, branding, visual assets</div>
                  </td>
                  <td className="text-center p-3">1</td>
                  <td className="text-right p-3">${designCost.toLocaleString()}</td>
                  <td className="text-right p-3 font-semibold">${designCost.toLocaleString()}</td>
                </tr>
              )}

              <tr className="border-b border-gray-200 bg-blue-50">
                <td className="p-3">{(developmentCost > 0 ? 3 : 2) + (designCost > 0 ? 1 : 0)}</td>
                <td className="p-3">
                  <div className="font-semibold">Hosting & Maintenance Services</div>
                  <div className="text-sm text-gray-700 mt-1">Monthly hosting, SSL, backups, updates, technical support</div>
                </td>
                <td className="text-center p-3">12 months</td>
                <td className="text-right p-3">${monthlyHosting.toLocaleString()}/mo</td>
                <td className="text-right p-3 font-semibold">${yearlyHosting.toLocaleString()}</td>
              </tr>

              {/* Subtotals */}
              <tr className="border-t-2 border-gray-400">
                <td colSpan={4} className="text-right p-3 font-semibold">Setup Total:</td>
                <td className="text-right p-3 font-bold text-lg">${setupTotal.toLocaleString()}</td>
              </tr>
              <tr className="bg-green-100 border-t border-gray-300">
                <td colSpan={4} className="text-right p-3 font-bold text-lg">FIRST YEAR TOTAL:</td>
                <td className="text-right p-3 font-bold text-2xl text-green-700">${firstYearTotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Milestones */}
        {quote.milestones && Array.isArray(quote.milestones) && quote.milestones.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Payment Schedule:</h3>
            <div className="space-y-2">
              {quote.milestones.map((milestone: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-4 border border-gray-300 rounded bg-gray-50">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{milestone.name || 'Milestone'}</p>
                    <p className="text-sm text-gray-600">{milestone.due || 'TBD'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">${(milestone.amount || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{milestone.percentage || 0}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="bg-gray-50 border border-gray-200 rounded p-6">
          <h3 className="font-bold text-base mb-3 text-gray-900">Terms & Conditions</h3>
          <div className="text-sm text-gray-700 space-y-2">
            {quote.terms ? (
              <p className="whitespace-pre-wrap">{quote.terms}</p>
            ) : (
              <>
                <p>• This quote is valid for 30 days from the date of issue.</p>
                <p>• Payment terms: 50% deposit to begin work, 25% at mid-point review, 25% upon completion.</p>
                <p>• Timeline estimates are based on timely client feedback and content delivery.</p>
                <p>• Additional features or scope changes will be quoted separately.</p>
                <p>• All work remains property of MicroAI until final payment is received.</p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Thank you for considering {companyProfile?.name || 'MicroAI'} for your project!
          </p>
          <p className="text-sm text-gray-600">
            Questions? Contact us at {companyProfile?.email || 'contact@microai.com'} or {companyProfile?.phone || '+1 (555) 123-4567'}
          </p>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-right">
          Page 3 of 3
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .page {
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          .page:last-child {
            page-break-after: auto;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          /* Hide non-print elements */
          nav, header, footer, button, .no-print {
            display: none !important;
          }
        }
        
        @media screen {
          .page {
            max-width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </div>
  )
}

export default function PDFQuotePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quote...</p>
        </div>
      </div>
    }>
      <PDFQuoteContent />
    </Suspense>
  )
}
