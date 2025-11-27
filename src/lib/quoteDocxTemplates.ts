import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  AlignmentType, 
  WidthType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  UnderlineType,
} from 'docx'

// Quote Data Interface
interface QuoteData {
  id: string
  quoteNumber: string
  title: string
  description?: string
  status: string
  total: number
  subtotal?: number
  tax?: number
  taxRate?: number
  discount?: number
  currency?: string
  validUntil: Date
  createdAt: Date
  startDate?: Date
  
  clientName: string
  clientEmail: string
  clientCompany?: string
  clientPhone?: string
  clientAddress?: string
  
  companyName?: string
  companyAddress?: string
  companyEmail?: string
  companyPhone?: string
  companyWebsite?: string
  
  executiveSummary?: string
  projectType?: string
  scopeItems?: string[]
  deliverables?: string[]
  exclusions?: string[]
  assumptions?: string[]
  objectives?: string[]
  
  estimatedDuration?: string
  timeline?: string
  milestones?: any[]
  
  lineItems?: any[]
  
  paymentSchedule?: any[]
  depositAmount?: number
  depositPercentage?: number
  paymentTermsText?: string
  
  supportPeriod?: string
  maintenanceIncluded?: boolean
  revisionsIncluded?: number
  confidentiality?: string
  intellectualProperty?: string
  termsAndConditions?: string
  notes?: string
}

// Template type
export type TemplateType = 'modern-corporate' | 'minimalist-clean' | 'vibrant-gradient'

