'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'

interface Subscriber {
  id: string
  email: string
  name?: string
  status: string
  subscribed: boolean
  createdAt: string
}

interface Newsletter {
  id: string
  subject: string
  status: string
  sentAt?: string
  sentTo: number
  openedCount: number
  clickedCount: number
  createdByName?: string
  createdAt: string
}

export default function NewsletterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'compose' | 'sent' | 'subscribers'>('compose')
  
  // Compose form state
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  // Subscribers state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [subscriberStats, setSubscriberStats] = useState<any>({})
  const [subscribersLoading, setSubscribersLoading] = useState(true)
  
  // Sent newsletters state
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [newslettersLoading, setNewslettersLoading] = useState(true)

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setSubscribersLoading(true)
      const response = await fetch('/api/admin/newsletter/subscribers')
      const data = await response.json()
      if (response.ok) {
        setSubscribers(data.subscribers)
        setSubscriberStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    } finally {
      setSubscribersLoading(false)
    }
  }

  // Fetch sent newsletters
  const fetchNewsletters = async () => {
    try {
      setNewslettersLoading(true)
      const response = await fetch('/api/admin/newsletter')
      const data = await response.json()
      if (response.ok) {
        setNewsletters(data.newsletters)
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
    } finally {
      setNewslettersLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchSubscribers()
    } else if (activeTab === 'sent') {
      fetchNewsletters()
    }
  }, [activeTab])

  // Send newsletter
  const handleSend = async () => {
    if (!subject || !content) {
      alert('Please fill in subject and content')
      return
    }

    if (!confirm(`Send newsletter to all active subscribers?`)) {
      return
    }

    try {
      setIsSending(true)
      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          content,
          previewText,
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Newsletter sent successfully to ${data.sentCount} subscribers!`)
        setSubject('')
        setContent('')
        setPreviewText('')
        setActiveTab('sent')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Send error:', error)
      alert('Failed to send newsletter')
    } finally {
      setIsSending(false)
    }
  }

  // Quick insert functions
  const insertVariable = (variable: string) => {
    setContent(content + variable)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">📧 Newsletter Manager</h1>
            <p className="text-gray-400 mt-1">Compose and send newsletters to your subscribers</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('compose')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'compose'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ✍️ Compose
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'sent'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📤 Sent ({newsletters.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'subscribers'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            👥 Subscribers ({subscriberStats.active || 0})
          </button>
        </div>

        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Newsletter Content</h2>
                
                {/* Subject */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Your newsletter subject..."
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Preview Text */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preview Text (optional)
                  </label>
                  <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="Text shown in email preview..."
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Appears in the inbox below the subject line
                  </p>
                </div>

                {/* Content Editor */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content (HTML) *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="<h2>Hello {name}!</h2><p>Your newsletter content here...</p>"
                    rows={20}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    HTML content - use {'{name}'} and {'{email}'} for personalization
                  </p>
                </div>

                {/* Send Button */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setSubject('')
                      setContent('')
                      setPreviewText('')
                    }}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isSending || !subject || !content}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSending ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>📤</span>
                        <span>Send to All Subscribers</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Quick Variables */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Quick Insert</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => insertVariable('{name}')}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors"
                  >
                    {'{name}'} - Subscriber Name
                  </button>
                  <button
                    onClick={() => insertVariable('{email}')}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors"
                  >
                    {'{email}'} - Email Address
                  </button>
                </div>
              </div>

              {/* HTML Templates */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3">HTML Templates</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setContent(`<h2>Hello {name}!</h2>
<p>Thank you for being part of our community.</p>

<h3>What's New</h3>
<p>Here's what we've been working on...</p>

<div style="margin: 20px 0; padding: 20px; background: #f3f4f6; border-radius: 8px;">
  <h4>Feature Highlight</h4>
  <p>Description of your feature or update</p>
</div>

<p><a href="https://www.microaisystems.com" style="display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visit Website</a></p>

<p>Best regards,<br/>The MicroAI Team</p>`)}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors"
                  >
                    📰 Update Template
                  </button>
                  <button
                    onClick={() => setContent(`<h2>Special Offer for {name}!</h2>
<p>We have an exclusive offer just for you.</p>

<div style="margin: 20px 0; padding: 30px; background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; border-radius: 12px; text-align: center;">
  <h3 style="margin: 0 0 10px 0;">Limited Time Offer</h3>
  <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">10% OFF</p>
  <p>All Web Development Services</p>
</div>

<p style="text-align: center;"><a href="https://www.microaisystems.com/contact" style="display: inline-block; background: white; color: #3B82F6; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Get Started</a></p>

<p>This offer expires soon!</p>`)}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors"
                  >
                    🎁 Promotion Template
                  </button>
                </div>
              </div>

              {/* Subscriber Stats */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Subscriber Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active:</span>
                    <span className="text-green-400 font-semibold">{subscriberStats.active || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unsubscribed:</span>
                    <span className="text-gray-400">{subscriberStats.unsubscribed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-semibold">
                      {(Object.values(subscriberStats) as number[]).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sent Tab */}
        {activeTab === 'sent' && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Opens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Sent Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {newslettersLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        Loading newsletters...
                      </td>
                    </tr>
                  ) : newsletters.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        No newsletters sent yet
                      </td>
                    </tr>
                  ) : (
                    newsletters.map((newsletter) => (
                      <tr key={newsletter.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 text-sm text-white">
                          {newsletter.subject}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            newsletter.status === 'sent' ? 'bg-green-900/50 text-green-400' :
                            newsletter.status === 'sending' ? 'bg-blue-900/50 text-blue-400' :
                            newsletter.status === 'failed' ? 'bg-red-900/50 text-red-400' :
                            'bg-gray-900/50 text-gray-400'
                          }`}>
                            {newsletter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {newsletter.sentTo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {newsletter.openedCount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {newsletter.clickedCount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {newsletter.sentAt ? new Date(newsletter.sentAt).toLocaleString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {newsletter.createdByName || 'Admin'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {subscribersLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        Loading subscribers...
                      </td>
                    </tr>
                  ) : subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        No subscribers yet
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 text-sm text-white">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {subscriber.name || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscriber.status === 'active' ? 'bg-green-900/50 text-green-400' :
                            subscriber.status === 'unsubscribed' ? 'bg-gray-900/50 text-gray-400' :
                            'bg-yellow-900/50 text-yellow-400'
                          }`}>
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {subscriber.subscribed ? (
                            <span className="text-green-400">✓ Yes</span>
                          ) : (
                            <span className="text-gray-400">✗ No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(subscriber.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
