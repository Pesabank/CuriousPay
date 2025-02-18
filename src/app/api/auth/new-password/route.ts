import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { NewPasswordSchema } from '@/schemas'
import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedFields = NewPasswordSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 400 }
      )
    }

    const { token, password } = body

    if (!token) {
      return NextResponse.json(
        { message: 'Missing token' },
        { status: 400 }
      )
    }

    const existingToken = await getPasswordResetTokenByToken(token)

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

    const hashedPassword = await hash(password, 10)

    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    })

    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    })

    return NextResponse.json(
      { message: 'Password updated' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
