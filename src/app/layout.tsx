import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '@/components/ClientProviders'
import { WebVitals } from '@/components/WebVitals'

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
    default: 'MicroAI Systems - 10x Faster Web Development',
    template: '%s | MicroAI Systems',
  },
  description: 'Revolutionary development technology delivering web applications, SaaS platforms, and digital solutions in 1/10th the time of traditional companies. Experience the future of web development.',
  keywords: ['web development', 'SaaS', 'web applications', 'fast development', 'AI development', 'Next.js', 'TypeScript'],
  authors: [{ name: 'MicroAI Systems' }],
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
    title: 'MicroAI Systems - 10x Faster Web Development',
    description: 'Revolutionary development technology delivering web applications 10x faster',
    siteName: 'MicroAI Systems',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MicroAI Systems - 10x Faster Web Development',
    description: 'Revolutionary development technology delivering web applications 10x faster',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={inter.className}>
        <WebVitals />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}