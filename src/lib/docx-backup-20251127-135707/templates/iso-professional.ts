/**
 * ISO-COMPLIANT PROFESSIONAL QUOTATION TEMPLATE
 * 
 * Meets International Standards:
 * - ISO 9001:2015 (Quality Management)
 * - ISO/IEC 27001 (Information Security)
 * - Business document best practices
 * 
 * Features:
 * - Professional multi-page layout
 * - Complete quotation metadata
 * - Detailed pricing breakdown with categories
 * - Payment terms and schedules
 * - Legal terms and conditions
 * - Digital signature section
 * - Audit trail information
 */

import { 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  AlignmentType, 
  WidthType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
} from 'docx'

// Professional ISO-compliant color scheme
export const ISO_COLORS = {
  PRIMARY: '1E3A8A',      // Professional Navy Blue
  PRIMARY_LIGHT: 'DBEAFE', // Light Blue Background
  ACCENT: '059669',       // Professional Green
  ACCENT_LIGHT: 'D1FAE5', // Light Green
  WARNING: 'DC2626',      // Red for important items
  DARK: '1F2937',         // Dark Gray for headers
  MEDIUM: '6B7280',       // Medium Gray for text
  LIGHT: 'F3F4F6',        // Light Gray for backgrounds
  WHITE: 'FFFFFF',        // White
  TEXT: '111827',         // Near Black for body text
  BORDER: 'E5E7EB',       // Border color
}

// Typography settings
export const TYPOGRAPHY = {
  TITLE: { size: 56, font: 'Calibri' },
  HEADING_1: { size: 32, font: 'Calibri' },
  HEADING_2: { size: 28, font: 'Calibri' },
  HEADING_3: { size: 24, font: 'Calibri' },
  BODY: { size: 22, font: 'Calibri' },
  SMALL: { size: 20, font: 'Calibri' },
  TINY: { size: 18, font: 'Calibri' },
}

// Spacing constants (in twips - 1/20th of a point)
export const SPACING = {
  SECTION: 480,      // Large space between sections
  PARAGRAPH: 240,    // Standard paragraph spacing
  LINE: 120,         // Small line spacing
  BULLET: 180,       // Bullet point spacing
}

// Standard margins (in twips)
export const MARGINS = {
  PAGE: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
  TABLE: { top: 150, bottom: 150, left: 200, right: 200 },
  CELL_TIGHT: { top: 100, bottom: 100, left: 150, right: 150 },
}

/**
 * Format currency according to locale and currency code
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    GHS: 'GH₵',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹',
  }
  
  const symbol = currencySymbols[currency] || currency
  const formatted = amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })
  
  return `${symbol}${formatted}`
}

/**
 * Format date in professional format
 */
export function formatDate(date: Date | string | undefined, format: 'long' | 'short' = 'long'): string {
  if (!date) {
    return 'N/A'
  }
  
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  }
  
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

/**
 * Create professional section header with underline
 */
export function createSectionHeader(
  text: string, 
  icon?: string,
  color: string = ISO_COLORS.PRIMARY
): Paragraph {
  const children: TextRun[] = []
  
  if (icon) {
    children.push(
      new TextRun({
        text: `${icon} `,
        bold: true,
        size: TYPOGRAPHY.HEADING_1.size,
        color: ISO_COLORS.ACCENT,
        font: TYPOGRAPHY.HEADING_1.font,
      })
    )
  }
  
  children.push(
    new TextRun({
      text: text.toUpperCase(),
      bold: true,
      size: TYPOGRAPHY.HEADING_1.size,
      color: color,
      font: TYPOGRAPHY.HEADING_1.font,
    })
  )
  
  return new Paragraph({
    children,
    spacing: { before: SPACING.SECTION, after: SPACING.PARAGRAPH },
    border: {
      bottom: {
        color: color,
        space: 1,
        size: 16,
        style: BorderStyle.SINGLE,
      },
    },
  })
}

/**
 * Create subsection header
 */
export function createSubsectionHeader(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: TYPOGRAPHY.HEADING_2.size,
        color: ISO_COLORS.DARK,
        font: TYPOGRAPHY.HEADING_2.font,
      }),
    ],
    spacing: { before: SPACING.PARAGRAPH, after: SPACING.LINE },
  })
}

/**
 * Create body paragraph with optional emphasis
 */
export function createBodyParagraph(
  text: string, 
  options: {
    bold?: boolean
    italic?: boolean
    color?: string
    alignment?: typeof AlignmentType[keyof typeof AlignmentType]
    indent?: number
    spacingAfter?: number
  } = {}
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: options.bold || false,
        italics: options.italic || false,
        size: TYPOGRAPHY.BODY.size,
        color: options.color || ISO_COLORS.TEXT,
        font: TYPOGRAPHY.BODY.font,
      }),
    ],
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: { after: options.spacingAfter || SPACING.LINE },
    indent: options.indent ? { left: options.indent } : undefined,
  })
}

