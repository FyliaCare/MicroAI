#!/usr/bin/env tsx

/**
 * Test Quote PDF Generation
 * Tests the actual PDF rendering functionality
 */

import { PrismaClient } from '@prisma/client'
import React from 'react'
import ReactPDF from '@react-pdf/renderer'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function testPDFGeneration() {
  try {
    console.log('🧪 Testing Quote PDF Generation...\n')

    // Find a quote to test with
    const quote = await prisma.quote.findFirst({
      where: {
        items: { not: null }
      },
      include: {
        Client: true,
      },
    })

    if (!quote) {
      console.log('❌ No quotes found in database')
      console.log('💡 Create a quote first using the quote system')
      return
    }

    console.log('✅ Found quote:', quote.quoteNumber)
    console.log('   Title:', quote.title)
    console.log('   Client:', quote.clientName || quote.Client?.name)
    console.log('   Total:', quote.total)

    // Parse JSON fields
    const parseJSON = (str: string | null) => {
      if (!str) return []
      try {
        const parsed = JSON.parse(str)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        return []
      }
    }

    // Prepare quote data
    const lineItems = parseJSON(quote.items as any)
    const scopeItems = parseJSON(quote.scopeOfWork as any)
    const exclusions = parseJSON(quote.exclusions as any)
    const assumptions = parseJSON(quote.assumptions as any)
    const deliverables = parseJSON(quote.deliverables as any)
    const milestones = parseJSON(quote.milestones as any)
    const paymentSchedule = parseJSON(quote.paymentTerms as any)

    const quoteData = {
      quoteNumber: quote.quoteNumber,
      title: quote.title,
      description: quote.description || '',
      clientName: quote.clientName || quote.Client?.name || 'Client',
      clientEmail: quote.clientEmail || quote.Client?.email || '',
      clientCompany: quote.clientCompany || quote.Client?.company || undefined,
      clientPhone: quote.clientPhone || quote.Client?.phone || undefined,
      clientAddress: quote.clientAddress || quote.Client?.address || undefined,
      projectType: quote.projectType || undefined,
      executiveSummary: quote.executiveSummary || undefined,
      objectives: [],
      scopeItems: scopeItems,
      scopeOfWork: quote.scopeOfWork || undefined,
      exclusions: exclusions,
      assumptions: assumptions,
      deliverables: deliverables,
      lineItems: lineItems,
      currency: quote.currency || 'USD',
      discountType: (quote.discountType as 'fixed' | 'percentage' | undefined) || 'percentage',
      discountValue: quote.discount || 0,
      taxRate: quote.taxRate || 0,
      subtotal: quote.subtotal || 0,
      discount: quote.discount || 0,
      tax: quote.tax || 0,
      total: quote.total || 0,
      startDate: quote.createdAt?.toISOString(),
      estimatedDuration: quote.estimatedHours || 0,
      milestones: milestones,
      timeline: quote.timeline || undefined,
      paymentSchedule: paymentSchedule,
      depositRequired: (quote.depositPercent || 0) > 0,
      depositPercentage: quote.depositPercent || 0,
      depositPercent: quote.depositPercent || undefined,
      depositAmount: quote.depositAmount || undefined,
      acceptedPaymentMethods: ['bank-transfer', 'credit-card', 'paypal'],
      termsAndConditions: quote.terms || undefined,
      terms: quote.terms || undefined,
      validUntil: quote.validUntil?.toISOString(),
      warranties: undefined,
      supportTerms: quote.maintenanceTerms || undefined,
      maintenanceTerms: quote.maintenanceTerms || undefined,
      revisionPolicy: quote.revisionsPolicy || undefined,
      revisionsPolicy: quote.revisionsPolicy || undefined,
      cancellationPolicy: undefined,
      confidentialityClause: quote.confidentialityClause || undefined,
      ipRights: quote.ipRights || undefined,
      paymentTerms: quote.paymentTerms || undefined,
      brandColor: '#6366f1',
      includeLogo: true,
      includePortfolio: false,
      customMessage: undefined,
      footerText: undefined,
      companyLogo: quote.companyLogo || undefined,
      companyName: quote.companyName || 'MicroAI Systems',
      companyAddress: quote.companyAddress || 'BR253 Pasture St. Takoradi, Ghana',
      companyEmail: quote.companyEmail || 'sales@microaisystems.com',
      companyPhone: quote.companyPhone || '+233 244486837',
      companyWebsite: quote.companyWebsite || 'www.microaisystems.com',
      status: quote.status,
      issuedAt: quote.issuedAt || quote.createdAt,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
      clientSignature: quote.clientSignature || undefined,
      clientSignedBy: quote.clientSignedBy || undefined,
      clientSignedAt: quote.clientSignedAt || undefined,
      providerSignature: quote.providerSignature || undefined,
      providerSignedBy: quote.providerSignedBy || undefined,
      providerSignedAt: quote.providerSignedAt || undefined,
      freeSupportMonths: quote.freeSupportMonths || 1,
      includedRevisions: quote.includedRevisions || 2,
    }

    console.log('\n📊 Quote data prepared:')
    console.log('   Line items:', lineItems.length)
    console.log('   Scope items:', scopeItems.length)
    console.log('   Milestones:', milestones.length)

    // Try to import and render the PDF component
    console.log('\n🔄 Attempting PDF generation...')
    
    try {
      // Dynamic import to avoid compilation issues
      const QuotePDFNew = (await import('../src/components/admin/quotes/pdf/QuotePDFNew')).default
      
      console.log('✅ PDF component imported successfully')
      
      // Render the PDF using stream
      const stream = await ReactPDF.renderToStream(
        React.createElement(QuotePDFNew, { quote: quoteData }) as React.ReactElement
      )
      
      // Convert stream to buffer
      const chunks: Buffer[] = []
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk))
      }
      const pdfBuffer = Buffer.concat(chunks)
      
      console.log('✅ PDF rendered successfully!')
      console.log('   Buffer size:', pdfBuffer.length, 'bytes')
      console.log('   Size:', (pdfBuffer.length / 1024).toFixed(2), 'KB')

      // Save to file for inspection
      const timestamp = new Date().getTime()
      const outputPath = path.join(process.cwd(), `test-quote-${timestamp}.pdf`)
      fs.writeFileSync(outputPath, pdfBuffer)
      console.log('\n💾 PDF saved to:', outputPath)
      console.log('✅ You can open this file to verify the PDF was generated correctly')

    } catch (renderError) {
      console.error('\n❌ PDF Rendering Error:')
      console.error('   Error:', renderError instanceof Error ? renderError.message : String(renderError))
      if (renderError instanceof Error && renderError.stack) {
        console.error('\n   Stack trace:')
        console.error(renderError.stack)
      }
      throw renderError
    }

    console.log('\n✅ PDF generation test completed successfully!')

  } catch (error) {
    console.error('\n❌ Test failed:')
    console.error(error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testPDFGeneration()
