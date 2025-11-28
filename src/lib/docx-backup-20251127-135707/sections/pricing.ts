/**
 * PRICING BREAKDOWN SECTION
 * Comprehensive pricing with categories, line items, and totals
 */

import { Paragraph, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign, TextRun } from 'docx'
import { ISO_COLORS, TYPOGRAPHY, MARGINS, formatCurrency, formatPercentage, createSectionHeader, createSubsectionHeader, createSpace, createBodyParagraph } from '../templates/iso-professional'

interface LineItem {
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

interface PricingData {
  lineItems: LineItem[]
  currency: string
  subtotal: number
  discountType?: 'fixed' | 'percentage'
  discountValue?: number
  discount: number
  taxRate?: number
  tax: number
  total: number
  notes?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  development: 'Software Development',
  design: 'Design Services',
  infrastructure: 'Infrastructure & Hosting',
  maintenance: 'Maintenance & Support',
  consulting: 'Consulting Services',
  hosting: 'Hosting & Domain Services',
  custom: 'Additional Services',
}

const CATEGORY_ICONS: Record<string, string> = {
  development: '💻',
  design: '🎨',
  infrastructure: '🏗️',
  maintenance: '🔧',
  consulting: '💡',
  hosting: '☁️',
  custom: '⚙️',
}

export function generatePricingBreakdown(data: PricingData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  // Section Header
  elements.push(createSectionHeader('Investment Breakdown', '💰'))
  
  // Introduction
  elements.push(
    createBodyParagraph(
      'The following detailed breakdown outlines all costs associated with this project. All amounts are quoted in ' + data.currency + '.',
      { italic: true, spacingAfter: 360 }
    )
  )
  
  // Group items by category
  const groupedItems = groupItemsByCategory(data.lineItems)
  
  // Generate tables for each category
  Object.entries(groupedItems).forEach(([category, items], index) => {
    const categoryLabel = CATEGORY_LABELS[category] || 'Services'
    const categoryIcon = CATEGORY_ICONS[category] || '📦'
    
    // Category Subsection
    elements.push(
      createSubsectionHeader(`${categoryIcon} ${categoryLabel}`)
    )
    
    // Create pricing table for this category
    const categoryTable = createCategoryPricingTable(items, data.currency)
    elements.push(categoryTable, createSpace())
  })
  
  // Summary Totals Table
  elements.push(
    createSpace('large'),
    createSubsectionHeader('Investment Summary')
  )
  
  const summaryTable = createSummaryTable(data)
  elements.push(summaryTable)
  
  // Pricing Notes
  if (data.notes) {
    elements.push(
      createSpace(),
      createBodyParagraph('Note: ' + data.notes, {
        italic: true,
        spacingAfter: 240,
      })
    )
  }
  
  // Payment Note
  elements.push(
    createSpace(),
    createBodyParagraph(
      'All prices are valid for the period specified on the cover page. Prices are subject to change after expiration.',
      { italic: true, color: ISO_COLORS.MEDIUM, spacingAfter: 240 }
    )
  )
  
  return elements
}

function groupItemsByCategory(items: LineItem[]): Record<string, LineItem[]> {
  const grouped: Record<string, LineItem[]> = {}
  
  items.forEach(item => {
    const category = item.category || 'custom'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(item)
  })
  
  return grouped
}

function createCategoryPricingTable(items: LineItem[], currency: string): Table {
  const headerRow = new TableRow({
    children: [
      createTableHeader('Service', 30),
      createTableHeader('Description', 35),
      createTableHeader('Qty/Hrs', 12, AlignmentType.CENTER),
      createTableHeader('Unit Price', 13, AlignmentType.RIGHT),
      createTableHeader('Total', 10, AlignmentType.RIGHT),
    ],
    tableHeader: true,
  })
  
  const dataRows = items.map((item, index) => {
    const itemTotal = (item.total !== undefined) 
      ? item.total 
      : (item.quantity || 0) * (item.unitPrice || 0)
    
    return new TableRow({
      children: [
        // Service Name
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.name,
                  bold: true,
                  size: TYPOGRAPHY.BODY.size,
                  color: ISO_COLORS.TEXT,
                }),
              ],
            }),
          ],
          shading: { 
            fill: index % 2 === 0 ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
            type: ShadingType.CLEAR 
          },
          margins: MARGINS.CELL_TIGHT,
          verticalAlign: VerticalAlign.TOP,
          width: { size: 30, type: WidthType.PERCENTAGE },
        }),
        
        // Description
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.description || '',
                  size: TYPOGRAPHY.SMALL.size,
                  color: ISO_COLORS.MEDIUM,
                }),
              ],
            }),
          ],
          shading: { 
            fill: index % 2 === 0 ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
            type: ShadingType.CLEAR 
          },
          margins: MARGINS.CELL_TIGHT,
          verticalAlign: VerticalAlign.TOP,
          width: { size: 35, type: WidthType.PERCENTAGE },
        }),
        
        // Quantity
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: String(item.quantity || 0),
                  size: TYPOGRAPHY.BODY.size,
                  color: ISO_COLORS.TEXT,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { 
            fill: index % 2 === 0 ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
            type: ShadingType.CLEAR 
          },
          margins: MARGINS.CELL_TIGHT,
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 12, type: WidthType.PERCENTAGE },
        }),
        
        // Unit Price
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: formatCurrency(item.unitPrice || 0, currency),
                  size: TYPOGRAPHY.BODY.size,
                  color: ISO_COLORS.TEXT,
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
          shading: { 
            fill: index % 2 === 0 ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
            type: ShadingType.CLEAR 
          },
          margins: MARGINS.CELL_TIGHT,
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 13, type: WidthType.PERCENTAGE },
        }),
        
        // Total
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: formatCurrency(itemTotal, currency),
                  bold: true,
                  size: TYPOGRAPHY.BODY.size,
                  color: ISO_COLORS.PRIMARY,
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
          shading: { 
            fill: index % 2 === 0 ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
            type: ShadingType.CLEAR 
          },
          margins: MARGINS.CELL_TIGHT,
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 10, type: WidthType.PERCENTAGE },
        }),
      ],
    })
  })
  
  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: ISO_COLORS.PRIMARY },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: ISO_COLORS.PRIMARY },
      left: { style: BorderStyle.SINGLE, size: 6, color: ISO_COLORS.PRIMARY },
      right: { style: BorderStyle.SINGLE, size: 6, color: ISO_COLORS.PRIMARY },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 3, color: ISO_COLORS.BORDER },
      insideVertical: { style: BorderStyle.SINGLE, size: 3, color: ISO_COLORS.BORDER },
    },
  })
}

