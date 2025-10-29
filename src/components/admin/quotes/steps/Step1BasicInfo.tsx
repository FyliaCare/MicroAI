import React from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { QuoteData, Client } from '../types'

interface Step1Props {
  quoteData: QuoteData
  setQuoteData: React.Dispatch<React.SetStateAction<QuoteData>>
  clients: Client[]
}

export default function Step1BasicInfo({
  quoteData,
  setQuoteData,
  clients,
}: Step1Props) {
  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Basic Information
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Start with the fundamentals of your quote
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quote Number */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Quote Number *
          </label>
          <Input
            value={quoteData.quoteNumber}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, quoteNumber: e.target.value }))
            }
            placeholder="QT-202410-1234"
            className="font-mono bg-slate-50 dark:bg-slate-800"
          />
          <p className="text-xs text-slate-500 mt-1">Auto-generated unique identifier</p>
        </div>

        {/* Client Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Client *
          </label>
          <select
            value={quoteData.clientId}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, clientId: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="">Select a client...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
                {client.company && ` (${client.company})`}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            {clients.length === 0 ? 'No clients found. Create one first.' : 'Choose from existing clients'}
          </p>
        </div>

        {/* Project Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Project Title *
          </label>
          <Input
            value={quoteData.title}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g., E-commerce Platform Development"
            className="text-lg font-semibold"
          />
          <p className="text-xs text-slate-500 mt-1">Clear, descriptive title for this project</p>
        </div>

        {/* Project Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Project Type *
          </label>
          <select
            value={quoteData.projectType}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, projectType: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="">Select type...</option>
            <option value="web-application">🌐 Web Application</option>
            <option value="mobile-app">📱 Mobile App</option>
            <option value="website">🎨 Website</option>
            <option value="e-commerce">🛒 E-commerce</option>
            <option value="saas">☁️ SaaS Platform</option>
            <option value="api">🔌 API Development</option>
            <option value="consulting">💼 Consulting</option>
            <option value="maintenance">🔧 Maintenance & Support</option>
            <option value="custom">⚡ Custom Solution</option>
          </select>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Industry
          </label>
          <select
            value={quoteData.industry}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, industry: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="">Select industry...</option>
            <option value="healthcare">🏥 Healthcare</option>
            <option value="finance">💰 Finance & Banking</option>
            <option value="retail">🛍️ Retail & E-commerce</option>
            <option value="education">📚 Education</option>
            <option value="real-estate">🏢 Real Estate</option>
            <option value="hospitality">🏨 Hospitality</option>
            <option value="technology">💻 Technology</option>
            <option value="manufacturing">🏭 Manufacturing</option>
            <option value="logistics">🚚 Logistics</option>
            <option value="other">🔷 Other</option>
          </select>
        </div>

        {/* Valid Until */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Valid Until *
          </label>
          <Input
            type="date"
            value={quoteData.validUntil}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, validUntil: e.target.value }))
            }
            className="bg-white dark:bg-slate-800"
          />
          <p className="text-xs text-slate-500 mt-1">Quote expiration date</p>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Currency *
          </label>
          <select
            value={quoteData.currency}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, currency: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="USD">USD ($) - US Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="CAD">CAD (C$) - Canadian Dollar</option>
            <option value="AUD">AUD (A$) - Australian Dollar</option>
          </select>
        </div>

        {/* Internal Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Internal Notes
            <span className="ml-2 text-xs font-normal text-slate-500">(Not visible to client)</span>
          </label>
          <Textarea
            value={quoteData.internalNotes}
            onChange={(e) =>
              setQuoteData((prev) => ({ ...prev, internalNotes: e.target.value }))
            }
            placeholder="Add any internal notes, reminders, or special considerations for this quote..."
            rows={3}
            className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
          />
          <p className="text-xs text-slate-500 mt-1">
            💡 Use this for team communication and internal tracking
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>
            <strong>Tip:</strong> All fields marked with * are required to proceed to the next step.
          </span>
        </p>
      </div>
    </Card>
  )
}
