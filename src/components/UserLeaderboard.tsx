"use client";

import { useState, useEffect } from "react";
import { fetchUserLeaderboard } from "@/lib/api";
import { LeaderboardEntry } from "@/types/api";

interface UserLeaderboardProps {
  showTitle?: boolean;
  className?: string;
}

export default function UserLeaderboard({
  showTitle = true,
  className = "",
}: UserLeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  // Fetch leaderboard on component mount
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoadingLeaderboard(true);
      setLeaderboardError(null);

      try {
        const { data, error } = await fetchUserLeaderboard();

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

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-center text-center gap-3 mb-12">
          <h3 className="text-2xl md:text-3xl lg:text-4xl text-[#E6F0F0] mb-4">
            Top supporters from the community
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
          {/* User Contributors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaderboardData.slice(0, 12).map((contributor) => (
              <div
                key={contributor.position}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  {/* Position Badge */}
                  <div className="flex-shrink-0">
                    <div className="bg-white/10 text-white text-sm font-bold rounded-lg px-3 py-2 min-w-[50px] h-[40px] flex items-center justify-center">
                      {contributor.position.toString().padStart(2, "0")}
                    </div>
                  </div>

                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10"
                    >
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
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
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-[#E6F0F0] mb-1 truncate">
                      {contributor.name}
                    </h4>
                    <p className="text-[#15C0B9] font-bold text-sm">
                      {contributor.amount}
                    </p>
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
          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-[50px] h-[40px] bg-white/10 rounded-lg animate-pulse"></div>
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
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
