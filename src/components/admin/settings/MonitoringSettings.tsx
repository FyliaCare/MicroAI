'use client'

import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, TrendingUp } from 'lucide-react'
import SettingField from './SettingField'

export default function MonitoringSettings() {
  const [settings, setSettings] = useState({
    metricsInterval: '60',
    errorReporting: true,
    errorReportingService: 'sentry',
    sentryDsn: '',
    uptimeMonitoring: true,
    uptimeCheckInterval: '300',
    performanceMonitoring: true,
    slowRequestThreshold: '1000',
    alertEmail: '',
    slackWebhookUrl: '',
    cpuThreshold: '80',
    memoryThreshold: '85',
    diskThreshold: '90'
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
      body: JSON.stringify({ category: 'monitoring', settings })
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Activity className="w-6 h-6 text-orange-600" />
          Monitoring Settings
        </h2>
        <p className="text-gray-600">Configure performance monitoring and alerts</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          Metrics Collection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="Metrics Interval (seconds)"
            description="How often to collect metrics"
            type="number"
            value={settings.metricsInterval}
            onChange={(value) => setSettings({ ...settings, metricsInterval: value })}
          />

          <SettingField
            label="Uptime Check Interval (seconds)"
            description="How often to check site uptime"
            type="number"
            value={settings.uptimeCheckInterval}
            onChange={(value) => setSettings({ ...settings, uptimeCheckInterval: value })}
          />

          <SettingField
            label="Slow Request Threshold (ms)"
            description="Log requests slower than this"
            type="number"
            value={settings.slowRequestThreshold}
            onChange={(value) => setSettings({ ...settings, slowRequestThreshold: value })}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Reporting</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Error Reporting Service
          </label>
          <select
            value={settings.errorReportingService}
            onChange={(e) => setSettings({ ...settings, errorReportingService: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="none">None</option>
            <option value="sentry">Sentry</option>
            <option value="bugsnag">Bugsnag</option>
            <option value="rollbar">Rollbar</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">External error tracking service</p>
        </div>

        {settings.errorReportingService === 'sentry' && (
          <div className="mt-4">
            <SettingField
              label="Sentry DSN"
              description="Sentry Data Source Name"
              type="password"
              value={settings.sentryDsn}
              onChange={(value) => setSettings({ ...settings, sentryDsn: value })}
              placeholder="https://xxx@sentry.io/xxx"
            />
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Alert Thresholds
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SettingField
            label="CPU Threshold (%)"
            description="Alert when CPU exceeds this"
            type="number"
            value={settings.cpuThreshold}
            onChange={(value) => setSettings({ ...settings, cpuThreshold: value })}
          />

          <SettingField
            label="Memory Threshold (%)"
            description="Alert when memory exceeds this"
            type="number"
            value={settings.memoryThreshold}
            onChange={(value) => setSettings({ ...settings, memoryThreshold: value })}
          />

          <SettingField
            label="Disk Threshold (%)"
            description="Alert when disk usage exceeds this"
            type="number"
            value={settings.diskThreshold}
            onChange={(value) => setSettings({ ...settings, diskThreshold: value })}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="Alert Email"
            description="Email address for alerts"
            value={settings.alertEmail}
            onChange={(value) => setSettings({ ...settings, alertEmail: value })}
            placeholder="admin@microaisystems.com"
          />

          <SettingField
            label="Slack Webhook URL"
            description="Slack webhook for notifications"
            type="password"
            value={settings.slackWebhookUrl}
            onChange={(value) => setSettings({ ...settings, slackWebhookUrl: value })}
            placeholder="https://hooks.slack.com/services/..."
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Monitoring Options</h3>
        
        <SettingField
          label="Error Reporting"
          description="Enable automatic error reporting"
          type="toggle"
          value={settings.errorReporting}
          onChange={(value) => setSettings({ ...settings, errorReporting: value })}
        />

        <SettingField
          label="Uptime Monitoring"
          description="Monitor site uptime and availability"
          type="toggle"
          value={settings.uptimeMonitoring}
          onChange={(value) => setSettings({ ...settings, uptimeMonitoring: value })}
        />

        <SettingField
          label="Performance Monitoring"
          description="Track performance metrics"
          type="toggle"
          value={settings.performanceMonitoring}
          onChange={(value) => setSettings({ ...settings, performanceMonitoring: value })}
        />
      </div>
    </div>
  )
}
