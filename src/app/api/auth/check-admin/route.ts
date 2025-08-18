import { NextRequest, NextResponse } from 'next/server';
import { validateAuthentication } from '@/lib/server-auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Use shared authentication validation logic
    const { isFullyAuthenticated, isAdmin } = validateAuthentication(request);

    // Return authentication and admin status
    return NextResponse.json({
      isAuthenticated: isFullyAuthenticated,
      isAdmin: isAdmin && isFullyAuthenticated, // Must be both authenticated AND admin
    });

  } catch (error) {
    console.error('Failed to check admin status:', error);
    return NextResponse.json({ 
      isAuthenticated: false, 
      isAdmin: false,
      error: 'Failed to check admin status' 
    }, { status: 500 });
  }
}
