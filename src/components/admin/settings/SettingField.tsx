'use client'

import { ReactNode } from 'react'

interface SettingFieldProps {
  label: string
  description: string
  value: string | boolean
  onChange: (value: any) => void
  type?: 'text' | 'number' | 'password' | 'toggle' | 'textarea'
  icon?: ReactNode
  placeholder?: string
}

export default function SettingField({
  label,
  description,
  value,
  onChange,
  type = 'text',
  icon,
  placeholder
}: SettingFieldProps) {
  if (type === 'toggle') {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex-1">
          <label className="block font-medium text-gray-900 mb-1">{label}</label>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <button
          onClick={() => onChange(!value)}
          className={`
            relative inline-flex h-8 w-14 items-center rounded-full
            transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            ${value ? 'bg-indigo-600' : 'bg-gray-300'}
          `}
        >
          <span
            className={`
              inline-block h-6 w-6 transform rounded-full bg-white transition-transform
              ${value ? 'translate-x-7' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div>
        <label className="block font-medium text-gray-900 mb-1">{label}</label>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <textarea
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    )
  }

  return (
    <div>
      <label className="block font-medium text-gray-900 mb-1">{label}</label>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            ${icon ? 'pl-10' : ''}
          `}
        />
      </div>
    </div>
  )
}
