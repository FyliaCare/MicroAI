'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, Database, Mail, Bell, Shield, Code, Palette, 
  Cloud, Clock, Users, Activity, FileText, Download, Upload,
  Save, RotateCcw, Search, Filter, Eye, EyeOff, Lock, Unlock,
  CheckCircle, XCircle, AlertTriangle, Info, Zap
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SettingsAuditModal from './SettingsAuditModal'

// Advanced Settings Categories
const SETTINGS_CATEGORIES = [
  { id: 'system', label: 'System', icon: Settings, color: 'purple' },
  { id: 'database', label: 'Database', icon: Database, color: 'blue' },
  { id: 'email', label: 'Email', icon: Mail, color: 'red' },
  { id: 'notifications', label: 'Notifications', icon: Bell, color: 'yellow' },
  { id: 'security', label: 'Security', icon: Shield, color: 'green' },
  { id: 'api', label: 'API', icon: Code, color: 'indigo' },
  { id: 'theme', label: 'Theme', icon: Palette, color: 'pink' },
  { id: 'backup', label: 'Backup & Restore', icon: Cloud, color: 'cyan' },
  { id: 'monitoring', label: 'Monitoring', icon: Activity, color: 'orange' },
  { id: 'audit', label: 'Audit Trail', icon: FileText, color: 'gray' },
] as const

interface SettingValue {
  id: string
  key: string
  value: string
  category: string
  type: string
  label: string
  description?: string
  isEncrypted: boolean
  updatedAt: string
  updatedBy?: string
}

