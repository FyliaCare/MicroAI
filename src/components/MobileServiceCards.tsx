'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ServiceCard {
  id: string
  icon: string
  title: string
  description: string
  href: string
  gradient: string
  hoverColor: string
}

const services: ServiceCard[] = [
  {
    id: 'web-apps',
    icon: '💻',
    title: 'Web Applications',
    description: 'Custom web apps built with cutting-edge technology and delivered fast.',
    href: '/services/web-applications',
    gradient: 'from-blue-600 to-blue-400',
    hoverColor: 'hover:border-blue-500',
  },
  {
    id: 'web-tools',
    icon: '🛠️',
    title: 'Web Tools',
    description: 'Specialized tools that streamline operations and boost productivity.',
    href: '/services/web-tools',
    gradient: 'from-purple-600 to-purple-400',
    hoverColor: 'hover:border-purple-500',
  },
  {
    id: 'websites',
    icon: '🌐',
    title: 'Websites',
    description: 'Professional, responsive websites that convert visitors to customers.',
    href: '/services/professional-websites',
    gradient: 'from-pink-600 to-pink-400',
    hoverColor: 'hover:border-pink-500',
  },
  {
    id: 'saas',
    icon: '☁️',
    title: 'SaaS Platforms',
    description: 'Scalable software-as-a-service solutions ready to launch fast.',
    href: '/services/saas-platforms',
    gradient: 'from-cyan-600 to-cyan-400',
    hoverColor: 'hover:border-cyan-500',
  },
]

export default function MobileServiceCards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < services.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex(Math.min(services.length - 1, currentIndex + 1))
  }

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const cardWidth = container.offsetWidth
      container.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth',
      })
    }
  }, [currentIndex])

  return (
    <div className="lg:hidden relative px-4">
      {/* Swipeable Container */}
      <div
        ref={containerRef}
        className="overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex gap-4" style={{ width: `${services.length * 100}%` }}>
          {services.map((service, index) => (
            <a
              key={service.id}
              href={service.href}
              className={`
                flex-shrink-0 snap-center
                bg-gray-900 border border-gray-800 rounded-2xl p-6
                ${service.hoverColor} transition-all
                mobile-active-state touch-manipulation
                ${currentIndex === index ? 'scale-100' : 'scale-95 opacity-70'}
              `}
              style={{ width: 'calc(100vw - 2rem)' }}
            >
              <div
                className={`
                  w-16 h-16 bg-gradient-to-br ${service.gradient}
                  rounded-2xl flex items-center justify-center mb-4
                  shadow-lg
                `}
              >
                <span className="text-3xl">{service.icon}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{service.title}</h3>
              <p className="text-gray-400 text-base leading-relaxed">
                {service.description}
              </p>
              <div className="mt-4 flex items-center text-blue-400 font-semibold">
                <span>Learn more</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Only show if not first/last */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-full p-3 shadow-lg mobile-active-state"
          aria-label="Previous service"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {currentIndex < services.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-full p-3 shadow-lg mobile-active-state"
          aria-label="Next service"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              h-2 rounded-full transition-all duration-300 touch-manipulation
              ${
                currentIndex === index
                  ? 'w-8 bg-blue-500'
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
              }
            `}
            aria-label={`Go to service ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe hint */}
      {currentIndex === 0 && (
        <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-sm animate-pulse">
          <span>← Swipe to explore →</span>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
