"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DashboardCards from "@/components/DashboardCards";
import CollegeLeaderboard from "@/components/CollegeLeaderboard";
import UserLeaderboard from "@/components/UserLeaderboard";
import Image from "next/image";
// import { useWalletAuthCheck } from "@/lib/auth-utils-client";
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
  CollegeData,
} from "@/types/api";
import UserTransactionsTable from "@/components/UserTransactionsTable";

export default function Dashboard() {
  const { publicKey } = useWallet();
  // const { checkAndLogout } = useWalletAuthCheck();

  // useEffect(() => {
  //   console.log("Checking and logging out from dashboard");
  //   checkAndLogout();
  // }, []);

  // User data state management
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
  const [tradingVolumeData, setTradingVolumeData] =
    useState<TradingVolumeData>();
  const [isLoadingTradingVolume, setIsLoadingTradingVolume] = useState(false);
  const [tradingVolumeError, setTradingVolumeError] = useState<string | null>(
    null
  );

  const loadUserData = async () => {
    if (!publicKey) {
      setUserDataError(null);
      setLinkedCollege(null);
      return;
    }

    setIsLoadingUserData(true);
    setUserDataError(null);

    try {
      const { data, error } = await fetchUserData(publicKey.toString());

      if (error) {
        setUserDataError(error);
        setLinkedCollege(null);
      } else if (data) {
        if (data.data.currentLinkedCollege) {
          setLinkedCollege(
            data.data.currentLinkedCollege as unknown as CollegeData
          );
        } else {
          setLinkedCollege(null);
        }
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      setUserDataError("Failed to load user data");
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Listen for college link success events
  useEffect(() => {
    const handleCollegeLinkSuccess = () => {
      loadUserData();
    };

    window.addEventListener("collegeLinkSuccess", handleCollegeLinkSuccess);

    return () => {
      window.removeEventListener(
        "collegeLinkSuccess",
        handleCollegeLinkSuccess
      );
    };
  }, [publicKey]); // Re-setup listener when publicKey changes

  // Fetch balance when wallet is connected
  useEffect(() => {
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

        if (error && error !== "User stats not found") {
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
      const contributions = getLinkedCollegeContributions(
        contributionsData,
        linkedCollege
      );
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
    ? ""
    : balanceError
    ? "Error loading balance"
    : "Connect wallet";

  const tradingVolume =
    tradingVolumeData && tradingVolumeData.totalVolume > 0
      ? formatBalance(getTradingVolumeAmount(tradingVolumeData))
      : isLoadingTradingVolume
      ? ""
      : tradingVolumeError
      ? "Error loading trading volume"
      : formatBalance(0);

  const totalContributionAmount =
    contributionsData.length > 0
      ? `${formatBalance(contributionsData[0]?.totalContributions) || 0}`
      : isLoadingContributions
      ? ""
      : contributionsError
      ? "Error loading contributions"
      : "0 $D1C";

  return (
    <DefaultLayout>
      <div
        className="pt-[150px] min-h-screen bg-[#03211e]"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundPositionY: "0",
          backgroundRepeat: "no-repeat",
        }}
      >
        <main className="container mx-auto px-6 py-8 text-[#E6F0F0]">
          {/* Header Section */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center justify-center bg-transparent rounded-md p-6">
              <div className="flex items-center justify-center w-full max-w-4xl space-x-10">
                {/* 1️⃣ Error */}
                {userDataError ? (
                  <div>There was an error retrieving your info</div>
                ) : /* 2️⃣ Loading */
                isLoadingUserData ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15C0B9]"></div>
                ) : /* 3️⃣ No linked college */
                !linkedCollege ? (
                  <div className="flex items-center gap-3 text-center">
                    <span className="font-semibold text-lg md:text-4xl text-[#E6F0F0]">
                      Choose a college
                      <br />
                      to support
                    </span>
                  </div>
                ) : (
                  /* 4️⃣ Linked college (with or without contributions) */
                  <>
                    {/* Logo */}
                    <div className="p-4 bg-white rounded-md">
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

                    {/* Contribution Info */}
                    <div className="text-left">
                      {linkedCollegeContributions &&
                      linkedCollegeContributions > 0 ? (
                        <p className="text-lg md:text-4xl text-[#E6F0F0] flex flex-col">
                          <span className="font-semibold">
                            You&apos;ve contributed
                          </span>
                          <span className="font-bold text-[#15C0B9] my-1">
                            {formatBalance(linkedCollegeContributions)}
                          </span>
                          <span className="font-semibold">
                            to {linkedCollege?.nickname}
                          </span>
                        </p>
                      ) : (
                        <p className="text-lg md:text-4xl text-[#E6F0F0] flex flex-col">
                          <span className="font-semibold">
                            Start trading $D1C
                          </span>
                          <span className="font-semibold">to see your</span>
                          <span className="font-semibold">
                            contributions grow
                          </span>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <DashboardCards
            tradingVolume={tradingVolume}
            d1cBalance={d1cBalance}
            totalContributionAmount={totalContributionAmount}
            usdAmount="USD Coming Soon"
            isLoadingBalance={isLoadingBalance}
            isLoadingContributions={isLoadingContributions}
            isLoadingTradingVolume={isLoadingTradingVolume}
          />

          {/* Top Contributions Section */}
          <div className="mt-16">
            <UserTransactionsTable />
          </div>
          
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
