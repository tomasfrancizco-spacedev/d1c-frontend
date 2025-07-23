import { BACKEND_API_BASE_URL } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/leaderboard`, {  
      method: 'GET',
    });
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    return NextResponse.json({ success: false, error: 'Failed to get leaderboard' }, { status: 500 });
  }
}