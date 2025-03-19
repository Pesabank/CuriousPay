'use client'

import { Navbar } from '@/components/Navbar'
import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSuccess(true)
      setForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      setError('Failed to send message. Please try again later.')
    } finally {
      setLoading(false)
    }
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
                      {method.title === 'Email us' && <Mail className="w-6 h-6 text-[#00FF84]" />}
                      {method.title === 'Call us' && <Phone className="w-6 h-6 text-[#00FF84]" />}
                      {method.title === 'Visit us' && <MapPin className="w-6 h-6 text-[#00FF84]" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{method.title}</h3>
                      <p className="text-gray-400 text-lg">{method.description}</p>
                      {method.email && <p className="text-[#00FF84]">{method.email}</p>}
                      {method.phone && <p className="text-[#00FF84]">{method.phone}</p>}
                      {method.address && <p className="text-[#00FF84]">{method.address}</p>}
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
                {success && (
                  <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-md text-white mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-400">Message sent successfully!</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-md text-white mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-400">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-lg font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF84] text-white"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF84] text-white"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-lg font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF84] text-white"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-lg font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF84] text-white"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-[#00FF84] text-black rounded-md font-medium hover:bg-[#00FF84]/90 transition-colors disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
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
    title: 'Email us',
    description: 'Our friendly team is here to help.',
    email: 'curiouspay@gmail.com',
  },
  {
    title: 'Call us',
    description: 'Mon-Fri from 8am to 5pm.',
    phone: '+1 (555) 000-0000',
  },
  {
    title: 'Visit us',
    description: 'Come say hello at our office.',
    address: '100 Smith Street, Nairobi',
  },
]
