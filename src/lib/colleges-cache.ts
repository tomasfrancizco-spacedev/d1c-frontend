import { CollegeData } from '@/types/api';
import { fetchColleges } from '@/lib/api';

// Cache configuration
const COLLEGES_CACHE_KEY = "division-one-colleges-cache";
const CACHE_EXPIRY_HOURS = 8;

// Cache utilities
export const getCachedColleges = (): CollegeData[] | null => {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(COLLEGES_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired =
      Date.now() - timestamp > CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

    if (isExpired) {
      clearCollegesCache();
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error reading colleges cache:", error);
    clearCollegesCache();
    return null;
  }
};

export const setCachedColleges = (colleges: CollegeData[]): void => {
  if (typeof window === "undefined") return;

  try {
    const cacheData = {
      data: colleges,
      timestamp: Date.now(),
    };
    localStorage.setItem(COLLEGES_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error setting colleges cache:", error);
  }
};

export const clearCollegesCache = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(COLLEGES_CACHE_KEY);
  } catch (error) {
    console.error("Error clearing colleges cache:", error);
  }
};

// High-level function to load colleges with cache
export const loadCollegesWithCache = async (forceReload: boolean = false): Promise<{
  data: CollegeData[] | null;
  error: string | null;
  fromCache: boolean;
}> => {
  // If force reload is requested, clear cache first
  if (forceReload) {
    clearCollegesCache();
  }

  // First, try to get from cache (unless force reload)
  if (!forceReload) {
    const cachedColleges = getCachedColleges();
    if (cachedColleges && cachedColleges.length > 0) {
      return {
        data: cachedColleges,
        error: null,
        fromCache: true,
      };
    }
  }

  // If no cache, fetch from API
  try {
    const { data, error } = await fetchColleges();

    if (error) {
      return {
        data: null,
        error: error,
        fromCache: false,
      };
    }

    if (data?.data?.data) {
      const collegesArray = data.data.data;
      setCachedColleges(collegesArray); // Cache the data
      return {
        data: collegesArray,
        error: null,
        fromCache: false,
      };
    }

    return {
      data: null,
      error: "No colleges data received",
      fromCache: false,
    };
  } catch (err) {
    console.error("Error loading colleges:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Failed to load colleges",
      fromCache: false,
    };
  }
};

// Hook-like function for React components
export const useCollegesCache = () => {
  return {
    getCachedColleges,
    setCachedColleges,
    clearCollegesCache,
    loadCollegesWithCache,
  };
};
