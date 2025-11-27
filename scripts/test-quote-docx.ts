#!/usr/bin/env tsx

/**
 * Test Quote Word Document Generation
 * Tests the PDF-matching DOCX generation directly
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { generatePDFMatchQuoteDocx } from '../src/lib/docx/quotePDFMatch'

const prisma = new PrismaClient()

async function testDocxGeneration() {
  try {
    console.log('🧪 Testing Quote DOCX Generation (PDF-Match Template)...\n')

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
    console.log('')

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

    const items = parseJSON(quote.items)
    const milestones = parseJSON(quote.milestones)
    const paymentSchedule: any[] = [] // Payment schedule not in schema yet

    console.log('📊 Quote Data:')
    console.log('   Items:', items.length)
    console.log('   Milestones:', milestones.length)
    console.log('   Payment Schedule:', paymentSchedule.length)
    console.log('')

    // Prepare quote data
    const quoteData = {
      id: quote.id,
      quoteNumber: quote.quoteNumber,
      title: quote.title || '',
      status: quote.status,
      createdAt: quote.createdAt,
      validUntil: quote.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      clientName: quote.clientName || quote.Client?.name || '',
      clientEmail: quote.clientEmail || quote.Client?.email || '',
      clientPhone: quote.clientPhone || quote.Client?.phone || '',
      clientAddress: quote.clientAddress || quote.Client?.address || '',
      companyName: 'MicroAI Systems',
      companyAddress: '123 Business Street, Tech City, TC 12345',
      companyEmail: 'contact@microai.systems',
      companyPhone: '+1 (555) 123-4567',
      items: items.map((item: any) => ({
        name: item.title || item.name || 'Unnamed Item',
        description: item.description || '',
        category: item.category || 'Service',
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.rate) || Number(item.price) || Number(item.unitPrice) || 0,
        total: Number(item.total) || Number(item.amount) || 0,
      })),
      milestones: milestones.map((m: any) => ({
        title: m.title || m.name || 'Milestone',
        description: m.description || '',
        duration: m.duration || m.timeframe || 'TBD',
        progress: Number(m.progress) || 0,
      })),
      paymentSchedule: paymentSchedule.map((p: any) => ({
        title: p.milestone || p.description || 'Payment',
        milestone: p.milestone || p.description || 'Payment',
        percentage: Number(p.percentage) || 0,
        amount: Number(p.amount) || 0,
        dueDate: p.dueDate || p.due || 'Upon completion',
      })),
      subtotal: Number(quote.subtotal) || 0,
      discount: Number(quote.discount) || 0,
      tax: Number(quote.tax) || 0,
      total: Number(quote.total) || 0,
      notes: quote.notes || undefined,
      terms: quote.terms || undefined,
    }

    console.log('🔧 Generating DOCX...')
    const buffer = await generatePDFMatchQuoteDocx(quoteData)
    
    console.log('✅ DOCX generated successfully!')
    console.log('   Size:', buffer.byteLength, 'bytes')
    console.log('   Size (KB):', (buffer.byteLength / 1024).toFixed(2), 'KB')
    console.log('')

    // Verify it's a valid DOCX (ZIP format)
    const header = String.fromCharCode(...buffer.slice(0, 2))
    if (header !== 'PK') {
      console.log('❌ Invalid DOCX file (expected ZIP header PK, got:', header)
      return
    }
    console.log('✅ Valid DOCX file (ZIP container verified)')
    console.log('')

    // Save the file
    const outputDir = path.join(process.cwd(), 'test-output')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const outputFile = path.join(outputDir, `quote-${quote.quoteNumber}-pdf-match-${timestamp}.docx`)
    
    fs.writeFileSync(outputFile, buffer)
    console.log('💾 File saved to:')
    console.log('   ', outputFile)
    console.log('')
    console.log('🎉 SUCCESS! Open the file in Microsoft Word to verify:')
    console.log('   - Matches PDF preview exactly')
    console.log('   - Full-page colored cover')
    console.log('   - Clean section headers')
    console.log('   - Professional tables')
    console.log('')
    console.log('📋 Template: PDF-Match (default)')
    console.log('   Designed to exactly match the PDF preview styling')

  } catch (error) {
    console.error('❌ Test failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testDocxGeneration()
