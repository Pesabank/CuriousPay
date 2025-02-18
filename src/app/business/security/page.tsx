'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Fingerprint, 
  Smartphone, 
  Key, 
  Lock,
  AlertTriangle,
  Check,
  X
} from 'lucide-react'
import { useNotifications } from '@/components/providers/NotificationProvider'
import QRCode from 'qrcode.react'

interface SecurityState {
  biometricEnabled: boolean
  twoFactorEnabled: boolean
  biometricAvailable: boolean
  registeredDevices: Array<{
    id: string
    name: string
    type: string
    lastUsed: string
  }>
}

export default function SecurityPage() {
  const [securityState, setSecurityState] = useState<SecurityState>({
    biometricEnabled: false,
    twoFactorEnabled: false,
    biometricAvailable: false,
    registeredDevices: []
  })
  const [showQRCode, setShowQRCode] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Check biometric availability
    const checkBiometric = async () => {
      try {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        setSecurityState(prev => ({ ...prev, biometricAvailable: available }))
      } catch (error) {
        console.error('Error checking biometric availability:', error)
      }
    }

    checkBiometric()
  }, [])

  const handleBiometricSetup = async () => {
    try {
      // Simulate biometric registration
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSecurityState(prev => ({
        ...prev,
        biometricEnabled: true,
        registeredDevices: [
          ...prev.registeredDevices,
          {
            id: Math.random().toString(36).substr(2, 9),
            name: 'Current Device',
            type: 'Fingerprint',
            lastUsed: new Date().toISOString()
          }
        ]
      }))

      addNotification({
        type: 'security',
        title: 'Biometric Authentication Enabled',
        message: 'Your device biometric authentication has been successfully set up.',
        duration: 5000
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Biometric Setup Failed',
        message: 'There was an error setting up biometric authentication. Please try again.',
        duration: 5000
      })
    }
  }

  const handle2FASetup = async () => {
    try {
      // Simulate 2FA setup
      setShowQRCode(true)
      
      addNotification({
        type: 'security',
        title: '2FA Setup Started',
        message: 'Scan the QR code with your authenticator app to complete setup.',
        duration: 7000
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: '2FA Setup Failed',
        message: 'There was an error setting up two-factor authentication. Please try again.',
        duration: 5000
      })
    }
  }

  const verify2FACode = async () => {
    try {
      // Simulate code verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (verificationCode.length === 6) {
        setSecurityState(prev => ({ ...prev, twoFactorEnabled: true }))
        setShowQRCode(false)
        setVerificationCode('')
        
        addNotification({
          type: 'success',
          title: '2FA Enabled',
          message: 'Two-factor authentication has been successfully enabled for your account.',
          duration: 5000
        })
      } else {
        throw new Error('Invalid code')
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Invalid Code',
        message: 'The verification code you entered is invalid. Please try again.',
        duration: 5000
      })
    }
  }

  const removeDevice = (deviceId: string) => {
    setSecurityState(prev => ({
      ...prev,
      registeredDevices: prev.registeredDevices.filter(device => device.id !== deviceId)
    }))

    addNotification({
      type: 'security',
      title: 'Device Removed',
      message: 'The selected device has been removed from your account.',
      duration: 5000
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Security Settings</h1>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm text-gray-400">Security Status: Strong</span>
        </div>
      </div>

      {/* Biometric Authentication */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Fingerprint className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-white">Biometric Authentication</h2>
          </div>
          <div className="flex items-center space-x-2">
            {securityState.biometricEnabled ? (
              <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                Enabled
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-sm">
                Disabled
              </span>
            )}
          </div>
        </div>

        {!securityState.biometricAvailable ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-400">
                  Biometric Authentication Unavailable
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Your device does not support biometric authentication or it has not been set up in your device settings.
                </p>
              </div>
            </div>
          </div>
        ) : !securityState.biometricEnabled ? (
          <button
            onClick={handleBiometricSetup}
            className="w-full px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 transition-colors"
          >
            Set Up Biometric Authentication
          </button>
        ) : null}

        {securityState.registeredDevices.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Registered Devices</h3>
            <div className="space-y-4">
              {securityState.registeredDevices.map(device => (
                <div
                  key={device.id}
                  className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{device.name}</p>
                      <p className="text-xs text-gray-400">
                        Last used: {new Date(device.lastUsed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDevice(device.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Key className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-white">Two-Factor Authentication</h2>
          </div>
          <div className="flex items-center space-x-2">
            {securityState.twoFactorEnabled ? (
              <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                Enabled
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-sm">
                Disabled
              </span>
            )}
          </div>
        </div>

        {!securityState.twoFactorEnabled && !showQRCode && (
          <button
            onClick={handle2FASetup}
            className="w-full px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 transition-colors"
          >
            Set Up Two-Factor Authentication
          </button>
        )}

        {showQRCode && (
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg">
              <QRCode
                value="otpauth://totp/LipaPay:user@example.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=LipaPay"
                size={200}
                level="H"
              />
              <p className="text-sm text-gray-900">
                Scan this QR code with your authenticator app
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2 focus:ring-primary focus:border-primary"
                  placeholder="000000"
                />
              </div>
              <button
                onClick={verify2FACode}
                className="w-full px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 transition-colors"
                disabled={verificationCode.length !== 6}
              >
                Verify Code
              </button>
            </div>
          </div>
        )}

        {securityState.twoFactorEnabled && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-400">
                  Two-Factor Authentication is Active
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Your account is protected with an additional layer of security.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Recommendations */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-white">Security Recommendations</h2>
        </div>

        <div className="space-y-4">
          {!securityState.biometricEnabled && securityState.biometricAvailable && (
            <div className="flex items-start bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-400">
                  Enable Biometric Authentication
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Add an extra layer of security to your account by enabling biometric authentication.
                </p>
              </div>
            </div>
          )}

          {!securityState.twoFactorEnabled && (
            <div className="flex items-start bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-400">
                  Enable Two-Factor Authentication
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Protect your account with two-factor authentication for enhanced security.
                </p>
              </div>
            </div>
          )}

          {securityState.biometricEnabled && securityState.twoFactorEnabled && (
            <div className="flex items-start bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <Check className="h-5 w-5 text-green-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-400">
                  All Security Features Enabled
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Your account is protected with all recommended security features.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
