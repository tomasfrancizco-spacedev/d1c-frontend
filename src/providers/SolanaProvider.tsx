"use client";

import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { isInMobileWalletBrowser } from "@/lib/wallet-utils";
import { isMobile } from "@/lib/wallet-utils";

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  const network = process.env.NODE_ENV === 'production' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Configure wallets for both desktop and mobile
  const wallets = useMemo(() => {
    const walletList = [
      new PhantomWalletAdapter(),
    ];
    
    // On mobile, only show wallets that are actually available
    if (typeof window !== 'undefined' && isMobile()) {
      return walletList.filter(wallet => {
        // Only show wallet if it's detected or we're in its browser
        const name = wallet.name.toLowerCase();
        return (
          (window as any).phantom?.solana && name.includes('phantom') ||
          !isInMobileWalletBrowser() // Show all if not in any wallet browser
        );
      });
    }
    
    return walletList;
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};