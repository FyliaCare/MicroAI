/**
 * COVER PAGE - PDF MATCH
 * Exactly matches QuotePDFNew.tsx cover page styling
 * 
 * Features:
 * - Full-page brand color background
 * - White centered text
 * - Semi-transparent details box
 * - Professional layout
 */

import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  PageBreak,
} from 'docx'
import {
  PDF_COLORS,
  PDF_TYPOGRAPHY,
  PDF_SPACING,
  PDF_BORDERS,
  getBrandColor,
  getBrandShading,
  formatCurrency,
  formatDate,
} from '../templates/pdf-match'

export interface CoverPageData {
  // Quote Info
  quoteNumber: string
  title: string
  createdAt: Date | string
  validUntil: Date | string
  total: number
  currency?: string
  
  // Client Info
  clientName: string
  clientCompany?: string
  
  // Company Info
  companyName?: string
  companyTagline?: string
  companyEmail?: string
  companyPhone?: string
  companyWebsite?: string
  customMessage?: string
  
  // Branding
  brandColor?: string
}

export function generateCoverPage(data: CoverPageData): Paragraph[] {
  const elements: Paragraph[] = []
  const brandColor = getBrandColor(data.brandColor)
  
  // Full page with brand color background
  // Top spacer
  elements.push(
    new Paragraph({
      text: '',
      spacing: { before: PDF_SPACING.XLARGE * 4 },
      shading: getBrandShading(brandColor),
    })
  )
  
  // Main title - "QUOTATION"
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'QUOTATION',
          size: PDF_TYPOGRAPHY.TITLE,
          bold: true,
          color: 'FFFFFF',
          font: PDF_TYPOGRAPHY.HEADING,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: PDF_SPACING.MEDIUM },
      shading: getBrandShading(brandColor),
    })
  )
  
  // Project Title
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.title,
          size: PDF_TYPOGRAPHY.SUBTITLE,
          color: 'FFFFFF',
          font: PDF_TYPOGRAPHY.HEADING,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: PDF_SPACING.XLARGE },
      shading: getBrandShading(brandColor),
    })
  )
  
  // Quote Details Table - semi-transparent white box effect
  const detailsTable = createDetailsTable(data, brandColor)
  elements.push(
    new Paragraph({
      children: [detailsTable as any],
      alignment: AlignmentType.CENTER,
      spacing: { after: PDF_SPACING.XLARGE },
      shading: getBrandShading(brandColor),
    })
  )
  
  // Custom message
  if (data.customMessage || data.companyTagline) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.customMessage || data.companyTagline || '',
            size: PDF_TYPOGRAPHY.H2,
            color: 'FFFFFF',
            font: 'Calibri',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PDF_SPACING.XLARGE },
        shading: getBrandShading(brandColor),
      })
    )
  }
  
  // Bottom spacer
  elements.push(
    new Paragraph({
      text: '',
      spacing: { before: PDF_SPACING.XLARGE * 3 },
      shading: getBrandShading(brandColor),
    })
  )
  
  // Company info footer
  const companyInfo = [
    data.companyName || 'MicroAI Systems',
    data.companyEmail || 'contact@microai.systems',
    data.companyPhone || '+1 (555) 123-4567',
  ].filter(Boolean).join(' • ')
  
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: companyInfo,
          size: PDF_TYPOGRAPHY.LARGE,
          color: 'FFFFFF',
          font: 'Calibri',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: PDF_SPACING.LARGE },
      shading: getBrandShading(brandColor),
    })
  )
  
  // Page break
  elements.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  )
  
  return elements
}

/**
 * Create the quote details table with white borders
 */
function createDetailsTable(data: CoverPageData, brandColor: string): Table {
  return new Table({
    width: { size: 70, type: WidthType.PERCENTAGE },
    borders: PDF_BORDERS.COVER_BOX,
    rows: [
      createDetailRow('Quote Number:', data.quoteNumber, brandColor),
      createDetailRow('Date:', formatDate(data.createdAt, 'long'), brandColor),
      createDetailRow('Valid Until:', formatDate(data.validUntil, 'long'), brandColor),
      createDetailRow('Prepared For:', data.clientName, brandColor),
      createDetailRow('Total:', formatCurrency(data.total, data.currency), brandColor, true),
    ],
  })
}

/**
 * Create a detail row with white text on brand color
 */
function createDetailRow(
  label: string,
  value: string,
  brandColor: string,
  isHighlight: boolean = false
): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                size: isHighlight ? PDF_TYPOGRAPHY.H3 : PDF_TYPOGRAPHY.LARGE,
                color: 'FFFFFF',
                bold: isHighlight,
                font: 'Calibri',
              }),
            ],
            spacing: { before: PDF_SPACING.SMALL, after: PDF_SPACING.SMALL },
          }),
        ],
        shading: getBrandShading(brandColor),
        borders: PDF_BORDERS.NONE,
        width: { size: 40, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: value,
                size: isHighlight ? PDF_TYPOGRAPHY.H1 : PDF_TYPOGRAPHY.LARGE,
                color: 'FFFFFF',
                bold: true,
                font: 'Calibri',
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { before: PDF_SPACING.SMALL, after: PDF_SPACING.SMALL },
          }),
        ],
        shading: getBrandShading(brandColor),
        borders: PDF_BORDERS.NONE,
        width: { size: 60, type: WidthType.PERCENTAGE },
      }),
    ],
  })
}
