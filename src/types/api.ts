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