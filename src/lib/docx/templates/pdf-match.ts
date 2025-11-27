/**
 * PDF-MATCHING WORD TEMPLATE UTILITIES
 * Matches the exact styling of QuotePDFNew.tsx
 * 
 * Design Principles:
 * - Full-page colored sections
 * - White text on brand color backgrounds
 * - Clean table designs with alternating rows
 * - Professional spacing and typography
 */

import { AlignmentType, BorderStyle, ShadingType, WidthType } from 'docx'

// ============================================================================
// COLOR SYSTEM (Matches PDF exactly)
// ============================================================================

export const PDF_COLORS = {
  // Brand Colors
  BRAND: '6366f1',           // Default brand color (Indigo)
  BRAND_LIGHT: '818cf8',
  BRAND_DARK: '4f46e5',
  
  // Text Colors
  TEXT_PRIMARY: '1F2937',     // Gray-900
  TEXT_SECONDARY: '6B7280',   // Gray-500
  TEXT_LIGHT: '9CA3AF',       // Gray-400
  
  // Background Colors
  BG_WHITE: 'FFFFFF',
  BG_GRAY: 'F9FAFB',         // Gray-50 (for alternating rows)
  BG_GRAY_LIGHT: 'F3F4F6',   // Gray-100
  
  // Border Colors
  BORDER: 'E5E7EB',          // Gray-200
  BORDER_DARK: 'D1D5DB',     // Gray-300
  
  // Status Colors
  SUCCESS: '10B981',          // Green
  WARNING: 'F59E0B',          // Amber
  ERROR: 'EF4444',            // Red
  INFO: '3B82F6',             // Blue
}

// ============================================================================
// TYPOGRAPHY (Matches PDF sizing)
// ============================================================================

export const PDF_TYPOGRAPHY = {
  // Font Families
  HEADING: 'Calibri',
  BODY: 'Calibri',
  
  // Font Sizes (in half-points, multiply by 2 for pt)
  TITLE: 96,        // 48pt - Cover page title
  SUBTITLE: 48,     // 24pt - Cover page subtitle
  H1: 36,           // 18pt - Section headers
  H2: 28,           // 14pt - Subsection headers
  H3: 22,           // 11pt - Timeline titles
  LARGE: 20,        // 10pt - Standard text
  NORMAL: 18,       // 9pt  - Table text
  SMALL: 16,        // 8pt  - Footer text
  TINY: 14,         // 7pt  - Gantt bar text
}

// ============================================================================
// SPACING (In twips: 1pt = 20 twips)
// ============================================================================

export const PDF_SPACING = {
  XLARGE: 800,      // 40pt
  LARGE: 600,       // 30pt
  MEDIUM: 400,      // 20pt
  NORMAL: 300,      // 15pt
  SMALL: 240,       // 12pt
  XSMALL: 160,      // 8pt
  TINY: 120,        // 6pt
}

// ============================================================================
// BORDERS (Matches PDF table borders)
// ============================================================================

export const PDF_BORDERS = {
  NONE: {
    top: { style: BorderStyle.NONE, size: 0 },
    bottom: { style: BorderStyle.NONE, size: 0 },
    left: { style: BorderStyle.NONE, size: 0 },
    right: { style: BorderStyle.NONE, size: 0 },
  },
  
  TABLE: {
    top: { style: BorderStyle.SINGLE, size: 6, color: PDF_COLORS.BORDER },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: PDF_COLORS.BORDER },
    left: { style: BorderStyle.SINGLE, size: 6, color: PDF_COLORS.BORDER },
    right: { style: BorderStyle.SINGLE, size: 6, color: PDF_COLORS.BORDER },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: PDF_COLORS.BORDER },
    insideVertical: { style: BorderStyle.SINGLE, size: 6, color: PDF_COLORS.BORDER },
  },
  
  TABLE_HEADER: (brandColor: string) => ({
    top: { style: BorderStyle.NONE, size: 0 },
    bottom: { style: BorderStyle.SINGLE, size: 12, color: brandColor },
    left: { style: BorderStyle.NONE, size: 0 },
    right: { style: BorderStyle.NONE, size: 0 },
  }),
  
  COVER_BOX: {
    top: { style: BorderStyle.SINGLE, size: 6, color: 'FFFFFF' },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: 'FFFFFF' },
    left: { style: BorderStyle.SINGLE, size: 6, color: 'FFFFFF' },
    right: { style: BorderStyle.SINGLE, size: 6, color: 'FFFFFF' },
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format currency with proper symbol
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
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

/**
 * Format date
 */
export function formatDate(date: Date | string | undefined, format: 'long' | 'short' = 'long'): string {
  if (!date) {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'short') {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Parse JSON string safely
 */
export function parseJSON<T>(jsonString: string | undefined | null, fallback: T): T {
  if (!jsonString) return fallback
  try {
    const parsed = JSON.parse(jsonString)
    return (Array.isArray(parsed) ? parsed : fallback) as T
  } catch {
    return fallback
  }
}

/**
 * Get brand color from quote data
 */
export function getBrandColor(brandColor?: string): string {
  return brandColor?.replace('#', '') || PDF_COLORS.BRAND
}

/**
 * Create alternating row shading
 */
export function getRowShading(index: number, brandColor?: string) {
  if (index % 2 === 1) {
    return {
      type: ShadingType.CLEAR,
      fill: PDF_COLORS.BG_GRAY,
      color: PDF_COLORS.BG_GRAY,
    }
  }
  return {
    type: ShadingType.CLEAR,
    fill: PDF_COLORS.BG_WHITE,
    color: PDF_COLORS.BG_WHITE,
  }
}

/**
 * Create brand color shading
 */
export function getBrandShading(brandColor: string) {
  return {
    type: ShadingType.CLEAR,
    fill: brandColor,
    color: brandColor,
  }
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}%`
}

/**
 * Convert hex color to RGB (for compatibility)
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 99, g: 102, b: 241 } // Default indigo
}
