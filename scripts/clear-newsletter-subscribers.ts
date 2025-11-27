#!/usr/bin/env tsx
/**
 * Clear Newsletter Subscribers Database
 * Removes all newsletter subscribers and resets the database
 */

import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve)
  })
}

async function clearNewsletterSubscribers() {
  console.log('\n🗑️  Newsletter Subscriber Database Cleaner')
  console.log('=' .repeat(50))
  
  try {
    // Get current count
    const count = await prisma.newsletterSubscriber.count()
    
    if (count === 0) {
      console.log('\n✅ Newsletter subscriber database is already empty!')
      rl.close()
      return
    }
    
    console.log(`\n📊 Current subscribers: ${count}`)
    
    // Get some sample data
    const samples = await prisma.newsletterSubscriber.findMany({
      take: 5,
      select: {
        email: true,
        name: true,
        createdAt: true,
        subscribed: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('\n📋 Sample entries (latest 5):')
    samples.forEach((sub, idx) => {
      console.log(`   ${idx + 1}. ${sub.email}${sub.name ? ` (${sub.name})` : ''} - ${sub.subscribed ? '✓ Active' : '✗ Inactive'} - ${sub.createdAt.toLocaleDateString()}`)
    })
    
    console.log('\n⚠️  WARNING: This will PERMANENTLY delete all newsletter subscribers!')
    const confirm = await question('\nType "DELETE ALL SUBSCRIBERS" to confirm: ')
    
    if (confirm !== 'DELETE ALL SUBSCRIBERS') {
      console.log('\n❌ Operation cancelled - confirmation text did not match')
      rl.close()
      return
    }
    
    console.log('\n🔄 Deleting all newsletter subscribers...')
    
    // Delete all subscribers
    const result = await prisma.newsletterSubscriber.deleteMany({})
    
    console.log(`\n✅ Successfully deleted ${result.count} newsletter subscribers`)
    
    // Log the cleanup activity
    await prisma.activityLog.create({
      data: {
        id: `cleanup-${Date.now()}`,
        action: 'Database Cleanup',
        entity: 'NewsletterSubscriber',
        entityId: 'bulk-delete',
        description: `Cleared all newsletter subscribers (${result.count} records)`,
        metadata: JSON.stringify({
          deletedCount: result.count,
          timestamp: new Date().toISOString(),
          reason: 'bot_cleanup'
        })
      }
    })
    
    console.log('✅ Activity logged')
    console.log('\n🎉 Newsletter database cleared successfully!')
    
  } catch (error) {
    console.error('\n❌ Error clearing newsletter subscribers:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
    }
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

clearNewsletterSubscribers()
