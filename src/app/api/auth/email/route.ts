import { BACKEND_API_URLS } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const baseUrl = process.env.NODE_ENV === 'production' ? BACKEND_API_URLS.PRODUCTION : BACKEND_API_URLS.STAGING;

  try {
    const response = await fetch(`${baseUrl}/auth/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to authenticate email:', error);
    return NextResponse.json({ success: false, error: 'Failed to authenticate email' }, { status: 500 });
  }
}