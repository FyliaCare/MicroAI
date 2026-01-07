// ============================================================================
// QUOTE SYSTEM - TYPE DEFINITIONS
// Complete type system for the world-class quote platform
// ============================================================================

// ============================================================================
// CORE QUOTE TYPES
// ============================================================================

export interface QuoteLineItem {
  id: string
  name: string
  description: string
  category: 'development' | 'design' | 'hosting' | 'maintenance' | 'consulting' | 'other'
  quantity: number
  unitPrice: number
  total: number
  taxable: boolean
  notes?: string
  sortOrder?: number
}

export interface QuoteMilestone {
  id: string
  name: string
  description: string
  dueDate: string | Date
  amount: number
  percentage?: number
  deliverables: string[]
  status?: 'pending' | 'in-progress' | 'completed'
}

export interface QuoteScope {
  summary: string
  objectives: string[]
  deliverables: string[]
  exclusions: string[]
  assumptions: string[]
  techStack?: string[]
}

export interface QuoteTerms {
  payment: string
  warranty: string
  support: string
  revisions: string
  cancellation: string
  intellectualProperty: string
  confidentiality: string
  liability?: string
  termination?: string
}

export interface QuoteBranding {
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  companyWebsite: string
  companyLogo?: string
  brandColor: string
  tagline?: string
  taxId?: string
  registrationNumber?: string
}

export interface QuoteClient {
  id?: string
  name: string
  email: string
  company?: string
  phone?: string
  address?: string
  contactPerson?: string
  taxId?: string
}

export interface QuotePricing {
  setupFee: number
  developmentCost: number
  designCost: number
  monthlyHosting: number
  monthlyMaintenance: number
  monthlyRecurring: number
  yearlyRecurring: number
  hostingBreakdown?: Record<string, { cost: number; charge: number; profit: number }>
}

export interface QuotePayment {
  depositPercent: number
  depositAmount: number
  paymentSchedule: QuoteMilestone[]
  acceptedMethods: string[]
  terms: string
  lateFees?: string
  refundPolicy?: string
}

export interface QuoteAnalytics {
  viewCount: number
  downloadCount: number
  lastViewedAt?: Date | string
  averageTimeOnPage?: number
  deviceTypes?: Record<string, number>
  locations?: Record<string, number>
}

// ============================================================================
// MAIN QUOTE INTERFACE
// ============================================================================

export interface Quote {
  // Core Identity
  id: string
  quoteNumber: string
  version: number
  
  // Basic Info
  title: string
  description?: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted'
  category?: string
  
  // Client & Project
  clientId?: string
  projectId?: string
  client?: QuoteClient
  
  // Financial
  currency: string
  subtotal: number
  taxRate: number
  tax: number
  discountType: 'fixed' | 'percentage'
  discount: number
  total: number
  
  // Line Items
  items: QuoteLineItem[]
  
  // Scope & Timeline
  scope?: QuoteScope
  estimatedHours?: number
  timeline?: string
  milestones: QuoteMilestone[]
  
  // Technical
  projectType?: string
  industry?: string
  techStack?: string[]
  
  // Pricing Breakdown
  pricing: QuotePricing
  
  // Client Information
  clientName?: string
  clientEmail?: string
  clientCompany?: string
  clientPhone?: string
  clientAddress?: string
  contactPerson?: string
  
  // Company Branding
  branding: QuoteBranding
  brandColor?: string
  
  // Legacy company fields (for backward compatibility)
  companyName?: string
  companyEmail?: string
  companyPhone?: string
  companyAddress?: string
  companyWebsite?: string
  companyLogo?: string
  
  // Terms & Conditions
  terms: QuoteTerms
  paymentTerms?: string
  freeSupportMonths: number
  includedRevisions: number
  revisionCost?: number
  warrantyTerms?: string
  
  // Additional Info
  executiveSummary?: string
  notes?: string
  internalNotes?: string
  customMessage?: string
  footerText?: string
  
  // Validity
  validityDays: number
  validUntil?: Date | string
  issuedAt?: Date | string
  sentAt?: Date | string
  viewedAt?: Date | string
  respondedAt?: Date | string
  expiresAt?: Date | string
  
  // Signatures
  clientSignature?: string
  clientSignedAt?: Date | string
  clientSignedBy?: string
  providerSignature?: string
  providerSignedAt?: Date | string
  providerSignedBy?: string
  
  // Template & Style
  templateStyle: string
  templateId?: string
  includeLogo?: boolean
  includePortfolio?: boolean
  
  // Analytics
  analytics: QuoteAnalytics
  
  // Timestamps
  createdAt: Date | string
  updatedAt: Date | string
}

// ============================================================================
// QUOTE TEMPLATE TYPES
// ============================================================================

export interface QuoteTemplate {
  id: string
  name: string
  category: string
  description?: string
  icon?: string
  thumbnail?: string
  
  // Default Values
  defaultPricing: QuotePricing
  defaultScope?: Partial<QuoteScope>
  defaultTerms?: Partial<QuoteTerms>
  defaultItems: QuoteLineItem[]
  defaultMilestones?: QuoteMilestone[]
  
