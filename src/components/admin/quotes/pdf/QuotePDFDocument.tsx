import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { QuoteData, Client } from '../types'
import { formatCurrency, calculateSubtotal, calculateDiscount, calculateTax, calculateTotal } from '../utils'

// Register fonts (optional - using default fonts)
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf', fontWeight: 700 },
  ],
})

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Roboto',
    color: '#1e293b',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #6366f1',
    paddingBottom: 15,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 5,
  },
  companyTagline: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 10,
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 10,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#1e293b',
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 8,
    fontWeight: 'bold',
    borderBottom: '2 solid #cbd5e1',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #e2e8f0',
  },
  tableCol1: { width: '40%' },
  tableCol2: { width: '15%', textAlign: 'center' },
  tableCol3: { width: '15%', textAlign: 'right' },
  tableCol4: { width: '15%', textAlign: 'right' },
  tableCol5: { width: '15%', textAlign: 'right' },
  summaryBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
    border: '1 solid #cbd5e1',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 11,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2 solid #6366f1',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  milestone: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f8fafc',
    borderLeft: '3 solid #6366f1',
  },
  milestoneTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  milestoneText: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 3,
  },
  bullet: {
    fontSize: 8,
    color: '#64748b',
    marginLeft: 10,
    marginBottom: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #e2e8f0',
    paddingTop: 10,
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
  },
  pageNumber: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 5,
  },
})

interface QuotePDFDocumentProps {
  quoteData: QuoteData
  client?: Client
}

