#!/usr/bin/env tsx

/**
 * Diagnose Quote System Issues
 * Check for common problems with the quote builder and dashboard
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function diagnose() {
  try {
    console.log('🔍 Diagnosing Quote System...\n')

    // 1. Check database connection
    console.log('1️⃣  Checking database connection...')
    await prisma.$connect()
    console.log('✅ Database connected\n')

    // 2. Check quotes exist
    console.log('2️⃣  Checking quotes in database...')
    const quotes = await prisma.quote.findMany({
      include: {
        Client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    console.log(`✅ Found ${quotes.length} quotes\n`)
    
    if (quotes.length === 0) {
      console.log('⚠️  No quotes found! This explains why dashboard is empty.\n')
      return
    }

    // 3. Check quote data integrity
    console.log('3️⃣  Checking quote data integrity...')
    let issuesFound = 0

    for (const quote of quotes) {
      const issues: string[] = []

      if (!quote.quoteNumber) issues.push('Missing quoteNumber')
      if (!quote.title) issues.push('Missing title')
      if (!quote.items) issues.push('Missing items')
      if (quote.items && typeof quote.items === 'string') {
        try {
          const parsed = JSON.parse(quote.items)
          if (!Array.isArray(parsed) || parsed.length === 0) {
            issues.push('Empty or invalid items array')
          }
        } catch (e) {
          issues.push('Invalid JSON in items field')
        }
      }

      if (issues.length > 0) {
        console.log(`⚠️  Quote ${quote.quoteNumber}:`)
        issues.forEach(issue => console.log(`   - ${issue}`))
        issuesFound++
      }
    }

    if (issuesFound === 0) {
      console.log('✅ All quotes have valid data\n')
    } else {
      console.log(`\n⚠️  Found issues in ${issuesFound} quote(s)\n`)
    }

    // 4. Check for draft quotes
    const draftQuotes = quotes.filter(q => q.status === 'draft')
    const sentQuotes = quotes.filter(q => q.status === 'sent')
    const acceptedQuotes = quotes.filter(q => q.status === 'accepted')
    
    console.log('4️⃣  Quote Status Breakdown:')
    console.log(`   📝 Draft: ${draftQuotes.length}`)
    console.log(`   📤 Sent: ${sentQuotes.length}`)
    console.log(`   ✅ Accepted: ${acceptedQuotes.length}`)
    console.log(`   📊 Total: ${quotes.length}\n`)

    // 5. Display sample quote data
    if (quotes.length > 0) {
      const sampleQuote = quotes[0]
      console.log('5️⃣  Sample Quote Data:')
      console.log(`   ID: ${sampleQuote.id}`)
      console.log(`   Number: ${sampleQuote.quoteNumber}`)
      console.log(`   Title: ${sampleQuote.title}`)
      console.log(`   Status: ${sampleQuote.status}`)
      console.log(`   Client: ${sampleQuote.Client?.name || sampleQuote.clientName || 'N/A'}`)
      console.log(`   Total: $${sampleQuote.total}`)
      console.log(`   Created: ${sampleQuote.createdAt}`)
      
      if (sampleQuote.items) {
        try {
          const items = typeof sampleQuote.items === 'string' ? JSON.parse(sampleQuote.items) : sampleQuote.items
          console.log(`   Line Items: ${Array.isArray(items) ? items.length : 0}`)
        } catch (e) {
          console.log(`   Line Items: Error parsing`)
        }
      }
      console.log()
    }

    // 6. Check clients
    console.log('6️⃣  Checking clients...')
    const clients = await prisma.client.findMany({
      take: 5,
    })
    console.log(`✅ Found ${clients.length} clients\n`)

    // Summary
    console.log('📋 SUMMARY:')
    console.log('=' .repeat(50))
    console.log(`Total Quotes: ${quotes.length}`)
    console.log(`Draft Quotes: ${draftQuotes.length}`)
    console.log(`Sent Quotes: ${sentQuotes.length}`)
    console.log(`Accepted Quotes: ${acceptedQuotes.length}`)
    console.log(`Data Issues: ${issuesFound}`)
    console.log('=' .repeat(50))
    
    if (issuesFound === 0 && quotes.length > 0) {
      console.log('\n✅ Quote system data looks healthy!')
      console.log('\n💡 If you\'re not seeing quotes in the UI:')
      console.log('   1. Check browser console for errors')
      console.log('   2. Verify API endpoint /api/admin/quotes is working')
      console.log('   3. Check browser network tab for failed requests')
      console.log('   4. Clear browser cache and reload')
      console.log('   5. Check if text colors match background (white on white issue)')
    }

    console.log('\n🔗 Test URLs:')
    console.log(`   Dashboard: http://localhost:3000/admin/quotes`)
    if (quotes.length > 0) {
      console.log(`   Edit Quote: http://localhost:3000/admin/quotes/${quotes[0].id}/edit`)
    }
    console.log(`   New Quote: http://localhost:3000/admin/quotes/new`)

  } catch (error) {
    console.error('\n❌ Error during diagnosis:')
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

diagnose()
