import { NextResponse } from 'next/server'

// Feature not available - placeholder
export async function POST() {
  return NextResponse.json(
    { error: 'Feature not available' },
    { status: 404 }
  )
}
