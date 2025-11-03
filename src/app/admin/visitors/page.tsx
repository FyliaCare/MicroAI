'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet map (prevents SSR issues)
const VisitorsMapLeaflet = dynamic(
  () => import('@/components/admin/VisitorsMapLeaflet'),
  { ssr: false, loading: () => <div className="w-full h-[600px] bg-slate-100 rounded-xl animate-pulse" /> }
)

interface AnalyticsData {
  overview: {
    totalVisits: number
    totalProjectRequests: number
    avgTimeOnSite: number
    conversionRate: string
    uniqueCountries: number
  }
  countries: Array<{
    country: string
    countryCode: string
    visits: number
    projectRequests: number
    avgTimeOnSite: number
    latitude?: number | null
    longitude?: number | null
  }>
  devices: Record<string, number>
  browsers: Record<string, number>
  recentVisitors: Array<{
    country: string
    city: string
    pageUrl: string
    device: string
    visitedAt: string
  }>
}

export default function VisitorAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics/visitors?days=${days}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return <div className="p-8 text-center">Failed to load analytics</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🌍 Visitor Analytics
            </h1>
            <p className="text-slate-600 mt-1">Track global engagement and identify key regions</p>
          </div>
          
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            icon="👥"
            title="Total Visits"
            value={data.overview.totalVisits.toLocaleString()}
            color="blue"
          />
          <MetricCard
            icon="📋"
            title="Project Requests"
            value={data.overview.totalProjectRequests.toLocaleString()}
            color="green"
          />
          <MetricCard
            icon="⏱️"
            title="Avg. Time on Site"
            value={formatTime(data.overview.avgTimeOnSite)}
            color="purple"
          />
          <MetricCard
            icon="📈"
            title="Conversion Rate"
            value={`${data.overview.conversionRate}%`}
            color="pink"
          />
          <MetricCard
            icon="🌎"
            title="Countries"
            value={data.overview.uniqueCountries.toString()}
            color="indigo"
          />
        </div>

        {/* World Map - Leaflet */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">🗺️ Global Visitor Map</h2>
          <VisitorsMapLeaflet countries={data.countries} />
        </div>

        {/* Top Countries & Device Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Countries */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">🏆 Top Countries</h2>
            <div className="space-y-3">
              {data.countries.slice(0, 10).map((country, index) => (
                <div key={country.countryCode} className="flex items-center gap-3">
                  <div className="text-2xl w-8 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </div>
                  <div className="text-2xl">{getFlagEmoji(country.countryCode)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900">{country.country}</span>
                      <span className="text-sm text-slate-600">{country.visits} visits</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(country.visits / data.countries[0].visits) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {country.projectRequests} 📋
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device & Browser Stats */}
          <div className="space-y-6">
            {/* Devices */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">📱 Devices</h2>
              <div className="space-y-3">
                {Object.entries(data.devices).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getDeviceIcon(device)}</span>
                      <span className="font-medium capitalize text-slate-700">{device}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${(count / data.overview.totalVisits) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browsers */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">🌐 Browsers</h2>
              <div className="space-y-3">
                {Object.entries(data.browsers).slice(0, 5).map(([browser, count]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{browser}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${(count / data.overview.totalVisits) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">🕐 Recent Visitors</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Page</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Device</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.recentVisitors.map((visitor, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {visitor.country}, {visitor.city || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 truncate max-w-xs">
                      {visitor.pageUrl}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                      {visitor.device}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(visitor.visitedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function MetricCard({ icon, title, value, color }: {
  icon: string
  title: string
  value: string
  color: string
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
      </div>
      <p className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} bg-clip-text text-transparent`}>
        {value}
      </p>
    </div>
  )
}

// Helper Functions
function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode === 'XX') return '🌍'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function getDeviceIcon(device: string): string {
  const icons: Record<string, string> = {
    mobile: '📱',
    desktop: '💻',
    tablet: '📱',
    unknown: '❓'
  }
  return icons[device.toLowerCase()] || '❓'
}
