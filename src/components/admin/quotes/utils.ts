// ============================================================================
// UTILITY FUNCTIONS FOR QUOTE SYSTEM
// ============================================================================

import { QuoteItem, QuoteData } from './types'

export const calculateSubtotal = (items: QuoteItem[]): number => {
  return items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice
    const discountAmount = (itemTotal * item.discount) / 100
    return sum + (itemTotal - discountAmount)
  }, 0)
}

export const calculateDiscount = (
  subtotal: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number => {
  if (discountType === 'percentage') {
    return (subtotal * discountValue) / 100
  }
  return discountValue
}

export const calculateTax = (
  subtotal: number,
  discount: number,
  taxRate: number
): number => {
  const taxableAmount = subtotal - discount
  return (taxableAmount * taxRate) / 100
}

export const calculateTotal = (
  subtotal: number,
  discount: number,
  tax: number
): number => {
  return subtotal - discount + tax
}

export const generateQuoteNumber = (): string => {
  const prefix = 'QT'
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${prefix}-${year}${month}-${random}`
}

export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const getDefaultValidUntil = (days: number = 30): string => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

export const validateQuoteData = (data: QuoteData, step: number): string[] => {
  const errors: string[] = []

  switch (step) {
    case 1:
      if (!data.title) errors.push('Project title is required')
      if (!data.clientId) errors.push('Client selection is required')
      if (!data.quoteNumber) errors.push('Quote number is required')
      break
    case 2:
      if (!data.executiveSummary) errors.push('Executive summary is required')
      if (data.scope.length === 0) errors.push('At least one scope item is required')
      break
    case 3:
      if (data.items.length === 0) errors.push('At least one line item is required')
      break
    case 4:
      if (data.milestones.length === 0) errors.push('At least one milestone is required')
      break
    case 5:
      if (data.paymentTerms.length === 0) errors.push('At least one payment term is required')
      break
  }

  return errors
}

export const saveToLocalStorage = (data: QuoteData): void => {
  try {
    localStorage.setItem('quote_draft', JSON.stringify(data))
    localStorage.setItem('quote_draft_timestamp', new Date().toISOString())
  } catch (err) {
    console.error('Failed to save to localStorage:', err)
  }
}

export const loadFromLocalStorage = (): QuoteData | null => {
  try {
    const saved = localStorage.getItem('quote_draft')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (err) {
    console.error('Failed to load from localStorage:', err)
  }
  return null
}

export const clearLocalStorage = (): void => {
  localStorage.removeItem('quote_draft')
  localStorage.removeItem('quote_draft_timestamp')
}

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
  }
  return symbols[currency] || '$'
}
