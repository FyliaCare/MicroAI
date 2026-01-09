'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, Database, Mail, Shield, Code, Palette, 
  Cloud, Activity, Save, AlertCircle, CheckCircle2 
} from 'lucide-react'
import SystemSettings from '@/components/admin/settings/SystemSettings'
import SecuritySettings from '@/components/admin/settings/SecuritySettings'
import EmailSettings from '@/components/admin/settings/EmailSettings'
import DatabaseSettings from '@/components/admin/settings/DatabaseSettings'
import APISettings from '@/components/admin/settings/APISettings'
import ThemeSettings from '@/components/admin/settings/ThemeSettings'
import BackupSettings from '@/components/admin/settings/BackupSettings'
import MonitoringSettings from '@/components/admin/settings/MonitoringSettings'

const TABS = [
  { id: 'system', label: 'System', icon: Settings, color: 'purple' },
  { id: 'security', label: 'Security', icon: Shield, color: 'green' },
  { id: 'email', label: 'Email', icon: Mail, color: 'red' },
  { id: 'database', label: 'Database', icon: Database, color: 'blue' },
  { id: 'api', label: 'API', icon: Code, color: 'indigo' },
  { id: 'theme', label: 'Theme', icon: Palette, color: 'pink' },
  { id: 'backup', label: 'Backup', icon: Cloud, color: 'cyan' },
  { id: 'monitoring', label: 'Monitoring', icon: Activity, color: 'orange' },
] as const

type TabId = typeof TABS[number]['id']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('system')
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('idle')
    
    try {
      // Trigger save on active tab component
      const event = new CustomEvent('save-settings', { detail: { category: activeTab } })
      window.dispatchEvent(event)
      
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'system': return <SystemSettings />
      case 'security': return <SecuritySettings />
      case 'email': return <EmailSettings />
      case 'database': return <DatabaseSettings />
      case 'api': return <APISettings />
      case 'theme': return <ThemeSettings />
      case 'backup': return <BackupSettings />
      case 'monitoring': return <MonitoringSettings />
      default: return null
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Settings</h1>
          <p className="text-gray-600">Configure and manage your platform settings</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
            transition-all shadow-lg
            ${saving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
            }
          `}
        >
          {saveStatus === 'success' ? (
            <><CheckCircle2 className="w-5 h-5" /> Saved!</>
          ) : saveStatus === 'error' ? (
            <><AlertCircle className="w-5 h-5" /> Error</>
          ) : (
            <><Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Changes'}</>
          )}
        </motion.button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sticky top-6">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                    transition-all text-left font-medium
                    ${isActive 
                      ? `bg-${tab.color}-50 text-${tab.color}-700 shadow-sm` 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? `text-${tab.color}-600` : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
