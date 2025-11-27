/**
 * PRICING BREAKDOWN - PDF MATCH
 * Matches QuotePDFNew.tsx pricing table exactly
 * 
 * Features:
 * - Table with alternating row colors
 * - Brand-colored header with white text
 * - Brand-colored total row
 * - Professional spacing and alignment
 */

import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  VerticalAlign,
  BorderStyle,
} from 'docx'
import {
  PDF_COLORS,
  PDF_TYPOGRAPHY,
  PDF_SPACING,
  PDF_BORDERS,
  getBrandColor,
  getBrandShading,
  getRowShading,
  formatCurrency,
} from '../templates/pdf-match'
import { createSectionHeader, createSpacer } from './sectionUtils'

export interface LineItem {
  name: string
  description?: string
  category?: string
  quantity: number
  unitPrice: number
  total?: number
}

export interface PricingData {
  lineItems: LineItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  currency?: string
  brandColor?: string
}

export function generatePricingBreakdown(data: PricingData): Paragraph[] {
  const elements: Paragraph[] = []
  const brandColor = getBrandColor(data.brandColor)
  
  // Section Header
  elements.push(createSectionHeader('Pricing Breakdown', brandColor))
  elements.push(createSpacer())
  
  // Line Items Table
  const itemsTable = createLineItemsTable(data.lineItems, brandColor, data.currency)
  elements.push(
    new Paragraph({
      children: [itemsTable as any],
      spacing: { after: PDF_SPACING.SMALL },
    })
  )
  
  // Summary Table
  const summaryTable = createSummaryTable(data, brandColor)
  elements.push(
    new Paragraph({
      children: [summaryTable as any],
      spacing: { after: PDF_SPACING.LARGE },
    })
  )
  
  return elements
}

/**
 * Create line items table with alternating rows
 */
function createLineItemsTable(items: LineItem[], brandColor: string, currency?: string): Table {
  const rows: TableRow[] = []
  
  // Header Row - brand color with white text
  rows.push(
    new TableRow({
      children: [
        createHeaderCell('Item', 35),
        createHeaderCell('Description', 35, brandColor),
        createHeaderCell('Qty', 10, brandColor),
        createHeaderCell('Rate', 10, brandColor),
        createHeaderCell('Total', 10, brandColor),
      ],
      tableHeader: true,
    })
  )
  
  // Data Rows - alternating colors
  items.forEach((item, index) => {
    rows.push(
      new TableRow({
        children: [
          createDataCell(item.name, 35, index),
          createDataCell(item.description || '-', 35, index),
          createDataCell(item.quantity.toString(), 10, index, AlignmentType.CENTER),
          createDataCell(formatCurrency(item.unitPrice, currency), 10, index, AlignmentType.RIGHT),
          createDataCell(formatCurrency(item.total || 0, currency), 10, index, AlignmentType.RIGHT, true),
        ],
      })
    )
  })
  
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: PDF_BORDERS.TABLE,
    rows,
  })
}

/**
 * Create summary table (subtotal, discount, tax, total)
 */
function createSummaryTable(data: PricingData, brandColor: string): Table {
  const rows: TableRow[] = []
  
  // Subtotal
  if (data.subtotal > 0) {
    rows.push(createSummaryRow('Subtotal:', formatCurrency(data.subtotal, data.currency), false, brandColor))
  }
  
  // Discount
  if (data.discount > 0) {
    rows.push(createSummaryRow('Discount:', `-${formatCurrency(data.discount, data.currency)}`, false, brandColor))
  }
  
  // Tax
  if (data.tax > 0) {
    rows.push(createSummaryRow('Tax:', formatCurrency(data.tax, data.currency), false, brandColor))
  }
  
  // Total - brand colored row
  rows.push(createSummaryRow('TOTAL:', formatCurrency(data.total, data.currency), true, brandColor))
  
  return new Table({
    width: { size: 50, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.RIGHT,
    borders: PDF_BORDERS.NONE,
    rows,
  })
}

/**
 * Create header cell with brand color background
 */
function createHeaderCell(text: string, width: number, brandColor?: string): TableCell {
  const color = brandColor || PDF_COLORS.BRAND
  
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text.toUpperCase(),
            size: PDF_TYPOGRAPHY.NORMAL,
            bold: true,
            color: PDF_COLORS.TEXT_PRIMARY,
            font: PDF_TYPOGRAPHY.HEADING,
          }),
        ],
        spacing: { before: PDF_SPACING.SMALL, after: PDF_SPACING.SMALL },
      }),
    ],
    shading: {
      fill: PDF_COLORS.BG_GRAY,
      color: PDF_COLORS.BG_GRAY,
    },
    borders: {
      ...PDF_BORDERS.NONE,
      bottom: {
        style: BorderStyle.SINGLE,
        size: 12,
        color: color,
      },
    },
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
  })
}

/**
 * Create data cell with alternating row colors
 */
function createDataCell(
  text: string,
  width: number,
  rowIndex: number,
  alignment: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.LEFT,
  isBold: boolean = false
): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            size: PDF_TYPOGRAPHY.NORMAL,
            bold: isBold,
            color: PDF_COLORS.TEXT_PRIMARY,
            font: 'Calibri',
          }),
        ],
        alignment,
        spacing: { before: PDF_SPACING.XSMALL, after: PDF_SPACING.XSMALL },
      }),
    ],
    shading: getRowShading(rowIndex),
    borders: {
      ...PDF_BORDERS.NONE,
      bottom: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: PDF_COLORS.BORDER,
      },
    },
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
  })
}

/**
 * Create summary row
 */
function createSummaryRow(label: string, value: string, isTotal: boolean, brandColor: string): TableRow {
  const shading = isTotal ? getBrandShading(brandColor) : undefined
  const textColor = isTotal ? 'FFFFFF' : PDF_COLORS.TEXT_PRIMARY
  const fontSize = isTotal ? PDF_TYPOGRAPHY.H2 : PDF_TYPOGRAPHY.LARGE
  
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                size: isTotal ? PDF_TYPOGRAPHY.H3 : PDF_TYPOGRAPHY.LARGE,
                bold: isTotal,
                color: textColor,
                font: 'Calibri',
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { before: isTotal ? PDF_SPACING.SMALL : PDF_SPACING.TINY, after: isTotal ? PDF_SPACING.SMALL : PDF_SPACING.TINY },
          }),
        ],
        shading,
        borders: PDF_BORDERS.NONE,
        width: { size: 60, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: value,
                size: fontSize,
                bold: true,
                color: textColor,
                font: 'Calibri',
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { before: isTotal ? PDF_SPACING.SMALL : PDF_SPACING.TINY, after: isTotal ? PDF_SPACING.SMALL : PDF_SPACING.TINY },
          }),
        ],
        shading,
        borders: PDF_BORDERS.NONE,
        width: { size: 40, type: WidthType.PERCENTAGE },
      }),
    ],
  })
}
