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

  // Add caching headers for static assets
  if (
    pathname.startsWith('/_next/static') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|avif)$/)
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
