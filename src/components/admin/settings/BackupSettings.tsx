'use client'

import { useState, useEffect } from 'react'
import { Cloud, Archive, Lock } from 'lucide-react'
import SettingField from './SettingField'

export default function BackupSettings() {
  const [settings, setSettings] = useState({
    backupFrequency: 'daily',
    backupTime: '02:00',
    backupRetentionDays: '30',
    backupLocation: 's3',
    s3Bucket: '',
    s3Region: 'us-east-1',
    compressionEnabled: true,
    encryptionEnabled: true,
    encryptionKey: '',
    notifyOnSuccess: false,
    notifyOnFailure: true
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
      body: JSON.stringify({ category: 'backup', settings })
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Cloud className="w-6 h-6 text-cyan-600" />
          Backup Settings
        </h2>
        <p className="text-gray-600">Configure automated backup and recovery</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Archive className="w-5 h-5 text-cyan-600" />
          Backup Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">How often to run backups</p>
          </div>

          <SettingField
            label="Backup Time"
            description="Time to run daily backups (HH:MM)"
            value={settings.backupTime}
            onChange={(value) => setSettings({ ...settings, backupTime: value })}
            placeholder="02:00"
          />

          <SettingField
            label="Retention Period (days)"
            description="How long to keep backups"
            type="number"
            value={settings.backupRetentionDays}
            onChange={(value) => setSettings({ ...settings, backupRetentionDays: value })}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Location</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backup Location
          </label>
          <select
            value={settings.backupLocation}
            onChange={(e) => setSettings({ ...settings, backupLocation: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="local">Local Storage</option>
            <option value="s3">Amazon S3</option>
            <option value="gcs">Google Cloud Storage</option>
            <option value="azure">Azure Blob Storage</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Where to store backup files</p>
        </div>

        {settings.backupLocation === 's3' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <SettingField
              label="S3 Bucket Name"
              description="AWS S3 bucket for backups"
              value={settings.s3Bucket}
              onChange={(value) => setSettings({ ...settings, s3Bucket: value })}
              placeholder="my-backups-bucket"
            />

            <SettingField
              label="S3 Region"
              description="AWS region for S3 bucket"
              value={settings.s3Region}
              onChange={(value) => setSettings({ ...settings, s3Region: value })}
              placeholder="us-east-1"
            />
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-cyan-600" />
          Security
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <SettingField
            label="Encryption Key"
            description="Key for encrypting backup files"
            type="password"
            value={settings.encryptionKey}
            onChange={(value) => setSettings({ ...settings, encryptionKey: value })}
            placeholder="Enter encryption key"
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Backup Options</h3>
        
        <SettingField
          label="Compression"
          description="Compress backup files to save space"
          type="toggle"
          value={settings.compressionEnabled}
          onChange={(value) => setSettings({ ...settings, compressionEnabled: value })}
        />

        <SettingField
          label="Encryption"
          description="Encrypt backup files for security"
          type="toggle"
          value={settings.encryptionEnabled}
          onChange={(value) => setSettings({ ...settings, encryptionEnabled: value })}
        />

        <SettingField
          label="Notify on Success"
          description="Send email when backup completes successfully"
          type="toggle"
          value={settings.notifyOnSuccess}
          onChange={(value) => setSettings({ ...settings, notifyOnSuccess: value })}
        />

        <SettingField
          label="Notify on Failure"
          description="Send email when backup fails"
          type="toggle"
          value={settings.notifyOnFailure}
          onChange={(value) => setSettings({ ...settings, notifyOnFailure: value })}
        />
      </div>
    </div>
  )
}
