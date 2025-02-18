import { PublicKey, Transaction } from '@solana/web3.js'

export interface WalletAdapter {
  name: string
  icon: string
  connected: boolean
  publicKey: PublicKey | null
  connect(): Promise<void>
  disconnect(): Promise<void>
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
}

export class PhantomWalletAdapter implements WalletAdapter {
  name = 'Phantom'
  icon = '/wallet-icons/phantom.png'
  private _wallet: any
  private _connected = false
  private _publicKey: PublicKey | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this._wallet = (window as any).solana
    }
  }

  get connected() {
    return this._connected
  }

  get publicKey() {
    return this._publicKey
  }

  async connect() {
    try {
      if (!this._wallet?.isPhantom) {
        window.open('https://phantom.app/', '_blank')
        throw new Error('Please install Phantom wallet')
      }

      const response = await this._wallet.connect()
      this._connected = true
      this._publicKey = response.publicKey
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async disconnect() {
    try {
      await this._wallet.disconnect()
      this._connected = false
      this._publicKey = null
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      return await this._wallet.signTransaction(transaction)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    try {
      return await this._wallet.signAllTransactions(transactions)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}

export class SolflareWalletAdapter implements WalletAdapter {
  name = 'Solflare'
  icon = '/wallet-icons/solflare.png'
  private _wallet: any
  private _connected = false
  private _publicKey: PublicKey | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this._wallet = (window as any).solflare
    }
  }

  get connected() {
    return this._connected
  }

  get publicKey() {
    return this._publicKey
  }

  async connect() {
    try {
      if (!this._wallet?.isSolflare) {
        window.open('https://solflare.com/', '_blank')
        throw new Error('Please install Solflare wallet')
      }

      const response = await this._wallet.connect()
      this._connected = true
      this._publicKey = response.publicKey
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async disconnect() {
    try {
      await this._wallet.disconnect()
      this._connected = false
      this._publicKey = null
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      return await this._wallet.signTransaction(transaction)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    try {
      return await this._wallet.signAllTransactions(transactions)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}

export class SlopeWalletAdapter implements WalletAdapter {
  name = 'Slope'
  icon = '/wallet-icons/slope.png'
  private _wallet: any
  private _connected = false
  private _publicKey: PublicKey | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this._wallet = new ((window as any).Slope)()
    }
  }

  get connected() {
    return this._connected
  }

  get publicKey() {
    return this._publicKey
  }

  async connect() {
    try {
      if (!this._wallet) {
        window.open('https://slope.finance/', '_blank')
        throw new Error('Please install Slope wallet')
      }

      const response = await this._wallet.connect()
      this._connected = true
      this._publicKey = new PublicKey(response.data.publicKey)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async disconnect() {
    try {
      await this._wallet.disconnect()
      this._connected = false
      this._publicKey = null
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      const { signature, publicKey } = await this._wallet.signTransaction(transaction)
      transaction.addSignature(new PublicKey(publicKey), signature)
      return transaction
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    try {
      return await Promise.all(transactions.map(tx => this.signTransaction(tx)))
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
