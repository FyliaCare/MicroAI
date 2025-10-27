import type { Metadata } from 'next'
import SessionProvider from '@/components/auth/SessionProvider'

export const metadata: Metadata = {
  title: 'Admin Dashboard - MicroAI',
  description: 'Management dashboard for MicroAI business operations',
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