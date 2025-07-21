import { D1CBalanceResponse, ApiError, ContributionsResponse, UserContribution, TradingVolumeResponse, TradingVolumeData, LeaderboardResponse } from '@/types/api';
import { userContributions } from '@/data/userContributions_mock';
import { tradingVolume } from '@/data/tradingVolume_mock';
import { topContributors } from '@/data/leaderboard_mock';
import { BACKEND_API_URLS } from '@/lib/constants';

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.NODE_ENV === 'development' ? BACKEND_API_URLS.DEVELOPMENT : (process.env.NODE_ENV === 'test' ? BACKEND_API_URLS.STAGING : BACKEND_API_URLS.PRODUCTION);

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

/**
 * Fetch user contributions
 * Currently returns mock data - will be switched to API call later
 */
export async function fetchUserContributions(
  userAddress: string
): Promise<{ data?: ContributionsResponse; error?: string }> {
  if (!userAddress) {
    return { error: 'User address is required' };
  }

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // TODO: Replace with actual API call when ready
    // const endpoint = `/contributions?userAddress=${encodeURIComponent(userAddress)}`;
    // return apiCall<ContributionsResponse>(endpoint);
    
    // For now, return mock data
    return {
      data: {
        success: true,
        data: userContributions
      }
    };
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Calculate total contribution amount from user contributions
 */
export function calculateTotalContribution(contributions: UserContribution[]): string {
  if (!contributions || contributions.length === 0) {
    return formatBalance(0);
  }

  const total = contributions.reduce((sum, contribution) => {
    // Extract numeric value from amount string (e.g., "2,450 $D1C" -> 2450)
    const numericValue = parseFloat(contribution.amount.replace(/[,$D1C\s]/g, ''));
    return sum + (isNaN(numericValue) ? 0 : numericValue);
  }, 0);

  return formatBalance(total);
}

/**
 * Fetch trading volume data
 * Currently returns mock data - will be switched to API call later
 */
export async function fetchTradingVolume(): Promise<{ data?: TradingVolumeResponse; error?: string }> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // TODO: Replace with actual API call when ready
    // const endpoint = `/trading-volume`;
    // return apiCall<TradingVolumeResponse>(endpoint);
    
    // For now, return mock data
    return {
      data: {
        success: true,
        data: tradingVolume
      }
    };
  } catch (error) {
    console.error('Error fetching trading volume:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get trading volume amount from trading volume data
 */
export function getTradingVolumeAmount(volumeData: TradingVolumeData[]): string {
  if (!volumeData || volumeData.length === 0) {
    return formatBalance(0);
  }

  // Return the first trading volume amount
  return volumeData[0]?.amount || formatBalance(0);
}

/**
 * Fetch leaderboard data
 * Currently returns mock data - will be switched to API call later
 */
export async function fetchLeaderboard(): Promise<{ data?: LeaderboardResponse; error?: string }> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // TODO: Replace with actual API call when ready
    // const endpoint = `/leaderboard`;
    // return apiCall<LeaderboardResponse>(endpoint);
    
    // For now, return mock data
    return {
      data: {
        success: true,
        data: topContributors
      }
    };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 