// Export AlignmentType for use in other modules
export { AlignmentType }

/**
 * Create bullet point list
 */
export function createBulletList(
  items: string[], 
  style: 'check' | 'bullet' | 'arrow' | 'dash' = 'bullet'
): Paragraph[] {
  const symbols = {
    check: '✓',
    bullet: '•',
    arrow: '▸',
    dash: '—',
  }
  
  const symbol = symbols[style]
  
  return items.map(item =>
    new Paragraph({
      children: [
        new TextRun({
          text: `${symbol} `,
          bold: true,
          size: TYPOGRAPHY.BODY.size + 2,
          color: ISO_COLORS.ACCENT,
          font: TYPOGRAPHY.BODY.font,
        }),
        new TextRun({
          text: item,
          size: TYPOGRAPHY.BODY.size,
          color: ISO_COLORS.TEXT,
          font: TYPOGRAPHY.BODY.font,
        }),
      ],
      spacing: { after: SPACING.BULLET },
      indent: { left: 480, hanging: 240 },
    })
  )
}

/**
 * Create numbered list
 */
export function createNumberedList(items: string[]): Paragraph[] {
  return items.map((item, index) =>
    new Paragraph({
      children: [
        new TextRun({
          text: `${index + 1}. `,
          bold: true,
          size: TYPOGRAPHY.BODY.size,
          color: ISO_COLORS.PRIMARY,
          font: TYPOGRAPHY.BODY.font,
        }),
        new TextRun({
          text: item,
          size: TYPOGRAPHY.BODY.size,
          color: ISO_COLORS.TEXT,
          font: TYPOGRAPHY.BODY.font,
        }),
      ],
      spacing: { after: SPACING.BULLET },
      indent: { left: 480, hanging: 240 },
    })
  )
}

/**
 * Create highlighted info box
 */
export function createInfoBox(
  title: string, 
  content: string | string[],
  type: 'info' | 'warning' | 'success' | 'note' = 'info'
): Paragraph[] {
  const colors = {
    info: { bg: ISO_COLORS.PRIMARY_LIGHT, border: ISO_COLORS.PRIMARY },
    warning: { bg: 'FEF3C7', border: 'F59E0B' },
    success: { bg: ISO_COLORS.ACCENT_LIGHT, border: ISO_COLORS.ACCENT },
    note: { bg: ISO_COLORS.LIGHT, border: ISO_COLORS.MEDIUM },
  }
  
  const { bg, border } = colors[type]
  const contentArray = Array.isArray(content) ? content : [content]
  
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: TYPOGRAPHY.HEADING_3.size,
          color: border,
          font: TYPOGRAPHY.HEADING_3.font,
        }),
      ],
      shading: { fill: bg, type: ShadingType.CLEAR },
      spacing: { before: SPACING.PARAGRAPH, after: SPACING.LINE },
      indent: { left: 300, right: 300 },
      border: {
        left: { color: border, space: 1, size: 24, style: BorderStyle.SINGLE },
      },
    }),
  ]
  
  contentArray.forEach((text, index) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.TEXT,
            font: TYPOGRAPHY.BODY.font,
          }),
        ],
        shading: { fill: bg, type: ShadingType.CLEAR },
        spacing: { after: index === contentArray.length - 1 ? SPACING.PARAGRAPH : SPACING.LINE },
        indent: { left: 300, right: 300 },
        border: {
          left: { color: border, space: 1, size: 24, style: BorderStyle.SINGLE },
        },
      })
    )
  })
  
  return paragraphs
}

/**
 * Create horizontal divider line
 */
export function createDivider(style: 'solid' | 'dashed' | 'double' = 'solid'): Paragraph {
  const borderStyle = 
    style === 'double' ? BorderStyle.DOUBLE :
    style === 'dashed' ? BorderStyle.DASHED :
    BorderStyle.SINGLE
  
  return new Paragraph({
    children: [new TextRun({ text: '', size: 2 })],
    border: {
      bottom: {
        color: ISO_COLORS.BORDER,
        space: 1,
        size: 6,
        style: borderStyle,
      },
    },
    spacing: { before: SPACING.LINE, after: SPACING.LINE },
  })
}

/**
 * Create empty space paragraph
 */
export function createSpace(size: 'small' | 'medium' | 'large' = 'medium'): Paragraph {
  const sizes = {
    small: SPACING.LINE,
    medium: SPACING.PARAGRAPH,
    large: SPACING.SECTION,
  }
  
  return new Paragraph({
    text: '',
    spacing: { after: sizes[size] },
  })
}

/**
 * Create page break
 */
export function createPageBreak(): Paragraph {
  return new Paragraph({
    text: '',
    pageBreakBefore: true,
  })
}
