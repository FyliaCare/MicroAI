/**
 * ISO-COMPLIANT PROFESSIONAL QUOTATION GENERATOR
 * 
 * Premium Word Document Generator for Business Quotations
 * Meets international standards and best practices
 * 
 * @module QuoteDocxISO
 * @version 2.0.0
 */

import { Document, Packer, Paragraph } from 'docx'
import { generateCoverPage } from './sections/coverPage'
import { generateContactInformation } from './sections/contactInfo'
import { generateProjectOverview } from './sections/projectOverview'
import { generateScopeOfWork } from './sections/scopeOfWork'
import { generatePricingBreakdown } from './sections/pricing'
import { generateTimeline } from './sections/timeline'
import { generatePaymentTerms } from './sections/paymentTerms'
import { generateTermsAndConditions } from './sections/termsConditions'
import { generateSignatureSection } from './sections/signature'
import { createPageBreak } from './templates/iso-professional'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LineItem {
  id?: string
  name: string
  description: string
  category?: 'development' | 'design' | 'infrastructure' | 'maintenance' | 'consulting' | 'hosting' | 'custom'
  quantity: number
  unitPrice: number
  discount?: number
  taxable?: boolean
  total?: number
}

export interface Milestone {
  id?: string
  title: string
  description: string
  deliverables?: string[]
  duration: number
  percentage?: number
  dependencies?: string[]
  startDate?: string
  endDate?: string
}

export interface PaymentScheduleItem {
  id?: string
  title: string
  percentage: number
  amount: number
  dueDate: 'onSigning' | 'milestone' | 'net15' | 'net30' | 'net60' | 'custom'
  milestoneId?: string
  customDate?: string
  description?: string
}

export interface QuoteData {
  // Quote Identification
  id: string
  quoteNumber: string
  title: string
  description?: string
  status: string
  
  // Dates
  createdAt: Date
  validUntil: Date
  startDate?: Date
  
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
  companyLogo?: string
  companyTaxId?: string
  companyRegistration?: string
  
  // Project Details
  executiveSummary?: string
  projectType?: string
  industry?: string
  objectives?: string[]
  keyBenefits?: string[]
  successCriteria?: string[]
  
  // Scope
  scopeItems?: string[]
  deliverables?: string[]
  exclusions?: string[]
  assumptions?: string[]
  constraints?: string[]
  dependencies?: string[]
  
  // Pricing
  lineItems?: LineItem[]
  currency?: string
  subtotal?: number
  discountType?: 'fixed' | 'percentage'
  discountValue?: number
  discount?: number
  taxRate?: number
  tax?: number
  total: number
  
  // Timeline
  estimatedDuration?: number
  timeline?: string
  milestones?: Milestone[]
  
  // Payment Terms
  paymentSchedule?: PaymentScheduleItem[]
  depositRequired?: boolean
  depositAmount?: number
  depositPercentage?: number
  acceptedPaymentMethods?: string[]
  lateFeePercentage?: number
  earlyPaymentDiscount?: number
  paymentTermsText?: string
  
  // Terms & Conditions
  termsAndConditions?: string
  warranties?: string
  liabilities?: string
  intellectualProperty?: string
  confidentiality?: string
  supportPeriod?: string
  maintenanceIncluded?: boolean
  revisionsIncluded?: number
  cancellationPolicy?: string
  disputeResolution?: string
  
