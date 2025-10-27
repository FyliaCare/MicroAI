'use client'

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

/**
 * Web Vitals monitoring component
 * Tracks and reports Core Web Vitals metrics
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric)
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // You can send to your analytics service here
      // Example: analytics.track(metric.name, metric.value)
      
      // Send to custom API endpoint
      if (typeof window !== 'undefined' && navigator.sendBeacon) {
        const body = JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        })
        
        // Use sendBeacon for non-blocking analytics
        navigator.sendBeacon('/api/analytics/web-vitals', body)
      }
    }
  })

  // Performance observer for additional metrics
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    // Observe long tasks (tasks > 50ms)
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Long Task]', {
              duration: entry.duration,
              startTime: entry.startTime,
            })
          }
        }
      })

      longTaskObserver.observe({ entryTypes: ['longtask'] })

      return () => {
        longTaskObserver.disconnect()
      }
    } catch (e) {
      // Long tasks not supported
    }
  }, [])

  return null
}

/**
 * Performance monitoring utilities
 */
export const performanceUtils = {
  /**
   * Mark a custom performance metric
   */
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(name)
    }
  },

  /**
   * Measure between two marks
   */
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        const measure = endMark
          ? performance.measure(name, startMark, endMark)
          : performance.measure(name, startMark)
        
        if (process.env.NODE_ENV === 'development' && measure) {
          console.log(`[Performance] ${name}:`, measure.duration.toFixed(2), 'ms')
        }
        
        return measure
      } catch (e) {
        // Marks don't exist
      }
    }
  },

  /**
   * Get navigation timing
   */
  getNavigationTiming: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (timing) {
        return {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          tcp: timing.connectEnd - timing.connectStart,
          ttfb: timing.responseStart - timing.requestStart,
          download: timing.responseEnd - timing.responseStart,
          domInteractive: timing.domInteractive - timing.fetchStart,
          domComplete: timing.domComplete - timing.fetchStart,
          loadComplete: timing.loadEventEnd - timing.fetchStart,
        }
      }
    }
    return null
  },

  /**
   * Get resource timing
   */
  getResourceTiming: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      return resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: resource.initiatorType,
      }))
    }
    return []
  },

  /**
   * Clear all performance marks and measures
   */
  clear: () => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.clearMarks()
      performance.clearMeasures()
    }
  },
}
