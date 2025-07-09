"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSIWS } from '@/hooks/useSIWS';
import { useState, useEffect } from 'react';

export default function WalletConnectButton() {
  const { connected, publicKey } = useWallet();
  const { isAuthenticated, isLoading, authenticate, logout, checkPersistedAuth } = useSIWS();
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  useEffect(() => {
    if (connected) {
      checkPersistedAuth();
    }
  }, [connected, checkPersistedAuth]);

  const handleSignIn = async () => {
    try {
      await authenticate();
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setShowWalletInfo(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15C0B9]"></div>
      </div>
    );
  }

  // If wallet is connected but not authenticated
  if (connected && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center space-x-3">
        <span className="text-[#E6F0F0] text-sm">Wallet Connected</span>
        <button
          onClick={handleSignIn}
          className="bg-[#15C0B9] hover:bg-[#13A8A1] text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition duration-200 hover:scale-105 flex items-center space-x-3 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
          </svg>
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  // If wallet is connected and authenticated
  if (connected && isAuthenticated && publicKey) {
    return (
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => setShowWalletInfo(!showWalletInfo)}
          className="bg-[#15C0B9] hover:bg-[#13A8A1] text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition duration-200 hover:scale-105 flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span>{truncateAddress(publicKey.toString())}</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${showWalletInfo ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showWalletInfo && (
          <div className="absolute top-full mt-2 right-0 bg-[#E6F0F0] dark:bg-[#19181C] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 min-w-[280px] z-50">
            {/* <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#15C0B9] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#19181C] dark:text-[#E6F0F0]">Phantom Wallet</h3>
                <p className="text-sm text-green-600 dark:text-green-400">Authenticated</p>
              </div>
            </div> */}

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-[#19181C] dark:text-[#E6F0F0]">Address</label>
                <div className="bg-gray-100 dark:bg-[#19181C] rounded-lg p-2 mt-1 border dark:border-gray-600">
                  <code className="text-sm font-mono text-[#19181C] dark:text-[#E6F0F0] break-all">
                    {publicKey.toString()}
                  </code>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSignOut}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(publicKey.toString())}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
                >
                  Copy Address
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If wallet is not connected - show wallet adapter button
  return (
    <div className="wallet-adapter-button-container">
      <WalletMultiButton className="!bg-[#15C0B9] hover:!bg-[#13A8A1] !text-white !font-bold !py-3 !px-6 !rounded-xl !shadow-lg !transform !transition !duration-200 hover:!scale-105" />
      <style jsx global>{`
        .wallet-adapter-button-trigger {
          background-color: #15C0B9 !important;
        }
        .wallet-adapter-button:not([disabled]):hover {
          background-color: #13A8A1 !important;
        }
        .wallet-adapter-button {
          display: flex !important;
          align-items: center !important;
          gap: 0.75rem !important;
        }
      `}</style>
    </div>
  );
} 