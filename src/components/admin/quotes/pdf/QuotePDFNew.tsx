import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Link,
} from '@react-pdf/renderer'

// ========================
// TypeScript Interfaces
// ========================

interface LineItem {
  id: string
  name: string
  description: string
  category: 'development' | 'design' | 'infrastructure' | 'maintenance' | 'consulting' | 'hosting' | 'custom'
  quantity: number
  unitPrice: number
  discount: number
  taxable: boolean
  order: number
}

interface Milestone {
  id: string
  title: string
  description: string
  deliverables: string[]
  duration: number
  percentage: number
  dependencies?: string[]
  startDate?: string
  endDate?: string
}

interface PaymentSchedule {
  id: string
  title: string
  percentage: number
  amount: number
  dueDate: 'onSigning' | 'milestone' | 'net15' | 'net30' | 'net60' | 'custom'
  milestoneId?: string
  customDate?: string
  description?: string
}

interface QuoteData {
  // Basic Info
  quoteNumber: string
  title: string
  clientName: string
  clientEmail: string
  clientCompany?: string
  clientPhone?: string
  clientAddress?: string
  
  // Project Details
  projectType?: string
  industry?: string
  description: string
  executiveSummary?: string
  objectives?: string[]
  
  // Scope
  scopeItems?: string[]
  exclusions?: string[]
  assumptions?: string[]
  deliverables?: string[]
  scopeOfWork?: string
  
  // Pricing
  lineItems: LineItem[]
  currency: string
  discountType?: 'percentage' | 'fixed'
  discountValue?: number
  taxRate: number
  subtotal: number
  discount: number
  tax: number
  total: number
  pricingItems?: string
  
  // Timeline
  startDate?: string
  estimatedDuration?: number
  milestones?: Milestone[]
  timeline?: string
  
  // Payment
  paymentSchedule?: PaymentSchedule[]
  depositRequired?: boolean
  depositPercentage?: number
  depositPercent?: number
  depositAmount?: number
  acceptedPaymentMethods?: string[]
  paymentTerms?: string
  
  // Terms
  termsAndConditions?: string
  terms?: string
  validUntil?: string
  warranties?: string
  supportTerms?: string
  revisionPolicy?: string
  revisionsPolicy?: string
  cancellationPolicy?: string
  confidentialityClause?: string
  ipRights?: string
  maintenanceTerms?: string
  
  // Branding
  brandColor?: string
  includeLogo?: boolean
  includePortfolio?: boolean
  customMessage?: string
  footerText?: string
  companyLogo?: string
  companyName?: string
  companyAddress?: string
  companyEmail?: string
  companyPhone?: string
  companyWebsite?: string
  
  // Metadata
  status?: string
  issuedAt?: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
  
  // Signatures
  clientSignature?: string
  clientSignedBy?: string
  clientSignedAt?: Date | string
  providerSignature?: string
  providerSignedBy?: string
  providerSignedAt?: Date | string
  
  // Additional fields
  freeSupportMonths?: number
  includedRevisions?: number
}

interface QuotePDFProps {
  quote: QuoteData
}

// ========================
// Font Registration
// ========================

// Register fonts (using system fonts fallback)
try {
  Font.register({
    family: 'Roboto',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf', fontWeight: 700 },
      { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf', fontWeight: 500 },
    ],
  })
} catch (error) {
  console.error('Failed to register fonts:', error)
}

// ========================
// Utility Functions
// ========================

const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    GHS: '₵',
  }
  
  const symbol = symbols[currency] || currency
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  return `${symbol}${formatted}`
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const parseJSON = (jsonString: string | undefined, fallback: any = []): any => {
  if (!jsonString) return fallback
  try {
    return JSON.parse(jsonString)
  } catch {
    return fallback
  }
}

// ========================
// Styling
// ========================

