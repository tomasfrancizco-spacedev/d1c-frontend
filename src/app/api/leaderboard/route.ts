import { BACKEND_API_URLS } from '@/lib/constants';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NODE_ENV === 'production' ? BACKEND_API_URLS.PRODUCTION : BACKEND_API_URLS.STAGING;

  try {
    const response = await fetch(`${baseUrl}/leaderboard`, {  
      method: 'GET',
    });
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    return NextResponse.json({ success: false, error: 'Failed to get leaderboard' }, { status: 500 });
  }
}