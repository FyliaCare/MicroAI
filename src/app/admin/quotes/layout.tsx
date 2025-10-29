import AdminSidebar from '@/components/admin/AdminSidebar'

export default function QuotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
