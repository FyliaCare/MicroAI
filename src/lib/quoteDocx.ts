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
} from 'docx'

// Comprehensive Quote Data Interface
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

// Format currency helper
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

// Format date helper
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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
  
  // ==================== COVER PAGE ====================
  sections.push(
    new Paragraph({
      text: quote.companyName || 'MicroAI Systems',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 600, before: 400 },
    }),
    
    new Paragraph({
      text: 'BUSINESS QUOTATION',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    
    new Paragraph({
      text: quote.title,
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    
    // Quote Info Box
    new Paragraph({
      children: [
        new TextRun({ text: 'Quote Reference: ', bold: true }),
        new TextRun(quote.quoteNumber),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: 'Issue Date: ', bold: true }),
        new TextRun(formatDate(quote.createdAt)),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    
    new Paragraph({
      children: [
        new TextRun({ text: 'Valid Until: ', bold: true }),
        new TextRun(formatDate(quote.validUntil)),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    
    // Company Details
    new Paragraph({
      text: '___________________________',
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    }),
    
    new Paragraph({
      text: quote.companyAddress || 'BR253 Pasture St. Takoradi, Ghana',
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
    }),
    
    new Paragraph({
      text: `${quote.companyEmail || 'sales@microaisystems.com'} | ${quote.companyPhone || '+233 244486837'}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
    }),
    
    new Paragraph({
      text: quote.companyWebsite || 'www.microaisystems.com',
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),
    
    // Page Break
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  )
  
  // ==================== CLIENT INFORMATION ====================
  sections.push(
    new Paragraph({
      text: 'CLIENT INFORMATION',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 300 },
    })
  )
  
  sections.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
        left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
        right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Client Name:', bold: true })] })],
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'F3F4F6' },
            }),
            new TableCell({
              children: [new Paragraph(quote.clientName)],
              width: { size: 70, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        ...(quote.clientCompany ? [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: 'Company:', bold: true })] })],
                shading: { fill: 'F3F4F6' },
              }),
              new TableCell({
                children: [new Paragraph(quote.clientCompany)],
              }),
            ],
          }),
        ] : []),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Email:', bold: true })] })],
              shading: { fill: 'F3F4F6' },
            }),
            new TableCell({
              children: [new Paragraph(quote.clientEmail)],
            }),
          ],
        }),
        ...(quote.clientPhone ? [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: 'Phone:', bold: true })] })],
                shading: { fill: 'F3F4F6' },
              }),
              new TableCell({
                children: [new Paragraph(quote.clientPhone)],
              }),
            ],
          }),
        ] : []),
        ...(quote.clientAddress ? [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: 'Address:', bold: true })] })],
                shading: { fill: 'F3F4F6' },
              }),
              new TableCell({
                children: [new Paragraph(quote.clientAddress)],
              }),
            ],
          }),
        ] : []),
      ],
    }),
    
    new Paragraph({ text: '', spacing: { after: 400 } })
  )
  
  // ==================== EXECUTIVE SUMMARY ====================
  if (quote.executiveSummary || quote.description) {
    sections.push(
      new Paragraph({
        text: 'EXECUTIVE SUMMARY',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
      }),
      
      new Paragraph({
        text: quote.executiveSummary || quote.description || '',
        spacing: { after: 200 },
      }),
      
      new Paragraph({ text: '', spacing: { after: 400 } })
    )
  }
  
  // ==================== PROJECT TYPE ====================
  if (quote.projectType) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Project Type: ', bold: true }),
          new TextRun(quote.projectType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
        ],
        spacing: { after: 400 },
      })
    )
  }
  
  // ==================== OBJECTIVES ====================
  if (objectives.length > 0) {
    sections.push(
      new Paragraph({
        text: 'PROJECT OBJECTIVES',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 },
      })
    )
    
    objectives.forEach((obj: string) => {
      sections.push(
        new Paragraph({
          text: `• ${obj}`,
          spacing: { after: 100 },
        })
      )
    })
    
    sections.push(new Paragraph({ text: '', spacing: { after: 300 } }))
  }
  
  // ==================== SCOPE OF WORK ====================
  if (scopeItems.length > 0 || quote.scopeOfWork) {
    sections.push(
      new Paragraph({
        text: 'SCOPE OF WORK',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
      })
    )
    
    if (scopeItems.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Included Services:',
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      )
      
      scopeItems.forEach((item: string) => {
        sections.push(
          new Paragraph({
            text: `✓ ${item}`,
            spacing: { after: 100 },
          })
        )
      })
      
      sections.push(new Paragraph({ text: '', spacing: { after: 200 } }))
    }
    
    if (typeof quote.scopeOfWork === 'string' && quote.scopeOfWork) {
      sections.push(
        new Paragraph({
          text: quote.scopeOfWork,
          spacing: { after: 300 },
        })
      )
    }
  }
  
  // ==================== DELIVERABLES ====================
  if (deliverables.length > 0) {
    sections.push(
      new Paragraph({
        text: 'DELIVERABLES',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 },
      })
    )
    
    deliverables.forEach((item: string) => {
      sections.push(
        new Paragraph({
          text: `→ ${item}`,
          spacing: { after: 100 },
        })
      )
    })
    
    sections.push(new Paragraph({ text: '', spacing: { after: 300 } }))
  }
  
  // ==================== EXCLUSIONS ====================
  if (exclusions.length > 0) {
    sections.push(
      new Paragraph({
        text: 'EXCLUSIONS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 },
      }),
      
      new Paragraph({
        text: 'The following items are NOT included in this quote:',
        spacing: { after: 100 },
      })
    )
    
    exclusions.forEach((item: string) => {
      sections.push(
        new Paragraph({
          text: `✗ ${item}`,
          spacing: { after: 100 },
        })
      )
    })
    
    sections.push(new Paragraph({ text: '', spacing: { after: 300 } }))
  }
  
  // ==================== ASSUMPTIONS ====================
  if (assumptions.length > 0) {
    sections.push(
      new Paragraph({
        text: 'PROJECT ASSUMPTIONS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 },
      })
    )
    
    assumptions.forEach((item: string) => {
      sections.push(
        new Paragraph({
          text: `• ${item}`,
          spacing: { after: 100 },
        })
      )
    })
    
    sections.push(new Paragraph({ text: '', spacing: { after: 400 } }))
  }
  
  // Page Break before pricing
  sections.push(
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  )
  
  // ==================== PRICING BREAKDOWN ====================
  sections.push(
    new Paragraph({
      text: 'PRICING BREAKDOWN',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 300 },
    })
  )
  
  if (lineItems.length > 0) {
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: '4F46E5' },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: '4F46E5' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' },
          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' },
        },
        rows: [
          // Header Row
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                children: [new Paragraph({ 
                  children: [new TextRun({ text: 'Item Description', bold: true, color: 'FFFFFF' })],
                  alignment: AlignmentType.LEFT,
                })],
                shading: { fill: '4F46E5' },
                width: { size: 40, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ 
                  children: [new TextRun({ text: 'Quantity', bold: true, color: 'FFFFFF' })],
                  alignment: AlignmentType.CENTER,
                })],
                shading: { fill: '4F46E5' },
                width: { size: 15, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ 
                  children: [new TextRun({ text: 'Unit Price', bold: true, color: 'FFFFFF' })],
                  alignment: AlignmentType.RIGHT,
                })],
                shading: { fill: '4F46E5' },
                width: { size: 20, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [new Paragraph({ 
                  children: [new TextRun({ text: 'Total', bold: true, color: 'FFFFFF' })],
                  alignment: AlignmentType.RIGHT,
                })],
                shading: { fill: '4F46E5' },
                width: { size: 25, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
          
          // Line Items
          ...lineItems.map((item: any, index: number) => {
            const total = item.quantity * item.unitPrice
            return new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: item.description || item.name, bold: true })],
                      spacing: { after: 50 },
                    }),
                    ...(item.details ? [
                      new Paragraph({
                        text: item.details,
                        spacing: { after: 0 },
                      }),
                    ] : []),
                  ],
                  shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                }),
                new TableCell({
                  children: [new Paragraph({
                    text: item.quantity.toString(),
                    alignment: AlignmentType.CENTER,
                  })],
                  shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                }),
                new TableCell({
                  children: [new Paragraph({
                    text: formatCurrency(item.unitPrice, currency),
                    alignment: AlignmentType.RIGHT,
                  })],
                  shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: formatCurrency(total, currency), bold: true })],
                    alignment: AlignmentType.RIGHT,
                  })],
                  shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                }),
              ],
            })
          }),
          
          // Subtotal Row
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph('')],
                columnSpan: 2,
                borders: { top: { style: BorderStyle.SINGLE, size: 2, color: '4F46E5' } },
              }),
              new TableCell({
                children: [new Paragraph({ 
                  children: [new TextRun({ text: 'Subtotal:', bold: true })],
                  alignment: AlignmentType.RIGHT,
                })],
                borders: { top: { style: BorderStyle.SINGLE, size: 2, color: '4F46E5' } },
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: formatCurrency(quote.subtotal || 0, currency), bold: true })],
                  alignment: AlignmentType.RIGHT,
                })],
                borders: { top: { style: BorderStyle.SINGLE, size: 2, color: '4F46E5' } },
              }),
            ],
          }),
          
          // Tax Row (if applicable)
          ...(quote.tax && quote.tax > 0 ? [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph('')],
                  columnSpan: 2,
                }),
                new TableCell({
                  children: [new Paragraph({
                    text: `Tax (${quote.taxRate || 0}%):`,
                    alignment: AlignmentType.RIGHT,
                  })],
                }),
                new TableCell({
                  children: [new Paragraph({
                    text: formatCurrency(quote.tax, currency),
                    alignment: AlignmentType.RIGHT,
                  })],
                }),
              ],
            }),
          ] : []),
          
          // Discount Row (if applicable)
          ...(quote.discount && quote.discount > 0 ? [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph('')],
                  columnSpan: 2,
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: 'Discount:', color: '059669' })],
                    alignment: AlignmentType.RIGHT,
                  })],
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: `-${formatCurrency(quote.discount, currency)}`, color: '059669' })],
                    alignment: AlignmentType.RIGHT,
                  })],
                }),
              ],
            }),
          ] : []),
          
          // Total Row
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph('')],
                columnSpan: 2,
                shading: { fill: '4F46E5' },
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'TOTAL:', bold: true, size: 24, color: 'FFFFFF' })],
                  alignment: AlignmentType.RIGHT,
                })],
                shading: { fill: '4F46E5' },
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: formatCurrency(quote.total, currency), bold: true, size: 24, color: 'FFFFFF' })],
                  alignment: AlignmentType.RIGHT,
                })],
                shading: { fill: '4F46E5' },
              }),
            ],
          }),
        ],
      }),
      
      new Paragraph({ text: '', spacing: { after: 400 } })
    )
  }
  
  // ==================== PAYMENT TERMS ====================
  if (paymentSchedule.length > 0 || quote.depositAmount || quote.paymentTermsText) {
    sections.push(
      new Paragraph({
        text: 'PAYMENT TERMS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
        pageBreakBefore: true,
      })
    )
    
    if (quote.depositAmount || quote.depositPercentage) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Initial Deposit: ', bold: true }),
            new TextRun(
              quote.depositAmount 
                ? formatCurrency(quote.depositAmount, currency)
                : `${quote.depositPercentage}% (${formatCurrency((quote.total * (quote.depositPercentage || 0)) / 100, currency)})`
            ),
          ],
          spacing: { after: 200 },
        })
      )
    }
    
    if (paymentSchedule.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Payment Schedule:',
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 200 },
        }),
        
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' },
          },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Phase', bold: true })] })],
                  shading: { fill: 'E0E7FF' },
                  width: { size: 15, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })],
                  shading: { fill: 'E0E7FF' },
                  width: { size: 50, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Amount', bold: true })], alignment: AlignmentType.RIGHT })],
                  shading: { fill: 'E0E7FF' },
                  width: { size: 20, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Due Date', bold: true })], alignment: AlignmentType.CENTER })],
                  shading: { fill: 'E0E7FF' },
                  width: { size: 15, type: WidthType.PERCENTAGE },
                }),
              ],
            }),
            ...paymentSchedule.map((payment: any, index: number) => {
              return new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(payment.phase || `Phase ${index + 1}`)],
                    shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                  }),
                  new TableCell({
                    children: [new Paragraph(payment.description || '')],
                    shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      text: formatCurrency(payment.amount || 0, currency),
                      alignment: AlignmentType.RIGHT,
                    })],
                    shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      text: payment.dueDate ? formatDate(payment.dueDate) : 'TBD',
                      alignment: AlignmentType.CENTER,
                    })],
                    shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                  }),
                ],
              })
            }),
          ],
        }),
        
        new Paragraph({ text: '', spacing: { after: 300 } })
      )
    }
    
    if (quote.paymentTermsText) {
      sections.push(
        new Paragraph({
          text: quote.paymentTermsText,
          spacing: { after: 400 },
        })
      )
    }
  }
  
  // ==================== TIMELINE & MILESTONES ====================
  if (milestones.length > 0 || quote.estimatedDuration || quote.timeline) {
    sections.push(
      new Paragraph({
        text: 'PROJECT TIMELINE',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
        pageBreakBefore: paymentSchedule.length === 0 && !quote.depositAmount && !quote.paymentTermsText,
      })
    )
    
    if (quote.estimatedDuration) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Estimated Duration: ', bold: true }),
            new TextRun(quote.estimatedDuration),
          ],
          spacing: { after: 200 },
        })
      )
    }
    
    if (quote.startDate) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Proposed Start Date: ', bold: true }),
            new TextRun(formatDate(quote.startDate)),
          ],
          spacing: { after: 200 },
        })
      )
    }
    
    if (quote.timeline) {
      sections.push(
        new Paragraph({
          text: quote.timeline,
          spacing: { after: 300 },
        })
      )
    }
    
    if (milestones.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Project Milestones:',
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 200 },
        }),
        
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' },
          },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Milestone', bold: true })] })],
                  shading: { fill: 'E0E7FF' },
                  width: { size: 50, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Timeline', bold: true })], alignment: AlignmentType.CENTER })],
                  shading: { fill: 'E0E7FF' },
                  width: { size: 25, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: 'Deliverables', bold: true })] })],
                  shading: { fill: 'E0E7FF' },
                  width: { size: 25, type: WidthType.PERCENTAGE },
                }),
              ],
            }),
            ...milestones.map((milestone: any, index: number) => {
              return new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(milestone.name || milestone.title || `Milestone ${index + 1}`)],
                    shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      text: milestone.duration || milestone.timeline || 'TBD',
                      alignment: AlignmentType.CENTER,
                    })],
                    shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                  }),
                  new TableCell({
                    children: [new Paragraph(milestone.deliverables || milestone.description || '-')],
                    shading: { fill: index % 2 === 0 ? 'FFFFFF' : 'F9FAFB' },
                  }),
                ],
              })
            }),
          ],
        }),
        
        new Paragraph({ text: '', spacing: { after: 400 } })
      )
    }
  }
  
  // ==================== SUPPORT & MAINTENANCE ====================
  if (quote.supportPeriod || quote.maintenanceIncluded || quote.revisionsIncluded) {
    sections.push(
      new Paragraph({
        text: 'SUPPORT & MAINTENANCE',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    )
    
    if (quote.supportPeriod) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Support Period: ', bold: true }),
            new TextRun(quote.supportPeriod),
          ],
          spacing: { after: 100 },
        })
      )
    }
    
    if (quote.maintenanceIncluded !== undefined) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Maintenance Included: ', bold: true }),
            new TextRun(quote.maintenanceIncluded ? 'Yes' : 'No'),
          ],
          spacing: { after: 100 },
        })
      )
    }
    
    if (quote.revisionsIncluded) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Revisions Included: ', bold: true }),
            new TextRun(`${quote.revisionsIncluded} rounds`),
          ],
          spacing: { after: 300 },
        })
      )
    }
  }
  
  // ==================== TERMS & CONDITIONS ====================
  sections.push(
    new Paragraph({
      text: 'TERMS & CONDITIONS',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 },
      pageBreakBefore: true,
    })
  )
  
  if (quote.confidentiality) {
    sections.push(
      new Paragraph({
        text: 'Confidentiality',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: quote.confidentiality,
        spacing: { after: 300 },
      })
    )
  }
  
  if (quote.intellectualProperty) {
    sections.push(
      new Paragraph({
        text: 'Intellectual Property',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: quote.intellectualProperty,
        spacing: { after: 300 },
      })
    )
  }
  
  if (quote.termsAndConditions) {
    sections.push(
      new Paragraph({
        text: 'General Terms',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: quote.termsAndConditions,
        spacing: { after: 400 },
      })
    )
  } else {
    // Default terms if none provided
    sections.push(
      new Paragraph({
        text: '• This quote is valid for 30 days from the issue date.',
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: '• All prices are in ' + currency + ' and are subject to applicable taxes.',
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: '• Payment terms as outlined above must be adhered to for project commencement.',
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: '• Any changes to scope may result in additional charges.',
        spacing: { after: 400 },
      })
    )
  }
  
  // ==================== NOTES ====================
  if (quote.notes) {
    sections.push(
      new Paragraph({
        text: 'ADDITIONAL NOTES',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 },
      }),
      new Paragraph({
        text: quote.notes,
        spacing: { after: 400 },
      })
    )
  }
  
  // ==================== SIGNATURE SECTION ====================
  sections.push(
    new Paragraph({
      text: '___________________________',
      spacing: { before: 600, after: 100 },
    }),
    new Paragraph({
      text: 'ACCEPTANCE & AUTHORIZATION',
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 400 },
    }),
    new Paragraph({
      text: 'Client Signature: _______________________________     Date: ____________',
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: 'Client Name (Print): _______________________________',
      spacing: { after: 600 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'By signing this document, you agree to the terms and conditions outlined in this quotation and authorize ', size: 20 }),
        new TextRun({ text: quote.companyName || 'MicroAI Systems', bold: true, size: 20 }),
        new TextRun({ text: ' to proceed with the project as described.', size: 20 }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  )
  
  // ==================== CREATE DOCUMENT ====================
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  })
  
  return await Packer.toBuffer(doc)
}
