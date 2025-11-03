'use client'

import { useEffect, useRef, useState } from 'react'

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

export default function VisitorsMap({ countries }: VisitorsMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Country code to SVG path mapping (simplified - major countries)
  const countryPaths: Record<string, string> = {
    // Add major country SVG paths here - this is a simplified version
    // In production, use a proper SVG world map library
    GH: 'M480,300 L490,295 L495,305 L485,310 Z', // Ghana (placeholder)
    US: 'M100,150 L200,150 L200,220 L100,220 Z', // USA (placeholder)
    GB: 'M480,100 L500,100 L500,120 L480,120 Z', // UK (placeholder)
    // Add more countries as needed
  }

  const getCountryColor = (visits: number) => {
    if (visits === 0) return '#E5E7EB' // Gray
    if (visits < 10) return '#86EFAC' // Light green
    if (visits < 50) return '#22C55E' // Green
    if (visits < 100) return '#16A34A' // Dark green
    return '#15803D' // Darkest green
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden">
      {/* Interactive SVG Map */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        onMouseMove={handleMouseMove}
      >
        {/* Fallback: Display pins on a simple world map representation */}
        <div className="relative w-full h-full">
          {/* Grid background for geographic reference */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Country indicators */}
          {countries.map((country) => {
            // Simple coordinate mapping (you'd use proper projection in production)
            const x = ((country.longitude || 0) + 180) * (100 / 360) // Convert to percentage
            const y = ((90 - (country.latitude || 0)) * (100 / 180)) // Convert to percentage

            return (
              <div
                key={country.countryCode}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
                onMouseEnter={() => setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                {/* Outer glow */}
                <div 
                  className="absolute inset-0 rounded-full opacity-50 group-hover:opacity-75 transition-opacity"
                  style={{
                    width: `${Math.max(20, Math.min(60, country.visits / 2))}px`,
                    height: `${Math.max(20, Math.min(60, country.visits / 2))}px`,
                    backgroundColor: getCountryColor(country.visits),
                    filter: 'blur(8px)',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
                
                {/* Main pin */}
                <div 
                  className="relative rounded-full group-hover:scale-125 transition-transform shadow-lg"
                  style={{
                    width: `${Math.max(12, Math.min(40, country.visits / 3))}px`,
                    height: `${Math.max(12, Math.min(40, country.visits / 3))}px`,
                    backgroundColor: getCountryColor(country.visits),
                    border: '2px solid white'
                  }}
                >
                  {/* Visit count badge */}
                  {country.visits > 10 && (
                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {country.visits > 99 ? '99+' : country.visits}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCountry && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-4 pointer-events-none"
          style={{
            left: mousePos.x + 15,
            top: mousePos.y + 15,
            maxWidth: '250px'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getFlagEmoji(hoveredCountry.countryCode)}</span>
            <h3 className="font-bold text-slate-900">{hoveredCountry.country}</h3>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Visits:</span>
              <span className="font-semibold text-slate-900">{hoveredCountry.visits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Project Requests:</span>
              <span className="font-semibold text-green-600">{hoveredCountry.projectRequests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Avg. Time:</span>
              <span className="font-semibold text-blue-600">{formatTime(hoveredCountry.avgTimeOnSite)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-slate-200 p-3">
        <h4 className="text-xs font-semibold text-slate-700 mb-2">Visit Intensity</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#86EFAC]"></div>
            <span className="text-slate-600">1-9 visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#22C55E]"></div>
            <span className="text-slate-600">10-49 visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#16A34A]"></div>
            <span className="text-slate-600">50-99 visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#15803D]"></div>
            <span className="text-slate-600">100+ visits</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
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
