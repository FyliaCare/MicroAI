'use client'

import { useState, useEffect } from 'react'
import { Globe, MapPin, Clock, Users, TrendingUp, Monitor, Smartphone, Chrome } from 'lucide-react'

interface Visitor {
  id: string
  country?: string
  city?: string
  latitude?: number
  longitude?: number
  device?: string
  browser?: string
  duration?: number
  sessionStart: string
  pagesVisited?: string
  converted: boolean
}

export default function VisitorAnalyticsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [stats, setStats] = useState<any>(null)
  const [countryStats, setCountryStats] = useState<any[]>([])
  const [period, setPeriod] = useState('7d')
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/visitor-analytics?period=${period}&limit=100`)
      const data = await response.json()
      
      if (data.success) {
        setVisitors(data.visitors)
        setStats(data.stats)
        setCountryStats(data.countryStats)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(() => {
      fetchAnalytics().catch(err => console.error('Analytics fetch error:', err))
    }, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [period])

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visitor Analytics</h1>
          <p className="text-gray-600 mt-1">Track and analyze your website visitors globally</p>
        </div>
        
        {/* Period Filter */}
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod('24h')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === '24h'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setPeriod('7d')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === '7d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === '30d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.total || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Session Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatDuration(stats?.avgDuration || 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Interactions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.avgInteractions || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Countries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{countryStats.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Countries</h2>
          <div className="space-y-3">
            {countryStats.map((country: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {country.country || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-200 rounded-full h-2 w-32">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(country._count / stats.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                    {country._count}
                  </span>
                </div>
              </div>
            ))}
            {countryStats.length === 0 && (
              <p className="text-center text-gray-500 py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Device/Browser Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Visitor Technology</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Devices</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <Monitor className="w-5 h-5 mx-auto text-gray-600 mb-1" />
                  <p className="text-xs text-gray-500">Desktop</p>
                  <p className="text-lg font-bold text-gray-900">
                    {visitors.filter(v => v.device?.toLowerCase().includes('desktop') || v.device?.toLowerCase().includes('windows')).length}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <Smartphone className="w-5 h-5 mx-auto text-gray-600 mb-1" />
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="text-lg font-bold text-gray-900">
                    {visitors.filter(v => v.device?.toLowerCase().includes('mobile') || v.device?.toLowerCase().includes('android') || v.device?.toLowerCase().includes('iphone')).length}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <Chrome className="w-5 h-5 mx-auto text-gray-600 mb-1" />
                  <p className="text-xs text-gray-500">Tablet</p>
                  <p className="text-lg font-bold text-gray-900">
                    {visitors.filter(v => v.device?.toLowerCase().includes('tablet') || v.device?.toLowerCase().includes('ipad')).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Visitors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Visitors</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Browser
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {visitor.city || visitor.country || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visitor.device || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visitor.browser || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(visitor.duration || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(visitor.sessionStart).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        visitor.converted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {visitor.converted ? 'Converted' : 'Browsing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visitors.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No visitors to display
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
