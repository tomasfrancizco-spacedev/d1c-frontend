import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  "/",
  "/api",
];

const MFA_PATHS = [
  "/auth/mfa/request",
  "/auth/mfa/verify",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths (landing page, API routes)
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Get authentication state from cookies
  const walletAuth = req.cookies.get('siws-auth')?.value;
  const mfaAuth = req.cookies.get('mfa-auth')?.value;

  let isWalletAuthenticated = false;
  let isMfaAuthenticated = false;

  // Check wallet authentication
  if (walletAuth) {
    try {
      const authData = JSON.parse(walletAuth);
      const isExpired = Date.now() - authData.timestamp > 24 * 60 * 60 * 1000; // 24 hours
      isWalletAuthenticated = !isExpired && authData.publicKey;
    } catch (error) {
      console.error('Failed to parse wallet auth cookie:', error);
    }
  }

  // Check MFA authentication
  if (mfaAuth) {
    try {
      const mfaData = JSON.parse(mfaAuth);
      const isExpired = Date.now() - mfaData.timestamp > 24 * 60 * 60 * 1000; // 24 hours
      isMfaAuthenticated = !isExpired && mfaData.success;
    } catch (error) {
      console.error('Failed to parse MFA auth cookie:', error);
    }
  }

  // Handle MFA paths specifically
  if (MFA_PATHS.includes(pathname)) {
    // If not wallet authenticated, redirect to landing page
    if (!isWalletAuthenticated) {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
    // If wallet authenticated but already MFA authenticated, redirect to dashboard
    if (isMfaAuthenticated) {
      const url = new URL("/dashboard", req.url);
      return NextResponse.redirect(url);
    }
    // Allow access to MFA pages if wallet authenticated but MFA not complete
    return NextResponse.next();
  }

  // For all other protected routes
  if (!isWalletAuthenticated) {
    // No wallet authentication, redirect to landing page
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  if (!isMfaAuthenticated) {
    // Wallet authenticated but no MFA, redirect to MFA request
    const url = new URL("/auth/mfa/request", req.url);
    return NextResponse.redirect(url);
  }

  // Both wallet and MFA authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|divisionlogo2.png).*)"],
};


// Check if user is logged in
// const isAuthenticated = () => {
//   const token = localStorage.getItem('authToken');
//   if (!token) return false;
  
//   // Optional: Check if token is expired
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// // Redirect logic
// if (isAuthenticated()) {
//   // Show dashboard/authenticated content
//   showDashboard();
// } else {
//   // Redirect to login
//   showLoginForm();
// }

// const logout = () => {
//   localStorage.removeItem('authToken');
//   // Redirect to login page
//   window.location.href = '/login';
// };