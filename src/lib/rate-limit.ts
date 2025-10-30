// Optimized Rate Limiting with Sliding Window

interface RateLimitEntry {
  timestamps: number[]
  lastCleanup: number
}

interface RateLimitStore {
  [key: string]: RateLimitEntry
}

const store: RateLimitStore = {}

// Performance optimization: cleanup counter
let cleanupCounter = 0
const CLEANUP_INTERVAL = 100 // Clean up every 100 requests

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1000,
}

export const STRICT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
}

export const AUTH_RATE_LIMIT: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
}

/**
 * Optimized sliding window rate limiter
 * @param identifier - Unique identifier (IP address, user ID, API key)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const key = `${identifier}:${config.windowMs}`
  const windowStart = now - config.windowMs
  
  // Get or initialize rate limit data
  let limitData = store[key]
  
  if (!limitData) {
    limitData = {
      timestamps: [],
      lastCleanup: now,
    }
    store[key] = limitData
  }
  
  // Remove timestamps outside the window (sliding window)
  // Only cleanup periodically for performance
  if (now - limitData.lastCleanup > 10000) { // Cleanup every 10 seconds
    limitData.timestamps = limitData.timestamps.filter(t => t > windowStart)
    limitData.lastCleanup = now
  }
  
  // Count requests in current window
  const requestsInWindow = limitData.timestamps.filter(t => t > windowStart).length
  
  // Check if allowed
  const allowed = requestsInWindow < config.maxRequests
  
  if (allowed) {
    limitData.timestamps.push(now)
  }
  
  const remaining = Math.max(0, config.maxRequests - requestsInWindow - (allowed ? 1 : 0))
  const oldestTimestamp = limitData.timestamps[0] || now
  const resetTime = oldestTimestamp + config.windowMs
  
  // Periodic global cleanup
  cleanupCounter++
  if (cleanupCounter >= CLEANUP_INTERVAL) {
    cleanupCounter = 0
    setImmediate(() => cleanupRateLimitStore())
  }
  
  return {
    allowed,
    remaining,
    resetTime,
  }
}

/**
 * Get client identifier from request (IP address or user ID)
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }
  
  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  return `ip:${ip}`
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    const entry = store[key]
    if (entry && entry.timestamps.length > 0) {
      // Remove old timestamps
      entry.timestamps = entry.timestamps.filter(t => t > now - 3600000) // Keep last hour
      // Delete entry if no recent timestamps
      if (entry.timestamps.length === 0) {
        delete store[key]
      }
    }
  })
}

// Clean up every hour
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 60 * 60 * 1000)
}
