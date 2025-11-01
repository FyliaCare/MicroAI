import { NextRequest, NextResponse } from 'next/server'

// Mock data for clients
const clients = [
  {
    id: 1,
    name: 'TechCorp Inc.',
    email: 'john@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Inc.',
    activeProjects: 3,
    totalProjects: 5,
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'StartupXYZ',
    email: 'sarah@startupxyz.com',
    phone: '+1-555-0456',
    company: 'StartupXYZ',
    activeProjects: 1,
    totalProjects: 2,
    joinDate: '2024-03-20'
  }
]

export async function GET() {
  return NextResponse.json(clients)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newClient = {
    id: clients.length + 1,
    ...body,
    activeProjects: 0,
    totalProjects: 0,
    joinDate: new Date().toISOString().split('T')[0]
  }
  clients.push(newClient)
  return NextResponse.json(newClient, { status: 201 })
}
