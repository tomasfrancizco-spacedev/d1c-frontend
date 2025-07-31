export interface D1CBalanceResponse {
  success: boolean;
  walletAddress: string;
  tokenAccountAddress: string;
  balance: string;
  decimals: number;
  uiAmount: number;
  formattedAmount: number;
  message?: string;
}

export interface ApiError {
  error: string;
}

export interface UserContribution {
  id: number;
  name: string;
  amount: string;
  logo: string;
}

export interface ContributionsResponse {
  success: boolean;
  data: UserContribution[];
}

export interface TradingVolumeData {
  amount: string;
}

export interface TradingVolumeResponse {
  success: boolean;
  data: TradingVolumeData[];
}

export interface UserLeaderboardEntry {
  rankPosition: number | null;
  totalContributions: string;
  transactionCount: number;
  walletAddress: string;
}

export interface CollegeLeaderboardEntry {
  college: {
    city: string;
    commonName: string;
    id: number;
    name: string;
    nickname: string;
    primary: string;
    state: string;
    subdivision: string;
    type: string;
    logo?: string;
  }
  rankPosition: number | null;
  totalContributionsReceived: string;
  transactionCount: number;
  walletAddress: string;
}

export interface LeaderboardResponse {
  success: boolean;
  data: CollegeLeaderboardEntry[] | UserLeaderboardEntry[];
}