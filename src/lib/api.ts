import { D1CBalanceResponse, ContributionsResponse, UserContribution, TradingVolumeResponse, TradingVolumeData, LeaderboardResponse, UserData, CollegeData, CollegesData } from '@/types/api';
import { BACKEND_API_URLS, FRONTEND_API_URLS } from '@/lib/constants';

const getFrontendApiUrl = (env: string) => {
  switch (env) {
    case 'production':
      return FRONTEND_API_URLS.PRODUCTION;
    case 'test':
      return FRONTEND_API_URLS.STAGING;
    case 'development':
    default:
      return FRONTEND_API_URLS.DEVELOPMENT;
  }
};

const getBackendApiUrl = (env: string) => {
  switch (env) {
    case 'production':
      return BACKEND_API_URLS.PRODUCTION;
    case 'test':
      return BACKEND_API_URLS.STAGING;
    case 'development':
    default:
      return BACKEND_API_URLS.DEVELOPMENT;
  }
};

export const BACKEND_API_BASE_URL = getBackendApiUrl(process.env.NODE_ENV || 'development');
export const FRONTEND_API_BASE_URL = getFrontendApiUrl(process.env.NODE_ENV || 'development');

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const url = `${FRONTEND_API_BASE_URL}/api${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Check if response has content
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentLength === '0' || !contentType?.includes('application/json')) {
      data = null;
    } else {
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        return { error: 'Invalid JSON response from server' };
      }
    }

    if (!response.ok) {
      const errorMessage = data?.error || `HTTP ${response.status}`;
      return { error: errorMessage };
    }

    return { data: data as T };
  } catch (error) {
    console.error('API call failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function fetchTokenBalance(
  userAddress: string
): Promise<{ data?: D1CBalanceResponse; error?: string }> {
  if (!userAddress) {
    return { error: 'User address is required' };
  }

  const endpoint = `/helius/token-balance?userAddress=${encodeURIComponent(userAddress)}`;
  return apiCall<D1CBalanceResponse>(endpoint);
}

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

export async function fetchUserData(
  userAddress: string
): Promise<{ data?: UserData; error?: string }> {
  if (!userAddress) {
    return { error: 'User address is required' };
  }

  try {
    const endpoint = `/user-data?userAddress=${encodeURIComponent(userAddress)}`;
    return apiCall<UserData>(endpoint);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function fetchUserContributions(
  userAddress: string
): Promise<{ data?: ContributionsResponse; error?: string }> {
  if (!userAddress) {
    return { error: 'User address is required' };
  }

  try {
    const endpoint = `/user-contributions?userAddress=${encodeURIComponent(userAddress)}`;
    return apiCall<ContributionsResponse>(endpoint);
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export const getLinkedCollegeContributions = (contributionsData: UserContribution[], linkedCollege: CollegeData) => {
  const contributions = contributionsData.find(
    (contribution) =>
      contribution.linkedCollege?.id === linkedCollege?.id
  )?.contributions;
  return contributions ? contributions : 0;
};

export async function fetchTradingVolume(): Promise<{ data?: TradingVolumeResponse; error?: string }> {
  try {
    const endpoint = `/trading-volume`;
    return apiCall<TradingVolumeResponse>(endpoint);
  } catch (error) {
    console.error('Error fetching trading volume:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export function getTradingVolumeAmount(volumeData: TradingVolumeData): string {
  if (!volumeData) {
    return formatBalance(0);
  }

  return volumeData.totalVolume.toString() || formatBalance(0);
}

export async function fetchCollegeLeaderboard(): Promise<{ data?: LeaderboardResponse; error?: string }> {
  try {
    const endpoint = `/college-leaderboard`;
    return apiCall<LeaderboardResponse>(endpoint);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 

export async function fetchUserLeaderboard(): Promise<{ data?: LeaderboardResponse; error?: string }> {
  try {
    const endpoint = `/user-leaderboard`;
    return apiCall<LeaderboardResponse>(endpoint);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function fetchColleges(): Promise<{ data?: CollegesData; error?: string }> {
  try {
    const endpoint = `/colleges`;
    return apiCall<CollegesData>(endpoint);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function linkCollege(userId: string, collegeId: string): Promise<{ data?: UserData; error?: string }> {
  try {
    const endpoint = `/link-college?userId=${userId}&collegeId=${collegeId}`;
    return apiCall<UserData>(endpoint, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error linking college:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}