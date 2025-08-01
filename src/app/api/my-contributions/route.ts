import { BACKEND_API_BASE_URL } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get('userAddress');

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/contributions?userAddress=${userAddress}`, {
      method: 'GET',
    });
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to get contributions:', error);
    return NextResponse.json({ success: false, error: 'Failed to get contributions' }, { status: 500 });
  }
}