import { NextRequest } from 'next/server';

export interface AuthValidationResult {
  isWalletAuthenticated: boolean;
  isMfaAuthenticated: boolean;
  isAdmin: boolean;
  isFullyAuthenticated: boolean;
}

export interface AuthCookies {
  walletAuth: string | null;
  mfaAuth: string | null;
  isAdminCookie: string | null;
}

/**
 * Extract authentication cookies from request
 */
export function getAuthCookies(req: NextRequest): AuthCookies {
  return {
    walletAuth: req.cookies.get('siws-auth')?.value ?? null,
    mfaAuth: req.cookies.get('accessToken')?.value ?? null,
    isAdminCookie: req.cookies.get('isAdmin')?.value ?? null,
  };
}

/**
 * Validate wallet authentication from cookie
 */
export function validateWalletAuth(walletAuth: string | null): boolean {
  if (!walletAuth) return false;
  
  try {
    const parsed = JSON.parse(walletAuth) as { publicKey?: string; timestamp?: number };
    const maxAgeMs = 24 * 60 * 60 * 1000; // 24h
    const notExpired = typeof parsed.timestamp === 'number' && (Date.now() - parsed.timestamp) < maxAgeMs;
    return Boolean(parsed.publicKey) && notExpired;
  } catch {
    return false;
  }
}

/**
 * Validate MFA authentication from access token
 */
export function validateMfaAuth(mfaAuth: string | null, isWalletAuthenticated: boolean): boolean {
  if (!mfaAuth || !isWalletAuthenticated) return false;
  
  try {
    // Lazy decode to read `exp` without verifying signature (works fine for gating UI routes).
    // If you want signature verification on the edge, switch to `jose` and jwtVerify.
    const payload = JSON.parse(
      Buffer.from(mfaAuth.split('.')[1] ?? '', 'base64').toString('utf8')
    ) as { exp?: number } | null;
    return !!(payload?.exp && payload.exp * 1000 > Date.now());
  } catch {
    return false;
  }
}

/**
 * Check if user has admin privileges
 */
export function validateAdminStatus(isAdminCookie: string | null): boolean {
  return isAdminCookie === 'true';
}

/**
 * Complete authentication validation
 */
export function validateAuthentication(req: NextRequest): AuthValidationResult {
  const cookies = getAuthCookies(req);
  
  const isWalletAuthenticated = validateWalletAuth(cookies.walletAuth);
  const isMfaAuthenticated = validateMfaAuth(cookies.mfaAuth, isWalletAuthenticated);
  const isAdmin = validateAdminStatus(cookies.isAdminCookie);
  const isFullyAuthenticated = isWalletAuthenticated && isMfaAuthenticated;

  return {
    isWalletAuthenticated,
    isMfaAuthenticated,
    isAdmin,
    isFullyAuthenticated,
  };
}