export default function AdvancedSettingsManager() {
  const [activeCategory, setActiveCategory] = useState<string>('system')
  const [settings, setSettings] = useState<SettingValue[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showEncrypted, setShowEncrypted] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // System Health
  const [systemHealth, setSystemHealth] = useState({
    database: 'healthy',
    email: 'healthy',
    cache: 'healthy',
    storage: 'healthy'
  })

  useEffect(() => {
    loadSettings()
    checkSystemHealth()
  }, [activeCategory])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/settings?category=${activeCategory}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || [])
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkSystemHealth = async () => {
    try {
      const response = await fetch('/api/admin/system-health', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setSystemHealth(data)
      }
    } catch (error) {
      console.error('Error checking system health:', error)
    }
  }

  const updateSettingValue = (id: string, newValue: string) => {
    setSettings(prevSettings => 
      prevSettings.map(s => 
        s.id === id ? { ...s, value: newValue } : s
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, category: activeCategory })
      })

      if (response.ok) {
        setHasChanges(false)
        setLastSaved(new Date())
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/settings/export', {
        credentials: 'include'
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting settings:', error)
      alert('Failed to export settings')
    }
  }

  const handleImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        const confirmed = confirm(
          `Import ${data.settings?.length || 0} settings? This will update existing settings.`
        )
        
        if (!confirmed) return

        const response = await fetch('/api/admin/settings/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data, mergeMode: 'replace' })
        })

        if (response.ok) {
          const result = await response.json()
          alert(result.message)
          loadSettings()
        } else {
          throw new Error('Import failed')
        }
      } catch (error) {
        console.error('Error importing settings:', error)
        alert('Failed to import settings. Please check the file format.')
      }
    }

    input.click()
  }

  const handleReset = async () => {
    const confirmed = confirm(
      `Reset all ${activeCategory} settings to default values? This cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      const response = await fetch('/api/admin/settings/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: activeCategory })
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        loadSettings()
      }
    } catch (error) {
      console.error('Error resetting settings:', error)
      alert('Failed to reset settings')
    }
  }

  const handleViewAuditLog = async () => {
    setShowAuditModal(true)
  }

  const filteredSettings = settings.filter(setting =>
    setting.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    setting.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeConfig = SETTINGS_CATEGORIES.find(cat => cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Advanced Settings</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Configure and manage platform settings with precision
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* System Health Indicators */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  systemHealth.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse`} />
                <span className="text-xs font-medium text-gray-600">Database</span>
              </div>

              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center space-x-1"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Unsaved Changes</span>
                </motion.div>
              )}

              <Button
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 px-4 py-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>

              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center space-x-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save All'}</span>
              </Button>
            </div>
          </div>

          {/* Last Saved Info */}
          {lastSaved && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="p-4 sticky top-32">
              <div className="space-y-2">
                {SETTINGS_CATEGORIES.map((category) => {
                  const Icon = category.icon
                  const isActive = activeCategory === category.id

                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? `bg-${category.color}-50 border-2 border-${category.color}-500 shadow-md`
                          : 'bg-white border-2 border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isActive
                          ? `bg-${category.color}-500 text-white`
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-medium ${
                        isActive ? `text-${category.color}-900` : 'text-gray-700'
                      }`}>
                        {category.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Quick Actions</span>
                </h3>
                <div className="space-y-2">
                  <button 
                    onClick={handleReset}
                    className="w-full text-left px-3 py-2 text-sm text-purple-700 hover:bg-purple-100 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Defaults</span>
                  </button>
                  <button 
                    onClick={handleImport}
                    className="w-full text-left px-3 py-2 text-sm text-purple-700 hover:bg-purple-100 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Import Settings</span>
                  </button>
                  <button 
                    onClick={handleViewAuditLog}
                    className="w-full text-left px-3 py-2 text-sm text-purple-700 hover:bg-purple-100 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <FileText className="w-3 h-3" />
                    <span>View Audit Log</span>
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <Card className="p-6">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {activeConfig && (
                    <>
                      <div className={`p-3 bg-${activeConfig.color}-100 rounded-xl`}>
                        <activeConfig.icon className={`w-6 h-6 text-${activeConfig.color}-600`} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{activeConfig.label} Settings</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Configure {activeConfig.label.toLowerCase()} preferences and options
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Search & Filter */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search settings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <button
                    onClick={() => setShowEncrypted(!showEncrypted)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={showEncrypted ? 'Hide encrypted values' : 'Show encrypted values'}
                  >
                    {showEncrypted ? (
                      <Eye className="w-5 h-5 text-gray-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Settings Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                  ) : filteredSettings.length === 0 ? (
                    <div className="text-center py-12">
                      <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No settings found for this category</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredSettings.map((setting) => (
                        <SettingCard
                          key={setting.id}
                          setting={setting}
                          showEncrypted={showEncrypted}
                          onChange={() => setHasChanges(true)}
                          onUpdate={updateSettingValue}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>

      {/* Settings Audit Modal */}
      <SettingsAuditModal 
        isOpen={showAuditModal} 
        onClose={() => setShowAuditModal(false)} 
      />
    </div>
  )
}

// Setting Card Component
function SettingCard({ 
  setting, 
  showEncrypted, 
  onChange,
  onUpdate 
}: { 
  setting: SettingValue
  showEncrypted: boolean
  onChange: () => void
  onUpdate: (id: string, newValue: string) => void
}) {
  const [value, setValue] = useState(setting.value)
  const [focused, setFocused] = useState(false)

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onUpdate(setting.id, newValue)
    onChange()
  }

  return (
    <motion.div
      layout
      className={`p-5 border-2 rounded-xl transition-all ${
        focused ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{setting.label}</h3>
            {setting.isEncrypted && (
              <div className="relative group">
                <Lock className="w-4 h-4 text-amber-500" />
                <span className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                  Encrypted value
                </span>
              </div>
            )}
          </div>
          {setting.description && (
            <p className="text-sm text-gray-600">{setting.description}</p>
          )}
        </div>
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
          {setting.type}
        </span>
      </div>

      <div className="space-y-3">
        {setting.type === 'boolean' ? (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value === 'true'}
              onChange={(e) => handleChange(e.target.checked ? 'true' : 'false')}
              className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {value === 'true' ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        ) : setting.type === 'number' ? (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        ) : setting.type === 'textarea' ? (
          <textarea
            value={setting.isEncrypted && !showEncrypted ? '••••••••' : value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
          />
        ) : (
          <input
            type={setting.isEncrypted && !showEncrypted ? 'password' : 'text'}
            value={setting.isEncrypted && !showEncrypted ? '••••••••' : value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        )}

        {setting.updatedAt && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated: {new Date(setting.updatedAt).toLocaleString()}</span>
            {setting.updatedBy && (
              <span>by {setting.updatedBy}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
