import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font,
  Image,
  Link,
  pdf,
} from '@react-pdf/renderer'

// Register fonts for better typography
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 },
  ],
})

// ==================== TEMPLATE 1: MODERN CORPORATE ====================
const stylesModern = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#0047AB',
  },
  companyInfo: {
    fontSize: 10,
    color: '#333333',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0047AB',
    marginBottom: 5,
  },
  uploadBox: {
    width: 120,
    height: 50,
    borderWidth: 2,
    borderColor: '#0047AB',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#0047AB',
    textAlign: 'right',
    marginBottom: 30,
    letterSpacing: 2,
  },
  billToSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  billTo: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0047AB',
    marginBottom: 5,
  },
  text: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 3,
  },
  quoteDetails: {
    width: 200,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: '#0047AB',
  },
  detailValue: {
    fontSize: 10,
    color: '#333333',
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0047AB',
    padding: 10,
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 10,
  },
  col1: { width: '10%' },
  col2: { width: '50%' },
  col3: { width: '20%' },
  col4: { width: '20%' },
  headerText: {
    fontSize: 11,
    fontWeight: 700,
    color: '#ffffff',
  },
  cellText: {
    fontSize: 10,
    color: '#333333',
  },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    width: 250,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  grandTotalRow: {
    flexDirection: 'row',
    width: 250,
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#0047AB',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 600,
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 600,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#ffffff',
  },
  termsSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0047AB',
    marginBottom: 10,
  },
  termsText: {
    fontSize: 9,
    color: '#666666',
    lineHeight: 1.5,
  },
  signatureSection: {
    marginTop: 40,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  signatureLine: {
    width: 250,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    marginTop: 30,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#0047AB',
    marginTop: 5,
  },
})

// ==================== TEMPLATE 2: MINIMALIST CLEAN ====================
const stylesMinimalist = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#0066CC',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#333333',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.6,
    marginBottom: 3,
  },
  highlightBox: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB800',
  },
  highlightText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.6,
  },
  table: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 12,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  col1: { width: '10%' },
  col2: { width: '50%' },
  col3: { width: '20%' },
  col4: { width: '20%' },
  headerText: {
    fontSize: 10,
    fontWeight: 700,
    color: '#666666',
  },
  cellText: {
    fontSize: 10,
    color: '#333333',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#0066CC',
    marginVertical: 15,
    width: 100,
  },
})

// ==================== TEMPLATE 3: VIBRANT GRADIENT ====================
const stylesVibrant = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
  },
  gradientHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 40,
    marginBottom: 30,
  },
  headerContent: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 25,
    borderRadius: 10,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 700,
    color: '#667eea',
    marginBottom: 5,
  },
  quotationTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  content: {
    padding: 40,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoBox: {
    width: '48%',
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#667eea',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoText: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 3,
  },
  table: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    padding: 12,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  alternateRow: {
    backgroundColor: '#f9fafb',
  },
  col1: { width: '10%' },
  col2: { width: '50%' },
  col3: { width: '20%' },
  col4: { width: '20%' },
  headerText: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ffffff',
  },
  cellText: {
    fontSize: 10,
    color: '#333333',
  },
  totalSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#10b981',
    borderRadius: 6,
    marginTop: 10,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 700,
    color: '#ffffff',
  },
})

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

