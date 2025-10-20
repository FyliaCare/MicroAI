'use client'

import { useEffect, useRef, useState } from 'react'

export default function SpeedComparison() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    const currentSection = sectionRef.current
    if (currentSection) {
      observer.observe(currentSection)
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection)
      }
    }
  }, [])

  return (
    <div ref={sectionRef} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-10 animate-scaleIn">
      <h3 className="text-3xl font-bold mb-8 text-center">Development Speed Comparison</h3>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Traditional Companies */}
        <div className="animate-slideInLeft">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">🐌</div>
            <h4 className="text-xl font-semibold text-gray-400">Traditional Companies</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden relative">
                <div 
                  className="bg-gray-500 h-4 rounded-full transition-all duration-[2000ms] ease-out" 
                  style={{ width: isVisible ? '99%' : '0%' }}
                ></div>
              </div>
              <span className={`ml-4 text-gray-400 whitespace-nowrap font-semibold transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                10 weeks
              </span>
            </div>
            <p className="text-sm text-gray-500">Average project timeline</p>
          </div>
        </div>
        
        {/* MicroAI Technology */}
        <div className="animate-slideInRight">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3 animate-pulse">⚡</div>
            <h4 className="text-xl font-semibold text-blue-400">MicroAI Technology</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 h-4 rounded-full transition-all duration-[2000ms] ease-out relative overflow-hidden" 
                  style={{ width: isVisible ? '10%' : '0%', backgroundSize: '200% 100%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <span className={`ml-4 text-blue-400 font-bold whitespace-nowrap transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                1 week
              </span>
            </div>
            <p className="text-sm text-green-400 font-semibold">✨ 10x faster delivery</p>
          </div>
        </div>
      </div>
    </div>
  )
}
