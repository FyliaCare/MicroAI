'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function PDFQuoteContent() {
  const searchParams = useSearchParams()
  const quoteId = searchParams.get('id')
  
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuoteData = () => {
      try {
        let quoteData = sessionStorage.getItem('quoteToPrint')
        if (!quoteData) quoteData = localStorage.getItem('pdfQuoteData')
        if (quoteData) {
          const parsedQuote = JSON.parse(quoteData)
          setQuote(parsedQuote)
          setTimeout(() => window.print(), 1000)
        }
      } catch (err) {
        console.error('Error loading quote:', err)
      } finally {
        setLoading(false)
      }
    }
    loadQuoteData()
  }, [quoteId])

  if (loading) return <div className='flex items-center justify-center min-h-screen'><p>Loading quote...</p></div>
  if (!quote) return <div className='flex items-center justify-center min-h-screen'><p>Quote not found</p></div>

  const parseJSON = (field: any) => {
    if (!field) return null
    if (typeof field === 'object') return field
    try { return JSON.parse(field) } catch { return null }
  }

  const formatDate = (date: any) => {
    if (!date) return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const executiveSummary = parseJSON(quote.executiveSummary)
  const scopeOfWork = parseJSON(quote.scopeOfWork) || []
  const exclusions = parseJSON(quote.exclusions) || []
  const techStack = parseJSON(quote.techStack)
  const milestones = parseJSON(quote.milestones) || []
  const pricingItems = parseJSON(quote.pricingItems) || []
  const paymentTerms = parseJSON(quote.paymentTerms)
  const assumptions = parseJSON(quote.assumptions) || []
  const clientObligations = parseJSON(quote.clientObligations) || []
  const maintenanceTerms = parseJSON(quote.maintenanceTerms)
  const revisionsPolicy = parseJSON(quote.revisionsPolicy)

  const currentDate = formatDate(quote.issuedAt)
  const validUntilDate = quote.validUntil ? formatDate(quote.validUntil) : formatDate(new Date(Date.now() + 30*24*60*60*1000))

  return (
    <>
      <title>{quote.companyName || 'MicroAI Systems'} - Quote #{quote.quoteNumber}</title>
      
      <div className="quote-document">
        {/* PROFESSIONAL COVER PAGE */}
        <div className="page cover-page">
          <div className="cover-header">
            {quote.companyLogo && (
              <img src={quote.companyLogo} alt="Company Logo" className="company-logo" />
            )}
            <h1 className="cover-title">{quote.companyName || 'MicroAI Systems'}</h1>
            <p className="cover-tagline">Professional Web Development Services</p>
          </div>

          <div className="cover-main">
            <div className="quote-badge">QUOTATION</div>
            <h2 className="project-name">{quote.title || 'Web Development Project'}</h2>
            <p className="cover-description">{quote.description || 'Professional Website Development Proposal'}</p>
          </div>

          <div className="cover-details">
            <div className="cover-detail-row">
              <span className="label">Quote Number:</span>
              <span className="value">{quote.quoteNumber}</span>
            </div>
            <div className="cover-detail-row">
              <span className="label">Issue Date:</span>
              <span className="value">{currentDate}</span>
            </div>
            <div className="cover-detail-row">
              <span className="label">Valid Until:</span>
              <span className="value">{validUntilDate}</span>
            </div>
            <div className="cover-detail-row">
              <span className="label">Prepared For:</span>
              <span className="value">{quote.clientName || quote.clientCompany || 'Valued Client'}</span>
            </div>
          </div>

          <div className="cover-footer">
            <p>{quote.companyAddress || '123 Tech Street, City, Country'}</p>
            <p>{quote.companyPhone || '+233 XX XXX XXXX'} • {quote.companyEmail || 'hello@company.com'}</p>
            {quote.companyWebsite && <p>{quote.companyWebsite}</p>}
          </div>
        </div>

        {/* PAGE 1: COMPANY & CLIENT INFO + EXECUTIVE SUMMARY */}
        <div className="page">
          <div className="page-header">
            <div className="header-left">
              <h3>{quote.companyName || 'MicroAI Systems'}</h3>
              <p className="quote-ref">Quote #{quote.quoteNumber}</p>
            </div>
            <div className="header-right">
              <p>{currentDate}</p>
            </div>
          </div>

          {/* Company Details */}
          <div className="section">
            <h2 className="section-title">Service Provider Details</h2>
            <div className="info-card">
              <div className="info-row">
                <span className="info-label">Company Name:</span>
                <span className="info-value">{quote.companyName || 'MicroAI Systems'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{quote.companyEmail || 'contact@company.com'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{quote.companyPhone || '+233 XX XXX XXXX'}</span>
              </div>
              {quote.companyWebsite && (
                <div className="info-row">
                  <span className="info-label">Website:</span>
                  <span className="info-value">{quote.companyWebsite}</span>
                </div>
              )}
              {quote.companyAddress && (
                <div className="info-row">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{quote.companyAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Client Information */}
          <div className="section">
            <h2 className="section-title">Client Information</h2>
            <div className="info-card">
              {quote.clientCompany && (
                <div className="info-row">
                  <span className="info-label">Company:</span>
                  <span className="info-value">{quote.clientCompany}</span>
                </div>
              )}
              <div className="info-row">
                <span className="info-label">Client Name:</span>
                <span className="info-value">{quote.clientName || 'Valued Client'}</span>
              </div>
              {quote.contactPerson && (
                <div className="info-row">
                  <span className="info-label">Contact Person:</span>
                  <span className="info-value">{quote.contactPerson}</span>
                </div>
              )}
              {quote.clientEmail && (
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{quote.clientEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Executive Summary */}
          {executiveSummary && (
            <div className="section">
              <h2 className="section-title">Executive Summary</h2>
              <div className="exec-summary">
                {executiveSummary.problem && (
                  <div className="summary-block">
                    <h4>?? Client Challenge</h4>
                    <p>{executiveSummary.problem}</p>
                  </div>
                )}
                {executiveSummary.solution && (
                  <div className="summary-block">
                    <h4>?? Our Solution</h4>
                    <p>{executiveSummary.solution}</p>
                  </div>
                )}
                {executiveSummary.businessImpact && (
                  <div className="summary-block">
                    <h4>?? Expected Business Impact</h4>
                    <p>{executiveSummary.businessImpact}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PAGE 2: Scope of Work */}
        <div className="page">
          <div className="page-header">
            <div className="header-left">
              <h3>{quote.companyName || 'MicroAI Systems'}</h3>
              <p className="quote-ref">Quote #{quote.quoteNumber}</p>
            </div>
            <div className="header-right">
              <p>Page 2 of 5</p>
            </div>
          </div>

          {/* Scope of Work */}
          {scopeOfWork && scopeOfWork.length > 0 && (
            <div className="section">
              <h2 className="section-title">Scope of Work</h2>
              <div className="scope-items">
                {scopeOfWork.map((item: any, index: number) => (
                  <div key={index} className="scope-item">
                    <div className="scope-header">
                      <span className="scope-number">{index + 1}</span>
                      <h4>{item.title}</h4>
                    </div>
                    <p className="scope-description">{item.description}</p>
                    {item.deliverables && item.deliverables.length > 0 && (
                      <div className="deliverables">
                        <strong>Deliverables:</strong>
                        <ul>
                          {item.deliverables.map((deliverable: string, idx: number) => (
                            <li key={idx}>{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exclusions */}
          {exclusions && exclusions.length > 0 && (
            <div className="section">
              <h2 className="section-title">What's Not Included</h2>
              <div className="exclusions-box">
                <ul className="exclusions-list">
                  {exclusions.map((exclusion: string, index: number) => (
                    <li key={index}>{exclusion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Technical Stack */}
          {techStack && techStack.length > 0 && (
            <div className="section">
              <h2 className="section-title">Technology Stack</h2>
              <div className="tech-grid">
                {techStack.map((tech: any, index: number) => (
                  <div key={index} className="tech-item">
                    <div className="tech-category">{tech.category}</div>
                    <div className="tech-tools">{tech.tools.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PAGE 3: Timeline & Pricing */}
        <div className="page">
          <div className="page-header">
            <div className="header-left">
              <h3>{quote.companyName || 'MicroAI Systems'}</h3>
              <p className="quote-ref">Quote #{quote.quoteNumber}</p>
            </div>
            <div className="header-right">
              <p>Page 3 of 5</p>
            </div>
          </div>

          {/* Timeline */}
          {parseJSON(quote.timeline) && (
            <div className="section">
              <h2 className="section-title">Project Timeline</h2>
              <div className="timeline-info">
                <div className="timeline-row">
                  <span className="timeline-label">Duration:</span>
                  <span className="timeline-value">{parseJSON(quote.timeline)?.duration}</span>
                </div>
                <div className="timeline-row">
                  <span className="timeline-label">Start Date:</span>
                  <span className="timeline-value">{parseJSON(quote.timeline)?.startDate}</span>
                </div>
                <div className="timeline-row">
                  <span className="timeline-label">Expected Completion:</span>
                  <span className="timeline-value">{parseJSON(quote.timeline)?.endDate}</span>
                </div>
              </div>
            </div>
          )}

          {/* Milestones */}
          {milestones && milestones.length > 0 && (
            <div className="section">
              <h2 className="section-title">Project Milestones</h2>
              <div className="milestones-timeline">
                {milestones.map((milestone: any, index: number) => (
                  <div key={index} className="milestone-item">
                    <div className="milestone-marker">{index + 1}</div>
                    <div className="milestone-content">
                      <h4>{milestone.title}</h4>
                      <p className="milestone-date">{milestone.date}</p>
                      {milestone.deliverables && milestone.deliverables.length > 0 && (
                        <ul className="milestone-deliverables">
                          {milestone.deliverables.map((deliverable: string, idx: number) => (
                            <li key={idx}>{deliverable}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investment Breakdown */}
          <div className="section">
            <h2 className="section-title">Investment Breakdown</h2>
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {pricingItems.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="item-name">{item.name}</td>
                    <td className="item-desc">{item.description}</td>
                    <td className="text-right">${parseFloat(item.amount || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="subtotal-row">
                  <td colSpan={2}>Subtotal</td>
                  <td className="text-right">${(quote.subtotal || 0).toLocaleString()}</td>
                </tr>
                {quote.tax > 0 && (
                  <tr className="tax-row">
                    <td colSpan={2}>Tax ({((quote.tax / quote.subtotal) * 100).toFixed(1)}%)</td>
                    <td className="text-right">${(quote.tax || 0).toLocaleString()}</td>
                  </tr>
                )}
                <tr className="total-row">
                  <td colSpan={2}><strong>Total Investment</strong></td>
                  <td className="text-right"><strong>${(quote.total || 0).toLocaleString()}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Monthly Maintenance */}
          {quote.monthlyMaintenance > 0 && (
            <div className="maintenance-note">
              <strong>Ongoing Support:</strong> ${quote.monthlyMaintenance.toLocaleString()}/month after launch
            </div>
          )}
        </div>

        {/* PAGE 4: Terms & Conditions */}
        <div className="page">
          <div className="page-header">
            <div className="header-left">
              <h3>{quote.companyName || 'MicroAI Systems'}</h3>
              <p className="quote-ref">Quote #{quote.quoteNumber}</p>
            </div>
            <div className="header-right">
              <p>Page 4 of 5</p>
            </div>
          </div>

          {/* Payment Terms */}
          {paymentTerms && (
            <div className="section">
              <h2 className="section-title">Payment Terms</h2>
              <div className="payment-schedule">
                {paymentTerms.map((term: any, index: number) => (
                  <div key={index} className="payment-item">
                    <div className="payment-milestone">{term.milestone}</div>
                    <div className="payment-amount">{term.percentage}% (${((quote.total * term.percentage) / 100).toLocaleString()})</div>
                    <div className="payment-desc">{term.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assumptions */}
          {assumptions && assumptions.length > 0 && (
            <div className="section">
              <h2 className="section-title">Assumptions</h2>
              <ul className="terms-list">
                {assumptions.map((assumption: string, index: number) => (
                  <li key={index}>{assumption}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Client Obligations */}
          {clientObligations && clientObligations.length > 0 && (
            <div className="section">
              <h2 className="section-title">Client Responsibilities</h2>
              <ul className="terms-list">
                {clientObligations.map((obligation: string, index: number) => (
                  <li key={index}>{obligation}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Maintenance Terms */}
          {maintenanceTerms && (
            <div className="section">
              <h2 className="section-title">Maintenance & Support</h2>
              <div className="info-card">
                <div className="info-row">
                  <span className="info-label">Coverage:</span>
                  <span className="info-value">{maintenanceTerms.coverage}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Response Time:</span>
                  <span className="info-value">{maintenanceTerms.responseTime}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Included Updates:</span>
                  <span className="info-value">{maintenanceTerms.updates}</span>
                </div>
              </div>
            </div>
          )}

          {/* Intellectual Property */}
          {parseJSON(quote.intellectualProperty) && (
            <div className="section">
              <h2 className="section-title">Intellectual Property Rights</h2>
              <div className="ip-terms">
                <p><strong>Source Code:</strong> {parseJSON(quote.intellectualProperty)?.sourceCode}</p>
                <p><strong>Design Assets:</strong> {parseJSON(quote.intellectualProperty)?.designAssets}</p>
                <p><strong>Third-Party Components:</strong> {parseJSON(quote.intellectualProperty)?.thirdParty}</p>
              </div>
            </div>
          )}
        </div>

        {/* PAGE 5: Agreement & Signatures */}
        <div className="page">
          <div className="page-header">
            <div className="header-left">
              <h3>{quote.companyName || 'MicroAI Systems'}</h3>
              <p className="quote-ref">Quote #{quote.quoteNumber}</p>
            </div>
            <div className="header-right">
              <p>Page 5 of 5</p>
            </div>
          </div>

          {/* Revisions Policy */}
          {revisionsPolicy && (
            <div className="section">
              <h2 className="section-title">Revisions & Changes</h2>
              <div className="info-card">
                <p><strong>Included Revisions:</strong> {revisionsPolicy.included}</p>
                <p><strong>Additional Revisions:</strong> {revisionsPolicy.additional}</p>
                <p><strong>Change Requests:</strong> {revisionsPolicy.changeProcess}</p>
              </div>
            </div>
          )}

          {/* Confidentiality */}
          {quote.confidentiality && (
            <div className="section">
              <h2 className="section-title">Confidentiality</h2>
              <p className="confidentiality-text">{quote.confidentiality}</p>
            </div>
          )}

          {/* Quote Validity */}
          <div className="section">
            <div className="validity-notice">
              This quote is valid until {validUntilDate}.
              Prices and terms are subject to change after this date.
            </div>
          </div>

          {/* Acceptance */}
          <div className="section">
            <h2 className="section-title">Agreement Acceptance</h2>
            <p className="acceptance-text">
              By signing below, both parties agree to the terms, conditions, scope, and pricing outlined in this quote.
              This agreement becomes binding upon signature by both parties.
            </p>
          </div>

          {/* Signature Section */}
          <div className="signatures">
            <div className="signature-block">
              <div className="signature-line"></div>
              <p className="signature-label">
                <strong>{quote.authorizedSignatory || 'Authorized Representative'}</strong><br />
                {quote.companyName || 'MicroAI Systems'}<br />
                Date: _____________________
              </p>
            </div>

            <div className="signature-block">
              <div className="signature-line"></div>
              <p className="signature-label">
                <strong>{quote.contactPerson || quote.clientName || 'Client Representative'}</strong><br />
                {quote.clientCompany || 'Client Company'}<br />
                Date: _____________________
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="final-footer">
            <p><strong>{quote.companyName || 'MicroAI Systems'}</strong></p>
            <p>{quote.companyAddress || 'Company Address'}</p>
            <p>
              {quote.companyPhone || 'Phone'} | {quote.companyEmail || 'Email'} | {quote.companyWebsite || 'Website'}
            </p>
            <p className="thank-you">Thank you for considering {quote.companyName || 'MicroAI Systems'} for your project!</p>
          </div>
        </div>

        {/* Comprehensive styling */}
        <style jsx global>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1a1a; line-height: 1.6; background: #f5f5f5; }
          .quote-document { max-width: 210mm; margin: 0 auto; background: white; }
          .page { min-height: 297mm; padding: 20mm; background: white; page-break-after: always; position: relative; }
          .page:last-child { page-break-after: auto; }
          
          /* Cover Page Styles */
          .cover-page { display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; }
          .cover-header { padding-top: 40px; }
          .company-logo { max-width: 150px; max-height: 80px; margin: 0 auto 20px; filter: brightness(0) invert(1); }
          .cover-title { font-size: 42px; font-weight: 800; margin-bottom: 10px; }
          .cover-tagline { font-size: 18px; opacity: 0.9; }
          .cover-main { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 0; }
          .quote-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 12px 30px; border-radius: 50px; font-size: 14px; font-weight: 600; letter-spacing: 2px; margin: 0 auto 30px; }
          .project-name { font-size: 36px; font-weight: 700; margin-bottom: 15px; }
          .cover-description { font-size: 18px; opacity: 0.95; max-width: 600px; margin: 0 auto; }
          .cover-details { background: rgba(0,0,0,0.2); padding: 30px; border-radius: 12px; margin: 40px 0; }
          .cover-detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.2); }
          .cover-detail-row:last-child { border-bottom: none; }
          .cover-detail-row .label { font-weight: 500; opacity: 0.8; }
          .cover-detail-row .value { font-weight: 600; }
          .cover-footer { padding-bottom: 20px; opacity: 0.8; font-size: 14px; }
          .cover-footer p { margin: 5px 0; }
          
          /* Page Headers */
          .page-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 15px; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; }
          .header-left h3 { font-size: 20px; font-weight: 700; color: #667eea; margin-bottom: 3px; }
          .quote-ref { font-size: 13px; color: #6b7280; font-weight: 500; }
          .header-right p { font-size: 13px; color: #6b7280; }
          
          /* Sections */
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 3px solid #667eea; text-transform: uppercase; }
          .info-card { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
          .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .info-row:last-child { border-bottom: none; }
          .info-label { font-weight: 600; color: #4b5563; min-width: 140px; }
          .info-value { color: #1a1a1a; flex: 1; }
          
          /* Executive Summary */
          .exec-summary { background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; }
          .summary-block { margin-bottom: 20px; }
          .summary-block:last-child { margin-bottom: 0; }
          .summary-block h4 { font-size: 15px; font-weight: 700; color: #667eea; margin-bottom: 8px; }
          .summary-block p { font-size: 14px; line-height: 1.7; color: #374151; }
          
          /* Scope of Work */
          .scope-items { display: flex; flex-direction: column; gap: 20px; }
          .scope-item { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
          .scope-header { display: flex; align-items: center; gap: 15px; margin-bottom: 12px; }
          .scope-number { background: #667eea; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
          .scope-item h4 { font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 0; }
          .scope-description { color: #4b5563; margin-bottom: 12px; line-height: 1.6; }
          .deliverables { background: white; padding: 15px; border-radius: 6px; margin-top: 12px; }
          .deliverables strong { color: #667eea; display: block; margin-bottom: 8px; }
          .deliverables ul { margin-left: 20px; }
          .deliverables li { padding: 4px 0; color: #374151; }
          
          /* Exclusions */
          .exclusions-box { background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; }
          .exclusions-list { margin-left: 20px; }
          .exclusions-list li { padding: 6px 0; color: #991b1b; font-weight: 500; }
          
          /* Technical Stack */
          .tech-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .tech-item { background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 3px solid #667eea; }
          .tech-category { font-weight: 700; color: #667eea; margin-bottom: 6px; font-size: 14px; }
          .tech-tools { color: #4b5563; font-size: 13px; line-height: 1.5; }
          
          /* Timeline */
          .timeline-info { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
          .timeline-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .timeline-row:last-child { border-bottom: none; }
          .timeline-label { font-weight: 600; color: #4b5563; min-width: 180px; }
          .timeline-value { color: #1a1a1a; font-weight: 500; }
          
          /* Milestones */
          .milestones-timeline { display: flex; flex-direction: column; gap: 20px; }
          .milestone-item { display: flex; gap: 15px; }
          .milestone-marker { background: #667eea; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; flex-shrink: 0; }
          .milestone-content { flex: 1; background: #f9fafb; padding: 15px; border-radius: 8px; }
          .milestone-content h4 { font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
          .milestone-date { color: #667eea; font-weight: 600; font-size: 14px; margin-bottom: 10px; }
          .milestone-deliverables { margin-left: 20px; margin-top: 10px; }
          .milestone-deliverables li { padding: 3px 0; color: #4b5563; }
          
          /* Pricing Table */
          .pricing-table { width: 100%; border-collapse: collapse; margin-top: 15px; background: white; }
          .pricing-table th { background: #667eea; color: white; padding: 12px; text-align: left; font-weight: 600; font-size: 14px; }
          .pricing-table th.text-right { text-align: right; }
          .pricing-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .pricing-table tbody tr:hover { background: #f9fafb; }
          .pricing-table .item-name { font-weight: 600; color: #1a1a1a; }
          .pricing-table .item-desc { color: #6b7280; font-size: 13px; }
          .pricing-table .text-right { text-align: right; }
          .pricing-table tfoot { background: #f9fafb; }
          .pricing-table .subtotal-row td { padding-top: 15px; font-weight: 600; }
          .pricing-table .tax-row td { color: #6b7280; }
          .pricing-table .total-row td { padding-top: 12px; padding-bottom: 15px; font-size: 18px; color: #667eea; border-top: 2px solid #667eea; }
          
          /* Maintenance Note */
          .maintenance-note { background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); padding: 15px 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-top: 20px; }
          .maintenance-note strong { color: #667eea; }
          
          /* Payment Terms */
          .payment-schedule { display: flex; flex-direction: column; gap: 15px; }
          .payment-item { background: #f9fafb; padding: 18px; border-radius: 8px; border-left: 4px solid #667eea; }
          .payment-milestone { font-weight: 700; color: #1a1a1a; font-size: 15px; margin-bottom: 6px; }
          .payment-amount { color: #667eea; font-weight: 700; font-size: 18px; margin-bottom: 6px; }
          .payment-desc { color: #6b7280; font-size: 14px; line-height: 1.5; }
          
          /* Terms Lists */
          .terms-list { margin-left: 20px; }
          .terms-list li { padding: 8px 0; color: #374151; line-height: 1.6; border-bottom: 1px solid #f3f4f6; }
          .terms-list li:last-child { border-bottom: none; }
          
          /* IP Terms */
          .ip-terms p { padding: 10px 0; line-height: 1.7; color: #374151; border-bottom: 1px solid #e5e7eb; }
          .ip-terms p:last-child { border-bottom: none; }
          .ip-terms strong { color: #667eea; }
          
          /* Validity Notice */
          .validity-notice { background: #fef3c7; border: 2px solid #f59e0b; padding: 15px; border-radius: 8px; text-align: center; font-weight: 600; color: #92400e; }
          
          /* Acceptance */
          .acceptance-text { color: #374151; line-height: 1.7; }
          .confidentiality-text { color: #374151; line-height: 1.7; }
          
          /* Signatures */
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; padding-top: 30px; }
          .signature-block { text-align: center; }
          .signature-line { border-bottom: 2px solid #1a1a1a; margin-bottom: 15px; height: 60px; }
          .signature-label { font-size: 13px; color: #4b5563; line-height: 1.8; }
          
          /* Final Footer */
          .final-footer { margin-top: 60px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
          .final-footer p { margin: 5px 0; font-size: 13px; }
          .final-footer .thank-you { margin-top: 15px; font-size: 15px; font-weight: 600; color: #667eea; }
          
          @media print {
            @page { size: A4; margin: 0; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
            .quote-document { max-width: 100%; margin: 0; }
            .page { margin: 0; page-break-after: always; box-shadow: none; }
            .page:last-child { page-break-after: auto; }
          }
          @media screen {
            .quote-document { box-shadow: 0 0 40px rgba(0,0,0,0.1); margin: 20px auto; }
            .page { margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          }
        `}</style>
      </div>
    </>
  )
}

export default function PDFQuotePage() {
  return <Suspense fallback={<div>Loading...</div>}><PDFQuoteContent /></Suspense>
}
