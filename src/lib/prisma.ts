import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Connection pooling optimization with retry logic
if (process.env.NODE_ENV === 'production') {
  // Ensure connections are established with retry
  const connectWithRetry = async (retries = 5, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await prisma.$connect()
        console.log('✓ Database connected successfully')
        break
      } catch (error) {
        console.error(`Database connection attempt ${i + 1}/${retries} failed:`, error)
        if (i === retries - 1) {
          console.error('✗ All database connection attempts failed')
          throw error
        }
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  connectWithRetry().catch(err => {
    console.error('Fatal: Could not connect to database:', err)
  })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Query optimization helpers
export const paginationDefaults = {
  take: 20,
  skip: 0,
}

// Cache helper for frequently accessed data
const queryCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  const cached = queryCache.get(key)
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T
  }
  
  const data = await queryFn()
  queryCache.set(key, { data, timestamp: Date.now() })
  
  // Clean old cache entries periodically
  if (queryCache.size > 100) {
    const now = Date.now()
    for (const [k, v] of queryCache.entries()) {
      if (now - v.timestamp > ttl) {
        queryCache.delete(k)
      }
    }
  }
  
  return data
}

export function invalidateCache(key?: string) {
  if (key) {
    queryCache.delete(key)
  } else {
    queryCache.clear()
  }
}
