'use client'

import { useEffect, useState } from 'react'
import { 
  Bell, 
  Lock, 
  CreditCard, 
  Globe, 
  Mail,
  Shield,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  Coins
} from 'lucide-react'
import { useWallet } from '@/components/providers/WalletProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function BusinessSettingsPage() {
  const { connected, publicKey } = useWallet()
  const [riskLevel, setRiskLevel] = useState(50)
  const [autoFees, setAutoFees] = useState(true)
  const [enhancedSecurity, setEnhancedSecurity] = useState(true)
  const [notifications, setNotifications] = useState(true)

  // Function to truncate wallet address
  const formatPublicKey = (key: any): string => {
    if (!key) return 'No wallet connected'
    
    // Convert PublicKey to string if needed
    const keyString = typeof key === 'string' ? key : key.toString()
    
    if (keyString.length <= 16) return keyString
    return `${keyString.substring(0, 8)}...${keyString.substring(keyString.length - 8)}`
  }
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Business Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Connection</CardTitle>
            <CardDescription>Manage your connected blockchain wallets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <Coins className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Wallet Address</p>
                  <p className="font-mono text-white break-all">
                    {formatPublicKey(publicKey)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="connected-status">Connected Status</Label>
              <div className={`px-2 py-1 rounded-full text-xs ${connected ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {connected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Risk Management</CardTitle>
            <CardDescription>Configure your risk management preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="risk-level">Transaction Risk Level</Label>
                <span className="text-sm">{riskLevel}%</span>
              </div>
              <Slider 
                id="risk-level"
                value={[riskLevel]} 
                onValueChange={(values) => setRiskLevel(values[0])} 
                min={0} 
                max={100} 
                step={5} 
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low Risk</span>
                <span>High Risk</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-fees">Automatic Fee Optimization</Label>
                <p className="text-sm text-gray-500">Optimize transaction fees based on network conditions</p>
              </div>
              <Switch 
                id="auto-fees" 
                checked={autoFees} 
                onCheckedChange={setAutoFees} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security options for your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enhanced-security">Enhanced Security</Label>
                <p className="text-sm text-gray-500">Extra verification for high-value transactions</p>
              </div>
              <Switch 
                id="enhanced-security" 
                checked={enhancedSecurity} 
                onCheckedChange={setEnhancedSecurity} 
              />
            </div>
            
            <div className="bg-yellow-500/10 text-yellow-500 p-4 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Enhanced security requires additional verification steps for transactions over $1,000.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications">Business Transaction Alerts</Label>
                <p className="text-sm text-gray-500">Receive alerts for all business transactions</p>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications} 
                onCheckedChange={setNotifications} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="security-alerts">Security Alerts</Label>
                <p className="text-sm text-gray-500">Critical security notifications</p>
              </div>
              <Switch 
                id="security-alerts" 
                checked={true}
                disabled
              />
            </div>
            <p className="text-xs text-gray-500">
              Security alerts cannot be disabled as they are required for your account security.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
