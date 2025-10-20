'use client'

import { useEffect, useRef, useState } from 'react'

interface StatProps {
  value: number
  suffix?: string
  label: string
  gradient: string
  delay?: number
}

function StatBox({ value, suffix = '', label, gradient, delay = 0 }: StatProps) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const statRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true)
          }
        })
      },
      { threshold: 0.5 }
    )

    const currentStat = statRef.current
    if (currentStat) {
      observer.observe(currentStat)
    }

    return () => {
      if (currentStat) {
        observer.unobserve(currentStat)
      }
    }
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = value / steps
    const stepDuration = duration / steps

    setTimeout(() => {
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, stepDuration)

      return () => clearInterval(timer)
    }, delay)
  }, [hasStarted, value, delay])

  return (
    <div ref={statRef} className="text-center">
      <div className={`text-6xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-3`}>
        {count}{suffix}
      </div>
      <p className="text-gray-400 font-medium">{label}</p>
    </div>
  )
}

export default function CountingStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
      <StatBox 
        value={10}
        suffix="x"
        label="Faster Delivery" 
        gradient="from-blue-500 to-purple-500"
      />
      <StatBox 
        value={100}
        suffix="%"
        label="Client Satisfaction" 
        gradient="from-purple-500 to-pink-500"
        delay={200}
      />
      <StatBox 
        value={50}
        suffix="+"
        label="Projects Delivered" 
        gradient="from-pink-500 to-red-500"
        delay={400}
      />
      <StatBox 
        value={247}
        label="Support Available" 
        gradient="from-blue-500 to-cyan-500"
        delay={600}
      />
    </div>
  )
}
