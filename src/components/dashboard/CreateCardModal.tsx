'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CreateCardModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateCard: (cardData: any) => void
}

export function CreateCardModal({ isOpen, onClose, onCreateCard }: CreateCardModalProps) {
  const [cardName, setCardName] = useState('')
  const [cardType, setCardType] = useState('business')
  const [dailyLimit, setDailyLimit] = useState('')
  const [monthlyLimit, setMonthlyLimit] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateCard({
      name: cardName,
      type: cardType,
      dailyLimit: parseFloat(dailyLimit),
      monthlyLimit: parseFloat(monthlyLimit),
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Create Virtual Card</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Card Name</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
              placeholder="Enter card name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Card Type</label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
            >
              <option value="business">Business</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Daily Limit</label>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
              placeholder="Enter daily limit"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Monthly Limit</label>
            <input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
              placeholder="Enter monthly limit"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90"
            >
              Create Card
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
