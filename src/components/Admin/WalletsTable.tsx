"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { fetchD1CWallets } from "@/lib/api";
import { D1CWallet } from "@/types/api";

export default function WalletsTable() {
  const [wallets, setWallets] = useState<D1CWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    walletType: "",
    walletAddress: "",
    fee_exempt: "",
  });

  // Fetch wallets data on component mount
  useEffect(() => {
    const loadWallets = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await fetchD1CWallets();

        if (error) {
          setError(error);
          console.error("Error fetching wallets:", error);
        } else if (data?.data) {
          setWallets(data.data);
        }
      } catch (err) {
        setError("Failed to load wallets");
        console.error("Error loading wallets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallets();
  }, []);

  const walletList = useMemo(
    () =>
      wallets.slice().sort((a, b) => a.walletType.localeCompare(b.walletType)),
    [wallets]
  );

  const filteredWalletList = useMemo(() => {
    const lowercased = {
      walletType: filters.walletType.toLowerCase(),
      walletAddress: filters.walletAddress.toLowerCase(),
      fee_exempt: filters.fee_exempt.toLowerCase(),
    };

    return walletList.filter((wallet) => {
      if (
        lowercased.walletType &&
        !wallet.walletType.toLowerCase().includes(lowercased.walletType)
      )
        return false;
      if (
        lowercased.walletAddress &&
        !wallet.walletAddress.toLowerCase().includes(lowercased.walletAddress)
      )
        return false;
      if (
        lowercased.fee_exempt &&
        !wallet.fee_exempt.toString().includes(lowercased.fee_exempt)
      )
        return false;
      return true;
    });
  }, [filters, walletList]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#03211e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15C0B9]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 p-8">
        <div className="text-center text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">D1C Wallets</h3>
      </div>
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 overflow-scroll max-h-[500px] scrollbar-custom">
      <table className="min-w-full table-fixed text-left text-sm text-white/90">
        <thead className="sticky top-0 z-20 bg-[#2a413e] text-white">
          <tr>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">ID</div>
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Wallet Type</div>
                <input
                  type="text"
                  value={filters.walletType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      walletType: e.target.value,
                    }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Wallet Address</div>
                <input
                  type="text"
                  value={filters.walletAddress}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      walletAddress: e.target.value,
                    }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Created At</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredWalletList.length > 0 ? (
            filteredWalletList.map((wallet) => (
              <tr
                key={`${wallet.id}-${wallet.walletAddress}`}
                className="odd:bg-white/0 even:bg-white/[0.03]"
              >
                <td className="px-4 py-3 whitespace-nowrap">{wallet.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
                    {wallet.walletType}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono">
                  <Link
                    href={`https://solscan.io/address/${wallet.walletAddress}`}
                    target="_blank"
                    className="text-blue-500 hover:text-blue-600 block truncate"
                    title={wallet.walletAddress}
                  >
                    {wallet.walletAddress}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-white/70">
                  {new Date(wallet.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-3 text-center text-white/50">
                No wallets found
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
