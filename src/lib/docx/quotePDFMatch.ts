/**
 * PDF-MATCHING WORD QUOTE GENERATOR
 * Generates Word documents that exactly match the PDF preview styling
 * 
 * Based on: QuotePDFNew.tsx
 * Template: Modern, clean, professional
 */

import { Document, Packer, Paragraph, PageBreak } from 'docx'
import { generateCoverPage, CoverPageData } from './sections-pdf/coverPage'
import { generatePricingBreakdown, PricingData } from './sections-pdf/pricing'
import {
  createSectionHeader,
  createSubsectionHeader,
  createParagraph,
  createBulletItem,
  createCheckItem,
  createSpacer,
} from './sections-pdf/sectionUtils'
import { getBrandColor, parseJSON } from './templates/pdf-match'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LineItem {
  id?: string
  name: string
  description: string
  category?: string
  quantity: number
  unitPrice: number
  discount?: number
  total?: number
}

export interface Milestone {
  id?: string
  title: string
  description: string
  duration: number
  percentage?: number
}

export interface PaymentScheduleItem {
  id?: string
  title: string
  percentage: number
  amount: number
  dueDate: string
}

export interface QuoteData {
  // Basic Info
  id: string
  quoteNumber: string
  title: string
  description?: string
  status: string
  
  // Dates
  createdAt: Date
  validUntil: Date
  
  // Client Information
  clientName: string
  clientEmail: string
  clientCompany?: string
  clientPhone?: string
  clientAddress?: string
  
  // Company Information
  companyName?: string
  companyTagline?: string
  companyAddress?: string
  companyEmail?: string
  companyPhone?: string
  companyWebsite?: string
  
  // Project Details
  executiveSummary?: string
  objectives?: string[]
  scopeItems?: string[]
  deliverables?: string[]
  exclusions?: string[]
  assumptions?: string[]
  
  // Pricing
  items: LineItem[]
  currency?: string
  subtotal: number
  discount: number
  tax: number
  total: number
  
  // Timeline
  milestones?: Milestone[]
  estimatedDuration?: number
  
  // Payment
  paymentSchedule?: PaymentScheduleItem[]
  depositRequired?: boolean
  
  // Terms
  terms?: string
  termsAndConditions?: string
  
