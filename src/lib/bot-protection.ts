// Advanced Bot Protection System
// Multi-layered protection: Rate limiting, Honeypot, Fingerprinting, Behavior Analysis

import { NextRequest } from 'next/server'
import { prisma } from './prisma'

// ============================================
// 1. REQUEST FINGERPRINTING
// ============================================

export interface RequestFingerprint {
  ip: string
  userAgent: string
  acceptLanguage: string
  acceptEncoding: string
  referer: string | null
  origin: string | null
  hash: string
}

/**
 * Create a fingerprint from request headers
 */
export function createRequestFingerprint(request: NextRequest): RequestFingerprint {
  const headers = request.headers
  const ip = headers.get('x-forwarded-for')?.split(',')[0] || 
             headers.get('x-real-ip') || 
             'unknown'
  const userAgent = headers.get('user-agent') || ''
  const acceptLanguage = headers.get('accept-language') || ''
  const acceptEncoding = headers.get('accept-encoding') || ''
  const referer = headers.get('referer')
  const origin = headers.get('origin')

  // Create a simple hash
  const hashString = `${ip}:${userAgent}:${acceptLanguage}:${acceptEncoding}`
  const hash = simpleHash(hashString)

  return {
    ip,
    userAgent,
    acceptLanguage,
    acceptEncoding,
    referer,
    origin,
    hash
  }
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(36)
}

// ============================================
// 2. BOT SCORE CALCULATION
// ============================================

export interface BotScore {
  score: number // 0-100, higher = more likely bot
  reasons: string[]
  blocked: boolean
}

/**
 * Calculate bot probability score
 */
export function calculateBotScore(
  fingerprint: RequestFingerprint,
  formData: any,
  honeypotField?: string
): BotScore {
  let score = 0
  const reasons: string[] = []

  // Check 1: Honeypot field (critical - instant block)
  if (honeypotField && honeypotField.trim() !== '') {
    score += 100
    reasons.push('Honeypot field filled (bot trap)')
  }

  // Check 2: Missing or suspicious User-Agent
  if (!fingerprint.userAgent || fingerprint.userAgent.length < 10) {
    score += 40
    reasons.push('Missing or invalid User-Agent')
  } else {
    // Known bot user agents
    const botPatterns = [
      /bot/i, /crawl/i, /spider/i, /scrape/i,
      /curl/i, /wget/i, /python/i, /java/i,
      /axios/i, /fetch/i, /node-fetch/i,
      /postman/i, /insomnia/i, /httpie/i
    ]
    if (botPatterns.some(pattern => pattern.test(fingerprint.userAgent))) {
      score += 30
      reasons.push('Known bot User-Agent detected')
    }
  }

  // Check 3: Missing Accept-Language (humans always have this)
  if (!fingerprint.acceptLanguage) {
    score += 25
    reasons.push('Missing Accept-Language header')
  }

  // Check 4: Missing Referer (suspicious for form submissions)
  if (!fingerprint.referer && !fingerprint.origin) {
    score += 20
    reasons.push('Direct API access - no referer/origin')
  }

  // Check 5: Form data validation
  if (formData) {
    // Too fast submission (would need timestamp from frontend)
    // Identical content patterns
    const fields = Object.values(formData).filter(v => typeof v === 'string')
    const allSame = fields.every((v, i, arr) => v === arr[0])
    if (fields.length > 2 && allSame) {
      score += 35
      reasons.push('All form fields identical')
    }

    // Excessive length (spam)
    const totalLength = fields.reduce((acc, v) => acc + (v as string).length, 0)
    if (totalLength > 5000) {
      score += 25
      reasons.push('Excessive form content length')
    }

    // Known spam patterns
    const spamPatterns = [
      /viagra/i, /cialis/i, /casino/i, /lottery/i,
      /click here/i, /buy now/i, /limited offer/i,
      /\$\$\$/g, /!!!/g, /http.*http.*http/i, // Multiple URLs
      /\.ru\b/i, /\.xyz\b/i // Suspicious TLDs
    ]
    const contentString = JSON.stringify(formData).toLowerCase()
    const spamMatches = spamPatterns.filter(pattern => pattern.test(contentString))
    if (spamMatches.length > 0) {
      score += 15 * spamMatches.length
      reasons.push(`Spam patterns detected (${spamMatches.length})`)
    }

    // Email validation
    if (formData.email) {
      // Disposable email domains
      const disposableDomains = [
        'tempmail.com', 'throwaway.email', 'guerrillamail.com',
        '10minutemail.com', 'mailinator.com', 'yopmail.com',
        'trashmail.com', 'temp-mail.org'
      ]
      const emailDomain = formData.email.split('@')[1]?.toLowerCase()
      if (disposableDomains.some(domain => emailDomain?.includes(domain))) {
        score += 30
        reasons.push('Disposable email address')
      }

      // Multiple consecutive numbers/random chars
      if (/[a-z]{15,}|[0-9]{8,}/.test(formData.email)) {
        score += 20
        reasons.push('Suspicious email pattern')
      }
    }
  }

  // Check 6: IP validation
  if (fingerprint.ip === 'unknown') {
    score += 15
    reasons.push('Unable to determine IP address')
  }

  // Decision threshold
  const blocked = score >= 50 // Block if score 50 or higher

  return {
    score: Math.min(score, 100),
    reasons,
    blocked
  }
}