const createStyles = (brandColor: string = '#6366f1') => StyleSheet.create({
  // Page Styles
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 10,
    paddingBottom: 60,
  },
  
  coverPage: {
    flexDirection: 'column',
    backgroundColor: brandColor,
    padding: 0,
    position: 'relative',
    minHeight: '100%',
  },
  
  // Header & Footer
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#6B7280',
  },
  
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  
  footerText: {
    fontSize: 8,
    color: '#6B7280',
  },
  
  // Cover Page Styles
  coverContent: {
    flex: 1,
    padding: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  coverLogo: {
    width: 100,
    height: 100,
    marginBottom: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 10,
  },
  
  coverTitle: {
    fontSize: 48,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  coverSubtitle: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 60,
    textAlign: 'center',
    opacity: 0.9,
  },
  
  coverDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 30,
    borderRadius: 8,
    marginBottom: 40,
    minWidth: 400,
  },
  
  coverDetailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  
  coverDetailLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: 500,
  },
  
  coverDetailValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 700,
  },
  
  coverMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    maxWidth: 500,
    lineHeight: 1.6,
    opacity: 0.9,
  },
  
  coverFooter: {
    position: 'absolute',
    bottom: 40,
    left: 60,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  coverCompanyInfo: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
  },
  
  // Section Styles
  section: {
    margin: 40,
    marginBottom: 30,
  },
  
  sectionHeader: {
    backgroundColor: brandColor,
    padding: 15,
    marginBottom: 20,
    borderRadius: 4,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1F2937',
    marginBottom: 10,
    marginTop: 15,
  },
  
  // Content Styles
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 10,
  },
  
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 10,
  },
  
  listBullet: {
    width: 20,
    fontSize: 10,
    color: brandColor,
    fontWeight: 700,
  },
  
  listText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
  },
  
  // Table Styles
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: brandColor,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 700,
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  
  tableRowAlt: {
    backgroundColor: '#F9FAFB',
  },
  
  tableCell: {
    fontSize: 9,
    color: '#374151',
  },
  
  tableCellBold: {
    fontSize: 9,
    fontWeight: 700,
    color: '#1F2937',
  },
  
  // Pricing Table Specific
  pricingTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
  },
  
  pricingRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  
  pricingSummaryRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  pricingTotalRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: brandColor,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  pricingLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginRight: 20,
    minWidth: 100,
    textAlign: 'right',
  },
  
  pricingValue: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1F2937',
    minWidth: 100,
    textAlign: 'right',
  },
  
  pricingTotalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#FFFFFF',
    marginRight: 20,
    minWidth: 100,
    textAlign: 'right',
  },
  
  pricingTotalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: '#FFFFFF',
    minWidth: 100,
    textAlign: 'right',
  },
  
  // Timeline Styles
  timelineItem: {
    marginBottom: 15,
    paddingLeft: 20,
    borderLeftWidth: 3,
    borderLeftColor: brandColor,
    paddingBottom: 15,
  },
  
  timelineTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1F2937',
    marginBottom: 5,
  },
  
  timelineDescription: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 5,
    lineHeight: 1.4,
  },
  
  timelineMeta: {
    fontSize: 8,
    color: '#9CA3AF',
    fontWeight: 500,
  },
  
  // Gantt Chart Styles
  ganttContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
  },
  
  ganttBar: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  
  ganttLabel: {
    fontSize: 8,
    color: '#374151',
    width: 100,
  },
  
  ganttBarFill: {
    height: 20,
    backgroundColor: brandColor,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  ganttBarText: {
    fontSize: 7,
    color: '#FFFFFF',
    fontWeight: 700,
  },
  
  // Signature Styles
  signatureContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  signatureBlock: {
    width: '45%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
  },
  
  signatureTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1F2937',
    marginBottom: 15,
  },
  
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    marginBottom: 5,
    height: 40,
  },
  
  signatureLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 5,
  },
  
  signatureImage: {
    width: '100%',
    height: 40,
    objectFit: 'contain',
    marginBottom: 5,
  },
  
  // Info Box Styles
  infoBox: {
    backgroundColor: '#EFF6FF',
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: brandColor,
    borderRadius: 4,
    marginBottom: 15,
  },
  
  infoBoxTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1E40AF',
    marginBottom: 8,
  },
  
  infoBoxText: {
    fontSize: 9,
    color: '#1E3A8A',
    lineHeight: 1.5,
  },
  
  // Warning Box Styles
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: 4,
    marginBottom: 15,
  },
  
  warningBoxTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#92400E',
    marginBottom: 8,
  },
  
  warningBoxText: {
    fontSize: 9,
    color: '#78350F',
    lineHeight: 1.5,
  },
  
  // Badge Styles
  badge: {
    backgroundColor: brandColor,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  badgeText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  
  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 15,
  },
  
  // Two Column Layout
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  column: {
    width: '48%',
  },
  
  // Card Style
  card: {
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 15,
  },
  
  cardTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1F2937',
    marginBottom: 8,
  },
  
  cardContent: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
  },
})

// ========================
// PDF Components
// ========================

