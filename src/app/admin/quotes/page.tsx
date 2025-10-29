'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Quote {
  id: string
  quoteNumber: string
  clientId: string
  title: string
  projectType: string
  industry: string
  status: string
  validUntil: string
  total: number
  currency: string
  createdAt: string
  updatedAt: string
  client?: {
    id: string
    name: string
    email: string
    company?: string | null
  }
}

export default function QuotesListPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'number' | 'amount' | 'client'>('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchQuotes()
  }, [])

  useEffect(() => {
    filterAndSortQuotes()
  }, [quotes, searchQuery, statusFilter, sortBy])

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/admin/quotes')
      const data = await res.json()
      if (data.success) {
        setQuotes(data.quotes || [])
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortQuotes = () => {
    let filtered = [...quotes]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((q) => q.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (q) =>
          q.quoteNumber.toLowerCase().includes(query) ||
          q.title.toLowerCase().includes(query) ||
          q.client?.name.toLowerCase().includes(query) ||
          q.client?.company?.toLowerCase().includes(query)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'number':
          return b.quoteNumber.localeCompare(a.quoteNumber)
        case 'amount':
          return b.total - a.total
        case 'client':
          return (a.client?.name || '').localeCompare(b.client?.name || '')
        default:
          return 0
      }
    })

    setFilteredQuotes(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return

    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setQuotes(quotes.filter((q) => q.id !== id))
        alert('Quote deleted successfully')
      } else {
        alert('Failed to delete quote')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete quote')
    }
  }

  const handleDownloadPDF = async (quote: Quote) => {
    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `quote-${quote.quoteNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to generate PDF')
      }
    } catch (error) {
      console.error('PDF download error:', error)
      alert('Failed to download PDF')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
      case 'sent':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'viewed':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'accepted':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'expired':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const stats = {
    total: quotes.length,
    draft: quotes.filter((q) => q.status === 'draft').length,
    sent: quotes.filter((q) => q.status === 'sent').length,
    accepted: quotes.filter((q) => q.status === 'accepted').length,
    totalValue: quotes.reduce((sum, q) => sum + q.total, 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading quotes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quotes Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Manage and track all your quotes
              </p>
            </div>
            <Link href="/admin/quotes/new">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <span className="mr-2">+</span>
                New Quote
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Quotes</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Draft</p>
              <p className="text-2xl font-bold text-slate-500">{stats.draft}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Sent</p>
              <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Value</p>
              <p className="text-2xl font-bold text-indigo-600">
                ${stats.totalValue.toLocaleString()}
              </p>
            </Card>
          </div>

          {/* Filters & Controls */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="🔍 Search quotes, clients, or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="viewed">Viewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="date">Sort: Date</option>
                  <option value="number">Sort: Number</option>
                  <option value="amount">Sort: Amount</option>
                  <option value="client">Sort: Client</option>
                </select>

                {/* View Toggle */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-600 shadow'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ⊞
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-600 shadow'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ☰
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quotes List */}
        {filteredQuotes.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No quotes found' : 'No quotes yet'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first quote to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link href="/admin/quotes/new">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  Create First Quote
                </Button>
              </Link>
            )}
          </Card>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                      {quote.quoteNumber}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {quote.client?.name || 'No client'}
                    </p>
                    {quote.client?.company && (
                      <p className="text-xs text-slate-500">{quote.client.company}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      quote.status
                    )}`}
                  >
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </span>
                </div>

                {/* Project Info */}
                <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white mb-2">
                    {quote.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                      {quote.projectType}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                      {quote.industry}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Amount</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {quote.currency} {quote.total.toLocaleString()}
                  </p>
                </div>

                {/* Dates */}
                <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                  <p>Created: {new Date(quote.createdAt).toLocaleDateString()}</p>
                  <p>Valid Until: {new Date(quote.validUntil).toLocaleDateString()}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/admin/quotes/${quote.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full text-sm">
                      ✏️ Edit
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDownloadPDF(quote)}
                    variant="outline"
                    className="flex-1 text-sm"
                  >
                    📥 PDF
                  </Button>
                  <Button
                    onClick={() => handleDelete(quote.id)}
                    variant="outline"
                    className="text-sm text-red-600 border-red-300 hover:bg-red-50"
                  >
                    🗑️
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // List View
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Quote #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {quote.quoteNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {quote.client?.name || 'No client'}
                        </p>
                        {quote.client?.company && (
                          <p className="text-sm text-slate-500">{quote.client.company}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 dark:text-white">{quote.title}</p>
                      <p className="text-sm text-slate-500">{quote.projectType}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-indigo-600">
                        {quote.currency} {quote.total.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          quote.status
                        )}`}
                      >
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/quotes/${quote.id}/edit`}>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDownloadPDF(quote)}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => handleDelete(quote.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  )
}
