import { PublicKey } from '@solana/web3.js';

// D1C Token Configuration
export const D1C_TOKEN = {
  MINT: 'F1S2XhTa4c6Br4hstqW6gN7RfkY8hDKzQ6BeT5hjHha8',
  NAME: 'Division One Crypto',
  SYMBOL: 'D1C',
  DECIMALS: 9,
  IS_TOKEN_2022: true,
} as const;

// Solana Program IDs
export const PROGRAM_IDS = {
  TOKEN_2022: new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'),
  ASSOCIATED_TOKEN: new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
} as const;

// Helius URLs
export const HELIUS_URLS = {
  MAINNET: 'https://devnet.helius-rpc.com', // TODO: Change to mainnet URL (https://mainnet.helius-rpc.com)
  TESTNET: 'https://devnet.helius-rpc.com',
} as const;

// Backend API URLs
export const BACKEND_API_URLS = {
  DEVELOPMENT: 'http://localhost:3000',
  STAGING: 'http://ec2-3-134-105-162.us-east-2.compute.amazonaws.com:3000',
  PRODUCTION: 'http://ec2-3-134-105-162.us-east-2.compute.amazonaws.com:3000', // TODO: Change to production URL (TBD)
} as const;

export const FRONTEND_API_URLS = {
  DEVELOPMENT: 'http://localhost:3001',
  STAGING: 'https://staging.d3ieo9817fyven.amplifyapp.com',
  PRODUCTION: 'https://staging.d3ieo9817fyven.amplifyapp.com', // TODO: Change to production URL (TBD)
} as const;