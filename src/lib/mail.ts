import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/auth/verify?token=${token}`

  await resend.emails.send({
    from: 'CuriousPay <noreply@Curiouspay.com>',
    to: email,
    subject: 'Verify your email',
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${confirmLink}">Verify Email</a>
    `
  })
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: 'CuriousPay <noreply@Curiouspay.com>',
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
    `
  })
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: 'CuriousPay <noreply@Curiouspay.com>',
    to: email,
    subject: 'Two-factor authentication code',
    html: `
      <h1>Two-factor authentication</h1>
      <p>Your two-factor authentication code is: ${token}</p>
      <p>This code will expire in 5 minutes.</p>
    `
  })
}
