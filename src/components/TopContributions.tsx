"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchLeaderboard } from "@/lib/api";
import { LeaderboardEntry } from "@/types/api";

interface TopContributionsProps {
  showTitle?: boolean;
  className?: string;
}

export default function TopContributions({
  showTitle = true,
  className = "",
}: TopContributionsProps) {
  // Leaderboard state management
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  // Fetch leaderboard on component mount
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoadingLeaderboard(true);
      setLeaderboardError(null);

      try {
        const { data, error } = await fetchLeaderboard();

        if (error) {
          setLeaderboardError(error);
          setLeaderboardData([]);
        } else if (data?.success && data.data) {
          setLeaderboardData(data.data);
        }
      } catch (err) {
        console.error("Error loading leaderboard:", err);
        setLeaderboardError("Failed to load leaderboard");
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    loadLeaderboard();
  }, []);

  const getPositionSuffix = (position: number) => {
    if (position === 1) return "st";
    if (position === 2) return "nd";
    if (position === 3) return "rd";
    return "th";
  };

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-center gap-3 mb-12">
          <h3 className="text-2xl md:text-3xl lg:text-4xl text-[#E6F0F0] mb-4">
            Top contributions from the community
          </h3>
          {isLoadingLeaderboard && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15C0B9]"></div>
          )}
        </div>
      )}

      {/* Error State */}
      {leaderboardError ? (
        <div className="text-center text-red-400 p-8">
          <p>Error loading leaderboard: {leaderboardError}</p>
        </div>
      ) : leaderboardData.length > 0 ? (
        <>
          {/* Top 3 Contributors */}
          <div className="mb-12">
            <div className="flex justify-center items-center gap-8 mb-8">
              {leaderboardData.slice(0, 3).map((contributor) => (
                <div
                  key={contributor.position}
                  className="flex flex-col items-center"
                >
                  <div
                    className="relative mb-4 min-w-[120px] min-h-[120px] flex items-center justify-center rounded-full"
                    style={{ backgroundColor: contributor.bg }}
                  >
                    <Image
                      src={contributor.logo}
                      alt={`${contributor.position}${getPositionSuffix(
                        contributor.position
                      )} Place School Logo`}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="bg-white/10 text-white text-sm font-bold rounded-md px-3 py-2 min-w-[40px] h-[40px] flex items-center justify-center">
                        {contributor.position}
                        {getPositionSuffix(contributor.position)}
                      </div>
                      <h4 className="text-lg font-semibold text-[#E6F0F0]">
                        {contributor.name}
                      </h4>
                    </div>
                    <p className="text-[#15C0B9] font-bold">
                      {contributor.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contributors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaderboardData.slice(3, 13).map((contributor) => (
              <div
                key={contributor.position}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300 p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Position Number */}
                  <div className="flex-shrink-0 text-[#E6F0F0]/50 font-bold text-lg min-w-[40px]">
                    {contributor.position.toString().padStart(2, "0")}
                  </div>

                  {/* Team Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-white">
                      <Image
                        src={contributor.logo}
                        alt={`${contributor.name} Logo`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-[#E6F0F0] truncate mb-1">
                      {contributor.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-[#15C0B9]">
                        {contributor.amount}
                      </span>
                      <span className="text-[#E6F0F0]/60">•</span>
                      <span className="text-[#E6F0F0]/80 truncate">
                        University of {contributor.name.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : !isLoadingLeaderboard ? (
        <div className="text-center text-[#E6F0F0] p-8">
          <p>No leaderboard data available</p>
        </div>
      ) : (
        <>
          {/* Loading Top 3 */}
          <div className="mb-12">
            <div className="flex justify-center items-center gap-8 mb-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-[120px] h-[120px] bg-white/10 rounded-md animate-pulse mb-4"></div>
                  <div className="text-center space-y-2">
                    <div className="h-4 bg-white/10 rounded animate-pulse w-20"></div>
                    <div className="h-3 bg-white/10 rounded animate-pulse w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-6 bg-white/10 rounded animate-pulse"></div>
                  <div className="flex-shrink-0 w-16 h-16 bg-white/10 rounded-md animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-white/10 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
