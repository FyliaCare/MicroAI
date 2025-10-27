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
    const loadCompanyProfile = () => {
      try {
        const savedProfile = localStorage.getItem('companyProfile')
        if (savedProfile) {
          const profile = JSON.parse(savedProfile)
          setCompanyProfile(profile)
          document.title = `${profile.name || 'MicroAI'} - Quote`
        } else {
          setCompanyProfile({
            name: 'MicroAI',
            email: 'contact@microai.com',
            phone: '+1 (555) 123-4567',
            address: '123 Tech Street, Silicon Valley, CA 94000',
            website: 'https://microai.com',
            description: 'Professional Web Development Services'
          })
          document.title = 'MicroAI - Quote'
        }
      } catch (err) {
        console.error('Error loading company profile:', err)
      }
    }

    const loadQuoteData = () => {
      try {
        let quoteData = sessionStorage.getItem('quoteToPrint')
        if (!quoteData) {
          quoteData = localStorage.getItem('pdfQuoteData')
        }

        if (quoteData) {
          const parsedQuote = JSON.parse(quoteData)
          setQuote(parsedQuote)
          setTimeout(() => window.print(), 1000)
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

  const setupFee = parseFloat(quote.setupFee || '0')
  const developmentCost = parseFloat(quote.developmentCost || '0')
  const designCost = parseFloat(quote.designCost || '0')
  const monthlyHosting = parseFloat(quote.monthlyHosting || '0')
  
  const setupTotal = setupFee + developmentCost + designCost
  const yearlyHosting = monthlyHosting * 12
  const firstYearTotal = setupTotal + yearlyHosting

  const quoteNumber = quote.quoteNumber || `QT-${Date.now().toString().slice(-6)}`
  const currentDate = new Date().toLocaleDateString()

  return (
    <>
      <title>{companyProfile?.name || 'MicroAI'} - Quote</title>
      
      <div className="quote-document">
        {/* Simple Header */}
        <div className="header">
          <div className="header-left">
            <h1>{companyProfile?.name || 'MicroAI'}</h1>
            <p>{companyProfile?.description || 'Professional Web Development'}</p>
          </div>
          <div className="header-right">
            <h2>QUOTATION</h2>
            <p><strong>Quote #:</strong> {quoteNumber}</p>
            <p><strong>Date:</strong> {currentDate}</p>
          </div>
        </div>

        {/* Client Info */}
        <div className="section">
          <div className="client-info">
            <div>
              <h3>Bill To:</h3>
              <p className="client-name">{quote.clientName || 'Client Name'}</p>
              {quote.clientEmail && <p>{quote.clientEmail}</p>}
              {quote.clientPhone && <p>{quote.clientPhone}</p>}
            </div>
            <div>
              <h3>Project:</h3>
              <p className="project-title">{quote.title || 'Web Development Project'}</p>
              <p><strong>Timeline:</strong> {quote.timeline || '8-12 weeks'}</p>
              <p><strong>Valid Until:</strong> {quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : 'TBD'}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {quote.description && (
          <div className="section">
            <h3>Project Description</h3>
            <p>{quote.description}</p>
          </div>
        )}

        {/* Pricing Table */}
        <div className="section">
          <h3>Investment Breakdown</h3>
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {setupFee > 0 && (
                <tr>
                  <td>Setup Fee</td>
                  <td>${setupFee.toLocaleString()}</td>
                </tr>
              )}
              {developmentCost > 0 && (
                <tr>
                  <td>Development Cost</td>
                  <td>${developmentCost.toLocaleString()}</td>
                </tr>
              )}
              {designCost > 0 && (
                <tr>
                  <td>Design & UI/UX</td>
                  <td>${designCost.toLocaleString()}</td>
                </tr>
              )}
              <tr className="subtotal">
                <td><strong>Setup Total</strong></td>
                <td><strong>${setupTotal.toLocaleString()}</strong></td>
              </tr>
              {monthlyHosting > 0 && (
                <>
                  <tr>
                    <td>Monthly Hosting & Maintenance</td>
                    <td>${monthlyHosting.toLocaleString()}/month</td>
                  </tr>
                  <tr>
                    <td>First Year Hosting (12 months)</td>
                    <td>${yearlyHosting.toLocaleString()}</td>
                  </tr>
                </>
              )}
              <tr className="total">
                <td><strong>First Year Total Investment</strong></td>
                <td><strong>${firstYearTotal.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deliverables */}
        {quote.deliverables && Array.isArray(quote.deliverables) && quote.deliverables.length > 0 && (
          <div className="section">
            <h3>Deliverables</h3>
            <ul>
              {quote.deliverables.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Terms */}
        {quote.terms && (
          <div className="section">
            <h3>Terms & Conditions</h3>
            <p className="terms">{quote.terms}</p>
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <div className="footer-contact">
            <p><strong>{companyProfile?.name || 'MicroAI'}</strong></p>
            <p>{companyProfile?.email || 'contact@microai.com'} | {companyProfile?.phone || '+1 (555) 123-4567'}</p>
            {companyProfile?.address && <p>{companyProfile.address}</p>}
          </div>
          <p className="copyright">© {new Date().getFullYear()} {companyProfile?.name || 'MicroAI'}. All rights reserved.</p>
        </div>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #1a1a1a;
          line-height: 1.6;
        }

        .quote-document {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 30px;
          border-bottom: 3px solid #2563eb;
          margin-bottom: 30px;
        }

        .header-left h1 {
          font-size: 28px;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 5px;
        }

        .header-left p {
          font-size: 14px;
          color: #666;
        }

        .header-right {
          text-align: right;
        }

        .header-right h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
        }

        .header-right p {
          font-size: 13px;
          margin: 3px 0;
        }

        .section {
          margin-bottom: 30px;
        }

        .section h3 {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .client-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }

        .client-info p {
          font-size: 14px;
          margin: 4px 0;
        }

        .client-name, .project-title {
          font-weight: 700;
          font-size: 15px;
          color: #1a1a1a;
        }

        .pricing-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }

        .pricing-table th {
          background: #1e40af;
          color: white;
          padding: 12px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
        }

        .pricing-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .pricing-table th:last-child,
        .pricing-table td:last-child {
          text-align: right;
        }

        .pricing-table tr.subtotal td {
          background: #f1f5f9;
          font-size: 15px;
        }

        .pricing-table tr.total td {
          background: #dbeafe;
          font-size: 16px;
          padding: 14px 12px;
          border-bottom: 2px solid #2563eb;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        ul li {
          padding: 6px 0 6px 20px;
          position: relative;
          font-size: 14px;
        }

        ul li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #2563eb;
          font-weight: bold;
        }

        .terms {
          font-size: 13px;
          line-height: 1.8;
          color: #4b5563;
          background: #f9fafb;
          padding: 15px;
          border-left: 3px solid #2563eb;
        }

        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
        }

        .footer-contact {
          text-align: center;
          margin-bottom: 15px;
        }

        .footer-contact p {
          font-size: 13px;
          margin: 3px 0;
        }

        .copyright {
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
        }

        @media print {
          @page {
            margin: 20mm;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .quote-document {
            padding: 0;
            max-width: 100%;
          }

          .section {
            page-break-inside: avoid;
          }

          button {
            display: none !important;
          }
        }

        @media screen {
          .quote-document {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-top: 20px;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </>
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
