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
  TabStopType,
  TabStopPosition,
} from 'docx'

// Professional Quote Data Interface
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
  
  // Client Information
  clientName: string
  clientEmail: string
  clientCompany?: string
  clientPhone?: string
  clientAddress?: string
  
  // Company Information
  companyName?: string
  companyAddress?: string
  companyEmail?: string
  companyPhone?: string
  companyWebsite?: string
  companyLogo?: string
  
  // Project Details
  executiveSummary?: string
  projectType?: string
  scopeOfWork?: any
  scopeItems?: string[]
  deliverables?: string[]
  exclusions?: string[]
  assumptions?: string[]
  objectives?: string[]
  
  // Timeline
  estimatedDuration?: string
  timeline?: string
  milestones?: any[]
  
  // Pricing
  lineItems?: any[]
  
  // Payment Terms
  paymentSchedule?: any[]
  depositAmount?: number
  depositPercentage?: number
  paymentTermsText?: string
  
  // Additional Terms
  supportPeriod?: string
  maintenanceIncluded?: boolean
  revisionsIncluded?: number
  confidentiality?: string
  intellectualProperty?: string
  termsAndConditions?: string
  notes?: string
}

// Professional colors (hex to RGB)
const COLORS = {
  PRIMARY: '4F46E5', // Indigo
  PRIMARY_LIGHT: 'E0E7FF', // Light Indigo
  ACCENT: '10B981', // Emerald
  DARK: '1F2937', // Dark Gray
  MEDIUM: '6B7280', // Medium Gray
  LIGHT: 'F3F4F6', // Light Gray
  WHITE: 'FFFFFF',
  TEXT: '111827', // Near Black
}

// Format currency
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

// Format date
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Create section header with styling
function createSectionHeader(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 28,
        color: COLORS.PRIMARY,
        font: 'Calibri',
      }),
    ],
    spacing: { before: 480, after: 240 },
    border: {
      bottom: {
        color: COLORS.PRIMARY,
        space: 1,
        size: 12,
        style: BorderStyle.SINGLE,
      },
    },
  })
}

// Create professional table with header
function createProfessionalTable(headers: string[], rows: string[][], columnWidths?: number[]): Table {
  const headerCells = headers.map((header, index) => 
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: header,
              bold: true,
              size: 22,
              color: COLORS.WHITE,
              font: 'Calibri',
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
      ],
      shading: {
        fill: COLORS.PRIMARY,
        type: ShadingType.CLEAR,
      },
      margins: {
        top: 150,
        bottom: 150,
        left: 150,
        right: 150,
      },
      verticalAlign: VerticalAlign.CENTER,
      width: columnWidths ? { size: columnWidths[index], type: WidthType.PERCENTAGE } : undefined,
    })
  )

  const dataRows = rows.map((row, rowIndex) =>
    new TableRow({
      children: row.map((cell, cellIndex) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cell,
                  size: 20,
                  color: COLORS.TEXT,
                  font: 'Calibri',
                }),
              ],
              alignment: cellIndex === row.length - 1 && row.length > 2 ? AlignmentType.RIGHT : AlignmentType.LEFT,
            }),
          ],
          shading: {
            fill: rowIndex % 2 === 0 ? COLORS.WHITE : COLORS.LIGHT,
            type: ShadingType.CLEAR,
          },
          margins: {
            top: 120,
            bottom: 120,
            left: 150,
            right: 150,
          },
          verticalAlign: VerticalAlign.CENTER,
          width: columnWidths ? { size: columnWidths[cellIndex], type: WidthType.PERCENTAGE } : undefined,
        })
      ),
    })
  )

  return new Table({
    rows: [
      new TableRow({
        children: headerCells,
        tableHeader: true,
      }),
      ...dataRows,
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: COLORS.LIGHT },
      insideVertical: { style: BorderStyle.NONE },
    },
  })
}

// Create bullet point list
function createBulletList(items: string[]): Paragraph[] {
  return items.map(item =>
    new Paragraph({
      children: [
        new TextRun({
          text: '• ',
          size: 24,
          color: COLORS.PRIMARY,
          font: 'Calibri',
        }),
        new TextRun({
          text: item,
          size: 22,
          color: COLORS.TEXT,
          font: 'Calibri',
        }),
      ],
      spacing: { after: 120 },
      indent: { left: 360 },
    })
  )
}

