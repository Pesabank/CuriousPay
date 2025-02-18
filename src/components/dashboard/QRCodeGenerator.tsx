'use client'

import { useState } from 'react'
import { createQR } from '@solana/pay'

export function QRCodeGenerator() {
  const [amount, setAmount] = useState('')
  const [qrCode, setQrCode] = useState<string | null>(null)

  const generateQR = async () => {
    try {
      // Replace with your actual business wallet address
      const recipient = 'YOUR_WALLET_ADDRESS'
      const label = 'LipaPay Business'
      const message = 'Payment for goods/services'
      
      // Create the payment request URL
      const url = new URL('https://lipapay.app/pay')
      url.searchParams.append('recipient', recipient)
      url.searchParams.append('label', label)
      url.searchParams.append('message', message)
      
      if (amount) {
        url.searchParams.append('amount', amount)
      }

      // Generate QR code
      const qr = createQR(url)
      const qrCodeSvg = await qr.getRawData('svg')
      
      // Convert SVG to data URL
      const blob = new Blob([qrCodeSvg], { type: 'image/svg+xml' })
      const dataUrl = URL.createObjectURL(blob)
      
      setQrCode(dataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-4">Generate Payment QR Code</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400">
            Amount (USDC)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-primary focus:ring-primary"
            placeholder="0.00"
          />
        </div>

        <button
          onClick={generateQR}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Generate QR Code
        </button>

        {qrCode && (
          <div className="mt-4">
            <img src={qrCode} alt="Payment QR Code" className="mx-auto" />
            <p className="text-sm text-gray-400 text-center mt-2">
              Scan this code with a Solana Pay compatible wallet
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
