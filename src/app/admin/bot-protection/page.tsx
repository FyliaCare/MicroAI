'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Activity,
  RefreshCw,
  Trash2,
  Filter,
  Search
} from 'lucide-react'

interface BlockedRequest {
  id: string
  ipAddress: string
  userAgent: string | null
  endpoint: string
  botScore: number
  reasons: string[]
  fingerprint: any
  formData: any
  blockedAt: string
}

interface Stats {
  total: number
  uniqueIPs: number
  avgBotScore: number
  topIPs: Array<{ ip: string; count: number }>
}

export default function BotProtectionDashboard() {
  const [requests, setRequests] = useState<BlockedRequest[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    minScore: 0,
    endpoint: '',
    ip: '',
    limit: 50
  })
  const [selectedRequest, setSelectedRequest] = useState<BlockedRequest | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter.minScore > 0) params.append('minScore', filter.minScore.toString())
      if (filter.endpoint) params.append('endpoint', filter.endpoint)
      if (filter.ip) params.append('ip', filter.ip)
      params.append('limit', filter.limit.toString())

      const response = await fetch(`/api/admin/blocked-requests?${params}`)
      const data = await response.json()

      if (data.success) {
        setRequests(data.requests)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch blocked requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearOldRequests = async (daysOld: number) => {
    if (!confirm(`Delete all blocked requests older than ${daysOld} days?`)) return

    try {
      const response = await fetch(`/api/admin/blocked-requests?daysOld=${daysOld}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`Successfully deleted ${data.deleted} old requests`)
        fetchData()
      }
    } catch (error) {
      console.error('Failed to delete old requests:', error)
      alert('Failed to delete old requests')
    }
  }

  useEffect(() => {
    fetchData()
  }, [filter.minScore, filter.endpoint, filter.ip])

  const getBotScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-500 bg-red-500/10 border-red-500/30'
    if (score >= 50) return 'text-orange-500 bg-orange-500/10 border-orange-500/30'
    if (score >= 30) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
    return 'text-green-500 bg-green-500/10 border-green-500/30'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Bot Protection Dashboard</h1>
          </div>
          <p className="text-gray-400">Monitor and analyze blocked bot requests in real-time</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <p className="text-gray-400 text-sm">Total Blocked</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 text-blue-500" />
                <span className="text-2xl font-bold">{stats.uniqueIPs}</span>
              </div>
              <p className="text-gray-400 text-sm">Unique IPs</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-purple-500" />
                <span className="text-2xl font-bold">{stats.avgBotScore.toFixed(1)}</span>
              </div>
              <p className="text-gray-400 text-sm">Avg Bot Score</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-6 h-6 text-green-500" />
                <span className="text-2xl font-bold text-green-500">Active</span>
              </div>
              <p className="text-gray-400 text-sm">Protection Status</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-400 mb-2">Min Bot Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filter.minScore}
                onChange={(e) => setFilter({ ...filter, minScore: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-400 mb-2">Endpoint</label>
              <input
                type="text"
                placeholder="/api/contact"
                value={filter.endpoint}
                onChange={(e) => setFilter({ ...filter, endpoint: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-400 mb-2">IP Address</label>
              <input
                type="text"
                placeholder="192.168.1.1"
                value={filter.ip}
                onChange={(e) => setFilter({ ...filter, ip: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
              />
            </div>

            <button
              onClick={fetchData}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={() => clearOldRequests(30)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
            >
              <Trash2 className="w-4 h-4" />
              Clear Old
            </button>
          </div>
        </div>

        {/* Top IPs */}
        {stats && stats.topIPs.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Top Offending IPs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.topIPs.map((ipData, index) => (
                <div key={index} className="bg-gray-900 border border-gray-700 rounded p-4">
                  <div className="text-sm text-gray-400 mb-1">#{index + 1}</div>
                  <div className="font-mono text-sm mb-2">{ipData.ip}</div>
                  <div className="text-red-500 font-bold">{ipData.count} attempts</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">Blocked Requests</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>No blocked requests found. Your site is secure! 🎉</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Endpoint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Bot Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Reasons</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 text-sm">
                        {new Date(request.blockedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-gray-900 px-2 py-1 rounded">
                          {request.ipAddress}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm">{request.endpoint}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getBotScoreColor(request.botScore)}`}>
                          {request.botScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="max-w-xs">
                          {request.reasons.slice(0, 2).map((reason, i) => (
                            <div key={i} className="text-gray-400 truncate">• {reason}</div>
                          ))}
                          {request.reasons.length > 2 && (
                            <div className="text-gray-500 text-xs">+{request.reasons.length - 2} more</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRequest(null)}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold">Request Details</h3>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Bot Score</h4>
                  <span className={`px-4 py-2 rounded-full font-bold border text-lg ${getBotScoreColor(selectedRequest.botScore)}`}>
                    {selectedRequest.botScore}/100
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Detection Reasons</h4>
                  <ul className="space-y-2">
                    {selectedRequest.reasons.map((reason, i) => (
                      <li key={i} className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400">
                        • {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Request Info</h4>
                  <div className="bg-gray-900 rounded p-4 space-y-2 text-sm">
                    <div><span className="text-gray-400">IP:</span> <code>{selectedRequest.ipAddress}</code></div>
                    <div><span className="text-gray-400">Endpoint:</span> <code>{selectedRequest.endpoint}</code></div>
                    <div><span className="text-gray-400">Time:</span> {new Date(selectedRequest.blockedAt).toLocaleString()}</div>
                    {selectedRequest.userAgent && (
                      <div><span className="text-gray-400">User-Agent:</span> <code className="text-xs">{selectedRequest.userAgent}</code></div>
                    )}
                  </div>
                </div>

                {selectedRequest.formData && (
                  <div>
                    <h4 className="font-semibold mb-2">Form Data</h4>
                    <pre className="bg-gray-900 rounded p-4 text-xs overflow-x-auto">
                      {JSON.stringify(selectedRequest.formData, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedRequest.fingerprint && (
                  <div>
                    <h4 className="font-semibold mb-2">Fingerprint</h4>
                    <pre className="bg-gray-900 rounded p-4 text-xs overflow-x-auto">
                      {JSON.stringify(selectedRequest.fingerprint, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
