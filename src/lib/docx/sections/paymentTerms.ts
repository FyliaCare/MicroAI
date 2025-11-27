/**
 * PAYMENT TERMS SECTION
 * Payment schedule, methods, and terms
 */

import { Paragraph, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign, TextRun } from 'docx'
import { ISO_COLORS, TYPOGRAPHY, MARGINS, formatCurrency, formatDate, createSectionHeader, createSubsectionHeader, createSpace, createBodyParagraph, createInfoBox, createBulletList } from '../templates/iso-professional'

interface PaymentScheduleItem {
  id?: string
  title: string
  percentage: number
  amount: number
  dueDate: 'onSigning' | 'milestone' | 'net15' | 'net30' | 'net60' | 'custom'
  milestoneId?: string
  customDate?: string
  description?: string
}

interface PaymentTermsData {
  paymentSchedule?: PaymentScheduleItem[]
  currency: string
  depositRequired?: boolean
  depositAmount?: number
  depositPercentage?: number
  acceptedMethods?: string[]
  lateFeePercentage?: number
  earlyPaymentDiscount?: number
  paymentTermsText?: string
}

export function generatePaymentTerms(data: PaymentTermsData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = []
  
  // Section Header
  elements.push(createSectionHeader('Payment Terms & Schedule', '💳'))
  
  // Payment Schedule Table
  if (data.paymentSchedule && data.paymentSchedule.length > 0) {
    elements.push(
      createSubsectionHeader('Payment Schedule'),
      createBodyParagraph(
        'Payments are structured according to the following schedule:',
        { italic: true, spacingAfter: 240 }
      )
    )
    
    const scheduleTable = createPaymentScheduleTable(data.paymentSchedule, data.currency)
    elements.push(scheduleTable, createSpace('large'))
  }
  
  // Deposit Information
  if (data.depositRequired && (data.depositAmount || data.depositPercentage)) {
    const depositText = data.depositAmount
      ? `A deposit of ${formatCurrency(data.depositAmount, data.currency)} is required to commence work.`
      : `A deposit of ${data.depositPercentage}% of the total amount is required to commence work.`
    
    elements.push(
      ...createInfoBox(
        'Initial Deposit Required',
        depositText,
        'warning'
      ),
      createSpace()
    )
  }
  
  // Accepted Payment Methods
  if (data.acceptedMethods && data.acceptedMethods.length > 0) {
    elements.push(
      createSubsectionHeader('Accepted Payment Methods'),
      createBodyParagraph(
        'We accept the following payment methods:',
        { spacingAfter: 180 }
      ),
      ...createBulletList(data.acceptedMethods, 'check'),
      createSpace()
    )
  }
  
  // Additional Terms
  const additionalTerms: string[] = []
  
  if (data.lateFeePercentage) {
    additionalTerms.push(
      `Late payments will incur a ${data.lateFeePercentage}% monthly fee on outstanding balances.`
    )
  }
  
  if (data.earlyPaymentDiscount) {
    additionalTerms.push(
      `Early payment discount of ${data.earlyPaymentDiscount}% available for payment within 7 days of invoice.`
    )
  }
  
  additionalTerms.push(
    'All payments must be made in ' + data.currency + '.',
    'Invoices are sent electronically upon milestone completion or as per agreed schedule.',
    'Refunds are subject to the terms and conditions outlined in the service agreement.'
  )
  
  if (additionalTerms.length > 0) {
    elements.push(
      createSubsectionHeader('Additional Payment Terms'),
      ...createBulletList(additionalTerms, 'arrow'),
      createSpace()
    )
  }
  
  // Custom Payment Terms Text
  if (data.paymentTermsText) {
    elements.push(
      createSpace(),
      createBodyParagraph(data.paymentTermsText, {
        alignment: AlignmentType.JUSTIFIED,
        spacingAfter: 240,
      })
    )
  }
  
  return elements
}

function createPaymentScheduleTable(schedule: PaymentScheduleItem[], currency: string): Table {
  const headerRow = new TableRow({
    children: [
      createPaymentHeader('Phase', 25),
      createPaymentHeader('Description', 35),
      createPaymentHeader('%', 10, AlignmentType.CENTER),
      createPaymentHeader('Amount', 15, AlignmentType.RIGHT),
      createPaymentHeader('Due Date', 15, AlignmentType.CENTER),
    ],
    tableHeader: true,
  })
  
  const dataRows = schedule.map((payment, index) => {
    const dueDateText = formatDueDate(payment.dueDate, payment.customDate)
    
    return new TableRow({
      children: [
        // Phase Title
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: payment.title,
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
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
        
        // Description
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: payment.description || '',
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
        
        // Percentage
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${payment.percentage}%`,
                  bold: true,
                  size: TYPOGRAPHY.BODY.size,
                  color: ISO_COLORS.PRIMARY,
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
          width: { size: 10, type: WidthType.PERCENTAGE },
        }),
        
        // Amount
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: formatCurrency(payment.amount, currency),
                  bold: true,
                  size: TYPOGRAPHY.BODY.size,
                  color: ISO_COLORS.ACCENT,
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
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
        
        // Due Date
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: dueDateText,
                  size: TYPOGRAPHY.SMALL.size,
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
          width: { size: 15, type: WidthType.PERCENTAGE },
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

function createPaymentHeader(text: string, width: number, alignment: typeof AlignmentType[keyof typeof AlignmentType] = AlignmentType.LEFT): TableCell {
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

function formatDueDate(dueDate: string, customDate?: string): string {
  switch (dueDate) {
    case 'onSigning':
      return 'Upon Signing'
    case 'milestone':
      return 'Milestone Complete'
    case 'net15':
      return 'Net 15 Days'
    case 'net30':
      return 'Net 30 Days'
    case 'net60':
      return 'Net 60 Days'
    case 'custom':
      return customDate ? formatDate(customDate, 'short') : 'Custom'
    default:
      return 'TBD'
  }
}
