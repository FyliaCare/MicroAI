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
    marginTop: 30,
    paddingTop: 30,
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  coverClientLeft: {
    width: '45%',
  },
  
  coverClientRight: {
    width: '50%',
  },
  
  coverClientLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  coverClientName: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1E293B',
    lineHeight: 1.3,
  },
  
  coverClientDetails: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.7,
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
  
  // PROFILE PAGE STYLES - MAGAZINE LAYOUT
  profilePage: {
    fontFamily: DEFAULT_FONT_FAMILY,
    padding: 0,
    backgroundColor: '#FFFFFF',
  },
  
  // Magazine Header
  profileHeader: {
    backgroundColor: '#0F172A',
    backgroundImage: `linear-gradient(135deg, ${brandColor} 0%, #1E293B 100%)`,
    padding: 40,
    paddingTop: 60,
    paddingBottom: 50,
  },
  
  profileMasthead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  
  profileLogo: {
    width: 100,
    height: 100,
    objectFit: 'contain',
  },
  
  profileTitle: {
    fontSize: 42,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  
  profileSubtitle: {
    fontSize: 13,
    color: '#E2E8F0',
    letterSpacing: 3,
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  
  // Magazine Body
  profileBody: {
    padding: 45,
  },
  
  // Feature Story / Lead Article
  profileFeature: {
    marginBottom: 35,
  },
  
  profileFeatureTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 15,
    lineHeight: 1.3,
  },
  
  profileDropCap: {
    fontSize: 11,
    color: '#1E293B',
    lineHeight: 1.8,
    textAlign: 'justify',
    marginBottom: 20,
  },
  
  // Pull Quote
  profilePullQuote: {
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderLeftColor: brandColor,
    borderRightColor: brandColor,
    padding: 20,
    paddingHorizontal: 30,
    marginVertical: 25,
    backgroundColor: '#F8FAFC',
  },
  
  profilePullQuoteText: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1E293B',
    lineHeight: 1.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Two Column Layout
  profileColumns: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  
  profileColumn: {
    width: '48%',
  },
  
  // Section Styles
  profileSection: {
    marginBottom: 30,
  },
  
  profileSectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: brandColor,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  
  profileSectionBody: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.7,
    textAlign: 'justify',
  },
  
  // List Styles
  profileList: {
    paddingLeft: 0,
  },
  
  profileListItem: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 8,
    lineHeight: 1.6,
    paddingLeft: 18,
  },
  
  profileBullet: {
    fontSize: 10,
    color: brandColor,
    marginRight: 8,
    fontWeight: 700,
  },
  
  // Feature Box (Sidebar style)
  profileFeatureBox: {
    backgroundColor: brandColor,
    padding: 20,
    marginBottom: 25,
    borderRadius: 4,
  },
  
  profileFeatureBoxTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  profileFeatureBoxText: {
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 1.7,
    opacity: 0.95,
  },
  
  // Stats/Highlights Grid
  profileStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 30,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  
  profileStatBox: {
    width: '48%',
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 3,
    borderTopColor: brandColor,
  },
  
  profileStatLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  profileStatValue: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: 700,
  },
  
  // Contact Footer
  profileFooter: {
    marginTop: 35,
    paddingTop: 25,
    borderTopWidth: 2,
    borderTopColor: '#0F172A',
  },
  
  profileFooterTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  
  profileContactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  profileContactItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  
  profileContactLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  
  profileContactValue: {
    fontSize: 11,
    color: '#0F172A',
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
            <View style={styles.coverClientLeft}>
              <Text style={styles.coverClientLabel}>Prepared For</Text>
              <Text style={styles.coverClientName}>{quote.clientName || quote.clientCompany}</Text>
            </View>
            
            <View style={styles.coverClientRight}>
              <Text style={styles.coverClientDetails}>
                {quote.clientEmail}
              </Text>
              {quote.clientPhone && (
                <Text style={styles.coverClientDetails}>
                  {quote.clientPhone}
                </Text>
              )}
              {quote.clientAddress && (
                <Text style={styles.coverClientDetails}>
                  {quote.clientAddress}
                </Text>
              )}
            </View>
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

      {/* ========== COMPANY PROFILE PAGE - MAGAZINE LAYOUT ========== */}
      <Page size="A4" style={styles.profilePage} wrap>
        {/* Magazine Header/Masthead */}
        <View style={styles.profileHeader}>
          <View style={styles.profileMasthead}>
            {companyLogo && (
              <Image style={styles.profileLogo} src={companyLogo} />
            )}
          </View>
          <Text style={styles.profileTitle}>{companyName}</Text>
          <Text style={styles.profileSubtitle}>Company Profile & Capabilities</Text>
        </View>
        
        {/* Magazine Body */}
        <View style={styles.profileBody}>
          {/* Feature Story */}
          <View style={styles.profileFeature}>
            <Text style={styles.profileFeatureTitle}>Innovation. Excellence. Results.</Text>
            <Text style={styles.profileDropCap}>{aboutSection}</Text>
          </View>
          
          {/* Pull Quote */}
          <View style={styles.profilePullQuote}>
            <Text style={styles.profilePullQuoteText}>
              "Building enterprise-grade software in a fraction of the time while 
              maintaining uncompromising quality standards."
            </Text>
          </View>
          
          {/* Two Column Layout */}
          <View style={styles.profileColumns}>
            {/* Left Column - Services */}
            <View style={styles.profileColumn}>
              {servicesOverview.length > 0 && (
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionTitle}>Our Services</Text>
                  <View style={styles.profileList}>
                    {servicesOverview.map((service: string, index: number) => (
                      <Text key={index} style={styles.profileListItem}>
                        <Text style={styles.profileBullet}>■</Text> {service}
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
                        <Text style={styles.profileBullet}>■</Text> {value}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
            
            {/* Right Column - Expertise */}
            <View style={styles.profileColumn}>
              {expertise.length > 0 && (
                <View style={styles.profileSection}>
                  <Text style={styles.profileSectionTitle}>Technical Stack</Text>
                  <View style={styles.profileList}>
                    {expertise.map((tech: string, index: number) => (
                      <Text key={index} style={styles.profileListItem}>
                        <Text style={styles.profileBullet}>■</Text> {tech}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
              
              {/* Feature Box */}
              <View style={styles.profileFeatureBox}>
                <Text style={styles.profileFeatureBoxTitle}>Global Reach</Text>
                <Text style={styles.profileFeatureBoxText}>
                  Serving clients across Africa, North America, Europe, UK, and Australia. 
                  Local expertise with worldwide impact.
                </Text>
              </View>
            </View>
          </View>
          
          {/* Stats/Highlights */}
          <View style={styles.profileStatsGrid}>
            <View style={styles.profileStatBox}>
              <Text style={styles.profileStatLabel}>Development Speed</Text>
              <Text style={styles.profileStatValue}>10x Faster Delivery</Text>
            </View>
            <View style={styles.profileStatBox}>
              <Text style={styles.profileStatLabel}>Quality Standard</Text>
              <Text style={styles.profileStatValue}>Enterprise-Grade</Text>
            </View>
            <View style={styles.profileStatBox}>
              <Text style={styles.profileStatLabel}>Technology</Text>
              <Text style={styles.profileStatValue}>Cutting-Edge Stack</Text>
            </View>
            <View style={styles.profileStatBox}>
              <Text style={styles.profileStatLabel}>Support</Text>
              <Text style={styles.profileStatValue}>24/7 Availability</Text>
            </View>
          </View>
          
          {/* Contact Footer */}
          <View style={styles.profileFooter}>
            <Text style={styles.profileFooterTitle}>GET IN TOUCH</Text>
            <View style={styles.profileContactGrid}>
              <View style={styles.profileContactItem}>
                <View>
                  <Text style={styles.profileContactLabel}>Email</Text>
                  <Text style={styles.profileContactValue}>{companyEmail}</Text>
                </View>
              </View>
              <View style={styles.profileContactItem}>
                <View>
                  <Text style={styles.profileContactLabel}>Phone</Text>
                  <Text style={styles.profileContactValue}>{companyPhone}</Text>
                </View>
              </View>
              <View style={styles.profileContactItem}>
                <View>
                  <Text style={styles.profileContactLabel}>Website</Text>
                  <Text style={styles.profileContactValue}>{companyWebsite}</Text>
                </View>
              </View>
              <View style={styles.profileContactItem}>
                <View>
                  <Text style={styles.profileContactLabel}>Location</Text>
                  <Text style={styles.profileContactValue}>{companyAddress}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default QuotePDF
