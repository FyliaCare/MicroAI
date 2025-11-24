'use client'

import { useState } from 'react'
import { 
  Eye, 
  Download, 
  Send, 
  FileText, 
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CreditCard,
  Shield,
  CheckCircle,
  XCircle,
  Package,
  Target,
  Flag,
  Printer
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface PreviewTabProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

export default function PreviewTab({ formData, updateFormData }: PreviewTabProps) {
  const [viewMode, setViewMode] = useState<'full' | 'summary'>('full')

  const getCurrencySymbol = () => {
    const currencies: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      GHS: '₵',
      NGN: '₦',
      ZAR: 'R'
    }
    return currencies[formData.currency] || '$'
  }

  const formatCurrency = (amount: number) => {
    return `${getCurrencySymbol()}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-500'
    }
    return colors[status] || colors.draft
  }

  const isComplete = () => {
    return (
      formData.title &&
      (formData.clientId || formData.clientEmail) &&
      formData.lineItems.length > 0 &&
      formData.validUntil
    )
  }

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Quote Preview</h2>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('full')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'full'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Full Preview
              </button>
              <button
                onClick={() => setViewMode('summary')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'summary'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Summary
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {!isComplete() && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
            <XCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Quote Incomplete</p>
              <p className="text-xs text-yellow-700 mt-1">
                Please fill in required fields: Client, Title, Line Items, and Valid Until date
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Summary View */}
      {viewMode === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Info Summary */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Basic Information</span>
            </h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Quote Number</dt>
                <dd className="font-medium text-gray-900">{formData.quoteNumber}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Title</dt>
                <dd className="font-medium text-gray-900">{formData.title || 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Client</dt>
                <dd className="font-medium text-gray-900">{formData.clientName || 'Not selected'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Valid Until</dt>
                <dd className="font-medium text-gray-900">{formatDate(formData.validUntil)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Status</dt>
                <dd>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(formData.status)}`}>
                    {formData.status.toUpperCase()}
                  </span>
                </dd>
              </div>
            </dl>
          </Card>

          {/* Scope Summary */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Scope Summary</span>
            </h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Objectives</dt>
                <dd className="font-medium text-gray-900">{formData.objectives.length} items</dd>
              </div>
              <div>
                <dt className="text-gray-500">Scope Items</dt>
                <dd className="font-medium text-gray-900">{formData.scopeItems.length} items</dd>
              </div>
              <div>
                <dt className="text-gray-500">Exclusions</dt>
                <dd className="font-medium text-gray-900">{formData.exclusions.length} items</dd>
              </div>
              <div>
                <dt className="text-gray-500">Deliverables</dt>
                <dd className="font-medium text-gray-900">{formData.deliverables.length} items</dd>
              </div>
            </dl>
          </Card>

          {/* Financial Summary */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Financial Summary</span>
            </h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Line Items</dt>
                <dd className="font-medium text-gray-900">{formData.lineItems.length} items</dd>
              </div>
              <div>
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(formData.subtotal)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Discount</dt>
                <dd className="font-medium text-green-600">-{formatCurrency(formData.discount)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Tax ({formData.taxRate}%)</dt>
                <dd className="font-medium text-gray-900">+{formatCurrency(formData.tax)}</dd>
              </div>
              <div className="pt-2 border-t">
                <dt className="text-gray-700 font-semibold">Total</dt>
                <dd className="text-xl font-bold text-indigo-600">{formatCurrency(formData.total)}</dd>
              </div>
            </dl>
          </Card>

          {/* Timeline Summary */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Timeline Summary</span>
            </h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Start Date</dt>
                <dd className="font-medium text-gray-900">{formatDate(formData.startDate)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Duration</dt>
                <dd className="font-medium text-gray-900">{formData.estimatedDuration} days</dd>
              </div>
              <div>
                <dt className="text-gray-500">Milestones</dt>
                <dd className="font-medium text-gray-900">{formData.milestones.length} milestones</dd>
              </div>
              {formData.startDate && formData.estimatedDuration > 0 && (
                <div>
                  <dt className="text-gray-500">Est. Completion</dt>
                  <dd className="font-medium text-gray-900">
                    {(() => {
                      const endDate = new Date(formData.startDate)
                      endDate.setDate(endDate.getDate() + formData.estimatedDuration)
                      return formatDate(endDate.toISOString())
                    })()}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Payment Summary */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Payment Summary</span>
            </h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Payment Terms</dt>
                <dd className="font-medium text-gray-900">{formData.paymentSchedule.length} payments</dd>
              </div>
              {formData.depositRequired && (
                <div>
                  <dt className="text-gray-500">Deposit Required</dt>
                  <dd className="font-medium text-indigo-600">
                    {formData.depositPercentage}% ({formatCurrency(formData.total * (formData.depositPercentage / 100))})
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Payment Methods</dt>
                <dd className="font-medium text-gray-900">{formData.acceptedPaymentMethods.length} methods</dd>
              </div>
            </dl>
          </Card>

          {/* Policies Summary */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Policies</span>
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                {formData.warranties ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-900">Warranty defined</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">No warranty</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {formData.supportTerms ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-900">Support terms set</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">No support terms</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {formData.revisionPolicy ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-900">Revision policy set</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">No revision policy</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {formData.cancellationPolicy ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-900">Cancellation policy set</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">No cancellation policy</span>
                  </>
                )}
              </div>
            </dl>
          </Card>
        </div>
      )}

      {/* Full Preview */}
      {viewMode === 'full' && (
        <div 
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          style={{ 
            minHeight: '1000px',
            borderTop: `8px solid ${formData.brandColor}`
          }}
        >
          {/* Quote Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                {formData.includeLogo && (
                  <div className="mb-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      Company Logo
                    </div>
                  </div>
                )}
                <h1 className="text-3xl font-bold" style={{ color: formData.brandColor }}>
                  QUOTATION
                </h1>
                <p className="text-gray-600 mt-1">Quote #{formData.quoteNumber}</p>
              </div>
              <div className="text-right">
                <div className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(formData.status)}`}>
                  {formData.status.toUpperCase()}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Valid Until: <span className="font-medium">{formatDate(formData.validUntil)}</span>
                </p>
              </div>
            </div>

            {/* Client & Company Info */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Quote For</h3>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">{formData.clientName || 'Client Name'}</p>
                  {formData.clientCompany && (
                    <p className="text-gray-700 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{formData.clientCompany}</span>
                    </p>
                  )}
                  {formData.clientEmail && (
                    <p className="text-gray-700 flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{formData.clientEmail}</span>
                    </p>
                  )}
                  {formData.clientPhone && (
                    <p className="text-gray-700 flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{formData.clientPhone}</span>
                    </p>
                  )}
                  {formData.clientAddress && (
                    <p className="text-gray-700 flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>{formData.clientAddress}</span>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">From</h3>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">MicroAI Systems</p>
                  <p className="text-gray-700">Professional Software Solutions</p>
                  <p className="text-gray-700">support@microaisystems.com</p>
                  <p className="text-gray-700">Accra, Ghana</p>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Message */}
          {formData.customMessage && (
            <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
              <p className="text-gray-800 leading-relaxed italic">"{formData.customMessage}"</p>
            </div>
          )}

          {/* Project Title & Description */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{formData.title || 'Project Title'}</h2>
            
            {formData.executiveSummary && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Executive Summary</h3>
                <p className="text-gray-700 leading-relaxed">{formData.executiveSummary}</p>
              </div>
            )}

            {formData.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Project Description</h3>
                <p className="text-gray-700 leading-relaxed">{formData.description}</p>
              </div>
            )}
          </div>

          {/* Objectives */}
          {formData.objectives.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5" style={{ color: formData.brandColor }} />
                <span>Project Objectives</span>
              </h3>
              <ul className="space-y-2">
                {formData.objectives.map((obj: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Scope of Work */}
          {formData.scopeItems.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" style={{ color: formData.brandColor }} />
                <span>Scope of Work</span>
              </h3>
              <ul className="space-y-2">
                {formData.scopeItems.map((item: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: formData.brandColor }} />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exclusions */}
          {formData.exclusions.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span>Exclusions</span>
              </h3>
              <ul className="space-y-2">
                {formData.exclusions.map((item: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Deliverables */}
          {formData.deliverables.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Package className="w-5 h-5" style={{ color: formData.brandColor }} />
                <span>Deliverables</span>
              </h3>
              <ul className="space-y-2">
                {formData.deliverables.map((item: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Package className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: formData.brandColor }} />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <DollarSign className="w-5 h-5" style={{ color: formData.brandColor }} />
              <span>Investment Breakdown</span>
            </h3>

            {formData.lineItems.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b-2" style={{ borderColor: formData.brandColor }}>
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Qty</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Unit Price</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.lineItems.map((item: any, index: number) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-4 px-4">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                          </td>
                          <td className="text-center py-4 px-4 text-gray-700">{item.quantity}</td>
                          <td className="text-right py-4 px-4 text-gray-700">{formatCurrency(item.unitPrice)}</td>
                          <td className="text-right py-4 px-4 font-medium text-gray-900">
                            {formatCurrency(item.quantity * item.unitPrice * (1 - item.discount / 100))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 max-w-md ml-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(formData.subtotal)}</span>
                    </div>
                    {formData.discount > 0 && (
                      <div className="flex justify-between py-2 text-green-600">
                        <span>Discount:</span>
                        <span className="font-medium">-{formatCurrency(formData.discount)}</span>
                      </div>
                    )}
                    {formData.tax > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-700">Tax ({formData.taxRate}%):</span>
                        <span className="font-medium text-gray-900">+{formatCurrency(formData.tax)}</span>
                      </div>
                    )}
                    <div className="border-t-2 pt-3" style={{ borderColor: formData.brandColor }}>
                      <div className="flex justify-between">
                        <span className="text-xl font-bold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold" style={{ color: formData.brandColor }}>
                          {formatCurrency(formData.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic">No line items added yet</p>
            )}
          </div>

          {/* Timeline & Milestones */}
          {formData.milestones.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Flag className="w-5 h-5" style={{ color: formData.brandColor }} />
                <span>Project Timeline</span>
              </h3>
              <div className="space-y-4">
                {formData.milestones.map((milestone: any, index: number) => (
                  <div key={milestone.id} className="flex items-start space-x-4">
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold flex-shrink-0"
                      style={{ backgroundColor: formData.brandColor }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                      {milestone.description && (
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{milestone.duration} days</span>
                        </span>
                        {milestone.startDate && milestone.endDate && (
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(milestone.startDate).toLocaleDateString()} - {new Date(milestone.endDate).toLocaleDateString()}
                            </span>
                          </span>
                        )}
                      </div>
                      {milestone.deliverables && milestone.deliverables.length > 0 && (
                        <ul className="mt-2 ml-4 space-y-1">
                          {milestone.deliverables.map((del: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: formData.brandColor }} />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Terms */}
          {formData.paymentSchedule.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <CreditCard className="w-5 h-5" style={{ color: formData.brandColor }} />
                <span>Payment Terms</span>
              </h3>
              <div className="space-y-3">
                {formData.paymentSchedule.map((term: any, index: number) => (
                  <div key={term.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{term.title}</p>
                      {term.description && (
                        <p className="text-sm text-gray-600 mt-1">{term.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold" style={{ color: formData.brandColor }}>
                        {formatCurrency(term.amount)}
                      </p>
                      <p className="text-sm text-gray-600">{term.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>

              {formData.acceptedPaymentMethods.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Accepted Payment Methods:</p>
                  <p className="text-sm text-gray-600">{formData.acceptedPaymentMethods.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {/* Terms and Conditions */}
          {formData.termsAndConditions && (
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" style={{ color: formData.brandColor }} />
                <span>Terms and Conditions</span>
              </h3>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {formData.termsAndConditions}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-8 bg-gray-50">
            {formData.footerText && (
              <p className="text-center text-gray-600 mb-4">{formData.footerText}</p>
            )}
            <div className="text-center text-sm text-gray-500">
              <p>Generated on {new Date().toLocaleDateString()}</p>
              <p className="mt-2">Quote #{formData.quoteNumber} • Version {formData.version}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