// ============================================
// 3. AGGRESSIVE RATE LIMITING FOR FORMS
// ============================================

interface FormRateLimitEntry {
  submissions: number[]
  blocked: boolean
  blockedUntil?: number
}

const formRateLimitStore: { [key: string]: FormRateLimitEntry } = {}

export interface FormRateLimitResult {
  allowed: boolean
  reason?: string
  blockedUntil?: Date
  attemptsRemaining: number
}

/**
 * Aggressive rate limiting specifically for form submissions
 */
export function checkFormRateLimit(
  identifier: string,
  config = {
    maxSubmissions: 3, // Max 3 submissions
    windowMs: 60 * 60 * 1000, // Per hour
    blockDuration: 24 * 60 * 60 * 1000 // Block for 24 hours after violation
  }
): FormRateLimitResult {
  const now = Date.now()
  const windowStart = now - config.windowMs
  
  let entry = formRateLimitStore[identifier]
  
  if (!entry) {
    entry = {
      submissions: [],
      blocked: false
    }
    formRateLimitStore[identifier] = entry
  }

  // Check if currently blocked
  if (entry.blocked && entry.blockedUntil) {
    if (now < entry.blockedUntil) {
      return {
        allowed: false,
        reason: 'IP temporarily blocked due to suspicious activity',
        blockedUntil: new Date(entry.blockedUntil),
        attemptsRemaining: 0
      }
    } else {
      // Unblock
      entry.blocked = false
      entry.blockedUntil = undefined
      entry.submissions = []
    }
  }

  // Remove old submissions
  entry.submissions = entry.submissions.filter(t => t > windowStart)

  // Count recent submissions
  const recentSubmissions = entry.submissions.length

  // Check if limit exceeded
  if (recentSubmissions >= config.maxSubmissions) {
    // BLOCK THIS IP
    entry.blocked = true
    entry.blockedUntil = now + config.blockDuration

    return {
      allowed: false,
      reason: `Too many submissions. Maximum ${config.maxSubmissions} per hour allowed.`,
      blockedUntil: new Date(entry.blockedUntil),
      attemptsRemaining: 0
    }
  }

  // Allow and record submission
  entry.submissions.push(now)

  return {
    allowed: true,
    attemptsRemaining: config.maxSubmissions - recentSubmissions - 1
  }
}

// ============================================
// 4. HONEYPOT VALIDATION
// ============================================

/**
 * Validate honeypot field
 * Returns true if bot detected (field was filled)
 */