const CoverPage: React.FC<{ quote: QuoteData; styles: any }> = ({ quote, styles }) => {
  const companyInfo = {
    name: quote.companyName || 'MicroAI Systems',
    address: quote.companyAddress || 'BR253 Pasture St. Takoradi, Ghana',
    email: quote.companyEmail || 'sales@microaisystems.com',
    phone: quote.companyPhone || '+233 244486837',
    website: quote.companyWebsite || 'www.microaisystems.com',
  }
  
  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverContent}>
        {quote.includeLogo && (
          <View style={styles.coverLogo}>
            <Text style={{ fontSize: 32, color: quote.brandColor || '#6366f1', fontWeight: 700, textAlign: 'center' }}>
              MA
            </Text>
          </View>
        )}
        
        <Text style={styles.coverTitle}>QUOTE</Text>
        <Text style={styles.coverSubtitle}>{quote.title}</Text>
        
        <View style={styles.coverDetails}>
          <View style={styles.coverDetailRow}>
            <Text style={styles.coverDetailLabel}>Quote Number:</Text>
            <Text style={styles.coverDetailValue}>{quote.quoteNumber}</Text>
          </View>
          <View style={styles.coverDetailRow}>
            <Text style={styles.coverDetailLabel}>Client:</Text>
            <Text style={styles.coverDetailValue}>{quote.clientName}</Text>
          </View>
          {quote.clientCompany && (
            <View style={styles.coverDetailRow}>
              <Text style={styles.coverDetailLabel}>Company:</Text>
              <Text style={styles.coverDetailValue}>{quote.clientCompany}</Text>
            </View>
          )}
          <View style={styles.coverDetailRow}>
            <Text style={styles.coverDetailLabel}>Date:</Text>
            <Text style={styles.coverDetailValue}>{formatDate(quote.issuedAt || quote.createdAt)}</Text>
          </View>
          <View style={styles.coverDetailRow}>
            <Text style={styles.coverDetailLabel}>Valid Until:</Text>
            <Text style={styles.coverDetailValue}>{formatDate(quote.validUntil)}</Text>
          </View>
        </View>
        
        {quote.customMessage && quote.customMessage.trim() !== '' && (
          <Text style={styles.coverMessage}>{quote.customMessage}</Text>
        )}
      </View>
      
      <View style={styles.coverFooter}>
        <View>
          <Text style={styles.coverCompanyInfo}>{companyInfo.name}</Text>
          <Text style={styles.coverCompanyInfo}>{companyInfo.address}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.coverCompanyInfo}>{companyInfo.email}</Text>
          <Text style={styles.coverCompanyInfo}>{companyInfo.phone}</Text>
        </View>
      </View>
    </Page>
  )
}

const ExecutiveSummary: React.FC<{ quote: QuoteData; styles: any }> = ({ quote, styles }) => {
  const objectives = quote.objectives || []
  const deliverables = quote.deliverables || parseJSON(quote.deliverables as any, [])
  
  if (!quote.executiveSummary && objectives.length === 0 && deliverables.length === 0) {
    return null
  }
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
        </View>
        
        {quote.executiveSummary && quote.executiveSummary.trim() !== '' && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.paragraph}>{quote.executiveSummary}</Text>
          </View>
        )}
        
        {quote.description && quote.description.trim() !== '' && !quote.executiveSummary && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionSubtitle}>Project Overview</Text>
            <Text style={styles.paragraph}>{quote.description}</Text>
          </View>
        )}
        
        {objectives.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionSubtitle}>Key Objectives</Text>
            {objectives.map((objective, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{objective}</Text>
              </View>
            ))}
          </View>
        )}
        
        {deliverables.length > 0 && (
          <View>
            <Text style={styles.sectionSubtitle}>Key Deliverables</Text>
            {deliverables.map((deliverable: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listBullet}>✓</Text>
                <Text style={styles.listText}>{deliverable}</Text>
              </View>
            ))}
          </View>
        )}
        
        {quote.projectType && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Project Type</Text>
            <Text style={styles.infoBoxText}>
              {quote.projectType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  )
}

