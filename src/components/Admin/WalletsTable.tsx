"use client";
import React, { useMemo, useState } from "react";
import wallets from "@/data/wallets.json";
import Link from "next/link";

type Wallet = {
  name: string;
  walletAddress: string;
  isFeeExempt: boolean;
};

export default function WalletsTable() {
  const walletList = (wallets as unknown as Wallet[])
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const [filters, setFilters] = useState({
    name: "",
    walletAddress: "",
    isFeeExempt: "",
  });

  const filteredWalletList = useMemo(() => {
    const lowercased = {
      name: filters.name.toLowerCase(),
      walletAddress: filters.walletAddress.toLowerCase(),
      isFeeExempt: filters.isFeeExempt.toLowerCase(),
    };

    return walletList.filter((wallet) => {
      if (
        lowercased.name &&
        !wallet.name.toLowerCase().includes(lowercased.name)
      )
        return false;
      if (
        lowercased.walletAddress &&
        !wallet.walletAddress.toLowerCase().includes(lowercased.walletAddress)
      )
        return false;
      if (
        lowercased.isFeeExempt &&
        !wallet.isFeeExempt.toString().includes(lowercased.isFeeExempt)
      )
        return false;
      return true;
    });
  }, [filters, walletList]);

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 overflow-scroll max-h-[500px] scrollbar-custom">
      <table className="min-w-full table-fixed text-left text-sm text-white/90">
        <thead className="sticky top-0 z-20 bg-[#2a413e] text-white">
          <tr>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Name</div>
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  // placeholder="Filter"
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Wallet address</div>
                <input
                  type="text"
                  value={filters.walletAddress}
                  onChange={(e) => setFilters((prev) => ({ ...prev, walletAddress: e.target.value }))}
                  // placeholder="Filter"
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Fee exempt</div>
                <input
                  type="text"
                  value={filters.isFeeExempt}
                  onChange={(e) => setFilters((prev) => ({ ...prev, isFeeExempt: e.target.value }))}
                  // placeholder="Filter"
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredWalletList.length > 0 ? filteredWalletList.map((wallet) => (
            <tr
              key={`${wallet.name}-${wallet.walletAddress}`}
              className="odd:bg-white/0 even:bg-white/[0.03]"
            >
              <td className="px-4 py-3 whitespace-nowrap">{wallet.name}</td>
              <td className="px-4 py-3 font-mono">
                <Link
                  href={`https://solscan.io/address/${wallet.walletAddress}`}
                  target="_blank"
                  className="text-blue-500 hover:text-blue-600"
                >
                  {wallet.walletAddress}
                </Link>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {wallet.isFeeExempt ? "Yes" : "No"}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={8} className="px-4 py-3 text-center text-white/50">No wallets found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
