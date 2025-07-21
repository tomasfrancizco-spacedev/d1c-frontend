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

export interface LeaderboardEntry {
  position: number;
  name: string;
  amount: string;
  logo: string;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
}