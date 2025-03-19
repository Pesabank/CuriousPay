import { generateOTP, verifyOTP } from '@/lib/otp'
import { NextAuthOptions } from 'next-auth'

export interface BiometricCredential {
  credentialId: string
  userId: string
  createdAt: Date
}

class AuthenticationService {
  private static instance: AuthenticationService
  private biometricSupported: boolean = false
  private registeredCredentials: BiometricCredential[] = []

  private constructor() {
    // Check if Web Authentication API is supported
    this.biometricSupported = typeof window !== 'undefined' &&
      window.PublicKeyCredential !== undefined &&
      typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
  }

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService()
    }
    return AuthenticationService.instance
  }

  async isBiometricAvailable(): Promise<boolean> {
    if (!this.biometricSupported) return false

    try {
      return await (window as any).PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    } catch (error) {
      console.error('Error checking biometric availability:', error)
      return false
    }
  }

  async verifyBiometric(): Promise<boolean> {
    try {
      if (!await this.isBiometricAvailable()) {
        return false
      }

      // Create challenge
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      // Create assertion options
      const assertionOptions = {
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required' as UserVerificationRequirement
        }
      }

      const assertion = await navigator.credentials.get(assertionOptions)
      return !!assertion
    } catch (error) {
      console.error('Error verifying biometric:', error)
      return false
    }
  }

  async setupTwoFactor(phoneNumber: string): Promise<string> {
    try {
      // Generate OTP secret
      const secret = generateOTP(phoneNumber, 0)

      // Generate QR code URL (in a real app, this would be a proper QR code)
      const qrCode = `otpauth://totp/CuriousPay:${phoneNumber}?secret=${secret}&issuer=CuriousPay`
      
      // In a real app, the secret would be stored securely for the user
      return qrCode
    } catch (error) {
      console.error('Error setting up 2FA:', error)
      throw new Error('Failed to set up two-factor authentication')
    }
  }

  async verify2FA(token: string, secret: string): Promise<boolean> {
    try {
      return verifyOTP(token, secret)
    } catch (error) {
      console.error('Error verifying 2FA:', error)
      return false
    }
  }

  getRegisteredCredentials(): BiometricCredential[] {
    return this.registeredCredentials
  }

  async removeCredential(credentialId: string): Promise<void> {
    this.registeredCredentials = this.registeredCredentials.filter(
      cred => cred.credentialId !== credentialId
    )
  }
}

// Create authOptions if it doesn't exist
export const authOptions: NextAuthOptions = {
  providers: [],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      // Add custom logic for session callback
      return session
    },
    async jwt({ token, user }) {
      // Add custom logic for JWT callback
      return token
    }
  }
}

// Standalone WebAuthn credential creation function
export async function createWebAuthnCredential(userId: string, email: string): Promise<BiometricCredential | null> {
  try {
    if (typeof window === 'undefined') {
      return null // Handle server-side rendering
    }
    
    // Check if WebAuthn is supported
    if (!window.PublicKeyCredential) {
      console.error('WebAuthn is not supported in this browser')
      return null
    }

    // Generate random challenge
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    // Create credential options
    const createCredentialOptions = {
      publicKey: {
        challenge: challenge,
        rp: {
          name: 'LipaPay',
          id: window.location.hostname
        },
        user: {
          id: Uint8Array.from(userId.split('').map(c => c.charCodeAt(0))),
          name: email,
          displayName: email
        },
        pubKeyCredParams: [
          { type: 'public-key' as const, alg: -7 } // ES256
        ],
        authenticatorSelection: {
          userVerification: 'preferred' as UserVerificationRequirement,
          authenticatorAttachment: 'platform' as AuthenticatorAttachment
        },
        timeout: 60000
      }
    }

    // Create credential
    const credential = await navigator.credentials.create(createCredentialOptions)

    if (credential) {
      // Return new credential data
      return {
        credentialId: credential.id,
        userId: userId,
        createdAt: new Date()
      }
    }
    
    return null
  } catch (error) {
    console.error('Error creating WebAuthn credential:', error)
    return null
  }
}
