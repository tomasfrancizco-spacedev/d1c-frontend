import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { publicKey, timestamp } = await request.json();

    if (!publicKey || !timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const authData = {
      publicKey,
      timestamp
    };

    const response = NextResponse.json({ success: true });
    
    // Set httpOnly cookie for wallet authentication
    response.cookies.set('siws-auth', JSON.stringify(authData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Failed to set wallet auth cookie:', error);
    return NextResponse.json({ error: 'Failed to set authentication' }, { status: 500 });
  }
} 