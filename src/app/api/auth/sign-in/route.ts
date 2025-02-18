import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // TODO: Add actual authentication logic here
    // For now, we'll simulate a successful login
    if (email && password) {
      // Create a mock token
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
      
      // Set the token in cookies
      cookies().set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return NextResponse.json({
        success: true,
        token, // Include token in response
        user: {
          email,
          id: '1', // Mock user ID
          name: email.split('@')[0], // Mock name from email
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
