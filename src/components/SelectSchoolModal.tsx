"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSIWS } from "@/hooks/useSIWS";
import { checkFullAuth } from "@/lib/auth-utils";
import { fetchColleges, linkCollege } from "@/lib/api";
import { CollegeData } from "@/types/api";
import Image from "next/image";

// Cache configuration
const COLLEGES_CACHE_KEY = "division-one-colleges-cache";
const CACHE_EXPIRY_HOURS = 24;

// Cache utilities
const getCachedColleges = (): CollegeData[] | null => {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(COLLEGES_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired =
      Date.now() - timestamp > CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

    if (isExpired) {
      localStorage.removeItem(COLLEGES_CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error reading colleges cache:", error);
    localStorage.removeItem(COLLEGES_CACHE_KEY);
    return null;
  }
};

const setCachedColleges = (colleges: CollegeData[]): void => {
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

// const clearCollegesCache = (): void => {
//   if (typeof window === "undefined") return;

//   try {
//     localStorage.removeItem(COLLEGES_CACHE_KEY);
//   } catch (error) {
//     console.error("Error clearing colleges cache:", error);
//   }
// };

interface SelectSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const SelectSchoolModal = ({
  isOpen,
  onClose,
  userId,
}: SelectSchoolModalProps) => {
  const { connected, isAuthenticated } = useSIWS();
  const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [colleges, setColleges] = useState<CollegeData[]>([]);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);
  const [collegesError, setCollegesError] = useState<string | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<CollegeData | null>(
    null
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoadingLinking, setIsLoadingLinking] = useState(false);
  const [linkingError, setLinkingError] = useState<string | null>(null);

  // Check for full authentication (wallet + MFA)
  useEffect(() => {
    setIsFullyAuthenticated(checkFullAuth(connected, isAuthenticated) || false);
  }, [connected, isAuthenticated]);

  // Handle mounting state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load colleges data (from cache or API)
  useEffect(() => {
    const loadColleges = async () => {
      if (!isOpen || !isFullyAuthenticated) return;

      // First, try to get from cache
      const cachedColleges = getCachedColleges();
      if (cachedColleges && cachedColleges.length > 0) {
        setColleges(cachedColleges);
        return;
      }

      // If no cache, fetch from API
      setIsLoadingColleges(true);
      setCollegesError(null);

      try {
        const { data, error } = await fetchColleges();

        if (error) {
          setCollegesError(error);
        } else if (data) {
          const collegesArray = data.data.data;
          setColleges(collegesArray);
          setCachedColleges(collegesArray); // Cache the data
        }
      } catch (err) {
        console.error("Error loading colleges:", err);
        setCollegesError("Failed to load colleges");
      } finally {
        setIsLoadingColleges(false);
      }
    };

    loadColleges();
  }, [isOpen, isFullyAuthenticated]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Filter colleges based on search term
  const filteredColleges =
    colleges &&
    colleges.filter(
      (college: CollegeData) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Handler functions
  const handleSchoolClick = (college: CollegeData) => {
    setSelectedCollege(college);
    setShowConfirmModal(true);
  };

  const handleConfirmLinking = async () => {
    if (selectedCollege) {
      try {
        setIsLoadingLinking(true);
        setLinkingError(null);
        const { data, error } = await linkCollege(
          userId,
          selectedCollege.id.toString()
        );

        if (error) {
          setLinkingError(error);
        } else if (data?.success) {
          // Dispatch custom event to notify other components
          window.dispatchEvent(
            new CustomEvent("collegeLinkSuccess", {
              detail: selectedCollege,
            })
          );

          setShowConfirmModal(false);
          setSelectedCollege(null);
          onClose();
        } else {
          setLinkingError("Linking successful but no college data returned");
        }
      } catch (err) {
        console.error("Error linking college:", err);
        setLinkingError("Failed to link college");
      } finally {
        setIsLoadingLinking(false);
      }
    }
  };

  const handleCancelLinking = () => {
    setShowConfirmModal(false);
    setSelectedCollege(null);
  };

  // Don't render if not mounted, not open, or user not fully authenticated
  if (!mounted || !isOpen || !isFullyAuthenticated) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl h-[90vh] m-4 bg-gradient-to-br from-[#0A1B1A] to-[#0F2A28] border border-[#15C0B9]/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6">
          <h1 className="text-2xl font-semibold text-white">
            Search and choose a school to support
          </h1>
          <button
            onClick={onClose}
            className="cursor-pointer flex justify-center items-center rounded-lg bg-white/10 hover:bg-white/20 p-2 w-10 h-10 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search section */}
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-white/80">
              {isLoadingColleges
                ? "Loading teams..."
                : `Showing ${filteredColleges.length} of ${colleges.length} teams from NCAA Division 1`}
            </h2>
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search your favorite school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#15C0B9] focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Schools grid */}
        <div className="flex-1 overflow-y-scroll p-6 scrollbar-custom max-h-[70vh]">
          {isLoadingColleges ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#15C0B9] mx-auto mb-4"></div>
                <p className="text-white/60">Loading schools...</p>
              </div>
            </div>
          ) : collegesError ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg mb-4">
                Failed to load schools
              </p>
              <p className="text-white/60 text-sm">{collegesError}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[800px]">
                {filteredColleges.map((college) => (
                  <div
                    key={college.id}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-[#15C0B9]/30 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleSchoolClick(college)}
                  >
                    <div className="flex items-center gap-4">
                      {/* College Avatar */}
                      <div className="flex-shrink-0">
                        {college.logo ? (
                          <Image
                            src={college.logo}
                            alt={`${college.name} logo`}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover bg-white/10"
                            onError={(e) => {
                              const target = e.currentTarget;
                              const fallback =
                                target.nextElementSibling as HTMLElement;
                              target.style.display = "none";
                              if (fallback) {
                                fallback.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#15C0B9]/20 to-[#15C0B9]/10 group-hover:from-[#15C0B9]/30 group-hover:to-[#15C0B9]/20 transition-all duration-300 ${
                            college.logo ? "hidden" : "flex"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#15C0B9]/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-[#15C0B9]">
                              {college.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* College Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-white mb-1 truncate group-hover:text-[#15C0B9] transition-colors duration-300">
                          {college.commonName || college.name}
                        </h4>
                        <p className="text-[#15C0B9] font-medium text-sm truncate">
                          {college.nickname} • {college.city}, {college.state}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredColleges.length === 0 &&
                !isLoadingColleges &&
                searchTerm && (
                  <div className="text-center py-12">
                    <p className="text-white/60 text-lg">
                      No schools found matching &quot;{searchTerm}&quot;
                    </p>
                  </div>
                )}

              {colleges.length === 0 &&
                !isLoadingColleges &&
                !collegesError && (
                  <div className="text-center py-12">
                    <p className="text-white/60 text-lg">
                      No schools available
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedCollege && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancelLinking}
          />

          {/* Confirmation Modal */}
          <div className="relative bg-gradient-to-br from-[#0A1B1A] to-[#0F2A28] border border-[#15C0B9]/20 rounded-xl shadow-2xl p-6 mx-4 max-w-md w-full">
            <div className="text-center">
              {/* College Info */}
              <div className="mb-4">
                {selectedCollege.logo ? (
                  <Image
                    src={selectedCollege.logo}
                    alt={`${selectedCollege.name} logo`}
                    className="w-16 h-16 rounded-full object-cover bg-white/10 mx-auto mb-3"
                    width={64}
                    height={64}
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = target.nextElementSibling as HTMLElement;
                      target.style.display = "none";
                      if (fallback) {
                        fallback.style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[#15C0B9]/20 to-[#15C0B9]/10 mx-auto mb-3 ${
                    selectedCollege.logo ? "hidden" : "flex"
                  }`}
                >
                  <span className="text-2xl font-bold text-[#15C0B9]">
                    {selectedCollege.name.charAt(0)}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  {selectedCollege.commonName || selectedCollege.name}
                </h3>
                <p className="text-[#15C0B9] text-sm">
                  {selectedCollege.nickname} • {selectedCollege.city},{" "}
                  {selectedCollege.state}
                </p>
              </div>

              {/* Confirmation Text */}
              <p className="text-white/80 mb-6">
                Confirm linking your profile to{" "}
                <span className="text-[#15C0B9] font-semibold">
                  {selectedCollege.nickname}
                </span>
                ?
              </p>

              {/* Error Message */}
              {linkingError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{linkingError}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelLinking}
                  className="cursor-pointer flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLinking}
                  disabled={isLoadingLinking}
                  className="cursor-pointer flex-1 px-4 py-3 bg-[#15C0B9] hover:bg-[#15C0B9]/90 disabled:bg-[#15C0B9]/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoadingLinking && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isLoadingLinking ? "Linking..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Use portal to render outside the normal DOM hierarchy
  return createPortal(modalContent, document.body);
};

export default SelectSchoolModal;
