import { BACKEND_API_URLS } from '@/lib/constants';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NODE_ENV === 'development' ? BACKEND_API_URLS.DEVELOPMENT : (process.env.NODE_ENV === 'test' ? BACKEND_API_URLS.STAGING : BACKEND_API_URLS.PRODUCTION);

  try {
    const response = await fetch(`${baseUrl}/trading-volume`, {
      method: 'GET',
    });
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to get trading volume:', error);
    return NextResponse.json({ success: false, error: 'Failed to get trading volume' }, { status: 500 });
  }
}