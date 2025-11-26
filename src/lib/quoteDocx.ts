/**
 * Quote Word Document Generator
 * Generates professional Word documents for quotes
 */

import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableCell, 
  TableRow,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  convertInchesToTwip
} from 'docx'

interface QuoteData {
  quoteNumber: string
  title: string
  clientName: string
  clientEmail: string
  clientCompany?: string
  clientPhone?: string
  clientAddress?: string
  description?: string
  lineItems?: any[]
  currency?: string
  subtotal?: number
  discount?: number
  tax?: number
  total?: number
  validUntil?: Date | string
  createdAt?: Date | string
  companyName?: string
  companyAddress?: string
  companyEmail?: string
  companyPhone?: string
  terms?: string
  scopeOfWork?: any
  milestones?: any[]
  paymentSchedule?: any[]
}

const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    GHS: '₵',
  }
  
  const symbol = symbols[currency] || currency
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function generateQuoteDocx(quote: QuoteData): Promise<Buffer> {
  const currency = quote.currency || 'USD'
  const lineItems = quote.lineItems || []
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header - Company Name
        new Paragraph({
          text: quote.companyName || 'MicroAI Systems',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        
        // Quote Title
        new Paragraph({
          text: 'QUOTATION',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        
        // Quote Info Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: 'Quote Number:', bold: true })]
                  })],
                  width: { size: 30, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph(quote.quoteNumber)],
                  width: { size: 70, type: WidthType.PERCENTAGE },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: 'Date:', bold: true })]
                  })],
                }),
                new TableCell({
                  children: [new Paragraph(formatDate(quote.createdAt))],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: 'Valid Until:', bold: true })]
                  })],
                }),
                new TableCell({
                  children: [new Paragraph(formatDate(quote.validUntil))],
                }),
              ],
            }),
          ],
        }),
        
        new Paragraph({ text: '', spacing: { after: 400 } }),
        
        // Client Information
        new Paragraph({
          text: 'Client Information',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: 'Name: ', bold: true }),
            new TextRun(quote.clientName),
          ],
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: 'Email: ', bold: true }),
            new TextRun(quote.clientEmail),
          ],
        }),
        
        ...(quote.clientCompany ? [
          new Paragraph({
            children: [
              new TextRun({ text: 'Company: ', bold: true }),
              new TextRun(quote.clientCompany),
            ],
          }),
        ] : []),
        
        ...(quote.clientPhone ? [
          new Paragraph({
            children: [
              new TextRun({ text: 'Phone: ', bold: true }),
              new TextRun(quote.clientPhone),
            ],
          }),
        ] : []),
        
        new Paragraph({ text: '', spacing: { after: 400 } }),
        
        // Project Title
        new Paragraph({
          text: quote.title,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        
        // Description
        ...(quote.description ? [
          new Paragraph({
            text: quote.description,
            spacing: { after: 400 },
          }),
        ] : []),
        
        // Line Items
        ...(lineItems.length > 0 ? [
          new Paragraph({
            text: 'Pricing Details',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Item', bold: true })]
                    })],
                    shading: { fill: 'CCCCCC' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Description', bold: true })]
                    })],
                    shading: { fill: 'CCCCCC' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Qty', bold: true })],
                      alignment: AlignmentType.CENTER 
                    })],
                    shading: { fill: 'CCCCCC' },
                    width: { size: 10, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Unit Price', bold: true })],
                      alignment: AlignmentType.RIGHT 
                    })],
                    shading: { fill: 'CCCCCC' },
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Total', bold: true })],
                      alignment: AlignmentType.RIGHT 
                    })],
                    shading: { fill: 'CCCCCC' },
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              
              // Data Rows
              ...lineItems.map(item => new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(item.name || '')],
                  }),
                  new TableCell({
                    children: [new Paragraph(item.description || '')],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: String(item.quantity || 1), alignment: AlignmentType.CENTER })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formatCurrency(item.unitPrice || 0, currency), alignment: AlignmentType.RIGHT })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: formatCurrency((item.quantity || 1) * (item.unitPrice || 0) * (1 - (item.discount || 0) / 100), currency), 
                      alignment: AlignmentType.RIGHT 
                    })],
                  }),
                ],
              })),
            ],
          }),
          
          new Paragraph({ text: '', spacing: { after: 200 } }),
          
          // Totals
          new Table({
            width: { size: 50, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.RIGHT,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'Subtotal:', bold: true })],
                      alignment: AlignmentType.RIGHT 
                    })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: formatCurrency(quote.subtotal || 0, currency), alignment: AlignmentType.RIGHT })],
                  }),
                ],
              }),
              
              ...(quote.discount && quote.discount > 0 ? [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Discount:', bold: true })],
                        alignment: AlignmentType.RIGHT 
                      })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: '-' + formatCurrency(quote.discount, currency), 
                        alignment: AlignmentType.RIGHT 
                      })],
                    }),
                  ],
                }),
              ] : []),
              
              ...(quote.tax && quote.tax > 0 ? [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Tax:', bold: true })],
                        alignment: AlignmentType.RIGHT 
                      })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: formatCurrency(quote.tax, currency), alignment: AlignmentType.RIGHT })],
                    }),
                  ],
                }),
              ] : []),
              
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: 'TOTAL:', bold: true })],
                      alignment: AlignmentType.RIGHT 
                    })],
                    shading: { fill: 'DDDDDD' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: formatCurrency(quote.total || 0, currency), bold: true })],
                      alignment: AlignmentType.RIGHT 
                    })],
                    shading: { fill: 'DDDDDD' },
                  }),
                ],
              }),
            ],
          }),
        ] : []),
        
        new Paragraph({ text: '', spacing: { after: 400 } }),
        
        // Terms and Conditions
        ...(quote.terms ? [
          new Paragraph({
            text: 'Terms and Conditions',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: quote.terms,
            spacing: { after: 400 },
          }),
        ] : []),
        
        // Footer
        new Paragraph({ text: '', spacing: { after: 200 } }),
        
        new Paragraph({
          text: '___________________________',
          spacing: { before: 600, after: 100 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: quote.companyName || 'MicroAI Systems', bold: true }),
          ],
        }),
        
        new Paragraph({
          text: quote.companyAddress || 'BR253 Pasture St. Takoradi, Ghana',
        }),
        
        new Paragraph({
          text: quote.companyEmail || 'sales@microaisystems.com',
        }),
        
        new Paragraph({
          text: quote.companyPhone || '+233 244486837',
        }),
      ],
    }],
  })
  
  // Generate buffer
  const buffer = await Packer.toBuffer(doc)
  return Buffer.from(buffer)
}
