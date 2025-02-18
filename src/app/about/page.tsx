'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-6xl font-bold mb-8 gradient-text">About LipaPay</h1>
            
            <div className="space-y-12">
              <section>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-xl text-gray-400">
                  LipaPay aims to bridge the gap between traditional mobile money solutions and blockchain technology in Africa. 
                  We believe that everyone should have access to fast, secure, and affordable financial services, regardless of their location or technical expertise.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-4">Why LipaPay?</h2>
                <p className="text-xl text-gray-400 mb-6">
                  Built on the Solana blockchain, LipaPay combines the speed and reliability of traditional payment systems with the security and transparency of blockchain technology. 
                  Our platform is designed to compete with established mobile money solutions while offering additional benefits such as:
                </p>
                <ul className="list-none space-y-4 text-xl text-gray-400">
                  <li className="flex items-center space-x-2">
                    <span className="text-[#00FF84]">•</span>
                    <span>Lower transaction fees</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-[#00FF84]">•</span>
                    <span>Instant settlements</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-[#00FF84]">•</span>
                    <span>Cross-border payments</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-[#00FF84]">•</span>
                    <span>Multi-currency support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-[#00FF84]">•</span>
                    <span>Enhanced security features</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-xl text-gray-400">
                  We envision a future where blockchain payments are as commonplace as mobile money in Africa. 
                  LipaPay is building the infrastructure to make this vision a reality, starting with Solana and expanding to other blockchain networks.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-4">Join the Revolution</h2>
                <p className="text-xl text-gray-400">
                  Whether you're a business looking to accept crypto payments or a customer wanting to experience the future of money, 
                  LipaPay provides the tools and infrastructure you need. Join us in building a more inclusive and efficient financial system for Africa.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
