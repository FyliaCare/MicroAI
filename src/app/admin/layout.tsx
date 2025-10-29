import type { Metadata } from 'next'
import SessionProvider from '@/components/auth/SessionProvider'

export const metadata: Metadata = {
  title: 'Admin Dashboard - MicroAI Systems',
  description: 'Management dashboard for MicroAI Systems business operations',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}