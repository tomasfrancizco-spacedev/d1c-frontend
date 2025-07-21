import { BACKEND_API_URLS } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, code } = await request.json();
  const baseUrl = process.env.NODE_ENV === 'development' ? BACKEND_API_URLS.DEVELOPMENT : (process.env.NODE_ENV === 'test' ? BACKEND_API_URLS.STAGING : BACKEND_API_URLS.PRODUCTION);

  try {
    const response = await fetch(`${baseUrl}/auth/verify?email=${email}&code=${code}`, {
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