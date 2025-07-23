import { API_BASE_URL } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Missing email or code' }, { status: 400 });
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    const verifyOtpResponse = await fetch(`${API_BASE_URL}/v1/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, otpCode: code }),
    });

    const verifyOtpData = await verifyOtpResponse.json();

    if (!verifyOtpData.success) {
      return NextResponse.json({ error: verifyOtpData.error }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, verified: true, data: verifyOtpData });

    // Set httpOnly cookie for MFA authentication
    response.cookies.set('mfa-auth', JSON.stringify(verifyOtpData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Failed to verify MFA:', error);
    return NextResponse.json({ error: 'Failed to verify MFA' }, { status: 500 });
  }
} 