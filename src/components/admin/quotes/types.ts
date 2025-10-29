// ============================================================================
// TYPE DEFINITIONS FOR QUOTE SYSTEM
// ============================================================================

export interface QuoteItem {
  id: string
  category: 'development' | 'design' | 'infrastructure' | 'maintenance' | 'consulting' | 'custom'
  name: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  taxable: boolean
}

export interface Milestone {
  id: string
  title: string
  description: string
  deliverables: string[]
  duration: number // days
  percentage: number // of total cost
  dependencies: string[] // milestone IDs
  startDate?: string
  endDate?: string
}

export interface PaymentTerm {
  id: string
  title: string
  percentage: number
  amount?: number
  dueDate: 'onSigning' | 'milestone' | 'net15' | 'net30' | 'net60' | 'custom'
  milestoneId?: string
  customDate?: string
  description?: string
}

export interface Client {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  address?: string
}

export interface QuoteData {
  // Step 1: Basic Info
  title: string
  quoteNumber: string
  clientId: string
  projectType: string
  industry: string
  validUntil: string
  internalNotes: string

  // Step 2: Scope
  executiveSummary: string
  objectives: string[]
  scope: string[]
  outOfScope: string[]
  assumptions: string[]
  constraints: string[]

  // Step 3: Pricing
  items: QuoteItem[]
  discountType: 'percentage' | 'fixed'
  discountValue: number
  taxRate: number
  currency: string

  // Step 4: Timeline
  startDate: string
  estimatedDuration: number
  milestones: Milestone[]
  criticalPath: string[]

  // Step 5: Terms
  paymentTerms: PaymentTerm[]
  lateFeePercentage: number
  earlyPaymentDiscount: number
  acceptedPaymentMethods: string[]
  termsAndConditions: string
  warranties: string
  supportTerms: string

  // Step 6: Branding
  brandColor: string
  includeCompanyLogo: boolean
  includePortfolio: boolean
  includeTestimonials: boolean
  customCoverMessage: string
  footerText: string
}

export interface QuoteTemplate {
  id: string
  name: string
  category: string
  description: string
  items: QuoteItem[]
  milestones: Milestone[]
  terms: string
  validityDays: number
}

export interface QuoteCalculations {
  subtotal: number
  discount: number
  tax: number
  total: number
}
