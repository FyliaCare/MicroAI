'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdvancedDashboard from '@/components/admin/AdvancedDashboard'
import AdvancedProjectsManager from '@/components/admin/AdvancedProjectsManager'
import AdvancedClientsManager from '@/components/admin/AdvancedClientsManager'
import AdvancedQuotesManager from '@/components/admin/AdvancedQuotesManager'
import AdvancedServicesManager from '@/components/admin/AdvancedServicesManager'
import AdvancedAnalytics from '@/components/admin/AdvancedAnalytics'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 min-w-[44px] min-h-[44px] touch-manipulation"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900">MicroAI</Link>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="text-sm sm:text-lg text-gray-600 hidden sm:inline">Management Dashboard</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="text-gray-600 hover:text-gray-900 hidden sm:block">Settings</button>
              <button className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 text-sm sm:text-base min-h-[44px] touch-manipulation">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <nav className={`
          fixed lg:static
          inset-y-0 left-0
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out
          w-64 bg-white shadow-sm
          z-30 lg:z-0
          overflow-y-auto
        `}>
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'overview' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('projects'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'projects' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('clients'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'clients' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Clients
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('quotes'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'quotes' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Quotes
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('services'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'services' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-md min-h-[44px] touch-manipulation ${
                    activeTab === 'analytics' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Analytics
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:w-auto">
          {activeTab === 'overview' && <AdvancedDashboard />}
          {activeTab === 'projects' && <AdvancedProjectsManager />}
          {activeTab === 'clients' && <AdvancedClientsManager />}
          {activeTab === 'quotes' && <AdvancedQuotesManager />}
          {activeTab === 'services' && <AdvancedServicesManager />}
          {activeTab === 'analytics' && <AdvancedAnalytics />}
        </main>
      </div>
    </div>
  )
}