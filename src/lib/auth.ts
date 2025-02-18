import { generateOTP, verifyOTP } from '@/lib/otp'

export interface BiometricCredential {
  id: string
  type: 'fingerprint' | 'face' | 'device'
  name: string
  createdAt: string
  lastUsed: string
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

  async registerBiometric(userId: string): Promise<BiometricCredential | null> {
    if (!await this.isBiometricAvailable()) {
      throw new Error('Biometric authentication not available')
    }

    try {
      // Create challenge
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      // Create public key credential options
      const createCredentialOptions = {
        publicKey: {
          challenge,
          rp: {
            name: 'LipaPay',
            id: window.location.hostname
          },
          user: {
            id: Uint8Array.from(userId, c => c.charCodeAt(0)),
            name: userId,
            displayName: userId
          },
          pubKeyCredParams: [{
            type: 'public-key',
            alg: -7 // ES256
          }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000
        }
      }

      // Create credential
      const credential = await navigator.credentials.create(createCredentialOptions)

      if (credential) {
        const newCredential: BiometricCredential = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'device',
          name: 'Device Biometric',
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString()
        }

        this.registeredCredentials.push(newCredential)
        return newCredential
      }

      return null
    } catch (error) {
      console.error('Error registering biometric:', error)
      throw new Error('Failed to register biometric')
    }
  }

  async verifyBiometric(): Promise<boolean> {
    if (!await this.isBiometricAvailable()) {
      throw new Error('Biometric authentication not available')
    }

    try {
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      const assertionOptions = {
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required'
        }
      }

      const assertion = await navigator.credentials.get(assertionOptions)
      return !!assertion
    } catch (error) {
      console.error('Error verifying biometric:', error)
      return false
    }
  }

  async setup2FA(phoneNumber: string): Promise<{ secret: string; qrCode: string }> {
    try {
      // Generate OTP secret
      const secret = generateOTP()
      
      // Generate QR code URL (in a real app, this would be a proper QR code)
      const qrCode = `otpauth://totp/LipaPay:${phoneNumber}?secret=${secret}&issuer=LipaPay`

      return { secret, qrCode }
    } catch (error) {
      console.error('Error setting up 2FA:', error)
      throw new Error('Failed to setup 2FA')
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
      cred => cred.id !== credentialId
    )
  }
}
