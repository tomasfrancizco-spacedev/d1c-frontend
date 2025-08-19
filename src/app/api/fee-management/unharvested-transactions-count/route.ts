import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_BASE_URL } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header from the request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Make request to backend API
    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/fee-management/unharvested-transactions-count`, {
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
        { error: `Failed to fetch unharvested transactions count: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Failed to fetch unharvested transactions count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unharvested transactions count' },
      { status: 500 }
    );
  }
}
