// ============================================================================
// PROFESSIONAL QUOTE PDF - WITH COVER PAGE, PROFILE, TOC
// MicroAI Systems - Production Ready Quote Generation
// ============================================================================

import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { Quote, QuoteLineItem, QuoteMilestone } from '@/types/quote'

const DEFAULT_FONT_FAMILY = 'Helvetica'
const DEFAULT_LOGO_PATH = '/MICROAI%20SYSTEMS%20OFFICIAL%20LOGO.png'

// ============================================================================
// STYLES
// ============================================================================

const createStyles = (brandColor: string = '#4F46E5') => StyleSheet.create({
  // COVER PAGE STYLES
  coverPage: {
    fontFamily: DEFAULT_FONT_FAMILY,
    backgroundColor: '#FFFFFF',
    padding: 0,
    height: '100%',
    position: 'relative',
  },
  
  coverHeader: {
    backgroundColor: brandColor,
    padding: 40,
    alignItems: 'center',
    paddingTop: 100,
  },
  
  coverLogo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    objectFit: 'contain',
  },
  
  coverCompanyName: {
    fontSize: 36,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  coverTagline: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  
  coverBody: {
    flex: 1,
    padding: 60,
    justifyContent: 'center',
  },
  
  coverQuoteLabel: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  
  coverQuoteTitle: {
    fontSize: 42,
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  
  coverQuoteNumber: {
    fontSize: 18,
    color: brandColor,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 600,
  },
  
  coverClientInfo: {
    marginTop: 60,
    paddingTop: 40,
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
  },
  
  coverClientLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  coverClientName: {
    fontSize: 24,
    fontWeight: 600,
    color: '#1E293B',
    marginBottom: 8,
  },
  
  coverClientDetails: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 1.6,
  },
  
  coverFooter: {
    position: 'absolute',
    bottom: 40,
    left: 60,
    right: 60,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 20,
  },
  
  coverDate: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  
  // INTRO PAGE STYLES
  introPage: {
    fontFamily: DEFAULT_FONT_FAMILY,
    padding: 60,
    backgroundColor: '#FFFFFF',
  },
  introHeader: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: brandColor,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  introText: {
    fontSize: 11,
    color: '#1E293B',
    lineHeight: 1.8,
    marginBottom: 20,
    textAlign: 'justify',
  },
  introHighlight: {
    fontSize: 11,
    color: '#0F172A',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: brandColor,
    borderRadius: 4,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  
  // PROFILE PAGE STYLES
  profilePage: {
    fontFamily: DEFAULT_FONT_FAMILY,
    padding: 60,
    backgroundColor: '#FFFFFF',
  },
  
  profileHeader: {
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: brandColor,
  },
  
  profileTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: brandColor,
    marginBottom: 15,
  },
  
  profileAbout: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.8,
    marginBottom: 30,
    textAlign: 'justify',
  },
  
  profileSection: {
    marginBottom: 25,
  },
  
  profileSectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  profileList: {
    paddingLeft: 15,
  },
  
  profileListItem: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 1.5,
  },
  
  profileBullet: {
    fontSize: 10,
    color: brandColor,
    marginRight: 8,
  },
  
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 30,
  },
  
  profileCard: {
    width: '48%',
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: brandColor,
  },
  
  profileCardLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  profileCardValue: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: 600,
  },
  
  // TOC STYLES
  tocPage: {
    fontFamily: DEFAULT_FONT_FAMILY,
    padding: 60,
    backgroundColor: '#FFFFFF',
  },
  
  tocTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: brandColor,
  },
  
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  
  tocItemText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: 500,
  },
  
  tocItemPage: {
    fontSize: 12,
    color: brandColor,
    fontWeight: 600,
  },
  
  tocDots: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderStyle: 'dotted',
    marginHorizontal: 10,
    marginBottom: 5,
  },
  
  // CONTENT PAGE STYLES
  page: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    padding: 60,
    paddingTop: 80,
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
  },
  
  // Header (appears on all content pages)
  pageHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 60,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 2,
    borderBottomColor: brandColor,
  },
  
  headerLogo: {
    width: 80,
    height: 30,
    objectFit: 'contain',
  },
  
  headerCompany: {
    fontSize: 10,
    color: '#64748B',
  },
  
  headerQuoteNumber: {
    fontSize: 10,
    color: brandColor,
    fontWeight: 600,
  },
  
  // Section Styles
  section: {
    marginBottom: 30,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: brandColor,
  },
  
  introStatement: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 1.7,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: brandColor,
    fontWeight: 500,
  },
  
  bulletList: {
    marginTop: 10,
  },
  
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 10,
  },
  
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: brandColor,
    marginTop: 5,
    marginRight: 10,
  },
  
  bulletText: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
    flex: 1,
  },
  
  // Pricing Table
  table: {
    marginTop: 15,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: brandColor,
    padding: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  
  tableHeaderCell: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 12,
  },
  
  tableCell: {
    fontSize: 10,
    color: '#475569',
  },
  
  tableCellBold: {
    fontSize: 10,
    color: '#1E293B',
    fontWeight: 600,
  },
  
  tableTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  
  // Footer (appears on all content pages)
  pageFooter: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
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
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (amount: number | undefined | null, currency: string = 'USD'): string => {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', GHS: '₵' }
  return `${symbols[currency] || '$'}${safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'N/A'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'N/A'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ============================================================================
// PDF DOCUMENT
// ============================================================================

interface QuotePDFProps {
  quote: Quote
}

const QuotePDF: React.FC<QuotePDFProps> = ({ quote }) => {
  const styles = createStyles(quote.brandColor || '#4F46E5')
  
  // Parse JSON fields safely
  const safeJSONParse = (field: any, fallback: any = []) => {
    if (!field) return fallback
    if (typeof field === 'string') {
      try {
        return JSON.parse(field)
      } catch {
        return fallback
      }
    }
    return field
  }

  const scope = safeJSONParse((quote as any).scopeOfWork, (quote as any).scope || {})
  const items = safeJSONParse(quote.items, [])
  const milestones = safeJSONParse((quote as any).milestones, [])
  
  const companyName = (quote as any).branding?.companyName || quote.companyName || 'MicroAI Systems'
  const companyTagline = (quote as any).branding?.tagline || 'Innovative Software Solutions & Digital Transformation'
  const companyEmail = (quote as any).branding?.companyEmail || quote.companyEmail || 'sales@microaisystems.com'
  const companyPhone = (quote as any).branding?.companyPhone || quote.companyPhone || '+233 244 486 837'
  const companyWebsite = (quote as any).branding?.companyWebsite || quote.companyWebsite || 'www.microaisystems.com'
  const companyAddress = (quote as any).branding?.companyAddress || quote.companyAddress || 'BR253 Pasture St. Takoradi, Ghana'
  const companyLogo = (quote as any).branding?.companyLogo || DEFAULT_LOGO_PATH
  const aboutSection = (quote as any).branding?.aboutSection || (quote as any).branding?.companyDescription || 'MicroAI Systems delivers revolutionary development technology, building web applications, SaaS platforms, and digital solutions in a fraction of the time while maintaining enterprise-grade quality.'
  const servicesOverview = (quote as any).branding?.servicesOverview || []
  const expertise = (quote as any).branding?.expertise || []
  const coreValues = (quote as any).branding?.coreValues || []
  const certifications = (quote as any).branding?.certifications || []

  return (
    <Document>
      {/* ========== COVER PAGE ========== */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverHeader}>
          {companyLogo && (
            <Image style={styles.coverLogo} src={companyLogo} />
          )}
          <Text style={styles.coverCompanyName}>{companyName}</Text>
          <Text style={styles.coverTagline}>{companyTagline}</Text>
        </View>
        
        <View style={styles.coverBody}>
          <Text style={styles.coverQuoteLabel}>Professional Quote</Text>
          <Text style={styles.coverQuoteTitle}>{quote.title}</Text>
          <Text style={styles.coverQuoteNumber}>{quote.quoteNumber}</Text>
          
          <View style={styles.coverClientInfo}>
            <Text style={styles.coverClientLabel}>Prepared For</Text>
            <Text style={styles.coverClientName}>{quote.clientName || quote.clientCompany}</Text>
            <Text style={styles.coverClientDetails}>
              {quote.clientEmail}{'\n'}
              {quote.clientPhone && `${quote.clientPhone}\n`}
              {quote.clientAddress}
            </Text>
          </View>
        </View>
        
        <View style={styles.coverFooter}>
          <Text style={styles.coverDate}>
            Issued: {formatDate(quote.issuedAt || new Date())}{' | '}
            Valid Until: {formatDate(quote.validUntil)}
          </Text>
        </View>
      </Page>

      {/* ========== INTRODUCTION PAGE ========== */}
      <Page size="A4" style={styles.introPage}>
        <View style={styles.introHeader}>
          <Text style={styles.introTitle}>Introducing MicroAI Systems</Text>
          <Text style={styles.introSubtitle}>Enterprise-grade software delivered 10x faster</Text>
        </View>

        <Text style={styles.introText}>{aboutSection}</Text>

        <Text style={styles.introHighlight}>
          MicroAI Systems is based in Ghana and serves clients worldwide across Africa, North America,
          Europe, UK, and Australia. We build full-stack web applications, SaaS platforms, e-commerce
          solutions, and business management systems using modern technologies like Next.js, React,
          TypeScript, Prisma, and Tailwind CSS.
        </Text>
      </Page>

      {/* ========== TABLE OF CONTENTS ========== */}
      <Page size="A4" style={styles.tocPage}>
        <Text style={styles.tocTitle}>Table of Contents</Text>
        
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Project Overview</Text>
          <View style={styles.tocDots} />
          <Text style={styles.tocItemPage}>4</Text>
        </View>
        
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Scope of Work</Text>
          <View style={styles.tocDots} />
          <Text style={styles.tocItemPage}>4</Text>
        </View>
        
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Deliverables</Text>
          <View style={styles.tocDots} />
          <Text style={styles.tocItemPage}>5</Text>
        </View>
        
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Project Timeline & Milestones</Text>
          <View style={styles.tocDots} />
          <Text style={styles.tocItemPage}>5</Text>
        </View>
        
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Investment & Pricing</Text>
          <View style={styles.tocDots} />
          <Text style={styles.tocItemPage}>6</Text>
        </View>
        
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Exclusions</Text>
          <View style={styles.tocDots} />
          <Text style={styles.tocItemPage}>6</Text>
        </View>

        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>MicroAI Company Profile</Text>
          <View style={styles.tocDots} />
          <Text style={styles.tocItemPage}>Final</Text>
        </View>
      </Page>

      {/* ========== CONTENT PAGES ========== */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.pageHeader} fixed>
          {companyLogo && (
            <Image style={styles.headerLogo} src={companyLogo} />
          )}
          <Text style={styles.headerCompany}>{companyName}</Text>
          <Text style={styles.headerQuoteNumber}>{quote.quoteNumber}</Text>
        </View>
        
        {/* Project Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Overview</Text>
          <Text style={styles.introStatement}>
            MicroAI Systems will deliver a comprehensive {(quote as any).projectType || 'software solution'} for{' '}
            {(quote as any).clientCompany || (quote as any).clientName}. This project encompasses {quote.description || 'custom development services'}{' '}
            with a focus on quality, performance, and timely delivery.
          </Text>
        </View>
        
        {/* Scope of Work */}
        {scope.objectives && scope.objectives.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Objectives</Text>
            <Text style={styles.introStatement}>
              MicroAI Systems will achieve the following objectives for this project:
            </Text>
            <View style={styles.bulletList}>
              {scope.objectives.map((obj: string, index: number) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{obj}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Deliverables */}
        {scope.deliverables && scope.deliverables.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deliverables</Text>
            <Text style={styles.introStatement}>
              MicroAI Systems will provide the following deliverables as part of this project:
            </Text>
            <View style={styles.bulletList}>
              {scope.deliverables.map((del: string, index: number) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{del}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Milestones */}
        {milestones.length > 0 && (
          <View style={styles.section} break>
            <Text style={styles.sectionTitle}>Project Timeline & Milestones</Text>
            <Text style={styles.introStatement}>
              MicroAI Systems will execute this project according to the following timeline:
            </Text>
            <View style={styles.bulletList}>
              {milestones.map((milestone: QuoteMilestone, index: number) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>
                    {milestone.name}{' '}
                    {milestone.dueDate && `- ${formatDate(milestone.dueDate)}`}
                    {milestone.amount && ` (${formatCurrency(milestone.amount, quote.currency)})`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Pricing */}
        <View style={styles.section} break>
          <Text style={styles.sectionTitle}>Investment & Pricing</Text>
          <Text style={styles.introStatement}>
            MicroAI Systems proposes the following investment for this project:
          </Text>
          
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '50%' }]}>Description</Text>
              <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, { width: '17%', textAlign: 'right' }]}>Rate</Text>
              <Text style={[styles.tableHeaderCell, { width: '18%', textAlign: 'right' }]}>Amount</Text>
            </View>
            
            {items.map((item: QuoteLineItem, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '50%' }]}>{item.description}</Text>
                <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>
                  {item.quantity || 1}
                </Text>
                <Text style={[styles.tableCell, { width: '17%', textAlign: 'right' }]}>
                  {formatCurrency(item.unitPrice, quote.currency)}
                </Text>
                <Text style={[styles.tableCellBold, { width: '18%', textAlign: 'right' }]}>
                  {formatCurrency(item.total, quote.currency)}
                </Text>
              </View>
            ))}
            
            <View style={styles.tableTotalRow}>
              <Text style={[styles.tableCellBold, { width: '82%', textAlign: 'right' }]}>
                Total Investment:
              </Text>
              <Text style={[styles.tableCellBold, { width: '18%', textAlign: 'right', fontSize: 14 }]}>
                {formatCurrency(quote.total, quote.currency)}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Exclusions */}
        {scope.exclusions && scope.exclusions.length > 0 && (
          <View style={styles.section} break>
            <Text style={styles.sectionTitle}>Exclusions</Text>
            <Text style={styles.introStatement}>
              The following items are not included in this quote:
            </Text>
            <View style={styles.bulletList}>
              {scope.exclusions.map((exc: string, index: number) => (
                <View key={index} style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{exc}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Footer */}
        <View style={styles.pageFooter} fixed>
          <Text style={styles.footerText}>
            {quote.footerText || `${companyName} | ${companyWebsite}`}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>

      {/* ========== COMPANY PROFILE PAGE (FINAL) ========== */}
      <Page size="A4" style={styles.profilePage} wrap>
        <View style={styles.profileHeader}>
          <Text style={styles.profileTitle}>MicroAI Company Profile</Text>
        </View>
        
        <Text style={styles.profileAbout}>{aboutSection}</Text>
        
        {servicesOverview.length > 0 && (
          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Our Services</Text>
            <View style={styles.profileList}>
              {servicesOverview.map((service: string, index: number) => (
                <Text key={index} style={styles.profileListItem}>
                  <Text style={styles.profileBullet}>•</Text> {service}
                </Text>
              ))}
            </View>
          </View>
        )}
        
        {expertise.length > 0 && (
          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Technical Expertise</Text>
            <View style={styles.profileList}>
              {expertise.map((tech: string, index: number) => (
                <Text key={index} style={styles.profileListItem}>
                  <Text style={styles.profileBullet}>•</Text> {tech}
                </Text>
              ))}
            </View>
          </View>
        )}
        
        {coreValues.length > 0 && (
          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Core Values</Text>
            <View style={styles.profileList}>
              {coreValues.map((value: string, index: number) => (
                <Text key={index} style={styles.profileListItem}>
                  <Text style={styles.profileBullet}>•</Text> {value}
                </Text>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.profileGrid}>
          <View style={styles.profileCard}>
            <Text style={styles.profileCardLabel}>Email</Text>
            <Text style={styles.profileCardValue}>{companyEmail}</Text>
          </View>
          <View style={styles.profileCard}>
            <Text style={styles.profileCardLabel}>Phone</Text>
            <Text style={styles.profileCardValue}>{companyPhone}</Text>
          </View>
          <View style={styles.profileCard}>
            <Text style={styles.profileCardLabel}>Website</Text>
            <Text style={styles.profileCardValue}>{companyWebsite}</Text>
          </View>
          <View style={styles.profileCard}>
            <Text style={styles.profileCardLabel}>Location</Text>
            <Text style={styles.profileCardValue}>{companyAddress}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default QuotePDF
