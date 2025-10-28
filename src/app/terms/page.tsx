import type { Metadata } from 'next'
import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service - MicroAI Systems',
  description: 'Terms of Service for MicroAI Systems. Read our terms and conditions for using our web development services.',
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <AdvancedNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last Updated: October 28, 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to MicroAI Systems. These Terms of Service ("Terms") govern your access to and use of our website, 
              services, and products (collectively, the "Services"). By accessing or using our Services, you agree to be 
              bound by these Terms.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              <strong className="text-white">IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE OUR SERVICES.</strong>
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              We reserve the right to modify these Terms at any time. Continued use of our Services after changes 
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Services Description */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Services</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              MicroAI Systems provides web development services, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Custom web application development</li>
              <li>SaaS platform development</li>
              <li>Corporate website design and development</li>
              <li>Web tools and utilities development</li>
              <li>E-commerce solutions</li>
              <li>API development and integration</li>
              <li>Hosting and maintenance services</li>
              <li>Technical consulting</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              The specific scope of services for each project will be detailed in a separate Project Agreement or 
              Statement of Work (SOW).
            </p>
          </section>

          {/* Eligibility */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Eligibility</h2>
            <p className="text-gray-300 leading-relaxed">
              You must be at least 18 years old to use our Services. By using our Services, you represent and warrant 
              that you meet this age requirement and have the legal capacity to enter into these Terms.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              If you are using our Services on behalf of an organization, you represent that you have the authority to 
              bind that organization to these Terms.
            </p>
          </section>

          {/* Account Registration */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Account Registration and Security</h2>
            
            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">4.1 Account Creation</h3>
            <p className="text-gray-300 leading-relaxed">
              Some features of our Services may require you to create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">4.2 Account Termination</h3>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to suspend or terminate your account at our discretion if you violate these Terms, 
              engage in fraudulent activity, or for any other reason we deem necessary.
            </p>
          </section>

          {/* Project Engagement */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Project Engagement Terms</h2>
            
            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">5.1 Scope of Work</h3>
            <p className="text-gray-300 leading-relaxed">
              Each project begins with a detailed Statement of Work (SOW) or Project Agreement that outlines:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Project deliverables and milestones</li>
              <li>Timeline and deadlines</li>
              <li>Payment terms and pricing</li>
              <li>Technical specifications</li>
              <li>Responsibilities of both parties</li>
              <li>Change request procedures</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">5.2 Client Responsibilities</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              To ensure successful project completion, clients agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide timely feedback and approvals</li>
              <li>Supply necessary content, materials, and access</li>
              <li>Respond to requests for information within 48 hours</li>
              <li>Designate a primary point of contact</li>
              <li>Make timely payments as agreed</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">5.3 Timeline Estimates</h3>
            <p className="text-gray-300 leading-relaxed">
              Project timelines are estimates based on the agreed scope. Delays caused by client feedback, change 
              requests, or unforeseen technical challenges may extend deadlines. We will communicate any timeline 
              changes promptly.
            </p>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">5.4 Change Requests</h3>
            <p className="text-gray-300 leading-relaxed">
              Changes to the agreed scope of work must be submitted in writing. Additional work may result in:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Revised timeline</li>
              <li>Additional fees</li>
              <li>Updated project milestones</li>
            </ul>
          </section>

          {/* Payment Terms */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Payment Terms</h2>
            
            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">6.1 Pricing and Fees</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              Fees for our services are specified in project quotes and agreements. Standard payment structures include:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Setup Fees:</strong> One-time fees for project initiation and development</li>
              <li><strong>Development Costs:</strong> Fees for custom development work</li>
              <li><strong>Monthly Hosting:</strong> Recurring fees for hosting services</li>
              <li><strong>Monthly Maintenance:</strong> Optional ongoing support and updates</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">6.2 Payment Schedule</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              Unless otherwise agreed in writing, payment terms are:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Deposit:</strong> 50% deposit required before work begins</li>
              <li><strong>Final Payment:</strong> 50% due upon project completion or go-live</li>
              <li><strong>Monthly Fees:</strong> Due on the 1st of each month</li>
              <li><strong>Payment Method:</strong> Bank transfer, mobile money, or approved payment gateways</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">6.3 Late Payments</h3>
            <p className="text-gray-300 leading-relaxed">
              Invoices are due within 7 days of receipt. Late payments may result in:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Suspension of work on active projects</li>
              <li>Suspension of hosting or maintenance services</li>
              <li>Late payment fees of 5% per month</li>
              <li>Legal action to recover outstanding amounts</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">6.4 Refund Policy</h3>
            <p className="text-gray-300 leading-relaxed">
              Deposits are non-refundable once work has commenced. Refunds for completed work will not be issued. 
              In cases of project cancellation, clients are responsible for payment of all work completed to date.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">7.1 Ownership Transfer</h3>
            <p className="text-gray-300 leading-relaxed">
              Upon full payment, all custom code and designs created specifically for your project will be transferred 
              to you. This includes:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Custom application code</li>
              <li>Custom design elements</li>
              <li>Project-specific assets</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">7.2 MicroAI Systems Property</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              MicroAI Systems retains ownership of:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Proprietary frameworks and tools</li>
              <li>Reusable code libraries and components</li>
              <li>Development methodologies and processes</li>
              <li>Pre-existing intellectual property</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">7.3 Third-Party Components</h3>
            <p className="text-gray-300 leading-relaxed">
              Projects may include third-party libraries, frameworks, and tools (e.g., React, Next.js, Tailwind CSS) 
              that are subject to their own licenses. You agree to comply with all applicable third-party licenses.
            </p>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">7.4 Portfolio Rights</h3>
            <p className="text-gray-300 leading-relaxed">
              MicroAI Systems reserves the right to showcase completed projects in our portfolio, case studies, and 
              marketing materials unless otherwise agreed in writing.
            </p>
          </section>

          {/* Warranties and Disclaimers */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Warranties and Disclaimers</h2>
            
            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">8.1 Service Warranty</h3>
            <p className="text-gray-300 leading-relaxed">
              We warrant that services will be performed in a professional and workmanlike manner consistent with 
              industry standards. We provide a 30-day bug fix warranty from project delivery for issues directly 
              related to our work.
            </p>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">8.2 Disclaimer of Warranties</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              EXCEPT AS EXPRESSLY PROVIDED, OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Compatibility with all systems</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">8.3 Third-Party Services</h3>
            <p className="text-gray-300 leading-relaxed">
              We are not responsible for third-party services, hosting providers, payment processors, or other 
              external dependencies. Issues with third-party services are the responsibility of those providers.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MICROAI SYSTEMS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Damages resulting from third-party services or content</li>
              <li>Damages exceeding the amount paid for services in the preceding 12 months</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you.
            </p>
          </section>

          {/* Indemnification */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree to indemnify, defend, and hold harmless MicroAI Systems, its officers, directors, employees, 
              and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Your use of our Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you provide for your project</li>
              <li>Your use of the delivered project</li>
            </ul>
          </section>

          {/* Confidentiality */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Confidentiality</h2>
            <p className="text-gray-300 leading-relaxed">
              Both parties agree to maintain confidentiality of proprietary information shared during the project. 
              This includes:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Business strategies and plans</li>
              <li>Technical specifications and code</li>
              <li>Financial information</li>
              <li>Customer data</li>
              <li>Trade secrets and proprietary processes</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Confidential information does not include information that is publicly available, independently developed, 
              or required to be disclosed by law.
            </p>
          </section>

          {/* Termination */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">12. Termination</h2>
            
            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">12.1 Project Cancellation</h3>
            <p className="text-gray-300 leading-relaxed">
              Either party may terminate a project with written notice. In case of termination:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Client is responsible for payment of all work completed to date</li>
              <li>MicroAI Systems will deliver all completed work upon payment</li>
              <li>Deposits are non-refundable</li>
              <li>Both parties release each other from future obligations</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">12.2 Termination for Breach</h3>
            <p className="text-gray-300 leading-relaxed">
              We may terminate immediately if you:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Fail to make payments</li>
              <li>Violate intellectual property rights</li>
              <li>Engage in illegal activities</li>
              <li>Breach these Terms</li>
            </ul>
          </section>

          {/* Hosting and Maintenance */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">13. Hosting and Maintenance Services</h2>
            
            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">13.1 Hosting Services</h3>
            <p className="text-gray-300 leading-relaxed">
              If you subscribe to our hosting services, we provide:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Server space and resources</li>
              <li>99% uptime guarantee (excluding planned maintenance)</li>
              <li>Regular backups</li>
              <li>Security monitoring</li>
              <li>SSL certificates</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">13.2 Maintenance Services</h3>
            <p className="text-gray-300 leading-relaxed">
              Monthly maintenance includes:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Security updates and patches</li>
              <li>Bug fixes for existing features</li>
              <li>Performance monitoring</li>
              <li>Technical support (up to agreed hours)</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">13.3 Service Suspension</h3>
            <p className="text-gray-300 leading-relaxed">
              Hosting and maintenance services may be suspended for non-payment. We will provide 7 days notice 
              before suspension. Extended suspension may result in data loss.
            </p>
          </section>

          {/* Acceptable Use */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">14. Acceptable Use Policy</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              You agree not to use our Services to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Distribute malware, viruses, or harmful code</li>
              <li>Engage in spamming or phishing</li>
              <li>Harass, abuse, or harm others</li>
              <li>Distribute illegal, offensive, or harmful content</li>
              <li>Attempt unauthorized access to systems</li>
              <li>Interfere with service operation</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">15. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">15.1 Informal Resolution</h3>
            <p className="text-gray-300 leading-relaxed">
              In the event of any dispute, both parties agree to first attempt to resolve the matter through good 
              faith negotiations.
            </p>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">15.2 Mediation</h3>
            <p className="text-gray-300 leading-relaxed">
              If informal resolution fails, parties agree to participate in mediation before pursuing legal action.
            </p>

            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">15.3 Governing Law</h3>
            <p className="text-gray-300 leading-relaxed">
              These Terms are governed by the laws of Ghana. Any legal action must be brought in the courts of Ghana.
            </p>
          </section>

          {/* Force Majeure */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">16. Force Majeure</h2>
            <p className="text-gray-300 leading-relaxed">
              MicroAI Systems is not liable for delays or failures in performance resulting from circumstances beyond 
              our reasonable control, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Natural disasters</li>
              <li>War, terrorism, or civil unrest</li>
              <li>Government actions or regulations</li>
              <li>Power outages or internet failures</li>
              <li>Pandemics or health emergencies</li>
              <li>Third-party service failures</li>
            </ul>
          </section>

          {/* Severability */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">17. Severability</h2>
            <p className="text-gray-300 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited 
              or eliminated to the minimum extent necessary so that these Terms remain in full force and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">18. Entire Agreement</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms, together with any Project Agreements, SOWs, and our Privacy Policy, constitute the entire 
              agreement between you and MicroAI Systems regarding the use of our Services and supersede all prior 
              agreements and understandings.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">19. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-black/30 rounded-lg p-6 space-y-3">
              <p className="text-white">
                <strong>MicroAI Systems</strong>
              </p>
              <p className="text-gray-300">
                <strong>Email:</strong>{' '}
                <a href="mailto:microailabs@outlook.com" className="text-blue-400 hover:text-blue-300">
                  microailabs@outlook.com
                </a>
              </p>
              <p className="text-gray-300">
                <strong>Location:</strong> Takoradi, Ghana
              </p>
              <p className="text-gray-300">
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">20. Acknowledgment</h2>
            <p className="text-gray-300 leading-relaxed">
              BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE 
              BOUND BY THEM.
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link 
            href="/" 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
