import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_BASE_URL } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    if (!userAddress) {
      return NextResponse.json(
        { success: false, error: 'User address is required' },
        { status: 400 }
      );
    }

    // Get authorization header from the request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Make request to backend API
    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/transactions/user/${userAddress}?limit=${limit}&offset=${offset}`, {
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
        { success: false, error: `Failed to fetch user transactions: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      transactions: data.transactions || []
    });

  } catch (error) {
    console.error('Failed to fetch user transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user transactions' },
      { status: 500 }
    );
  }
}
