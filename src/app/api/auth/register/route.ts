import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { RegisterSchema } from '@/schemas'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedFields = RegisterSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: 'Invalid fields' },
        { status: 400 }
      )
    }

    const { email, password, name } = validatedFields.data
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