  // Additional
  notes?: string
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

/**
 * Generate ISO-compliant professional Word document for quotation
 * 
 * @param quote - Complete quote data
 * @returns Buffer containing the generated Word document
 */
export async function generateISOQuoteDocx(quote: QuoteData): Promise<Buffer> {
  console.log('[ISO Quote Generator] Starting document generation...')
  console.log('[ISO Quote Generator] Quote:', quote.quoteNumber)
  
  const sections: (Paragraph | any)[] = []
  
  try {
    // ========== COVER PAGE ==========
    console.log('[ISO Quote Generator] Generating cover page...')
    const coverElements = generateCoverPage({
      companyName: quote.companyName || 'MicroAI Systems',
      companyTagline: quote.companyTagline || 'Professional Software Development Services',
      companyLogo: quote.companyLogo,
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      createdAt: quote.createdAt,
      validUntil: quote.validUntil,
      total: quote.total,
      currency: quote.currency || 'USD',
      clientName: quote.clientName,
      clientCompany: quote.clientCompany,
    })
    sections.push(...coverElements)
    
    // ========== CONTACT INFORMATION ==========
    console.log('[ISO Quote Generator] Generating contact information...')
    const contactElements = generateContactInformation({
      client: {
        name: quote.clientName,
        company: quote.clientCompany,
        email: quote.clientEmail,
        phone: quote.clientPhone,
        address: quote.clientAddress,
      },
      company: {
        name: quote.companyName || 'MicroAI Systems',
        email: quote.companyEmail || 'sales@microaisystems.com',
        phone: quote.companyPhone || '+233 244486837',
        address: quote.companyAddress || 'BR253 Pasture St. Takoradi, Ghana',
        website: quote.companyWebsite || 'www.microaisystems.com',
        taxId: quote.companyTaxId,
        registrationNumber: quote.companyRegistration,
      },
    })
    sections.push(...contactElements)
    sections.push(createPageBreak())
    
    // ========== PROJECT OVERVIEW ==========
    console.log('[ISO Quote Generator] Generating project overview...')
    const overviewElements = generateProjectOverview({
      executiveSummary: quote.executiveSummary,
      description: quote.description,
      projectType: quote.projectType,
      industry: quote.industry,
      objectives: quote.objectives,
      keyBenefits: quote.keyBenefits,
      successCriteria: quote.successCriteria,
    })
    sections.push(...overviewElements)
    sections.push(createPageBreak())
    
    // ========== SCOPE OF WORK ==========
    console.log('[ISO Quote Generator] Generating scope of work...')
    const scopeElements = generateScopeOfWork({
      scopeItems: quote.scopeItems,
      deliverables: quote.deliverables,
      exclusions: quote.exclusions,
      assumptions: quote.assumptions,
      constraints: quote.constraints,
      dependencies: quote.dependencies,
    })
    sections.push(...scopeElements)
    sections.push(createPageBreak())
    
    // ========== PRICING BREAKDOWN ==========
    console.log('[ISO Quote Generator] Generating pricing breakdown...')
    const pricingElements = generatePricingBreakdown({
      lineItems: quote.lineItems || [],
      currency: quote.currency || 'USD',
      subtotal: quote.subtotal || 0,
      discountType: quote.discountType,
      discountValue: quote.discountValue,
      discount: quote.discount || 0,
      taxRate: quote.taxRate,
      tax: quote.tax || 0,
      total: quote.total,
      notes: quote.notes,
    })
    sections.push(...pricingElements)
    sections.push(createPageBreak())
    
    // ========== TIMELINE & MILESTONES ==========
    if (quote.milestones && quote.milestones.length > 0) {
      console.log('[ISO Quote Generator] Generating timeline...')
      const timelineElements = generateTimeline({
        startDate: quote.startDate,
        estimatedDuration: quote.estimatedDuration,
        timeline: quote.timeline,
        milestones: quote.milestones,
      })
      sections.push(...timelineElements)
      sections.push(createPageBreak())
    }
    
    // ========== PAYMENT TERMS ==========
    console.log('[ISO Quote Generator] Generating payment terms...')
    const paymentElements = generatePaymentTerms({
      paymentSchedule: quote.paymentSchedule,
      currency: quote.currency || 'USD',
      depositRequired: quote.depositRequired,
      depositAmount: quote.depositAmount,
      depositPercentage: quote.depositPercentage,
      acceptedMethods: quote.acceptedPaymentMethods,
      lateFeePercentage: quote.lateFeePercentage,
      earlyPaymentDiscount: quote.earlyPaymentDiscount,
      paymentTermsText: quote.paymentTermsText,
    })
    sections.push(...paymentElements)
    sections.push(createPageBreak())
    
    // ========== TERMS & CONDITIONS ==========
    console.log('[ISO Quote Generator] Generating terms & conditions...')
    const termsElements = generateTermsAndConditions({
      termsAndConditions: quote.termsAndConditions,
      warranties: quote.warranties,
      liabilities: quote.liabilities,
      intellectualProperty: quote.intellectualProperty,
      confidentiality: quote.confidentiality,
      supportPeriod: quote.supportPeriod,
      maintenanceIncluded: quote.maintenanceIncluded,
      revisionsIncluded: quote.revisionsIncluded,
      cancellationPolicy: quote.cancellationPolicy,
      disputeResolution: quote.disputeResolution,
    })
    sections.push(...termsElements)
    sections.push(createPageBreak())
    
    // ========== SIGNATURE & ACCEPTANCE ==========
    console.log('[ISO Quote Generator] Generating signature section...')
    const signatureElements = generateSignatureSection({
      quoteNumber: quote.quoteNumber,
      validUntil: quote.validUntil,
      clientName: quote.clientName,
      companyName: quote.companyName || 'MicroAI Systems',
    })
    sections.push(...signatureElements)
    
    // ========== CREATE DOCUMENT ==========
    console.log('[ISO Quote Generator] Assembling document...')
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,  // 1 inch
              bottom: 1440, // 1 inch
              left: 1440,   // 1 inch
            },
          },
        },
        children: sections,
      }],
    })
    
    // ========== GENERATE BUFFER ==========
    console.log('[ISO Quote Generator] Generating buffer...')
    const buffer = await Packer.toBuffer(doc)
    
    console.log('[ISO Quote Generator] ✓ Document generated successfully!')
    console.log('[ISO Quote Generator] Size:', buffer.length, 'bytes')
    
    return buffer
    
  } catch (error) {
    console.error('[ISO Quote Generator] ERROR:', error)
    throw error
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default generateISOQuoteDocx
export { generateISOQuoteDocx as generateQuoteDocx }
