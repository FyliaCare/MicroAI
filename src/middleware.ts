import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing protected admin routes
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')
  const isAdminApiRoute = pathname.startsWith('/api/admin')

  if (isAdminRoute || isAdminApiRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Redirect to login if not authenticated
    if (!token) {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        )
      }
      
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if admin is active
    if (!token.email) {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { success: false, error: 'Invalid session' },
          { status: 401 }
        )
      }
      
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  const response = NextResponse.next()

  // Performance and caching headers for static assets
  if (pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (pathname.startsWith('/_next/image')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|avif|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (pathname.match(/\.(js|css)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (pathname.startsWith('/api/')) {
    // API routes - no cache by default, can be overridden in route handlers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  } else {
    // HTML pages - cache with revalidation
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  }

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  
  // Additional security headers to prevent clickjacking and injection attacks
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  
  // Strict Transport Security (HSTS) - only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // Content Security Policy (CSP)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://vitals.vercel-insights.com;
    frame-src 'none';
    frame-ancestors 'self';
    base-uri 'self';
    form-action 'self';
    object-src 'none';
    manifest-src 'self';
    worker-src 'self' blob:;
  `.replace(/\s{2,}/g, ' ').trim()
  
  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
