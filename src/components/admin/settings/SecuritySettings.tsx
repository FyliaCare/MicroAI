'use client'

import { useState, useEffect } from 'react'
import { Shield, Key, Lock } from 'lucide-react'
import SettingField from './SettingField'

export default function SecuritySettings() {
  const [settings, setSettings] = useState({
    passwordMinLength: '8',
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    maxLoginAttempts: '5',
    lockoutDuration: '900',
    twoFactorEnabled: false,
    sessionEncryption: true,
    corsOrigins: '*',
    apiRateLimit: '100'
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
      body: JSON.stringify({ category: 'security', settings })
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-600" />
          Security Settings
        </h2>
        <p className="text-gray-600">Configure authentication and security policies</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-green-600" />
          Password Requirements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="Minimum Password Length"
            description="Minimum characters required for passwords"
            type="number"
            value={settings.passwordMinLength}
            onChange={(value) => setSettings({ ...settings, passwordMinLength: value })}
          />

          <SettingField
            label="Max Login Attempts"
            description="Maximum failed login attempts before lockout"
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(value) => setSettings({ ...settings, maxLoginAttempts: value })}
          />

          <SettingField
            label="Lockout Duration (seconds)"
            description="Account lockout duration after max attempts"
            type="number"
            value={settings.lockoutDuration}
            onChange={(value) => setSettings({ ...settings, lockoutDuration: value })}
          />

          <SettingField
            label="API Rate Limit (per minute)"
            description="Maximum API requests per minute"
            type="number"
            value={settings.apiRateLimit}
            onChange={(value) => setSettings({ ...settings, apiRateLimit: value })}
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-green-600" />
          Security Options
        </h3>
        
        <SettingField
          label="Require Uppercase Letters"
          description="Password must contain uppercase letters"
          type="toggle"
          value={settings.requireUppercase}
          onChange={(value) => setSettings({ ...settings, requireUppercase: value })}
        />

        <SettingField
          label="Require Numbers"
          description="Password must contain numbers"
          type="toggle"
          value={settings.requireNumbers}
          onChange={(value) => setSettings({ ...settings, requireNumbers: value })}
        />

        <SettingField
          label="Require Special Characters"
          description="Password must contain special characters"
          type="toggle"
          value={settings.requireSpecialChars}
          onChange={(value) => setSettings({ ...settings, requireSpecialChars: value })}
        />

        <SettingField
          label="Two-Factor Authentication"
          description="Enable 2FA for all admin users"
          type="toggle"
          value={settings.twoFactorEnabled}
          onChange={(value) => setSettings({ ...settings, twoFactorEnabled: value })}
        />

        <SettingField
          label="Session Encryption"
          description="Encrypt session data"
          type="toggle"
          value={settings.sessionEncryption}
          onChange={(value) => setSettings({ ...settings, sessionEncryption: value })}
        />
      </div>

      <div className="border-t pt-6">
        <SettingField
          label="CORS Allowed Origins"
          description="Comma-separated list of allowed origins (* for all)"
          type="textarea"
          value={settings.corsOrigins}
          onChange={(value) => setSettings({ ...settings, corsOrigins: value })}
          placeholder="https://example.com, https://app.example.com"
        />
      </div>
    </div>
  )
}