export default function QuotePDFDocument({ quoteData, client }: QuotePDFDocumentProps) {
  const subtotal = calculateSubtotal(quoteData.items)
  const discount = calculateDiscount(subtotal, quoteData.discountType, quoteData.discountValue)
  const tax = calculateTax(subtotal, discount, quoteData.taxRate)
  const total = calculateTotal(subtotal, discount, tax)

  return (
    <Document>
      {/* Page 1: Cover & Basic Info */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>MicroAI Systems</Text>
          <Text style={styles.companyTagline}>Advanced Web Development Solutions</Text>
          <Text style={styles.quoteTitle}>Professional Quote</Text>
          <View style={{ marginTop: 10 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Quote Number:</Text>
              <Text style={styles.value}>{quoteData.quoteNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Valid Until:</Text>
              <Text style={styles.value}>{quoteData.validUntil || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          {client && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{client.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{client.email}</Text>
              </View>
              {client.phone && (
                <View style={styles.row}>
                  <Text style={styles.label}>Phone:</Text>
                  <Text style={styles.value}>{client.phone}</Text>
                </View>
              )}
              {client.company && (
                <View style={styles.row}>
                  <Text style={styles.label}>Company:</Text>
                  <Text style={styles.value}>{client.company}</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Project Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Project Title:</Text>
            <Text style={styles.value}>{quoteData.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Project Type:</Text>
            <Text style={styles.value}>{quoteData.projectType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Industry:</Text>
            <Text style={styles.value}>{quoteData.industry}</Text>
          </View>
          {quoteData.estimatedDuration > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Estimated Duration:</Text>
              <Text style={styles.value}>{quoteData.estimatedDuration} days</Text>
            </View>
          )}
        </View>

        {/* Executive Summary */}
        {quoteData.executiveSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{quoteData.executiveSummary}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>MicroAI Systems | Email: contact@microai.com | Phone: +1 (555) 123-4567</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
        </View>
      </Page>

      {/* Page 2: Project Scope */}
      <Page size="A4" style={styles.page}>
        {/* Project Objectives */}
        {quoteData.objectives.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Objectives</Text>
            {quoteData.objectives.map((obj, idx) => (
              <Text key={idx} style={styles.bullet}>• {obj}</Text>
            ))}
          </View>
        )}

        {/* Scope of Work */}
        {quoteData.scope.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scope of Work</Text>
            {quoteData.scope.map((scope: string, idx: number) => (
              <Text key={idx} style={styles.bullet}>• {scope}</Text>
            ))}
          </View>
        )}

        {/* Exclusions */}
        {quoteData.outOfScope.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exclusions / Out of Scope</Text>
            {quoteData.outOfScope.map((exclusion: string, idx: number) => (
              <Text key={idx} style={styles.bullet}>• {exclusion}</Text>
            ))}
          </View>
        )}

        {/* Assumptions */}
        {quoteData.assumptions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assumptions</Text>
            {quoteData.assumptions.map((assumption, idx) => (
              <Text key={idx} style={styles.bullet}>• {assumption}</Text>
            ))}
          </View>
        )}

        {/* Constraints */}
        {quoteData.constraints.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Constraints</Text>
            {quoteData.constraints.map((constraint, idx) => (
              <Text key={idx} style={styles.bullet}>• {constraint}</Text>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text>MicroAI Systems | Email: contact@microai.com | Phone: +1 (555) 123-4567</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
        </View>
      </Page>

      {/* Page 3: Pricing & Line Items */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Breakdown</Text>
          
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableCol1}>Item</Text>
              <Text style={styles.tableCol2}>Qty</Text>
              <Text style={styles.tableCol3}>Unit Price</Text>
              <Text style={styles.tableCol4}>Discount</Text>
              <Text style={styles.tableCol5}>Total</Text>
            </View>

            {/* Table Rows */}
            {quoteData.items.map((item) => {
              const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100)
              return (
                <View key={item.id} style={styles.tableRow}>
                  <View style={styles.tableCol1}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>{item.name}</Text>
                    {item.description && (
                      <Text style={{ fontSize: 8, color: '#64748b' }}>{item.description}</Text>
                    )}
                  </View>
                  <Text style={styles.tableCol2}>{item.quantity}</Text>
                  <Text style={styles.tableCol3}>{formatCurrency(item.unitPrice, quoteData.currency)}</Text>
                  <Text style={styles.tableCol4}>{item.discount}%</Text>
                  <Text style={styles.tableCol5}>{formatCurrency(itemTotal, quoteData.currency)}</Text>
                </View>
              )
            })}
          </View>

          {/* Summary */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal, quoteData.currency)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Discount ({quoteData.discountType === 'percentage' ? `${quoteData.discountValue}%` : 'Fixed'}):
                </Text>
                <Text style={styles.summaryValue}>-{formatCurrency(discount, quoteData.currency)}</Text>
              </View>
            )}
            {tax > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax ({quoteData.taxRate}%):</Text>
                <Text style={styles.summaryValue}>{formatCurrency(tax, quoteData.currency)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>{formatCurrency(total, quoteData.currency)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>MicroAI Systems | Email: contact@microai.com | Phone: +1 (555) 123-4567</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
        </View>
      </Page>

      {/* Page 4: Timeline & Milestones */}
      {quoteData.milestones.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Timeline & Milestones</Text>
            
            {quoteData.startDate && (
              <View style={styles.row}>
                <Text style={styles.label}>Project Start Date:</Text>
                <Text style={styles.value}>{quoteData.startDate}</Text>
              </View>
            )}

            <View style={{ marginTop: 15 }}>
              {quoteData.milestones.map((milestone, idx) => (
                <View key={milestone.id} style={styles.milestone}>
                  <Text style={styles.milestoneTitle}>
                    Milestone {idx + 1}: {milestone.title}
                  </Text>
                  {milestone.description && (
                    <Text style={styles.milestoneText}>{milestone.description}</Text>
                  )}
                  <Text style={styles.milestoneText}>Duration: {milestone.duration} days</Text>
                  <Text style={styles.milestoneText}>Cost Allocation: {milestone.percentage}%</Text>
                  
                  {milestone.deliverables.length > 0 && (
                    <View style={{ marginTop: 5 }}>
                      <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>Deliverables:</Text>
                      {milestone.deliverables.map((del, i) => (
                        <Text key={i} style={styles.bullet}>• {del}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Text>MicroAI Systems | Email: contact@microai.com | Phone: +1 (555) 123-4567</Text>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
          </View>
        </Page>
      )}

      {/* Page 5: Payment Terms & Conditions */}
      <Page size="A4" style={styles.page}>
        {/* Payment Schedule */}
        {quoteData.paymentTerms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Schedule</Text>
            {quoteData.paymentTerms.map((term, idx) => (
              <View key={term.id} style={{ marginBottom: 10 }}>
                <View style={styles.row}>
                  <Text style={styles.label}>{term.title}:</Text>
                  <Text style={styles.value}>
                    {term.percentage}% ({formatCurrency((total * term.percentage) / 100, quoteData.currency)})
                  </Text>
                </View>
                {term.description && (
                  <Text style={{ fontSize: 9, color: '#64748b', marginLeft: 10 }}>{term.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Terms & Conditions */}
        {quoteData.termsAndConditions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.5 }}>{quoteData.termsAndConditions}</Text>
          </View>
        )}

        {/* Warranty */}
        {quoteData.warranties && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Warranty</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.5 }}>{quoteData.warranties}</Text>
          </View>
        )}

        {/* Support */}
        {quoteData.supportTerms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support Terms</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.5 }}>{quoteData.supportTerms}</Text>
          </View>
        )}

        {/* Acceptance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acceptance</Text>
          <Text style={{ fontSize: 9, lineHeight: 1.5, marginBottom: 30 }}>
            By signing below, you agree to the terms and conditions outlined in this quote.
          </Text>
          
          <View style={{ marginTop: 20, borderTop: '1 solid #cbd5e1', paddingTop: 5, width: '45%' }}>
            <Text style={{ fontSize: 9 }}>Client Signature</Text>
          </View>
          
          <View style={{ marginTop: 20, borderTop: '1 solid #cbd5e1', paddingTop: 5, width: '45%' }}>
            <Text style={{ fontSize: 9 }}>Date</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>MicroAI Systems | Email: contact@microai.com | Phone: +1 (555) 123-4567</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
        </View>
      </Page>
    </Document>
  )
}
