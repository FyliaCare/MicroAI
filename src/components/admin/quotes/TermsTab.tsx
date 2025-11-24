'use client'

import { useState } from 'react'
import { 
  FileText, 
  Palette, 
  Image as ImageIcon,
  Shield,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  XCircle
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface TermsTabProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export default function TermsTab({ formData, updateFormData }: TermsTabProps) {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)

  const defaultTermsTemplates = {
    basic: `1. Payment Terms: Payment is due according to the schedule outlined in this quote.
2. Scope Changes: Any changes to the scope of work may affect pricing and timeline.
3. Client Responsibilities: Client agrees to provide necessary materials and feedback in a timely manner.
4. Confidentiality: Both parties agree to keep confidential information private.
5. Intellectual Property: Upon full payment, all intellectual property rights transfer to the client.
6. Warranty: We guarantee our work for 30 days after project completion.
7. Termination: Either party may terminate with 14 days written notice.
8. Governing Law: This agreement is governed by the laws of Ghana.`,

    detailed: `1. ACCEPTANCE OF TERMS
By signing this quote, the Client accepts all terms and conditions outlined herein.

2. PAYMENT TERMS
- Payment is due according to the payment schedule specified
- Late payments may incur fees as specified in the payment section
- All prices are in ${formData.currency}

3. SCOPE OF WORK
- Work will be performed as outlined in the Scope section
- Any additional work outside the scope will be quoted separately
- Changes to scope may affect pricing and timeline

4. CLIENT RESPONSIBILITIES
- Provide timely feedback and approvals
- Supply all necessary content, materials, and access
- Designate a primary point of contact
- Respond to requests within 48 business hours

5. INTELLECTUAL PROPERTY
- Upon full payment, all deliverables and IP rights transfer to Client
- We reserve the right to showcase work in our portfolio
- Client warrants they have rights to all provided materials

6. CONFIDENTIALITY
Both parties agree to maintain confidentiality of proprietary information.

7. WARRANTIES AND GUARANTEES
- We guarantee our work for 30 days post-completion
- Warranty covers defects in workmanship, not design changes
- Extended support available separately

8. LIMITATION OF LIABILITY
Our liability is limited to the total project value. We are not liable for indirect damages.

9. TERMINATION
- Either party may terminate with 14 days written notice
- Client pays for all work completed to date
- Non-refundable deposits remain with service provider

10. DISPUTE RESOLUTION
Disputes will be resolved through mediation before legal action.

11. GOVERNING LAW
This agreement is governed by the laws of Ghana.`,

    software: `1. PROJECT SCOPE
All development work is outlined in the Scope of Work section. Changes require written approval.

2. PAYMENT & BILLING
- Payments due per schedule
- Late payments may incur 1.5% monthly interest
- Expenses billed separately with prior approval

3. DEVELOPMENT PROCESS
- Agile methodology with regular updates
- Client review and approval at each milestone
- Bug fixes included during development phase

4. INTELLECTUAL PROPERTY
- Source code ownership transfers upon full payment
- We retain rights to frameworks and libraries used
- Client receives perpetual license to all deliverables

5. CODE QUALITY & TESTING
- Code follows industry best practices
- Testing performed before each delivery
- Client responsible for user acceptance testing

6. HOSTING & DEPLOYMENT
- Deployment assistance as specified
- Client responsible for hosting costs
- Production environment setup documented

7. MAINTENANCE & SUPPORT
- 30-day bug fix warranty post-launch
- Extended maintenance available separately
- Emergency support at premium rates

8. DATA & SECURITY
- Industry-standard security practices
- Regular backups during development
- Client responsible for production security

9. THIRD-PARTY SERVICES
- Client provides API keys and accounts
- Third-party costs not included unless specified
- Integration limitations depend on APIs

10. TERMINATION & CANCELLATION
- 14-day notice required
- Work completed to date must be paid
- Source code released upon full payment only`,

    design: `1. DESIGN SERVICES
All design work is as specified in project scope. Additional revisions may incur extra charges.

2. REVISION POLICY
- Included revisions specified per milestone
- Revisions must be requested within 7 days
- Major changes constitute new scope

3. DELIVERABLES
- Design files in agreed formats
- Source files provided upon full payment
- Web-optimized assets included

4. INTELLECTUAL PROPERTY
- Full rights transfer upon payment completion
- Portfolio usage rights retained
- Client warrants ownership of provided content

5. BRAND GUIDELINES
- Designs follow provided brand guidelines
- Inconsistent branding may affect timeline
- Brand asset library recommended

6. STOCK ASSETS
- Premium stock photos/fonts billed separately
- Royalty-free alternatives used by default
- Client-provided assets preferred

7. BROWSER/DEVICE COMPATIBILITY
- Modern browsers supported (last 2 versions)
- Responsive design for mobile/tablet/desktop
- Legacy browser support requires additional fee

8. DESIGN APPROVAL
- Client approval required before development
- Approved designs locked for development
- Post-approval changes may affect timeline

9. ACCESSIBILITY
- WCAG 2.1 Level AA compliance attempted
- Third-party audit recommended
- Accessibility fixes included in warranty

10. PROJECT TIMELINE
- Timeline based on timely client feedback
- Delays in feedback extend completion date
- Rush projects may incur premium fees`
  }

  const warrantyTemplates = [
    '30-day warranty on all work covering defects in workmanship',
    '60-day warranty on development work with unlimited bug fixes',
    '90-day warranty with free updates and security patches',
    'No warranty - work delivered as-is (discount applied)'
  ]

  const supportTemplates = [
    '30 days of email support included',
    '60 days of email and chat support included',
    '90 days of priority support with 24-hour response time',
    'Extended support available via separate agreement'
  ]

  const revisionTemplates = [
    '2 rounds of revisions included per milestone',
    '3 rounds of revisions included per deliverable',
    'Unlimited revisions within project scope',
    'Revisions billed hourly after initial round'
  ]

  const cancellationTemplates = [
    'Either party may cancel with 14 days notice. Client pays for work completed.',
    'Client may cancel anytime. Non-refundable deposits apply. Completed work must be paid.',
    '30-day notice required. Early cancellation incurs 25% of remaining project value.',
    'No cancellations after project start. Client may pause project for up to 60 days.'
  ]

  const loadTemplate = (template: string) => {
    updateFormData('termsAndConditions', defaultTermsTemplates[template as keyof typeof defaultTermsTemplates])
    setActiveTemplate(template)
  }

  return (
    <div className="space-y-6">
      {/* Terms and Conditions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Terms and Conditions</h2>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => loadTemplate('basic')}
            >
              Basic
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => loadTemplate('detailed')}
            >
              Detailed
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => loadTemplate('software')}
            >
              Software
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => loadTemplate('design')}
            >
              Design
            </Button>
          </div>
        </div>

        <textarea
          value={formData.termsAndConditions}
          onChange={(e) => updateFormData('termsAndConditions', e.target.value)}
          placeholder="Enter the terms and conditions for this quote..."
          rows={15}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-2">
          These terms will appear in the quote document. Customize as needed for your business.
        </p>
      </Card>

      {/* Additional Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warranties */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Warranties</h2>
          </div>

          <div className="space-y-3 mb-4">
            {warrantyTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => updateFormData('warranties', template)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  formData.warranties === template
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <p className="text-sm text-gray-900">{template}</p>
              </button>
            ))}
          </div>

          <textarea
            value={formData.warranties}
            onChange={(e) => updateFormData('warranties', e.target.value)}
            placeholder="Custom warranty terms..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
          />
        </Card>

        {/* Support Terms */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Support Terms</h2>
          </div>

          <div className="space-y-3 mb-4">
            {supportTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => updateFormData('supportTerms', template)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  formData.supportTerms === template
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <p className="text-sm text-gray-900">{template}</p>
              </button>
            ))}
          </div>

          <textarea
            value={formData.supportTerms}
            onChange={(e) => updateFormData('supportTerms', e.target.value)}
            placeholder="Custom support terms..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
          />
        </Card>

        {/* Revision Policy */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <RotateCcw className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Revision Policy</h2>
          </div>

          <div className="space-y-3 mb-4">
            {revisionTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => updateFormData('revisionPolicy', template)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  formData.revisionPolicy === template
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <p className="text-sm text-gray-900">{template}</p>
              </button>
            ))}
          </div>

          <textarea
            value={formData.revisionPolicy}
            onChange={(e) => updateFormData('revisionPolicy', e.target.value)}
            placeholder="Custom revision policy..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
          />
        </Card>

        {/* Cancellation Policy */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <XCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Cancellation Policy</h2>
          </div>

          <div className="space-y-3 mb-4">
            {cancellationTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => updateFormData('cancellationPolicy', template)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  formData.cancellationPolicy === template
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <p className="text-sm text-gray-900">{template}</p>
              </button>
            ))}
          </div>

          <textarea
            value={formData.cancellationPolicy}
            onChange={(e) => updateFormData('cancellationPolicy', e.target.value)}
            placeholder="Custom cancellation policy..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
          />
        </Card>
      </div>

      {/* Branding & Customization */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Branding & Customization</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.brandColor}
                onChange={(e) => updateFormData('brandColor', e.target.value)}
                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.brandColor}
                  onChange={(e) => updateFormData('brandColor', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  placeholder="#6366f1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This color will be used for headings and accents in the PDF
                </p>
              </div>
            </div>
          </div>

          {/* Logo & Portfolio Options */}
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includeLogo}
                onChange={(e) => updateFormData('includeLogo', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Include company logo in quote
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includePortfolio}
                onChange={(e) => updateFormData('includePortfolio', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Include portfolio samples
                </span>
              </div>
            </label>
          </div>

          {/* Custom Message */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Custom Cover Message
            </label>
            <textarea
              value={formData.customMessage}
              onChange={(e) => updateFormData('customMessage', e.target.value)}
              placeholder="Add a personalized message for the client (appears on the first page)..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Footer Text */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer Text
            </label>
            <input
              type="text"
              value={formData.footerText}
              onChange={(e) => updateFormData('footerText', e.target.value)}
              placeholder="e.g., Thank you for your business! Contact us at support@company.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="p-6 bg-indigo-50 border-indigo-200">
        <h3 className="text-sm font-semibold text-indigo-900 mb-3">💡 Professional Tips</h3>
        <ul className="space-y-2 text-sm text-indigo-800">
          <li className="flex items-start space-x-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>Clear terms prevent disputes and build trust with clients</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>Always specify what's included and what's not to avoid scope creep</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>Revision policies protect your time while keeping clients happy</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>Warranties demonstrate confidence in your work quality</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>Custom branding makes quotes look professional and memorable</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
