"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchCollegeLeaderboard } from "@/lib/api";
import { CollegeLeaderboardEntry } from "@/types/api";
import { formatBalance } from "@/lib/api";
import CollegeCard from "./CollegeCard";

interface CollegeLeaderboardProps {
  showTitle?: boolean;
  className?: string;
}

export default function CollegeLeaderboard({
  showTitle = true,
  className = "",
}: CollegeLeaderboardProps) {
  // Leaderboard state management
  const [leaderboardData, setLeaderboardData] = useState<
    CollegeLeaderboardEntry[]
  >([]);
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

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-center text-center gap-3 mb-12">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">
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
          {/* Full-width background container */}
          <div
            className="absolute inset-0 w-screen left-1/2 transform -translate-x-1/2 -z-10"
            style={{
              backgroundImage: "url(/bc-leaderboard.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Content container */}
          <div className="relative z-10">
            {/* Top 3 Contributors */}
            <div className="mb-12">
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-4 md:gap-6 lg:gap-8 mb-8 px-4">
                {leaderboardData.slice(0, 3).map((college) => (
                  <CollegeCard
                    key={college.college.name}
                    image={
                      college.college.logo ||
                      "/colleges/college_placeholder.png"
                    }
                    title={college.college.name || ""}
                    subtitle={`${formatBalance(
                      college.totalContributionsReceived
                    )}`}
                    rank={leaderboardData.indexOf(college) + 1}
                    isRanked={true}
                    onSupport={() => {}}
                  />
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
                      <h4 className="text-lg font-semibold text-[#E6F0F0] line-clamp-2 leading-tight mb-1 h-[44px] flex items-center truncate">
                        {college.college.name}
                      </h4>
                      <div className="flex items-center text-sm h-[20px]">
                        <span className="font-bold text-[#15C0B9]">
                          {formatBalance(college.totalContributionsReceived)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : // ... existing code ...
      !isLoadingLeaderboard ? (
        <div className="text-center text-[#E6F0F0] p-8">
          <p>No leaderboard data available</p>
        </div>
      ) : (
        <>
          {/* Loading Top 3 */}
          <div className="mb-12">
            <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-8 mb-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 max-w-[100px] sm:max-w-[120px] md:max-w-none"
                >
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