// ==================== MODERN CORPORATE TEMPLATE ====================
// Professional blue theme with clean lines
const MODERN_CORPORATE_COLORS = {
  PRIMARY: '0047AB', // Royal Blue
  PRIMARY_LIGHT: 'E3F2FD', // Light Blue
  ACCENT: '00BCD4', // Cyan
  DARK: '263238', // Blue Gray Dark
  MEDIUM: '546E7A', // Blue Gray Medium
  LIGHT: 'ECEFF1', // Blue Gray Light
  WHITE: 'FFFFFF',
  TEXT: '212121', // Dark Gray
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    GHS: 'GH₵',
  }
  const symbol = symbols[currency] || currency
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function generateModernCorporateTemplate(quote: QuoteData): Promise<Buffer> {
  const currency = quote.currency || 'USD'
  const lineItems = quote.lineItems || []
  const milestones = quote.milestones || []
  const paymentSchedule = quote.paymentSchedule || []
  const scopeItems = quote.scopeItems || []
  const deliverables = quote.deliverables || []
  
  const sections: (Paragraph | Table)[] = []
  
  // Cover Page
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: quote.companyName || 'MicroAI Systems',
          bold: true,
          size: 64,
          color: MODERN_CORPORATE_COLORS.PRIMARY,
          font: 'Arial',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 480 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: 'BUSINESS PROPOSAL',
          bold: true,
          size: 32,
          color: MODERN_CORPORATE_COLORS.WHITE,
          font: 'Arial',
        }),
      ],
      alignment: AlignmentType.CENTER,
      shading: { fill: MODERN_CORPORATE_COLORS.PRIMARY, type: ShadingType.CLEAR },
      spacing: { before: 240, after: 240 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: quote.title,
          bold: true,
          size: 40,
          color: MODERN_CORPORATE_COLORS.TEXT,
          font: 'Arial',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 960 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: `Quote #${quote.quoteNumber}`,
          size: 24,
          color: MODERN_CORPORATE_COLORS.MEDIUM,
          font: 'Arial',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: formatDate(quote.createdAt),
          size: 22,
          color: MODERN_CORPORATE_COLORS.MEDIUM,
          font: 'Arial',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 960 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: 'TOTAL INVESTMENT',
          bold: true,
          size: 20,
          color: MODERN_CORPORATE_COLORS.MEDIUM,
          font: 'Arial',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: formatCurrency(quote.total, currency),
          bold: true,
          size: 48,
          color: MODERN_CORPORATE_COLORS.ACCENT,
          font: 'Arial',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    }),
    
    new Paragraph({ text: '', pageBreakBefore: true }),
  )
  
  // Client Information
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'CLIENT INFORMATION',
          bold: true,
          size: 28,
          color: MODERN_CORPORATE_COLORS.PRIMARY,
          font: 'Arial',
        }),
      ],
      spacing: { before: 240, after: 240 },
      border: {
        bottom: { color: MODERN_CORPORATE_COLORS.PRIMARY, space: 1, size: 12, style: BorderStyle.SINGLE },
      },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: 'Client: ',
          bold: true,
          size: 22,
          color: MODERN_CORPORATE_COLORS.DARK,
          font: 'Arial',
        }),
        new TextRun({
          text: quote.clientName,
          size: 22,
          color: MODERN_CORPORATE_COLORS.TEXT,
          font: 'Arial',
        }),
      ],
      spacing: { after: 120 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: 'Email: ',
          bold: true,
          size: 22,
          color: MODERN_CORPORATE_COLORS.DARK,
          font: 'Arial',
        }),
        new TextRun({
          text: quote.clientEmail,
          size: 22,
          color: MODERN_CORPORATE_COLORS.TEXT,
          font: 'Arial',
        }),
      ],
      spacing: { after: 240 },
    }),
  )
  
  if (quote.clientCompany) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Company: ',
            bold: true,
            size: 22,
            color: MODERN_CORPORATE_COLORS.DARK,
            font: 'Arial',
          }),
          new TextRun({
            text: quote.clientCompany,
            size: 22,
            color: MODERN_CORPORATE_COLORS.TEXT,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      })
    )
  }
  
  // Executive Summary
  if (quote.executiveSummary) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'EXECUTIVE SUMMARY',
            bold: true,
            size: 28,
            color: MODERN_CORPORATE_COLORS.PRIMARY,
            font: 'Arial',
          }),
        ],
        spacing: { before: 480, after: 240 },
        border: {
          bottom: { color: MODERN_CORPORATE_COLORS.PRIMARY, space: 1, size: 12, style: BorderStyle.SINGLE },
        },
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: quote.executiveSummary,
            size: 22,
            color: MODERN_CORPORATE_COLORS.TEXT,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
        alignment: AlignmentType.JUSTIFIED,
      }),
    )
  }
  
  // Scope of Work
  if (scopeItems.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'SCOPE OF WORK',
            bold: true,
            size: 28,
            color: MODERN_CORPORATE_COLORS.PRIMARY,
            font: 'Arial',
          }),
        ],
        spacing: { before: 480, after: 240 },
        border: {
          bottom: { color: MODERN_CORPORATE_COLORS.PRIMARY, space: 1, size: 12, style: BorderStyle.SINGLE },
        },
      }),
    )
    
    scopeItems.forEach(item => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '▸ ',
              size: 24,
              color: MODERN_CORPORATE_COLORS.ACCENT,
              font: 'Arial',
            }),
            new TextRun({
              text: item,
              size: 22,
              color: MODERN_CORPORATE_COLORS.TEXT,
              font: 'Arial',
            }),
          ],
          spacing: { after: 120 },
          indent: { left: 360 },
        })
      )
    })
  }
  
  sections.push(new Paragraph({ text: '', pageBreakBefore: true }))
  
  // Investment Breakdown
  if (lineItems.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'INVESTMENT BREAKDOWN',
            bold: true,
            size: 28,
            color: MODERN_CORPORATE_COLORS.PRIMARY,
            font: 'Arial',
          }),
        ],
        spacing: { before: 240, after: 240 },
        border: {
          bottom: { color: MODERN_CORPORATE_COLORS.PRIMARY, space: 1, size: 12, style: BorderStyle.SINGLE },
        },
      }),
    )
    
    const headerRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Service',
                  bold: true,
                  size: 22,
                  color: MODERN_CORPORATE_COLORS.WHITE,
                  font: 'Arial',
                }),
              ],
            }),
          ],
          shading: { fill: MODERN_CORPORATE_COLORS.PRIMARY, type: ShadingType.CLEAR },
          margins: { top: 150, bottom: 150, left: 150, right: 150 },
          width: { size: 30, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Description',
                  bold: true,
                  size: 22,
                  color: MODERN_CORPORATE_COLORS.WHITE,
                  font: 'Arial',
                }),
              ],
            }),
          ],
          shading: { fill: MODERN_CORPORATE_COLORS.PRIMARY, type: ShadingType.CLEAR },
          margins: { top: 150, bottom: 150, left: 150, right: 150 },
          width: { size: 40, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Hours',
                  bold: true,
                  size: 22,
                  color: MODERN_CORPORATE_COLORS.WHITE,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: MODERN_CORPORATE_COLORS.PRIMARY, type: ShadingType.CLEAR },
          margins: { top: 150, bottom: 150, left: 150, right: 150 },
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Amount',
                  bold: true,
                  size: 22,
                  color: MODERN_CORPORATE_COLORS.WHITE,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
          shading: { fill: MODERN_CORPORATE_COLORS.PRIMARY, type: ShadingType.CLEAR },
          margins: { top: 150, bottom: 150, left: 150, right: 150 },
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
      ],
      tableHeader: true,
    })
    
    const dataRows = lineItems.map((item: any, index: number) => 
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.name || 'Service',
                    size: 20,
                    color: MODERN_CORPORATE_COLORS.TEXT,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
            shading: { fill: index % 2 === 0 ? MODERN_CORPORATE_COLORS.WHITE : MODERN_CORPORATE_COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.description || '',
                    size: 20,
                    color: MODERN_CORPORATE_COLORS.TEXT,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
            shading: { fill: index % 2 === 0 ? MODERN_CORPORATE_COLORS.WHITE : MODERN_CORPORATE_COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${item.quantity || 0}`,
                    size: 20,
                    color: MODERN_CORPORATE_COLORS.TEXT,
                    font: 'Arial',
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            shading: { fill: index % 2 === 0 ? MODERN_CORPORATE_COLORS.WHITE : MODERN_CORPORATE_COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formatCurrency((item.quantity || 0) * (item.unitPrice || 0), currency),
                    size: 20,
                    color: MODERN_CORPORATE_COLORS.TEXT,
                    font: 'Arial',
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
            shading: { fill: index % 2 === 0 ? MODERN_CORPORATE_COLORS.WHITE : MODERN_CORPORATE_COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
          }),
        ],
      })
    )
    
    const pricingTable = new Table({
      rows: [headerRow, ...dataRows],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: MODERN_CORPORATE_COLORS.PRIMARY },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: MODERN_CORPORATE_COLORS.PRIMARY },
        left: { style: BorderStyle.SINGLE, size: 6, color: MODERN_CORPORATE_COLORS.PRIMARY },
        right: { style: BorderStyle.SINGLE, size: 6, color: MODERN_CORPORATE_COLORS.PRIMARY },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 3, color: MODERN_CORPORATE_COLORS.LIGHT },
        insideVertical: { style: BorderStyle.SINGLE, size: 3, color: MODERN_CORPORATE_COLORS.LIGHT },
      },
    })
    
    sections.push(pricingTable)
    
    // Total
    sections.push(
      new Paragraph({ spacing: { before: 360 } }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'TOTAL: ',
            bold: true,
            size: 32,
            color: MODERN_CORPORATE_COLORS.PRIMARY,
            font: 'Arial',
          }),
          new TextRun({
            text: formatCurrency(quote.total, currency),
            bold: true,
            size: 36,
            color: MODERN_CORPORATE_COLORS.ACCENT,
            font: 'Arial',
          }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { before: 240 },
      }),
    )
  }
  
  // Terms & Conditions
  sections.push(
    new Paragraph({ text: '', pageBreakBefore: true }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'TERMS & CONDITIONS',
          bold: true,
          size: 28,
          color: MODERN_CORPORATE_COLORS.PRIMARY,
          font: 'Arial',
        }),
      ],
      spacing: { before: 240, after: 240 },
      border: {
        bottom: { color: MODERN_CORPORATE_COLORS.PRIMARY, space: 1, size: 12, style: BorderStyle.SINGLE },
      },
    }),
  )
  
  if (quote.termsAndConditions) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: quote.termsAndConditions,
            size: 22,
            color: MODERN_CORPORATE_COLORS.TEXT,
            font: 'Arial',
          }),
        ],
        spacing: { after: 480 },
        alignment: AlignmentType.JUSTIFIED,
      }),
    )
  }
  
  // Signature Section
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'ACCEPTANCE',
          bold: true,
          size: 24,
          color: MODERN_CORPORATE_COLORS.PRIMARY,
          font: 'Arial',
        }),
      ],
      spacing: { before: 480, after: 240 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: 'Client Signature: _____________________________     Date: _______________',
          size: 22,
          color: MODERN_CORPORATE_COLORS.TEXT,
          font: 'Arial',
        }),
      ],
      spacing: { before: 360 },
    }),
  )
  
  // Footer
  sections.push(
    new Paragraph({ spacing: { before: 960 } }),
    new Paragraph({
      children: [
        new TextRun({
          text: quote.companyName || 'MicroAI Systems',
          bold: true,
          size: 18,
          color: MODERN_CORPORATE_COLORS.PRIMARY,
          font: 'Arial',
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  )
  
  if (quote.companyEmail || quote.companyPhone) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: [quote.companyEmail, quote.companyPhone].filter(Boolean).join(' • '),
            size: 16,
            color: MODERN_CORPORATE_COLORS.MEDIUM,
            font: 'Arial',
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    )
  }
  
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: sections,
    }],
  })
  
  return await Packer.toBuffer(doc)
}

// ==================== MINIMALIST CLEAN TEMPLATE ====================
// Clean and simple design with yellow/blue accents
const MINIMALIST_COLORS = {
  PRIMARY: '1E88E5', // Blue
  PRIMARY_LIGHT: 'E3F2FD',
  ACCENT: 'FFC107', // Amber Yellow
  DARK: '424242',
  MEDIUM: '757575',
  LIGHT: 'FAFAFA',
  WHITE: 'FFFFFF',
  TEXT: '212121',
}

async function generateMinimalistCleanTemplate(quote: QuoteData): Promise<Buffer> {
  const currency = quote.currency || 'USD'
  const lineItems = quote.lineItems || []
  const scopeItems = quote.scopeItems || []
  
  const sections: (Paragraph | Table)[] = []
  
  // Minimalist Cover
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: quote.title,
          bold: true,
          size: 56,
          color: MINIMALIST_COLORS.TEXT,
          font: 'Helvetica',
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { before: 2400, after: 240 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: 'Quote Proposal',
          size: 24,
          color: MINIMALIST_COLORS.MEDIUM,
          font: 'Helvetica',
        }),
      ],
      spacing: { after: 960 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: quote.quoteNumber,
          size: 28,
          color: MINIMALIST_COLORS.PRIMARY,
          font: 'Helvetica',
        }),
      ],
      spacing: { after: 120 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: formatDate(quote.createdAt),
          size: 20,
          color: MINIMALIST_COLORS.MEDIUM,
          font: 'Helvetica',
        }),
      ],
      spacing: { after: 1440 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: formatCurrency(quote.total, currency),
          bold: true,
          size: 64,
          color: MINIMALIST_COLORS.ACCENT,
          font: 'Helvetica',
        }),
      ],
      spacing: { after: 240 },
    }),
    
    new Paragraph({ text: '', pageBreakBefore: true }),
  )
  
  // Client Info - Minimalist Style
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'For',
          size: 20,
          color: MINIMALIST_COLORS.MEDIUM,
          font: 'Helvetica',
        }),
      ],
      spacing: { after: 120 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: quote.clientName,
          bold: true,
          size: 32,
          color: MINIMALIST_COLORS.TEXT,
          font: 'Helvetica',
        }),
      ],
      spacing: { after: 120 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: quote.clientEmail,
          size: 20,
          color: MINIMALIST_COLORS.PRIMARY,
          font: 'Helvetica',
        }),
      ],
      spacing: { after: 480 },
    }),
  )
  
  // Executive Summary
  if (quote.executiveSummary) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Overview',
            bold: true,
            size: 28,
            color: MINIMALIST_COLORS.TEXT,
            font: 'Helvetica',
          }),
        ],
        spacing: { before: 480, after: 240 },
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: quote.executiveSummary,
            size: 22,
            color: MINIMALIST_COLORS.TEXT,
            font: 'Helvetica',
          }),
        ],
        spacing: { after: 480 },
        alignment: AlignmentType.JUSTIFIED,
      }),
    )
  }
  
  // Scope - Clean bullets
  if (scopeItems.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'What\'s Included',
            bold: true,
            size: 28,
            color: MINIMALIST_COLORS.TEXT,
            font: 'Helvetica',
          }),
        ],
        spacing: { before: 480, after: 240 },
      }),
    )
    
    scopeItems.forEach(item => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '—  ',
              size: 22,
              color: MINIMALIST_COLORS.ACCENT,
              font: 'Helvetica',
            }),
            new TextRun({
              text: item,
              size: 22,
              color: MINIMALIST_COLORS.TEXT,
              font: 'Helvetica',
            }),
          ],
          spacing: { after: 180 },
          indent: { left: 240 },
        })
      )
    })
  }
  
  sections.push(new Paragraph({ text: '', pageBreakBefore: true }))
  
  // Simple Pricing Table
  if (lineItems.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Investment',
            bold: true,
            size: 28,
            color: MINIMALIST_COLORS.TEXT,
            font: 'Helvetica',
          }),
        ],
        spacing: { before: 240, after: 360 },
      }),
    )
    
    lineItems.forEach((item: any, index: number) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: item.name || 'Service',
              bold: true,
              size: 22,
              color: MINIMALIST_COLORS.TEXT,
              font: 'Helvetica',
            }),
          ],
          spacing: { before: 240, after: 60 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: item.description || '',
              size: 20,
              color: MINIMALIST_COLORS.MEDIUM,
              font: 'Helvetica',
            }),
          ],
          spacing: { after: 60 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: formatCurrency((item.quantity || 0) * (item.unitPrice || 0), currency),
              bold: true,
              size: 24,
              color: MINIMALIST_COLORS.PRIMARY,
              font: 'Helvetica',
            }),
          ],
          spacing: { after: 240 },
        }),
      )
      
      if (index < lineItems.length - 1) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '─'.repeat(50),
                size: 16,
                color: MINIMALIST_COLORS.LIGHT,
                font: 'Helvetica',
              }),
            ],
            spacing: { after: 120 },
          })
        )
      }
    })
    
    // Total with accent bar
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '═'.repeat(50),
            size: 16,
            color: MINIMALIST_COLORS.ACCENT,
            font: 'Helvetica',
          }),
        ],
        spacing: { before: 360, after: 240 },
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: 'Total',
            bold: true,
            size: 28,
            color: MINIMALIST_COLORS.TEXT,
            font: 'Helvetica',
          }),
        ],
        spacing: { after: 120 },
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: formatCurrency(quote.total, currency),
            bold: true,
            size: 48,
            color: MINIMALIST_COLORS.ACCENT,
            font: 'Helvetica',
          }),
        ],
        spacing: { after: 480 },
      }),
    )
  }
  
  // Simple Footer
  sections.push(
    new Paragraph({ spacing: { before: 1440 } }),
    new Paragraph({
      children: [
        new TextRun({
          text: quote.companyName || 'MicroAI Systems',
          size: 18,
          color: MINIMALIST_COLORS.MEDIUM,
          font: 'Helvetica',
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  )
  
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: sections,
    }],
  })
  
  return await Packer.toBuffer(doc)
}

// ==================== VIBRANT GRADIENT TEMPLATE ====================
// Bold purple to green gradient theme
const VIBRANT_COLORS = {
  PRIMARY: '667EEA', // Purple
  PRIMARY_DARK: '764BA2', // Deep Purple
  ACCENT: '10B981', // Green
  ACCENT_LIGHT: '34D399',
  DARK: '1F2937',
  MEDIUM: '6B7280',
  LIGHT: 'F3F4F6',
  WHITE: 'FFFFFF',
  TEXT: '111827',
}

async function generateVibrantGradientTemplate(quote: QuoteData): Promise<Buffer> {
  const currency = quote.currency || 'USD'
  const lineItems = quote.lineItems || []
  const scopeItems = quote.scopeItems || []
  
  const sections: (Paragraph | Table)[] = []
  
  // Bold Cover Page
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '◆',
          bold: true,
          size: 72,
          color: VIBRANT_COLORS.PRIMARY,
          font: 'Verdana',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 240 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: quote.companyName || 'MicroAI Systems',
          bold: true,
          size: 48,
          color: VIBRANT_COLORS.PRIMARY,
          font: 'Verdana',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 480 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: quote.title,
          bold: true,
          size: 40,
          color: VIBRANT_COLORS.TEXT,
          font: 'Verdana',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 960 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: `#${quote.quoteNumber}`,
          bold: true,
          size: 24,
          color: VIBRANT_COLORS.WHITE,
          font: 'Verdana',
        }),
      ],
      alignment: AlignmentType.CENTER,
      shading: { fill: VIBRANT_COLORS.PRIMARY, type: ShadingType.CLEAR },
      spacing: { before: 240, after: 240 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: formatCurrency(quote.total, currency),
          bold: true,
          size: 56,
          color: VIBRANT_COLORS.ACCENT,
          font: 'Verdana',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 240 },
    }),
    
    new Paragraph({ text: '', pageBreakBefore: true }),
  )
  
  // Client Section
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '◆ CLIENT',
          bold: true,
          size: 28,
          color: VIBRANT_COLORS.PRIMARY,
          font: 'Verdana',
        }),
      ],
      spacing: { before: 240, after: 240 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: quote.clientName,
          bold: true,
          size: 28,
          color: VIBRANT_COLORS.TEXT,
          font: 'Verdana',
        }),
      ],
      spacing: { after: 120 },
      indent: { left: 360 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: quote.clientEmail,
          size: 22,
          color: VIBRANT_COLORS.MEDIUM,
          font: 'Verdana',
        }),
      ],
      spacing: { after: 480 },
      indent: { left: 360 },
    }),
  )
  
  // Executive Summary
  if (quote.executiveSummary) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '◆ OVERVIEW',
            bold: true,
            size: 28,
            color: VIBRANT_COLORS.ACCENT,
            font: 'Verdana',
          }),
        ],
        spacing: { before: 480, after: 240 },
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: quote.executiveSummary,
            size: 22,
            color: VIBRANT_COLORS.TEXT,
            font: 'Verdana',
          }),
        ],
        spacing: { after: 480 },
        alignment: AlignmentType.JUSTIFIED,
        indent: { left: 360 },
      }),
    )
  }
  
  // Scope with gradient markers
  if (scopeItems.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '◆ WHAT YOU GET',
            bold: true,
            size: 28,
            color: VIBRANT_COLORS.PRIMARY,
            font: 'Verdana',
          }),
        ],
        spacing: { before: 480, after: 240 },
      }),
    )
    
    scopeItems.forEach(item => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '✦ ',
              bold: true,
              size: 24,
              color: VIBRANT_COLORS.ACCENT,
              font: 'Verdana',
            }),
            new TextRun({
              text: item,
              size: 22,
              color: VIBRANT_COLORS.TEXT,
              font: 'Verdana',
            }),
          ],
          spacing: { after: 180 },
          indent: { left: 480 },
        })
      )
    })
  }
  
  sections.push(new Paragraph({ text: '', pageBreakBefore: true }))
  
  // Bold Pricing
  if (lineItems.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '◆ INVESTMENT',
            bold: true,
            size: 28,
            color: VIBRANT_COLORS.ACCENT,
            font: 'Verdana',
          }),
        ],
        spacing: { before: 240, after: 360 },
      }),
    )
    
    lineItems.forEach((item: any) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '▸ ',
              bold: true,
              size: 28,
              color: VIBRANT_COLORS.PRIMARY,
              font: 'Verdana',
            }),
            new TextRun({
              text: item.name || 'Service',
              bold: true,
              size: 24,
              color: VIBRANT_COLORS.TEXT,
              font: 'Verdana',
            }),
          ],
          spacing: { before: 240, after: 120 },
          indent: { left: 360 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: item.description || '',
              size: 20,
              color: VIBRANT_COLORS.MEDIUM,
              font: 'Verdana',
            }),
          ],
          spacing: { after: 120 },
          indent: { left: 720 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: formatCurrency((item.quantity || 0) * (item.unitPrice || 0), currency),
              bold: true,
              size: 26,
              color: VIBRANT_COLORS.ACCENT,
              font: 'Verdana',
            }),
          ],
          spacing: { after: 240 },
          indent: { left: 720 },
        }),
      )
    })
    
    // Bold Total
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '◆ TOTAL INVESTMENT',
            bold: true,
            size: 32,
            color: VIBRANT_COLORS.WHITE,
            font: 'Verdana',
          }),
        ],
        alignment: AlignmentType.CENTER,
        shading: { fill: VIBRANT_COLORS.PRIMARY, type: ShadingType.CLEAR },
        spacing: { before: 480, after: 240 },
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: formatCurrency(quote.total, currency),
            bold: true,
            size: 64,
            color: VIBRANT_COLORS.ACCENT,
            font: 'Verdana',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
      }),
    )
  }
  
  // Footer
  sections.push(
    new Paragraph({ spacing: { before: 960 } }),
    new Paragraph({
      children: [
        new TextRun({
          text: '◆',
          bold: true,
          size: 32,
          color: VIBRANT_COLORS.PRIMARY,
          font: 'Verdana',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: quote.companyName || 'MicroAI Systems',
          bold: true,
          size: 20,
          color: VIBRANT_COLORS.PRIMARY,
          font: 'Verdana',
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  )
  
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: sections,
    }],
  })
  
  return await Packer.toBuffer(doc)
}

// ==================== MAIN EXPORT ====================
export async function generateQuoteDocxTemplate(
  quote: QuoteData,
  template: TemplateType = 'modern-corporate'
): Promise<Buffer> {
  switch (template) {
    case 'modern-corporate':
      return generateModernCorporateTemplate(quote)
    case 'minimalist-clean':
      return generateMinimalistCleanTemplate(quote)
    case 'vibrant-gradient':
      return generateVibrantGradientTemplate(quote)
    default:
      return generateModernCorporateTemplate(quote)
  }
}
