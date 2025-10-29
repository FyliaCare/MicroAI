import type { Metadata } from 'next'
import SessionProvider from '@/components/auth/SessionProvider'
import AdminSidebar from '@/components/admin/AdminSidebar'

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
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}