'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <h1 className="text-6xl font-bold mb-16 gradient-text">How CuriousPay Works</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative bg-white/5 rounded-lg border border-white/10 p-8 transition-all hover:bg-white/10"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#00FF84] rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 flex-shrink-0 text-[#00FF84]">
                    <step.icon />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#00FF84] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of businesses and customers already using CuriousPay for their payment needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/sign-up"
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-black bg-[#00FF84] hover:bg-[#00FF84]/90"
              >
                Create Account
              </a>
              <a
                href="/docs"
                className="inline-flex items-center px-8 py-3 border border-white text-lg font-medium rounded-md text-white hover:bg-white/10"
              >
                Read Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const steps = [
  {
    title: 'Business Registration',
    description: 'Sign up for a business account and receive your unique 6-digit identifier (UID) for accepting payments. Our streamlined process gets you up and running in minutes.',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
      </svg>
    )
  },
  {
    title: 'Payment Setup',
    description: 'Generate QR codes or share your UID with customers. Choose which currencies you want to accept, including both crypto and fiat options.',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
      </svg>
    )
  },
  {
    title: 'Customer Payment',
    description: 'Customers can pay using their preferred currency by scanning the QR code or entering your UID. The process is as simple as traditional mobile money.',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    )
  },
  {
    title: 'Instant Settlement',
    description: 'Receive payments instantly in your preferred currency, with automatic conversion if needed. No more waiting for traditional settlement periods.',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    )
  }
]
