import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_BASE_URL } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';

    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/fee-management/job-logs?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Failed to fetch job logs: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Failed to fetch job logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job logs' },
      { status: 500 }
    );
  }
}
