// ============================================================================
// QUOTES DASHBOARD - World-Class Quote Management
// Advanced filtering, search, PDF preview, and analytics
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Quote } from '@/types/quote'
import { QuoteDownloadButton } from '@/components/quotes/QuotePDFPreview'
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  MoreVertical,
  ArrowUpDown,
  Grid,
  List as ListIcon,
  Loader2,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

interface QuoteListItem {
  id: string
  quoteNumber: string
  title: string
  status: string
  total: number
  currency: string
  createdAt: string
  validUntil?: string
  clientName?: string
  clientCompany?: string
  category?: string
  Client?: {
    id: string
    name: string
    email: string
    company?: string
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function QuotesDashboard() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<QuoteListItem[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'number' | 'amount' | 'client'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set())

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0,
    accepted: 0,
    rejected: 0,
    totalValue: 0,
    acceptedValue: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    fetchQuotes()
  }, [])

  useEffect(() => {
    filterAndSortQuotes()
    calculateStats()
  }, [quotes, searchQuery, statusFilter, categoryFilter, sortBy, sortOrder])

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      // Add timestamp to prevent caching
      const res = await fetch(`/api/admin/quotes?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await res.json()
      
      if (data.success) {
        setQuotes(data.quotes || [])
      } else {
        console.error('Failed to fetch quotes:', data.error)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // FILTERING & SORTING
  // ============================================================================

  const filterAndSortQuotes = () => {
    let filtered = [...quotes]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(q => q.category === categoryFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(q =>
        q.quoteNumber.toLowerCase().includes(query) ||
        q.title.toLowerCase().includes(query) ||
        q.clientName?.toLowerCase().includes(query) ||
        q.Client?.name?.toLowerCase().includes(query) ||
        q.clientCompany?.toLowerCase().includes(query) ||
        q.Client?.company?.toLowerCase().includes(query)
      )
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'date':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          break
        case 'number':
          comparison = a.quoteNumber.localeCompare(b.quoteNumber)
          break
        case 'amount':
          comparison = (b.total || 0) - (a.total || 0)
          break
        case 'client':
          const nameA = a.clientName || a.Client?.name || ''
          const nameB = b.clientName || b.Client?.name || ''
          comparison = nameA.localeCompare(nameB)
          break
      }

      return sortOrder === 'asc' ? -comparison : comparison
    })

    setFilteredQuotes(filtered)
  }

  const calculateStats = () => {
    const total = quotes.length
    const draft = quotes.filter(q => q.status === 'draft').length
    const sent = quotes.filter(q => q.status === 'sent' || q.status === 'viewed').length
    const accepted = quotes.filter(q => q.status === 'accepted').length
    const rejected = quotes.filter(q => q.status === 'rejected').length

    const totalValue = quotes.reduce((sum, q) => sum + (q.total || 0), 0)
    const acceptedValue = quotes
      .filter(q => q.status === 'accepted')
      .reduce((sum, q) => sum + (q.total || 0), 0)

    const conversionRate = sent > 0 ? (accepted / sent) * 100 : 0

    setStats({
      total,
      draft,
      sent,
      accepted,
      rejected,
      totalValue,
      acceptedValue,
      conversionRate,
    })
  }

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return

    try {
      const res = await fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        // Remove from local state immediately
        setQuotes(quotes.filter(q => q.id !== id))
        // Also refresh from server to ensure sync
        await fetchQuotes()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting quote:', error)
      alert('Failed to delete quote')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedQuotes.size === 0) return
    if (!confirm(`Delete ${selectedQuotes.size} selected quotes?`)) return

    try {
      const promises = Array.from(selectedQuotes).map(id =>
        fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' })
      )
      
      await Promise.all(promises)
      setQuotes(quotes.filter(q => !selectedQuotes.has(q.id)))
      setSelectedQuotes(new Set())
      // Refresh from server to ensure sync
      await fetchQuotes()
    } catch (error) {
      console.error('Error deleting quotes:', error)
      alert('Failed to delete some quotes')
    }
  }

  const toggleQuoteSelection = (id: string) => {
    const newSelected = new Set(selectedQuotes)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedQuotes(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedQuotes.size === filteredQuotes.length) {
      setSelectedQuotes(new Set())
    } else {
      setSelectedQuotes(new Set(filteredQuotes.map(q => q.id)))
    }
  }

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; icon: any }> = {
      draft: { bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock },
      sent: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Send },
      viewed: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Eye },
      accepted: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      expired: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock },
    }

    const variant = variants[status] || variants.draft
    const Icon = variant.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${variant.bg} ${variant.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatCurrency = (amount: number | undefined | null, currency: string = 'USD') => {
    if (amount === undefined || amount === null || isNaN(amount)) return '$0.00'
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', GHS: '₵' }
    return `${symbols[currency] || '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (date: string | undefined | null) => {
    if (!date) return 'N/A'
    try {
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) return 'Invalid date'
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-lg text-slate-600">Loading quotes...</span>
      </div>
    )
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Quotes</h1>
              <p className="mt-2 text-slate-600">Manage your project quotes and proposals</p>
            </div>
            
            <Link
              href="/admin/quotes/new"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-5 h-5" />
              New Quote
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Quotes"
            value={stats.total.toString()}
            icon={FileText}
            color="indigo"
          />
          <StatCard
            title="Total Value"
            value={formatCurrency(stats.totalValue)}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Accepted"
            value={stats.accepted.toString()}
            subtitle={formatCurrency(stats.acceptedValue)}
            icon={CheckCircle}
            color="emerald"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search quotes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="number">Sort by Number</option>
              <option value="amount">Sort by Amount</option>
              <option value="client">Sort by Client</option>
            </select>
          </div>

          {/* View Mode & Bulk Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectAll}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {selectedQuotes.size === filteredQuotes.length ? 'Deselect All' : 'Select All'}
              </button>
              
              {selectedQuotes.size > 0 && (
                <>
                  <span className="text-sm text-slate-500">|</span>
                  <span className="text-sm text-slate-600">{selectedQuotes.size} selected</span>
                  <button
                    onClick={handleBulkDelete}
                    className="ml-2 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete Selected
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quotes List */}
        {filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No quotes found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first quote to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link
                href="/admin/quotes/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Quote
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotes.map(quote => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                isSelected={selectedQuotes.has(quote.id)}
                onToggleSelect={() => toggleQuoteSelection(quote.id)}
                onDelete={() => handleDelete(quote.id)}
                getStatusBadge={getStatusBadge}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedQuotes.size === filteredQuotes.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Quote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredQuotes.map(quote => (
                  <QuoteRow
                    key={quote.id}
                    quote={quote}
                    isSelected={selectedQuotes.has(quote.id)}
                    onToggleSelect={() => toggleQuoteSelection(quote.id)}
                    onDelete={() => handleDelete(quote.id)}
                    getStatusBadge={getStatusBadge}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  subtitle?: string
  icon: any
  color: string
}) {
  const colors: Record<string, { bg: string; icon: string; text: string }> = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', text: 'text-indigo-900' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', text: 'text-green-900' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', text: 'text-emerald-900' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-900' },
  }

  const variant = colors[color] || colors.indigo

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${variant.text}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${variant.bg}`}>
          <Icon className={`w-6 h-6 ${variant.icon}`} />
        </div>
      </div>
    </div>
  )
}

function QuoteCard({
  quote,
  isSelected,
  onToggleSelect,
  onDelete,
  getStatusBadge,
  formatCurrency,
  formatDate,
}: any) {
  const router = useRouter()

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${isSelected ? 'border-indigo-500' : 'border-slate-200'}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="mt-1 rounded border-slate-300"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">{quote.title}</h3>
              <p className="text-sm text-slate-500">{quote.quoteNumber}</p>
            </div>
          </div>
          {getStatusBadge(quote.status)}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="w-4 h-4" />
            <span>{quote.clientName || quote.Client?.name || 'No client'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(quote.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div>
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-xl font-bold text-indigo-600">
              {formatCurrency(quote.total, quote.currency)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/quotes/${quote.id}/edit`}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            
            <QuoteDownloadButton
              quote={quote as Quote}
              variant="ghost"
              size="sm"
              showIcon={true}
            >
              <Download className="w-4 h-4" />
            </QuoteDownloadButton>
            
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuoteRow({
  quote,
  isSelected,
  onToggleSelect,
  onDelete,
  getStatusBadge,
  formatCurrency,
  formatDate,
}: any) {
  return (
    <tr className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-indigo-50' : ''}`}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="rounded border-slate-300"
        />
      </td>
      <td className="px-6 py-4">
        <div>
          <Link
            href={`/admin/quotes/${quote.id}/edit`}
            className="font-medium text-slate-900 hover:text-indigo-600"
          >
            {quote.title}
          </Link>
          <p className="text-sm text-slate-500">{quote.quoteNumber}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-900">{quote.clientName || quote.Client?.name || '-'}</div>
        {quote.clientCompany && <div className="text-xs text-slate-500">{quote.clientCompany}</div>}
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-slate-900">{formatCurrency(quote.total, quote.currency)}</div>
      </td>
      <td className="px-6 py-4">{getStatusBadge(quote.status)}</td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-600">{formatDate(quote.createdAt)}</div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/quotes/${quote.id}/edit`}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <QuoteDownloadButton quote={quote as Quote} variant="ghost" size="sm" showIcon={true}>
            <Download className="w-4 h-4" />
          </QuoteDownloadButton>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
