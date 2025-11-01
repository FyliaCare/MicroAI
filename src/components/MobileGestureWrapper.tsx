'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

interface MobileGestureWrapperProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPullRefresh?: () => Promise<void>
  enablePullRefresh?: boolean
  threshold?: number
}

export default function MobileGestureWrapper({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPullRefresh,
  enablePullRefresh = false,
  threshold = 50,
}: MobileGestureWrapperProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = threshold

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!touchStart) return

    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }

    setTouchEnd(currentTouch)

    // Handle pull-to-refresh
    if (enablePullRefresh && window.scrollY === 0) {
      const distance = currentTouch.y - touchStart.y
      if (distance > 0) {
        setIsPulling(true)
        setPullDistance(Math.min(distance, 120))
        // Prevent default scroll behavior when pulling
        if (distance > 10) {
          e.preventDefault()
        }
      }
    }
  }

  const onTouchEnd = async () => {
    if (!touchStart || !touchEnd) {
      setIsPulling(false)
      setPullDistance(0)
      return
    }

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isUpSwipe = distanceY > minSwipeDistance
    const isDownSwipe = distanceY < -minSwipeDistance

    // Handle pull-to-refresh
    if (enablePullRefresh && isPulling && pullDistance > 80 && onPullRefresh) {
      setIsRefreshing(true)
      try {
        await onPullRefresh()
      } catch (error) {
        console.error('Refresh error:', error)
      } finally {
        setIsRefreshing(false)
        setIsPulling(false)
        setPullDistance(0)
      }
    } else {
      setIsPulling(false)
      setPullDistance(0)
    }

    // Handle swipe gestures
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
      }
    } else {
      // Vertical swipe
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp()
      } else if (isDownSwipe && onSwipeDown) {
        onSwipeDown()
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    element.addEventListener('touchstart', onTouchStart, { passive: false })
    element.addEventListener('touchmove', onTouchMove, { passive: false })
    element.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', onTouchEnd)
    }
  }, [touchStart, touchEnd, isPulling, pullDistance])

  return (
    <div ref={containerRef} className="relative">
      {/* Pull-to-refresh indicator */}
      {enablePullRefresh && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 ease-out"
          style={{
            transform: `translateY(${isPulling || isRefreshing ? pullDistance - 40 : -40}px)`,
            opacity: isPulling || isRefreshing ? 1 : 0,
          }}
        >
          <div className="bg-black/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-800">
            {isRefreshing ? (
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className={`w-6 h-6 text-blue-500 transition-transform duration-300 ${
                  pullDistance > 80 ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Content with pull-to-refresh transform */}
      <div
        className="transition-transform duration-150 ease-out"
        style={{
          transform: `translateY(${isPulling ? Math.min(pullDistance * 0.5, 60) : 0}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Hook for swipe gestures
export function useSwipeGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = threshold

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

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
