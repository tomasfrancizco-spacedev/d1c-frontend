import { BACKEND_API_URLS } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get('userAddress');
  const baseUrl = process.env.NODE_ENV === 'production' ? BACKEND_API_URLS.PRODUCTION : BACKEND_API_URLS.STAGING;

  try {
    const response = await fetch(`${baseUrl}/contributions?userAddress=${userAddress}`, {
      method: 'GET',
    });
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to get contributions:', error);
    return NextResponse.json({ success: false, error: 'Failed to get contributions' }, { status: 500 });
  }
}