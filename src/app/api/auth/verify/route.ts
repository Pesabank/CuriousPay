import { NextResponse } from 'next/server'
import { getVerificationTokenByToken } from '@/data/verification-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { message: 'Missing token' },
        { status: 400 }
      )
    }

    const existingToken = await getVerificationTokenByToken(token)

    if (!existingToken) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 400 }
      )
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
      return NextResponse.json(
        { message: 'Token has expired' },
        { status: 400 }
      )
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Email does not exist' },
        { status: 400 }
      )
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: { 
        emailVerified: new Date(),
        email: existingToken.email,
      }
    })

    await db.verificationToken.delete({
      where: { id: existingToken.id }
    })

    return NextResponse.json(
      { message: 'Email verified' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
