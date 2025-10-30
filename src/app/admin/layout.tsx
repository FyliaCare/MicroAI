import type { Metadata } from 'next'
import SessionProvider from '@/components/auth/SessionProvider'
import AdminLayout from '@/components/admin/AdminLayout'

export const metadata: Metadata = {
  title: 'Admin Dashboard - MicroAI Systems',
  description: 'Management dashboard for MicroAI Systems business operations',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </SessionProvider>
  )
}