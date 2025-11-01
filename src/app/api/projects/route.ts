import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
const projects = [
  {
    id: 1,
    name: 'E-commerce Platform',
    client: 'TechCorp Inc.',
    status: 'In Progress',
    dueDate: '2024-12-15',
    description: 'Full-stack e-commerce solution with payment integration'
  },
  {
    id: 2,
    name: 'SaaS Dashboard',
    client: 'StartupXYZ',
    status: 'Completed',
    dueDate: '2024-11-20',
    description: 'Analytics dashboard for SaaS platform'
  }
]

export async function GET() {
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newProject = {
    id: projects.length + 1,
    ...body,
    status: 'Planning'
  }
  projects.push(newProject)
  return NextResponse.json(newProject, { status: 201 })
}
