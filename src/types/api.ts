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

export interface AdminData {
  id: number;
  walletAddress: string;
  lastLogin: string;
  currentLinkedCollege: {
    name: string;
  }
}

export interface AdminsResponse {
  success: boolean;
  data: AdminData[];
}

export interface UserData {
  success: boolean;
  data: {
    id: number;
    walletAddress: string;
    emails: string[];
    currentLinkedCollege: {
      id: number;
      name: string;
      commonName: string;
      nickname: string;
      city: string;
      state: string;
      type: string;
      subdivision: string;
      primary: string;
      walletAddress: string;
      logo: string;
    };
  };
}

export interface CollegeData {
  id: number;
  name: string;
  commonName: string;
  nickname: string;
  city: string;
  state: string;
  type: string;
  subdivision: string;
  primary: string;
  walletAddress: string;
  logo: string;
}

export interface CollegesData {
  data: {
    data: CollegeData[];
  }
}

export interface UserContribution {
  contributions: number;
  totalContributions: number;
  linkedCollege: {
    id: number;
    name: string;
    commonName: string;
    nickname: string;
    city: string;
    state: string;
    type: string;
    subdivision: string;
    primary: string;
    walletAddress: string;
    logo: string;
  };

}

export interface ContributionsResponse {
  success: boolean;
  data: UserContribution[];
}

export interface TradingVolumeData {
  totalVolume: number;
}

export interface TradingVolumeResponse {
  success: boolean;
  data: TradingVolumeData;
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

export interface D1CWallet {
  id: number;
  walletType: string;
  walletAddress: string;
  fee_exempt: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface D1CWalletsResponse {
  success: boolean;
  data: D1CWallet[];
}

export interface FeeJobLog {
  id: number;
  executedAt: string;
  success: boolean;
  harvestedAmount: string;
  distributedAmount: string;
  burnedAmount: string;
  errorMessage: string | null;
  createdAt: string;
}

export interface FeeJobLogsResponse {
  success: boolean;
  data: FeeJobLog[];
}

export interface TotalFeesResponse {
  success: boolean;
  data: {
    totalFees: number;
  };
}

export interface TransactionCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export interface HarvestResult {
  success: boolean;
  transactionsProcessed: number;
  totalFeesHarvested: number;
  errors: string[];
}

export interface DistributionResult {
  success: boolean;
  transactionsProcessed: number;
  opsAmount: number;
  collegeAmount: number;
  burnedAmount: number;
  errors: string[];
  signatures: string[];
}

export interface AutomatedProcessingResponse {
  success: boolean;
  data: {
    harvestResult: HarvestResult;
    distributionResult: DistributionResult;
  };
}