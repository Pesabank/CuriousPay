import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

// Create a schema for validating contact form data
const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate the request body
    const validatedFields = ContactFormSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: 'Invalid form data', errors: validatedFields.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validatedFields.data
    
    // Send email using Resend
    const result = await resend.emails.send({
      from: 'CuriousPay <onboarding@resend.dev>',
      to: 'curiouspayments@gmail.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div>
          <strong>Message:</strong>
          <p>${message.replace(/\n/g, '<br />')}</p>
        </div>
      `
    })

    console.log('Email sending result:', result);

    return NextResponse.json(
      { message: 'Your message has been sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { message: 'Something went wrong sending your message' },
      { status: 500 }
    )
  }
} 