// Create info box (highlight box)
function createInfoBox(title: string, content: string, color: string = COLORS.PRIMARY_LIGHT): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 24,
          color: COLORS.PRIMARY,
          font: 'Calibri',
        }),
      ],
      shading: {
        fill: color,
        type: ShadingType.CLEAR,
      },
      spacing: { before: 240, after: 120 },
      indent: { left: 240, right: 240 },
      border: {
        left: {
          color: COLORS.PRIMARY,
          space: 1,
          size: 24,
          style: BorderStyle.SINGLE,
        },
      },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: content,
          size: 22,
          color: COLORS.TEXT,
          font: 'Calibri',
        }),
      ],
      shading: {
        fill: color,
        type: ShadingType.CLEAR,
      },
      spacing: { after: 240 },
      indent: { left: 240, right: 240 },
      border: {
        left: {
          color: COLORS.PRIMARY,
          space: 1,
          size: 24,
          style: BorderStyle.SINGLE,
        },
      },
    }),
  ]
}

export async function generateQuoteDocx(quote: QuoteData): Promise<Buffer> {
  const currency = quote.currency || 'USD'
  const lineItems = quote.lineItems || []
  const milestones = quote.milestones || []
  const paymentSchedule = quote.paymentSchedule || []
  const scopeItems = quote.scopeItems || []
  const deliverables = quote.deliverables || []
  const exclusions = quote.exclusions || []
  const assumptions = quote.assumptions || []
  const objectives = quote.objectives || []
  
  const sections: (Paragraph | Table)[] = []
  
  // ==================== PROFESSIONAL COVER PAGE ====================
  sections.push(
    // Company Name - Large and Bold
    new Paragraph({
      children: [
        new TextRun({
          text: quote.companyName || 'MicroAI Systems',
          bold: true,
          size: 72,
          color: COLORS.PRIMARY,
          font: 'Calibri',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 480 },
    }),
    
    // Tagline or subtitle
    new Paragraph({
      children: [
        new TextRun({
          text: 'Professional Software Development Services',
          size: 28,
          color: COLORS.MEDIUM,
          font: 'Calibri',
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 960 },
    }),
    
    // Quote Title with Box
    new Paragraph({
      children: [
        new TextRun({
          text: 'PROJECT PROPOSAL',
          bold: true,
          size: 36,
          color: COLORS.WHITE,
          font: 'Calibri',
        }),
      ],
      alignment: AlignmentType.CENTER,
      shading: {
        fill: COLORS.PRIMARY,
        type: ShadingType.CLEAR,
      },
      spacing: { before: 240, after: 240 },
      indent: { left: 1440, right: 1440 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({
          text: quote.title,
          bold: true,
          size: 44,
          color: COLORS.TEXT,
          font: 'Calibri',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 960 },
    }),
  )
  
  // Quote Reference Box
  const quoteInfoTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Quote Number:', bold: true, size: 22, color: COLORS.DARK }),
                ],
              }),
            ],
            shading: { fill: COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: { top: 150, bottom: 150, left: 240, right: 240 },
            width: { size: 35, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: quote.quoteNumber, size: 22, color: COLORS.TEXT }),
                ],
              }),
            ],
            margins: { top: 150, bottom: 150, left: 240, right: 240 },
            width: { size: 65, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Issue Date:', bold: true, size: 22, color: COLORS.DARK }),
                ],
              }),
            ],
            shading: { fill: COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: { top: 150, bottom: 150, left: 240, right: 240 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: formatDate(quote.createdAt), size: 22, color: COLORS.TEXT }),
                ],
              }),
            ],
            margins: { top: 150, bottom: 150, left: 240, right: 240 },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Valid Until:', bold: true, size: 22, color: COLORS.DARK }),
                ],
              }),
            ],
            shading: { fill: COLORS.LIGHT, type: ShadingType.CLEAR },
            margins: { top: 150, bottom: 150, left: 240, right: 240 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: formatDate(quote.validUntil), size: 22, color: COLORS.TEXT }),
                ],
              }),
            ],
            margins: { top: 150, bottom: 150, left: 240, right: 240 },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Total Investment:', bold: true, size: 24, color: COLORS.WHITE }),
                ],
              }),
            ],
            shading: { fill: COLORS.ACCENT, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 240, right: 240 },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ 
                    text: formatCurrency(quote.total, currency), 
                    bold: true, 
                    size: 32, 
                    color: COLORS.ACCENT,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
            margins: { top: 200, bottom: 200, left: 240, right: 240 },
          }),
        ],
      }),
    ],
    width: { size: 70, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.PRIMARY },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.PRIMARY },
      left: { style: BorderStyle.SINGLE, size: 6, color: COLORS.PRIMARY },
      right: { style: BorderStyle.SINGLE, size: 6, color: COLORS.PRIMARY },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 3, color: COLORS.LIGHT },
      insideVertical: { style: BorderStyle.NONE },
    },
  })
  
  sections.push(
    new Paragraph({ spacing: { before: 480 } }),
    quoteInfoTable,
    new Paragraph({ text: '', pageBreakBefore: true }),
  )
  
  // ==================== CLIENT INFORMATION ====================
  sections.push(
    createSectionHeader('Client Information'),
  )
  
  const clientInfoRows: string[][] = [
    ['Client Name', quote.clientName],
    ['Email', quote.clientEmail],
  ]
  
  if (quote.clientCompany) clientInfoRows.push(['Company', quote.clientCompany])
  if (quote.clientPhone) clientInfoRows.push(['Phone', quote.clientPhone])
  if (quote.clientAddress) clientInfoRows.push(['Address', quote.clientAddress])
  
  sections.push(
    createProfessionalTable(['Field', 'Details'], clientInfoRows, [30, 70]),
  )
  
  // ==================== EXECUTIVE SUMMARY ====================
  if (quote.executiveSummary) {
    sections.push(
      new Paragraph({ spacing: { before: 480 } }),
      createSectionHeader('Executive Summary'),
      new Paragraph({
        children: [
          new TextRun({
            text: quote.executiveSummary,
            size: 24,
            color: COLORS.TEXT,
            font: 'Calibri',
          }),
        ],
        spacing: { after: 240 },
        alignment: AlignmentType.JUSTIFIED,
      }),
    )
  }
  
  // ==================== PROJECT OBJECTIVES ====================
  if (objectives.length > 0) {
    sections.push(
      new Paragraph({ spacing: { before: 480 } }),
      createSectionHeader('Project Objectives'),
      ...createBulletList(objectives),
    )
  }
  
  // ==================== SCOPE OF WORK ====================
  if (scopeItems.length > 0) {
    sections.push(
      new Paragraph({ spacing: { before: 480 } }),
      createSectionHeader('Scope of Work'),
      new Paragraph({
        children: [
          new TextRun({
            text: 'The following features and functionalities are included in this proposal:',
            size: 22,
            color: COLORS.MEDIUM,
            font: 'Calibri',
            italics: true,
          }),
        ],
        spacing: { after: 240 },
      }),
      ...createBulletList(scopeItems),
    )
  }
  
  // ==================== DELIVERABLES ====================
  if (deliverables.length > 0) {
    sections.push(
      new Paragraph({ spacing: { before: 480 } }),
      createSectionHeader('Project Deliverables'),
      ...createBulletList(deliverables),
    )
  }
  
  // Page break before pricing
  sections.push(
    new Paragraph({ text: '', pageBreakBefore: true }),
  )
  
  // ==================== INVESTMENT BREAKDOWN ====================
  sections.push(
    createSectionHeader('Investment Breakdown'),
  )
  
  if (lineItems.length > 0) {
    const pricingRows = lineItems.map((item: any) => [
      item.name || 'Service',
      item.description || '',
      `${item.quantity || 0} hrs`,
      formatCurrency((item.quantity || 0) * (item.unitPrice || 0), currency),
    ])
    
    sections.push(
      createProfessionalTable(
        ['Service', 'Description', 'Hours', 'Amount'],
        pricingRows,
        [25, 40, 15, 20]
      ),
    )
    
    // Totals section
    const subtotal = quote.subtotal || lineItems.reduce((sum: number, item: any) => 
      sum + (item.quantity || 0) * (item.unitPrice || 0), 0)
    
    const totalsTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: '' })],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              width: { size: 60, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Subtotal:', bold: true, size: 24, color: COLORS.DARK }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
              shading: { fill: COLORS.LIGHT, type: ShadingType.CLEAR },
              margins: { top: 150, bottom: 150, right: 240 },
              width: { size: 20, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: formatCurrency(subtotal, currency), bold: true, size: 24, color: COLORS.TEXT }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
              shading: { fill: COLORS.LIGHT, type: ShadingType.CLEAR },
              margins: { top: 150, bottom: 150, right: 240 },
              width: { size: 20, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: '' })],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'TOTAL INVESTMENT:', bold: true, size: 28, color: COLORS.WHITE }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
              shading: { fill: COLORS.PRIMARY, type: ShadingType.CLEAR },
              margins: { top: 200, bottom: 200, right: 240 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ 
                      text: formatCurrency(quote.total, currency), 
                      bold: true, 
                      size: 36, 
                      color: COLORS.ACCENT,
                    }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
              shading: { fill: COLORS.WHITE, type: ShadingType.CLEAR },
              margins: { top: 200, bottom: 200, right: 240 },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 12, color: COLORS.PRIMARY },
                bottom: { style: BorderStyle.DOUBLE, size: 12, color: COLORS.PRIMARY },
              },
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
    })
    
    sections.push(
      new Paragraph({ spacing: { before: 240 } }),
      totalsTable,
    )
  }
  
  // ==================== PAYMENT SCHEDULE ====================
  if (paymentSchedule.length > 0) {
    sections.push(
      new Paragraph({ spacing: { before: 480 } }),
      createSectionHeader('Payment Schedule'),
    )
    
    const paymentRows = paymentSchedule.map((payment: any) => [
      payment.phase || 'Milestone',
      payment.description || '',
      formatCurrency(payment.amount || 0, currency),
      payment.dueDate || 'TBD',
    ])
    
    sections.push(
      createProfessionalTable(
        ['Phase', 'Description', 'Amount', 'Due Date'],
        paymentRows,
        [20, 40, 20, 20]
      ),
    )
  }
  
  // ==================== TIMELINE ====================
  if (milestones.length > 0) {
    sections.push(
      new Paragraph({ spacing: { before: 480 } }),
      createSectionHeader('Project Timeline'),
    )
    
    if (quote.estimatedDuration) {
      sections.push(
        ...createInfoBox('Estimated Duration', quote.estimatedDuration),
      )
    }
    
    const milestoneRows = milestones.map((m: any) => [
      m.name || 'Milestone',
      m.description || '',
      m.duration || 'TBD',
    ])
    
    sections.push(
      createProfessionalTable(
        ['Milestone', 'Description', 'Duration'],
        milestoneRows,
        [25, 55, 20]
      ),
    )
  }
  
  // Page break before terms
  sections.push(
    new Paragraph({ text: '', pageBreakBefore: true }),
  )
  
  // ==================== TERMS & CONDITIONS ====================
  sections.push(
    createSectionHeader('Terms & Conditions'),
  )
  
  // Assumptions
  if (assumptions.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Assumptions',
            bold: true,
            size: 26,
            color: COLORS.PRIMARY,
            font: 'Calibri',
          }),
        ],
        spacing: { before: 240, after: 180 },
      }),
      ...createBulletList(assumptions),
    )
  }
  
  // Exclusions
  if (exclusions.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Exclusions',
            bold: true,
            size: 26,
            color: COLORS.PRIMARY,
            font: 'Calibri',
          }),
        ],
        spacing: { before: 360, after: 180 },
      }),
      ...createBulletList(exclusions),
    )
  }
  
  // Additional Terms
  if (quote.termsAndConditions) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'General Terms',
            bold: true,
            size: 26,
            color: COLORS.PRIMARY,
            font: 'Calibri',
          }),
        ],
        spacing: { before: 360, after: 180 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: quote.termsAndConditions,
            size: 22,
            color: COLORS.TEXT,
            font: 'Calibri',
          }),
        ],
        spacing: { after: 240 },
        alignment: AlignmentType.JUSTIFIED,
      }),
    )
  }
  
  // ==================== SIGNATURE SECTION ====================
  sections.push(
    new Paragraph({ spacing: { before: 960 } }),
    createSectionHeader('Acceptance'),
    
    new Paragraph({
      children: [
        new TextRun({
          text: 'By signing below, you agree to the terms and conditions outlined in this proposal.',
          size: 22,
          color: COLORS.MEDIUM,
          font: 'Calibri',
          italics: true,
        }),
      ],
      spacing: { after: 480 },
    }),
  )
  
  const signatureTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Client Signature:', bold: true, size: 22, color: COLORS.DARK }),
                ],
              }),
              new Paragraph({ text: '', spacing: { after: 360 } }),
              new Paragraph({
                children: [
                  new TextRun({ text: '_____________________________', size: 22, color: COLORS.MEDIUM }),
                ],
              }),
            ],
            margins: { top: 240, bottom: 240, left: 240, right: 240 },
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Date:', bold: true, size: 22, color: COLORS.DARK }),
                ],
              }),
              new Paragraph({ text: '', spacing: { after: 360 } }),
              new Paragraph({
                children: [
                  new TextRun({ text: '_____________________________', size: 22, color: COLORS.MEDIUM }),
                ],
              }),
            ],
            margins: { top: 240, bottom: 240, left: 240, right: 240 },
            width: { size: 50, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
  })
  
  sections.push(
    new Paragraph({ spacing: { before: 240 } }),
    signatureTable,
  )
  
  // Footer with company info
  sections.push(
    new Paragraph({ text: '', spacing: { before: 960 } }),
    new Paragraph({
      children: [
        new TextRun({
          text: '─────────────────────────────────────────────────────────',
          size: 18,
          color: COLORS.LIGHT,
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: quote.companyName || 'MicroAI Systems',
          bold: true,
          size: 20,
          color: COLORS.PRIMARY,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 60 },
    }),
  )
  
  if (quote.companyEmail || quote.companyPhone || quote.companyWebsite) {
    const contactParts: string[] = []
    if (quote.companyEmail) contactParts.push(quote.companyEmail)
    if (quote.companyPhone) contactParts.push(quote.companyPhone)
    if (quote.companyWebsite) contactParts.push(quote.companyWebsite)
    
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(' • '),
            size: 18,
            color: COLORS.MEDIUM,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
    )
  }
  
  // Create document
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      children: sections,
    }],
  })
  
  // Generate buffer
  const buffer = await Packer.toBuffer(doc)
  return buffer
}
