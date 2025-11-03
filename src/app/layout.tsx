import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '@/components/ClientProviders'
import { WebVitals } from '@/components/WebVitals'
import ChatWidget from '@/components/ChatWidget'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import VisitorTracker from '@/components/VisitorTracker'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: {
    default: 'MicroAI Systems - 10x Faster Web Development | Enterprise-Grade Applications',
    template: '%s | MicroAI Systems',
  },
  description: 'Revolutionary development technology delivering enterprise-grade web applications, SaaS platforms, and digital solutions in 1/10th the time. Custom web apps in 1-2 weeks. Professional websites in 3-5 days. Expert Next.js, TypeScript & AI-powered development serving clients worldwide in Africa, USA, Canada, UK, and Australia.',
  keywords: [
    // Core services
    'web development',
    'web application development',
    'SaaS development',
    'custom web applications',
    'professional website design',
    'web tools development',
    
    // Technologies
    'Next.js development',
    'TypeScript development',
    'React development',
    'full-stack development',
    'AI-powered development',
    'fast web development',
    
    // Global location-based keywords
    'web development Africa',
    'web development USA',
    'web development Canada',
    'web development UK',
    'web development Australia',
    'international web development',
    'global software development',
    'remote web development',
    'offshore web development',
    
    // Business benefits
    '10x faster development',
    'rapid application development',
    'quick website delivery',
    'enterprise-grade applications',
    'scalable web solutions',
    'business automation tools',
    
    // Specific solutions
    'CRM development',
    'e-commerce development',
    'booking system development',
    'dashboard development',
    'API development',
  ],
  authors: [{ name: 'MicroAI Systems', url: 'https://www.microaisystems.com' }],
  creator: 'MicroAI Systems',
  publisher: 'MicroAI Systems',
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'MicroAI Systems - 10x Faster Web Development | Enterprise Applications',
    description: 'Revolutionary development delivering web applications, SaaS platforms, and websites 10x faster. Custom solutions in weeks, not months. Serving clients worldwide across Africa, North America, Europe, UK, and Australia.',
    siteName: 'MicroAI Systems',
    images: [
      {
        url: '/MICROAI SYSTEMS OFFICIAL LOGO.png',
        width: 1200,
        height: 630,
        alt: 'MicroAI Systems - 10x Faster Web Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MicroAI Systems - 10x Faster Web Development',
    description: 'Revolutionary development delivering web applications 10x faster. Custom solutions in weeks, not months.',
    images: ['/MICROAI SYSTEMS OFFICIAL LOGO.png'],
    creator: '@microaisystems',
    site: '@microaisystems',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
  classification: 'Web Development Services',
  verification: {
    // Add when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/MICROAI SYSTEMS OFFICIAL LOGO.png" type="image/png" />
        <link rel="apple-touch-icon" href="/MICROAI SYSTEMS OFFICIAL LOGO.png" />
        
        {/* Additional SEO meta tags */}
        <meta name="application-name" content="MicroAI Systems" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MicroAI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Global SEO - No specific geo restrictions */}
        <meta name="geo.region" content="INTL" />
        <meta name="geo.placename" content="Global" />
        <meta name="target-audience" content="international" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        
        {/* Security Monitoring Script */}
        <script src="/security-monitor.js" data-allowed="true" defer></script>
      </head>
      <body className={inter.className}>
        <WebVitals />
        <VisitorTracker />
        <ClientProviders>
          {children}
          <ChatWidget />
          <MobileBottomNav />
        </ClientProviders>
      </body>
    </html>
  )
}