  // Settings
  estimatedHours: number
  timeline: string
  techStack: string[]
  features: string[]
  deliverables: string[]
  
  // Metadata
  isActive: boolean
  sortOrder: number
  usageCount?: number
  rating?: number
  
  createdAt: Date | string
  updatedAt: Date | string
}

// ============================================================================
// QUOTE VERSION HISTORY
// ============================================================================

export interface QuoteVersion {
  id: string
  quoteId: string
  version: number
  data: Quote // Full snapshot
  changes?: QuoteChange[]
  changedBy?: string
  changeReason?: string
  createdAt: Date | string
}

export interface QuoteChange {
  field: string
  oldValue: any
  newValue: any
  timestamp: Date | string
}

// ============================================================================
// QUOTE BUILDER FORM DATA
// ============================================================================

export interface QuoteFormData {
  // Step 1: Basic Info
  title: string
  description: string
  category: string
  projectType: string
  industry: string
  
  // Step 2: Client Selection
  clientId?: string
  clientName: string
  clientEmail: string
  clientCompany: string
  clientPhone: string
  clientAddress: string
  contactPerson: string
  
  // Step 3: Scope & Timeline
  scopeSummary: string
  objectives: string[]
  deliverables: string[]
  exclusions: string[]
  assumptions: string[]
  estimatedHours: number
  timeline: string
  techStack: string[]
  
  // Step 4: Pricing & Line Items
  items: QuoteLineItem[]
  currency: string
  taxRate: number
  discountType: 'fixed' | 'percentage'
  discount: number
  
  // Additional Costs
  setupFee: number
  developmentCost: number
  designCost: number
  monthlyHosting: number
  monthlyMaintenance: number
  
  // Step 5: Milestones & Payment
  milestones: QuoteMilestone[]
  depositPercent: number
  paymentTerms: string
  acceptedPaymentMethods: string[]
  
  // Step 6: Terms & Conditions
  warrantyTerms: string
  supportTerms: string
  revisionPolicy: string
  cancellationPolicy: string
  ipRights: string
  confidentialityClause: string
  freeSupportMonths: number
  includedRevisions: number
  revisionCost: number
  
  // Step 7: Branding & Customization
  brandColor: string
  customMessage: string
  footerText: string
  includeLogo: boolean
  includePortfolio: boolean
  templateStyle: string
  
  // Step 8: Review & Send
  validityDays: number
  notes: string
  internalNotes: string
  status: 'draft' | 'sent'
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface QuoteListResponse {
  success: boolean
  quotes: Quote[]
  total: number
  page: number
  limit: number
  filters?: QuoteFilters
}

export interface QuoteResponse {
  success: boolean
  quote: Quote
  message?: string
}

export interface QuoteFilters {
  status?: string[]
  category?: string[]
  dateFrom?: string
  dateTo?: string
  clientId?: string
  minAmount?: number
  maxAmount?: number
  searchQuery?: string
}

export interface QuoteSortOptions {
  field: 'createdAt' | 'total' | 'quoteNumber' | 'client' | 'status'
  order: 'asc' | 'desc'
}

// ============================================================================
// PDF GENERATION TYPES
// ============================================================================

export interface PDFOptions {
  template: 'modern' | 'classic' | 'minimal' | 'corporate' | 'creative'
  includeSignatures: boolean
  includeCoverPage: boolean
  includeTableOfContents: boolean
  includeAppendix: boolean
  watermark?: string
  headerFooter: boolean
  pageNumbers: boolean
  colorScheme?: string
}

export interface PDFMetadata {
  title: string
  author: string
  subject: string
  keywords: string[]
  creator: string
  producer: string
}

// ============================================================================
// QUOTE STATISTICS
// ============================================================================

export interface QuoteStatistics {
  totalQuotes: number
  activeQuotes: number
  acceptedQuotes: number
  rejectedQuotes: number
  expiredQuotes: number
  
  totalValue: number
  acceptedValue: number
  averageValue: number
  
  conversionRate: number
  averageResponseTime: number
  
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  byMonth: Record<string, number>
  
  topClients: Array<{ clientId: string; clientName: string; totalValue: number; quoteCount: number }>
  recentActivity: Array<{ date: string; action: string; quoteId: string }>
}

// ============================================================================
// QUOTE EMAIL TYPES
// ============================================================================

export interface QuoteEmailData {
  quoteId: string
  quoteNumber: string
  recipientEmail: string
  recipientName: string
  subject: string
  message: string
  includeAttachment: boolean
  sendCopy: boolean
  copyEmail?: string
}

// ============================================================================
// QUOTE EXPORT TYPES
// ============================================================================

export type ExportFormat = 'pdf' | 'docx' | 'html' | 'json' | 'csv'

export interface QuoteExportOptions {
  format: ExportFormat
  includeLineItems: boolean
  includeTerms: boolean
  includeSignatures: boolean
  compression?: 'none' | 'low' | 'medium' | 'high'
}
