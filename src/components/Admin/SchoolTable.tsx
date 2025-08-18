"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { CollegeData } from "@/types/api";
import { loadCollegesWithCache } from "@/lib/colleges-cache";

export default function SchoolTable() {
  const [colleges, setColleges] = useState<CollegeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    schoolName: "",
    nickname: "",
    city: "",
    state: "",
    type: "",
    subdivision: "",
    primary: "",
    walletAddress: "",
  });

  // Load colleges data on component mount
  useEffect(() => {
    const loadColleges = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: loadError, fromCache } = await loadCollegesWithCache();
        
        if (loadError) {
          setError(loadError);
          console.error('Error loading colleges:', loadError);
        } else if (data) {
          setColleges(data);
          console.log(`Colleges loaded ${fromCache ? 'from cache' : 'from API'}`);
        }
      } catch (err) {
        setError('Failed to load colleges');
        console.error('Error loading colleges:', err);
      } finally {
        setLoading(false);
      }
    };

    loadColleges();
  }, []);

  const schoolList = useMemo(() => 
    colleges.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [colleges]
  );

  const filteredSchoolList = useMemo(() => {
    const lowercased = {
      schoolName: filters.schoolName.toLowerCase(),
      nickname: filters.nickname.toLowerCase(),
      city: filters.city.toLowerCase(),
      state: filters.state.toLowerCase(),
      type: filters.type.toLowerCase(),
      subdivision: filters.subdivision.toLowerCase(),
      primary: filters.primary.toLowerCase(),
      walletAddress: filters.walletAddress.toLowerCase(),
    };

    return schoolList.filter((school) => {
      if (lowercased.schoolName && !school.name.toLowerCase().includes(lowercased.schoolName)) return false;
      if (lowercased.nickname && !school.nickname.toLowerCase().includes(lowercased.nickname)) return false;
      if (lowercased.city && !school.city.toLowerCase().includes(lowercased.city)) return false;
      if (lowercased.state && !school.state.toLowerCase().includes(lowercased.state)) return false;
      if (lowercased.type && !school.type.toLowerCase().includes(lowercased.type)) return false;
      if (lowercased.subdivision && !school.subdivision.toLowerCase().includes(lowercased.subdivision)) return false;
      if (lowercased.primary && !school.primary.toLowerCase().includes(lowercased.primary)) return false;
      if (lowercased.walletAddress && !school.walletAddress.toLowerCase().includes(lowercased.walletAddress)) return false;
      return true;
    });
  }, [filters, schoolList]);

  // Loading state
  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 p-8">
        <div className="text-center text-white/90">Loading schools...</div>
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
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 overflow-scroll max-h-[500px] scrollbar-custom">
      <table className="min-w-full table-fixed text-left text-sm text-white/90">
        <thead className="sticky top-0 z-20 bg-[#2a413e] text-white">
          <tr>
            <th className="px-4 py-2 align-top min-w-[300px] max-w-[300px]">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">School name</div>
                <input
                  type="text"
                  value={filters.schoolName}
                  onChange={(e) => setFilters((prev) => ({ ...prev, schoolName: e.target.value }))}
                  // placeholder="Filter"
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Nickname</div>
                <input
                  type="text"
                  value={filters.nickname}
                  onChange={(e) => setFilters((prev) => ({ ...prev, nickname: e.target.value }))}
                  // placeholder="Filter"
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">City</div>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                  // placeholder="Filter"
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">State</div>
                <input
                  type="text"
                  value={filters.state}
                  onChange={(e) => setFilters((prev) => ({ ...prev, state: e.target.value }))}
                  // placeholder="Filter"
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Type</div>
                <input
                  type="text"
                  value={filters.type}
                  onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                  // placeholder="Filter"
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Subdivision</div>
                <input
                  type="text"
                  value={filters.subdivision}
                  onChange={(e) => setFilters((prev) => ({ ...prev, subdivision: e.target.value }))}
                  // placeholder="Filter"
                  className="w-full rounded-md bg-white/10 px-2 py-1 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-[#15C0B9]"
                />
              </div>
            </th>
            <th className="px-4 py-2 align-top">
              <div className="space-y-1">
                <div className="text-xs font-semibold mb-2">Primary</div>
                <input
                  type="text"
                  value={filters.primary}
                  onChange={(e) => setFilters((prev) => ({ ...prev, primary: e.target.value }))}
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
          </tr>
        </thead>
        <tbody>
          {filteredSchoolList.length > 0 ? filteredSchoolList.map((school) => (
            <tr key={`${school.name}-${school.city}`} className="odd:bg-white/0 even:bg-white/[0.03]">
              <td className="min-w-[300px] max-w-[300px] px-4 py-3 whitespace-nowrap truncate">{school.name}</td>
              <td className="min-w-[150px] max-w-[150px] px-4 py-3 whitespace-nowrap truncate">{school.nickname}</td>
              <td className="min-w-[150px] max-w-[150px] px-4 py-3 whitespace-nowrap truncate">{school.city}</td>
              <td className="min-w-[80px] max-w-[80px] px-4 py-3 whitespace-nowrap truncate">{school.state}</td>
              <td className="min-w-[100px] max-w-[100px] px-4 py-3 whitespace-nowrap truncate">{school.type}</td>
              <td className="min-w-[120px] max-w-[120px] px-4 py-3 whitespace-nowrap truncate">{school.subdivision}</td>
              <td className="min-w-[150px] max-w-[150px] px-4 py-3 whitespace-nowrap truncate">{school.primary}</td>
              <td className="min-w-[150px] max-w-[150px] px-4 py-3 font-mono truncate">
                <Link href={`https://solscan.io/address/${school.walletAddress}`} target="_blank" className="text-blue-500 hover:text-blue-600 block truncate">
                  {school.walletAddress}
                </Link>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={8} className="px-4 py-3 text-center text-white/50">No schools found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