// Helper function
const formatCurrency = (amount: number, currency: string = 'USD') => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    GHS: 'GH₵',
  }
  return `${symbols[currency] || currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// ==================== TEMPLATE 1: MODERN CORPORATE ====================
export const Template1Modern = ({ quote }: { quote: QuoteData }) => (
  <Document>
    <Page size="A4" style={stylesModern.page}>
      {/* Header */}
      <View style={stylesModern.header}>
        <View>
          <Text style={stylesModern.companyName}>{quote.companyName}</Text>
          <Text style={stylesModern.companyInfo}>{quote.companyAddress}</Text>
          <Text style={stylesModern.companyInfo}>{quote.companyEmail}</Text>
          <Text style={stylesModern.companyInfo}>{quote.companyPhone}</Text>
        </View>
        <View style={stylesModern.uploadBox}>
          <Text style={{ fontSize: 10, color: '#0047AB' }}>Company Logo</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={stylesModern.title}>{quote.title.toUpperCase()}</Text>

      {/* Bill To & Quote Details */}
      <View style={stylesModern.billToSection}>
        <View style={stylesModern.billTo}>
          <Text style={stylesModern.label}>Bill To</Text>
          <Text style={stylesModern.text}>{quote.clientName}</Text>
          {quote.clientCompany && <Text style={stylesModern.text}>{quote.clientCompany}</Text>}
          <Text style={stylesModern.text}>{quote.clientAddress || 'N/A'}</Text>
          <Text style={stylesModern.text}>{quote.clientEmail}</Text>
        </View>

        <View style={stylesModern.quoteDetails}>
          <View style={stylesModern.detailRow}>
            <Text style={stylesModern.detailLabel}>Quote #</Text>
            <Text style={stylesModern.detailValue}>{quote.quoteNumber}</Text>
          </View>
          <View style={stylesModern.detailRow}>
            <Text style={stylesModern.detailLabel}>Quote date</Text>
            <Text style={stylesModern.detailValue}>{formatDate(quote.createdAt)}</Text>
          </View>
          <View style={stylesModern.detailRow}>
            <Text style={stylesModern.detailLabel}>Due date</Text>
            <Text style={stylesModern.detailValue}>{formatDate(quote.validUntil)}</Text>
          </View>
        </View>
      </View>

      {/* Table */}
      <View style={stylesModern.table}>
        <View style={stylesModern.tableHeader}>
          <Text style={[stylesModern.headerText, stylesModern.col1]}>QTY</Text>
          <Text style={[stylesModern.headerText, stylesModern.col2]}>Description</Text>
          <Text style={[stylesModern.headerText, stylesModern.col3]}>Unit Price</Text>
          <Text style={[stylesModern.headerText, stylesModern.col4]}>Amount</Text>
        </View>

        {quote.lineItems.map((item, index) => (
          <View key={index} style={stylesModern.tableRow}>
            <Text style={[stylesModern.cellText, stylesModern.col1]}>{item.quantity}</Text>
            <Text style={[stylesModern.cellText, stylesModern.col2]}>{item.name}</Text>
            <Text style={[stylesModern.cellText, stylesModern.col3]}>{formatCurrency(item.unitPrice, quote.currency)}</Text>
            <Text style={[stylesModern.cellText, stylesModern.col4]}>{formatCurrency(item.quantity * item.unitPrice, quote.currency)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={stylesModern.totalsSection}>
        <View style={stylesModern.totalRow}>
          <Text style={stylesModern.totalLabel}>Subtotal</Text>
          <Text style={stylesModern.totalValue}>{formatCurrency(quote.subtotal, quote.currency)}</Text>
        </View>
        {quote.tax > 0 && (
          <View style={stylesModern.totalRow}>
            <Text style={stylesModern.totalLabel}>Sales Tax (5%)</Text>
            <Text style={stylesModern.totalValue}>{formatCurrency(quote.tax, quote.currency)}</Text>
          </View>
        )}
        <View style={stylesModern.grandTotalRow}>
          <Text style={stylesModern.grandTotalLabel}>Total ({quote.currency})</Text>
          <Text style={stylesModern.grandTotalValue}>{formatCurrency(quote.total, quote.currency)}</Text>
        </View>
      </View>

      {/* Terms */}
      <View style={stylesModern.termsSection}>
        <Text style={stylesModern.termsTitle}>Terms and Conditions</Text>
        <Text style={stylesModern.termsText}>
          {quote.terms || 'Payment is due in 14 days. Please make checks payable to: ' + quote.companyName}
        </Text>
      </View>

      {/* Signature */}
      <View style={stylesModern.signatureSection}>
        <View style={stylesModern.signatureLine} />
        <Text style={stylesModern.signatureLabel}>customer signature</Text>
      </View>
    </Page>
  </Document>
)

// ==================== TEMPLATE 2: MINIMALIST CLEAN ====================
export const Template2Minimalist = ({ quote }: { quote: QuoteData }) => (
  <Document>
    <Page size="A4" style={stylesMinimalist.page}>
      {/* Header */}
      <View style={stylesMinimalist.header}>
        <Text style={stylesMinimalist.title}>WEBSITE QUOTATION</Text>
        <Text style={stylesMinimalist.subtitle}>RE: {quote.title}</Text>
      </View>

      {/* Parties */}
      <View style={stylesMinimalist.section}>
        <Text style={stylesMinimalist.sectionTitle}>Parties</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={[stylesMinimalist.text, { fontWeight: 600 }]}>From:</Text>
          <Text style={stylesMinimalist.text}>{quote.companyName}</Text>
          <Text style={stylesMinimalist.text}>Principal Place of Business:</Text>
          <Text style={stylesMinimalist.text}>{quote.companyAddress}</Text>
        </View>
        <View>
          <Text style={[stylesMinimalist.text, { fontWeight: 600 }]}>To:</Text>
          <Text style={stylesMinimalist.text}>{quote.clientName}</Text>
          {quote.clientCompany && <Text style={stylesMinimalist.text}>{quote.clientCompany}</Text>}
          <Text style={stylesMinimalist.text}>{quote.clientEmail}</Text>
        </View>
      </View>

      <View style={stylesMinimalist.divider} />

      {/* Background */}
      <View style={stylesMinimalist.section}>
        <Text style={stylesMinimalist.sectionTitle}>BACKGROUND</Text>
        <View style={stylesMinimalist.highlightBox}>
          <Text style={stylesMinimalist.highlightText}>
            {quote.companyName} is a specialized development firm with expertise in creating high-quality digital solutions. 
            We are pleased to provide this comprehensive quotation for {quote.clientName}.
          </Text>
        </View>
      </View>

      {/* Quotation Details */}
      <View style={stylesMinimalist.section}>
        <Text style={stylesMinimalist.sectionTitle}>QUOTATION DETAILS</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ width: '48%' }}>
            <Text style={[stylesMinimalist.text, { fontWeight: 600 }]}>Validity Period:</Text>
            <Text style={stylesMinimalist.text}>{formatDate(quote.validUntil)}</Text>
          </View>
          <View style={{ width: '48%' }}>
            <Text style={[stylesMinimalist.text, { fontWeight: 600 }]}>Payment Terms:</Text>
            <Text style={stylesMinimalist.text}>As per schedule</Text>
          </View>
        </View>
      </View>

      {/* Line Items Table */}
      <View style={stylesMinimalist.table}>
        <View style={stylesMinimalist.tableHeader}>
          <Text style={[stylesMinimalist.headerText, stylesMinimalist.col1]}>QTY</Text>
          <Text style={[stylesMinimalist.headerText, stylesMinimalist.col2]}>Description</Text>
          <Text style={[stylesMinimalist.headerText, stylesMinimalist.col3]}>Rate</Text>
          <Text style={[stylesMinimalist.headerText, stylesMinimalist.col4]}>Amount</Text>
        </View>

        {quote.lineItems.map((item, index) => (
          <View key={index} style={stylesMinimalist.tableRow}>
            <Text style={[stylesMinimalist.cellText, stylesMinimalist.col1]}>{item.quantity}</Text>
            <Text style={[stylesMinimalist.cellText, stylesMinimalist.col2]}>{item.name}</Text>
            <Text style={[stylesMinimalist.cellText, stylesMinimalist.col3]}>{formatCurrency(item.unitPrice, quote.currency)}</Text>
            <Text style={[stylesMinimalist.cellText, stylesMinimalist.col4]}>{formatCurrency(item.quantity * item.unitPrice, quote.currency)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={{ marginTop: 20, alignItems: 'flex-end' }}>
        <View style={{ width: 250 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
            <Text style={{ fontSize: 11, fontWeight: 600 }}>Subtotal</Text>
            <Text style={{ fontSize: 11 }}>{formatCurrency(quote.subtotal, quote.currency)}</Text>
          </View>
          {quote.tax > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
              <Text style={{ fontSize: 11, fontWeight: 600 }}>Tax</Text>
              <Text style={{ fontSize: 11 }}>{formatCurrency(quote.tax, quote.currency)}</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, backgroundColor: '#0066CC', paddingHorizontal: 15, marginTop: 5 }}>
            <Text style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>Total</Text>
            <Text style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{formatCurrency(quote.total, quote.currency)}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)

// ==================== TEMPLATE 3: VIBRANT GRADIENT ====================
export const Template3Vibrant = ({ quote }: { quote: QuoteData }) => (
  <Document>
    <Page size="A4" style={stylesVibrant.page}>
      {/* Gradient Header - simulated with purple background */}
      <View style={{ backgroundColor: '#667eea', padding: 30, marginBottom: 30 }}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: 700, color: '#667eea', marginBottom: 3 }}>
                {quote.companyName}
              </Text>
              <Text style={{ fontSize: 11, color: '#666666' }}>Quotation</Text>
            </View>
            <View style={{ backgroundColor: '#10b981', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 }}>
              <Text style={{ fontSize: 10, color: '#ffffff', fontWeight: 600 }}>Quote #{quote.quoteNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: 40 }}>
        {/* Info Grid */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
          <View style={{ width: '48%', backgroundColor: '#f9fafb', padding: 15, borderRadius: 5 }}>
            <Text style={{ fontSize: 9, fontWeight: 700, color: '#667eea', marginBottom: 8, textTransform: 'uppercase' }}>
              QUOTATION BY
            </Text>
            <Text style={{ fontSize: 9, color: '#333333', marginBottom: 2 }}>{quote.companyName}</Text>
            <Text style={{ fontSize: 8, color: '#666666', marginBottom: 2 }}>{quote.companyAddress}</Text>
            <Text style={{ fontSize: 8, color: '#666666' }}>{quote.companyEmail}</Text>
          </View>

          <View style={{ width: '48%', backgroundColor: '#f9fafb', padding: 15, borderRadius: 5 }}>
            <Text style={{ fontSize: 9, fontWeight: 700, color: '#667eea', marginBottom: 8, textTransform: 'uppercase' }}>
              QUOTATION TO
            </Text>
            <Text style={{ fontSize: 9, color: '#333333', marginBottom: 2 }}>{quote.clientName}</Text>
            {quote.clientCompany && <Text style={{ fontSize: 8, color: '#666666', marginBottom: 2 }}>{quote.clientCompany}</Text>}
            <Text style={{ fontSize: 8, color: '#666666' }}>{quote.clientEmail}</Text>
          </View>
        </View>

        {/* Dates */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
          <View>
            <Text style={{ fontSize: 9, color: '#666666' }}>Quotation Date: {formatDate(quote.createdAt)}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 9, color: '#666666' }}>Due Date: {formatDate(quote.validUntil)}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#667eea', padding: 12 }}>
            <Text style={{ width: '10%', fontSize: 10, fontWeight: 700, color: '#ffffff' }}>QTY</Text>
            <Text style={{ width: '50%', fontSize: 10, fontWeight: 700, color: '#ffffff' }}>DESCRIPTION</Text>
            <Text style={{ width: '20%', fontSize: 10, fontWeight: 700, color: '#ffffff' }}>RATE</Text>
            <Text style={{ width: '20%', fontSize: 10, fontWeight: 700, color: '#ffffff' }}>AMOUNT</Text>
          </View>

          {quote.lineItems.map((item, index) => (
            <View 
              key={index} 
              style={{ 
                flexDirection: 'row', 
                padding: 12, 
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                borderBottomWidth: index < quote.lineItems.length - 1 ? 1 : 0,
                borderBottomColor: '#e5e7eb'
              }}
            >
              <Text style={{ width: '10%', fontSize: 10, color: '#333333' }}>{item.quantity}</Text>
              <Text style={{ width: '50%', fontSize: 10, color: '#333333' }}>{item.name}</Text>
              <Text style={{ width: '20%', fontSize: 10, color: '#333333' }}>{formatCurrency(item.unitPrice, quote.currency)}</Text>
              <Text style={{ width: '20%', fontSize: 10, color: '#333333' }}>{formatCurrency(item.quantity * item.unitPrice, quote.currency)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={{ marginTop: 20, alignItems: 'flex-end' }}>
          <View style={{ width: 300, backgroundColor: '#f9fafb', padding: 15, borderRadius: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
              <Text style={{ fontSize: 11, color: '#666666' }}>Sub Total</Text>
              <Text style={{ fontSize: 11, fontWeight: 600 }}>{formatCurrency(quote.subtotal, quote.currency)}</Text>
            </View>
            {quote.tax > 0 && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                <Text style={{ fontSize: 11, color: '#666666' }}>Discount/VAT</Text>
                <Text style={{ fontSize: 11, fontWeight: 600 }}>{formatCurrency(quote.tax, quote.currency)}</Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 15, backgroundColor: '#10b981', borderRadius: 5, marginTop: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>Total</Text>
              <Text style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{formatCurrency(quote.total, quote.currency)}</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)

// Export function to generate PDF based on template choice
export async function generateQuotePDF(quote: QuoteData, template: 'modern' | 'minimalist' | 'vibrant' = 'modern'): Promise<Buffer> {
  let doc
  
  switch (template) {
    case 'minimalist':
      doc = <Template2Minimalist quote={quote} />
      break
    case 'vibrant':
      doc = <Template3Vibrant quote={quote} />
      break
    case 'modern':
    default:
      doc = <Template1Modern quote={quote} />
      break
  }
  
  const asPdf = pdf(doc)
  const blob = await asPdf.toBlob()
  const arrayBuffer = await blob.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