const ScopeOfWork: React.FC<{ quote: QuoteData; styles: any }> = ({ quote, styles }) => {
  const scopeItems = quote.scopeItems || parseJSON(quote.scopeOfWork, [])
  const exclusions = quote.exclusions || []
  const assumptions = quote.assumptions || []
  const deliverables = quote.deliverables || []
  
  if (scopeItems.length === 0 && !quote.scopeOfWork && exclusions.length === 0 && assumptions.length === 0) {
    return null
  }
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Scope of Work</Text>
        </View>
        
        {scopeItems.length > 0 && (
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionSubtitle}>Included Services</Text>
            {scopeItems.map((item: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listBullet}>✓</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        )}
        
        {typeof quote.scopeOfWork === 'string' && quote.scopeOfWork && quote.scopeOfWork.trim() !== '' && (
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.paragraph}>{quote.scopeOfWork}</Text>
          </View>
        )}
        
        {deliverables.length > 0 && (
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionSubtitle}>Deliverables</Text>
            {deliverables.map((deliverable: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listBullet}>→</Text>
                <Text style={styles.listText}>{deliverable}</Text>
              </View>
            ))}
          </View>
        )}
        
        {exclusions.length > 0 && (
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionSubtitle}>Exclusions</Text>
            <Text style={[styles.paragraph, { fontSize: 9, color: '#6B7280', marginBottom: 10 }]}>
              The following items are not included in this quote:
            </Text>
            {exclusions.map((exclusion: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={[styles.listBullet, { color: '#EF4444' }]}>✗</Text>
                <Text style={styles.listText}>{exclusion}</Text>
              </View>
            ))}
          </View>
        )}
        
        {assumptions.length > 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Project Assumptions</Text>
            {assumptions.map((assumption: string, index: number) => (
              <View key={index} style={{ marginBottom: 5 }}>
                <Text style={styles.infoBoxText}>• {assumption}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  )
}

const PricingBreakdown: React.FC<{ quote: QuoteData; styles: any }> = ({ quote, styles }) => {
  const lineItems = quote.lineItems || parseJSON(quote.pricingItems, [])
  const currency = quote.currency || 'USD'
  
  // Group items by category
  const groupedItems = lineItems.reduce((acc: any, item: LineItem) => {
    const category = item.category || 'custom'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})
  
  const categoryLabels: Record<string, string> = {
    development: 'Development Services',
    design: 'Design Services',
    infrastructure: 'Infrastructure & Hosting',
    maintenance: 'Maintenance & Support',
    consulting: 'Consulting Services',
    hosting: 'Hosting Services',
    custom: 'Additional Services',
  }
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pricing Breakdown</Text>
        </View>
        
        {lineItems.length > 0 ? (
          <>
            {Object.entries(groupedItems).map(([category, items]: [string, any]) => (
              <View key={category} style={{ marginBottom: 25 }}>
                <Text style={styles.sectionSubtitle}>{categoryLabels[category] || category}</Text>
                
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { width: '30%' }]}>Item</Text>
                    <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Description</Text>
                    <Text style={[styles.tableHeaderCell, { width: '10%', textAlign: 'center' }]}>Qty</Text>
                    <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Unit Price</Text>
                    <Text style={[styles.tableHeaderCell, { width: '10%', textAlign: 'right' }]}>Disc.</Text>
                    <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Total</Text>
                  </View>
                  
                  {items.map((item: LineItem, index: number) => {
                    const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100)
                    return (
                      <View key={item.id} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                        <Text style={[styles.tableCellBold, { width: '30%' }]}>{item.name}</Text>
                        <Text style={[styles.tableCell, { width: '25%' }]}>{item.description}</Text>
                        <Text style={[styles.tableCell, { width: '10%', textAlign: 'center' }]}>{item.quantity}</Text>
                        <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>
                          {formatCurrency(item.unitPrice, currency)}
                        </Text>
                        <Text style={[styles.tableCell, { width: '10%', textAlign: 'right' }]}>
                          {item.discount}%
                        </Text>
                        <Text style={[styles.tableCellBold, { width: '15%', textAlign: 'right' }]}>
                          {formatCurrency(itemTotal, currency)}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            ))}
            
            {/* Pricing Summary */}
            <View style={{ marginTop: 20 }}>
              <View style={styles.pricingSummaryRow}>
                <Text style={styles.pricingLabel}>Subtotal:</Text>
                <Text style={styles.pricingValue}>{formatCurrency(quote.subtotal, currency)}</Text>
              </View>
              
              {quote.discount > 0 && (
                <View style={styles.pricingSummaryRow}>
                  <Text style={[styles.pricingLabel, { color: '#10B981' }]}>Discount:</Text>
                  <Text style={[styles.pricingValue, { color: '#10B981' }]}>
                    -{formatCurrency(quote.discount, currency)}
                  </Text>
                </View>
              )}
              
              {quote.tax > 0 && (
                <View style={styles.pricingSummaryRow}>
                  <Text style={styles.pricingLabel}>Tax ({quote.taxRate}%):</Text>
                  <Text style={styles.pricingValue}>{formatCurrency(quote.tax, currency)}</Text>
                </View>
              )}
              
              <View style={styles.pricingTotalRow}>
                <Text style={styles.pricingTotalLabel}>TOTAL:</Text>
                <Text style={styles.pricingTotalValue}>{formatCurrency(quote.total, currency)}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Custom Pricing</Text>
            <Text style={styles.infoBoxText}>
              Pricing details will be discussed based on your specific requirements.
            </Text>
          </View>
        )}
        
        {quote.description && quote.description.trim() !== '' && lineItems.length === 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.paragraph}>{quote.description}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  )
}

const TimelineAndMilestones: React.FC<{ quote: QuoteData; styles: any }> = ({ quote, styles }) => {
  const milestones = quote.milestones || parseJSON(quote.timeline, [])
  const startDate = quote.startDate
  const duration = quote.estimatedDuration
  
  if (milestones.length === 0 && !startDate && !duration) {
    return null
  }
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Timeline & Milestones</Text>
        </View>
        
        {(startDate || duration) && (
          <View style={styles.twoColumn}>
            {startDate && (
              <View style={styles.column}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Project Start Date</Text>
                  <Text style={styles.cardContent}>{formatDate(startDate)}</Text>
                </View>
              </View>
            )}
            {duration && (
              <View style={styles.column}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Estimated Duration</Text>
                  <Text style={styles.cardContent}>{duration} days ({Math.round(duration / 7)} weeks)</Text>
                </View>
              </View>
            )}
          </View>
        )}
        
        {milestones.length > 0 && (
          <>
            <Text style={styles.sectionSubtitle}>Project Milestones</Text>
            
            {/* Milestone Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: '5%' }]}>#</Text>
                <Text style={[styles.tableHeaderCell, { width: '35%' }]}>Milestone</Text>
                <Text style={[styles.tableHeaderCell, { width: '30%' }]}>Description</Text>
                <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'center' }]}>Duration</Text>
                <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Progress</Text>
              </View>
              
              {milestones.map((milestone: Milestone, index: number) => (
                <View key={milestone.id} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCellBold, { width: '5%' }]}>{index + 1}</Text>
                  <Text style={[styles.tableCellBold, { width: '35%' }]}>{milestone.title}</Text>
                  <Text style={[styles.tableCell, { width: '30%' }]}>{milestone.description}</Text>
                  <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>
                    {milestone.duration} days
                  </Text>
                  <Text style={[styles.tableCellBold, { width: '15%', textAlign: 'right' }]}>
                    {milestone.percentage}%
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Gantt-style Visual */}
            <View style={styles.ganttContainer}>
              <Text style={[styles.sectionSubtitle, { marginBottom: 15, marginTop: 0 }]}>
                Visual Timeline
              </Text>
              {milestones.map((milestone: Milestone, index: number) => (
                <View key={milestone.id} style={styles.ganttBar}>
                  <Text style={styles.ganttLabel}>
                    {milestone.title.length > 15 ? milestone.title.substring(0, 15) + '...' : milestone.title}
                  </Text>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.ganttBarFill, { width: `${milestone.percentage}%` }]}>
                      <Text style={styles.ganttBarText}>{milestone.percentage}%</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            
            {/* Milestone Details */}
            <View style={{ marginTop: 25 }}>
              <Text style={styles.sectionSubtitle}>Milestone Details</Text>
              {milestones.map((milestone: Milestone, index: number) => (
                <View key={milestone.id} style={styles.timelineItem}>
                  <Text style={styles.timelineTitle}>
                    {index + 1}. {milestone.title}
                  </Text>
                  <Text style={styles.timelineDescription}>{milestone.description}</Text>
                  {milestone.deliverables && milestone.deliverables.length > 0 && (
                    <View style={{ marginTop: 5 }}>
                      <Text style={[styles.timelineMeta, { marginBottom: 3 }]}>Deliverables:</Text>
                      {milestone.deliverables.map((deliverable: string, idx: number) => (
                        <Text key={idx} style={[styles.timelineMeta, { marginLeft: 10 }]}>
                          • {deliverable}
                        </Text>
                      ))}
                    </View>
                  )}
                  <Text style={styles.timelineMeta}>
                    Duration: {milestone.duration} days | Progress Weight: {milestone.percentage}%
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  )
}

const PaymentTermsPage: React.FC<{ quote: QuoteData; styles: any }> = ({ quote, styles }) => {
  const paymentSchedule = quote.paymentSchedule || []
  const currency = quote.currency || 'USD'
  const depositAmount = quote.depositAmount || (quote.depositPercent ? quote.total * (quote.depositPercent / 100) : 0)
  const depositPercentage = quote.depositPercentage || quote.depositPercent || 0
  const acceptedMethods = quote.acceptedPaymentMethods || ['bank-transfer', 'credit-card']
  
  const paymentMethodLabels: Record<string, string> = {
    'bank-transfer': 'Bank Transfer',
    'credit-card': 'Credit Card',
    'paypal': 'PayPal',
    'stripe': 'Stripe',
    'cash': 'Cash',
    'check': 'Check',
    'wire': 'Wire Transfer',
  }
  
  const dueDateLabels: Record<string, string> = {
    onSigning: 'Upon Signing',
    milestone: 'At Milestone Completion',
    net15: 'Net 15 Days',
    net30: 'Net 30 Days',
    net60: 'Net 60 Days',
    custom: 'Custom Date',
  }
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Terms</Text>
        </View>
        
        {quote.depositRequired !== false && depositAmount > 0 && (
          <View style={styles.warningBox}>
            <Text style={styles.warningBoxTitle}>Deposit Required</Text>
            <Text style={styles.warningBoxText}>
              A deposit of {formatCurrency(depositAmount, currency)} ({depositPercentage}% of total) is required
              to initiate the project. This deposit is non-refundable once work begins.
            </Text>
          </View>
        )}
        
        {paymentSchedule.length > 0 && (
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionSubtitle}>Payment Schedule</Text>
            
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: '5%' }]}>#</Text>
                <Text style={[styles.tableHeaderCell, { width: '30%' }]}>Payment</Text>
                <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Due Date</Text>
                <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Percentage</Text>
                <Text style={[styles.tableHeaderCell, { width: '25%', textAlign: 'right' }]}>Amount</Text>
              </View>
              
              {paymentSchedule.map((payment: PaymentSchedule, index: number) => (
                <View key={payment.id} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCellBold, { width: '5%' }]}>{index + 1}</Text>
                  <Text style={[styles.tableCellBold, { width: '30%' }]}>{payment.title}</Text>
                  <Text style={[styles.tableCell, { width: '25%' }]}>
                    {payment.customDate ? formatDate(payment.customDate) : dueDateLabels[payment.dueDate]}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>
                    {payment.percentage}%
                  </Text>
                  <Text style={[styles.tableCellBold, { width: '25%', textAlign: 'right' }]}>
                    {formatCurrency(payment.amount, currency)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {quote.paymentTerms && (
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionSubtitle}>Payment Terms & Conditions</Text>
            <Text style={styles.paragraph}>{quote.paymentTerms}</Text>
          </View>
        )}
        
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Accepted Payment Methods</Text>
              {acceptedMethods.map((method: string, index: number) => (
                <View key={index} style={{ marginBottom: 3 }}>
                  <Text style={styles.cardContent}>• {paymentMethodLabels[method] || method}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.column}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Late Payment Policy</Text>
              <Text style={styles.cardContent}>
                Invoices not paid within 15 days of the due date will incur a late fee of 1.5% per month
                (18% APR) on the outstanding balance.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Important Payment Information</Text>
          <Text style={styles.infoBoxText}>
            • All payments must be made in {currency}{'\n'}
            • Invoices will be sent via email{'\n'}
            • Payment confirmations should be sent to {quote.companyEmail || 'sales@microaisystems.com'}{'\n'}
            • Project work may be suspended for overdue payments exceeding 30 days{'\n'}
            • Refunds are subject to our refund policy outlined in the terms and conditions
          </Text>
        </View>
      </View>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  )
}

const TermsAndConditions: React.FC<{ quote: QuoteData; styles: any }> = ({ quote, styles }) => {
  const terms = quote.termsAndConditions || quote.terms || ''
  const termsArray = terms.split('\n').filter(t => t.trim())
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
        </View>
        
        {termsArray.map((term, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <Text style={styles.paragraph}>{term}</Text>
          </View>
        ))}
        
        {quote.warranties && quote.warranties.trim() !== '' && (
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text style={styles.sectionSubtitle}>Warranties & Guarantees</Text>
            <Text style={styles.paragraph}>{quote.warranties}</Text>
          </View>
        )}
        
        {quote.supportTerms && quote.supportTerms.trim() !== '' && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionSubtitle}>Support Terms</Text>
            <Text style={styles.paragraph}>{quote.supportTerms}</Text>
            {quote.freeSupportMonths && (
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxText}>
                  Includes {quote.freeSupportMonths} month(s) of free support after project completion.
                </Text>
              </View>
            )}
          </View>
        )}
        
        {(quote.revisionPolicy || quote.revisionsPolicy) && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionSubtitle}>Revision Policy</Text>
            <Text style={styles.paragraph}>{quote.revisionPolicy || quote.revisionsPolicy}</Text>
            {quote.includedRevisions && (
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxText}>
                  This quote includes {quote.includedRevisions} round(s) of revisions at no additional cost.
                </Text>
              </View>
            )}
          </View>
        )}
        
        {quote.cancellationPolicy && quote.cancellationPolicy.trim() !== '' && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionSubtitle}>Cancellation Policy</Text>
            <Text style={styles.paragraph}>{quote.cancellationPolicy}</Text>
          </View>
        )}
        
        {quote.confidentialityClause && quote.confidentialityClause.trim() !== '' && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionSubtitle}>Confidentiality</Text>
            <Text style={styles.paragraph}>{quote.confidentialityClause}</Text>
          </View>
        )}
        
        {quote.ipRights && quote.ipRights.trim() !== '' && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionSubtitle}>Intellectual Property Rights</Text>
            <Text style={styles.paragraph}>{quote.ipRights}</Text>
          </View>
        )}
        
        {quote.maintenanceTerms && quote.maintenanceTerms.trim() !== '' && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionSubtitle}>Maintenance Terms</Text>
            <Text style={styles.paragraph}>{quote.maintenanceTerms}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  )
}

