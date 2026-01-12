'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Award, Clock, Shield } from 'lucide-react'

interface StatCardProps {
  value: string
  label: string
  subtext: string
  icon: React.ElementType
}

function StatCard({ value, label, subtext, icon: Icon }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.5 }
    )

    const currentCard = cardRef.current
    if (currentCard) {
      observer.observe(currentCard)
    }

    return () => {
      if (currentCard) {
        observer.unobserve(currentCard)
      }
    }
  }, [])

  return (
    <div 
      ref={cardRef}
      className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {/* Elegant card */}
      <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 hover:shadow-lg transition-all">
        {/* Icon */}
        <div className="mb-6">
          <Icon className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
        </div>
        
        {/* Value */}
        <div className="text-5xl font-bold text-slate-900 mb-2 tracking-tight">
          {value}
        </div>
        
        {/* Label */}
        <div className="text-slate-900 font-semibold mb-1">
          {label}
        </div>
        
        {/* Subtext */}
        <div className="text-sm text-slate-500 font-light">
          {subtext}
        </div>
      </div>
    </div>
  )
}

export default function AnimatedStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
      <StatCard 
        value="10×" 
        label="Faster Delivery"
        subtext="Weeks, not months"
        icon={TrendingUp}
      />
      <StatCard 
        value="100%" 
        label="Quality Assured"
        subtext="Enterprise-grade code"
        icon={Award}
      />
      <StatCard 
        value="24hr" 
        label="Fast Response"
        subtext="Always available"
        icon={Clock}
      />
      <StatCard 
        value="99.9%" 
        label="Uptime SLA"
        subtext="Production-ready"
        icon={Shield}
      />
    </div>
  )
}

