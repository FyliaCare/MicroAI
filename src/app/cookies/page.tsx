import { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Cookie Policy | MicroAI Systems',
  description: 'Learn about how MicroAI Systems uses cookies and similar technologies to improve your browsing experience and analyze website traffic.',
  openGraph: {
    title: 'Cookie Policy | MicroAI Systems',
    description: 'Cookie usage and tracking technologies on the MicroAI Systems platform',
    type: 'website',
  },
}

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black">
      <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="prose prose-invert prose-purple max-w-none">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              🍪 Cookie Policy
            </h1>
            <p className="text-xl text-gray-300">
              How we use cookies and similar tracking technologies
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">📋 What Are Cookies?</h2>
            <p className="text-gray-300 mb-4">
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) 
              when you visit our website. They help us provide you with a better experience by remembering 
              your preferences, analyzing site traffic, and understanding how you interact with our services.
            </p>
            <p className="text-gray-300">
              This Cookie Policy explains what cookies we use, why we use them, and how you can manage 
              your cookie preferences.
            </p>
          </section>

          {/* Types of Cookies We Use */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">🔍 Types of Cookies We Use</h2>

            {/* Essential Cookies */}
            <div className="bg-black/30 rounded-lg p-6 mb-6 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-purple-400 mb-3">
                ✅ Essential Cookies (Required)
              </h3>
              <p className="text-gray-300 mb-4">
                These cookies are necessary for the website to function properly. They enable core 
                functionality such as security, authentication, and maintaining your session while 
                logged in.
              </p>
              <div className="bg-black/50 rounded p-4 mb-4">
                <p className="text-sm text-gray-400 font-mono mb-2"><strong>Examples:</strong></p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Authentication tokens (keeps you logged in)</li>
                  <li>• Session identifiers (maintains your browsing session)</li>
                  <li>• Security cookies (protects against unauthorized access)</li>
                  <li>• Load balancing (ensures optimal performance)</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500">
                <strong>Duration:</strong> Session cookies (deleted when you close your browser) or persistent 
                cookies (typically 30 days to 1 year)
              </p>
              <p className="text-xs text-yellow-400 mt-2">
                ⚠️ These cookies cannot be disabled as they are essential for the website to work.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-black/30 rounded-lg p-6 mb-6 border border-blue-500/20">
              <h3 className="text-2xl font-bold text-blue-400 mb-3">
                📊 Analytics Cookies (Optional)
              </h3>
              <p className="text-gray-300 mb-4">
                We use analytics cookies to understand how visitors interact with our website. This 
                helps us improve our services and provide a better user experience.
              </p>
              <div className="bg-black/50 rounded p-4 mb-4">
                <p className="text-sm text-gray-400 font-mono mb-2"><strong>Services:</strong></p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• <strong>Google Analytics:</strong> Website traffic analysis, page views, user behavior</li>
                  <li>• <strong>Performance Monitoring:</strong> Page load times, error tracking</li>
                  <li>• <strong>User Flow Analysis:</strong> Understanding navigation patterns</li>
                </ul>
              </div>
              <div className="bg-black/50 rounded p-4 mb-4">
                <p className="text-sm text-gray-400 font-mono mb-2"><strong>Data Collected:</strong></p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Pages visited and time spent on each page</li>
                  <li>• Referring website or source</li>
                  <li>• Browser type, device type, and screen resolution</li>
                  <li>• Geographic location (country/city level only)</li>
                  <li>• Anonymous visitor ID (no personal information)</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500">
                <strong>Duration:</strong> Up to 2 years
              </p>
            </div>

            {/* Functional Cookies */}
            <div className="bg-black/30 rounded-lg p-6 mb-6 border border-green-500/20">
              <h3 className="text-2xl font-bold text-green-400 mb-3">
                ⚙️ Functional Cookies (Optional)
              </h3>
              <p className="text-gray-300 mb-4">
                These cookies enable enhanced functionality and personalization, such as remembering 
                your preferences and providing customized content.
              </p>
              <div className="bg-black/50 rounded p-4 mb-4">
                <p className="text-sm text-gray-400 font-mono mb-2"><strong>Features:</strong></p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Language preferences</li>
                  <li>• Theme selection (dark mode/light mode)</li>
                  <li>• Remembering form inputs and selections</li>
                  <li>• Chat widget preferences</li>
                  <li>• Project quote wizard progress</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500">
                <strong>Duration:</strong> 30 days to 1 year
              </p>
            </div>

            {/* Third-Party Cookies */}
            <div className="bg-black/30 rounded-lg p-6 border border-orange-500/20">
              <h3 className="text-2xl font-bold text-orange-400 mb-3">
                🌐 Third-Party Cookies
              </h3>
              <p className="text-gray-300 mb-4">
                Some cookies are set by third-party services that appear on our pages. We do not 
                control these cookies, and they are subject to the respective third party's privacy policy.
              </p>
              <div className="bg-black/50 rounded p-4 mb-4">
                <p className="text-sm text-gray-400 font-mono mb-2"><strong>Third-Party Services:</strong></p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>
                    • <strong>Google Analytics:</strong> Website traffic analysis<br />
                    <Link 
                      href="https://policies.google.com/privacy" 
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 text-xs"
                    >
                      → View Google's Privacy Policy
                    </Link>
                  </li>
                  <li>
                    • <strong>Social Media Platforms:</strong> Social sharing buttons and embedded content<br />
                    <span className="text-xs text-gray-500">
                      (Facebook, Twitter/X, LinkedIn - when present)
                    </span>
                  </li>
                </ul>
              </div>
              <p className="text-xs text-yellow-400">
                ⚠️ We recommend reviewing the privacy policies of these third-party services to 
                understand their data collection practices.
              </p>
            </div>
          </section>

          {/* How to Manage Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">⚙️ How to Manage Cookies</h2>
            
            <p className="text-gray-300 mb-6">
              You have the right to accept or reject cookies. You can manage your cookie preferences 
              through your browser settings. Please note that blocking certain cookies may impact 
              the functionality of our website.
            </p>

            {/* Browser Controls */}
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-6 mb-6 border border-purple-500/30">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">🌐 Browser Cookie Settings</h3>
              <p className="text-gray-300 mb-4">
                Most web browsers allow you to control cookies through their settings:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <div>
                    <strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data<br />
                    <Link 
                      href="https://support.google.com/chrome/answer/95647" 
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      → Chrome Cookie Guide
                    </Link>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <div>
                    <strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data<br />
                    <Link 
                      href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" 
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      → Firefox Cookie Guide
                    </Link>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <div>
                    <strong>Safari:</strong> Preferences → Privacy → Manage Website Data<br />
                    <Link 
                      href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" 
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      → Safari Cookie Guide
                    </Link>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <div>
                    <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Cookies and site data<br />
                    <Link 
                      href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      → Edge Cookie Guide
                    </Link>
                  </div>
                </li>
              </ul>
            </div>

            {/* Opt-Out Tools */}
            <div className="bg-black/30 rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-green-400 mb-4">🚫 Opt-Out Tools</h3>
              <p className="text-gray-300 mb-4">
                You can also use these tools to opt out of analytics tracking:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>
                  • <strong>Google Analytics Opt-out:</strong>{' '}
                  <Link 
                    href="https://tools.google.com/dlpage/gaoptout" 
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Browser Add-on
                  </Link>
                </li>
                <li>
                  • <strong>Your Online Choices:</strong>{' '}
                  <Link 
                    href="https://www.youronlinechoices.com/" 
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    www.youronlinechoices.com
                  </Link>
                </li>
                <li>
                  • <strong>Network Advertising Initiative:</strong>{' '}
                  <Link 
                    href="https://www.networkadvertising.org/choices/" 
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Opt-out Tool
                  </Link>
                </li>
              </ul>
            </div>

            {/* Do Not Track */}
            <div className="bg-black/30 rounded-lg p-6 border border-yellow-500/20">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">🔒 "Do Not Track" Signals</h3>
              <p className="text-gray-300">
                Most browsers support "Do Not Track" (DNT) settings. While we respect your privacy 
                preferences, please note that DNT is not universally implemented. We honor DNT signals 
                for our own analytics, but third-party services may not recognize them.
              </p>
            </div>
          </section>

          {/* Cookie Data Retention */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">⏱️ Cookie Data Retention</h2>
            <div className="bg-black/30 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Different cookies have different retention periods:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <strong className="text-purple-400">Session Cookies:</strong> Automatically deleted 
                  when you close your browser
                </li>
                <li>
                  <strong className="text-blue-400">Essential Cookies:</strong> Typically retained for 
                  30 days to 1 year for security and functionality
                </li>
                <li>
                  <strong className="text-green-400">Analytics Cookies:</strong> Retained for up to 
                  2 years to understand long-term trends
                </li>
                <li>
                  <strong className="text-orange-400">Preference Cookies:</strong> Retained for 30 days 
                  to 1 year to remember your choices
                </li>
              </ul>
              <p className="text-gray-400 text-sm mt-4">
                You can delete cookies at any time through your browser settings. Deleting cookies may 
                affect your user experience and require you to re-enter your preferences.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">✋ Your Rights</h2>
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/30">
              <p className="text-gray-300 mb-4">
                Under data protection laws (including GDPR and CCPA), you have the following rights 
                regarding cookies:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>✅ <strong>Right to be informed:</strong> We provide clear information about our cookie usage</li>
                <li>✅ <strong>Right to access:</strong> You can request information about cookies stored on your device</li>
                <li>✅ <strong>Right to refuse:</strong> You can decline optional cookies through browser settings</li>
                <li>✅ <strong>Right to delete:</strong> You can delete cookies at any time</li>
                <li>✅ <strong>Right to opt-out:</strong> You can opt out of analytics and tracking cookies</li>
              </ul>
            </div>
          </section>

          {/* Changes to Cookie Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">📝 Changes to This Cookie Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices, 
              technologies, legal requirements, or other factors. When we make changes, we will update 
              the "Last Updated" date at the top of this page.
            </p>
            <p className="text-gray-300">
              We encourage you to review this Cookie Policy periodically to stay informed about how 
              we use cookies and similar technologies.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">📞 Contact Us</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-black/30 rounded-lg p-6 space-y-3">
              <p className="text-white"><strong>MicroAI Systems</strong></p>
              <p className="text-gray-300">
                <strong>Email:</strong> <a href="mailto:sales@microaisystems.com" className="text-blue-400 hover:text-blue-300">sales@microaisystems.com</a>
              </p>
              <p className="text-gray-300">
                <strong>Phone:</strong> +233 244486837 | +233 544230568
              </p>
              <p className="text-gray-300">
                <strong>Website:</strong> <a href="https://www.microaisystems.com" className="text-blue-400 hover:text-blue-300">www.microaisystems.com</a>
              </p>
              <p className="text-gray-300">
                <strong>Location:</strong> BR253 Pasture St. Takoradi, Ghana
              </p>
              <p className="text-gray-400 text-sm mt-4">
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
          </section>

          {/* Additional Resources */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">📚 Additional Resources</h2>
            <p className="text-gray-300 mb-4">
              For more information about privacy and data protection:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>
                • <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link> - 
                Learn how we collect, use, and protect your personal information
              </li>
              <li>
                • <Link href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link> - 
                Review our terms and conditions
              </li>
              <li>
                • <a href="https://ico.org.uk/for-organisations/guide-to-pecr/cookies-and-similar-technologies/" target="_blank" className="text-blue-400 hover:text-blue-300">
                  UK ICO Cookie Guidance
                </a> - Official guidance on cookies and similar technologies
              </li>
              <li>
                • <a href="https://gdpr.eu/cookies/" target="_blank" className="text-blue-400 hover:text-blue-300">
                  GDPR Cookie Compliance
                </a> - Understanding cookie compliance under GDPR
              </li>
            </ul>
          </section>

          {/* Summary Box */}
          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-8 mb-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">📌 Quick Summary</h3>
            <ul className="space-y-3 text-gray-300">
              <li>✅ We use essential cookies required for site functionality (cannot be disabled)</li>
              <li>📊 We use optional analytics cookies to improve our services (can be disabled)</li>
              <li>🍪 You can manage cookie preferences through your browser settings</li>
              <li>🔒 We respect your privacy and comply with GDPR/CCPA regulations</li>
              <li>📧 Contact us at <a href="mailto:sales@microaisystems.com" className="text-blue-400 hover:text-blue-300">sales@microaisystems.com</a> for questions</li>
            </ul>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
