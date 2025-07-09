"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSIWS } from "@/hooks/useSIWS";
import { useState, useEffect } from "react";

export default function WalletConnectButton() {
  const { connected, publicKey } = useWallet();
  const {
    isAuthenticated,
    isLoading,
    authenticate,
    logout,
    checkPersistedAuth,
  } = useSIWS();
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
      console.error("Sign in failed:", error);
      alert("Sign in failed. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setShowWalletInfo(false);
    } catch (error) {
      console.error("Sign out failed:", error);
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
      <div className="flex items-center justify-center">
        <button
          onClick={handleSignIn}
          className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-101 cursor-pointer"
        >
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  // If wallet is connected and authenticated
  if (connected && isAuthenticated && publicKey) {
    return (
      <div className="relative flex items-center justify-center">
        <div className="flex backdrop-blur-md rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-101">
          {/* Left section - Wallet icon */}
          <div className="bg-white/5 p-3 flex items-center justify-center border border-white/20 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M17 14h.01" />
              <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14" />
            </svg>
          </div>
          
          {/* Right section - Address and dropdown */}
          <button
            onClick={() => setShowWalletInfo(!showWalletInfo)}
            className="flex-1 px-4 py-3 flex items-center justify-between text-white font-medium transition-all duration-200 cursor-pointer"
          >
            <span className="text-sm">{truncateAddress(publicKey.toString())}</span>
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${
                showWalletInfo ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {showWalletInfo && (
          <div className="absolute top-full mt-2 right-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl p-4 min-w-[280px] z-50">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-white/80">
                  Address
                </label>
                <div className="bg-white/5 rounded-lg p-2 mt-1 border border-white/10">
                  <code className="text-sm font-mono text-white break-all">
                    {publicKey.toString()}
                  </code>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSignOut}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
                >
                  Sign Out
                </button>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(publicKey.toString())
                  }
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
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
      <WalletMultiButton className="!text-white !py-3 !px-6 !shadow-2xl" />
    </div>
  );
}
