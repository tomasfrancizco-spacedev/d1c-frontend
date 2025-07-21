import { BACKEND_API_URLS } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, walletAddress } = await request.json();
  const baseUrl = process.env.NODE_ENV === 'development' ? BACKEND_API_URLS.DEVELOPMENT : (process.env.NODE_ENV === 'test' ? BACKEND_API_URLS.STAGING : BACKEND_API_URLS.PRODUCTION);

  if (!email || !walletAddress) {
    return NextResponse.json({ success: false, error: 'Email and wallet address are required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${baseUrl}/v1/auth/wallet-signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, walletAddress }),
    });
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to request OTP:', error);
    return NextResponse.json({ success: false, error: 'Failed to request OTP' }, { status: 500 });
  }
}