"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DashboardCards from "@/components/DashboardCards";
import TopContributions from "@/components/TopContributions";
import Image from "next/image";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { fetchTokenBalance, formatBalance, fetchUserContributions, calculateTotalContribution, fetchTradingVolume, getTradingVolumeAmount } from "@/lib/api";
import { D1CBalanceResponse, UserContribution, TradingVolumeData } from "@/types/api";

export default function Dashboard() {
  const { publicKey } = useWallet();
  
  // Balance state management
  const [balanceData, setBalanceData] = useState<D1CBalanceResponse | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Contributions state management
  const [contributionsData, setContributionsData] = useState<UserContribution[]>([]);
  const [isLoadingContributions, setIsLoadingContributions] = useState(false);
  const [contributionsError, setContributionsError] = useState<string | null>(null);

  // Trading volume state management
  const [tradingVolumeData, setTradingVolumeData] = useState<TradingVolumeData[]>([]);
  const [isLoadingTradingVolume, setIsLoadingTradingVolume] = useState(false);
  const [tradingVolumeError, setTradingVolumeError] = useState<string | null>(null);

  // Static data (these could also be fetched from APIs in the future)
  const collegeName = "Florida Gators";
  const usdAmount = "234 USD";

  // Fetch balance when wallet is connected
  useEffect(() => {
    const loadBalance = async () => {
      if (!publicKey) {
        setBalanceData(null);
        setBalanceError(null);
        return;
      }

      setIsLoadingBalance(true);
      setBalanceError(null);

      try {
        const { data, error } = await fetchTokenBalance(publicKey.toString());
        
        if (error) {
          setBalanceError(error);
          setBalanceData(null);
        } else if (data) {
          setBalanceData(data);
        }
      } catch (err) {
        console.error('Error loading balance:', err);
        setBalanceError('Failed to load balance');
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadBalance();
  }, [publicKey]);

  // Fetch contributions when wallet is connected
  useEffect(() => {
    const loadContributions = async () => {
      if (!publicKey) {
        setContributionsData([]);
        setContributionsError(null);
        return;
      }

      setIsLoadingContributions(true);
      setContributionsError(null);

      try {
        const { data, error } = await fetchUserContributions(publicKey.toString());
        
        if (error) {
          setContributionsError(error);
          setContributionsData([]);
        } else if (data?.success && data.data) {
          setContributionsData(data.data);
        }
      } catch (err) {
        console.error('Error loading contributions:', err);
        setContributionsError('Failed to load contributions');
      } finally {
        setIsLoadingContributions(false);
      }
    };

    loadContributions();
  }, [publicKey]);

  // Fetch trading volume on component mount (not dependent on wallet)
  useEffect(() => {
    const loadTradingVolume = async () => {
      setIsLoadingTradingVolume(true);
      setTradingVolumeError(null);

      try {
        const { data, error } = await fetchTradingVolume();
        
        if (error) {
          setTradingVolumeError(error);
          setTradingVolumeData([]);
        } else if (data?.success && data.data) {
          setTradingVolumeData(data.data);
        }
      } catch (err) {
        console.error('Error loading trading volume:', err);
        setTradingVolumeError('Failed to load trading volume');
      } finally {
        setIsLoadingTradingVolume(false);
      }
    };

    loadTradingVolume();
  }, []);

  // Calculate display values
  const d1cBalance = balanceData 
    ? formatBalance(balanceData.formattedAmount) 
    : isLoadingBalance 
      ? "Loading..." 
      : balanceError 
        ? "Error loading balance"
        : "Connect wallet to view balance";

  const contributionAmount = contributionsData.length > 0
    ? calculateTotalContribution(contributionsData)
    : isLoadingContributions
      ? "Loading..."
      : contributionsError
        ? "Error loading contributions"
        : "Connect wallet to view contributions";

  const tradingVolume = tradingVolumeData.length > 0
    ? getTradingVolumeAmount(tradingVolumeData)
    : isLoadingTradingVolume
      ? "Loading..."
      : tradingVolumeError
        ? "Error loading trading volume"
        : "No trading volume data";

  return (
    <DefaultLayout>
      <div className="pt-[150px] min-h-screen bg-[#03211e]">
        <main className="container mx-auto px-6 py-8 text-[#E6F0F0]">
          
          {/* Header Section */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center justify-center bg-transparent rounded-md p-6">
              <div className="flex items-center justify-center w-full max-w-4xl space-x-10">
                {/* Logo on the left */}
                <div className="flex items-center gap-3">
                  <Image
                    src="/colleges/florida.png"
                    alt="College Logo"
                    width={150}
                    height={150}
                    className="rounded-md"
                  />
                </div>
                
                {/* Contribution text on the right */}
                <div className="text-left">
                  <p className="text-lg md:text-4xl text-[#E6F0F0] flex flex-col">
                    <span className="font-semibold">You&apos;ve contributed </span>
                    
                    
                    <span className="font-bold text-[#15C0B9] my-2 ">{contributionAmount} </span>
                    
                    
                    <span className="font-semibold text-[#E6F0F0]">
                    to {collegeName}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <DashboardCards 
            tradingVolume={tradingVolume}
            d1cBalance={d1cBalance}
            contributionAmount={contributionAmount}
            usdAmount={usdAmount}
            isLoadingBalance={isLoadingBalance}
            isLoadingContributions={isLoadingContributions}
            isLoadingTradingVolume={isLoadingTradingVolume}
          />

          {/* Top Contributions Section */}
          <div className="mt-16">
            <TopContributions />
          </div>

        </main>
      </div>
    </DefaultLayout>
  );
}