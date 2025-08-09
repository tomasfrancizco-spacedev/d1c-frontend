import { SolanaSignInInput } from '@solana/wallet-standard-features';
import { verifySignIn } from '@solana/wallet-standard-util';

export interface SIWSMessage {
  domain: string;
  address: string;
  statement?: string;
  uri?: string;
  version: string;
  chainId?: string;
  nonce: string;
  issuedAt: string;
  expirationTime?: string;
  notBefore?: string;
  requestId?: string;
  resources?: string[];
}

export function createSignInData(): SolanaSignInInput {
  const now = new Date();
  const expirationTime = new Date(now.getTime() + 60000 * 10); // 10 minutes

  return {
    domain: window.location.host,
    statement: 'Sign in to D1C with your Solana wallet.',
    uri: window.location.origin,
    version: '1',
    nonce: generateNonce(),
    chainId: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
    issuedAt: now.toISOString(),
    expirationTime: expirationTime.toISOString(),
  };
}

export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function createSIWSMessage(input: SolanaSignInInput, address: string): string {
  const { domain, statement, version, chainId, nonce, issuedAt, expirationTime } = input;
  
  let message = `${domain} wants you to sign in with your Solana account:\n`;
  message += `${address}`;
  
  if (statement) {
    message += `\n\n${statement}`;
  }
  
  message += `\n\nURI: ${input.uri || window.location.origin}`;
  message += `\nVersion: ${version}`;
  
  if (chainId) {
    message += `\nChain ID: ${chainId}`;
  }
  
  message += `\nNonce: ${nonce}`;
  message += `\nIssued At: ${issuedAt}`;
  
  if (expirationTime) {
    message += `\nExpiration Time: ${expirationTime}`;
  }
  
  return message;
}

export async function verifySIWSMessage(input: SolanaSignInInput, output: any) {
  try {
    const result = await verifySignIn(input, output);
    return result;
  } catch (error) {
    console.error('Failed to verify SIWS message:', error);
    return false;
  }
}