'use client'

import { useState, useEffect } from 'react'
import { Palette, Paintbrush, Moon } from 'lucide-react'
import SettingField from './SettingField'

export default function ThemeSettings() {
  const [settings, setSettings] = useState({
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#ec4899',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    darkModeEnabled: true,
    fontFamily: 'Inter, sans-serif',
    borderRadius: '0.5rem',
    customCSS: ''
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
      body: JSON.stringify({ category: 'theme', settings })
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Palette className="w-6 h-6 text-pink-600" />
          Theme Settings
        </h2>
        <p className="text-gray-600">Customize the look and feel of your platform</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Paintbrush className="w-5 h-5 text-pink-600" />
          Color Scheme
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="#6366f1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="#8b5cf6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="#ec4899"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="Logo URL"
            description="Path to your site logo"
            value={settings.logoUrl}
            onChange={(value) => setSettings({ ...settings, logoUrl: value })}
            placeholder="/logo.png"
          />

          <SettingField
            label="Favicon URL"
            description="Path to your site favicon"
            value={settings.faviconUrl}
            onChange={(value) => setSettings({ ...settings, faviconUrl: value })}
            placeholder="/favicon.ico"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography & Layout</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingField
            label="Font Family"
            description="Primary font stack"
            value={settings.fontFamily}
            onChange={(value) => setSettings({ ...settings, fontFamily: value })}
            placeholder="Inter, sans-serif"
          />

          <SettingField
            label="Border Radius"
            description="Default border radius (CSS value)"
            value={settings.borderRadius}
            onChange={(value) => setSettings({ ...settings, borderRadius: value })}
            placeholder="0.5rem"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom CSS</h3>
        <SettingField
          label="Custom Styles"
          description="Additional CSS to inject into the site"
          type="textarea"
          value={settings.customCSS}
          onChange={(value) => setSettings({ ...settings, customCSS: value })}
          placeholder="/* Your custom CSS here */"
        />
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Moon className="w-5 h-5 text-pink-600" />
          Theme Options
        </h3>
        
        <SettingField
          label="Dark Mode"
          description="Enable dark mode support"
          type="toggle"
          value={settings.darkModeEnabled}
          onChange={(value) => setSettings({ ...settings, darkModeEnabled: value })}
        />
      </div>
    </div>
  )
}
