import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'MicroAI - 10x Faster Web Development',
  description: 'Revolutionary development technology delivering web applications, SaaS platforms, and digital solutions in 1/10th the time of traditional companies. Experience the future of web development.',
  keywords: ['web development', 'SaaS', 'web applications', 'fast development', 'AI development'],
  authors: [{ name: 'MicroAI' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}