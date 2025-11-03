'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface CountryData {
  country: string
  countryCode: string
  visits: number
  projectRequests: number
  avgTimeOnSite: number
  latitude?: number | null
  longitude?: number | null
}

interface VisitorsMapLeafletProps {
  countries: CountryData[]
}

export default function VisitorsMapLeaflet({ countries }: VisitorsMapLeafletProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: true,
      scrollWheelZoom: true
    })

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        mapRef.current?.removeLayer(layer)
      }
    })

    // Add markers for each country with visits
    countries.forEach((country) => {
      if (!country.latitude || !country.longitude) return

      const radius = Math.max(5, Math.min(25, country.visits / 3))
      
      // Create custom pulsing icon
      const pulsingIcon = L.divIcon({
        className: 'custom-pulsing-marker',
        html: `
          <div class="relative">
            <div class="absolute inset-0 bg-blue-500 rounded-full opacity-60 animate-ping"></div>
            <div class="relative bg-blue-500 rounded-full border-2 border-white shadow-lg" 
                 style="width: ${radius * 2}px; height: ${radius * 2}px;">
            </div>
            ${country.visits > 10 ? `
              <div class="absolute top-[-24px] left-1/2 transform -translate-x-1/2 
                          bg-white px-2 py-1 rounded-full text-xs font-bold text-gray-900 
                          shadow-md border border-gray-200 whitespace-nowrap">
                ${country.visits}
              </div>
            ` : ''}
          </div>
        `,
        iconSize: [radius * 2, radius * 2],
        iconAnchor: [radius, radius]
      })

      const marker = L.marker([country.latitude, country.longitude], {
        icon: pulsingIcon
      }).addTo(mapRef.current!)

      // Create popup content
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <div class="flex items-center gap-2 mb-2 pb-2 border-b">
            <span class="text-2xl">${getFlagEmoji(country.countryCode)}</span>
            <h3 class="font-bold text-base text-slate-900">${country.country}</h3>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span class="text-sm text-slate-600">👥 Total Visits</span>
              <span class="font-bold text-blue-600">${country.visits}</span>
            </div>
            <div class="flex items-center justify-between p-2 bg-green-50 rounded">
              <span class="text-sm text-slate-600">📋 Requests</span>
              <span class="font-bold text-green-600">${country.projectRequests}</span>
            </div>
            <div class="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span class="text-sm text-slate-600">⏱️ Avg. Time</span>
              <span class="font-bold text-purple-600">${formatTime(country.avgTimeOnSite)}</span>
            </div>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'custom-popup'
      })

      marker.on('click', () => {
        setSelectedCountry(country)
      })
    })
  }, [countries])

  const totalVisits = countries.reduce((sum, c) => sum + c.visits, 0)
  const totalRequests = countries.reduce((sum, c) => sum + c.projectRequests, 0)

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg shadow-xl border border-slate-200 p-4 z-[1000]">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Visitor Locations
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-slate-600">Active countries</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-slate-600">High traffic (10+)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-slate-600">Very high (50+)</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg shadow-xl border border-slate-200 p-4 z-[1000]">
        <h4 className="text-sm font-bold text-slate-900 mb-2">🌍 Global Reach</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-slate-600">Countries:</span>
            <span className="font-bold text-blue-600">{countries.length}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-600">Total Visits:</span>
            <span className="font-bold text-green-600">{totalVisits}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-600">Requests:</span>
            <span className="font-bold text-purple-600">{totalRequests}</span>
          </div>
        </div>
      </div>

      {/* Country List (Mobile Friendly) */}
      {countries.length > 0 && (
        <div className="absolute bottom-4 right-4 max-w-xs bg-white/95 backdrop-blur rounded-lg shadow-xl border border-slate-200 p-3 z-[1000] max-h-48 overflow-y-auto hidden md:block">
          <h4 className="text-xs font-bold text-slate-900 mb-2 sticky top-0 bg-white">Top Countries</h4>
          <div className="space-y-1">
            {countries
              .sort((a, b) => b.visits - a.visits)
              .slice(0, 5)
              .map((country) => (
                <div
                  key={country.countryCode}
                  className="flex items-center justify-between text-xs p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                  onClick={() => {
                    if (country.latitude && country.longitude && mapRef.current) {
                      mapRef.current.setView([country.latitude, country.longitude], 4)
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{getFlagEmoji(country.countryCode)}</span>
                    <span className="text-slate-700 font-medium">{country.country}</span>
                  </div>
                  <span className="text-blue-600 font-bold">{country.visits}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .custom-pulsing-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 0.5rem;
          padding: 0;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }

        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}

// Helper functions
function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode === 'XX') return '🌍'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}
