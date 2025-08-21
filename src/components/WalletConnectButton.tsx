"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSIWS } from "@/hooks/useSIWS";
import { useState, useEffect } from "react";
import {
  isMobile,
  detectMobileWallet,
  openPhantomDeepLink,
  getMobileWalletAdapter,
  isInMobileWalletBrowser,
  openWalletInAppBrowser,
} from "@/lib/wallet-utils";
import Link from "next/link";
import { checkFullAuth } from "@/lib/auth-utils";

export default function WalletConnectButton({
  setIsSelectSchoolModalOpen,
}: {
  setIsSelectSchoolModalOpen: (isOpen: boolean) => void;
}) {
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

  const isWalletBrowser = isInMobileWalletBrowser();
  const detectedMobileWallet = getMobileWalletAdapter();
  const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);

  const [showConnectMobileWalletInfo, setShowConnectMobileWalletInfo] =
    useState(false);

  useEffect(() => {
    setIsFullyAuthenticated(checkFullAuth(connected, isAuthenticated) || false);
  }, [connected, isAuthenticated]);

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
          setConnectionError(
            "Connection timed out. The wallet may not be installed."
          );
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timer);
    }
  }, [connecting, connected]);

  const handleSignIn = async () => {
    try {
      await authenticate();
    } catch (error) {
      alert(`Sign in failed. ${error}`);
      //remove wallet from local storage
      localStorage.removeItem("walletName");
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

  const handleShowConnectMobileWalletInfo = () => {
    setShowConnectMobileWalletInfo(true);
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
        <div className="text-red-400 text-sm text-center">
          {connectionError}
        </div>
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
            <span className="text-sm">
              {truncateAddress(publicKey.toString())}
            </span>
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
          <div className="absolute top-full mt-2 right-0 bg-[#03211e] backdrop-blur-md border border-white/20 rounded-md shadow-2xl p-4 min-w-[280px] z-50">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-white/80">
                  Address
                </label>

                <div className="bg-white/5 rounded-md p-2 mt-1 border border-white/10">
                  <Link
                    href={`https://solscan.io/address/${publicKey.toString()}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    <code className="text-sm font-mono text-white break-all">
                      {publicKey.toString()}
                    </code>
                  </Link>
                </div>
              </div>

              <div className="flex space-x-2">
                {isFullyAuthenticated && (
                  <button
                    onClick={() => {
                      setIsSelectSchoolModalOpen(true);
                      setShowWalletInfo(false);
                    }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-left text-white font-medium py-3 px-6 rounded-md shadow-2xl transform transition-all duration-300 cursor-pointer flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m-3 0h-5m2-5h9m-9 0v-5"
                      />
                    </svg>
                    Select School
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-sm flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 cursor-pointer backdrop-blur-sm flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!connected && isMobile()) {
    // If we're in a wallet browser and wallet is detected, show success state
    if (isWalletBrowser && detectedMobileWallet) {
      return (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                You&apos;re in {detectedMobileWallet} app
              </span>
            </div>
            <p className="text-sm text-white/70">
              Connect your wallet to continue
            </p>
          </div>

          <div className="wallet-adapter-button-container">
            <WalletMultiButton className="!text-white !py-3 !px-6 !shadow-2xl !w-full" />
          </div>
        </div>
      );
    }

    // We're in a regular mobile browser - guide user to wallet app
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={handleShowConnectMobileWalletInfo}
          className={`${
            showConnectMobileWalletInfo
              ? "hidden"
              : "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-md shadow-2xl transform transition-all duration-300 hover:scale-101 cursor-pointer"
          }`}
        >
          Connect your wallet
        </button>
        {showConnectMobileWalletInfo && (
          <div className="space-y-4 max-w-sm">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">For best experience</span>
              </div>
              <p className="text-sm text-white/70 mb-3">
                Tap the button below to open this page in your wallet app
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => openWalletInAppBrowser("phantom")}
                className="w-full bg-[#9945FF] hover:bg-[#7C3AED] text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#9945FF] text-sm font-bold">P</span>
                </div>
                <div className="flex flex-col items-start">
                  <span>Open in Phantom</span>
                </div>
              </button>
            </div>

            <div className="border-t border-white/10 pt-4"></div>
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
