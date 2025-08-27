import { UserTransaction } from '@/types/api';
import { fetchUserTransactions } from '@/lib/api';

// Cache configuration
const USER_TRANSACTIONS_CACHE_KEY = "user-transactions-cache";
const CACHE_EXPIRY_HOURS = 1;

// Cache utilities
export const getCachedUserTransactions = (): UserTransaction[] | null => {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(USER_TRANSACTIONS_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired =
      Date.now() - timestamp > CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

    if (isExpired) {
      clearUserTransactionsCache();
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error reading user transactions cache:", error);
    clearUserTransactionsCache();
    return null;
  }
};

export const setCachedUserTransactions = (userTransactions:  UserTransaction[]): void => {
  if (typeof window === "undefined") return;

  try {
    const cacheData = {
      data: userTransactions,
      timestamp: Date.now(),
    };
    localStorage.setItem(USER_TRANSACTIONS_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error setting user transactions cache:", error);
  }
};

export const clearUserTransactionsCache = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(USER_TRANSACTIONS_CACHE_KEY);
  } catch (error) {
    console.error("Error clearing colleges cache:", error);
  }
};

// High-level function to load colleges with cache
export const loadUserTransactionsWithCache = async (forceReload: boolean = false, userAddress: string): Promise<{
  data: UserTransaction[] | null;
  error: string | null;
  fromCache: boolean;
}> => {
  // If force reload is requested, clear cache first
  if (forceReload) {
    clearUserTransactionsCache();
  }

  // First, try to get from cache (unless force reload)
  if (!forceReload) {
    const cachedUserTransactions = getCachedUserTransactions();
    if (cachedUserTransactions && cachedUserTransactions.length > 0) {
      return {
        data: cachedUserTransactions,
        error: null,
        fromCache: true,
      };
    }
  }

  // If no cache, fetch from API
  try {
    const { data, error } = await fetchUserTransactions(userAddress, 10, 0);

    if (error) {
      return {
        data: null,
        error: error,
        fromCache: false,
      };
    }

    if (data?.transactions) {
      const userTransactionsArray = data.transactions;
      setCachedUserTransactions(userTransactionsArray); // Cache the data
      return {
        data: userTransactionsArray,
        error: null,
        fromCache: false,
      };
    }

    return {
      data: null,
      error: "No user transactions data received",
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
    getCachedUserTransactions,
    setCachedUserTransactions,
    clearUserTransactionsCache,
    loadUserTransactionsWithCache,
  };
};
