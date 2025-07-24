import { NextRequest, NextResponse } from 'next/server';
import { D1C_TOKEN, HELIUS_URLS } from '@/lib/constants';
import { getD1CAssociatedTokenAddress, formatD1CAmount } from '@/lib/token-utils';
import { D1CBalanceResponse, ApiError } from '@/types/api';

const getHeliusUrl = () => {
  const env = process.env.NODE_ENV;
  if (env === 'development' || env === 'test') {
    return HELIUS_URLS.TESTNET;
  }
  return HELIUS_URLS.MAINNET;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get('userAddress');

  if (!userAddress) {
    return NextResponse.json<ApiError>({
      error: 'userAddress is required'
    }, { status: 400 });
  }

  const heliusBaseUrl = getHeliusUrl();
  const apiKey = process.env.HELIUS_API_KEY;

  if (!apiKey) {
    return NextResponse.json<ApiError>({
      error: 'API key not configured'
    }, { status: 500 });
  }

  console.log('=== HELIUS API DEBUG ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Helius Base URL:', heliusBaseUrl);
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);
  console.log('User Address:', userAddress);

  try {
    // Get the D1C associated token account address
    const ataAddress = getD1CAssociatedTokenAddress(userAddress);

    // Query the D1C balance
    const response = await fetch(`${heliusBaseUrl}/?api-key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '1',
        method: 'getTokenAccountBalance',
        params: [ataAddress.toString()],
      }),
    });

    const data = await response.json();

    if (data.error) {
      // Account doesn't exist = balance is 0
      if (data.error.code === -32602 || data.error.message.includes('could not find account')) {
        return NextResponse.json<D1CBalanceResponse>({
          success: true,
          walletAddress: userAddress,
          tokenAccountAddress: ataAddress.toString(),
          balance: '0',
          decimals: D1C_TOKEN.DECIMALS,
          uiAmount: 0,
          formattedAmount: 0,
          message: 'D1C token account does not exist'
        });
      }
      throw new Error(data.error.message);
    }

    const rawBalance = data.result.value.amount;
    const uiAmount = data.result.value.uiAmount;
    const formattedAmount = formatD1CAmount(rawBalance);

    return NextResponse.json<D1CBalanceResponse>({
      success: true,
      walletAddress: userAddress,
      tokenAccountAddress: ataAddress.toString(),
      balance: rawBalance,
      decimals: data.result.value.decimals,
      uiAmount: uiAmount,
      formattedAmount: formattedAmount,
    });

  } catch (error: any) {
    console.error('Error fetching D1C balance:', error.message);
    return NextResponse.json<ApiError>({
      error: error.message
    }, { status: 500 });
  }
}