const SignaturePage: React.FC<{ quote: QuoteData; styles: any }> = ({ quote, styles }) => {
  const companyInfo = {
    name: quote.companyName || 'MicroAI Systems',
    address: quote.companyAddress || 'BR253 Pasture St. Takoradi, Ghana',
    email: quote.companyEmail || 'sales@microaisystems.com',
    phone: quote.companyPhone || '+233 244486837',
  }
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Agreement & Signatures</Text>
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Quote Acceptance</Text>
          <Text style={styles.infoBoxText}>
            By signing below, both parties agree to the terms, conditions, pricing, and timeline outlined in
            this quote. This quote is valid until {formatDate(quote.validUntil)} and may be modified or
            withdrawn after this date.
          </Text>
        </View>
        
        <View style={styles.signatureContainer}>
          {/* Client Signature */}
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>CLIENT ACCEPTANCE</Text>
            
            {quote.clientSignature ? (
              <Image src={quote.clientSignature} style={styles.signatureImage} />
            ) : (
              <View style={styles.signatureLine} />
            )}
            
            <Text style={styles.signatureLabel}>Signature</Text>
            
            <View style={{ marginTop: 15 }}>
              <Text style={[styles.tableCellBold, { marginBottom: 3 }]}>
                {quote.clientSignedBy || quote.clientName || '_________________________'}
              </Text>
              <Text style={styles.signatureLabel}>Printed Name</Text>
            </View>
            
            <View style={{ marginTop: 15 }}>
              <Text style={[styles.tableCellBold, { marginBottom: 3 }]}>
                {quote.clientSignedAt ? formatDate(quote.clientSignedAt) : '_________________________'}
              </Text>
              <Text style={styles.signatureLabel}>Date</Text>
            </View>
            
            {quote.clientCompany && (
              <View style={{ marginTop: 15 }}>
                <Text style={[styles.tableCellBold, { marginBottom: 3 }]}>{quote.clientCompany}</Text>
                <Text style={styles.signatureLabel}>Company</Text>
              </View>
            )}
          </View>
          
          {/* Provider Signature */}
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureTitle}>SERVICE PROVIDER</Text>
            
            {quote.providerSignature ? (
              <Image src={quote.providerSignature} style={styles.signatureImage} />
            ) : (
              <View style={styles.signatureLine} />
            )}
            
            <Text style={styles.signatureLabel}>Signature</Text>
            
            <View style={{ marginTop: 15 }}>
              <Text style={[styles.tableCellBold, { marginBottom: 3 }]}>
                {quote.providerSignedBy || '_________________________'}
              </Text>
              <Text style={styles.signatureLabel}>Printed Name</Text>
            </View>
            
            <View style={{ marginTop: 15 }}>
              <Text style={[styles.tableCellBold, { marginBottom: 3 }]}>
                {quote.providerSignedAt ? formatDate(quote.providerSignedAt) : '_________________________'}
              </Text>
              <Text style={styles.signatureLabel}>Date</Text>
            </View>
            
            <View style={{ marginTop: 15 }}>
              <Text style={[styles.tableCellBold, { marginBottom: 3 }]}>{companyInfo.name}</Text>
              <Text style={styles.signatureLabel}>Company</Text>
            </View>
          </View>
        </View>
        
        <View style={{ marginTop: 40 }}>
          <Text style={styles.sectionSubtitle}>Contact Information</Text>
          
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Client</Text>
                <Text style={styles.cardContent}>{quote.clientName}</Text>
                {quote.clientCompany && <Text style={styles.cardContent}>{quote.clientCompany}</Text>}
                <Text style={styles.cardContent}>{quote.clientEmail}</Text>
                {quote.clientPhone && <Text style={styles.cardContent}>{quote.clientPhone}</Text>}
                {quote.clientAddress && <Text style={[styles.cardContent, { fontSize: 8 }]}>{quote.clientAddress}</Text>}
              </View>
            </View>
            
            <View style={styles.column}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Service Provider</Text>
                <Text style={styles.cardContent}>{companyInfo.name}</Text>
                <Text style={styles.cardContent}>{companyInfo.email}</Text>
                <Text style={styles.cardContent}>{companyInfo.phone}</Text>
                <Text style={[styles.cardContent, { fontSize: 8 }]}>{companyInfo.address}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={[styles.infoBox, { marginTop: 30 }]}>
          <Text style={styles.infoBoxTitle}>Next Steps</Text>
          <Text style={styles.infoBoxText}>
            1. Review all sections of this quote carefully{'\n'}
            2. Sign and return this document via email or postal mail{'\n'}
            3. Submit the required deposit payment{'\n'}
            4. Project work will begin upon receipt of signed agreement and deposit{'\n'}
            5. You will receive a project kickoff email with next steps
          </Text>
        </View>
        
        {quote.footerText && quote.footerText.trim() !== '' && (
          <View style={{ marginTop: 30, textAlign: 'center' }}>
            <Text style={[styles.paragraph, { textAlign: 'center', fontSize: 9, color: '#6B7280' }]}>
              {quote.footerText}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  )
}

