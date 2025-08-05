"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DashboardCards from "@/components/DashboardCards";
import CollegeLeaderboard from "@/components/CollegeLeaderboard";
import UserLeaderboard from "@/components/UserLeaderboard";
import Image from "next/image";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import {
  fetchTokenBalance,
  formatBalance,
  fetchUserContributions,
  fetchTradingVolume,
  getTradingVolumeAmount,
  fetchUserData,
  getLinkedCollegeContributions,
} from "@/lib/api";
import {
  D1CBalanceResponse,
  UserContribution,
  TradingVolumeData,
  UserData,
  CollegeData,
} from "@/types/api";

export default function Dashboard() {
  const { publicKey } = useWallet();

  // User data state management
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [userDataError, setUserDataError] = useState<string | null>(null);
  const [linkedCollege, setLinkedCollege] = useState<CollegeData | null>(null);
  const [linkedCollegeContributions, setLinkedCollegeContributions] = useState<
    number | null
  >(null);

  // Balance state management
  const [balanceData, setBalanceData] = useState<D1CBalanceResponse | null>(
    null
  );
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Contributions state management
  const [contributionsData, setContributionsData] = useState<
    UserContribution[]
  >([]);
  const [isLoadingContributions, setIsLoadingContributions] = useState(false);
  const [contributionsError, setContributionsError] = useState<string | null>(
    null
  );

  // Trading volume state management
  const [tradingVolumeData, setTradingVolumeData] = useState<
    TradingVolumeData
  >();
  const [isLoadingTradingVolume, setIsLoadingTradingVolume] = useState(false);
  const [tradingVolumeError, setTradingVolumeError] = useState<string | null>(
    null
  );

  // Fetch balance when wallet is connected
  useEffect(() => {
    const loadUserData = async () => {
      if (!publicKey) {
        setUserData(null);
        setUserDataError(null);
        return;
      }

      setIsLoadingUserData(true);
      setUserDataError(null);

      try {
        const { data, error } = await fetchUserData(publicKey.toString());

        if (error) {
          setUserDataError(error);
          setUserData(null);
          setLinkedCollege(null);
        } else if (data) {
          setUserData(data);
          if (data.data.currentLinkedCollege) {
            setLinkedCollege(data.data.currentLinkedCollege);
          }
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setUserDataError("Failed to load user data");
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadUserData();

    const loadBalance = async () => {
      if (!publicKey) {
        setBalanceData(null);
        setBalanceError(null);
        return;
      }

      setIsLoadingBalance(true);
      setBalanceError(null);

      try {
        const { data, error } = await fetchTokenBalance(publicKey.toString());

        if (error) {
          setBalanceError(error);
          setBalanceData(null);
        } else if (data) {
          setBalanceData(data);
        }
      } catch (err) {
        console.error("Error loading balance:", err);
        setBalanceError("Failed to load balance");
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadBalance();

    const loadContributions = async () => {
      if (!publicKey) {
        setContributionsData([]);
        setContributionsError(null);
        return;
      }

      setIsLoadingContributions(true);
      setContributionsError(null);

      try {
        const { data, error } = await fetchUserContributions(
          publicKey.toString()
        );

        if (error) {
          setContributionsError(error);
          setContributionsData([]);
        } else if (data?.success && data.data) {
          setContributionsData(data.data);
        } else {
          setContributionsData([]);
        }
      } catch (err) {
        console.error("Error loading contributions:", err);
        setContributionsError("Failed to load contributions");
      } finally {
        setIsLoadingContributions(false);
      }
    };

    loadContributions();
  }, [publicKey]);

  useEffect(() => {
    if (linkedCollege) {
      const contributions = getLinkedCollegeContributions(contributionsData, linkedCollege);
      setLinkedCollegeContributions(contributions);
    }
  }, [contributionsData, linkedCollege]);

  // Fetch trading volume on component mount (not dependent on wallet)
  useEffect(() => {
    const loadTradingVolume = async () => {
      setIsLoadingTradingVolume(true);
      setTradingVolumeError(null);

      try {
        const { data, error } = await fetchTradingVolume();

        if (error) {
          setTradingVolumeError(error);
          setTradingVolumeData(undefined);
        } else if (data?.success && data.data) {
          setTradingVolumeData(data.data);
        }
      } catch (err) {
        console.error("Error loading trading volume:", err);
        setTradingVolumeError("Failed to load trading volume");
      } finally {
        setIsLoadingTradingVolume(false);
      }
    };

    loadTradingVolume();
  }, []);

  // Calculate display values
  const d1cBalance = balanceData
    ? formatBalance(balanceData.formattedAmount)
    : isLoadingBalance
    ? "Loading..."
    : balanceError
    ? "Error loading balance"
    : "Connect wallet to view balance";

  const tradingVolume =
    tradingVolumeData && tradingVolumeData.totalVolume > 0
      ? formatBalance(getTradingVolumeAmount(tradingVolumeData))
      : isLoadingTradingVolume
      ? "Loading..."
      : tradingVolumeError
      ? "Error loading trading volume"
      : "No trading volume data";

  const totalContributionAmount =
    contributionsData.length > 0
      ? `${formatBalance(contributionsData[0]?.totalContributions) || 0}`
      : isLoadingContributions
      ? "Loading..."
      : contributionsError
      ? "Error loading contributions"
      : "0 $D1C";

  return (
    <DefaultLayout>
      <div className="pt-[150px] min-h-screen bg-[#03211e]" style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }} >
        <main className="container mx-auto px-6 py-8 text-[#E6F0F0]">
          {/* Header Section */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center justify-center bg-transparent rounded-md p-6">
              <div className="flex items-center justify-center w-full max-w-4xl space-x-10">
                {/* Logo on the left */}
                {linkedCollege ? (
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        linkedCollege.logo ||
                        "/colleges/college_placeholder.png"
                      }
                      alt="College Logo"
                      width={150}
                      height={150}
                      className="rounded-md"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-center">
                    <span className="font-semibold text-lg md:text-4xl text-[#E6F0F0]">
                      Choose a college
                      <br />
                      to support
                    </span>
                  </div>
                )}

                {linkedCollege && linkedCollegeContributions && linkedCollegeContributions > 0 ? (
                  <div className="text-left">
                    <p className="text-lg md:text-4xl text-[#E6F0F0] flex flex-col">
                      <span className="font-semibold">
                        You&apos;ve contributed{" "}
                      </span>
                      <span className="font-bold text-[#15C0B9] my-2 ">
                        {linkedCollegeContributions
                          ? formatBalance(linkedCollegeContributions)
                          : 0}
                      </span>
                      <span className="font-semibold text-[#E6F0F0]">
                        to {linkedCollege?.nickname}
                      </span>
                    </p>
                  </div>
                ) : (linkedCollege && (
                  <div className="text-left">
                    <p className="text-lg md:text-4xl text-[#E6F0F0] flex flex-col">
                      <span className="font-semibold">
                        Start contributing to {linkedCollege?.nickname}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <DashboardCards
            tradingVolume={tradingVolume}
            d1cBalance={d1cBalance}
            totalContributionAmount={totalContributionAmount}
            usdAmount="TBD"
            isLoadingBalance={isLoadingBalance}
            isLoadingContributions={isLoadingContributions}
            isLoadingTradingVolume={isLoadingTradingVolume}
          />

          {/* Top Contributions Section */}
          <div className="mt-16">
            <CollegeLeaderboard />
          </div>

          <div className="mt-16">
            <UserLeaderboard />
          </div>
        </main>
      </div>
    </DefaultLayout>
  );
}
