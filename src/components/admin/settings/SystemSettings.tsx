'use client'

import { useState, useEffect } from 'react'
import { Globe, Clock, DollarSign, Languages } from 'lucide-react'
import SettingField from './SettingField'

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'MicroAI Systems',
    siteUrl: 'https://microaisystems.com',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    currency: 'USD',
    language: 'en',
    maintenanceMode: false,
    debugMode: false,
    sessionTimeout: '3600',
    maxUploadSize: '10485760'
  })

  useEffect(() => {
    // Listen for save event
    const handleSave = () => saveSettings()
    window.addEventListener('save-settings', handleSave)
    return () => window.removeEventListener('save-settings', handleSave)
  }, [settings])

  const saveSettings = async () => {
    const response = await fetch('/api/admin/settings', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'system', settings })
    })
    if (!response.ok) throw new Error('Failed to save')
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Globe className="w-6 h-6 text-purple-600" />
          System Settings
        </h2>
        <p className="text-gray-600">Configure core system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingField
          label="Site Name"
          description="Display name of your platform"
          value={settings.siteName}
          onChange={(value: string | boolean) => setSettings({ ...settings, siteName: value as string })}
        />

        <SettingField
          label="Site URL"
          description="Base URL of your platform"
          value={settings.siteUrl}
          onChange={(value: string | boolean) => setSettings({ ...settings, siteUrl: value as string })}
          icon={<Globe className="w-4 h-4" />}
        />

        <SettingField
          label="Timezone"
          description="Default timezone for the system"
          value={settings.timezone}
          onChange={(value: string | boolean) => setSettings({ ...settings, timezone: value as string })}
          icon={<Clock className="w-4 h-4" />}
        />

        <SettingField
          label="Date Format"
          description="Default date display format"
          value={settings.dateFormat}
          onChange={(value: string | boolean) => setSettings({ ...settings, dateFormat: value as string })}
        />

        <SettingField
          label="Currency"
          description="Default currency code"
          value={settings.currency}
          onChange={(value: string | boolean) => setSettings({ ...settings, currency: value as string })}
          icon={<DollarSign className="w-4 h-4" />}
        />

        <SettingField
          label="Language"
          description="Default language code"
          value={settings.language}
          onChange={(value: string | boolean) => setSettings({ ...settings, language: value as string })}
          icon={<Languages className="w-4 h-4" />}
        />

        <SettingField
          label="Session Timeout (seconds)"
          description="User session timeout duration"
          type="number"
          value={settings.sessionTimeout}
          onChange={(value: string | boolean) => setSettings({ ...settings, sessionTimeout: value as string })}
        />

        <SettingField
          label="Max Upload Size (bytes)"
          description="Maximum file upload size (10MB default)"
          type="number"
          value={settings.maxUploadSize}
          onChange={(value: string | boolean) => setSettings({ ...settings, maxUploadSize: value as string })}
        />
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">System Modes</h3>
        
        <SettingField
          label="Maintenance Mode"
          description="Enable system-wide maintenance mode"
          type="toggle"
          value={settings.maintenanceMode}
          onChange={(value: string | boolean) => setSettings({ ...settings, maintenanceMode: value as boolean })}
        />

        <SettingField
          label="Debug Mode"
          description="Enable debug logging and error display"
          type="toggle"
          value={settings.debugMode}
          onChange={(value: string | boolean) => setSettings({ ...settings, debugMode: value as boolean })}
        />
      </div>
    </div>
  )
}
