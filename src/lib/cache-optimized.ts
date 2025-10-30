/**
 * High-Performance Caching System
 * Supports in-memory cache with automatic cleanup and optional Redis
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  hits: number
  size: number
}

class OptimizedCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly maxSize: number
  private readonly defaultTTL: number
  private currentSize = 0
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(maxSizeMB = 100, defaultTTLSeconds = 300) {
    this.maxSize = maxSizeMB * 1024 * 1024 // Convert to bytes
    this.defaultTTL = defaultTTLSeconds * 1000 // Convert to ms
    this.startCleanup()
  }

  private estimateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size
    } catch {
      return 1024 // Fallback estimate
    }
  }

  private startCleanup() {
    // Run cleanup every 60 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  private cleanup() {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache.entries()) {
      // Remove expired entries
      if (now - entry.timestamp > this.defaultTTL) {
        this.currentSize -= entry.size
        this.cache.delete(key)
        cleaned++
      }
    }

    // If still over size limit, remove least-accessed entries
    if (this.currentSize > this.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].hits - b[1].hits)
      
      while (this.currentSize > this.maxSize * 0.8 && entries.length > 0) {
        const [key, entry] = entries.shift()!
        this.currentSize -= entry.size
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0 && process.env.NODE_ENV === 'development') {
      console.log(`🧹 Cache cleanup: removed ${cleaned} entries, ${(this.currentSize / 1024 / 1024).toFixed(2)}MB used`)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)
    
    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > this.defaultTTL) {
      this.currentSize -= entry.size
      this.cache.delete(key)
      return null
    }

    // Update hit count
    entry.hits++
    return entry.data as T
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const size = this.estimateSize(data)

    // Remove old entry if exists
    const old = this.cache.get(key)
    if (old) {
      this.currentSize -= old.size
    }

    // Check if we need space
    if (this.currentSize + size > this.maxSize) {
      this.cleanup()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
      size,
    })

    this.currentSize += size
  }

  async delete(key: string): Promise<void> {
    const entry = this.cache.get(key)
    if (entry) {
      this.currentSize -= entry.size
      this.cache.delete(key)
    }
  }

  async clear(): Promise<void> {
    this.cache.clear()
    this.currentSize = 0
  }

  getStats() {
    return {
      entries: this.cache.size,
      sizeMB: (this.currentSize / 1024 / 1024).toFixed(2),
      maxSizeMB: (this.maxSize / 1024 / 1024).toFixed(2),
      utilization: ((this.currentSize / this.maxSize) * 100).toFixed(1) + '%',
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.clear()
  }
}

// Global cache instance
export const cache = new OptimizedCache(100, 300) // 100MB, 5 minutes TTL

// Helper function for caching database queries
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttlSeconds = 300
): Promise<T> {
  // Try to get from cache
  const cached = await cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Execute query
  const data = await queryFn()
  
  // Store in cache
  await cache.set(key, data, ttlSeconds)
  
  return data
}

// Helper to invalidate patterns
export async function invalidatePattern(pattern: string): Promise<number> {
  let count = 0
  for (const key of cache['cache'].keys()) {
    if (key.includes(pattern)) {
      await cache.delete(key)
      count++
    }
  }
  return count
}

// Graceful shutdown
process.on('beforeExit', () => {
  cache.destroy()
})

export default cache
