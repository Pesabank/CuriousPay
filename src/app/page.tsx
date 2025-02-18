'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-black text-white">
        {/* Hero Section */}
        <section className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col lg:flex-row items-center gap-16">
            {/* Left Column */}
            <div className="flex-1 space-y-8">
              <h1 className="text-6xl font-bold leading-tight">
                Get instant settlement with near-zero fees.
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl">
                LipaPay is a decentralized payment platform built on Solana, designed to compete with 
                traditional mobile money solutions in Africa. It enables businesses and customers to 
                transact securely using both cryptocurrency and fiat currencies.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/auth/sign-up"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#00FF84] hover:bg-[#00FF84]/90"
                >
                  GET STARTED
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10"
                >
                  VIEW DOCS
                </Link>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="flex-1 relative h-[400px] w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-lg transform rotate-3">
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-8">
                  <div className="text-4xl font-bold text-center">
                    <span className="gradient-text">The Future of</span>
                    <br />
                    <span className="gradient-text">Payments in Africa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-black/50 py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold mb-16">
              Now your business can harness the power of blockchain technology with the same 
              speed as traditional payment networks. No more intermediaries. It's just you and 
              your customers.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {features.map((feature, index) => (
                <div key={index} className="p-6 rounded-lg bg-white/5 backdrop-blur-sm">
                  <feature.icon className="w-12 h-12 text-[#00FF84] mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

const features = [
  {
    title: 'Business Dashboard',
    description: 'A comprehensive hub for managing transactions, generating QR codes, and viewing detailed reports.',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    )
  },
  {
    title: 'UID-Based Payments',
    description: 'Unique 6-digit identifiers for businesses, similar to PayBill numbers in mobile money.',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
      </svg>
    )
  },
  {
    title: 'Multi-Blockchain Support',
    description: 'Starting with Solana, with plans to expand to other blockchain networks.',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    )
  },
  {
    title: 'Virtual Accounts',
    description: 'Seamlessly manage both fiat and crypto wallets in one place.',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
      </svg>
    )
  },
  {
    title: 'Cross-Currency Transactions',
    description: 'Pay in one currency and receive in another, bridging crypto and fiat.',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    )
  },
  {
    title: 'Enhanced Security',
    description: '2FA, biometric authentication, and advanced monitoring for maximum security.',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  },
]
