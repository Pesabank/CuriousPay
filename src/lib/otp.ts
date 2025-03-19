import { randomBytes, createHmac } from 'crypto'

const SECRET_KEY = process.env.OTP_SECRET_KEY || 'otp_secret_key'

/**
 * Generate a secret key for 2FA
 */
export function generateSecret(): string {
  const buffer = randomBytes(20)
  return buffer.toString('hex')
}

/**
 * Generate a time-based OTP based on a secret
 */
export function generateTOTP(secret: string, window = 0): string {
  // Get current time in seconds
  const timeStep = 30 // 30 seconds
  const t = Math.floor(Date.now() / 1000 / timeStep) + window
  
  // Convert to buffer
  const timeBuffer = Buffer.alloc(8)
  for (let i = 0; i < 8; i++) {
    timeBuffer[7 - i] = t & 0xff
    t = t >> 8
  }
  
  // Generate HMAC
  const hmac = createHmac('sha1', Buffer.from(secret, 'hex'))
  hmac.update(timeBuffer)
  const digest = hmac.digest()
  
  // Dynamic truncation
  const offset = digest[digest.length - 1] & 0xf
  const binary = 
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff)
  
  // Get 6 digit code
  const code = binary % 1000000
  return code.toString().padStart(6, '0')
}

/**
 * Verify a user-provided OTP against the secret
 */
export function verifyTOTP(token: string, secret: string): boolean {
  if (!token || !secret) return false
  
  // Allow for time skew
  for (let window = -1; window <= 1; window++) {
    const generatedToken = generateTOTP(secret, window)
    if (generatedToken === token) return true
  }
  
  return false
}

/**
 * Generate a recovery code
 */
export function generateRecoveryCode(): string {
  const bytes = randomBytes(10)
  const code = bytes.toString('hex').toUpperCase()
  
  // Format as XXXX-XXXX-XXXX-XXXX
  return [
    code.slice(0, 4),
    code.slice(4, 8),
    code.slice(8, 12),
    code.slice(12, 16)
  ].join('-')
}

/**
 * Generate a set of recovery codes
 */
export function generateRecoveryCodes(count = 10): string[] {
  const codes = []
  for (let i = 0; i < count; i++) {
    codes.push(generateRecoveryCode())
  }
  return codes
}

/**
 * Generate a random secret for a user
 */
export function generateSecret(userId: string): string {
  const hmac = createHmac('sha256', SECRET_KEY)
  hmac.update(userId + Date.now().toString())
  return hmac.digest('hex').substring(0, 16)
}

/**
 * Generate a QR code URI for TOTP apps
 */
export function generateOTPAuthURL(email: string, secret: string, issuer = 'CuriousPay'): string {
  const encodedIssuer = encodeURIComponent(issuer)
  const encodedEmail = encodeURIComponent(email)
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}`
} 