export function validateHoneypot(honeypotValue: string | undefined | null): boolean {
  // Honeypot should always be empty for legitimate users
  return !!(honeypotValue && honeypotValue.trim() !== '')
}

// ============================================
// 5. LOG BLOCKED REQUESTS TO DATABASE
// ============================================

export async function logBlockedRequest(
  fingerprint: RequestFingerprint,
  botScore: BotScore,
  endpoint: string,
  formData?: any
) {
  try {
    await prisma.blockedRequest.create({
      data: {
        ipAddress: fingerprint.ip,
        userAgent: fingerprint.userAgent,
        endpoint,
        botScore: botScore.score,
        reasons: JSON.stringify(botScore.reasons),
        fingerprint: JSON.stringify(fingerprint),
        formData: formData ? JSON.stringify(formData) : null,
        blockedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Failed to log blocked request:', error)
    // Don't throw - logging failure shouldn't stop the blocking
  }
}

// ============================================
// 6. WHITELIST MANAGEMENT
// ============================================

const whitelist = new Set<string>([
  // Add trusted IPs here
  '127.0.0.1',
  '::1'
])

export function isWhitelisted(ip: string): boolean {
  return whitelist.has(ip)
}

export function addToWhitelist(ip: string) {
  whitelist.add(ip)
}

export function removeFromWhitelist(ip: string) {
  whitelist.delete(ip)
}

// ============================================
// 7. MAIN PROTECTION FUNCTION
// ============================================

export interface BotProtectionResult {
  allowed: boolean
  reason?: string
  botScore?: BotScore
  rateLimit?: FormRateLimitResult
  fingerprint: RequestFingerprint
}

/**
 * Comprehensive bot protection check
 * Call this at the beginning of form submission endpoints
 */
export async function checkBotProtection(
  request: NextRequest,
  formData: any,
  honeypotField?: string
): Promise<BotProtectionResult> {
  
  // Create fingerprint
  const fingerprint = createRequestFingerprint(request)

  // Check whitelist
  if (isWhitelisted(fingerprint.ip)) {
    return {
      allowed: true,
      fingerprint
    }
  }

  // Calculate bot score
  const botScore = calculateBotScore(fingerprint, formData, honeypotField)

  // Check rate limit
  const rateLimit = checkFormRateLimit(fingerprint.ip)

  // Determine if request should be blocked
  const blocked = botScore.blocked || !rateLimit.allowed

  // Log if blocked
  if (blocked) {
    await logBlockedRequest(fingerprint, botScore, request.nextUrl.pathname, formData)
  }

  // Determine reason
  let reason: string | undefined
  if (botScore.blocked) {
    reason = `Bot detected: ${botScore.reasons.join(', ')}`
  } else if (!rateLimit.allowed) {
    reason = rateLimit.reason
  }

  return {
    allowed: !blocked,
    reason,
    botScore,
    rateLimit,
    fingerprint
  }
}

// ============================================
// 8. CLEANUP FUNCTION
// ============================================

/**
 * Cleanup old rate limit entries
 */
export function cleanupFormRateLimitStore() {
  const now = Date.now()
  const oneDayAgo = now - (24 * 60 * 60 * 1000)
  
  Object.keys(formRateLimitStore).forEach(key => {
    const entry = formRateLimitStore[key]
    // Remove if not blocked and no recent submissions
    if (!entry.blocked && entry.submissions.every(t => t < oneDayAgo)) {
      delete formRateLimitStore[key]
    }
    // Remove if block expired and no activity
    if (entry.blocked && entry.blockedUntil && entry.blockedUntil < now) {
      if (entry.submissions.every(t => t < oneDayAgo)) {
        delete formRateLimitStore[key]
      }
    }
  })
}

// Run cleanup every hour
if (typeof window === 'undefined') {
  setInterval(cleanupFormRateLimitStore, 60 * 60 * 1000)
}
