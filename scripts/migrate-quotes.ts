// ============================================================================
// QUOTE SYSTEM MIGRATION SCRIPT
// Migrate existing quotes to new format
// ============================================================================

import { prisma } from '../src/lib/prisma'

async function migrateQuotes() {
  console.log('🔄 Starting quote migration...\n')

  try {
    // Get all existing quotes
    const quotes = await prisma.quote.findMany()
    console.log(`📋 Found ${quotes.length} quotes to process\n`)

    let updated = 0
    let skipped = 0

    for (const quote of quotes) {
      try {
        const updates: any = {}
        const quoteData = quote as any

        // Ensure required fields have defaults
        if (!quote.currency) updates.currency = 'USD'
        if (!quote.discountType) updates.discountType = 'fixed'
        if (!quoteData.brandColor) updates.brandColor = '#4F46E5'
        if (!quote.templateStyle) updates.templateStyle = 'modern'
        if (quote.subtotal === null) updates.subtotal = 0
        if (quote.tax === null) updates.tax = 0
        if (quote.discount === null) updates.discount = 0
        if (quote.total === null) updates.total = 0
        if (quote.taxRate === null) updates.taxRate = 0
        if (quoteData.viewCount === null || quoteData.viewCount === undefined) updates.viewCount = 0
        if (quoteData.downloadCount === null || quoteData.downloadCount === undefined) updates.downloadCount = 0
        if (quoteData.version === null || quoteData.version === undefined) updates.version = 1

        // Migrate pricingItems to items if needed (pricingItems was removed)
        if (quoteData.pricingItems && !quote.items) {
          updates.items = quoteData.pricingItems
        }

        // Set validUntil if not set
        if (!quote.validUntil && quote.createdAt) {
          const validUntil = new Date(quote.createdAt)
          validUntil.setDate(validUntil.getDate() + (quote.validityDays || 30))
          updates.validUntil = validUntil
        }

        // Ensure category is set
        if (!quoteData.category) {
          updates.category = 'web-dev' // default category
        }

        // Update if there are changes
        if (Object.keys(updates).length > 0) {
          await prisma.quote.update({
            where: { id: quote.id },
            data: updates,
          })
          updated++
          console.log(`✅ Updated quote: ${quote.quoteNumber}`)
        } else {
          skipped++
        }
      } catch (error) {
        console.error(`❌ Error updating quote ${quote.quoteNumber}:`, error)
      }
    }

    console.log(`\n📊 Migration Summary:`)
    console.log(`   Total quotes: ${quotes.length}`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`\n✅ Migration complete!`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration
migrateQuotes()
