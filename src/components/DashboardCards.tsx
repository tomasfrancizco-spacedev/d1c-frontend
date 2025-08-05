"use client";

import { useState } from "react";
import { formatBalance } from "@/lib/api";

interface DashboardCardsProps {
  totalContributionAmount: string;
  usdAmount: string;
  d1cBalance: string;
  tradingVolume: string;
  isLoadingBalance?: boolean;
  isLoadingContributions?: boolean;
  isLoadingTradingVolume?: boolean;
}

export default function DashboardCards({ totalContributionAmount, usdAmount, d1cBalance, tradingVolume, isLoadingBalance = false, isLoadingContributions = false, isLoadingTradingVolume = false }: DashboardCardsProps) {
  const [currentCard, setCurrentCard] = useState(0);

  const cards = [
    {
      title: "My Balance",
      value: d1cBalance,
      isLoading: isLoadingBalance,
      icon: (
        <svg className="w-5 h-5 text-[#15C0B9] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "My Contributions", 
      value: totalContributionAmount,
      isLoading: isLoadingContributions,
      icon: (
        <svg className="w-5 h-5 text-[#15C0B9] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: "Trading Volume",
      value: tradingVolume, 
      isLoading: isLoadingTradingVolume,
      icon: (
        <svg className="w-5 h-5 text-[#15C0B9] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const renderCard = (card: typeof cards[0]) => (
    <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-md p-6 hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300 shadow-2xl before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none min-h-[200px] mx-auto max-w-sm">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#E6F0F0] drop-shadow-sm">
            {card.title}
          </h3>
          <div className="w-10 h-10 bg-gradient-to-br from-[#15C0B9]/30 to-[#15C0B9]/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#15C0B9]/20">
            {card.icon}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold text-[#15C0B9] drop-shadow-md truncate">{card.value}</div>
            {card.isLoading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15C0B9]"></div>
            )}
          </div>
          
          <div className="pt-2">
            <button className="text-[#15C0B9] hover:text-[#E6F0F0] text-sm font-medium transition-colors duration-200 drop-shadow-sm">
              {usdAmount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Mobile Carousel with Arrows */}
      <div className="md:hidden">
        <div className="relative px-6">
          {/* Current Card */}
          <div className="transition-all duration-300 ease-in-out">
            {renderCard(cards[currentCard])}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevCard}
            className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 shadow-lg"
            disabled={cards.length <= 1}
          >
            <svg className="w-5 h-5 text-[#15C0B9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextCard}
            className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 shadow-lg"
            disabled={cards.length <= 1}
          >
            <svg className="w-5 h-5 text-[#15C0B9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-4 gap-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCard(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentCard 
                  ? 'bg-[#15C0B9] w-4' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        
        {/* My Balance Card */}
        <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-md p-6 hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300 shadow-2xl before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none min-h-[200px]">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#E6F0F0] drop-shadow-sm">
                My Balance
              </h3>
              <div className="w-10 h-10 bg-gradient-to-br from-[#15C0B9]/30 to-[#15C0B9]/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#15C0B9]/20">
                <svg className="w-5 h-5 text-[#15C0B9] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-[#15C0B9] drop-shadow-md truncate">{d1cBalance}</div>
                {isLoadingBalance && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15C0B9]"></div>
                )}
              </div>
              
              <div className="pt-2">
                <button className="text-[#15C0B9] hover:text-[#E6F0F0] text-sm font-medium transition-colors duration-200 drop-shadow-sm">
                  {usdAmount}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* My Contributions Card */}
        <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-md p-6 hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300 shadow-2xl before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none min-h-[200px]">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#E6F0F0] drop-shadow-sm">
                My Contributions
              </h3>
              <div className="w-10 h-10 bg-gradient-to-br from-[#15C0B9]/30 to-[#15C0B9]/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#15C0B9]/20">
                <svg className="w-5 h-5 text-[#15C0B9] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-[#15C0B9] drop-shadow-md truncate">{totalContributionAmount}</div>
                {isLoadingContributions && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15C0B9]"></div>
                )}
              </div>
              
              <div className="pt-2">
                <button className="text-[#15C0B9] hover:text-[#E6F0F0] text-sm font-medium transition-colors duration-200 drop-shadow-sm">
                  {usdAmount}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Volume Card */}
        <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-md p-6 hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300 shadow-2xl before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none min-h-[200px]">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#E6F0F0] drop-shadow-sm">
                Trading Volume
              </h3>
              <div className="w-10 h-10 bg-gradient-to-br from-[#15C0B9]/30 to-[#15C0B9]/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#15C0B9]/20">
                <svg className="w-5 h-5 text-[#15C0B9] drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-[#15C0B9] drop-shadow-md truncate">{tradingVolume}</div>
                {isLoadingTradingVolume && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15C0B9]"></div>
                )}
              </div>
              <div className="pt-2">
                <button className="text-[#15C0B9] hover:text-[#E6F0F0] text-sm font-medium transition-colors duration-200 drop-shadow-sm">
                  {usdAmount}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 