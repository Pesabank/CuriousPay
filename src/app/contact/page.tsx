'use client'

import { Navbar } from '@/components/Navbar'
import { useState } from 'react'

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log('Form submitted:', formState)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <h1 className="text-6xl font-bold mb-16 gradient-text">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
              <div className="space-y-8">
                {contactMethods.map((method) => (
                  <div key={method.title} className="flex items-start space-x-4">
                    <div className="mt-1">
                      <method.icon className="w-6 h-6 text-[#00FF84]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{method.title}</h3>
                      <p className="text-gray-400 text-lg">{method.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-4">Office Hours</h2>
                <div className="text-gray-400 text-lg space-y-2">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM (EAT)</p>
                  <p>Saturday: 9:00 AM - 1:00 PM (EAT)</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10">
                <div>
                  <label htmlFor="name" className="block text-lg font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF84] text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF84] text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-lg font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF84] text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-lg font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF84] text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-[#00FF84] text-black rounded-md font-medium hover:bg-[#00FF84]/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const contactMethods = [
  {
    title: 'Email',
    content: 'support@lipapay.com',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    )
  },
  {
    title: 'Phone',
    content: '+254 700 000 000',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    )
  },
  {
    title: 'Address',
    content: 'Nairobi, Kenya',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    )
  }
]
