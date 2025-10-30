'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface SalesPerson {
  id: string
  name: string
  email: string
  role: string
  target: number
  achieved: number
  activeLeads: number
  convertedLeads: number
  totalCalls: number
  totalMeetings: number
  lastActivity: string
}

interface SalesActivity {
  id: string
  salesPersonId: string
  salesPersonName: string
  activityType: 'call' | 'meeting' | 'email' | 'quote' | 'demo' | 'follow-up'
  clientName: string
  description: string
  outcome: 'positive' | 'neutral' | 'negative' | 'pending'
  value?: number
  nextAction?: string
  nextActionDate?: string
  createdAt: string
}

interface SalesMetrics {
  totalRevenue: number
  targetRevenue: number
  totalLeads: number
  convertedLeads: number
  conversionRate: number
  avgDealSize: number
  totalActivities: number
  activeSalespeople: number
}

export default function SalesActivities() {
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'activities' | 'pipeline'>('overview')
  const [salesTeam, setSalesTeam] = useState<SalesPerson[]>([])
  const [activities, setActivities] = useState<SalesActivity[]>([])
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week')
  
  // New activity form state
  const [newActivity, setNewActivity] = useState({
    salesPersonId: '',
    activityType: 'call' as SalesActivity['activityType'],
    clientName: '',
    description: '',
    outcome: 'pending' as SalesActivity['outcome'],
    value: '',
    nextAction: '',
    nextActionDate: ''
  })

  useEffect(() => {
    fetchSalesData()
  }, [dateRange])

  const fetchSalesData = async () => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock data
      const mockTeam: SalesPerson[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          role: 'Senior Sales Rep',
          target: 50000,
          achieved: 42000,
          activeLeads: 15,
          convertedLeads: 8,
          totalCalls: 127,
          totalMeetings: 34,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          role: 'Sales Rep',
          target: 40000,
          achieved: 38500,
          activeLeads: 12,
          convertedLeads: 10,
          totalCalls: 98,
          totalMeetings: 28,
          lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Mike Davis',
          email: 'mike@example.com',
          role: 'Junior Sales Rep',
          target: 30000,
          achieved: 22000,
          activeLeads: 18,
          convertedLeads: 5,
          totalCalls: 156,
          totalMeetings: 22,
          lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ]

      const mockActivities: SalesActivity[] = [
        {
          id: '1',
          salesPersonId: '1',
          salesPersonName: 'John Smith',
          activityType: 'meeting',
          clientName: 'Acme Corp',
          description: 'Product demo and pricing discussion',
          outcome: 'positive',
          value: 15000,
          nextAction: 'Send proposal',
          nextActionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          salesPersonId: '2',
          salesPersonName: 'Sarah Johnson',
          activityType: 'call',
          clientName: 'TechStart Inc',
          description: 'Initial discovery call',
          outcome: 'positive',
          nextAction: 'Schedule demo',
          nextActionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          salesPersonId: '3',
          salesPersonName: 'Mike Davis',
          activityType: 'follow-up',
          clientName: 'Global Solutions',
          description: 'Follow up on proposal sent last week',
          outcome: 'neutral',
          value: 8000,
          nextAction: 'Call to discuss',
          nextActionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          salesPersonId: '1',
          salesPersonName: 'John Smith',
          activityType: 'quote',
          clientName: 'Innovate LLC',
          description: 'Sent custom quote for enterprise package',
          outcome: 'pending',
          value: 25000,
          nextAction: 'Wait for response',
          nextActionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]

      const totalAchieved = mockTeam.reduce((sum, p) => sum + p.achieved, 0)
      const totalTarget = mockTeam.reduce((sum, p) => sum + p.target, 0)
      const totalConverted = mockTeam.reduce((sum, p) => sum + p.convertedLeads, 0)
      const totalLeads = mockTeam.reduce((sum, p) => sum + p.activeLeads + p.convertedLeads, 0)

      setMetrics({
        totalRevenue: totalAchieved,
        targetRevenue: totalTarget,
        totalLeads,
        convertedLeads: totalConverted,
        conversionRate: (totalConverted / totalLeads) * 100,
        avgDealSize: totalAchieved / totalConverted,
        totalActivities: mockActivities.length,
        activeSalespeople: mockTeam.length
      })

      setSalesTeam(mockTeam)
      setActivities(mockActivities)
    } catch (error) {
      console.error('Error fetching sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return '📞'
      case 'meeting':
        return '🤝'
      case 'email':
        return '✉️'
      case 'quote':
        return '💼'
      case 'demo':
        return '🖥️'
      case 'follow-up':
        return '🔄'
      default:
        return '📝'
    }
  }

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'positive':
        return 'bg-green-100 text-green-800'
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800'
      case 'negative':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddActivity = () => {
    if (!newActivity.salesPersonId || !newActivity.clientName || !newActivity.description) {
      alert('Please fill in all required fields (Salesperson, Client, Description)')
      return
    }

    const selectedPerson = salesTeam.find(p => p.id === newActivity.salesPersonId)
    const activity: SalesActivity = {
      id: Date.now().toString(),
      salesPersonId: newActivity.salesPersonId,
      salesPersonName: selectedPerson?.name || '',
      activityType: newActivity.activityType,
      clientName: newActivity.clientName,
      description: newActivity.description,
      outcome: newActivity.outcome,
      value: newActivity.value ? parseFloat(newActivity.value) : undefined,
      nextAction: newActivity.nextAction || undefined,
      nextActionDate: newActivity.nextActionDate || undefined,
      createdAt: new Date().toISOString()
    }

    setActivities([activity, ...activities])
    setShowAddActivity(false)
    
    // Reset form
    setNewActivity({
      salesPersonId: '',
      activityType: 'call',
      clientName: '',
      description: '',
      outcome: 'pending',
      value: '',
      nextAction: '',
      nextActionDate: ''
    })
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.salesPersonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || activity.activityType === filterType
    const matchesPerson = !selectedPerson || activity.salesPersonId === selectedPerson
    return matchesSearch && matchesType && matchesPerson
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sales data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Activities</h1>
          <p className="text-gray-700 mt-1">Comprehensive sales tracking and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <Button onClick={() => setShowAddActivity(true)}>
            + Add Activity
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-4">
        <nav className="flex space-x-8">
          {['overview', 'team', 'activities', 'pipeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${metrics.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Target: ${metrics.targetRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(metrics.totalRevenue / metrics.targetRevenue) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {((metrics.totalRevenue / metrics.targetRevenue) * 100).toFixed(1)}% of target
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metrics.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {metrics.convertedLeads} of {metrics.totalLeads} leads
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Deal Size</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${metrics.avgDealSize.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Per conversion</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <span className="text-2xl">💎</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metrics.totalActivities}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {metrics.activeSalespeople} active salespeople
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Performers */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performers</h2>
            <div className="space-y-4">
              {[...salesTeam]
                .sort((a, b) => (b.achieved / b.target) - (a.achieved / a.target))
                .map((person, index) => (
                  <div key={person.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{person.name}</p>
                        <p className="text-sm text-gray-600">{person.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${person.achieved.toLocaleString()} / ${person.target.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {((person.achieved / person.target) * 100).toFixed(1)}% achieved
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {salesTeam.map((person) => (
            <Card key={person.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                  <p className="text-sm text-gray-600">{person.role}</p>
                  <p className="text-xs text-gray-600">{person.email}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPerson(person.id)
                    setActiveTab('activities')
                  }}
                >
                  View Activities
                </Button>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Revenue Target</span>
                    <span className="font-semibold">
                      ${person.achieved.toLocaleString()} / ${person.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (person.achieved / person.target) >= 0.9 ? 'bg-green-600' :
                        (person.achieved / person.target) >= 0.7 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min((person.achieved / person.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Active Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{person.activeLeads}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Converted</p>
                    <p className="text-2xl font-bold text-green-600">{person.convertedLeads}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Calls</p>
                    <p className="text-2xl font-bold text-gray-900">{person.totalCalls}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Meetings</p>
                    <p className="text-2xl font-bold text-gray-900">{person.totalMeetings}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-600">
                    Last activity: {new Date(person.lastActivity).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Search activities, clients, or salespeople..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="all">All Types</option>
                <option value="call">Calls</option>
                <option value="meeting">Meetings</option>
                <option value="email">Emails</option>
                <option value="quote">Quotes</option>
                <option value="demo">Demos</option>
                <option value="follow-up">Follow-ups</option>
              </select>
              {selectedPerson && (
                <Button variant="outline" onClick={() => setSelectedPerson(null)}>
                  Clear Filter
                </Button>
              )}
            </div>
          </Card>

          {/* Activity List */}
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getActivityIcon(activity.activityType)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{activity.clientName}</h3>
                        <p className="text-sm text-gray-600">
                          by {activity.salesPersonName} • {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOutcomeColor(activity.outcome)}`}>
                        {activity.outcome}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{activity.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                        {activity.activityType}
                      </span>
                      {activity.value && (
                        <span className="text-green-600 font-semibold">
                          Potential: ${activity.value.toLocaleString()}
                        </span>
                      )}
                      {activity.nextAction && (
                        <span className="text-gray-700">
                          Next: {activity.nextAction}
                          {activity.nextActionDate && (
                            <span className="text-gray-600">
                              {' '}({new Date(activity.nextActionDate).toLocaleDateString()})
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {filteredActivities.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600">No activities found matching your filters.</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Prospecting</h3>
                <p className="text-2xl font-bold text-blue-600">18</p>
                <p className="text-sm text-blue-700">$125,000</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">Qualification</h3>
                <p className="text-2xl font-bold text-yellow-600">12</p>
                <p className="text-sm text-yellow-700">$98,000</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">Proposal</h3>
                <p className="text-2xl font-bold text-orange-600">8</p>
                <p className="text-sm text-orange-700">$156,000</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Closing</h3>
                <p className="text-2xl font-bold text-green-600">5</p>
                <p className="text-sm text-green-700">$87,000</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Activity</h2>
                <button
                  onClick={() => setShowAddActivity(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Salesperson */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salesperson *
                </label>
                <select
                  value={newActivity.salesPersonId}
                  onChange={(e) => setNewActivity({ ...newActivity, salesPersonId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  required
                >
                  <option value="">Select Salesperson</option>
                  {salesTeam.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name} - {person.role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Activity Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type *
                </label>
                <select
                  value={newActivity.activityType}
                  onChange={(e) => setNewActivity({ ...newActivity, activityType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option value="call">📞 Call</option>
                  <option value="meeting">🤝 Meeting</option>
                  <option value="email">✉️ Email</option>
                  <option value="quote">💼 Quote</option>
                  <option value="demo">🖥️ Demo</option>
                  <option value="follow-up">🔄 Follow-up</option>
                </select>
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <Input
                  type="text"
                  value={newActivity.clientName}
                  onChange={(e) => setNewActivity({ ...newActivity, clientName: e.target.value })}
                  placeholder="Enter client or company name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  placeholder="Describe the activity, what was discussed, outcomes, etc."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  required
                />
              </div>

              {/* Outcome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outcome
                </label>
                <select
                  value={newActivity.outcome}
                  onChange={(e) => setNewActivity({ ...newActivity, outcome: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option value="pending">Pending</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>

              {/* Potential Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potential Deal Value ($)
                </label>
                <Input
                  type="number"
                  value={newActivity.value}
                  onChange={(e) => setNewActivity({ ...newActivity, value: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Next Action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Action
                </label>
                <Input
                  type="text"
                  value={newActivity.nextAction}
                  onChange={(e) => setNewActivity({ ...newActivity, nextAction: e.target.value })}
                  placeholder="e.g., Schedule follow-up call, Send proposal"
                />
              </div>

              {/* Next Action Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Action Date
                </label>
                <input
                  type="datetime-local"
                  value={newActivity.nextActionDate}
                  onChange={(e) => setNewActivity({ ...newActivity, nextActionDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddActivity(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddActivity}>
                Add Activity
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
