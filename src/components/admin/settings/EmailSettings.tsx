'use client'

import { useState, useEffect } from 'react'
import { Mail, Server, Send } from 'lucide-react'
import SettingField from './SettingField'

export default function EmailSettings() {
  const [settings, setSettings] = useState({
    fromName: 'MicroAI Systems',
    fromEmail: 'noreply@microaisystems.com',
    replyTo: 'support@microaisystems.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpSecure: true,
    smtpUsername: '',
    smtpPassword: '',
    queueEnabled: true,
    rateLimit: '100'
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
      body: JSON.stringify({ category: 'email', settings })
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Mail className="w-6 h-6 text-red-600" />
          Email Settings
        </h2>
        <p className="text-gray-600">Configure email server and delivery settings</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-red-600" />
          Email Defaults
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="From Name"
            description="Default sender name for emails"
            value={settings.fromName}
            onChange={(value) => setSettings({ ...settings, fromName: value })}
          />

          <SettingField
            label="From Email"
            description="Default sender email address"
            value={settings.fromEmail}
            onChange={(value) => setSettings({ ...settings, fromEmail: value })}
          />

          <SettingField
            label="Reply-To Email"
            description="Default reply-to email address"
            value={settings.replyTo}
            onChange={(value) => setSettings({ ...settings, replyTo: value })}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-red-600" />
          SMTP Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="SMTP Host"
            description="SMTP server hostname"
            value={settings.smtpHost}
            onChange={(value) => setSettings({ ...settings, smtpHost: value })}
            placeholder="smtp.gmail.com"
          />

          <SettingField
            label="SMTP Port"
            description="SMTP server port"
            type="number"
            value={settings.smtpPort}
            onChange={(value) => setSettings({ ...settings, smtpPort: value })}
          />

          <SettingField
            label="SMTP Username"
            description="SMTP authentication username"
            value={settings.smtpUsername}
            onChange={(value) => setSettings({ ...settings, smtpUsername: value })}
          />

          <SettingField
            label="SMTP Password"
            description="SMTP authentication password"
            type="password"
            value={settings.smtpPassword}
            onChange={(value) => setSettings({ ...settings, smtpPassword: value })}
            placeholder="••••••••"
          />

          <SettingField
            label="Rate Limit (per hour)"
            description="Maximum emails to send per hour"
            type="number"
            value={settings.rateLimit}
            onChange={(value) => setSettings({ ...settings, rateLimit: value })}
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Email Options</h3>
        
        <SettingField
          label="SMTP Secure (TLS)"
          description="Use TLS encryption for SMTP"
          type="toggle"
          value={settings.smtpSecure}
          onChange={(value) => setSettings({ ...settings, smtpSecure: value })}
        />

        <SettingField
          label="Email Queue"
          description="Enable email queue system"
          type="toggle"
          value={settings.queueEnabled}
          onChange={(value) => setSettings({ ...settings, queueEnabled: value })}
        />
      </div>
    </div>
  )
}
