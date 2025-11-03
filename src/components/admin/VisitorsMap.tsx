'use client'

import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'

interface CountryData {
  country: string
  countryCode: string
  visits: number
  projectRequests: number
  avgTimeOnSite: number
  latitude?: number | null
  longitude?: number | null
}

interface VisitorsMapProps {
  countries: CountryData[]
}

// World map topology URL
const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json'

export default function VisitorsMap({ countries }: VisitorsMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Create a map of country codes to data
  const countryDataMap = countries.reduce((acc, country) => {
    acc[country.countryCode] = country
    return acc
  }, {} as Record<string, CountryData>)

  // Create a map of country names to data (for fallback)
  const countryNameMap = countries.reduce((acc, country) => {
    acc[country.country.toLowerCase()] = country
    return acc
  }, {} as Record<string, CountryData>)

  const getCountryColor = (visits: number) => {
    if (visits === 0) return '#E5E7EB' // Gray - no visits
    if (visits < 10) return '#86EFAC' // Light green
    if (visits < 50) return '#22C55E' // Green
    if (visits < 100) return '#16A34A' // Dark green
    return '#15803D' // Darkest green
  }

  const getCountryData = (geo: any): CountryData | null => {
    // Try to match by ISO code first
    const isoCode = geo.properties.iso_a2 || geo.properties.ISO_A2
    if (isoCode && countryDataMap[isoCode]) {
      return countryDataMap[isoCode]
    }

    // Try to match by country name
    const countryName = (geo.properties.name || geo.properties.NAME || '').toLowerCase()
    if (countryName && countryNameMap[countryName]) {
      return countryNameMap[countryName]
    }

    return null
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden">
      {/* Map Container */}
      <ComposableMap
        projectionConfig={{
          scale: 147,
          center: [0, 20]
        }}
        className="w-full h-full"
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryData = getCountryData(geo)
                const visits = countryData?.visits || 0
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(visits)}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { 
                        fill: countryData ? '#3B82F6' : '#D1D5DB',
                        outline: 'none',
                        cursor: countryData ? 'pointer' : 'default'
                      },
                      pressed: { outline: 'none' }
                    }}
                    onMouseEnter={(e: any) => {
                      if (countryData) {
                        setHoveredCountry(countryData)
                        const rect = e.target.getBoundingClientRect()
                        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top })
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null)
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* Markers for countries with visits */}
          {countries.filter(c => c.latitude && c.longitude).map((country) => (
            <Marker
              key={country.countryCode}
              coordinates={[country.longitude || 0, country.latitude || 0]}
            >
              {/* Pulsing circle */}
              <circle
                r={Math.max(3, Math.min(15, country.visits / 5))}
                fill="#3B82F6"
                fillOpacity={0.6}
                stroke="#FFFFFF"
                strokeWidth={2}
                style={{
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
              {/* Visit count */}
              {country.visits > 10 && (
                <text
                  textAnchor="middle"
                  y={-12}
                  style={{
                    fontFamily: 'system-ui',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    fill: '#1F2937',
                    stroke: '#FFFFFF',
                    strokeWidth: '3px',
                    paintOrder: 'stroke'
                  }}
                >
                  {country.visits}
                </text>
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {hoveredCountry && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-2xl border-2 border-blue-500 p-4 pointer-events-none"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 10,
            transform: 'translate(-50%, -100%)',
            maxWidth: '280px'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{getFlagEmoji(hoveredCountry.countryCode)}</span>
            <h3 className="font-bold text-lg text-slate-900">{hoveredCountry.country}</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm text-slate-600 flex items-center gap-1">
                <span>👥</span> Total Visits
              </span>
              <span className="font-bold text-blue-600">{hoveredCountry.visits}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm text-slate-600 flex items-center gap-1">
                <span>📋</span> Project Requests
              </span>
              <span className="font-bold text-green-600">{hoveredCountry.projectRequests}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span className="text-sm text-slate-600 flex items-center gap-1">
                <span>⏱️</span> Avg. Time
              </span>
              <span className="font-bold text-purple-600">{formatTime(hoveredCountry.avgTimeOnSite)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg shadow-xl border border-slate-200 p-4">
        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Visit Intensity
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-4 rounded bg-[#86EFAC] border border-white"></div>
            <span className="text-slate-600">1-9 visits</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-4 rounded bg-[#22C55E] border border-white"></div>
            <span className="text-slate-600">10-49 visits</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-4 rounded bg-[#16A34A] border border-white"></div>
            <span className="text-slate-600">50-99 visits</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-4 rounded bg-[#15803D] border border-white"></div>
            <span className="text-slate-600">100+ visits</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg shadow-xl border border-slate-200 p-4">
        <h4 className="text-sm font-bold text-slate-900 mb-2">🌍 Global Reach</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-slate-600">Countries:</span>
            <span className="font-bold text-blue-600">{countries.length}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-600">Total Visits:</span>
            <span className="font-bold text-green-600">
              {countries.reduce((sum, c) => sum + c.visits, 0)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-600">Requests:</span>
            <span className="font-bold text-purple-600">
              {countries.reduce((sum, c) => sum + c.projectRequests, 0)}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
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
