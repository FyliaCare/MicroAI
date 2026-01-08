// ============================================================================
// ADVANCED BRANDING & COMPANY PROFILE STEP
// Comprehensive company information management for professional quotes
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { CompanyProfileManager } from '@/lib/quote-intelligence'
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Award, 
  Users, 
  Briefcase,
  Heart,
  FileText,
  Palette,
  Save,
  RefreshCw,
  CheckCircle2,
  Info,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react'
import type { QuoteFormData } from '@/types/quote'

interface Props {
  formData: QuoteFormData
  updateFormData: (field: string, value: any) => void
}

export default function Step7BrandingAdvanced({ formData, updateFormData }: Props) {
  const [savedProfile, setSavedProfile] = useState<any>(null)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(formData.providerLogo || null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    // Load saved company profile
    const profile = CompanyProfileManager.loadProfile()
    setSavedProfile(profile)

    // Auto-populate if fields are empty
    if (!formData.providerCompanyName) {
      loadProfileToForm(profile)
    }
  }, [])

  const loadProfileToForm = (profile: any) => {
    updateFormData('providerCompanyName', profile.companyName)
    updateFormData('providerTagline', profile.tagline)
    updateFormData('providerEmail', profile.companyEmail)
    updateFormData('providerPhone', profile.companyPhone)
    updateFormData('providerWebsite', profile.companyWebsite)
    updateFormData('providerAddress', profile.companyAddress)
    updateFormData('providerDescription', profile.companyDescription)
    updateFormData('providerServicesOverview', profile.servicesOverview || [])
    updateFormData('providerCertifications', profile.certifications || [])
    updateFormData('providerExpertise', profile.expertise || [])
    updateFormData('providerAboutSection', profile.aboutSection)
    updateFormData('providerCoreValues', profile.coreValues || [])
    updateFormData('providerLogo', profile.companyLogo)
    updateFormData('brandColor', profile.brandColor)
  }

  const saveAsDefaultProfile = () => {
    const profile = {
      companyName: formData.providerCompanyName,
      tagline: formData.providerTagline,
      companyEmail: formData.providerEmail,
      companyPhone: formData.providerPhone,
      companyWebsite: formData.providerWebsite,
      companyAddress: formData.providerAddress,
      companyDescription: formData.providerDescription,
      servicesOverview: formData.providerServicesOverview,
      certifications: formData.providerCertifications,
      expertise: formData.providerExpertise,
      aboutSection: formData.providerAboutSection,
      coreValues: formData.providerCoreValues,
      companyLogo: formData.providerLogo,
      brandColor: formData.brandColor,
    }

    CompanyProfileManager.saveProfile(profile)
    setSavedProfile(profile)
    setShowSaveConfirm(true)
    setTimeout(() => setShowSaveConfirm(false), 3000)
  }

  const resetToDefaults = () => {
    const defaults = CompanyProfileManager.getDefaultProfile()
    loadProfileToForm(defaults)
  }

  const addArrayItem = (field: string, value: string) => {
    if (!value.trim()) return
    const current = formData[field as keyof QuoteFormData] as string[] || []
    updateFormData(field, [...current, value])
  }

  const removeArrayItem = (field: string, index: number) => {
    const current = formData[field as keyof QuoteFormData] as string[] || []
    updateFormData(field, current.filter((_, i) => i !== index))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (PNG, JPG, or SVG)')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be less than 2MB')
      return
    }

    // Read file and convert to base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setLogoPreview(base64)
      updateFormData('providerLogo', base64)
      setUploadError(null)
    }
    reader.onerror = () => {
      setUploadError('Failed to read image file')
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogoPreview(null)
    updateFormData('providerLogo', '')
    setUploadError(null)
  }

  const updateArrayItem = (field: string, index: number, value: string) => {
    const current = [...(formData[field as keyof QuoteFormData] as string[])]
    current[index] = value
    updateFormData(field, current)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-7 h-7 text-indigo-600" />
          Branding & Company Profile
        </h2>
        <p className="text-slate-600 mt-2">
          Configure your company information that will appear in the quote
        </p>
      </div>

      {/* Save/Load Controls */}
      <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-indigo-900 font-medium">
            Save your company profile to auto-fill future quotes
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={saveAsDefaultProfile}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save as Default
          </button>
          <button
            type="button"
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {showSaveConfirm && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Profile saved successfully!</span>
        </div>
      )}

      {/* Logo Upload Section */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-600" />
          Company Logo
        </h3>
        
        <p className="text-sm text-slate-600">
          Upload your company logo for the PDF cover page and header. Best results with PNG or SVG files.
        </p>

        {logoPreview ? (
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <img 
                src={logoPreview} 
                alt="Company Logo" 
                className="w-48 h-48 object-contain bg-white border-2 border-slate-200 rounded-lg p-4"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Logo uploaded successfully!</span>
                </div>
                <p className="text-sm text-green-700">
                  This logo will appear on your PDF cover page and page headers.
                </p>
              </div>
              <button
                onClick={removeLogo}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <X className="w-4 h-4" />
                Remove Logo
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-indigo-400 mb-4" />
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Click to upload logo
                </p>
                <p className="text-xs text-slate-500">
                  PNG, JPG or SVG (max 2MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {uploadError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{uploadError}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Core Company Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          Core Company Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Company Name *
            </label>
            <input
              type="text"
              value={formData.providerCompanyName}
              onChange={(e) => updateFormData('providerCompanyName', e.target.value)}
              placeholder="MicroAI Systems"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={formData.providerTagline}
              onChange={(e) => updateFormData('providerTagline', e.target.value)}
              placeholder="Innovative Software Solutions & Digital Transformation"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              value={formData.providerEmail}
              onChange={(e) => updateFormData('providerEmail', e.target.value)}
              placeholder="contact@microaisystems.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone
            </label>
            <input
              type="tel"
              value={formData.providerPhone}
              onChange={(e) => updateFormData('providerPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Website
            </label>
            <input
              type="url"
              value={formData.providerWebsite}
              onChange={(e) => updateFormData('providerWebsite', e.target.value)}
              placeholder="www.microaisystems.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Address
            </label>
            <input
              type="text"
              value={formData.providerAddress}
              onChange={(e) => updateFormData('providerAddress', e.target.value)}
              placeholder="123 Innovation Drive, Tech Valley, CA 94000"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Brand Color */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Palette className="w-4 h-4 inline mr-1" />
            Brand Color
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={formData.brandColor}
              onChange={(e) => updateFormData('brandColor', e.target.value)}
              className="h-12 w-20 rounded-lg cursor-pointer border border-slate-300"
            />
            <input
              type="text"
              value={formData.brandColor}
              onChange={(e) => updateFormData('brandColor', e.target.value)}
              placeholder="#4F46E5"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <div 
              className="h-12 w-32 rounded-lg border-2 flex items-center justify-center text-white text-xs font-semibold"
              style={{ backgroundColor: formData.brandColor, borderColor: formData.brandColor }}
            >
              Preview
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Company Description
          </label>
          <textarea
            value={formData.providerDescription}
            onChange={(e) => updateFormData('providerDescription', e.target.value)}
            rows={4}
            placeholder="A brief description of your company..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* About Section (for quote) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          About Section (Appears in Quote)
        </h3>
        <textarea
          value={formData.providerAboutSection}
          onChange={(e) => updateFormData('providerAboutSection', e.target.value)}
          rows={6}
          placeholder="This comprehensive 'About Us' section will appear in your quote to introduce your company to potential clients..."
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Services Overview */}
      <ArrayField
        label="Services Overview"
        icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
        items={formData.providerServicesOverview || []}
        onAdd={(value) => addArrayItem('providerServicesOverview', value)}
        onRemove={(index) => removeArrayItem('providerServicesOverview', index)}
        onUpdate={(index, value) => updateArrayItem('providerServicesOverview', index, value)}
        placeholder="e.g., Custom Web Application Development"
      />

      {/* Certifications & Awards */}
      <ArrayField
        label="Certifications & Awards"
        icon={<Award className="w-5 h-5 text-indigo-600" />}
        items={formData.providerCertifications || []}
        onAdd={(value) => addArrayItem('providerCertifications', value)}
        onRemove={(index) => removeArrayItem('providerCertifications', index)}
        onUpdate={(index, value) => updateArrayItem('providerCertifications', index, value)}
        placeholder="e.g., ISO 9001:2015 Certified"
      />

      {/* Areas of Expertise */}
      <ArrayField
        label="Areas of Expertise"
        icon={<Users className="w-5 h-5 text-indigo-600" />}
        items={formData.providerExpertise || []}
        onAdd={(value) => addArrayItem('providerExpertise', value)}
        onRemove={(index) => removeArrayItem('providerExpertise', index)}
        onUpdate={(index, value) => updateArrayItem('providerExpertise', index, value)}
        placeholder="e.g., Next.js & React Development"
      />

      {/* Core Values */}
      <ArrayField
        label="Core Values & Principles"
        icon={<Heart className="w-5 h-5 text-indigo-600" />}
        items={formData.providerCoreValues || []}
        onAdd={(value) => addArrayItem('providerCoreValues', value)}
        onRemove={(index) => removeArrayItem('providerCoreValues', index)}
        onUpdate={(index, value) => updateArrayItem('providerCoreValues', index, value)}
        placeholder="e.g., Quality First - We never compromise on code quality"
      />

      {/* Quote Customization */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Quote Customization</h3>

        {/* Template Style */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Template Style
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'modern', label: 'Modern', description: 'Clean and contemporary design' },
              { value: 'classic', label: 'Classic', description: 'Traditional and professional' },
              { value: 'minimal', label: 'Minimal', description: 'Simple and elegant' },
            ].map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => updateFormData('templateStyle', style.value)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.templateStyle === style.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="font-semibold text-slate-900 mb-1">{style.label}</div>
                <div className="text-sm text-slate-600">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.includeLogo}
              onChange={(e) => updateFormData('includeLogo', e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <div>
              <div className="font-medium text-slate-900">Include Company Logo</div>
              <div className="text-sm text-slate-600">Display your logo on the quote</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.includePortfolio}
              onChange={(e) => updateFormData('includePortfolio', e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <div>
              <div className="font-medium text-slate-900">Include Portfolio Highlights</div>
              <div className="text-sm text-slate-600">Showcase recent projects</div>
            </div>
          </label>
        </div>

        {/* Custom Message */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Custom Message to Client
          </label>
          <textarea
            value={formData.customMessage}
            onChange={(e) => updateFormData('customMessage', e.target.value)}
            placeholder="Add a personalized message for this specific client..."
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Footer Text */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Footer Text
          </label>
          <input
            type="text"
            value={formData.footerText}
            onChange={(e) => updateFormData('footerText', e.target.value)}
            placeholder="e.g., Thank you for your business | www.yourcompany.com"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-slate-900 mb-4">Quote Header Preview</h4>
        <div 
          className="bg-white rounded-lg border-2 p-6"
          style={{ borderColor: formData.brandColor }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 
                className="text-2xl font-bold mb-1"
                style={{ color: formData.brandColor }}
              >
                {formData.providerCompanyName || 'Your Company'}
              </h3>
              {formData.providerTagline && (
                <p className="text-sm text-slate-600 italic">{formData.providerTagline}</p>
              )}
            </div>
            {formData.includeLogo && (
              <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-500">
                Logo
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
            {formData.providerEmail && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {formData.providerEmail}
              </div>
            )}
            {formData.providerPhone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {formData.providerPhone}
              </div>
            )}
            {formData.providerWebsite && (
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {formData.providerWebsite}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for array fields
function ArrayField({ 
  label, 
  icon, 
  items, 
  onAdd, 
  onRemove, 
  onUpdate, 
  placeholder 
}: {
  label: string
  icon: React.ReactNode
  items: string[]
  onAdd: (value: string) => void
  onRemove: (index: number) => void
  onUpdate: (index: number, value: string) => void
  placeholder: string
}) {
  const [newItem, setNewItem] = useState('')

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim())
      setNewItem('')
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        {icon}
        {label}
      </h3>

      {/* List of items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => onUpdate(index, e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add new item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  )
}
