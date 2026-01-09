'use client'

import { useState, useEffect } from 'react'
import { Database, HardDrive, Clock } from 'lucide-react'
import SettingField from './SettingField'

export default function DatabaseSettings() {
  const [settings, setSettings] = useState({
    poolSize: '20',
    queryTimeout: '30000',
    slowQueryThreshold: '1000',
    autoVacuum: true,
    backupEnabled: true,
    backupSchedule: '0 2 * * *',
    backupRetentionDays: '30'
  })

  useEffect(() => {
    const handleSave = () => saveSettings()
    window.addEventListener('save-settings', handleSave)
    return () => window.removeEventListener('save-settings', handleSave)
  }, [settings])

  const saveSettings = async () => {
    await fetch('/api/admin/settings', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'database', settings })
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-600" />
          Database Settings
        </h2>
        <p className="text-gray-600">Configure database connection and performance</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-blue-600" />
          Connection & Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="Connection Pool Size"
            description="Maximum database connection pool size"
            type="number"
            value={settings.poolSize}
            onChange={(value: string | boolean) => setSettings({ ...settings, poolSize: value as string })}
          />

          <SettingField
            label="Query Timeout (ms)"
            description="Database query timeout in milliseconds"
            type="number"
            value={settings.queryTimeout}
            onChange={(value: string | boolean) => setSettings({ ...settings, queryTimeout: value as string })}
          />

          <SettingField
            label="Slow Query Threshold (ms)"
            description="Log queries slower than this threshold"
            type="number"
            value={settings.slowQueryThreshold}
            onChange={(value: string | boolean) => setSettings({ ...settings, slowQueryThreshold: value as string })}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Backup Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="Backup Schedule (Cron)"
            description="Cron expression for backup schedule"
            value={settings.backupSchedule}
            onChange={(value: string | boolean) => setSettings({ ...settings, backupSchedule: value as string })}
            placeholder="0 2 * * * (Daily at 2 AM)"
          />

          <SettingField
            label="Backup Retention (days)"
            description="Number of days to retain backups"
            type="number"
            value={settings.backupRetentionDays}
            onChange={(value: string | boolean) => setSettings({ ...settings, backupRetentionDays: value as string })}
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Database Options</h3>
        
        <SettingField
          label="Auto Vacuum"
          description="Automatically vacuum database tables"
          type="toggle"
          value={settings.autoVacuum}
          onChange={(value: string | boolean) => setSettings({ ...settings, autoVacuum: value as boolean })}
        />

        <SettingField
          label="Automatic Backups"
          description="Enable automatic database backups"
          type="toggle"
          value={settings.backupEnabled}
          onChange={(value: string | boolean) => setSettings({ ...settings, backupEnabled: value as boolean })}
        />
      </div>
    </div>
  )
}
