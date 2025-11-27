import PDFDocument from 'pdfkit'
import { Readable } from 'stream'

interface QuoteData {
  quoteNumber: string
  title: string
  clientName: string
  clientEmail: string
  clientCompany?: string
  clientPhone?: string
  clientAddress?: string
  companyName: string
  companyAddress?: string
  companyEmail?: string
  companyPhone?: string
  lineItems: Array<{
    name: string
    description?: string
    quantity: number
    unitPrice: number
  }>
  subtotal: number
  tax: number
  total: number
  currency: string
  createdAt: Date
  validUntil: Date
  terms?: string
}

const formatCurrency = (amount: number, currency: string = 'USD') => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    GHS: 'GH₵',
  }
  return `${symbols[currency] || currency}${amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}

// ==================== TEMPLATE 1: MODERN CORPORATE ====================
export function generateModernCorporatePDF(quote: QuoteData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'A4', 
      margins: { top: 40, bottom: 40, left: 40, right: 40 }
    })
    
    const buffers: Buffer[] = []
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    const BLUE = '#0047AB'
    const GRAY = '#E5E7EB'
    const DARK_GRAY = '#333333'

    // Header
    doc.fontSize(16).fillColor(BLUE).font('Helvetica-Bold')
       .text(quote.companyName, 40, 40)
    
    doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
       .text(quote.companyAddress || '', 40, 65)
       .text(quote.companyEmail || '', 40, 78)
       .text(quote.companyPhone || '', 40, 91)

    // Logo placeholder
    doc.rect(460, 40, 120, 50).stroke()
    doc.fontSize(10).fillColor(BLUE).text('Company Logo', 475, 60)

    // Blue line
    doc.moveTo(40, 110).lineTo(555, 110).strokeColor(BLUE).lineWidth(2).stroke()

    // Title
    doc.fontSize(32).fillColor(BLUE).font('Helvetica-Bold')
       .text(quote.title.toUpperCase(), 40, 130, { align: 'right' })

    // Bill To Section
    let yPos = 190
    doc.fontSize(12).fillColor(BLUE).font('Helvetica-Bold')
       .text('Bill To', 40, yPos)
    
    yPos += 20
    doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
       .text(quote.clientName, 40, yPos)
    yPos += 15
    if (quote.clientCompany) {
      doc.text(quote.clientCompany, 40, yPos)
      yPos += 15
    }
    doc.text(quote.clientAddress || 'N/A', 40, yPos)
    yPos += 15
    doc.text(quote.clientEmail, 40, yPos)

    // Quote Details Box
    const detailsX = 380
    let detailsY = 190
    doc.fontSize(10).fillColor(BLUE).font('Helvetica-Bold')
       .text('Quote #', detailsX, detailsY)
    doc.fillColor(DARK_GRAY).font('Helvetica')
       .text(quote.quoteNumber, detailsX + 120, detailsY, { align: 'right' })
    
    detailsY += 20
    doc.fillColor(BLUE).font('Helvetica-Bold')
       .text('Quote date', detailsX, detailsY)
    doc.fillColor(DARK_GRAY).font('Helvetica')
       .text(formatDate(quote.createdAt), detailsX + 120, detailsY, { align: 'right' })
    
    detailsY += 20
    doc.fillColor(BLUE).font('Helvetica-Bold')
       .text('Due date', detailsX, detailsY)
    doc.fillColor(DARK_GRAY).font('Helvetica')
       .text(formatDate(quote.validUntil), detailsX + 120, detailsY, { align: 'right' })

    // Table
    yPos = 300
    const tableTop = yPos
    const col1X = 40
    const col2X = 90
    const col3X = 350
    const col4X = 460

    // Table Header
    doc.rect(40, yPos, 515, 30).fillAndStroke(BLUE, BLUE)
    doc.fontSize(11).fillColor('white').font('Helvetica-Bold')
       .text('QTY', col1X + 5, yPos + 10)
       .text('Description', col2X + 5, yPos + 10)
       .text('Unit Price', col3X + 5, yPos + 10)
       .text('Amount', col4X + 5, yPos + 10)

    yPos += 30

    // Table Rows
    quote.lineItems.forEach((item, index) => {
      if (yPos > 700) {
        doc.addPage()
        yPos = 40
      }

      if (index % 2 === 0) {
        doc.rect(40, yPos, 515, 25).fillColor('#F9FAFB').fill()
      }

      doc.fontSize(10).fillColor(DARK_GRAY).font('Helvetica')
         .text(item.quantity.toString(), col1X + 5, yPos + 8)
         .text(item.name, col2X + 5, yPos + 8, { width: 250 })
         .text(formatCurrency(item.unitPrice, quote.currency), col3X + 5, yPos + 8)
         .text(formatCurrency(item.quantity * item.unitPrice, quote.currency), col4X + 5, yPos + 8)

      yPos += 25
      doc.moveTo(40, yPos).lineTo(555, yPos).strokeColor(GRAY).lineWidth(1).stroke()
    })

    // Totals
    yPos += 20
    const totalsX = 350
    
    doc.fontSize(11).fillColor(DARK_GRAY).font('Helvetica-Bold')
       .text('Subtotal', totalsX, yPos)
    doc.text(formatCurrency(quote.subtotal, quote.currency), totalsX + 150, yPos, { align: 'right' })
    
    if (quote.tax > 0) {
      yPos += 20
      doc.text('Sales Tax (5%)', totalsX, yPos)
      doc.text(formatCurrency(quote.tax, quote.currency), totalsX + 150, yPos, { align: 'right' })
    }

    yPos += 25
    doc.rect(totalsX - 10, yPos - 5, 215, 35).fillAndStroke(BLUE, BLUE)
    doc.fontSize(14).fillColor('white').font('Helvetica-Bold')
       .text(`Total (${quote.currency})`, totalsX, yPos + 5)
    doc.fontSize(16)
       .text(formatCurrency(quote.total, quote.currency), totalsX + 150, yPos + 5, { align: 'right' })

    // Terms
    yPos += 60
    doc.fontSize(12).fillColor(BLUE).font('Helvetica-Bold')
       .text('Terms and Conditions', 40, yPos)
    
    yPos += 20
    doc.fontSize(9).fillColor('#666666').font('Helvetica')
       .text(quote.terms || 'Payment is due in 14 days. Please make checks payable to: ' + quote.companyName, 
             40, yPos, { width: 515, lineGap: 3 })

    // Signature
    if (yPos + 80 < 750) {
      yPos += 60
      doc.moveTo(40, yPos).lineTo(290, yPos).strokeColor(DARK_GRAY).lineWidth(1).stroke()
      yPos += 10
      doc.fontSize(9).fillColor(BLUE).text('customer signature', 40, yPos)
    }

    doc.end()
  })
}

// ==================== TEMPLATE 2: MINIMALIST CLEAN ====================
export function generateMinimalistCleanPDF(quote: QuoteData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'A4', 
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    })
    
    const buffers: Buffer[] = []
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    const BLUE = '#0066CC'
    const YELLOW = '#FFB800'
    const GRAY = '#666666'

    // Title
    doc.fontSize(28).fillColor(BLUE).font('Helvetica-Bold')
       .text('WEBSITE QUOTATION', 50, 50, { align: 'center' })
    
    doc.fontSize(11).fillColor(GRAY).font('Helvetica')
       .text(`RE: ${quote.title}`, 50, 90, { align: 'center' })

    // Divider
    doc.moveTo(50, 120).lineTo(150, 120).strokeColor(BLUE).lineWidth(1).stroke()

    // Parties Section
    let yPos = 140
    doc.fontSize(10).fillColor(GRAY).font('Helvetica-Bold')
       .text('PARTIES', 50, yPos)
    
    yPos += 20
    doc.font('Helvetica-Bold').text('From:', 50, yPos)
    yPos += 15
    doc.font('Helvetica').text(quote.companyName, 50, yPos)
    yPos += 15
    doc.text(`Principal Place of Business:`, 50, yPos)
    yPos += 15
    doc.text(quote.companyAddress || '', 50, yPos)

    yPos += 25
    doc.font('Helvetica-Bold').text('To:', 50, yPos)
    yPos += 15
    doc.font('Helvetica').text(quote.clientName, 50, yPos)
    if (quote.clientCompany) {
      yPos += 15
      doc.text(quote.clientCompany, 50, yPos)
    }
    yPos += 15
    doc.text(quote.clientEmail, 50, yPos)

    // Divider
    yPos += 20
    doc.moveTo(50, yPos).lineTo(150, yPos).strokeColor(BLUE).lineWidth(1).stroke()

    // Background Section
    yPos += 25
    doc.fontSize(10).fillColor(GRAY).font('Helvetica-Bold')
       .text('BACKGROUND', 50, yPos)
    
    yPos += 20
    // Yellow highlight box
    doc.rect(50, yPos, 495, 60).fillColor('#FFF9E6').fill()
    doc.moveTo(50, yPos).lineTo(50, yPos + 60).strokeColor(YELLOW).lineWidth(3).stroke()
    
    doc.fontSize(10).fillColor('#333333').font('Helvetica')
       .text(`${quote.companyName} is a specialized development firm with expertise in creating high-quality digital solutions. We are pleased to provide this comprehensive quotation for ${quote.clientName}.`,
             60, yPos + 15, { width: 475, lineGap: 3 })

    // Table
    yPos += 85
    const tableTop = yPos
    const col1X = 50
    const col2X = 100
    const col3X = 350
    const col4X = 460

    // Table border
    doc.rect(50, yPos, 495, 30).fillColor('#F9FAFB').fill()
    doc.rect(50, yPos, 495, 30).stroke()

    doc.fontSize(10).fillColor(GRAY).font('Helvetica-Bold')
       .text('QTY', col1X + 5, yPos + 10)
       .text('Description', col2X + 5, yPos + 10)
       .text('Rate', col3X + 5, yPos + 10)
       .text('Amount', col4X + 5, yPos + 10)

    yPos += 30

    // Table Rows
    quote.lineItems.forEach((item, index) => {
      doc.fontSize(10).fillColor('#333333').font('Helvetica')
         .text(item.quantity.toString(), col1X + 5, yPos + 8)
         .text(item.name, col2X + 5, yPos + 8, { width: 240 })
         .text(formatCurrency(item.unitPrice, quote.currency), col3X + 5, yPos + 8)
         .text(formatCurrency(item.quantity * item.unitPrice, quote.currency), col4X + 5, yPos + 8)

      yPos += 25
      doc.moveTo(50, yPos).lineTo(545, yPos).strokeColor('#E5E7EB').lineWidth(1).stroke()
    })

    // Totals
    yPos += 20
    const totalsX = 300
    
    doc.fontSize(11).fillColor('#333333').font('Helvetica-Bold')
       .text('Subtotal', totalsX, yPos)
    doc.text(formatCurrency(quote.subtotal, quote.currency), totalsX + 195, yPos, { align: 'right' })
    yPos += 20
    doc.moveTo(totalsX, yPos).lineTo(545, yPos).strokeColor('#E5E7EB').lineWidth(1).stroke()

    if (quote.tax > 0) {
      yPos += 20
      doc.text('Tax', totalsX, yPos)
      doc.text(formatCurrency(quote.tax, quote.currency), totalsX + 195, yPos, { align: 'right' })
      yPos += 20
      doc.moveTo(totalsX, yPos).lineTo(545, yPos).strokeColor('#E5E7EB').lineWidth(1).stroke()
    }

    yPos += 20
    doc.rect(totalsX - 10, yPos - 5, 255, 35).fillAndStroke(BLUE, BLUE)
    doc.fontSize(14).fillColor('white').font('Helvetica-Bold')
       .text('Total', totalsX, yPos + 5)
    doc.fontSize(16)
       .text(formatCurrency(quote.total, quote.currency), totalsX + 195, yPos + 5, { align: 'right' })

    doc.end()
  })
}

// ==================== TEMPLATE 3: VIBRANT GRADIENT ====================
export function generateVibrantGradientPDF(quote: QuoteData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'A4', 
      margins: { top: 0, bottom: 40, left: 40, right: 40 }
    })
    
    const buffers: Buffer[] = []
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    const PURPLE = '#667eea'
    const GREEN = '#10b981'
    const GRAY_BG = '#F9FAFB'

    // Purple Header Background
    doc.rect(0, 0, 595, 120).fillColor(PURPLE).fill()

    // Company Info Box
    doc.roundedRect(50, 30, 495, 70, 5).fillColor('rgba(255, 255, 255, 0.95)').fill()
    
    doc.fontSize(18).fillColor(PURPLE).font('Helvetica-Bold')
       .text(quote.companyName, 70, 45)
    
    doc.fontSize(11).fillColor('#666666').font('Helvetica')
       .text('Quotation', 70, 68)

    // Quote Number Badge
    doc.roundedRect(430, 50, 95, 30, 5).fillAndStroke(GREEN, GREEN)
    doc.fontSize(10).fillColor('white').font('Helvetica-Bold')
       .text(`Quote #${quote.quoteNumber}`, 430, 60, { width: 95, align: 'center' })

    // Info Grid
    let yPos = 150
    
    // Quotation By Box
    doc.roundedRect(50, yPos, 235, 80, 5).fillColor(GRAY_BG).fill()
    doc.fontSize(9).fillColor(PURPLE).font('Helvetica-Bold')
       .text('QUOTATION BY', 65, yPos + 15)
    doc.fontSize(9).fillColor('#333333').font('Helvetica')
       .text(quote.companyName, 65, yPos + 30)
       .text(quote.companyAddress || '', 65, yPos + 43, { width: 205 })
       .text(quote.companyEmail || '', 65, yPos + 56)

    // Quotation To Box
    doc.roundedRect(310, yPos, 235, 80, 5).fillColor(GRAY_BG).fill()
    doc.fontSize(9).fillColor(PURPLE).font('Helvetica-Bold')
       .text('QUOTATION TO', 325, yPos + 15)
    doc.fontSize(9).fillColor('#333333').font('Helvetica')
       .text(quote.clientName, 325, yPos + 30)
    if (quote.clientCompany) {
      doc.text(quote.clientCompany, 325, yPos + 43)
    }
    doc.text(quote.clientEmail, 325, yPos + (quote.clientCompany ? 56 : 43))

    // Dates
    yPos += 100
    doc.fontSize(9).fillColor('#666666').font('Helvetica')
       .text(`Quotation Date: ${formatDate(quote.createdAt)}`, 50, yPos)
       .text(`Due Date: ${formatDate(quote.validUntil)}`, 310, yPos)

    yPos += 15
    doc.moveTo(50, yPos).lineTo(545, yPos).strokeColor('#E5E7EB').lineWidth(1).stroke()

    // Table
    yPos += 25
    const col1X = 50
    const col2X = 100
    const col3X = 350
    const col4X = 460

    // Table Header
    doc.rect(50, yPos, 495, 30).fillAndStroke(PURPLE, PURPLE)
    doc.fontSize(10).fillColor('white').font('Helvetica-Bold')
       .text('QTY', col1X + 5, yPos + 10)
       .text('DESCRIPTION', col2X + 5, yPos + 10)
       .text('RATE', col3X + 5, yPos + 10)
       .text('AMOUNT', col4X + 5, yPos + 10)

    yPos += 30

    // Table Rows
    quote.lineItems.forEach((item, index) => {
      const rowBg = index % 2 === 0 ? '#FFFFFF' : GRAY_BG
      doc.rect(50, yPos, 495, 25).fillColor(rowBg).fill()

      doc.fontSize(10).fillColor('#333333').font('Helvetica')
         .text(item.quantity.toString(), col1X + 5, yPos + 8)
         .text(item.name, col2X + 5, yPos + 8, { width: 240 })
         .text(formatCurrency(item.unitPrice, quote.currency), col3X + 5, yPos + 8)
         .text(formatCurrency(item.quantity * item.unitPrice, quote.currency), col4X + 5, yPos + 8)

      yPos += 25
      if (index < quote.lineItems.length - 1) {
        doc.moveTo(50, yPos).lineTo(545, yPos).strokeColor('#E5E7EB').lineWidth(1).stroke()
      }
    })

    // Totals Box
    yPos += 25
    doc.roundedRect(250, yPos, 295, 90, 5).fillColor(GRAY_BG).fill()

    yPos += 15
    doc.fontSize(11).fillColor('#666666').font('Helvetica')
       .text('Sub Total', 270, yPos)
    doc.fontSize(11).fillColor('#333333').font('Helvetica-Bold')
       .text(formatCurrency(quote.subtotal, quote.currency), 270, yPos, { width: 255, align: 'right' })

    if (quote.tax > 0) {
      yPos += 20
      doc.fontSize(11).fillColor('#666666').font('Helvetica')
         .text('Discount/VAT', 270, yPos)
      doc.fontSize(11).fillColor('#333333').font('Helvetica-Bold')
         .text(formatCurrency(quote.tax, quote.currency), 270, yPos, { width: 255, align: 'right' })
    }

    yPos += 25
    doc.roundedRect(270, yPos, 255, 35, 5).fillAndStroke(GREEN, GREEN)
    doc.fontSize(14).fillColor('white').font('Helvetica-Bold')
       .text('Total', 285, yPos + 10)
    doc.fontSize(18)
       .text(formatCurrency(quote.total, quote.currency), 285, yPos + 8, { width: 225, align: 'right' })

    doc.end()
  })
}

// Export main function
export async function generateQuotePDF(
  quote: QuoteData, 
  template: 'modern' | 'minimalist' | 'vibrant' = 'modern'
): Promise<Buffer> {
  switch (template) {
    case 'minimalist':
      return generateMinimalistCleanPDF(quote)
    case 'vibrant':
      return generateVibrantGradientPDF(quote)
    case 'modern':
    default:
      return generateModernCorporatePDF(quote)
  }
}
