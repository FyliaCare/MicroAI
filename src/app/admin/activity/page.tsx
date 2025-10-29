'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

interface ActivityLog {
  id: string
  action: string
  entity: string
  entityId: string
  description: string
  userId?: string
  metadata?: string
  createdAt: string
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [entityFilter, setEntityFilter] = useState<string>('all')

  useEffect(() => {
    fetchLogs()
  }, [entityFilter])

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams()
      if (entityFilter !== 'all') {
        params.append('entity', entityFilter)
      }
      
      const res = await fetch(`/api/admin/activity-logs?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      log.description.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.entity.toLowerCase().includes(query)
    )
  })

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'updated':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
      case 'deleted':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      case 'accepted':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      case 'viewed':
        return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400'
      case 'converted':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return '✨'
      case 'updated':
        return '✏️'
      case 'deleted':
        return '🗑️'
      case 'accepted':
        return '✅'
      case 'rejected':
        return '❌'
      case 'viewed':
        return '👁️'
      case 'converted':
        return '🔄'
      default:
        return '📋'
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 mt-4">
            Loading activity logs...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Activity Log
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track all actions and changes in the system
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search activity logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Entity Filter */}
            <div className="sm:w-48">
              <select
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Entities</option>
                <option value="Quote">Quotes</option>
                <option value="Project">Projects</option>
                <option value="Client">Clients</option>
                <option value="Invoice">Invoices</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Activity Timeline */}
        {filteredLogs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-slate-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No activity found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery || entityFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Activity logs will appear here'}
            </p>
          </Card>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

            {/* Timeline Items */}
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="relative flex items-start gap-4">
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-2xl">
                      {getActionIcon(log.action)}
                    </div>
                  </div>

                  {/* Content */}
                  <Card className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold">
                          {log.entity}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {log.description}
                    </p>
                    {log.metadata && (
                      <details className="mt-2">
                        <summary className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                          View details
                        </summary>
                        <pre className="mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded text-xs overflow-x-auto">
                          {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                        </pre>
                      </details>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load More */}
        {filteredLogs.length >= 50 && (
          <div className="text-center mt-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing latest 50 entries
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
