"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSIWS } from "@/hooks/useSIWS";
import { useState, useEffect } from "react";
import { isMobile, detectMobileWallet, openPhantomDeepLink } from "@/lib/wallet-utils";

export default function WalletConnectButton() {
  const { connected, publicKey, connecting, wallet, disconnect } = useWallet();
  const {
    isAuthenticated,
    isLoading,
    authenticate,
    logout,
    checkPersistedAuth,
  } = useSIWS();
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (connected) {
      checkPersistedAuth();
      setConnectionError(null);
    }
  }, [connected, checkPersistedAuth]);

  // Handle connection timeout/failure
  useEffect(() => {
    if (connecting) {
      setConnectionError(null);
      
      // Set a timeout for connection attempts
      const timer = setTimeout(() => {
        if (connecting && !connected) {
          setConnectionError("Connection timed out. The wallet may not be installed.");
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timer);
    }
  }, [connecting, connected]);

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

  const handleResetConnection = async () => {
    try {
      setConnectionError(null);
      await disconnect();
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  const handleWalletSelection = () => {
    // Reset any previous errors
    setConnectionError(null);
    
    // On mobile, check if any wallet is detected
    if (isMobile()) {
      const detectedWallet = detectMobileWallet();
      if (!detectedWallet) {
        console.log("No mobile wallet detected");
      }
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

  // Show connecting state with option to cancel
  if (connecting) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15C0B9]"></div>
          <span className="text-white">
            Connecting to {wallet?.adapter.name || "wallet"}...
          </span>
        </div>
        <button
          onClick={handleResetConnection}
          className="text-sm bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 cursor-pointer backdrop-blur-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  // Show connection error with reset option
  if (connectionError) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 max-w-xs">
        <div className="text-red-400 text-sm text-center">{connectionError}</div>
        <div className="flex space-x-2">
          <button
            onClick={handleResetConnection}
            className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 cursor-pointer backdrop-blur-sm"
          >
            Try Again
          </button>
          {isMobile() && (
            <button
              onClick={() => openPhantomDeepLink()}
              className="text-sm bg-[#15C0B9]/20 hover:bg-[#15C0B9]/30 border border-[#15C0B9]/30 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              Get Phantom
            </button>
          )}
        </div>
      </div>
    );
  }

  // If wallet is connected but not authenticated
  if (connected && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={handleSignIn}
          className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-md shadow-2xl transform transition-all duration-300 hover:scale-101 cursor-pointer"
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
        <div className="flex backdrop-blur-md rounded-md shadow-2xl overflow-hidden transform transition-all duration-300">
          {/* Left section - Wallet icon */}
          <div className="bg-white/5 p-3 flex items-center justify-center border border-white/20 rounded-md">
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
            className="flex-1 px-4 py-3 flex items-center justify-between text-[#E6F0F0] hover:text-[#15C0B9]  font-medium transition-all duration-200 cursor-pointer"
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
          <div className="absolute top-full mt-2 right-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-2xl p-4 min-w-[280px] z-50">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-white/80">
                  Address
                </label>
                <div className="bg-white/5 rounded-md p-2 mt-1 border border-white/10">
                  <code className="text-sm font-mono text-white break-all">
                    {publicKey.toString()}
                  </code>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSignOut}
                  className="text-sm flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 cursor-pointer backdrop-blur-sm"
                >
                  Sign Out
                </button>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(publicKey.toString())
                  }
                  className="text-sm flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 cursor-pointer backdrop-blur-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If wallet is not connected - show wallet adapter button with enhanced mobile handling
  return (
    <div className="wallet-adapter-button-container">
      <WalletMultiButton 
        className="!text-white !py-3 !px-6 !shadow-2xl" 
        onClick={handleWalletSelection}
      />
    </div>
  );
}
