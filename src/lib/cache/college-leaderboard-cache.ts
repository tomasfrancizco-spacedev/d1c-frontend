import { CollegeLeaderboardEntry } from '@/types/api';
import { fetchCollegeLeaderboard } from '@/lib/api';

// Cache configuration
const COLLEGE_LEADERBOARD_CACHE_KEY = "college-leaderboard-cache";
const CACHE_EXPIRY_HOURS = 8;

// Cache utilities
export const getCachedCollegeLeaderboard = (): CollegeLeaderboardEntry[] | null => {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(COLLEGE_LEADERBOARD_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired =
      Date.now() - timestamp > CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

    if (isExpired) {
      clearCollegeLeaderboardCache();
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error reading college leaderboard cache:", error);
    clearCollegeLeaderboardCache();
    return null;
  }
};

export const setCachedCollegeLeaderboard = (colleges: CollegeLeaderboardEntry[]): void => {
  if (typeof window === "undefined") return;

  try {
    const cacheData = {
      data: colleges,
      timestamp: Date.now(),
    };
    localStorage.setItem(COLLEGE_LEADERBOARD_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error setting college leaderboard cache:", error);
  }
};

export const clearCollegeLeaderboardCache = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(COLLEGE_LEADERBOARD_CACHE_KEY);
  } catch (error) {
    console.error("Error clearing college leaderboard cache:", error);
  }
};

// High-level function to load colleges with cache
export const loadCollegeLeaderboardWithCache = async (forceReload: boolean = false): Promise<{
  data: CollegeLeaderboardEntry[] | null;
  error: string | null;
  fromCache: boolean;
}> => {
  // If force reload is requested, clear cache first
  if (forceReload) {
    clearCollegeLeaderboardCache();
  }

  // First, try to get from cache (unless force reload)
  if (!forceReload) {
    const cachedCollegeLeaderboard = getCachedCollegeLeaderboard();
    if (cachedCollegeLeaderboard && cachedCollegeLeaderboard.length > 0) {
      return {
        data: cachedCollegeLeaderboard,
        error: null,
        fromCache: true,
      };
    }
  }

  // If no cache, fetch from API
  try {
    const { data, error } = await fetchCollegeLeaderboard();

    if (error) {
      return {
        data: null,
        error: error,
        fromCache: false,
      };
    }

    if (data?.success && data.data) {
      const leaderboardArray = data.data as CollegeLeaderboardEntry[];
      setCachedCollegeLeaderboard(leaderboardArray); // Cache the data
      return {
        data: leaderboardArray,
        error: null,
        fromCache: false,
      };
    }

    return {
      data: null,
      error: "No college leaderboard data received",
      fromCache: false,
    };
  } catch (err) {
    console.error("Error loading college leaderboard:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to load college leaderboard",
      fromCache: false,
    };
  }
};

// Hook-like function for React components
export const useCollegeLeaderboardCache = () => {
  return {
    getCachedCollegeLeaderboard,
    setCachedCollegeLeaderboard,
    clearCollegeLeaderboardCache,
    loadCollegeLeaderboardWithCache,
  };
};
