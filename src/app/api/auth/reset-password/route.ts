import { NextResponse } from 'next/server'
import { ResetSchema } from '@/schemas'
import { getUserByEmail } from '@/data/user'
import { sendPasswordResetEmail } from '@/lib/mail'
import { generatePasswordResetToken } from '@/lib/tokens'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedFields = ResetSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: 'Invalid email' },
        { status: 400 }
      )
    }

    const { email } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Email not found' },
        { status: 404 }
      )
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(
      email,
      passwordResetToken.token,
    )

    return NextResponse.json(
      { message: 'Reset email sent' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