  // Branding
  brandColor?: string
  customMessage?: string
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

export async function generatePDFMatchQuoteDocx(quote: QuoteData): Promise<Buffer> {
  console.log('[PDF-Match Generator] Starting document generation...')
  console.log('[PDF-Match Generator] Quote:', quote.quoteNumber)
  
  try {
    const sections: Paragraph[] = []
    const brandColor = getBrandColor(quote.brandColor)
    
    // 1. COVER PAGE
    console.log('[PDF-Match Generator] Generating cover page...')
    const coverData: CoverPageData = {
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      createdAt: quote.createdAt,
      validUntil: quote.validUntil,
      total: quote.total,
      currency: quote.currency,
      clientName: quote.clientName,
      clientCompany: quote.clientCompany,
      companyName: quote.companyName,
      companyTagline: quote.companyTagline,
      companyEmail: quote.companyEmail,
      companyPhone: quote.companyPhone,
      customMessage: quote.customMessage,
      brandColor: quote.brandColor,
    }
    sections.push(...generateCoverPage(coverData))
    
    // 2. EXECUTIVE SUMMARY
    if (quote.executiveSummary || quote.description) {
      console.log('[PDF-Match Generator] Generating executive summary...')
      sections.push(createSectionHeader('Executive Summary', brandColor))
      sections.push(createSpacer())
      
      if (quote.executiveSummary) {
        sections.push(createParagraph(quote.executiveSummary))
      } else if (quote.description) {
        sections.push(createParagraph(quote.description))
      }
      
      sections.push(createSpacer())
    }
    
    // 3. OBJECTIVES
    if (quote.objectives && quote.objectives.length > 0) {
      console.log('[PDF-Match Generator] Generating objectives...')
      sections.push(createSubsectionHeader('Key Objectives'))
      quote.objectives.forEach(obj => {
        sections.push(createBulletItem(obj, brandColor))
      })
      sections.push(createSpacer())
    }
    
    // 4. SCOPE OF WORK
    if (quote.scopeItems && quote.scopeItems.length > 0) {
      console.log('[PDF-Match Generator] Generating scope of work...')
      sections.push(createSectionHeader('Scope of Work', brandColor))
      sections.push(createSpacer())
      sections.push(createSubsectionHeader('Included Services'))
      
      quote.scopeItems.forEach(item => {
        sections.push(createCheckItem(item))
      })
      sections.push(createSpacer())
    }
    
    // 5. DELIVERABLES
    if (quote.deliverables && quote.deliverables.length > 0) {
      console.log('[PDF-Match Generator] Generating deliverables...')
      sections.push(createSubsectionHeader('Key Deliverables'))
      quote.deliverables.forEach(item => {
        sections.push(createCheckItem(item))
      })
      sections.push(createSpacer())
    }
    
    // 6. EXCLUSIONS
    if (quote.exclusions && quote.exclusions.length > 0) {
      sections.push(createSubsectionHeader('Exclusions'))
      quote.exclusions.forEach(item => {
        sections.push(createBulletItem(item, brandColor))
      })
      sections.push(createSpacer())
    }
    
    // 7. PRICING BREAKDOWN
    console.log('[PDF-Match Generator] Generating pricing breakdown...')
    const pricingData: PricingData = {
      lineItems: quote.items,
      subtotal: quote.subtotal,
      discount: quote.discount,
      tax: quote.tax,
      total: quote.total,
      currency: quote.currency,
      brandColor: quote.brandColor,
    }
    sections.push(...generatePricingBreakdown(pricingData))
    
    // 8. PAYMENT TERMS
    if (quote.paymentSchedule && quote.paymentSchedule.length > 0) {
      console.log('[PDF-Match Generator] Generating payment terms...')
      sections.push(createSectionHeader('Payment Terms', brandColor))
      sections.push(createSpacer())
      
      quote.paymentSchedule.forEach(payment => {
        sections.push(createBulletItem(`${payment.title}: ${payment.percentage}% (${payment.amount}) - ${payment.dueDate}`, brandColor))
      })
      sections.push(createSpacer())
    }
    
    // 9. TERMS & CONDITIONS
    if (quote.terms || quote.termsAndConditions) {
      console.log('[PDF-Match Generator] Generating terms & conditions...')
      sections.push(createSectionHeader('Terms & Conditions', brandColor))
      sections.push(createSpacer())
      sections.push(createParagraph(quote.terms || quote.termsAndConditions || ''))
      sections.push(createSpacer())
    }
    
    // 10. SIGNATURE BLOCK
    console.log('[PDF-Match Generator] Generating signature section...')
    sections.push(createSectionHeader('Acceptance', brandColor))
    sections.push(createSpacer())
    sections.push(createParagraph('By signing below, you agree to the terms and conditions outlined in this quotation.'))
    sections.push(createSpacer())
    sections.push(createSpacer())
    sections.push(createParagraph('_____________________________          Date: __________'))
    sections.push(createParagraph('Client Signature'))
    sections.push(createSpacer())
    sections.push(createParagraph('_____________________________          Date: __________'))
    sections.push(createParagraph(`${quote.companyName || 'MicroAI Systems'} Representative`))
    
    // Create document
    console.log('[PDF-Match Generator] Assembling document...')
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: sections,
      }],
    })
    
    // Generate buffer
    console.log('[PDF-Match Generator] Generating buffer...')
    const buffer = await Packer.toBuffer(doc)
    
    console.log('[PDF-Match Generator] ✓ Document generated successfully!')
    console.log('[PDF-Match Generator] Size:', buffer.length, 'bytes')
    
    return buffer
  } catch (error) {
    console.error('[PDF-Match Generator] ERROR:', error)
    throw error
  }
}
