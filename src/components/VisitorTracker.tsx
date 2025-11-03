'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitorTracker() {
  const pathname = usePathname()
  const sessionId = useRef<string>('')
  const startTime = useRef<number>(0)

  useEffect(() => {
    // Generate or retrieve session ID
    const storedSessionId = sessionStorage.getItem('visitor_session_id')
    if (storedSessionId) {
      sessionId.current = storedSessionId
    } else {
      sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('visitor_session_id', sessionId.current)
    }
  }, [])

  useEffect(() => {
    // Start tracking time on page
    startTime.current = Date.now()

    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId.current,
            pageUrl: window.location.href,
            referrer: document.referrer || null,
            timeOnPage: null,
            isProjectRequest: false
          })
        })
      } catch (error) {
        console.error('Failed to track page view:', error)
      }
    }

    trackPageView()

    // Track time on page when leaving
    const trackTimeOnPage = async () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000) // seconds
      
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId.current,
            pageUrl: window.location.href,
            referrer: document.referrer || null,
            timeOnPage: timeSpent,
            isProjectRequest: false
          })
        })
      } catch (error) {
        console.error('Failed to track time on page:', error)
      }
    }

    // Track on page unload
    window.addEventListener('beforeunload', trackTimeOnPage)

    return () => {
      window.removeEventListener('beforeunload', trackTimeOnPage)
      trackTimeOnPage() // Also track when component unmounts (navigation)
    }
  }, [pathname])

  return null // This component renders nothing
}

// Helper function to track project requests from anywhere in the app
export async function trackProjectRequest(projectRequestId: string) {
  const sessionId = sessionStorage.getItem('visitor_session_id') || 'unknown'
  
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        pageUrl: window.location.href,
        referrer: document.referrer || null,
        timeOnPage: null,
        isProjectRequest: true,
        projectRequestId
      })
    })
  } catch (error) {
    console.error('Failed to track project request:', error)
  }
}
