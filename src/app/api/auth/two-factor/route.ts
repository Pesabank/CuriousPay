import { NextResponse } from 'next/server'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { code, email } = body

    if (!code || !email) {
      return NextResponse.json(
        { message: 'Missing fields' },
        { status: 400 }
      )
    }

    const existingToken = await getTwoFactorTokenByEmail(email)

    if (!existingToken) {
      return NextResponse.json(
        { message: 'Invalid code' },
        { status: 400 }
      )
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
      return NextResponse.json(
        { message: 'Code has expired' },
        { status: 400 }
      )
    }

    const existingUser = await getUserByEmail(email)

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Email does not exist' },
        { status: 400 }
      )
    }

    if (existingToken.token !== code) {
      return NextResponse.json(
        { message: 'Invalid code' },
        { status: 400 }
      )
    }

    await db.twoFactorToken.delete({
      where: { id: existingToken.id }
    })

    await db.twoFactorConfirmation.create({
      data: {
        userId: existingUser.id,
      }
    })

    const session = await getServerSession(authOptions)

    return NextResponse.json({ session }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
