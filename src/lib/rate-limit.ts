// Rate Limiting Utilities

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

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
 * Check if a request should be rate limited
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
  const key = `${identifier}:${config.windowMs}:${config.maxRequests}`
  
  // Get or initialize rate limit data
  let limitData = store[key]
  
  if (!limitData || now > limitData.resetTime) {
    // Create new window
    limitData = {
      count: 0,
      resetTime: now + config.windowMs,
    }
    store[key] = limitData
  }
  
  // Increment count
  limitData.count++
  
  const allowed = limitData.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - limitData.count)
  
  return {
    allowed,
    remaining,
    resetTime: limitData.resetTime,
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
    if (now > store[key].resetTime) {
      delete store[key]
    }
  })
}

// Clean up every hour
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 60 * 60 * 1000)
}
