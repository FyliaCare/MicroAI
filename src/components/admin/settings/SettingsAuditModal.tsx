'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, User, FileText, ArrowRight, Filter, Search } from 'lucide-react'
import Button from '@/components/ui/Button'

interface HistoryEntry {
  id: string
  settingId: string
  key: string
  oldValue: string | null
  newValue: string
  changedBy: string
  changeReason: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  Setting: {
    key: string
    label: string
    category: string
  }
}

interface SettingsAuditModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsAuditModal({ isOpen, onClose }: SettingsAuditModalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [total, setTotal] = useState(0)
  const [limit] = useState(50)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen, offset])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/settings/history?limit=${limit}&offset=${offset}`
      )
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHistory = history.filter(entry =>
    entry.Setting.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.Setting.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.changedBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  const formatValue = (value: string | null) => {
    if (value === null) return <span className="text-gray-400 italic">null</span>
    if (value.length > 50) return value.substring(0, 50) + '...'
    return value
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-5xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Settings Audit Log</h2>
                  <p className="text-purple-100 text-sm">
                    {total} total changes recorded
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by setting name, key, or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No history entries found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                    >
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {entry.Setting.label}
                            </span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              {entry.Setting.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 font-mono">
                            {entry.Setting.key}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(entry.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{entry.changedBy}</span>
                          </div>
                        </div>
                      </div>

                      {/* Value Change */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                              Old Value
                            </label>
                            <div className="text-sm text-gray-700 font-mono bg-white px-3 py-2 rounded border">
                              {formatValue(entry.oldValue)}
                            </div>
                          </div>
                          
                          <div className="flex justify-center">
                            <ArrowRight className="w-5 h-5 text-purple-500" />
                          </div>
                          
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                              New Value
                            </label>
                            <div className="text-sm text-gray-900 font-mono bg-green-50 px-3 py-2 rounded border border-green-200">
                              {formatValue(entry.newValue)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {(entry.changeReason || entry.ipAddress) && (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          {entry.changeReason && (
                            <span className="italic">{entry.changeReason}</span>
                          )}
                          {entry.ipAddress && (
                            <span className="font-mono">IP: {entry.ipAddress}</span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Pagination */}
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {offset + 1} - {Math.min(offset + limit, total)} of {total}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                  className="px-4 py-2 text-sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= total}
                  className="px-4 py-2 text-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
