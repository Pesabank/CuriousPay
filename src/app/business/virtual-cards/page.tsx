'use client'

import { useState } from 'react'
import { Plus, CreditCard, Eye, EyeOff } from 'lucide-react'
import { CreateCardModal } from '@/components/dashboard/CreateCardModal'
import { TransactionHistory } from '@/components/dashboard/TransactionHistory'
import { CardActions } from '@/components/dashboard/CardActions'
import './styles.css'

interface VirtualCard {
  id: string
  name: string
  last4: string
  balance: number
  status: 'active' | 'frozen' | 'inactive'
  type: 'personal' | 'business'
  limits: {
    daily: number
    monthly: number
  }
}

const sampleCards: VirtualCard[] = [
  {
    id: '1',
    name: 'Business Expenses',
    last4: '4532',
    balance: 5000.00,
    status: 'active',
    type: 'business',
    limits: {
      daily: 1000,
      monthly: 5000
    }
  },
  {
    id: '2',
    name: 'Marketing',
    last4: '8901',
    balance: 2500.00,
    status: 'active',
    type: 'business',
    limits: {
      daily: 500,
      monthly: 2000
    }
  }
]

export default function VirtualCardsPage() {
  const [cards, setCards] = useState<VirtualCard[]>(sampleCards)
  const [showBalance, setShowBalance] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateCard = (cardData: any) => {
    const newCard: VirtualCard = {
      id: Math.random().toString(36).substr(2, 9),
      name: cardData.name,
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      balance: 0,
      status: 'active',
      type: cardData.type,
      limits: {
        daily: cardData.dailyLimit || 1000,
        monthly: cardData.monthlyLimit || 5000
      }
    }
    setCards([...cards, newCard])
  }

  const handleCardStatusChange = (cardId: string, newStatus: 'active' | 'frozen' | 'inactive') => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, status: newStatus } : card
    ))
  }

  const handleCardLimitsChange = (cardId: string, newLimits: { daily: number; monthly: number }) => {
    setCards(cards.map(card =>
      card.id === cardId ? { ...card, limits: newLimits } : card
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Virtual Cards</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Card
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Virtual Card</p>
                <h3 className="text-white font-medium mt-1">{card.name}</h3>
              </div>
              <CardActions
                cardId={card.id}
                status={card.status}
                onStatusChange={handleCardStatusChange}
                onLimitsChange={handleCardLimitsChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <span className="text-white font-mono">•••• {card.last4}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Balance</span>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-white"
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xl font-medium text-white">
                {showBalance ? `$${card.balance.toFixed(2)}` : '••••••'}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Daily Limit</span>
                <span className="text-white">${card.limits.daily.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Monthly Limit</span>
                <span className="text-white">${card.limits.monthly.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${
                  card.status === 'active' ? 'bg-green-500' :
                  card.status === 'frozen' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`} />
                <span className="text-gray-400 capitalize">{card.status}</span>
              </div>
              <span className="text-gray-400 capitalize">{card.type}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Transaction History</h2>
        <TransactionHistory />
      </div>

      <CreateCardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCard={handleCreateCard}
      />
    </div>
  )
}
