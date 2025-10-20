import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - MicroAI',
  description: 'Management dashboard for MicroAI business operations',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}