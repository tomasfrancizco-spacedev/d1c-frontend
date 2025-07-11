"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DashboardCards from "@/components/DashboardCards";
import Image from "next/image";
import { topContributors } from "@/data/topContributors_mock";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { fetchTokenBalance, formatBalance } from "@/lib/api";
import { D1CBalanceResponse } from "@/types/api";

export default function Dashboard() {
  const { publicKey } = useWallet();
  
  // Balance state management
  const [balanceData, setBalanceData] = useState<D1CBalanceResponse | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Static data (these could also be fetched from APIs in the future)
  const contributionAmount = "345 $D1C";
  const collegeName = "LSU Athletes";
  const usdAmount = "234 USD";
  const tradingVolume = "12345678 $D1C";

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

  // Calculate display values
  const d1cBalance = balanceData 
    ? formatBalance(balanceData.formattedAmount) 
    : isLoadingBalance 
      ? "Loading..." 
      : balanceError 
        ? "Error loading balance"
        : "Connect wallet to view balance";


  const getPositionSuffix = (position: number) => {
    if (position === 1) return "st";
    if (position === 2) return "nd";
    if (position === 3) return "rd";
    return "th";
  };

  return (
    <DefaultLayout>
      <div className="pt-[150px] min-h-screen bg-gradient-to-br from-[#19181C] via-[#1a2024] to-[#19181C]">
        <main className="container mx-auto px-6 py-8 text-[#E6F0F0]">
          
          {/* Header Section */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center justify-center bg-transparent rounded-lg p-6">
              <div className="flex items-center justify-center w-full max-w-4xl space-x-10">
                {/* Logo on the left */}
                <div className="flex items-center gap-3">
                  <Image
                    src="/divisionlogo2.png"
                    alt="College Logo"
                    width={150}
                    height={150}
                    className="rounded-lg"
                  />
                </div>
                
                {/* Contribution text on the right */}
                <div className="text-left">
                  <p className="text-4xl text-[#E6F0F0] flex flex-col">
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
          />

          {/* Top Contributions Section */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-[#E6F0F0] text-center mb-12 drop-shadow-md">
              Top contributions from the community
            </h2>
            
                        {/* Mobile View - Logos + Cards */}
            <div className="md:hidden">
              {/* Horizontal Logos */}
              <div className="flex justify-center items-center gap-8 mb-8">
                {topContributors.slice(0, 3).map((contributor) => (
                  <div key={contributor.position} className="flex items-center justify-center">
                    <Image
                      src={contributor.logo}
                      alt={`${contributor.position}${getPositionSuffix(contributor.position)} Place School Logo`}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {/* Full Width Cards in Column */}
              <div className="space-y-4 max-h-[600px] overflow-y-scroll scrollbar-custom p-2">
                {topContributors.slice(0, 20).map((contributor) => (
                  <div key={contributor.position} className="w-full">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={contributor.logo}
                          alt="School Logo"
                          width={60}
                          height={60}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex items-center gap-3 flex-1 p-3 bg-[#0C3832] rounded-lg">
                        <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
                          <div className="text-sm p-1 min-w-[30px] font-bold text-[#15C0B9] drop-shadow-md text-center">
                            {contributor.position}{getPositionSuffix(contributor.position)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-[#E6F0F0] drop-shadow-sm">
                            {contributor.name}
                          </div>
                          <div className="text-sm font-bold text-[#15C0B9] drop-shadow-md">
                            {contributor.amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View - Top 3 Big Cards + Two Column Layout */}
            <div className="hidden md:block">
              {/* Top 3 - Big Cards */}
              <div className="flex justify-center items-center gap-6 mb-8">
                {topContributors.slice(0, 3).map((contributor) => (
                  <div key={contributor.position} className="p-6 min-h-[250px]">
                    <div className="flex flex-col items-center text-center">
                      {/* School Logo */}
                      <div className="mb-4">
                        <Image
                          src={contributor.logo}
                          alt="School Logo"
                          width={200}
                          height={200}
                          className="rounded-lg"
                        />
                      </div>
                      
                      {/* Position and Details */}
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
                          <div className="text-sm p-2 min-w-[40px] font-bold text-[#15C0B9] drop-shadow-md text-center">
                            {contributor.position}{getPositionSuffix(contributor.position)}
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-lg font-semibold text-[#E6F0F0] drop-shadow-sm">
                            {contributor.name}
                          </div>
                          <div className="text-sm font-bold text-[#15C0B9] drop-shadow-md">
                            {contributor.amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

                              {/* Remaining Contributors - Two Column Layout */}
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-scroll scrollbar-custom">
                {topContributors.slice(3).map((contributor) => (
                  <div key={contributor.position} className="flex items-center gap-4 p-3">
                    <div className="flex-shrink-0">
                      <Image
                        src={contributor.logo}
                        alt="School Logo"
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex items-center gap-3 flex-1 p-3 bg-[#0C3832] rounded-lg">
                      <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2">
                        <div className="text-xs p-1 min-w-[25px] font-bold text-[#15C0B9] drop-shadow-md text-center">
                          {contributor.position}{getPositionSuffix(contributor.position)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#E6F0F0] drop-shadow-sm">
                          {contributor.name}
                        </div>
                        <div className="text-xs font-bold text-[#15C0B9] drop-shadow-md">
                          {contributor.amount}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </DefaultLayout>
  );
}