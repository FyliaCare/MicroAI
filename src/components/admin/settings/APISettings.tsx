'use client'

import { useState, useEffect } from 'react'
import { Code, Zap, Webhook } from 'lucide-react'
import SettingField from './SettingField'

export default function APISettings() {
  const [settings, setSettings] = useState({
    apiVersion: 'v1',
    apiBasePath: '/api',
    apiTimeout: '30000',
    rateLimitPerMinute: '100',
    rateLimitPerHour: '5000',
    enableWebhooks: true,
    webhookRetryAttempts: '3',
    webhookTimeout: '10000',
    corsOrigins: 'https://microaisystems.com',
    enableApiDocs: true
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
      body: JSON.stringify({ category: 'api', settings })
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Code className="w-6 h-6 text-indigo-600" />
          API Settings
        </h2>
        <p className="text-gray-600">Configure API endpoints and rate limits</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-indigo-600" />
          API Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="API Version"
            description="Current API version identifier"
            value={settings.apiVersion}
            onChange={(value) => setSettings({ ...settings, apiVersion: value })}
            placeholder="v1"
          />

          <SettingField
            label="API Base Path"
            description="Base path for all API routes"
            value={settings.apiBasePath}
            onChange={(value) => setSettings({ ...settings, apiBasePath: value })}
            placeholder="/api"
          />

          <SettingField
            label="API Timeout (ms)"
            description="Default API request timeout"
            type="number"
            value={settings.apiTimeout}
            onChange={(value) => setSettings({ ...settings, apiTimeout: value })}
          />

          <SettingField
            label="CORS Origins"
            description="Allowed CORS origins (comma-separated)"
            value={settings.corsOrigins}
            onChange={(value) => setSettings({ ...settings, corsOrigins: value })}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" />
          Rate Limiting
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="Rate Limit (per minute)"
            description="Maximum requests per minute per IP"
            type="number"
            value={settings.rateLimitPerMinute}
            onChange={(value) => setSettings({ ...settings, rateLimitPerMinute: value })}
          />

          <SettingField
            label="Rate Limit (per hour)"
            description="Maximum requests per hour per IP"
            type="number"
            value={settings.rateLimitPerHour}
            onChange={(value) => setSettings({ ...settings, rateLimitPerHour: value })}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Webhook className="w-5 h-5 text-indigo-600" />
          Webhook Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="Webhook Retry Attempts"
            description="Number of retry attempts for failed webhooks"
            type="number"
            value={settings.webhookRetryAttempts}
            onChange={(value) => setSettings({ ...settings, webhookRetryAttempts: value })}
          />

          <SettingField
            label="Webhook Timeout (ms)"
            description="Timeout for webhook HTTP requests"
            type="number"
            value={settings.webhookTimeout}
            onChange={(value) => setSettings({ ...settings, webhookTimeout: value })}
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">API Options</h3>
        
        <SettingField
          label="Enable Webhooks"
          description="Allow webhook integrations"
          type="toggle"
          value={settings.enableWebhooks}
          onChange={(value) => setSettings({ ...settings, enableWebhooks: value })}
        />

        <SettingField
          label="API Documentation"
          description="Enable public API documentation"
          type="toggle"
          value={settings.enableApiDocs}
          onChange={(value) => setSettings({ ...settings, enableApiDocs: value })}
        />
      </div>
    </div>
  )
}
