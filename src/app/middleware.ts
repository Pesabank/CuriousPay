import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/wallet',
  '/business',
  '/settings',
  '/profile',
]

// Define auth routes
const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/reset-password',
  '/auth/new-password',
  '/auth/verify',
  '/auth/two-factor',
]

// Define public routes
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authToken')?.value
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Redirect to dashboard if authenticated user tries to access auth routes
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect to login if unauthenticated user tries to access protected routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Handle API routes
  if (pathname.startsWith('/api')) {
    // Add CORS headers for API routes
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    )
    return response
  }

  return NextResponse.next()
}
