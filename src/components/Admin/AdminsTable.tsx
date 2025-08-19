"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { fetchAdmins } from "@/lib/api";
import { AdminData } from "@/types/api";

export default function AdminsTable() {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    waletAddress: "",
    lastLogin: "",
    currentLinkedCollege: "",
  });

  // Fetch wallets data on component mount
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await fetchAdmins();

        if (error) {
          setError(error);
          console.error("Error fetching admins:", error);
        } else if (data?.data) {
          setAdmins(data.data);
        }
      } catch (err) {
        setError("Failed to load admins");
        console.error("Error loading admins:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdmins();
  }, []);

  const adminList = useMemo(
    () =>
      admins
        .slice()
        .sort((a, b) => a.walletAddress.localeCompare(b.walletAddress)),
    [admins]
  );

  const filteredAdminList = useMemo(() => {
    const lowercased = {
      waletAddress: filters.waletAddress.toLowerCase(),
      lastLogin: filters.lastLogin.toLowerCase(),
      currentLinkedCollege: filters.currentLinkedCollege.toLowerCase(),
    };

    return adminList.filter((admin) => {
      if (
        lowercased.waletAddress &&
        !admin.walletAddress.toLowerCase().includes(lowercased.waletAddress)
      )
        return false;
      if (
        lowercased.lastLogin &&
        !admin.lastLogin.toLowerCase().includes(lowercased.lastLogin)
      )
        return false;
      if (
        lowercased.currentLinkedCollege &&
        !admin.currentLinkedCollege
          .toString()
          .includes(lowercased.currentLinkedCollege)
      )
        return false;
      return true;
    });
  }, [filters, adminList]);

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
        <h3 className="text-xl font-semibold text-white">Admins</h3>
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
                <div className="text-xs font-semibold mb-2">Wallet Address</div>
                <input
                  type="text"
                  value={filters.waletAddress}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      waletAddress: e.target.value,
                    }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Last Login</div>
                <input
                  type="text"
                  value={filters.lastLogin}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      lastLogin: e.target.value,
                    }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Linked College</div>
                <input
                  type="text"
                  value={filters.currentLinkedCollege}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      currentLinkedCollege: e.target.value,
                    }))
                  }
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredAdminList.length > 0 ? (
            filteredAdminList.map((admin) => (
              <tr
                key={`${admin.id}-${admin.walletAddress}`}
                className="odd:bg-white/0 even:bg-white/[0.03]"
              >
                <td className="px-4 py-3 whitespace-nowrap">{admin.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`https://solscan.io/address/${admin.walletAddress}`}
                    target="_blank"
                    className="text-blue-500 hover:text-blue-600 block truncate max-w-[200px]"
                    title={admin.walletAddress}
                  >
                    {admin.walletAddress}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white/70`}
                  >
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleDateString()
                      : "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-white/70">
                  {admin.currentLinkedCollege.name}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-3 text-center text-white/50">
                No admins found
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
