import { D1CBalanceResponse, ApiError } from '@/types/api';

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || ''
  : '';

/**
 * Generic API call wrapper with error handling
 */
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const url = `${API_BASE_URL}/api${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiError;
      return { error: errorData.error || `HTTP ${response.status}` };
    }

    return { data: data as T };
  } catch (error) {
    console.error('API call failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Fetch D1C token balance for a specific wallet address
 */
export async function fetchTokenBalance(
  userAddress: string
): Promise<{ data?: D1CBalanceResponse; error?: string }> {
  if (!userAddress) {
    return { error: 'User address is required' };
  }

  const endpoint = `/helius/token-balance?userAddress=${encodeURIComponent(userAddress)}`;
  return apiCall<D1CBalanceResponse>(endpoint);
}

/**
 * Format balance for display with D1C suffix
 */
export function formatBalance(balance: number | string, suffix: string = '$D1C'): string {
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
  
  if (isNaN(numBalance)) return `0 ${suffix}`;
  
  // Format large numbers with commas
  const formatted = numBalance.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return `${formatted} ${suffix}`;
}

/**
 * Format balance in USD (example for future use)
 */
export function formatUsdBalance(balance: number | string): string {
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
  
  if (isNaN(numBalance)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numBalance);
} 