function createTableHeader(text: string, width: number, alignment: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.LEFT): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            size: TYPOGRAPHY.BODY.size,
            color: ISO_COLORS.WHITE,
          }),
        ],
        alignment,
      }),
    ],
    shading: { fill: ISO_COLORS.PRIMARY, type: ShadingType.CLEAR },
    margins: MARGINS.TABLE,
    verticalAlign: VerticalAlign.CENTER,
    width: { size: width, type: WidthType.PERCENTAGE },
  })
}

function createSummaryTable(data: PricingData): Table {
  const rows: TableRow[] = []
  
  // Subtotal Row
  rows.push(
    createSummaryRow('Subtotal', formatCurrency(data.subtotal, data.currency), false)
  )
  
  // Discount Row (if applicable)
  if (data.discount > 0) {
    const discountLabel = data.discountType === 'percentage' && data.discountValue
      ? `Discount (${formatPercentage(data.discountValue)})`
      : 'Discount'
    
    rows.push(
      createSummaryRow(
        discountLabel, 
        '-' + formatCurrency(data.discount, data.currency), 
        false,
        ISO_COLORS.ACCENT
      )
    )
  }
  
  // Tax Row (if applicable)
  if (data.tax > 0) {
    const taxLabel = data.taxRate
      ? `Tax (${formatPercentage(data.taxRate)})`
      : 'Tax'
    
    rows.push(
      createSummaryRow(taxLabel, formatCurrency(data.tax, data.currency), false)
    )
  }
  
  // Total Row (highlighted)
  rows.push(
    createSummaryRow('TOTAL INVESTMENT', formatCurrency(data.total, data.currency), true)
  )
  
  return new Table({
    rows,
    width: { size: 60, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.RIGHT,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      bottom: { style: BorderStyle.DOUBLE, size: 12, color: ISO_COLORS.PRIMARY },
      left: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      right: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: ISO_COLORS.BORDER },
      insideVertical: { style: BorderStyle.NONE },
    },
  })
}

function createSummaryRow(label: string, value: string, isTotal: boolean, valueColor?: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: isTotal,
                size: isTotal ? TYPOGRAPHY.HEADING_3.size : TYPOGRAPHY.BODY.size,
                color: isTotal ? ISO_COLORS.WHITE : ISO_COLORS.DARK,
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ],
        shading: { 
          fill: isTotal ? ISO_COLORS.ACCENT : ISO_COLORS.LIGHT, 
          type: ShadingType.CLEAR 
        },
        margins: isTotal 
          ? { top: 240, bottom: 240, left: 200, right: 200 }
          : MARGINS.TABLE,
        verticalAlign: VerticalAlign.CENTER,
        width: { size: 60, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: value,
                bold: true,
                size: isTotal ? 36 : TYPOGRAPHY.HEADING_3.size,
                color: valueColor || (isTotal ? ISO_COLORS.ACCENT : ISO_COLORS.TEXT),
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ],
        shading: { 
          fill: isTotal ? ISO_COLORS.WHITE : ISO_COLORS.LIGHT, 
          type: ShadingType.CLEAR 
        },
        margins: isTotal 
          ? { top: 240, bottom: 240, left: 200, right: 200 }
          : MARGINS.TABLE,
        verticalAlign: VerticalAlign.CENTER,
        width: { size: 40, type: WidthType.PERCENTAGE },
        borders: isTotal ? {
          top: { style: BorderStyle.DOUBLE, size: 12, color: ISO_COLORS.PRIMARY },
          bottom: { style: BorderStyle.DOUBLE, size: 12, color: ISO_COLORS.PRIMARY },
        } : undefined,
      }),
    ],
  })
}
