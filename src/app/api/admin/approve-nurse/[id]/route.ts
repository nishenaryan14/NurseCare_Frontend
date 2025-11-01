import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const jwt = req.cookies.get('jwt');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const resolvedParams = await params;
  const nurseId = resolvedParams.id;
  const res = await fetch(`${backendUrl}/nurses/${nurseId}/approve`, {
    method: 'PATCH',
    headers: {
      Authorization: jwt ? `Bearer ${jwt.value}` : ''
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
