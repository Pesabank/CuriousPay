import { TransactionType } from '@/types'

export interface SecurityRules {
  maxDailyTransactions: number
  maxTransactionAmount: number
  allowedCountries: string[]
  allowedMerchantCategories: string[]
  requirePinAboveAmount: number
  highRiskMerchants: string[]
}

export interface TransactionSecurityCheck {
  amount: number
  merchantName: string
  merchantCategory: string
  country: string
  type: TransactionType
  cardLast4: string
}

export class SecurityService {
  private static instance: SecurityService
  private rules: SecurityRules = {
    maxDailyTransactions: 20,
    maxTransactionAmount: 5000,
    allowedCountries: ['US', 'GB', 'EU', 'KE'],
    allowedMerchantCategories: ['retail', 'travel', 'food', 'services'],
    requirePinAboveAmount: 100,
    highRiskMerchants: ['crypto', 'gambling', 'adult']
  }

  private constructor() {}

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService()
    }
    return SecurityService.instance
  }

  public async validateTransaction(transaction: TransactionSecurityCheck): Promise<{
    approved: boolean
    requiresPin: boolean
    riskLevel: 'low' | 'medium' | 'high'
    reason?: string
  }> {
    const checks = await Promise.all([
      this.checkTransactionAmount(transaction.amount),
      this.checkMerchantCategory(transaction.merchantCategory),
      this.checkCountry(transaction.country),
      this.checkMerchantRisk(transaction.merchantName)
    ])

    const failed = checks.find(check => !check.approved)
    if (failed) {
      return {
        approved: false,
        requiresPin: false,
        riskLevel: 'high',
        reason: failed.reason
      }
    }

    const requiresPin = transaction.amount > this.rules.requirePinAboveAmount
    const riskLevel = this.calculateRiskLevel(transaction)

    return {
      approved: true,
      requiresPin,
      riskLevel
    }
  }

  private async checkTransactionAmount(amount: number) {
    return {
      approved: amount <= this.rules.maxTransactionAmount,
      reason: amount > this.rules.maxTransactionAmount
        ? `Transaction amount exceeds maximum limit of ${this.rules.maxTransactionAmount}`
        : undefined
    }
  }

  private async checkMerchantCategory(category: string) {
    return {
      approved: this.rules.allowedMerchantCategories.includes(category.toLowerCase()),
      reason: !this.rules.allowedMerchantCategories.includes(category.toLowerCase())
        ? 'Merchant category not allowed'
        : undefined
    }
  }

  private async checkCountry(country: string) {
    return {
      approved: this.rules.allowedCountries.includes(country.toUpperCase()),
      reason: !this.rules.allowedCountries.includes(country.toUpperCase())
        ? 'Country not allowed'
        : undefined
    }
  }

  private async checkMerchantRisk(merchantName: string) {
    const isHighRisk = this.rules.highRiskMerchants.some(
      merchant => merchantName.toLowerCase().includes(merchant)
    )
    return {
      approved: !isHighRisk,
      reason: isHighRisk ? 'High risk merchant detected' : undefined
    }
  }

  private calculateRiskLevel(
    transaction: TransactionSecurityCheck
  ): 'low' | 'medium' | 'high' {
    let riskScore = 0

    // Amount-based risk
    if (transaction.amount > this.rules.maxTransactionAmount * 0.8) riskScore += 3
    else if (transaction.amount > this.rules.maxTransactionAmount * 0.5) riskScore += 2
    else if (transaction.amount > this.rules.maxTransactionAmount * 0.2) riskScore += 1

    // Merchant category risk
    if (!this.rules.allowedMerchantCategories.includes(transaction.merchantCategory))
      riskScore += 2

    // Country risk
    if (!this.rules.allowedCountries.includes(transaction.country)) riskScore += 2

    // High risk merchant check
    if (
      this.rules.highRiskMerchants.some(merchant =>
        transaction.merchantName.toLowerCase().includes(merchant)
      )
    )
      riskScore += 3

    if (riskScore >= 5) return 'high'
    if (riskScore >= 3) return 'medium'
    return 'low'
  }

  public updateSecurityRules(newRules: Partial<SecurityRules>) {
    this.rules = { ...this.rules, ...newRules }
  }
}
