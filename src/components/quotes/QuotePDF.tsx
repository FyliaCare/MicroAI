// ============================================================================
// QUOTE PDF GENERATOR - Professional PDF Generation with React-PDF
// Supports multiple templates, high-quality rendering, and customization
// ============================================================================

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Image, Link } from '@react-pdf/renderer'
import type { Quote, QuoteLineItem, QuoteMilestone } from '@/types/quote'

// ============================================================================
// FONT REGISTRATION
// ============================================================================

// Register custom fonts for better typography
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 },
  ],
})

// ============================================================================
// STYLES
// ============================================================================

const createStyles = (brandColor: string = '#4F46E5') => StyleSheet.create({
  // Page Styles
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#FFFFFF',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: brandColor,
  },
  
  companyInfo: {
    flex: 1,
  },
  
  companyName: {
    fontSize: 24,
    fontWeight: 700,
    color: brandColor,
    marginBottom: 5,
  },
  
  companyDetails: {
    fontSize: 9,
    color: '#64748B',
    lineHeight: 1.5,
  },
  
  logo: {
    width: 100,
    height: 40,
    objectFit: 'contain',
  },
  
  // Title Section
  titleSection: {
    marginBottom: 25,
  },
  
  quoteTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: 8,
  },
  
  quoteNumber: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 15,
  },
  
  metadata: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  metadataLabel: {
    fontSize: 9,
    color: '#64748B',
    marginRight: 5,
  },
  
  metadataValue: {
    fontSize: 9,
    color: '#1E293B',
    fontWeight: 600,
  },
  
  // Client Section
  clientSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
  },
  
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  clientDetails: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
  },
  
  // Executive Summary
  summarySection: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: brandColor,
    borderRadius: 4,
  },
  
  summaryText: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.7,
  },
  
  // Scope Section
  scopeSection: {
    marginBottom: 25,
  },
  
  bulletList: {
    marginTop: 10,
    paddingLeft: 15,
  },
  
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: brandColor,
    marginRight: 8,
    marginTop: 5,
  },
  
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  
  // Line Items Table
  table: {
    marginBottom: 25,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: brandColor,
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 700,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  
  tableCell: {
    fontSize: 9,
    color: '#475569',
  },
  
  tableCellBold: {
    fontWeight: 600,
    color: '#1E293B',
  },
  
  // Column Widths
  col50: { width: '50%' },
  col30: { width: '30%' },
  col20: { width: '20%' },
  col15: { width: '15%' },
  col10: { width: '10%' },
  
  // Pricing Summary
  pricingSummary: {
    marginTop: 20,
    marginBottom: 25,
    alignSelf: 'flex-end',
    width: '40%',
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  
  summaryLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  
  summaryValue: {
    fontSize: 10,
    color: '#1E293B',
    fontWeight: 600,
  },
  
  totalRow: {
    backgroundColor: brandColor,
    borderRadius: 4,
    marginTop: 8,
  },
  
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  
  totalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  
  // Milestones
  milestonesSection: {
    marginBottom: 25,
  },
  
  milestoneCard: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: brandColor,
    borderRadius: 4,
  },
  
  milestoneName: {
    fontSize: 11,
    fontWeight: 600,
    color: '#1E293B',
    marginBottom: 4,
  },
  
  milestoneDetails: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 2,
  },
  
  // Terms & Conditions
  termsSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
  },
  
  termItem: {
    marginBottom: 12,
  },
  
  termTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: '#1E293B',
    marginBottom: 4,
  },
  
  termText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  
  // Signatures
  signaturesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  
  signatureBox: {
    width: '45%',
  },
  
  signatureLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 8,
  },
  
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    marginBottom: 8,
    paddingBottom: 20,
  },
  
  signatureImage: {
    width: 150,
    height: 50,
    marginBottom: 8,
    objectFit: 'contain',
  },
  
  signatureName: {
    fontSize: 9,
    color: '#475569',
    fontWeight: 600,
  },
  
  signatureDate: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 2,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 35,
    right: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  
  footerText: {
    fontSize: 8,
    color: '#94A3B8',
  },
  
  pageNumber: {
    fontSize: 8,
    color: '#94A3B8',
  },
  
  // Utility Classes
  mt10: { marginTop: 10 },
  mt20: { marginTop: 20 },
  mb10: { marginBottom: 10 },
  mb20: { marginBottom: 20 },
  p15: { padding: 15 },
  
  // Text Styles
  textBold: { fontWeight: 600 },
  textItalic: { fontStyle: 'italic' },
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    GHS: '₵',
  }
  
  return `${symbols[currency] || '$'}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'N/A'
  
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ============================================================================
// PDF COMPONENTS
// ============================================================================

interface QuotePDFProps {
  quote: Quote
}

const QuotePDF: React.FC<QuotePDFProps> = ({ quote }) => {
  const styles = createStyles(quote.brandColor || '#4F46E5')
  
  // Parse JSON fields
  const items: QuoteLineItem[] = typeof quote.items === 'string' 
    ? JSON.parse(quote.items || '[]') 
    : quote.items || []
    
  const milestones: QuoteMilestone[] = typeof quote.milestones === 'string'
    ? JSON.parse(quote.milestones || '[]')
    : quote.milestones || []
  
  const scope = typeof quote.scope === 'string'
    ? JSON.parse(quote.scope || '{}')
    : quote.scope || {}
  
  const terms = typeof quote.terms === 'string'
    ? JSON.parse(quote.terms || '{}')
    : quote.terms || {}
  
  return (
    <Document
      title={`Quote ${quote.quoteNumber} - ${quote.title}`}
      author={quote.branding?.companyName || 'MicroAI Systems'}
      subject={`Professional Quote for ${quote.clientName || 'Client'}`}
      keywords={`quote, proposal, ${quote.projectType || ''}, ${quote.industry || ''}`}
      creator="MicroAI Quote System"
      producer="MicroAI Systems"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} fixed>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              {quote.branding?.companyName || 'Your Company'}
            </Text>
            <View style={styles.companyDetails}>
              {quote.branding?.companyAddress && <Text>{quote.branding.companyAddress}</Text>}
              {quote.branding?.companyEmail && <Text>Email: {quote.branding.companyEmail}</Text>}
              {quote.branding?.companyPhone && <Text>Phone: {quote.branding.companyPhone}</Text>}
              {quote.branding?.companyWebsite && (
                <Link src={quote.branding.companyWebsite}>
                  <Text style={{ color: quote.brandColor || '#4F46E5' }}>{quote.branding.companyWebsite}</Text>
                </Link>
              )}
            </View>
          </View>
          
          {quote.branding?.companyLogo && (
            <Image style={styles.logo} src={quote.branding.companyLogo} />
          )}
        </View>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.quoteTitle}>{quote.title}</Text>
          <Text style={styles.quoteNumber}>Quote #{quote.quoteNumber}</Text>
          
          <View style={styles.metadata}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Issue Date:</Text>
              <Text style={styles.metadataValue}>{formatDate(quote.issuedAt || quote.createdAt)}</Text>
            </View>
            
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Valid Until:</Text>
              <Text style={styles.metadataValue}>{formatDate(quote.validUntil)}</Text>
            </View>
            
            {quote.timeline && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Timeline:</Text>
                <Text style={styles.metadataValue}>{quote.timeline}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Client Information */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>Prepared For</Text>
          <View style={styles.clientDetails}>
            <Text style={styles.textBold}>{quote.clientName}</Text>
            {quote.clientCompany && <Text>{quote.clientCompany}</Text>}
            {quote.clientEmail && <Text>Email: {quote.clientEmail}</Text>}
            {quote.clientPhone && <Text>Phone: {quote.clientPhone}</Text>}
            {quote.clientAddress && <Text>{quote.clientAddress}</Text>}
          </View>
        </View>
        
        {/* Executive Summary */}
        {quote.executiveSummary && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <Text style={styles.summaryText}>{quote.executiveSummary}</Text>
          </View>
        )}
        
        {/* Scope of Work */}
        {scope.objectives && scope.objectives.length > 0 && (
          <View style={styles.scopeSection}>
            <Text style={styles.sectionTitle}>Project Objectives</Text>
            <View style={styles.bulletList}>
              {scope.objectives.map((objective: string, index: number) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{objective}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {scope.deliverables && scope.deliverables.length > 0 && (
          <View style={styles.scopeSection}>
            <Text style={styles.sectionTitle}>Deliverables</Text>
            <View style={styles.bulletList}>
              {scope.deliverables.map((deliverable: string, index: number) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{deliverable}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Line Items Table */}
        {items.length > 0 && (
          <View style={styles.table} break>
            <Text style={styles.sectionTitle}>Pricing Breakdown</Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.col50]}>Description</Text>
              <Text style={[styles.tableHeaderText, styles.col15]}>Quantity</Text>
              <Text style={[styles.tableHeaderText, styles.col15]}>Unit Price</Text>
              <Text style={[styles.tableHeaderText, styles.col20, styles.textRight]}>Total</Text>
            </View>
            
            {/* Table Rows */}
            {items.map((item, index) => (
              <View key={item.id} style={[styles.tableRow, ...(index % 2 === 1 ? [styles.tableRowAlt] : [])]}>
                <View style={styles.col50}>
                  <Text style={styles.tableCellBold}>{item.name}</Text>
                  {item.description && (
                    <Text style={[styles.tableCell, { marginTop: 2, fontSize: 8 }]}>
                      {item.description}
                    </Text>
                  )}
                </View>
                <Text style={[styles.tableCell, styles.col15]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.col15]}>
                  {formatCurrency(item.unitPrice, quote.currency)}
                </Text>
                <Text style={[styles.tableCellBold, styles.col20, styles.textRight]}>
                  {formatCurrency(item.total, quote.currency)}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Pricing Summary */}
        <View style={styles.pricingSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(quote.subtotal, quote.currency)}</Text>
          </View>
          
          {quote.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Discount {quote.discountType === 'percentage' ? `(${quote.discount}%)` : ''}:
              </Text>
              <Text style={styles.summaryValue}>
                -{formatCurrency(quote.discount, quote.currency)}
              </Text>
            </View>
          )}
          
          {quote.tax > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax ({quote.taxRate}%):</Text>
              <Text style={styles.summaryValue}>{formatCurrency(quote.tax, quote.currency)}</Text>
            </View>
          )}
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalValue}>{formatCurrency(quote.total, quote.currency)}</Text>
          </View>
        </View>
        
        {/* Milestones */}
        {milestones.length > 0 && (
          <View style={styles.milestonesSection} break>
            <Text style={styles.sectionTitle}>Project Milestones</Text>
            {milestones.map((milestone, index) => (
              <View key={milestone.id} style={styles.milestoneCard}>
                <Text style={styles.milestoneName}>
                  Milestone {index + 1}: {milestone.name}
                </Text>
                <Text style={styles.milestoneDetails}>{milestone.description}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                  <Text style={styles.milestoneDetails}>Due: {formatDate(milestone.dueDate)}</Text>
                  <Text style={[styles.milestoneDetails, styles.textBold]}>
                    {formatCurrency(milestone.amount, quote.currency)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Terms & Conditions */}
        {terms && Object.keys(terms).length > 0 && (
          <View style={styles.termsSection} break>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            
            {terms.payment && (
              <View style={styles.termItem}>
                <Text style={styles.termTitle}>Payment Terms</Text>
                <Text style={styles.termText}>{terms.payment}</Text>
              </View>
            )}
            
            {terms.warranty && (
              <View style={styles.termItem}>
                <Text style={styles.termTitle}>Warranty</Text>
                <Text style={styles.termText}>{terms.warranty}</Text>
              </View>
            )}
            
            {terms.support && (
              <View style={styles.termItem}>
                <Text style={styles.termTitle}>Support</Text>
                <Text style={styles.termText}>{terms.support}</Text>
              </View>
            )}
            
            {terms.intellectualProperty && (
              <View style={styles.termItem}>
                <Text style={styles.termTitle}>Intellectual Property</Text>
                <Text style={styles.termText}>{terms.intellectualProperty}</Text>
              </View>
            )}
          </View>
        )}
        
        {/* Exclusions */}
        {scope.exclusions && scope.exclusions.length > 0 && (
          <View style={styles.scopeSection}>
            <Text style={styles.sectionTitle}>Exclusions</Text>
            <View style={styles.bulletList}>
              {scope.exclusions.map((exclusion: string, index: number) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{exclusion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Signatures */}
        <View style={styles.signaturesSection} break>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Client Signature</Text>
            {quote.clientSignature ? (
              <>
                <Image style={styles.signatureImage} src={quote.clientSignature} />
                <Text style={styles.signatureName}>{quote.clientSignedBy || quote.clientName}</Text>
                <Text style={styles.signatureDate}>
                  Signed on {formatDate(quote.clientSignedAt)}
                </Text>
              </>
            ) : (
              <View style={styles.signatureLine} />
            )}
          </View>
          
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Provider Signature</Text>
            {quote.providerSignature ? (
              <>
                <Image style={styles.signatureImage} src={quote.providerSignature} />
                <Text style={styles.signatureName}>{quote.providerSignedBy}</Text>
                <Text style={styles.signatureDate}>
                  Signed on {formatDate(quote.providerSignedAt)}
                </Text>
              </>
            ) : (
              <View style={styles.signatureLine} />
            )}
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {quote.footerText || `Generated by ${quote.branding?.companyName || 'MicroAI Systems'}`}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}

export default QuotePDF
