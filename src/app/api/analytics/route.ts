import { NextResponse } from 'next/server'

// Mock analytics data
const analytics = {
  overview: {
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    totalClients: 48,
    revenue: 125000,
    services: 8
  },
  monthlyRevenue: [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 19000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 26000 }
  ],
  projectsByStatus: [
    { status: 'Planning', count: 2 },
    { status: 'In Progress', count: 6 },
    { status: 'Review', count: 2 },
    { status: 'Completed', count: 4 }
  ],
  recentActivity: [
    {
      id: 1,
      type: 'project_started',
      description: 'New project started: E-commerce Platform',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'meeting_scheduled',
      description: 'Client meeting scheduled: ABC Corp',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      type: 'project_completed',
      description: 'Project completed: SaaS Dashboard',
      timestamp: '1 day ago'
    }
  ]
}

export async function GET() {
  return NextResponse.json(analytics)
}