import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkQuotes() {
  try {
    const quotes = await prisma.quote.findMany({
      take: 5,
      select: {
        id: true,
        quoteNumber: true,
        title: true,
        status: true,
        items: true,
        scopeOfWork: true,
        total: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('📋 Found', quotes.length, 'quotes in database:\n')
    
    quotes.forEach((quote, index) => {
      console.log(`${index + 1}. Quote #${quote.quoteNumber}`)
      console.log(`   ID: ${quote.id}`)
      console.log(`   Title: ${quote.title}`)
      console.log(`   Status: ${quote.status}`)
      console.log(`   Total: $${quote.total}`)
      
      // Check if items is valid JSON
      try {
        const items = JSON.parse(quote.items as any || '[]')
        console.log(`   Items: ${items.length} line items`)
      } catch (e) {
        console.log(`   Items: ❌ Invalid JSON`)
      }
      
      console.log('')
    })

    if (quotes.length === 0) {
      console.log('⚠️  No quotes found. Create a quote first to test PDF download.')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkQuotes()
