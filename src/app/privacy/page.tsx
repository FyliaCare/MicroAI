import type { Metadata } from 'next'
import Link from 'next/link'
import AdvancedNavbar from '@/components/layout/AdvancedNavbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy - MicroAI Systems',
  description: 'Privacy Policy for MicroAI Systems. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <AdvancedNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last Updated: October 28, 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to MicroAI Systems ("we," "our," or "us"). We are committed to protecting your personal information 
              and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you visit our website <span className="text-blue-400">www.microaisystems.com</span> and use our services.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the site or use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">2.1 Personal Information You Provide</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Fill out contact forms or inquiry forms</li>
              <li>Request quotes or proposals</li>
              <li>Register for a client account</li>
              <li>Subscribe to our newsletter</li>
              <li>Communicate with us via email, phone, or live chat</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              The personal information we collect may include:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Contact Information:</strong> Name, email address, phone number, company name</li>
              <li><strong>Contact Information:</strong> Name, email address, phone number, company name</li>
              <li><strong>Project Information:</strong> Project requirements, budget, timeline preferences</li>
              <li><strong>Account Information:</strong> Username, password (encrypted), preferences</li>
              <li><strong>Communication Data:</strong> Any information you provide in messages, feedback, or support requests</li>
            </ul>
            <h3 className="text-xl font-semibold text-blue-400 mb-3 mt-6">2.2 Information Automatically Collected</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, links clicked, referring website</li>
              <li><strong>Technical Data:</strong> IP address, browser version, time zone settings</li>
              <li><strong>Cookies and Tracking:</strong> See our <Link href="/cookies" className="text-blue-400 hover:text-blue-300 underline">Cookie Policy</Link></li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Service Delivery:</strong> To provide, operate, and maintain our web development services</li>
              <li><strong>Communication:</strong> To respond to your inquiries, send project updates, and provide customer support</li>
              <li><strong>Project Management:</strong> To understand your requirements and deliver custom solutions</li>
              <li><strong>Marketing:</strong> To send newsletters, promotional materials, and service updates (with your consent)</li>
              <li><strong>Improvement:</strong> To analyze usage patterns and improve our website and services</li>
              <li><strong>Security:</strong> To protect against fraud, unauthorized access, and security threats</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. How We Share Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (hosting, analytics, payment processing, email delivery)</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of all or part of our business</li>
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (cloud hosting platforms, analytics, email delivery)</li>
              <li><strong>Hosting Partners:</strong> We use third-party hosting platforms (Render.com and similar services) to host our website and applications</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of all or part of our business</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Protection:</strong> To protect our rights, property, safety, or that of our users or the public</li>
              <li><strong>With Consent:</strong> When you have given explicit consent for specific purposes</li>
            </ul>rong className="text-white">We do not sell your personal information</strong> to third parties for their marketing purposes.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. 
              Types of cookies we use:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Track your browsing habits for targeted advertising (with consent)</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, 
              if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>

          {/* Data Security */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Encrypted storage of sensitive information</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure backup systems on third-party hosting platforms</li>
              <li>Staff training on data protection</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              We utilize enterprise-grade third-party hosting platforms that comply with international security standards. 
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
              to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
              Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your 
              information, we will securely delete or anonymize it.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Retention periods vary based on the type of data:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Account Data:</strong> Until account deletion is requested</li>
              <li><strong>Project Data:</strong> For the duration of the project plus 7 years for records</li>
              <li><strong>Marketing Data:</strong> Until you unsubscribe or request deletion</li>
              <li><strong>Analytics Data:</strong> Aggregated and anonymized after 26 months</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Your Privacy Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Restriction:</strong> Request restriction of processing of your data</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing (where applicable)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:sales@microaisystems.com" className="text-blue-400 hover:text-blue-300">
                sales@microaisystems.com
              </a>. We will respond to your request within 30 days.
            </p>
          </section>

          {/* International Transfers */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed">
              Your information may be transferred to and maintained on servers located outside of your country, state, 
              or jurisdiction where data protection laws may differ. By using our services, you consent to the transfer 
              of your information to Ghana and other countries where we operate.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              We ensure appropriate safeguards are in place for international data transfers in compliance with applicable 
              data protection laws.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
              information from children. If you are a parent or guardian and believe your child has provided us with 
              personal information, please contact us immediately, and we will delete such information.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Third-Party Websites</h2>
            <p className="text-gray-300 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices 
              of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              We will notify you of any material changes by posting the new Privacy Policy on this page and updating the 
              "Last Updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Your continued use of our services after any changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="bg-black/30 rounded-lg p-6 space-y-3">
              <p className="text-white">
                <strong>MicroAI Systems</strong>
              </p>
              <p className="text-gray-300">
                <strong>Email:</strong>{' '}
                <a href="mailto:sales@microaisystems.com" className="text-blue-400 hover:text-blue-300">
                  sales@microaisystems.com
                </a>
              </p>
              <p className="text-gray-300">
                <strong>Phone:</strong> +233 244486837 | +233 544230568
              </p>
              <p className="text-gray-300">
                <strong>Website:</strong>{' '}
                <a href="https://www.microaisystems.com" className="text-blue-400 hover:text-blue-300">
                  www.microaisystems.com
                </a>
              </p>
              <p className="text-gray-300">
                <strong>Location:</strong> BR253 Pasture St. Takoradi, Ghana
              </p>
              <p className="text-gray-300">
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
          </section>

          {/* GDPR Compliance */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">14. GDPR Compliance (For EU Users)</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              If you are located in the European Economic Area (EEA), you have additional rights under the General Data 
              Protection Regulation (GDPR):
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li><strong>Legal Basis:</strong> We process your data based on consent, contract performance, legal obligations, or legitimate interests</li>
              <li><strong>Data Protection Officer:</strong> You may contact our DPO at sales@microaisystems.com</li>
              <li><strong>Supervisory Authority:</strong> You have the right to lodge a complaint with your local data protection authority</li>
              <li><strong>Automated Decision-Making:</strong> We do not use automated decision-making or profiling that produces legal effects</li>
            </ul>
          </section>

          {/* California Privacy Rights */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">15. California Privacy Rights (CCPA)</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Right to know what personal information is collected, used, shared, or sold</li>
              <li>Right to delete personal information held by businesses</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              To exercise these rights, please contact us at sales@microaisystems.com with "California Privacy Rights" in the subject line.
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
