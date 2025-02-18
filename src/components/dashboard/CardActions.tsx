'use client'

import { useState } from 'react'
import { 
  MoreVertical, 
  Pause, 
  Play, 
  Lock,
  Unlock,
  AlertTriangle,
  Settings
} from 'lucide-react'

interface CardActionsProps {
  cardId: string
  status: 'active' | 'frozen' | 'inactive'
  onStatusChange: (cardId: string, status: 'active' | 'frozen' | 'inactive') => void
  onLimitsChange: (cardId: string, limits: { daily: number; monthly: number }) => void
}

interface LimitsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (limits: { daily: number; monthly: number }) => void
  currentLimits: { daily: number; monthly: number }
}

function LimitsModal({ isOpen, onClose, onSave, currentLimits }: LimitsModalProps) {
  const [daily, setDaily] = useState(currentLimits.daily.toString())
  const [monthly, setMonthly] = useState(currentLimits.monthly.toString())

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      daily: parseFloat(daily),
      monthly: parseFloat(monthly)
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-6">Set Transaction Limits</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Daily Limit ($)</label>
            <input
              type="number"
              value={daily}
              onChange={(e) => setDaily(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Monthly Limit ($)</label>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-4 py-2"
              min="0"
              step="0.01"
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
              Save Limits
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function CardActions({ cardId, status, onStatusChange, onLimitsChange }: CardActionsProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLimitsModal, setShowLimitsModal] = useState(false)

  const handleStatusChange = (newStatus: 'active' | 'frozen' | 'inactive') => {
    onStatusChange(cardId, newStatus)
    setShowDropdown(false)
  }

  const getStatusAction = () => {
    switch (status) {
      case 'active':
        return {
          icon: Pause,
          label: 'Freeze Card',
          action: () => handleStatusChange('frozen'),
          className: 'text-blue-400 hover:text-blue-300'
        }
      case 'frozen':
        return {
          icon: Play,
          label: 'Unfreeze Card',
          action: () => handleStatusChange('active'),
          className: 'text-green-400 hover:text-green-300'
        }
      case 'inactive':
        return {
          icon: Play,
          label: 'Activate Card',
          action: () => handleStatusChange('active'),
          className: 'text-green-400 hover:text-green-300'
        }
    }
  }

  const statusAction = getStatusAction()

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-1 rounded-full hover:bg-gray-700"
      >
        <MoreVertical className="h-5 w-5 text-gray-400" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={statusAction.action}
              className={`flex items-center w-full px-4 py-2 text-sm ${statusAction.className}`}
            >
              <statusAction.icon className="h-4 w-4 mr-2" />
              {statusAction.label}
            </button>

            <button
              onClick={() => setShowLimitsModal(true)}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Set Limits
            </button>

            <button
              onClick={() => handleStatusChange('inactive')}
              className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Deactivate Card
            </button>
          </div>
        </div>
      )}

      <LimitsModal
        isOpen={showLimitsModal}
        onClose={() => setShowLimitsModal(false)}
        onSave={(limits) => {
          onLimitsChange(cardId, limits)
          setShowLimitsModal(false)
        }}
        currentLimits={{ daily: 1000, monthly: 5000 }}
      />
    </div>
  )
}
