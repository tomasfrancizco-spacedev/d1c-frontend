import { BACKEND_API_BASE_URL } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get('userAddress');

  if (!userAddress) {
    return NextResponse.json({ success: false, error: 'User address is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/stats/user-stats/wallet/${userAddress}`, {
      method: 'GET',
      headers: request.headers,
    });

    const data = await response.json();

    if(data.success) {
      return NextResponse.json({ 
        success: true, 
        data: data.data
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: data.message 
      }, { status: data.statusCode || 500 });
    }
  } catch (error) {
    console.error('Failed to get contributions:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get contributions' 
    }, { status: 500 });
  }
}