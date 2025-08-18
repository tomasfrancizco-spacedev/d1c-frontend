import { BACKEND_API_BASE_URL } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // const periodStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    // const encodedPeriodStart = encodeURIComponent(periodStart);

    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/stats/trading-volume?periodType=all_time`, {
      method: 'GET',  
      headers: request.headers,
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: 'Failed to get trading volume' }, { status: 500 });
    }

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, data: data.data });
    } else {
      return NextResponse.json({ success: false, error: data.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to get trading volume:', error);
    return NextResponse.json({ success: false, error: 'Failed to get trading volume' }, { status: 500 });
  }
}