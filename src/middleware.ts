import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  const user = token.user as any

  // Check if email is verified for non-auth routes
  if (!user.emailVerified && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/verify-email', request.url))
  }

  // Check if 2FA is required
  if (
    user.isTwoFactorEnabled &&
    !user.isTwoFactorVerified &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    return NextResponse.redirect(new URL('/auth/two-factor', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/api/protected/:path*',
  ]
}
