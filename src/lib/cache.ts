/**
 * Cache utility for API routes and server-side data
 * Provides in-memory caching with TTL support
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>>
  private maxSize: number

  constructor(maxSize: number = 200) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  /**
   * Set cache data with TTL
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Clean up old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now()
    const toDelete: string[] = []
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        toDelete.push(key)
      }
    }
    
    toDelete.forEach(key => this.cache.delete(key))
    
    // If still too large, remove oldest entries
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const toRemove = entries.slice(0, Math.floor(this.maxSize * 0.2))
      toRemove.forEach(([key]) => this.cache.delete(key))
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Singleton instance
export const cache = new CacheManager()

/**
 * Cache wrapper for async functions
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }
  
  const data = await fn()
  cache.set(key, data, ttl)
  return data
}

/**
 * Cache invalidation patterns
 */
export const cacheKeys = {
  projects: {
    all: 'projects:all',
    byId: (id: string) => `projects:${id}`,
    byClient: (clientId: string) => `projects:client:${clientId}`,
    stats: 'projects:stats',
  },
  clients: {
    all: 'clients:all',
    byId: (id: string) => `clients:${id}`,
    stats: 'clients:stats',
  },
  quotes: {
    all: 'quotes:all',
    byId: (id: string) => `quotes:${id}`,
    byClient: (clientId: string) => `quotes:client:${clientId}`,
    stats: 'quotes:stats',
  },
  analytics: {
    dashboard: 'analytics:dashboard',
    revenue: 'analytics:revenue',
    projects: 'analytics:projects',
  },
}

/**
 * Invalidate related caches
 */
export function invalidateRelatedCaches(entity: 'project' | 'client' | 'quote', id?: string) {
  switch (entity) {
    case 'project':
      cache.delete(cacheKeys.projects.all)
      cache.delete(cacheKeys.projects.stats)
      cache.delete(cacheKeys.analytics.dashboard)
      cache.delete(cacheKeys.analytics.projects)
      if (id) cache.delete(cacheKeys.projects.byId(id))
      break
    case 'client':
      cache.delete(cacheKeys.clients.all)
      cache.delete(cacheKeys.clients.stats)
      cache.delete(cacheKeys.analytics.dashboard)
      if (id) cache.delete(cacheKeys.clients.byId(id))
      break
    case 'quote':
      cache.delete(cacheKeys.quotes.all)
      cache.delete(cacheKeys.quotes.stats)
      cache.delete(cacheKeys.analytics.dashboard)
      cache.delete(cacheKeys.analytics.revenue)
      if (id) cache.delete(cacheKeys.quotes.byId(id))
      break
  }
}

// Periodic cleanup (every 10 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cache.cleanup()
  }, 10 * 60 * 1000)
}
