import { PublicKey } from '@solana/web3.js';
import { D1C_TOKEN, PROGRAM_IDS } from '@/lib/constants';

export function getD1CAssociatedTokenAddress(ownerAddress: string): PublicKey {
  const owner = new PublicKey(ownerAddress);
  const mint = new PublicKey(D1C_TOKEN.MINT);

  const [address] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), PROGRAM_IDS.TOKEN_2022.toBuffer(), mint.toBuffer()],
    PROGRAM_IDS.ASSOCIATED_TOKEN
  );

  return address;
}

export function formatD1CAmount(rawAmount: string): number {
  return parseInt(rawAmount) / Math.pow(10, D1C_TOKEN.DECIMALS);
}