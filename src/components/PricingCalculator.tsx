'use client'

import { useState, useEffect } from 'react'

// Pricing data based on your breakdown
const PRICING_DATA = {
  packages: {
    website: {
      name: 'Corporate Website',
      baseSetup: 2200,
      baseMonthly: 120,
      devHours: 40,
      complexity: 1,
    },
    webTool: {
      name: 'Web Tool / Dashboard',
      baseSetup: 3500,
      baseMonthly: 180,
      devHours: 80,
      complexity: 1.5,
    },
    webApp: {
      name: 'Web Application',
      baseSetup: 8000,
      baseMonthly: 250,
      devHours: 150,
      complexity: 2,
    },
    saas: {
      name: 'SaaS Platform',
      baseSetup: 18000,
      baseMonthly: 450,
      devHours: 300,
      complexity: 3,
    },
  },
  features: {
    authentication: { setup: 200, monthly: 5, hours: 8 },
    database: { setup: 100, monthly: 30, hours: 10 },
    payment: { setup: 500, monthly: 10, hours: 20 },
    api: { setup: 300, monthly: 15, hours: 15 },
    realtime: { setup: 400, monthly: 20, hours: 18 },
    analytics: { setup: 250, monthly: 10, hours: 12 },
    multiLanguage: { setup: 300, monthly: 5, hours: 15 },
    mobileApp: { setup: 3000, monthly: 100, hours: 120 },
  },
  timeline: {
    urgent: 1.5, // 50% rush fee
    normal: 1,
    flexible: 0.9, // 10% discount
  },
}

export default function PricingCalculator() {
  const [projectType, setProjectType] = useState<keyof typeof PRICING_DATA.packages>('website')
  const [features, setFeatures] = useState<string[]>([])
  const [timeline, setTimeline] = useState<keyof typeof PRICING_DATA.timeline>('normal')
  const [pageCount, setPageCount] = useState(5)
  const [userCount, setUserCount] = useState(10)
  
  const [estimate, setEstimate] = useState({
    setupMin: 0,
    setupMax: 0,
    monthlyMin: 0,
    monthlyMax: 0,
    devTime: 0,
  })

  useEffect(() => {
    calculateEstimate()
  }, [projectType, features, timeline, pageCount, userCount])

  const calculateEstimate = () => {
    const pkg = PRICING_DATA.packages[projectType]
    let setupCost = pkg.baseSetup
    let monthlyCost = pkg.baseMonthly
    let totalHours = pkg.devHours

    // Add feature costs
    features.forEach(feature => {
      const featureData = PRICING_DATA.features[feature as keyof typeof PRICING_DATA.features]
      if (featureData) {
        setupCost += featureData.setup
        monthlyCost += featureData.monthly
        totalHours += featureData.hours
      }
    })

    // Adjust for page count (websites/tools)
    if (projectType === 'website' || projectType === 'webTool') {
      if (pageCount > 10) {
        const extraPages = pageCount - 10
        setupCost += extraPages * 100 // $100 per extra page
        totalHours += extraPages * 2
      }
    }

    // Adjust for user count (apps/saas)
    if (projectType === 'webApp' || projectType === 'saas') {
      if (userCount > 100) {
        const scaleFactor = Math.ceil(userCount / 100)
        monthlyCost += scaleFactor * 50 // $50 per 100 users
      }
    }

    // Apply timeline multiplier
    const timelineMultiplier = PRICING_DATA.timeline[timeline]
    setupCost *= timelineMultiplier

    // Calculate range (±15% variance)
    const setupMin = Math.round(setupCost * 0.85)
    const setupMax = Math.round(setupCost * 1.15)
    const monthlyMin = Math.round(monthlyCost * 0.9)
    const monthlyMax = Math.round(monthlyCost * 1.1)

    setEstimate({
      setupMin,
      setupMax,
      monthlyMin,
      monthlyMax,
      devTime: Math.ceil(totalHours / 40), // Convert hours to weeks
    })
  }

  const toggleFeature = (feature: string) => {
    setFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatGHS = (amount: number) => {
    const ghsAmount = amount * 15 // $1 = GHS 15 (approximate)
    return new Intl.NumberFormat('en-GH', {
      minimumFractionDigits: 0,
    }).format(ghsAmount)
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          💰 Instant Cost Calculator
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Get a real-time estimate based on your project needs
        </p>
      </div>

      {/* Project Type */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">
          1️⃣ What type of project do you need?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(PRICING_DATA.packages).map(([key, pkg]) => (
            <button
              key={key}
              onClick={() => setProjectType(key as any)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                projectType === key
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
              }`}
            >
              <div className="font-semibold">{pkg.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                ~{pkg.devHours} hours • {Math.ceil(pkg.devHours / 40)} weeks
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">
          2️⃣ Select features you need:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(PRICING_DATA.features).map(([key, feature]) => (
            <button
              key={key}
              onClick={() => toggleFeature(key)}
              className={`p-3 rounded-lg border transition-all text-xs sm:text-sm ${
                features.includes(key)
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
              }`}
            >
              {key === 'authentication' && '🔐 Auth'}
              {key === 'database' && '🗄️ Database'}
              {key === 'payment' && '💳 Payments'}
              {key === 'api' && '🔌 API'}
              {key === 'realtime' && '⚡ Real-time'}
              {key === 'analytics' && '📊 Analytics'}
              {key === 'multiLanguage' && '🌍 Multi-lang'}
              {key === 'mobileApp' && '📱 Mobile App'}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        {/* Page Count */}
        {(projectType === 'website' || projectType === 'webTool') && (
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">
              📄 Number of pages: {pageCount}
            </label>
            <input
              type="range"
              min="3"
              max="50"
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        )}

        {/* User Count */}
        {(projectType === 'webApp' || projectType === 'saas') && (
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">
              👥 Expected users: {userCount}
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={userCount}
              onChange={(e) => setUserCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        )}

        {/* Timeline */}
        <div>
          <label className="block text-white font-semibold mb-2 text-sm">
            ⏱️ Timeline preference:
          </label>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value as any)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="urgent">🚀 Urgent (1-2 weeks) +50%</option>
            <option value="normal">📅 Normal (standard timeline)</option>
            <option value="flexible">⏳ Flexible (save 10%)</option>
          </select>
        </div>
      </div>

      {/* Estimate Results */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-2 border-blue-500/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          💡 Your Estimated Cost
        </h3>
        
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Setup Fee (One-time)</div>
            <div className="text-2xl font-bold text-green-400">
              {formatUSD(estimate.setupMin)} - {formatUSD(estimate.setupMax)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              GHS {formatGHS(estimate.setupMin)} - {formatGHS(estimate.setupMax)}
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Monthly Maintenance</div>
            <div className="text-2xl font-bold text-blue-400">
              {formatUSD(estimate.monthlyMin)} - {formatUSD(estimate.monthlyMax)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              GHS {formatGHS(estimate.monthlyMin)} - {formatGHS(estimate.monthlyMax)}
            </div>
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-400 text-sm">Estimated Timeline</div>
              <div className="text-xl font-bold text-yellow-400">
                {estimate.devTime} - {estimate.devTime + 2} weeks
              </div>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-300">
            💡 <strong>Note:</strong> This is an estimate. Final pricing depends on specific requirements and complexity.
            Contact us for a detailed quote!
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <a
          href="/contact"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          📧 Get Detailed Quote
        </a>
      </div>
    </div>
  )
}
