import { BACKEND_API_BASE_URL } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {

  const limit = 361;

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/college?limit=${limit}`, {  
      method: 'GET',
    });
    const data = await response.json();

    if(data.success) {
      return NextResponse.json({ success: true, data: data });
    } else {
      return NextResponse.json({ success: false, error: data.message }, { status: data.statusCode });
    }

  } catch (error) {
    console.error('Failed to get leaderboard:', error);
    return NextResponse.json({ success: false, error: 'Failed to get leaderboard' }, { status: 500 });
  }
}