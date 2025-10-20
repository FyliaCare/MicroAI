'use client'

import { useEffect, useRef, useState } from 'react'

interface StatCardProps {
  value: string
  label: string
  gradient: string
  delay: string
}

function StatCard({ value, label, gradient, delay }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [displayValue, setDisplayValue] = useState('0')
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

  useEffect(() => {
    if (!isVisible) return

    // Extract number and suffix from value
    const match = value.match(/^(\d+)(.*)$/)
    if (!match) {
      setDisplayValue(value)
      return
    }

    const targetNumber = parseInt(match[1])
    const suffix = match[2]
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = targetNumber / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= targetNumber) {
        setDisplayValue(targetNumber + suffix)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current) + suffix)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <div 
      ref={cardRef}
      className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover-lift animate-scaleIn ${delay}`}
    >
      <div className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}>
        {displayValue}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}

export default function AnimatedStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
      <StatCard 
        value="10x" 
        label="Faster Delivery" 
        gradient="from-blue-500 to-purple-500"
        delay=""
      />
      <StatCard 
        value="80%" 
        label="Tech" 
        gradient="from-purple-500 to-pink-500"
        delay="delay-200"
      />
      <StatCard 
        value="20%" 
        label="Developers" 
        gradient="from-pink-500 to-red-500"
        delay="delay-500"
      />
      <StatCard 
        value="24/7" 
        label="Support" 
        gradient="from-blue-500 to-cyan-500"
        delay="delay-700"
      />
    </div>
  )
}
