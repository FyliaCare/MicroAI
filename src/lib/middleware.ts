// API Middleware Utilities
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { checkRateLimit, getClientIdentifier, RateLimitConfig } from './rate-limit'
import { AuthenticationError, AuthorizationError, RateLimitError } from './api-errors'

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'CLIENT'

/**
 * Require authentication middleware
 */
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    throw new AuthenticationError('Authentication required')
  }
  
  return session
}

/**
 * Require specific role middleware
 */
export async function requireRole(request: NextRequest, allowedRoles: Role[]) {
  const session = await requireAuth(request)
  
  const userRole = (session.user as any).role as Role
  
  if (!allowedRoles.includes(userRole)) {
    throw new AuthorizationError(
      `Access denied. Required roles: ${allowedRoles.join(', ')}`
    )
  }
  
  return session
}

/**
 * Rate limiting middleware
 */
export async function rateLimit(request: NextRequest, config?: RateLimitConfig) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  const identifier = getClientIdentifier(request, userId)
  
  const result = checkRateLimit(identifier, config)
  
  if (!result.allowed) {
    const resetDate = new Date(result.resetTime)
    throw new RateLimitError(
      `Rate limit exceeded. Try again after ${resetDate.toISOString()}`
    )
  }
  
  return result
}

/**
 * CORS middleware for API routes
 */
export function withCORS(handler: Function) {
  return async (request: NextRequest) => {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    // Execute handler
    const response = await handler(request)
    
    // Add CORS headers to response
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  }
}

/**
 * Combine multiple middleware functions
 */
export function compose(...middlewares: Function[]) {
  return async (request: NextRequest) => {
    let context: any = {}
    
    for (const middleware of middlewares) {
      const result = await middleware(request, context)
      if (result instanceof NextResponse) {
        return result
      }
      context = { ...context, ...result }
    }
    
    return context
  }
}

/**
 * Request logging middleware
 */
export async function requestLogger(request: NextRequest) {
  const start = Date.now()
  const method = request.method
  const url = request.url
  
  console.log(`[API] ${method} ${url} - Started`)
  
  return {
    logResponse: (status: number) => {
      const duration = Date.now() - start
      console.log(`[API] ${method} ${url} - ${status} (${duration}ms)`)
    }
  }
}

/**
 * API Key authentication middleware
 */
export async function requireApiKey(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey) {
    throw new AuthenticationError('API key required')
  }
  
  // TODO: Validate API key against database
  // For now, just check if it exists
  if (!apiKey.startsWith('mk_')) {
    throw new AuthenticationError('Invalid API key format')
  }
  
  return { apiKey }
}

/**
 * Pagination helper
 */
export function getPagination(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

/**
 * Search/Filter helper
 */
export function getFilters(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const filters: Record<string, any> = {}
  
  searchParams.forEach((value, key) => {
    if (key !== 'page' && key !== 'limit' && key !== 'sort') {
      filters[key] = value
    }
  })
  
  return filters
}

/**
 * Sort helper
 */
export function getSort(request: NextRequest, defaultSort = { createdAt: 'desc' }) {
  const { searchParams } = new URL(request.url)
  const sortParam = searchParams.get('sort')
  
  if (!sortParam) return defaultSort
  
  // Parse sort format: "field:order" or "-field" for desc
  if (sortParam.startsWith('-')) {
    return { [sortParam.slice(1)]: 'desc' }
  }
  
  const [field, order = 'asc'] = sortParam.split(':')
  return { [field]: order }
}
