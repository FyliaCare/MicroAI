/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit execution frequency
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function to limit execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  let lastResult: any

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      inThrottle = true
      lastResult = func(...args)
      
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
    
    return lastResult
  }
}

/**
 * Lazy load component with intersection observer
 */
export function lazyLoadComponent(
  component: HTMLElement,
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  if (!('IntersectionObserver' in window)) {
    callback()
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback()
        observer.unobserve(component)
      }
    })
  }, {
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  })

  observer.observe(component)
}

/**
 * Preload critical resources
 */
export function preloadResource(url: string, as: string) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  link.as = as
  
  document.head.appendChild(link)
}

/**
 * Prefetch resources for future navigation
 */
export function prefetchResource(url: string) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  
  document.head.appendChild(link)
}

/**
 * Request idle callback wrapper with fallback
 */
export function requestIdleCallback(callback: () => void, timeout = 1000) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout })
  } else {
    setTimeout(callback, 1)
  }
}

/**
 * Optimize images with loading strategy
 */
export function getImageLoadingStrategy(
  priority: boolean = false
): 'eager' | 'lazy' {
  return priority ? 'eager' : 'lazy'
}

/**
 * Get optimal image sizes for responsive images
 */
export function getResponsiveSizes(
  type: 'full' | 'half' | 'third' | 'card' = 'full'
): string {
  const sizes = {
    full: '100vw',
    half: '(min-width: 768px) 50vw, 100vw',
    third: '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
    card: '(min-width: 1280px) 400px, (min-width: 768px) 350px, 100vw',
  }
  
  return sizes[type]
}

/**
 * Check if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get connection speed
 */
export function getConnectionSpeed(): 'slow' | 'fast' | 'unknown' {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown'
  }

  const connection = (navigator as any).connection
  
  if (!connection) return 'unknown'
  
  const effectiveType = connection.effectiveType
  
  if (effectiveType === '4g') return 'fast'
  if (effectiveType === '3g' || effectiveType === '2g') return 'slow'
  
  return 'unknown'
}

/**
 * Optimize animation based on device capabilities
 */
export function shouldReduceAnimations(): boolean {
  if (prefersReducedMotion()) return true
  if (getConnectionSpeed() === 'slow') return true
  
  return false
}

/**
 * Memory-efficient event listener manager
 */
export class EventListenerManager {
  private listeners: Map<string, { element: EventTarget; type: string; handler: EventListener }[]> = new Map()

  add(id: string, element: EventTarget, type: string, handler: EventListener, options?: AddEventListenerOptions) {
    element.addEventListener(type, handler, options)
    
    if (!this.listeners.has(id)) {
      this.listeners.set(id, [])
    }
    
    this.listeners.get(id)!.push({ element, type, handler })
  }

  remove(id: string) {
    const listeners = this.listeners.get(id)
    
    if (!listeners) return
    
    listeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler)
    })
    
    this.listeners.delete(id)
  }

  removeAll() {
    this.listeners.forEach((_, id) => this.remove(id))
  }
}

/**
 * Create optimized scroll handler
 */
export function createScrollHandler(
  callback: (scrollY: number) => void,
  options: { throttle?: number; passive?: boolean } = {}
): () => void {
  const { throttle: throttleTime = 100, passive = true } = options
  
  const handler = throttle(() => {
    callback(window.scrollY)
  }, throttleTime)
  
  window.addEventListener('scroll', handler, { passive })
  
  return () => window.removeEventListener('scroll', handler)
}

/**
 * Format file size
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
