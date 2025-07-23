import { API_BASE_URL } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, code } = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify?email=${email}&code=${code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to verify email:', error);
    return NextResponse.json({ success: false, error: 'Failed to verify email' }, { status: 500 });
  }
}