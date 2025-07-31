"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchCollegeLeaderboard } from "@/lib/api";
import { CollegeLeaderboardEntry } from "@/types/api";
import { formatBalance } from "@/lib/api";

interface CollegeLeaderboardProps {
  showTitle?: boolean;
  className?: string;
}

export default function CollegeLeaderboard({
  showTitle = true,
  className = "",
}: CollegeLeaderboardProps) {
  // Leaderboard state management
  const [leaderboardData, setLeaderboardData] = useState<CollegeLeaderboardEntry[]>(
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
        const { data, error } = await fetchCollegeLeaderboard();

        if (error) {
          setLeaderboardError(error);
          setLeaderboardData([]);
        } else if (data?.success && data.data) {
          setLeaderboardData(data.data as CollegeLeaderboardEntry[]);
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
        <div className="flex items-center justify-center text-center gap-3 mb-12">
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
            <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-8 mb-8">
              {leaderboardData.slice(0, 3).map((college) => (
                <div
                  key={college.college.name}
                  className="flex flex-col items-center flex-1 max-w-[100px] sm:max-w-[120px] md:max-w-none"
                >
                  <div
                    className="relative mb-2 sm:mb-4 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] flex items-center justify-center rounded-full overflow-hidden"
                  >
                    <Image
                      src={college.college.logo || "/colleges/college_placeholder.png"}
                      alt={`${leaderboardData.indexOf(college) + 1}${getPositionSuffix(
                        leaderboardData.indexOf(college) + 1
                      )} Place School Logo`}
                      width={60}
                      height={60}
                      className="rounded-full w-[70px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[110px] md:h-[80px] object-cover"
                    />
                  </div>
                  <div className="text-center w-full">
                    {/* Mobile: Stack badge above name */}
                    <div className="sm:hidden flex flex-col items-center gap-1 mb-2 h-[60px]">
                      <div className="bg-white/10 text-white text-xs font-bold rounded-md px-2 py-1 min-w-[30px] h-[30px] flex items-center justify-center">
                        {leaderboardData.indexOf(college) + 1}
                        {getPositionSuffix(leaderboardData.indexOf(college) + 1)}
                      </div>
                      <h4 className="text-xs font-semibold text-[#E6F0F0] leading-tight line-clamp-2 px-1">
                        {college.college.name}
                      </h4>
                    </div>
                    
                    {/* Desktop: Badge and name side by side */}
                    <div className="hidden sm:flex items-center justify-center gap-2 md:gap-3 mb-2 h-[50px] md:h-[60px]">
                      <div className="bg-white/10 text-white text-sm font-bold rounded-md px-2 md:px-3 py-1 md:py-2 min-w-[35px] md:min-w-[40px] h-[35px] md:h-[40px] flex items-center justify-center flex-shrink-0">
                        {leaderboardData.indexOf(college) + 1}
                        {getPositionSuffix(leaderboardData.indexOf(college) + 1)}
                      </div>
                      <h4 className="text-sm md:text-lg font-semibold text-[#E6F0F0] leading-tight line-clamp-2 text-center">
                        {college.college.name}
                      </h4>
                    </div>
                    
                    <p className="text-[#15C0B9] font-bold text-xs sm:text-sm md:text-base h-[20px] sm:h-[24px] flex items-center justify-center">
                      {formatBalance(college.totalContributionsReceived)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contributors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaderboardData.slice(3, 13).map((college) => (
              <div
                key={college.college.name}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300 p-4 h-[88px]"
              >
                <div className="flex items-center gap-4 h-full">
                  {/* Position Number */}
                  <div className="flex-shrink-0 text-[#E6F0F0]/50 font-bold text-lg min-w-[40px] self-start">
                    {leaderboardData.indexOf(college) + 1}
                  </div>

                  {/* Team Logo */}
                  <div className="flex-shrink-0 self-start">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-white">
                      <Image
                        src={college.college.logo || ""}
                        alt={`${college.college.name} Logo`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                    <h4 className="text-lg font-semibold text-[#E6F0F0] line-clamp-2 leading-tight mb-1 h-[44px] flex items-center">
                      {college.college.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm h-[20px]">
                      <span className="font-bold text-[#15C0B9]">
                        {formatBalance(college.totalContributionsReceived)}
                      </span>
                      <span className="text-[#E6F0F0]/60">•</span>
                      <span className="text-[#E6F0F0]/80 truncate">
                        University of {college.college.name?.split(" ")[0] || ""}
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
            <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-8 mb-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center flex-1 max-w-[100px] sm:max-w-[120px] md:max-w-none">
                  <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] bg-white/10 rounded-full animate-pulse mb-2 sm:mb-4"></div>
                  <div className="text-center space-y-1 sm:space-y-2 w-full">
                    <div className="h-3 sm:h-4 bg-white/10 rounded animate-pulse w-full max-w-[60px] sm:max-w-[80px] mx-auto"></div>
                    <div className="h-2 sm:h-3 bg-white/10 rounded animate-pulse w-full max-w-[50px] sm:max-w-[60px] mx-auto"></div>
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
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md overflow-hidden p-4 h-[88px]"
              >
                <div className="flex items-center gap-4 h-full">
                  <div className="flex-shrink-0 w-8 h-6 bg-white/10 rounded animate-pulse self-start"></div>
                  <div className="flex-shrink-0 w-16 h-16 bg-white/10 rounded-md animate-pulse self-start"></div>
                  <div className="flex-1 flex flex-col justify-center h-full space-y-2">
                    <div className="h-[44px] bg-white/10 rounded animate-pulse"></div>
                    <div className="h-[20px] bg-white/10 rounded animate-pulse w-1/2"></div>
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
