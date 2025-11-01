import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Forward JWT from cookies if present
  const jwt = req.cookies.get('jwt');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const res = await fetch(`${backendUrl}/nurses/pending`, {
    headers: {
      Authorization: jwt ? `Bearer ${jwt.value}` : ''
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
