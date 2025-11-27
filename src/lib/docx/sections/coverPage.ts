/**
 * COVER PAGE SECTION
 * Professional quotation cover page with company branding
 */

import { Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign } from 'docx'
import { ISO_COLORS, TYPOGRAPHY, SPACING, MARGINS, formatCurrency, formatDate } from '../templates/iso-professional'

interface CoverPageData {
  // Company Information
  companyName: string
  companyTagline?: string
  companyLogo?: string
  
  // Quote Information
  quoteNumber: string
  title: string
  createdAt: Date
  validUntil: Date
  total: number
  currency: string
  
  // Client Information
  clientName: string
  clientCompany?: string
}

export function generateCoverPage(data: CoverPageData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  // Top spacing
  elements.push(
    new Paragraph({
      text: '',
      spacing: { before: 1200 },
    })
  )
  
  // Company Name - Large and bold
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.companyName,
          bold: true,
          size: 64,
          color: ISO_COLORS.PRIMARY,
          font: 'Calibri',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    })
  )
  
  // Company Tagline (if provided)
  if (data.companyTagline) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.companyTagline,
            size: 24,
            color: ISO_COLORS.MEDIUM,
            font: 'Calibri',
            italics: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
      })
    )
  }
  
  // Document Type Banner
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'BUSINESS QUOTATION',
          bold: true,
          size: 36,
          color: ISO_COLORS.WHITE,
          font: 'Calibri',
        }),
      ],
      alignment: AlignmentType.CENTER,
      shading: {
        fill: ISO_COLORS.PRIMARY,
        type: ShadingType.CLEAR,
      },
      spacing: { before: 360, after: 360 },
      border: {
        top: { color: ISO_COLORS.ACCENT, space: 1, size: 12, style: BorderStyle.SINGLE },
        bottom: { color: ISO_COLORS.ACCENT, space: 1, size: 12, style: BorderStyle.SINGLE },
      },
    })
  )
  
  // Project Title
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.title,
          bold: true,
          size: 44,
          color: ISO_COLORS.TEXT,
          font: 'Calibri',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 720 },
    })
  )
  
  // Quote Information Table
  const quoteInfoTable = new Table({
    rows: [
      // Quote Number Row
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Quote Number:',
                    bold: true,
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.DARK,
                  }),
                ],
              }),
            ],
            shading: { fill: ISO_COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: MARGINS.TABLE,
            width: { size: 35, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.quoteNumber,
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.TEXT,
                  }),
                ],
              }),
            ],
            margins: MARGINS.TABLE,
            width: { size: 65, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      
      // Issue Date Row
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Issue Date:',
                    bold: true,
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.DARK,
                  }),
                ],
              }),
            ],
            shading: { fill: ISO_COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: MARGINS.TABLE,
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formatDate(data.createdAt),
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.TEXT,
                  }),
                ],
              }),
            ],
            margins: MARGINS.TABLE,
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      
      // Valid Until Row
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Valid Until:',
                    bold: true,
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.DARK,
                  }),
                ],
              }),
            ],
            shading: { fill: ISO_COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: MARGINS.TABLE,
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formatDate(data.validUntil),
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.TEXT,
                  }),
                ],
              }),
            ],
            margins: MARGINS.TABLE,
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      
      // Prepared For Row
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Prepared For:',
                    bold: true,
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.DARK,
                  }),
                ],
              }),
            ],
            shading: { fill: ISO_COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: MARGINS.TABLE,
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.clientCompany 
                      ? `${data.clientName} (${data.clientCompany})`
                      : data.clientName,
                    size: TYPOGRAPHY.BODY.size,
                    color: ISO_COLORS.TEXT,
                  }),
                ],
              }),
            ],
            margins: MARGINS.TABLE,
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      
      // Total Investment Row - Highlighted
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Total Investment:',
                    bold: true,
                    size: TYPOGRAPHY.HEADING_3.size,
                    color: ISO_COLORS.WHITE,
                  }),
                ],
              }),
            ],
            shading: { fill: ISO_COLORS.ACCENT, type: ShadingType.CLEAR },
            margins: { top: 240, bottom: 240, left: 200, right: 200 },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formatCurrency(data.total, data.currency),
                    bold: true,
                    size: 36,
                    color: ISO_COLORS.ACCENT,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
            margins: { top: 240, bottom: 240, left: 200, right: 200 },
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
    ],
    width: { size: 75, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      left: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      right: { style: BorderStyle.SINGLE, size: 8, color: ISO_COLORS.PRIMARY },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: ISO_COLORS.BORDER },
      insideVertical: { style: BorderStyle.NONE },
    },
  })
  
  elements.push(
    new Paragraph({ spacing: { before: 360 } }),
    quoteInfoTable,
    new Paragraph({ spacing: { after: 480 } })
  )
  
  // Confidentiality Notice
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'CONFIDENTIAL BUSINESS PROPOSAL',
          bold: true,
          size: TYPOGRAPHY.SMALL.size,
          color: ISO_COLORS.MEDIUM,
          font: 'Calibri',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 720, after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'This document contains confidential and proprietary information. ',
          size: TYPOGRAPHY.SMALL.size,
          color: ISO_COLORS.MEDIUM,
          font: 'Calibri',
        }),
        new TextRun({
          text: 'Unauthorized disclosure is prohibited.',
          size: TYPOGRAPHY.SMALL.size,
          color: ISO_COLORS.MEDIUM,
          font: 'Calibri',
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    })
  )
  
  // Page break after cover
  elements.push(
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  )
  
  return elements
}
