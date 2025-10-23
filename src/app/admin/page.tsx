'use client'

import { useState } from 'react'
import Link from 'next/link'

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
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Dashboard Overview</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Active Projects</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Total Clients</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">48</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">$125K</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Services</h3>
                  <p className="text-3xl font-bold text-orange-600 mt-2">8</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">New project started: E-commerce Platform</span>
                    <span className="text-sm text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Client meeting scheduled: ABC Corp</span>
                    <span className="text-sm text-gray-400">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Project completed: SaaS Dashboard</span>
                    <span className="text-sm text-gray-400">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  New Project
                </button>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">E-commerce Platform</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TechCorp Inc.</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          In Progress
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec 15, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Add Client
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">TechCorp Inc.</h3>
                  <p className="text-gray-600 mt-1">john@techcorp.com</p>
                  <p className="text-sm text-gray-500 mt-2">Active Projects: 3</p>
                  <button className="mt-4 text-blue-600 hover:text-blue-900">View Details</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Services</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Add Service
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Web Application Development</h3>
                  <p className="text-gray-600 mt-2">Custom web applications built with modern frameworks</p>
                  <p className="text-sm text-gray-500 mt-2">Price: $5,000 - $50,000</p>
                  <button className="mt-4 text-blue-600 hover:text-blue-900">Edit Service</button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">SaaS Development</h3>
                  <p className="text-gray-600 mt-2">Scalable Software-as-a-Service solutions</p>
                  <p className="text-sm text-gray-500 mt-2">Price: $10,000 - $100,000</p>
                  <button className="mt-4 text-blue-600 hover:text-blue-900">Edit Service</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                <p className="text-gray-600">Analytics dashboard coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}