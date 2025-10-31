'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface ClientProfile {
  user: {
    id: string
    email: string
    name: string
    phone: string | null
    company: string | null
    website: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    zipCode: string | null
    bio: string | null
    jobTitle: string | null
    timezone: string | null
    role: string
    isActive: boolean
    isVerified: boolean
    emailNotifications: boolean
    smsNotifications: boolean
    lastLoginAt: string | null
    createdAt: string
    updatedAt: string
    client?: {
      id: string
      status: string
      industry: string | null
      companySize: string | null
      hasPortalAccess: boolean
      _count: {
        projects: number
        quotes: number
        projectRequests: number
        invoices: number
      }
    }
    _count: {
      codeAccessRequests: number
      sessions: number
    }
  }
  recentProjects: any[]
  recentQuotes: any[]
}

export default function AdminClientProfilePage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ClientProfile | null>(null)

  useEffect(() => {
    if (clientId) {
      fetchClientProfile()
    }
  }, [clientId])

  const fetchClientProfile = async () => {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}/profile`)

      if (!response.ok) {
        throw new Error('Failed to fetch client profile')
      }

      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching client profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!profile) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Client Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The client profile you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push('/admin/projects')}>
            <span className="mr-2">←</span>
            Back to Projects
          </Button>
        </div>
      </AdminLayout>
    )
  }

  const { user, recentProjects, recentQuotes } = profile

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
    }
    return styles[status] || styles.active
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              <span className="mr-2">←</span>
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Client Profile
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {user.isActive ? (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                <span className="text-sm">✓</span>
                Active
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                <span className="text-sm">✗</span>
                Inactive
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-indigo-600">👤</span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</label>
                  <p className="text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                    <span className="text-slate-400">📧</span>
                    {user.email}
                  </p>
                </div>

                {user.phone && (
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Phone</label>
                    <p className="text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                      <span className="text-slate-400">📞</span>
                      {user.phone}
                    </p>
                  </div>
                )}

                {user.jobTitle && (
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Job Title</label>
                    <p className="text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                      <span className="text-slate-400">💼</span>
                      {user.jobTitle}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Timezone</label>
                  <p className="text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                    <span className="text-slate-400">🕐</span>
                    {user.timezone || 'Not set'}
                  </p>
                </div>

                {user.bio && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Bio</label>
                    <p className="text-slate-900 dark:text-white mt-1">{user.bio}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Company Information */}
            {(user.company || user.website) && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-indigo-600">🏢</span>
                  Company Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.company && (
                    <div>
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Company Name</label>
                      <p className="text-slate-900 dark:text-white mt-1">{user.company}</p>
                    </div>
                  )}

                  {user.website && (
                    <div>
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Website</label>
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mt-1"
                      >
                        <span>🌐</span>
                        {user.website}
                        <span className="text-xs">↗</span>
                      </a>
                    </div>
                  )}

                  {user.client?.industry && (
                    <div>
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Industry</label>
                      <p className="text-slate-900 dark:text-white mt-1">{user.client.industry}</p>
                    </div>
                  )}

                  {user.client?.companySize && (
                    <div>
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Company Size</label>
                      <p className="text-slate-900 dark:text-white mt-1">{user.client.companySize}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Address */}
            {(user.address || user.city || user.country) && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-indigo-600">📍</span>
                  Address
                </h2>
                <div className="space-y-2">
                  {user.address && (
                    <p className="text-slate-900 dark:text-white">{user.address}</p>
                  )}
                  <p className="text-slate-900 dark:text-white">
                    {[user.city, user.state, user.zipCode].filter(Boolean).join(', ')}
                  </p>
                  {user.country && (
                    <p className="text-slate-900 dark:text-white">{user.country}</p>
                  )}
                </div>
              </Card>
            )}

            {/* Recent Projects */}
            {recentProjects.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-indigo-600">📁</span>
                  Recent Projects
                </h2>
                <div className="space-y-3">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/projects/${project.id}`)}
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{project.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{project.type}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {project.status}
                        </span>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {project.progress}% complete
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recent Quotes */}
            {recentQuotes.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-indigo-600">📄</span>
                  Recent Quotes
                </h2>
                <div className="space-y-3">
                  {recentQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/quotes?id=${quote.id}`)}
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{quote.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{quote.projectType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-indigo-600">
                          {quote.currency} {quote.total ? quote.total.toLocaleString() : '0'}
                        </p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {quote.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Projects</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {user.client?._count.projects || 0}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Quotes</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {user.client?._count.quotes || 0}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Requests</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {user.client?._count.projectRequests || 0}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Invoices</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {user.client?._count.invoices || 0}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Code Access Requests</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {user._count.codeAccessRequests}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Information */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Account Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-slate-500 dark:text-slate-400">Status</label>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {user.client?.status || 'Unknown'}
                  </p>
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400">Portal Access</label>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {user.client?.hasPortalAccess ? 'Enabled' : 'Disabled'}
                  </p>
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400">Email Verified</label>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {user.isVerified ? 'Yes' : 'No'}
                  </p>
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400">Last Login</label>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : 'Never'}
                  </p>
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400">Member Since</label>
                  <p className="text-slate-900 dark:text-white font-medium flex items-center gap-1">
                    <span className="text-slate-400">📅</span>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400">Active Sessions</label>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {user._count.sessions}
                  </p>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Notifications</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Email</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.emailNotifications
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.emailNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">SMS</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.smsNotifications
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.smsNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