// ========================
// Main PDF Document
// ========================

const QuotePDFNew: React.FC<QuotePDFProps> = ({ quote }) => {
  // Handle parsing of JSON strings from database
  const processedQuote: QuoteData = {
    ...quote,
    lineItems: Array.isArray(quote.lineItems) ? quote.lineItems : parseJSON(quote.pricingItems, []),
    milestones: Array.isArray(quote.milestones) ? quote.milestones : parseJSON(quote.timeline, []),
    paymentSchedule: Array.isArray(quote.paymentSchedule) ? quote.paymentSchedule : parseJSON(quote.paymentTerms, []),
    scopeItems: Array.isArray(quote.scopeItems) ? quote.scopeItems : parseJSON(quote.scopeOfWork, []),
    objectives: Array.isArray(quote.objectives) ? quote.objectives : [],
    deliverables: Array.isArray(quote.deliverables) ? quote.deliverables : [],
    exclusions: Array.isArray(quote.exclusions) ? quote.exclusions : [],
    assumptions: Array.isArray(quote.assumptions) ? quote.assumptions : [],
    acceptedPaymentMethods: Array.isArray(quote.acceptedPaymentMethods) ? quote.acceptedPaymentMethods : ['bank-transfer', 'credit-card'],
  }
  
  const brandColor = processedQuote.brandColor || '#6366f1'
  const styles = createStyles(brandColor)
  
  return (
    <Document
      title={`Quote ${processedQuote.quoteNumber} - ${processedQuote.title}`}
      author={processedQuote.companyName || 'MicroAI Systems'}
      subject={`Business Quote for ${processedQuote.clientName}`}
      keywords="quote, proposal, business, contract"
      creator="MicroAI Systems Quote Generator"
      producer="@react-pdf/renderer"
    >
      {/* Cover Page */}
      <CoverPage quote={processedQuote} styles={styles} />
      
      {/* Executive Summary */}
      {(processedQuote.executiveSummary || (processedQuote.objectives && processedQuote.objectives.length > 0)) && (
        <ExecutiveSummary quote={processedQuote} styles={styles} />
      )}
      
      {/* Scope of Work */}
      {((processedQuote.scopeItems && processedQuote.scopeItems.length > 0) || processedQuote.scopeOfWork || (processedQuote.exclusions && processedQuote.exclusions.length > 0)) && (
        <ScopeOfWork quote={processedQuote} styles={styles} />
      )}
      
      {/* Pricing Breakdown */}
      <PricingBreakdown quote={processedQuote} styles={styles} />
      
      {/* Timeline & Milestones */}
      {((processedQuote.milestones && processedQuote.milestones.length > 0) || processedQuote.startDate || processedQuote.estimatedDuration) && (
        <TimelineAndMilestones quote={processedQuote} styles={styles} />
      )}
      
      {/* Payment Terms */}
      <PaymentTermsPage quote={processedQuote} styles={styles} />
      
      {/* Terms & Conditions */}
      <TermsAndConditions quote={processedQuote} styles={styles} />
      
      {/* Signature Page */}
      <SignaturePage quote={processedQuote} styles={styles} />
    </Document>
  )
}

export default QuotePDFNew
