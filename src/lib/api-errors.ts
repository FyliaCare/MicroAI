// Advanced API Error Handling

export class APIError extends Error {
  statusCode: number
  code: string
  details?: any

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message)
    this.name = 'APIError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT')
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED')
    this.name = 'RateLimitError'
  }
}

// Error response formatter
export function formatErrorResponse(error: Error | APIError) {
  if (error instanceof APIError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
    }
  }

  // Handle Prisma errors
  if (error.constructor.name.includes('Prisma')) {
    if (error.message.includes('Unique constraint')) {
      return {
        success: false,
        error: {
          message: 'A record with this value already exists',
          code: 'UNIQUE_CONSTRAINT',
        },
      }
    }
    
    if (error.message.includes('Foreign key constraint')) {
      return {
        success: false,
        error: {
          message: 'Related record not found',
          code: 'FOREIGN_KEY_CONSTRAINT',
        },
      }
    }
  }

  // Generic error
  return {
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message,
      code: 'INTERNAL_ERROR',
    },
  }
}

// Success response formatter
export function formatSuccessResponse<T>(data: T, meta?: any) {
  return {
    success: true,
    data,
    ...(meta && { meta }),
  }
}

// Async handler wrapper to catch errors
export function asyncHandler(fn: Function) {
  return async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}
